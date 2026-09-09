"use client";

import React from "react";
import {
  FiBox,
  FiUser,
  FiMapPin,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
}) {
  return (
    <aside className="space-y-5">

      {/* USER CARD */}
      <div className="rounded-2xl border border-[#e8e1d9] bg-white px-5 py-7 text-center">

        {/* Avatar */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eee9e2]">
          <span className="text-2xl font-medium text-[#996b3f]">
            {user.name
              ?.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Name */}
        <h2 className="mt-4 text-[17px] font-medium text-[#171717]">
          {user.name}
        </h2>

        {/* Email */}
        <p className="mt-1 text-[12px] text-gray-500">
        {user.email}
        </p>

        {/* Membership */}
        <div className="mx-auto mt-4 w-fit rounded-full bg-[#f3e9de] px-4 py-1.5">
          <span className="text-[11px] tracking-wide text-[#9a6739]">
            Gold Member
          </span>
        </div>

      </div>

      {/* MENU */}
      <div className="grid grid-cols-2 rounded-2xl border border-[#e8e1d9] bg-white p-3 sm:grid-cols-5 lg:block">

        <ProfileMenuItem
          icon={<FiBox />}
          title="My Orders"
          active={activeSection === "orders"}
          onClick={() => setActiveSection("orders")}
        />

        <ProfileMenuItem
          icon={<FiUser />}
          title="Personal Info"
          active={activeSection === "personal"}
          onClick={() => setActiveSection("personal")}
        />

        <ProfileMenuItem
          icon={<FiMapPin />}
          title="Addresses"
          active={activeSection === "addresses"}
          onClick={() => setActiveSection("addresses")}
        />

        <ProfileMenuItem
          icon={<FiSettings />}
          title="Settings"
          active={activeSection === "settings"}
          onClick={() => setActiveSection("settings")}
        />

        <ProfileMenuItem
          icon={<FiLogOut />}
          title="Sign Out"
          active={activeSection === "logout"}
          onClick={() => setActiveSection("logout")}
        />

      </div>

    </aside>
  );
}


function ProfileMenuItem({
  icon,
  title,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-center transition sm:gap-3 lg:justify-start lg:px-4 lg:py-3.5 lg:text-left ${active
          ? "bg-[#f4eadf] text-[#996b3f]"
          : "text-[#222] hover:bg-[#faf7f4]"
        }`}
    >
      <span className="text-[18px]">
        {icon}
      </span>

      <span className="text-[12px] sm:text-[13px] lg:text-[14px]">
        {title}
      </span>
    </button>
  );
}
