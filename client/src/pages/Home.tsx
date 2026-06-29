import { useState } from "react";
import { Link } from "wouter";
import { SignInButton } from "@clerk/clerk-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  Bell,
  TrendingUp,
  Link2,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 },
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-violet-500" />,
      title: "Professional Invoices. Zero Busywork.",
      description:
        "Stop wrestling with templates and manual data entry. InvoiceAI's intelligent system generates polished, professional invoices in seconds. Just input your project details—our AI handles the rest, creating branded invoices that impress clients and get paid faster.",
      badge: "AI-Powered",
    },
    {
      icon: <Bell className="w-6 h-6 text-blue-500" />,
      title: "Never Chase a Late Payment Again.",
      description:
        "Automated payment reminders do the heavy lifting for you. Set it and forget it—InvoiceAI sends perfectly timed follow-ups to clients who haven't paid, with just the right tone to maintain relationships while protecting your cash flow.",
      badge: "Smart Reminders",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      title: "Know Which Clients Will Pay Late—Before They Do.",
      description:
        "Our predictive AI analyzes client payment history and behavior patterns to flag high-risk accounts before problems start. Stay ahead of cash flow issues, adjust your payment terms proactively, and protect your business revenue.",
      badge: "Predictive AI",
    },
    {
      icon: <Link2 className="w-6 h-6 text-orange-500" />,
      title: "Connects With Your Favorite Tools.",
      description:
        "InvoiceAI integrates seamlessly with Stripe for payments, Gmail and Outlook for email reminders, QuickBooks for accounting sync, and Zapier for custom automations. Your entire financial workflow, unified in one place.",
      badge: "Integrations",
    },
  ];

  const problems = [
    {
      icon: <Clock className="w-5 h-5 text-red-500" />,
      text: "Hours lost each week manually creating and formatting invoices",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      text: "Awkward conversations chasing clients for overdue payments",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-red-500" />,
      text: "Cash flow surprises when clients pay late without warning",
    },
  ];

  const solutions = [
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      text: "AI generates professional invoices in seconds, every time",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      text: "Automated reminders handle follow-ups so you never have to",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      text: "Predictive insights flag late payers before it becomes a problem",
    },
  ];

  const pricingFeatures = [
    "AI-powered invoice generation",
    "Automated payment reminders",
    "Late payment prediction",
    "Stripe payment integration",
    "Gmail & Outlook sync",
    "QuickBooks accounting sync",
    "Zapier automations",
    "Unlimited invoices",
    "Priority email support",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      avatar: "SC",
      text: "InvoiceAI cut my invoicing time from 2 hours a week to under 10 minutes. The late payment predictor alone saved me $3,000 last quarter.",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Independent Consultant",
      avatar: "MR",
      text: "I used to dread sending payment reminders. Now InvoiceAI does it automatically with exactly the right tone. My clients actually pay faster now.",
      rating: 5,
    },
    {
      name: "Priya Nair",
      role: "Freelance Developer",
      avatar: "PN",
      text: "The QuickBooks integration is seamless. Everything syncs automatically and my accountant loves how organized my books are now.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                  InvoiceAI
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <Link to="/dashboard">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Dashboard
                  </span>
                </Link>
              ) : null}
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link to="/dashboard">
                  <Button className="h-10 px-6 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button className="h-10 px-6 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-3">
              {user && (
                <Link to="/dashboard">
                  <div
                    className="block px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </div>
                </Link>
              )}
              <a
                href="#pricing"
                className="block px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#features"
                className="block px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <div className="pt-2">
                {user ? (
                  <Link to="/dashboard">
                    <Button className="w-full h-10 px-6 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="w-full h-10 px-6 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 md:px-8 lg:px-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/30 dark:via-gray-950 dark:to-blue-950/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-200/40 to-transparent dark:from-violet-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp} className="mb-6">
            <Badge className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 px-4 py-1.5 text-sm font-medium">
              ✨ AI-Powered Invoicing for Freelancers
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Stop Chasing Payments.{" "}
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Start Growing Your Business.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            InvoiceAI handles your invoicing so you can focus on what you do
            best. Professional invoices in seconds. Automatic payment reminders.
            Predictive insights on who'll pay late.{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              All for just $15/month.
            </span>
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 text-base font-semibold shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 text-base font-semibold shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                >
                  Start Free Today
                  <ArrowRight className="w-