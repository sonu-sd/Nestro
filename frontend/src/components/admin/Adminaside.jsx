'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Gauge,
  ChevronLeft,
  LayoutDashboard,
  ChartColumnStacked,
  ShoppingCart,
  BedDouble,
  Palette,
} from 'lucide-react'

export default function Adminaside() {
  const [toggle, settoggle] = useState(false)
  const pathname = usePathname()

  const navs = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Category",
      path: "/admin/category",
      icon: ChartColumnStacked,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: ShoppingCart,
    },
    {
      name: "Rooms",
      path: "/admin/room-type",
      icon: BedDouble,
    },
    {
      name: "Colors",
      path: "/admin/colors",
      icon: Palette,
    },
  ]

  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-50 h-20 w-full bg-[#0d1b2a] transition-all duration-300 md:sticky md:top-0 md:h-screen ${toggle ? "md:w-19" : "md:w-64"
        }`}
    >
      {/* Header */}
      <div className="hidden justify-between border-b border-white/5 p-3 md:flex">
        <div className="flex gap-3">
          <span
            onClick={() => settoggle(!toggle)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center cursor-pointer"
          >
            <Gauge className="text-white" />
          </span>

          {
            !toggle && (
              <div>
                <div className="text-sm font-bold text-white">
                  AdminPanel
                </div>
                <div className="text-[10px] text-teal-400">
                  Pro Dashboard
                </div>
              </div>
            )
          }
        </div>

        {
          !toggle && (
            <button onClick={() => settoggle(!toggle)}>
              <ChevronLeft className="text-white cursor-pointer hover:bg-slate-800 rounded-l" />
            </button>
          )
        }
      </div>

      {/* Menu */}
      <div className="h-full md:mt-5 md:h-auto">
        {
          !toggle && (
            <div className="px-4 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Main Menu
            </div>
          )
        }

        <div className="flex h-full items-stretch overflow-x-auto px-1 md:block md:h-auto md:space-y-2 md:px-2">
          {navs.map((item) => {
            const Icon = item.icon
            const active = pathname === item.path

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex min-w-[72px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-3 md:py-4
                ${active
                    ? "group bg-gradient-to-r from-teal-500/20 to-teal-600/10 text-teal-400 border border-teal-500/20"

                    : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent "
                  }`} >

                {
                  active && (
                    <span className='absolute left-0 top-1/2 h-6 w-1 bg-teal-400 rounded-r -translate-y-1/2 '></span>
                  )
                }
                <Icon size={20} />

                <span className={`${toggle ? "md:hidden" : ""} text-[10px] font-medium md:text-sm`}>
                    {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
