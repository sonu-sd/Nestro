"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProfileSidebar from "./ProfileSidebar";
import MyOrders from "./MyOrders";
import PersonalInfo from "./PersonalInfo";
import Addresses from "./Addresses";
import Settings from "./Settings";
import SignOut from "./SignOut";
import ProfileLoading from "./ProfileLoading";
import { client } from "@/utils/helper";

export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("orders");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await client.get("/user/get-me");
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        if ([401, 404].includes(error.response?.status)) {
          router.replace("/sign_in?next=/profile");
          return;
        }
        console.error("Get user error:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (loading) {
    return <ProfileLoading />;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f3]">
        <p className="text-gray-500">User not found</p>
      </main>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <MyOrders />;

      case "personal":
        return <PersonalInfo user={user} onUserUpdated={setUser} />;

      case "addresses":
        return <Addresses />;

      case "settings":
        return <Settings />;

      case "logout":
        return <SignOut />;

      default:
        return <MyOrders />;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f3] px-4 pb-10 pt-8 sm:px-5 sm:pt-10 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          {/* LEFT SIDEBAR */}
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* RIGHT CONTENT */}
          <div className="min-w-0">{renderSection()}</div>
        </div>
      </div>
    </main>
  );
}
