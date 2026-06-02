import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { PageTransition } from "@/components/PageTransition";
import { getSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth-context";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin — EcoSwap",
  description: "Panel administrasi EcoSwap",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/masuk?redirect=/admin");
  }

  const user: AuthUser = {
    name: session.name,
    email: session.email,
    role: session.role,
    initial: session.name.charAt(0).toUpperCase(),
  };

  return (
    <AuthProvider user={user}>
      <div className="min-h-screen bg-ivory">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-col pt-16 lg:ml-64 lg:pt-0">
          <PageTransition className="flex min-h-screen min-w-0 flex-1 flex-col">
            {children}
          </PageTransition>
        </div>
      </div>
    </AuthProvider>
  );
}
