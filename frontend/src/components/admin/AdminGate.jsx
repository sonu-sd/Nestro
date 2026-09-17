"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { client } from "@/utils/helper";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

export default function AdminGate({ children }) {
  const pathname = usePathname();
  return <VerifiedAdminGate key={pathname}>{children}</VerifiedAdminGate>;
}

function VerifiedAdminGate({ children }) {
  const [state, setState] = useState({ loading: true, user: null, error: "" });

  useEffect(() => {
    let active = true;
    client.get("/user/get-me")
      .then(({ data }) => {
        if (!active) return;
        const user = data.user;
        setState({ loading: false, user: ["admin", "superAdmin"].includes(user?.role) ? user : null, error: user && !["admin", "superAdmin"].includes(user.role) ? "This account does not have admin access." : "" });
      })
      .catch((error) => {
        if (active) setState({ loading: false, user: null, error: error.response?.status === 401 ? "Sign in with an admin account to continue." : "Unable to verify your admin session. Please try again." });
      });
    return () => { active = false; };
  }, []);

  if (state.loading) return <AdminSkeleton variant="dashboard"/>;
  if (!state.user) return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Admin access required</h1><p className="mt-3 text-sm text-slate-600">{state.error}</p><div className="mt-6 flex justify-center gap-3"><Link className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white" href="/sign_in">Sign in</Link><Link className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700" href="/">Back to store</Link></div></div></main>;
  return <AdminContext.Provider value={state.user}>{children}</AdminContext.Provider>;
}
