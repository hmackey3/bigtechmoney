/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  CreditCardIcon,
  ExternalLinkIcon,
  LockIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [loadingProtected, setLoadingProtected] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [protectedContents, setProtectedContents] = useState([]);
  const [fetchingProtectedContent, setFetchingProtectedContent] =
    useState(false);

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data || "");
        setMembershipStatus(data?.membership_status);
      }
    };

    fetchProfile();
  }, []);

  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    setLoadingUpgrade(true);
    navigate("/subscription");
    setLoadingUpgrade(false);
  };

  const fetchProtectedContent = async () => {
    try {
      setFetchingProtectedContent(true);
      const { data, error } = await supabase
        .from("protected_contents")
        .select("*");

      if (error) throw error;
      setProtectedContents(data || []);
    } catch (error) {
      console.error("Error fetching protected content:", error);
    } finally {
      setFetchingProtectedContent(false);
    }
  };

  const handleProtectedClick = async () => {
    setLoadingProtected(true);
    await fetchProtectedContent();
    setModalOpen(true);
    setLoadingProtected(false);
  };

  const truncateUrl = (url) => {
    if (!url) return "";
    const maxLength = 35;
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  const handleSupportClick = () => {
    setLoadingSupport(true);
    // Simulate support contact
    setTimeout(() => {
      setLoadingSupport(false);
    }, 1000);
  };

  if ((!loading && !subscription) || subscription?.status !== "active") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to access this content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/subscription">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Dashboard"
        description="Overview of upcoming events and statistics"
      />

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1">{profile?.name || "Not set"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{user?.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="mt-1 capitalize">{profile?.role}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Membership Status
            </h3>
            <p className="mt-1 capitalize">
              {subscription ? "Active" : "Inactive"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Membership Status
              </CardTitle>
              <CardDescription>Your current membership level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    subscription.status === "active"
                      ? "bg-green-500"
                      : membershipStatus === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium">
                  {subscription.status === "active"
                    ? "Active"
                    : membershipStatus === "pending"
                    ? "Pending Approval"
                    : "Inactive"}
                </span>
              </div>
              {membershipStatus !== "active" && (
                <div className="mt-4">
                  <Button
                    size="sm"
                    asChild
                    disabled={loadingUpgrade}
                    onClick={handleUpgradeClick}
                  >
                    <Link to="/upgrade">
                      {loadingUpgrade ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Upgrading...
                        </span>
                      ) : (
                        <>
                          <CreditCardIcon className="mr-2 h-4 w-4" />
                          Upgrade Membership
                        </>
                      )}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Protected Content
              </CardTitle>
              <CardDescription>Access premium GPT content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                {membershipStatus === "active"
                  ? "You have full access to all protected content."
                  : "Upgrade your membership to access premium content."}
              </p>
              <Button
                size="sm"
                disabled={loadingProtected}
                onClick={handleProtectedClick}
              >
                {loadingProtected ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>
                    <LockIcon className="mr-2 h-4 w-4" />
                    View Protected Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Security</CardTitle>
              <CardDescription>Account security information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ShieldIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span>Session protection active</span>
                </li>
                <li className="flex items-center">
                  <ShieldIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span>IP protection enabled</span>
                </li>
                <li className="text-xs text-gray-500 mt-2">
                  Last login: Today at {new Date().toLocaleTimeString()}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to BigTechMoney</CardTitle>
            <CardDescription>
              Your gateway to premium content and exclusive features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This is your dashboard where you can manage your membership,
                access protected content, and view your account security status.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleSupportClick}
                  disabled={loadingSupport}
                >
                  {loadingSupport ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Contacting support...
                    </span>
                  ) : (
                    <>
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Contact Support
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protected Content Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Protected Content</DialogTitle>
            <DialogDescription>
              Access your premium content with the links below
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {fetchingProtectedContent ? (
              <div className="flex justify-center items-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : protectedContents.length === 0 ? (
              <p className="text-center text-gray-500">
                No protected content available
              </p>
            ) : (
              <ul className="space-y-3">
                {protectedContents.map((content) => (
                  <li
                    key={content.id}
                    className="flex items-center justify-between px-1 py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{content.name}</p>
                      <p className="text-xs text-gray-500">
                        {truncateUrl(content.url)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(content.url, "_blank")}
                      className="ml-2"
                    >
                      <ExternalLinkIcon className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
