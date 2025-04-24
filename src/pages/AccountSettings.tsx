
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import ProfileSettings from "@/components/account/ProfileSettings";
import ExportSettings from "@/components/account/ExportSettings";
import { Tab } from "@/components/ui/pricing-tab";

const AccountSettings = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (section === "export") {
      setActiveTab("export");
    } else {
      setActiveTab("profile");
    }
  }, [section]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "export") {
      navigate("/account-settings/export");
    } else {
      navigate("/account-settings");
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Account Settings"
        description="Manage your profile and export preferences"
      />
      
      <div className="mb-8 flex items-center justify-start bg-muted/50 p-1 rounded-lg">
        <Tab 
          text="Profile" 
          selected={activeTab === "profile"} 
          setSelected={() => handleTabChange("profile")} 
        />
        <Tab 
          text="Export Settings" 
          selected={activeTab === "export"} 
          setSelected={() => handleTabChange("export")} 
        />
      </div>
      
      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "export" && <ExportSettings />}
    </div>
  );
};

export default AccountSettings;
