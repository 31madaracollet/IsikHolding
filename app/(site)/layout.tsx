import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAdminSession } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const admin = session ? { name: session.name, email: session.email } : null;

  return (
    <CartProvider>
      <SiteHeader admin={admin} />
      <main id="main">{children}</main>
      <SiteFooter admin={admin} />
    </CartProvider>
  );
}
