import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar.jsx";

export default function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen text-stone-100">
      <div className="magic-particles" aria-hidden="true" />
      <AdminNavbar />
      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
