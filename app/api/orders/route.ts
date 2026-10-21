import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validation";
import { products } from "@/lib/products";
import { calculateTotals, makeOrderNumber } from "@/lib/checkout";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fallbackResponse, isNetworkError } from "@/lib/network";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(`orders:${clientIp(request)}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla sipariş denemesi. Lütfen bir dakika sonra deneyin." },
      { status: 429 },
    );
  }

  try {
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Sipariş bilgileri eksik veya geçersiz.",
        },
        { status: 400 },
      );
    }

    const { items, customer, coupon } = parsed.data;

    const lines = items.map((line) => {
      const product = products.find((item) => item.slug === line.slug);
      if (!product) {
        throw new Error(`Ürün bulunamadı: ${line.slug}`);
      }
      return {
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        qty: line.qty,
        lineTotal: Math.round(product.price * line.qty * 100) / 100,
      };
    });

    const subtotal = Math.round(
      lines.reduce((total, line) => total + line.lineTotal, 0) * 100,
    ) / 100;
    const totals = calculateTotals(subtotal, coupon);
    const orderNumber = makeOrderNumber();

    const supabase = getSupabaseAdmin();
    let persistence: "supabase" | "demo" = "demo";

    if (supabase) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          district: customer.district,
          address: customer.address,
          note: customer.note || null,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          total: totals.total,
          coupon: totals.coupon,
          status: "new",
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("[orders] order insert failed:", orderError?.message);
        if (orderError && isNetworkError(orderError)) {
          return NextResponse.json(
            fallbackResponse("Sunucu Supabase'e ulaşamadı."),
            { status: 503 },
          );
        }
      } else {
        const { error: itemsError } = await supabase.from("order_items").insert(
          lines.map((line) => ({
            order_id: order.id,
            product_slug: line.slug,
            product_name: line.name,
            unit_price: line.unitPrice,
            quantity: line.qty,
            line_total: line.lineTotal,
          })),
        );

        if (itemsError) {
          console.error("[orders] items insert failed:", itemsError.message);
        } else {
          persistence = "supabase";
        }
      }
    } else {
      return NextResponse.json(
        fallbackResponse("Sunucu tarafı Supabase yapılandırılmadı."),
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderNumber,
      total: totals.total,
      persistence,
      estimatedDelivery: "1–3 iş günü",
    });
  } catch (error) {
    console.error("[orders] unexpected error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
      },
      { status: 400 },
    );
  }
}
