"use client";

import { useState } from "react";
import {
  FiSettings,
  FiBell,
  FiLock,
  FiMail,
} from "react-icons/fi";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
            <FiSettings size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#222]">
              Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-[#e8e1d9] bg-white">
        <div className="border-b border-[#eee8e2] p-5">
          <div className="flex items-center gap-3">
            <FiBell className="text-[#996b3f]" />

            <div>
              <h3 className="font-semibold text-[#222]">
                Notifications
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Choose what notifications you receive
              </p>
            </div>
          </div>
        </div>

        <SettingRow
          icon={<FiMail />}
          title="Email Notifications"
          description="Receive important account notifications"
          enabled={settings.emailNotifications}
          onClick={() => toggleSetting("emailNotifications")}
        />

        <SettingRow
          icon={<FiBell />}
          title="Order Updates"
          description="Get updates about your orders"
          enabled={settings.orderUpdates}
          onClick={() => toggleSetting("orderUpdates")}
        />

        <SettingRow
          icon={<FiMail />}
          title="Marketing Emails"
          description="Receive offers and promotional emails"
          enabled={settings.marketingEmails}
          onClick={() => toggleSetting("marketingEmails")}
        />
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-5">
        <div className="flex items-center gap-3">
          <FiLock className="text-[#996b3f]" />

          <div>
            <h3 className="font-semibold text-[#222]">
              Security
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Keep your account secure
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 rounded-lg border border-[#ded6ce] px-4 py-2.5 text-sm hover:bg-[#faf7f4]"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eee8e2] p-5 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>

        <div>
          <h4 className="text-sm font-medium text-[#333]">
            {title}
          </h4>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-[#996b3f]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}