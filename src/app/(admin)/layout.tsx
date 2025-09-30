"use client";

import { useSidebar } from "@/context/SidebarContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
import Navbar from "@/layout/Navbar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
     
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out bg-gray-800`}
        // className={`flex-1 transition-all  duration-300 ease-in-out bg-[#ddf1f5]`}
      >
        {/* Header */}
        <Navbar />
        {/* Page Content */}
        <WebSocketProvider>  
          <div className="p-4 mx-auto mt-18 md:mt-0 md:p-6 ">
            {children}
          </div>
        </WebSocketProvider>
        {/* <div className="p-4 mx-auto max-w-(--breakpoint-2xl) mt-18 md:mt-0 md:p-6 ">{children}</div> */}
      </div>
    </div>
  );
}
