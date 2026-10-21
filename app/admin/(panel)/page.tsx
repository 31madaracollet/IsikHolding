import { AdminDashboard } from "@/components/admin/dashboard";
import { StaticAdminPanel } from "@/components/admin/static-admin-panel";
import { getAdminData } from "@/lib/admin/data";
import { getAdminSession } from "@/lib/auth";
import { STATIC_EXPORT } from "@/lib/mode";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (STATIC_EXPORT) {
    return <StaticAdminPanel />;
  }

  const [data, session] = await Promise.all([getAdminData(), getAdminSession()]);

  return (
    <AdminDashboard
      data={data}
      adminName={session?.name ?? "Yönetici"}
    />
  );
}
