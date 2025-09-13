"use client"

import { SalesProfileTracking } from "@/components/sales-profile-tracking"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <SalesProfileTracking />
        </div>
      </div>
    </div>
  )
}
