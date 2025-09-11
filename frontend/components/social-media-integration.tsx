"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Settings,
  CheckCircle,
  Calendar,
  Clock,
  Send,
  Plus,
} from "lucide-react"

interface SocialAccount {
  platform: string
  username: string
  connected: boolean
  autoPost: boolean
  icon: React.ReactNode
  color: string
}

interface ScheduledPost {
  id: string
  platform: string
  content: string
  scheduledTime: string
  status: "scheduled" | "published" | "failed"
  adId?: number
}

export function SocialMediaIntegration() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      platform: "Facebook",
      username: "@mybusiness",
      connected: true,
      autoPost: true,
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-blue-600",
    },
    {
      platform: "Instagram",
      username: "@mybusiness_ig",
      connected: true,
      autoPost: false,
      icon: <Instagram className="w-5 h-5" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      platform: "LinkedIn",
      username: "My Business LLC",
      connected: false,
      autoPost: false,
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-blue-700",
    },
    {
      platform: "Twitter",
      username: "@mybusiness_x",
      connected: false,
      autoPost: false,
      icon: <Twitter className="w-5 h-5" />,
      color: "bg-black",
    },
  ])

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      platform: "Facebook",
      content: "Transform Your Business Today - Join thousands who've discovered our solution...",
      scheduledTime: "2024-01-15 14:00",
      status: "scheduled",
      adId: 1,
    },
    {
      id: "2",
      platform: "Instagram",
      content: "Finally, A Solution That Understands You - We know how challenging it can be...",
      scheduledTime: "2024-01-15 16:30",
      status: "published",
      adId: 2,
    },
  ])

  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const toggleAutoPost = (platform: string) => {
    setSocialAccounts((accounts) =>
      accounts.map((account) =>
        account.platform === platform ? { ...account, autoPost: !account.autoPost } : account,
      ),
    )
  }

  const connectAccount = (platform: string) => {
    setSelectedPlatform(platform)
    setShowConnectDialog(true)
  }

  const handleConnect = () => {
    setSocialAccounts((accounts) =>
      accounts.map((account) => (account.platform === selectedPlatform ? { ...account, connected: true } : account)),
    )
    setShowConnectDialog(false)
  }

  const schedulePost = (content: string, platform: string, scheduledTime: string) => {
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      platform,
      content,
      scheduledTime,
      status: "scheduled",
    }
    setScheduledPosts((posts) => [...posts, newPost])
    setShowScheduleDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Social Media Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {socialAccounts.map((account) => (
              <div key={account.platform} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${account.color}`}>{account.icon}</div>
                  <div>
                    <h3 className="font-medium">{account.platform}</h3>
                    <p className="text-sm text-gray-600">{account.connected ? account.username : "Not connected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {account.connected ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`auto-${account.platform}`} className="text-sm">
                          Auto-post
                        </Label>
                        <Switch
                          id={`auto-${account.platform}`}
                          checked={account.autoPost}
                          onCheckedChange={() => toggleAutoPost(account.platform)}
                        />
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => connectAccount(account.platform)}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduled Posts
            </CardTitle>
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Post</DialogTitle>
                </DialogHeader>
                <SchedulePostForm onSchedule={schedulePost} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {socialAccounts.find((acc) => acc.platform === post.platform)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{post.platform}</span>
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "scheduled"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduledTime).toLocaleString()}
                    </span>
                    {post.adId && <span>Ad Campaign #{post.adId}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  {post.status === "scheduled" && (
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connect Account Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You'll be redirected to {selectedPlatform} to authorize the connection.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex-1">
                Connect Account
              </Button>
              <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SchedulePostForm({ onSchedule }: { onSchedule: (content: string, platform: string, time: string) => void }) {
  const [content, setContent] = useState("")
  const [platform, setPlatform] = useState("Facebook")
  const [scheduledTime, setScheduledTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content && platform && scheduledTime) {
      onSchedule(content, platform, scheduledTime)
      setContent("")
      setScheduledTime("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="platform">Platform</Label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter</option>
        </select>
      </div>

      <div>
        <Label htmlFor="content">Post Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="time">Schedule Time</Label>
        <Input
          id="time"
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Schedule Post
      </Button>
    </form>
  )
}
