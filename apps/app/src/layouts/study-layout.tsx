import { Outlet } from "react-router";

export function StudyLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
