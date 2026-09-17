"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { client } from "@/utils/helper";
import { useAdmin } from "@/components/admin/AdminGate";
import { toast } from "sonner";

export default function AdminHeader() {
  const user = useAdmin();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try { await client.post("/user/logout"); router.replace("/sign_in"); router.refresh(); }
    catch { toast.error("Unable to sign out. Please try again."); setLoggingOut(false); }
  }

  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6"><div><Link href="/admin" className="text-base font-bold text-slate-900">Nestro Admin</Link><p className="text-xs text-slate-500">Store operations</p></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-900">{user?.name || "Administrator"}</p><p className="text-xs capitalize text-slate-500">{user?.role}</p></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase() || "A"}</span><button type="button" disabled={loggingOut} onClick={() => void logout()} aria-label="Sign out" title="Sign out" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"><LogOut size={17}/></button></div></div></header>;
}
