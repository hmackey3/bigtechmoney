import { Link, useLocation } from "react-router-dom";
import { BarChart, Users, Bell, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "./user-menu";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10 w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 hidden md:flex items-center justify-between h-16">
        <div className="flex items-center">
          <nav className="flex items-center space-x-2">
            <NavItem
              icon={<BarChart className="h-4 w-4" />}
              label="Dashboard"
              to="/dashboard"
              active={isActive("/dashboard")}
            />
            <NavItem
              icon={<CreditCard className="mr-2 h-4 w-4" />}
              label="Subscription"
              to="/subscription"
              active={isActive("/subscription")}
            />
            {/* <NavItem 
              icon={<Bell className="h-4 w-4" />}
              label="Notifications"
              to="/notifications"
              active={isActive("/notifications")}
            /> */}
          </nav>
        </div>

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden flex justify-between pr-4 border-t">
        <div className="grid grid-cols-3 w-full">
          <MobileNavItem
            icon={<BarChart className="h-5 w-5" />}
            label="Dashboard"
            to="/dashboard"
            active={isActive("/dashboard")}
          />
          <MobileNavItem
            icon={<CreditCard className="mr-2 h-4 w-4" />}
            label="Subscription"
            to="/subscription"
            active={isActive("/subscription")}
          />
        </div>
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const NavItem = ({ icon, label, to, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
      active
        ? "text-blue-500 bg-blue-50"
        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50/60"
    )}
  >
    <span className="mr-2">{icon}</span>
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ icon, label, to, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center py-2 text-xs transition-colors",
      active ? "text-blue-500 bg-blue-50" : "text-gray-600 hover:text-blue-500"
    )}
  >
    <span className="mb-1">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Navbar;
