"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Building2,
  FileImage,
  BarChart3,
  Search,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Crown,
  Shield,
  UserCheck,
  DollarSign,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "premium" | "admin"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  totalAds: number
  totalSpent: number
}

interface Business {
  id: string
  businessName: string
  ownerName: string
  ownerEmail: string
  niche: string
  status: "active" | "suspended"
  createdAt: string
  totalAds: number
  revenue: number
}

interface AdminAd {
  id: string
  title: string
  businessName: string
  ownerEmail: string
  status: "approved" | "pending" | "rejected"
  createdAt: string
  platforms: string[]
  flagged: boolean
  revenue: number
}

export function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)

  // Mock admin data
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@techstartup.com",
      role: "premium",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-15",
      totalAds: 12,
      totalSpent: 299.99,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@ecommerce.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "2024-01-14",
      totalAds: 5,
      totalSpent: 49.99,
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@saasplatform.com",
      role: "premium",
      status: "suspended",
      joinDate: "2024-01-05",
      lastActive: "2024-01-12",
      totalAds: 8,
      totalSpent: 199.99,
    },
  ])

  const [businesses] = useState<Business[]>([
    {
      id: "1",
      businessName: "Tech Startup Inc",
      ownerName: "John Smith",
      ownerEmail: "john@techstartup.com",
      niche: "Technology",
      status: "active",
      createdAt: "2024-01-10",
      totalAds: 12,
      revenue: 1250.0,
    },
    {
      id: "2",
      businessName: "Green Fashion Co",
      ownerName: "Sarah Johnson",
      ownerEmail: "sarah@ecommerce.com",
      niche: "E-commerce",
      status: "active",
      createdAt: "2024-01-08",
      totalAds: 5,
      revenue: 450.0,
    },
  ])

  const [adminAds] = useState<AdminAd[]>([
    {
      id: "1",
      title: "Transform Your Business Today",
      businessName: "Tech Startup Inc",
      ownerEmail: "john@techstartup.com",
      status: "approved",
      createdAt: "2024-01-15",
      platforms: ["Facebook", "Instagram"],
      flagged: false,
      revenue: 125.5,
    },
    {
      id: "2",
      title: "Sustainable Fashion Revolution",
      businessName: "Green Fashion Co",
      ownerEmail: "sarah@ecommerce.com",
      status: "pending",
      createdAt: "2024-01-14",
      platforms: ["Instagram", "Pinterest"],
      flagged: true,
      revenue: 0,
    },
  ])

  // Calculate admin stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0)
  const totalAds = adminAds.length
  const pendingAds = adminAds.filter((ad) => ad.status === "pending").length

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "delete") => {
    console.log(`${action} user ${userId}`)
    // Handle user actions
  }

  const handleAdAction = (adId: string, action: "approve" | "reject" | "flag") => {
    console.log(`${action} ad ${adId}`)
    // Handle ad moderation actions
  }

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAds}</div>
            <p className="text-xs text-muted-foreground">{pendingAds} pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAds.filter((ad) => ad.flagged).length}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="ads">Ad Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ads Created</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "premium" ? "secondary" : "outline"}
                      >
                        {user.role === "admin" && <Crown className="w-3 h-3 mr-1" />}
                        {user.role === "premium" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role === "user" && <UserCheck className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.totalAds}</TableCell>
                    <TableCell>${user.totalSpent}</TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction(user.id, user.status === "active" ? "suspend" : "activate")}
                        >
                          {user.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Businesses Tab */}
        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Niche</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Ads</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div className="font-medium">{business.businessName}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{business.ownerName}</div>
                          <div className="text-sm text-gray-500">{business.ownerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.niche}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={business.status === "active" ? "default" : "destructive"}>
                          {business.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{business.totalAds}</TableCell>
                      <TableCell>${business.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ad Moderation Tab */}
        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Title</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{ad.title}</div>
                          {ad.flagged && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{ad.businessName}</TableCell>
                      <TableCell>{ad.ownerEmail}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ad.status === "approved" ? "default" : ad.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {ad.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {ad.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${ad.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleAdAction(ad.id, "approve")}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAdAction(ad.id, "reject")}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Revenue charts coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>User growth charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge>{selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge>{selectedUser.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Join Date</Label>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Active</Label>
                  <p>{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Ads</Label>
                  <p>{selectedUser.totalAds}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Spent</Label>
                  <p>${selectedUser.totalSpent}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Edit User
                </Button>
                <Button variant="destructive" className="flex-1">
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
