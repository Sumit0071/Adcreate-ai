"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { Footer } from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import AuthModal from "@/components/Auth/AuthModal";
import UserMenu from "@/components/ui/UserMenu";
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, Target, Zap, Users, ArrowRight, Settings, Shield, BarChart3, MessageSquare, Moon,
  Sun,
} from "lucide-react"
import { BusinessProfileForm } from "@/components/business-profile-form"
import { AdGenerationModal } from "@/components/ad-generation-modal"
import { WhatsAppChatImport } from "@/components/whatsapp-chat-import"
import Link from "next/link"

interface BusinessProfile {
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
}
export default function Home() {
  const [isOpen, setIsOpen] = useState( false );
  const [showAuth, setShowAuth] = useState( false );
  const [showProfileForm, setShowProfileForm] = useState( false )
  const [showWhatsAppImport, setShowWhatsAppImport] = useState( false ) // Added WhatsApp import state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>( null )
  const [showAdModal, setShowAdModal] = useState( false )
  const [isAdmin, setIsAdmin] = useState( false ) // Added admin role state for demo
  const { user, isLoggedIn, fetchUser, logout,hasFetched } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (!hasFetched) {
      fetchUser(); // ✅ only run once
    }
  }, [hasFetched, fetchUser]);

  console.log( "User", user );

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "About", link: "/about" },
  ];

  const handleProfileSubmit = ( profile: BusinessProfile ) => {
    setBusinessProfile( profile )
    setShowProfileForm( false )
    setShowWhatsAppImport( false ) // Reset WhatsApp import when profile is submitted
    setShowAdModal( true )
  }

  const handleGetStarted = () => {
    if ( !isLoggedIn ) {
      alert( "User not logged in. Redirecting to login/signup." );
      setShowAuth( true ) // open login/signup modal
      return
    }
    setShowProfileForm( true )
  }

  const handleWhatsAppImport = () => {
    if ( !isLoggedIn ) {
      alert( "User not logged in. Redirecting to login/signup." );
      setShowAuth( true ) // open login/signup modal
      return
    }
    setShowWhatsAppImport( true )
  }

  if ( showProfileForm ) {
    return <BusinessProfileForm onSubmit={handleProfileSubmit} onBack={() => setShowProfileForm( false )} />
  }

  if ( showWhatsAppImport ) {
    return <WhatsAppChatImport onProfileGenerated={handleProfileSubmit} onBack={() => setShowWhatsAppImport( false )} />
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
      {/* Navbar */}
      <header className="fixed top-2 left-0 w-full z-50  h-15 ">
        <Navbar>
          <NavBody className="flex items-center justify-between px-6">
            <div className="flex items-center gap-x-6">
              <NavbarLogo />
              <NavItems items={navItems} />
            </div>
            <div className="flex items-center gap-x-4">
              <NavbarButton variant="dark" onClick={toggleTheme} className="justify-self-end">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </NavbarButton>
              {!user ? (
                <NavbarButton variant="dark" onClick={() => setShowAuth( true )}>
                  Sign Up
                </NavbarButton>
              ) : (
                <UserMenu User={user} />
              )}
            </div>
          </NavBody>

          {/* Mobile Navbar */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isOpen}
                onClick={() => setIsOpen( !isOpen )}
              />
            </MobileNavHeader>
            <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen( false )}>
              {navItems.map( ( item, idx ) => (
                <a
                  key={idx}
                  href={item.link}
                  className="block text-base font-medium text-neutral-700 dark:text-neutral-200 py-2"
                  onClick={() => setIsOpen( false )}
                >
                  {item.name}
                </a>
              ) )}
              {!user ? (
                <NavbarButton
                  className="mt-4 w-full"
                  variant="dark"
                  onClick={() => setShowAuth( true )}
                >
                  Sign Up / Login
                </NavbarButton>
              ) : (
                <NavbarButton className="mt-4 w-full" variant="dark">
                  Sign Out
                </NavbarButton>
              )}
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </header>
      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth( false )} />}


      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Ad Generation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Create High-Converting Ads in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Transform your business profile into compelling ad campaigns with AI. Generate multiple ad variations,
            custom images, and copy that converts—all tailored to your target audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 hover:from-green-700 hover:to-emerald-700"
              onClick={handleWhatsAppImport}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Import WhatsApp Chats
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Create Winning Ads</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your business profile and generates targeted ad campaigns that speak directly to your
              audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Smart Targeting</CardTitle>
                <CardDescription>
                  AI analyzes your niche and target audience to create highly relevant ad copy and visuals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Multiple Variations</CardTitle>
                <CardDescription>
                  Generate 3 unique ad sequences with different approaches to maximize your campaign success.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Custom Images</CardTitle>
                <CardDescription>
                  AI-generated images tailored to your brand and message, or upload your own context images.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Create professional ads in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Business Profile</h3>
              <p className="text-gray-600">Tell us about your business, target audience, and advertising goals.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Special Instructions</h3>
              <p className="text-gray-600">Provide specific requirements and upload context images if needed.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
              <p className="text-gray-600">Get 3 unique ad variations with custom copy and images ready to use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Advertising?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses creating high-converting ads with AI
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3" onClick={handleGetStarted}>
            Start Creating Ads Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Ad Generation Modal */}
      {showAdModal && businessProfile && (
        <AdGenerationModal businessProfile={businessProfile} onClose={() => setShowAdModal( false )} />
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}
