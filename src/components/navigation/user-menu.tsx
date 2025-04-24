import { useState, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  Building,
  CreditCard,
  HelpCircle,
  NotebookIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/integrations/supabase/client";

const UserMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const fetchProfileName = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile name:", error);
          return;
        }

        if (data && data.name) {
          setProfileName(data.name);
        }
      } catch (error) {
        console.error("Error in fetchProfileName:", error);
      }
    };

    fetchProfileName();
  }, [user]);

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await signOut();
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
    }
  };

  const getDisplayName = () => {
    if (profileName) return profileName;
    if (!user) return "";

    const metaName = user.user_metadata?.full_name;
    if (metaName) return metaName;
    return user.email?.split("@")[0] || "";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user ? (
                getDisplayName().charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 animate-scale-in">
        {user ? (
          <>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{getDisplayName()}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleNavigation("/account-settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => navigate("/auth")}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
