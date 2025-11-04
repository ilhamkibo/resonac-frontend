import type { Metadata } from "next";
import ThresholdsCard from '@/components/admin/ThresholdsCard'
import UsersCard from '@/components/admin/UsersCard'
import React from 'react'

export const metadata: Metadata = {
  title: "Admin Page | Resonac Utility Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function page() {
  return (
    <div>
      <div className='flex flex-col gap-4 max-w-5xl mx-auto'>
        <UsersCard />
        <ThresholdsCard />
      </div>
    </div>
  )
}
