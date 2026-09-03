import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function DashboardLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div dir="rtl" className="min-h-screen flex flex-col md:flex-row bg-[#08060a] text-[#f2eef7]">
      <AdminSidebar admin={admin} />
      <main className="flex-1 p-5 md:p-10 max-w-5xl w-full mx-auto">{children}</main>
    </div>
  );
}
