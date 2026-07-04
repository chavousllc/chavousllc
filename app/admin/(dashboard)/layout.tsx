import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <SessionProviderWrapper>
      <div className="flex min-h-screen bg-ink-50/60">
        <AdminSidebar adminName={session.user?.email ?? "Admin"} />
        <div className="flex-1 overflow-x-hidden">
          <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">{children}</main>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
