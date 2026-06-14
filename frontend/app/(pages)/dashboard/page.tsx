"use client"

import { useEffect, useState } from "react"
import { UserDashboard } from "@/components/user-dashboard"
import { Sidebar } from "@/components/ui/sidebar"
import { Loader2, Smile } from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Get user info from localStorage or API
    const fetchUserInfo = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          setUserName(user.username || user.name || "User")
        }
        // Simulate loading time for greeting animation
        await new Promise(resolve => setTimeout(resolve, 1500))
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Smiley Face Animation */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <Smile className="w-12 h-12 text-yellow-700" />
            </div>
          </div>

          {/* Greeting Text */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hi {userName}! 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
              What do you want to create today?
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Setting up your dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with User Greeting */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center text-2xl">
                <Smile className="w-7 h-7 text-yellow-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Hi {userName}! 👋</h1>
                <p className="text-indigo-100 text-lg">What do you want to create today?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <UserDashboard />
        </div>
      </div>
    </div>
  )
}
