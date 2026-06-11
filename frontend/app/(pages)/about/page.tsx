"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Footer } from "@/components/ui/footer";
import { Sparkles, Zap, BrainCircuit, Globe, Target, ShieldCheck, ArrowRight, Video, ImageIcon, LineChart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Creatives",
    description: "Generate stunning ad images and persuasive copy tailored perfectly to your target audience using state-of-the-art AI.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    icon: Video,
    title: "Lifelike Video Ads",
    description: "Transform your scripts into professional talking-head video ads using realistic AI avatars and high-quality voice synthesis.",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
  },
  {
    icon: Globe,
    title: "Multi-Platform Publishing",
    description: "Publish or schedule your generated ads directly to Facebook, Instagram, LinkedIn, and Twitter with a single click.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    icon: Target,
    title: "Data-Driven Optimization",
    description: "Predict ad performance (CTR) before you publish, and track real-time analytics to continuously improve your campaigns.",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
  }
];

const values = [
  {
    title: "Innovation First",
    description: "We constantly integrate the latest AI models to keep you ahead of the competition."
  },
  {
    title: "Radical Simplicity",
    description: "Complex advertising technologies made accessible through an intuitive, beautiful interface."
  },
  {
    title: "Performance Driven",
    description: "Everything we build is designed to maximize your ROI and lower your customer acquisition costs."
  }
];

export default function AboutPage() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      <header className={`py-4 px-6 border-b flex items-center justify-between z-50 relative backdrop-blur-md ${isDark ? "border-gray-800 bg-gray-950/80" : "border-gray-200 bg-white/80"}`}>
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          AdCreate AI
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          {/* Animated background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          </div>
          
          <div className="container relative z-10 px-4 mx-auto text-center max-w-4xl">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm rounded-full border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 mr-2 inline-block" />
              The Future of Advertising
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
              We're redefining how <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                brands connect with people.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              AdCreate AI was founded on a simple belief: creating high-performing, agency-quality advertising shouldn't require a massive budget or a team of experts.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={`py-20 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  To democratize digital advertising by providing businesses of all sizes with the most advanced, user-friendly AI tools to create, distribute, and optimize their ad campaigns.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Smart Intelligence</h4>
                    <p className="text-sm text-gray-500">Powered by cutting-edge LLMs and image generation models.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Unmatched Speed</h4>
                    <p className="text-sm text-gray-500">Go from idea to published campaign in minutes, not days.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl transform rotate-3 opacity-20 dark:opacity-40" />
                <div className={`relative rounded-3xl p-8 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900" : "bg-gray-50"} text-center`}>
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">10x</div>
                      <div className="text-sm text-gray-500">Faster Generation</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900" : "bg-gray-50"} text-center`}>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">-80%</div>
                      <div className="text-sm text-gray-500">Cost Reduction</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900" : "bg-gray-50"} text-center col-span-2`}>
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">Infinite</div>
                      <div className="text-sm text-gray-500">Creative Variations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What we do</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                An end-to-end platform that handles everything from creative ideation to social media distribution.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} className={`border-none shadow-lg hover:-translate-y-1 transition-transform duration-300 ${isDark ? "bg-gray-800/50" : "bg-white"}`}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className={`py-24 ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
          <div className="container px-4 mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl border border-indigo-200 dark:border-indigo-800/50">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-4 mx-auto max-w-4xl text-center">
            <div className={`p-12 rounded-3xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-indigo-50 border-indigo-100"} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your marketing?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of modern marketers who are using AdCreate AI to scale their campaigns without scaling their team.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 text-lg group">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
