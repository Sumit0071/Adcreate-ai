"use client"

import { SocialMediaIntegration } from "@/components/social-media-integration"

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Integration</h1>
            <p className="text-gray-600">
              Connect your social media accounts and manage automated posting for your ad campaigns.
            </p>
          </div>

          <SocialMediaIntegration />
        </div>
      </div>
    </div>
  )
}
