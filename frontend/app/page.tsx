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
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import AuthModal from "@/components/Auth/AuthModal";
import UserMenu from "@/components/ui/UserMenu";
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, Target, Zap, Users, ArrowRight, Settings, Shield, BarChart3, MessageSquare, Moon,
  Sun, CheckCircle,
} from "lucide-react"
import { BusinessProfileForm } from "@/components/business-profile-form"
import { WhatsAppChatImport } from "@/components/whatsapp-chat-import"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBusinessProfile } from "@/app/api/businessProfile"
import { handlePayment } from "@/app/api/user";

interface BusinessProfile {
  id?: number | undefined;
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
}
const plans = [
  {
    name: "Basic",
    price: 0,
    tagline: "Free",
    features: [
      "10 Ad Copies",
      "10 WhatsApp Chat Import",
      "10 Business Profiles",
    ],
    cta: "Get Started",
    isPro: false
  },
  {
    name: "Premium",
    price: 10,
    tagline: "For small businesses",
    features: [
      "100 Ad Copies",
      "100 WhatsApp Chat Import",
      "100 Business Profiles",
    ],
    cta: "Get Started",
    isPro: false
  },
  {
    name: "Enterprise",
    price: 100,
    tagline: "For large businesses",
    features: [
      "1000 Ad Copies",
      "1000 WhatsApp Chat Import",
      "1000 Business Profiles",
    ],
    cta: "Go Pro",
    isPro: true
  }
]
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showWhatsAppImport, setShowWhatsAppImport] = useState(false)
  const [isAdmin, setIsAdmin] = useState( false )
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const vantaEffectRef = useRef<any>(null);
  const router = useRouter()
  const { user, isLoggedIn, fetchUser, logout, hasFetched } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  useEffect(() => {
    if (!hasFetched) {
      fetchUser(); // ✅ only run once
    }
  }, [hasFetched, fetchUser]);

  useEffect(() => {
    let isMounted = true;
  
    const initVanta = async () => {
      const win = window as any;
  
      if (!win.p5) {
        const p5Loaded = await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"
        );
        if (!p5Loaded || !isMounted) return;
      }
  
      if (!win.VANTA?.TOPOLOGY) {
        const vantaLoaded = await loadScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"
        );
        if (!vantaLoaded || !isMounted) return;
      }
  
      // destroy old instance when theme changes
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
  
      if (heroRef.current && win.VANTA?.TOPOLOGY) {
        vantaEffectRef.current = win.VANTA.TOPOLOGY({
          el: heroRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: theme === "dark" ? 0xea2dc2 : 0xaaaaaa,
          backgroundColor: theme === "dark" ? 0x0e090e : 0xffffff,
        });
      }
    };
  
    initVanta();
  
    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [theme]);

  console.log("User", user);
  const handlePaymentCheckout = async (amount: number, plan: string) => {

    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    if ( loading ) return;
    setLoading( true );
  
    // FREE PLAN
    if (plan === "Basic") {
      alert("Basic plan activated!");
      return;
    }
  
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }
  
    try {
      const data = await handlePayment(amount, plan);
  
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "AdCreate.AI",
        description: `${plan} Subscription`,
        order_id: data.order.id,
  
        handler: function (response: any) {
          console.log("Payment success:", response);
          alert(`${plan} plan activated successfully!`);
        },
  
        prefill: {
          name: user?.username,
          email: user?.email,
        },
  
        theme: {
          color: "#6366f1",
        },
      };
  
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
  
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Try again.");
    }
    finally {
      setLoading( false );
    }
  };
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "About", link: "/about" },
  ];

  const handleProfileSubmit = async (profile: BusinessProfile & { id?: number }) => {
    setShowProfileForm(false)
    setShowWhatsAppImport(false)
    const id = profile?.id
    if (id != null) {
      router.push(`/generate-ads?profileId=${id}`)
    }
  }

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      alert("User not logged in. Redirecting to login/signup.");
      setShowAuth(true) // open login/signup modal
      return
    }
    setShowProfileForm(true)
  }

  const handleWhatsAppImport = () => {
    if (!isLoggedIn) {
      alert("User not logged in. Redirecting to login/signup.");
      setShowAuth(true) // open login/signup modal
      return
    }
    setShowWhatsAppImport(true)
  }

  if (showProfileForm) {
    return <BusinessProfileForm onSubmitData={handleProfileSubmit} onBack={() => setShowProfileForm(false)} />
  }

  if (showWhatsAppImport) {
    return <WhatsAppChatImport onProfileGenerated={handleProfileSubmit} onBack={() => setShowWhatsAppImport(false)} />
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${theme === "dark"
        ? "bg-gradient-to-bl from-gray-800 via-gray-900 to-slate-950 text-white"
        : "bg-gradient-to-bl from-white via-blue-50 to-pink-100"
        }`}
    >
      {/* Background Blobs (shared across sections) */}
      <div className="absolute inset-0 -z-10">
        {/* Pink oval between Hero & Features */}
        <div className="absolute top-[70vh] left-[-20vw] w-[80vw] h-[60vh] rounded-full bg-pink-300 opacity-50 blur-[120px]" />
        {/* Blue blob for Features section */}
        <div className="absolute top-[120vh] right-[-15vw] w-[70vw] h-[50vh] rounded-full bg-blue-300 opacity-40 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-2 left-0 w-full z-50 h-15">
        <div className="hidden md:block">
          <Navbar>
            <NavBody className="flex items-center justify-between px-6">
              <div className="flex items-center gap-x-6">
                <NavbarLogo />
                <NavItems
                  items={navItems}
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                />
              </div>
              <div className="flex items-center gap-x-4">
                <NavbarButton
                  variant="dark"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </NavbarButton>
                {!user ? (
                  <NavbarButton variant="dark" onClick={() => setShowAuth(true)}>
                    Sign Up
                  </NavbarButton>
                ) : (
                  <UserMenu User={user} />
                )}
              </div>
            </NavBody>
          </Navbar>
        </div>
        {/* Mobile Navbar */}
        <div className="block md:hidden">
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </MobileNavHeader>
            <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="block text-base font-medium text-neutral-700 dark:text-neutral-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {!user ? (
                <NavbarButton
                  className="mt-4 w-full"
                  variant="dark"
                  onClick={() => setShowAuth(true)}
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
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Hero Section */}
<section
  ref={heroRef}
  id="hero-vanta"
  className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
>
  <div className="container mx-auto max-w-5xl relative z-10">
    
    {/* Subheading */}
    <div className="text-center mb-8">
      <Badge
        variant="outline"
        className="bg-purple-50 text-purple-700 border-purple-200 mb-4"
      >
        <Sparkles className="w-3 h-3 mr-2" />
        Save 85% of manual effort
      </Badge>
    </div>

    {/* Main Heading */}
    <h1 className={`text-5xl sm:text-6xl font-bold text-center mb-6 `}>
      Your{" "}
      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        AI-Powered
      </span>{" "}
      Marketing Team
    </h1>

    {/* Description */}
    <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      Set up in minutes. Automate SEO, content, and campaigns without the busywork.
    </p>

    {/* Social Proof */}
    <div className="flex items-center justify-center gap-6 mb-12">
      <div className="flex -space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white">
          <img src="mug1.png" className="rounded-full" alt="mug1"></img>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white">
        <img src="mug2.png" className="rounded-full" alt="mug2"></img>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white">
        <img src="mug3.png" className="rounded-full" alt="mug3"></img>
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">
          31+
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          specialized AI agents built for growth
        </span>
      </div>
    </div>

    <p className="text-xl mb-8 max-w-2xl mx-auto text-center">
      Transform your business profile into compelling ad campaigns with AI.
      Generate multiple ad variations, custom images, and copy that converts—
      all tailored to your target audience.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
<section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden`}>
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-gray-50 dark:from-slate-700 to-white dark:to-slate-800 p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">AdCreate.AI</span>
                </div>
                <Badge className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200">30 days left</Badge>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-1">
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium">
                      Dashboard
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                      Agent Library
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                      Content Hub
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                      Insights
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                      Feeds Manager
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                      Workflows
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-4">What would you like to do now?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors text-left">
                          <Zap className="w-6 h-6 text-purple-600 mb-2" />
                          <p className="font-medium text-gray-900 dark:text-white">Update Product Content</p>
                        </button>
                        <button className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-left">
                          <Target className="w-6 h-6 text-blue-600 mb-2" />
                          <p className="font-medium text-gray-900 dark:text-white">Check my technical SEO</p>
                        </button>
                      </div>
                    </div>

                    {/* Optimization Score */}
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Optimization Score</h3>
                      <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                          120
                        </div>
                      </div>
                    </div>

                    {/* User Greeting */}
                    <div className="bg-gradient-to-br from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30 rounded-lg p-6">
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Good Morning, Asha</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Agent History</p>
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white dark:border-slate-800"></div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white dark:border-slate-800"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Features Section */}
      <section className={`py-16 px-4 relative z-10 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-full opacity-30 blur-xl animate-float"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold  mb-4">
              Everything You Need to Create Winning Ads
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI analyzes your business profile and generates targeted ad
              campaigns that speak directly to your audience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-600"}`}>Smart Targeting</CardTitle>
                <CardDescription className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  AI analyzes your niche and target audience to create highly
                  relevant ad copy and visuals.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-600"}`}>Multiple Variations</CardTitle>
                <CardDescription className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Generate 3 unique ad sequences with different approaches to
                  maximize your campaign success.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-600"}`}>Custom Images</CardTitle>
                <CardDescription className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  AI-generated images tailored to your brand and message, or
                  upload your own context images.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4  relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold  mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Create professional ads in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create Business Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tell us about your business, target audience, and advertising
                goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Add Special Instructions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Provide specific requirements and upload context images if
                needed.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get 3 unique ad variations with custom copy and images ready to
                use.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      {/* pricing */}
      <section className="py-20 px-4">
        <p className="text-md text-center text-indigo-500 font-semibold bg-indigo-100 rounded-lg px-4 py-2 mb-4 w-fit mx-auto">Pricing</p>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the plan that best fits your business needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between h-full border shadow-md hover:shadow-xl cursor-pointer
          ${theme === 'dark'
                    ? `${plan.isPro ? 'border-green-400' : 'border-gray-700'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`
                    : `${plan.isPro ? 'border-green-500' : 'border-gray-200'} bg-gradient-to-br from-white via-gray-50 to-white text-black`
                  }`}
              >
                {plan.isPro && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                    🔥Most Popular
                  </div>
                )}

                <CardHeader className="mb-4">
                  <CardTitle className="text-xl font-bold mb-1">{plan.name}</CardTitle>
                  <CardDescription className="text-md font-semibold text-indigo-500">
                    {plan.tagline}
                  </CardDescription>
                  <CardDescription className="text-lg font-semibold text-indigo-500">
                    ${plan.price}/mo
                  </CardDescription>

                </CardHeader>

                <CardContent className="mb-4">
                  <ul
                    className={`space-y-3 text-md ${theme === 'dark' ? 'text-violet-200' : 'text-gray-700'}`}
                  >
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-left">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <Button disabled={plan.price === 0} className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white" size="lg"
                  onClick={() => handlePaymentCheckout(plan.price, plan.name)}>
                  {plan.price === 0 ? "Current Plan" : plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
       {/* CTA */}
       <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-[url('/img1.jpg')] bg-cover rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Advertising?</h2>
            <p className="text-lg mb-8 text-purple-100">
              Join thousands of businesses creating high-converting ads with AI
            </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
            onClick={handleGetStarted}
          >
            Start Creating Ads Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


