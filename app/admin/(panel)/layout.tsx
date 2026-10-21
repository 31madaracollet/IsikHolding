import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { StaticAdminShell } from "@/components/admin/static-admin-shell";
import { getAdminSession } from "@/lib/auth";
import { STATIC_EXPORT } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Yönetim paneli",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Statik dağıtımda middleware/çerez yok: oturum tarayıcıda doğrulanır.
  if (STATIC_EXPORT) {
    return <StaticAdminShell>{children}</StaticAdminShell>;
  }

  const session = await getAdminSession();
  if (!session) redirect("/admin/giris");

  return <AdminShell name={session.name}>{children}</AdminShell>;
}
