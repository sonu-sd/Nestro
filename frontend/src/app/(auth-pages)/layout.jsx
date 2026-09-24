import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { Toaster } from "sonner";
import Storeprovider from "@/redux/Storeprovider";

const geistSans = Geist({
  variable: "--font-geist-san",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Account | Nestro",
  description:
    "Sign in or create your Nestro account to manage carts, orders and delivery details.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Storeprovider>
          <div className=" w-full flex bg-white">
            <Toaster position="top-center" richColors />
            <div className="flex-1 ">{children}</div>
          </div>
        </Storeprovider>
      </body>
    </html>
  );
}
