import { Outlet } from "react-router-dom";
import AppFooter from "../components/layout/AppFooter.jsx";
import Navbar from "../components/layout/Navbar.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell min-h-screen text-slate-100">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
