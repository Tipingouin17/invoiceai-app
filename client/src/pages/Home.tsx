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
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignInButton>
            )}
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-white dark:bg-gray-900"
              >
                See How It Works
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Freelancers Lose 5+ Hours Every Week on Invoicing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Manual invoicing, awkward payment chases, and cash flow surprises
              are killing your productivity. There's a better way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                The Old Way
              </h3>
              {problems.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  {p.icon}
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {p.text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp} className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                With InvoiceAI
              </h3>
              {solutions.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  {s.icon}
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {s.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Everything You Need to Get Paid Faster
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              InvoiceAI combines AI intelligence with smart automation to
              transform how freelancers manage their invoicing workflow.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {feature.icon}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs shrink-0"
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold mt-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Freelancers Love InvoiceAI
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border border-gray-200 dark:border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              One plan. Everything included. Cancel anytime.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="max-w-sm mx-auto"
          >
            <Card className="border-2 border-violet-500 dark:border-violet-400 shadow-xl shadow-violet-100 dark:shadow-violet-900/20">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-3 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700">
                  Most Popular
                </Badge>
                <CardTitle className="text-2xl font-bold">Pro Plan</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold">$15</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pricingFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {f}
                    </span>
                  </div>
                ))}
                <div className="pt-4">
                  {user ? (
                    <Link to="/dashboard">
                      <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 font-semibold">
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 font-semibold">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-violet-600 to-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            {...fadeUp}
            className="text-2xl md:text-4xl font-extrabold text-white mb-4"
          >
            Ready to Get Paid Faster?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="text-violet-100 text-lg mb-8"
          >
            Join thousands of freelancers who've eliminated invoice stress.
            Start your free trial today—no credit card required.
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-10 bg-white text-violet-700 hover:bg-violet-50 border-0 font-semibold text-base"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="h-12 px-10 bg-white text-violet-700 hover:bg-violet-50 border-0 font-semibold text-base"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignInButton>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-blue-500 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              InvoiceAI
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} InvoiceAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
