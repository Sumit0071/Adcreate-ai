"use client"

import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage users, businesses, and moderate content across the platform.</p>
          </div>

          <AdminPanel />
        </div>
      </div>
    </div>
  )
}
