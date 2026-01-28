"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WorldMapBackground } from "@/components/landing/WorldMapBackground"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Globe2,
  Users,
  Award,
  Bot,
  Target,
  FileText,
  TrendingUp,
  Clock,
  Shield
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-[#0f172a] text-white">
        {/* Background Gradient & Pattern */}


        // ... imports ...

        // Inside Hero Section:
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] opacity-90" />
          <WorldMapBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-6 pb-20 md:pt-10 md:pb-32">
          {/* Header */}
          <header className="flex h-16 items-center justify-between mb-20">
            <div className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span>AI Counsellor</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
              <Link href="#" className="hover:text-blue-400 transition-colors">Universities</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">How it Works</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Success Stories</Link>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle className="text-white hover:bg-white/10 hover:text-white" />
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white border-0">Get Started</Button>
              </Link>
            </div>
          </header>

          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
              <Bot className="mr-2 h-4 w-4" />
              AI-Powered Study Abroad Guidance
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Plan Your Study Abroad Journey with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Guided AI Counsellor</span>
            </h1>

            <p className="max-w-[42rem] leading-normal text-slate-300 sm:text-xl sm:leading-8">
              Get personalized university recommendations, application guidance, and expert advice—all powered by AI that understands your unique profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="xl" className="w-full h-14 px-8 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-xl shadow-blue-900/20">
                  <Globe2 className="mr-2 h-5 w-5" /> Get Started
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="xl" variant="outline" className="w-full h-14 px-8 text-lg border-slate-600 bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white rounded-full">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Section Overlay (Moved outside Hero to avoid overflow clipping) */}
      <div className="relative z-20 -mt-24 container mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Universities", value: "500+", icon: GraduationCap },
            { label: "Countries", value: "50+", icon: Globe2 },
            { label: "Students Helped", value: "10K+", icon: Users },
            { label: "Success Rate", value: "95%", icon: Award },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl text-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 bg-slate-50 pb-20">
        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-[800px] text-lg text-slate-600">
              Our AI-powered platform guides you through every step of your study abroad journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Counsellor",
                desc: "Get personalized guidance from our AI that understands your profile, goals, and preferences.",
                icon: Bot,
                color: "text-blue-600 bg-blue-100"
              },
              {
                title: "Smart Matching",
                desc: "Receive university recommendations categorized as Dream, Target, and Safe based on your profile.",
                icon: Target,
                color: "text-purple-600 bg-purple-100"
              },
              {
                title: "Application Tracking",
                desc: "Stay organized with AI-generated tasks and deadlines for each of your target universities.",
                icon: FileText,
                color: "text-cyan-600 bg-cyan-100"
              },
              {
                title: "Profile Strength",
                desc: "Understand your strengths and gaps with detailed profile analysis and improvement suggestions.",
                icon: TrendingUp,
                color: "text-green-600 bg-green-100"
              },
              {
                title: "Timeline Management",
                desc: "Never miss a deadline with smart reminders and a comprehensive application timeline.",
                icon: Clock,
                color: "text-orange-600 bg-orange-100"
              },
              {
                title: "Expert Insights",
                desc: "Get detailed reasoning for each recommendation, including acceptance chances and risks.",
                icon: Shield,
                color: "text-red-600 bg-red-100"
              },
            ].map((feature) => (
              <div key={feature.title} className="group p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`h-14 w-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-sm`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-50 to-transparent opacity-10"></div>

          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Path to Success</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                A simple, step-by-step process to transform your study abroad dreams into reality.
              </p>
            </div>

            <div className="relative">
              {/* Horizontal Line (Desktop) */}
              <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-slate-700/50 w-full" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
                {[
                  { step: "01", title: "Create Profile", desc: "Sign up and tell us about your background and goals.", icon: Users },
                  { step: "02", title: "Chat with AI", desc: "Get personalized advice and answers to your questions.", icon: Bot },
                  { step: "03", title: "Shortlist", desc: "Review AI recommendations (Dream, Target, Safe).", icon: Target },
                  { step: "04", title: "Lock & Plan", desc: "Select universities to unlock application tasks.", icon: FileText },
                  { step: "05", title: "Apply", desc: "Follow your timeline and submit with confidence.", icon: CheckCircle2 },
                ].map((item, index) => (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-blue-600 border-4 border-slate-900 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/50 mb-6 relative hover:scale-110 transition-transform cursor-default bg-gradient-to-br from-blue-500 to-blue-700">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl text-white mb-6">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <span>AI Counsellor</span>
          </div>
          <p className="mb-6">Built for the Global Education Hackathon.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Contact Support</Link>
          </div>
          <p className="mt-8 text-xs text-slate-600">© 2024 AI Counsellor. All rights reserved.</p>
        </div>
      </footer>
    </div >
  )
}
