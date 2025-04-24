
import { Outlet } from "react-router-dom";
import Navbar from "../navigation/navbar";
import { useSidebar } from "../providers/sidebar-provider";

const MainLayout = () => {
  const { isOpen } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-hidden">
      <Navbar />
      <main className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto w-full animate-fade-in`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
