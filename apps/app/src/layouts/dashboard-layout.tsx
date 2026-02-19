import { Outlet } from "react-router";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 bg-muted">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
