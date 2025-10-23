import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from "./providers";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MqttProvider } from '@/context/MqttContext';
import AlertNotif from '@/components/mqtt/AlertListener';
import { Toaster } from "sonner";
import { AuthModalProvider } from "@/context/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-gray-900`} >
        <AuthModalProvider>
          <MqttProvider>
            <ThemeProvider>
              <SidebarProvider>
                <Providers>
                  {children}
                  <AuthModal />
                </Providers>
                <Toaster position="top-right" richColors />
              </SidebarProvider>
              <AlertNotif />
            </ThemeProvider>
          </MqttProvider>
         {/* ✅ Pastikan modal selalu ter-render di level global */}
        </AuthModalProvider>      </body>
    </html>
  );
}
