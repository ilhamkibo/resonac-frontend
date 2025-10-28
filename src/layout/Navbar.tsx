"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react"; // 👈 tambahkan ini
import { usePathname } from "next/navigation";
import { useAuth } from '@/hooks/useAuth'; // ✅ Impor hook
import SignOutButton from '@/components/auth/SignOutButton'; // ✅ 1. Impor komponen baru
import { useAuthModal } from "@/context/AuthModalContext";

export default function Navbar() {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // 👈 state fullscreen
  const { user } = useAuth(); // ✅ Gunakan hook untuk mendapatkan data user
  const { openModal } = useAuthModal();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowNav(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 50) setShowNav(true);
      else if (e.clientY > 100) setShowNav(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <nav
      className={`bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 transform transition-transform duration-500 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } ${isMobile ? "mb-10" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/images/brand/resonac-clean.png"
            className="h-8"
            alt="Logo"
          />
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline dark:text-white text-gray-900">Welcome, {user.name}!</span>
            <SignOutButton />
          </div>
        ) : (
          <button
            onClick={() => openModal()} // <-- Bungkus dengan arrow function
            className="px-4 text-white dark:text-gray-300 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Sign In
          </button>
        )}

          <button
            onClick={toggleFullscreen}
            className="p-2 hidden md:block rounded-lg hover:bg-gray-200 text-gray-900 ml-3 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>


          <div className="hidden md:block ml-3">
            <ThemeToggleButton />
          </div>

          {/* 👇 tombol hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/"
                className={`block py-2 px-3 rounded-sm md:p-0 ${pathname === "/" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white"}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/input-manual"
                className={`block py-2 px-3 rounded-sm md:p-0 ${pathname === "/input-manual" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white"}`}
              >
                Input
              </a>
            </li>
            <li>
              <a
                href="/error-history"
                className={`block py-2 px-3 rounded-sm md:p-0 ${pathname === "/error-history" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white"}`}
              >
                Error
              </a>
            </li>
            {user &&(
              <>
                <li>
                  <a
                    href="/history"
                    className={`block py-2 px-3 rounded-sm md:p-0 ${pathname === "/history" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white"}`}
                  >
                    Logs
                  </a>
                </li>
                <li>
                  <a
                    href="/history"
                    className={`block py-2 px-3 rounded-sm md:p-0 ${pathname === "/history" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white"}`}
                  >
                    Admin
                  </a>
                </li>
              </>
            )}
            <li className="md:hidden ml-3  mt-2">
              <ThemeToggleButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
