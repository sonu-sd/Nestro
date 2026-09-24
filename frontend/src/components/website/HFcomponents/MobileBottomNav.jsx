"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiInfo,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

const items = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Shop", href: "/store", icon: FiSearch },
  { label: "About", href: "/about", icon: FiInfo },
  { label: "Cart", href: "/cart", icon: FiShoppingBag, cart: true },
  { label: "Account", href: "/profile", icon: FiUser },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const active = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e6ddd4] bg-[#fffdf9]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(55,39,28,0.08)] backdrop-blur lg:hidden"
      aria-label="Mobile quick navigation"
    >
      <div className="mx-auto grid h-16 max-w-3xl grid-cols-5">
        {items.map(({ label, href, icon: Icon, cart }) => (
          <Link
            key={href}
            href={href}
            className={`${active(href) ? "text-[#8b5e3c]" : "text-[#746b63]"} relative flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-medium`}
          >
            <span className="relative">
              <Icon size={19} />
              {cart && cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8b5e3c] px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
