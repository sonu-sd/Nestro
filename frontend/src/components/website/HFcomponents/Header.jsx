"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import {
  IoCloseOutline,
  IoMenuOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { PiHandbagSimpleBold } from "react-icons/pi";
import { FiShield } from "react-icons/fi";
import { client } from "@/utils/helper";
import ProductSearch from "./ProductSearch";

const navs = [
  { name: "Home", path: "/" },
  { name: "Store", path: "/store" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Checkout", path: "/checkout" },
];

export default function Header() {
  const cart = useSelector((store) => store.cart);
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    client
      .get("/user/get-me")
      .then((response) => {
        if (active) setUser(response.data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);
  const accountHref = user ? "/profile" : "/sign_in?next=/profile";
  const isAdmin = ["admin", "superAdmin"].includes(user?.role);

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b border-[#e8e1d9] bg-[#fafaf9]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1580px] items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.32em] text-[#1e1e1e] sm:text-base"
        >
          Nestro<span className="text-[#9C6A42]">.</span>
        </Link>

        <nav className="hidden lg:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-2 text-xs text-[#6b7280]">
            {navs.map((nav) => (
              <li key={nav.path}>
                <Link
                  href={nav.path}
                  className={`${isActive(nav.path) ? "bg-[#F0EBE3] font-bold text-[#8b5e3c]" : "hover:bg-[#F0EBE3] hover:text-[#8b5e3c]"} rounded-lg px-3 py-2 transition`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 text-[#5f6670] sm:gap-2">
          <Suspense
            fallback={
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#5f6670]"
                aria-hidden="true"
              >
                <IoSearchOutline />
              </span>
            }
          >
            <ProductSearch />
          </Suspense>
          <div className="hidden items-center gap-1 lg:flex">
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Open admin dashboard"
                className="flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[#8B5E3C] transition hover:bg-[#F0EBE3]"
              >
                <FiShield className="text-base" />
                Admin
              </Link>
            )}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-[#F0EBE3]"
            >
              <PiHandbagSimpleBold />
              {cart?.items?.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B5E3C] px-1 text-[9px] text-white">
                  {cart.items.length}
                </span>
              )}
            </Link>
            <Link
              href={accountHref}
              aria-label={user ? "Open profile" : "Sign in"}
              className="flex min-h-10 items-center gap-2 rounded-full px-2 text-[#8b5e3c] hover:bg-[#F0EBE3]"
            >
              <CgProfile className="text-2xl" />
              <span className="text-xs font-semibold">
                {user
                  ? user.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "Sign in"}
              </span>
            </Link>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl hover:bg-[#F0EBE3] lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-[#e8e1d9] bg-[#fffdf9] px-4 py-4 shadow-lg lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3">
            {navs.map((nav) => (
              <li key={nav.path}>
                <Link
                  href={nav.path}
                  onClick={() => setMenuOpen(false)}
                  className={`${isActive(nav.path) ? "bg-[#F0EBE3] font-bold text-[#8b5e3c]" : "text-[#51483f]"} block rounded-xl px-4 py-3 text-sm hover:bg-[#F0EBE3]`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={accountHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-[#51483f] hover:bg-[#F0EBE3]"
              >
                {user ? "My account" : "Sign in"}
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl bg-[#F4EADF] px-4 py-3 text-sm font-semibold text-[#8B5E3C] hover:bg-[#EADBCB]"
                >
                  <FiShield />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
