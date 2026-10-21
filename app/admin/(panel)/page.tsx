import { AdminDashboard } from "@/components/admin/dashboard";
import { getAdminData } from "@/lib/admin/data";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [data, session] = await Promise.all([getAdminData(), getAdminSession()]);

  return (
    <AdminDashboard
      data={data}
      adminName={session?.name ?? "Yönetici"}
    />
  );
}
