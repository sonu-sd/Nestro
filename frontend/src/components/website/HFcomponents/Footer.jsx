import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { BsFacebook } from "react-icons/bs";
export default function Footer() {
  return (
    <footer className="bg-[#1a1208] px-4 pb-4 pt-10 text-white sm:px-6 lg:px-8">
      
        <div className="mx-auto grid max-w-[1580px] grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* Left */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h2 className="text-xl font-semibold tracking-wider">
              Nestro<span className="text-[#C58A42]">.</span>
            </h2>

            <p className=" mt-3 text-[13px] text-[#ffffff61]">
              Curated furniture for thoughtful homes. Crafted with intention,
              made to endure.
            </p>

            <div className="mt-4 flex max-w-xl flex-col overflow-hidden rounded-md border border-[#3c2d22] sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40"/>

              <button className="bg-[#9C6A42] px-6 py-3 text-sm font-medium hover:bg-[#8b5e3c] transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[3px] text-[#C6A27E]">
              Company
            </h3>

            <ul className="mt-2 space-y-1 text-[12px] text-white/65">
              <li className="hover:text-[#C6A27E] cursor-pointer">Our Story</li>
              <li className="hover:text-[#C6A27E] cursor-pointer">
                Sustainability
              </li>
              <li className="hover:text-[#C6A27E] cursor-pointer">Showrooms</li>
              <li className="hover:text-[#C6A27E] cursor-pointer">Careers</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[3px] text-[#C6A27E]">
              Support
            </h3>

            <ul className="mt-2 space-y-1 text-[12px] text-white/65">
              <li className="hover:text-[#C6A27E] cursor-pointer">Track Order</li>
              <li className="hover:text-[#C6A27E] cursor-pointer">
                Returns & Exchange
              </li>
              <li className="hover:text-[#C6A27E] cursor-pointer">
                Assembly Help
              </li>
              <li className="hover:text-[#C6A27E] cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[3px] text-[#C6A27E]">
              Follow Us
            </h3>

            <ul className="mt-2 space-y-1 text-[12px] text-white/65">
              <li className="hover:text-[#C6A27E] cursor-pointer">Instagram</li>
              <li className="hover:text-[#C6A27E] cursor-pointer">Pinterest</li>
              <li className="hover:text-[#C6A27E] cursor-pointer">Houzz</li>
            </ul>

            <div className="flex gap-3 mt-8">
              <div className="h-10 w-10 rounded-full border border-[#4c3829] flex items-center justify-center hover:border-[#C58A42] hover:text-[#C58A42] transition cursor-pointer">
                <FaInstagram size={16} />
              </div>

              <div className="h-10 w-10 rounded-full border border-[#4c3829] flex items-center justify-center hover:border-[#C58A42] hover:text-[#C58A42] transition cursor-pointer">
                <BsFacebook size={16} />
              </div>

              <div className="h-10 w-10 rounded-full border border-[#4c3829] flex items-center justify-center hover:border-[#C58A42] hover:text-[#C58A42] transition cursor-pointer">
               <FiYoutube  size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mx-auto mt-8 flex max-w-[1580px] flex-col gap-3 border-t border-white/10 pt-4 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:text-[13px]">
          <p>© 2026 Nestro. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Sitemap</span>
          </div>
        </div>
    
    </footer>
  );
}
