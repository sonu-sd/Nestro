"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { PiHandbagSimpleBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { client } from "@/utils/helper";

export default function Header() {

  const cart = useSelector((store) => store.cart);
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navs = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Store",
      path: "/store",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
    {
      name: "Checkout",
      path: "/checkout",
    },
  ];
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await client.get("/user/get-me");

        setUser(response.data.user);
      } catch (error) {
        console.log("User not logged in");
        setUser(null);
      }
    };

    getUser();
  }, []);

  return (
    <header className="w-full bg-[#fafaf9f7] sticky top-0 left-0 z-50 border-b border-[#e8e1d9]">
      <div className="mx-auto flex min-h-16 w-full max-w-[1580px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

      <div className="uppercase tracking-widest text-[#1e1e1e] items-center">
        nestro.
      </div>

      <ul className="hidden lg:flex gap-3 text-[#6b7280] text-[12px]">
        {navs.map((nav) => {
          return (
            <li key={nav.path}>
              <Link
                href={nav.path}
                className={`${pathname === nav.path
                  ? "bg-[#F0EBE3] font-bold text-[#8b5e3c]"
                  : ""
                  } text-[#6b7280] py-1 px-3 rounded-l hover:text-[#8b5e3c] hover:bg-[#F0EBE3]`}
              >
                {nav.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-3 sm:gap-5 text-[#6b7280] text-xl items-center">

        <div>
          <IoIosSearch />
        </div>

        <Link href="/cart">
          <div className="relative">
            <PiHandbagSimpleBold />

            <span className="absolute -top-2 -right-2 bg-[#8B5E3C] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cart?.items?.length || 0}
            </span>
          </div>
        </Link>

        {/* Profile */}
        <Link href={"/profile"}>

          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer">
              <CgProfile className="text-[#8b5e3c] text-3xl" />

              <span className="hidden sm:inline text-sm font-semibold text-[#8b5e3c]">
                {user?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </span>

            </div>
          </div>
        </Link>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl hover:bg-[#F0EBE3] lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
      </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#e8e1d9] bg-[#fafaf9] px-4 py-3 lg:hidden">
          <ul className="mx-auto grid max-w-[1580px] grid-cols-2 gap-2 sm:grid-cols-3">
            {navs.map((nav) => (
              <li key={nav.path}>
                <Link
                  href={nav.path}
                  onClick={() => setMenuOpen(false)}
                  className={`${pathname === nav.path ? "bg-[#F0EBE3] font-bold text-[#8b5e3c]" : "text-[#6b7280]"} block rounded-lg px-4 py-3 text-center text-sm hover:bg-[#F0EBE3] hover:text-[#8b5e3c]`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
