import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from "./providers";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MqttProvider } from '@/context/MqttContext';

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
      <body className={`${outfit.className} dark:bg-gray-900`} >
        <ThemeProvider>
          <MqttProvider>
            <SidebarProvider>
              <Providers>{children}</Providers>
            </SidebarProvider>
          </MqttProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
