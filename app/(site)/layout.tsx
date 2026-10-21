import { SiteChrome } from "@/components/site-chrome";
import { getAdminSession } from "@/lib/auth";
import { STATIC_EXPORT } from "@/lib/mode";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Statik dağıtımda imzalı çerez yok; oturum tarayıcıda Supabase Auth'tan okunur.
  const session = STATIC_EXPORT ? null : await getAdminSession();
  const admin = session ? { name: session.name, email: session.email } : null;

  return <SiteChrome initialAdmin={admin}>{children}</SiteChrome>;
}
