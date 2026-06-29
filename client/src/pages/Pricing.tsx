import { useState } from "react";
import { Check, Zap, Shield, Clock, Users, ArrowRight, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { SignInButton } from "@clerk/clerk-react";
import { Link } from "wouter";

const features = [
  { icon: Zap, text: "Stripe payment integration — collect instantly" },
  { icon: Check, text: "Gmail & Outlook email sync" },
  { icon: Check, text: "QuickBooks accounting integration" },
  { icon: Check, text: "Zapier automation workflows" },
  { icon: Check, text: "AI-powered invoice generation" },
  { icon: Check, text: "Automatic payment reminders" },
  { icon: Check, text: "Real-time invoice tracking" },
  { icon: Check, text: "Multi-currency support" },
  { icon: Shield, text: "Bank-grade security & encryption" },
  { icon: Clock, text: "Priority customer support" },
  { icon: Users, text: "Team collaboration tools" },
  { icon: Check, text: "Unlimited invoices & clients" },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Every new account gets a 14-day free trial with full access to all features. No credit card required to start.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Cancel your subscription at any time from your dashboard. You'll retain access until the end of your billing period.",
  },
  {
    question: "How does per-user pricing work?",
    answer:
      "You pay $15/month for each user you add to your workspace. Add or remove users anytime and your bill adjusts automatically.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Annual billing with a 20% discount is coming soon. Join our mailing list to be notified when it launches.",
  },
  {
    question: "Which Stripe features are supported?",
    answer:
      "InvoiceAI supports Stripe Checkout, saved payment methods, automatic retries for failed payments, and instant payouts.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All data is encrypted at rest and in transit. We are SOC 2 Type II compliant and never sell your data to third parties.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
    stars: 5,
    text: "InvoiceAI cut my invoicing time from 2 hours a week to under 10 minutes. The QuickBooks sync alone is worth every penny.",
  },
  {
    name: "Marcus Rivera",
    role: "Agency Owner",
    avatar: "MR",
    stars: 5,
    text: "We scaled from 3 to 18 team members without changing our workflow. The per-user pricing keeps costs predictable.",
  },
  {
    name: "Priya Nair",
    role: "Accountant",
    avatar: "PN",
    stars: 5,
    text: "The Gmail integration is seamless. Clients receive polished invoices directly from my domain and payments hit Stripe instantly.",
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const checkoutMutation = trpc.payments.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate({ priceId: import.meta.env.VITE_STRIPE_PRICE_ID });
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/">
            <span className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Zap className="h-5 w-5 text-violet-400" />
              InvoiceAI
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/">
              <span className="text-sm text-slate-400 transition-colors hover:text-white cursor-pointer">
                Home
              </span>
            </Link>
            <Link to="/pricing">
              <span className="text-sm font-medium text-white cursor-pointer">Pricing</span>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white h-10 px-4">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white h-10 px-4">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
          {/* Mobile auth */}
          <div className="flex md:hidden">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white h-10 px-4">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white h-10 px-4">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pb-8 pt-20 text-center md:px-8 md:pt-28">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            <Zap className="h-3.5 w-3.5" />
            Simple, transparent pricing
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            One plan. Everything included.
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              No surprises.
            </span>
          </h1>
          <p className="mt-5 text-base text-slate-400 md:text-lg">
            InvoiceAI gives every team member access to AI-powered invoicing, Stripe payments, Gmail/Outlook sync,
            QuickBooks integration, and Zapier automation — all for a flat $15/user/month.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="px-4 pb-20 pt-12 md:px-8">
        <div className="mx-auto max-w-lg">
          <Card className="relative overflow-hidden border border-violet-500/40 bg-slate-900/80 shadow-2xl shadow-violet-900/30 backdrop-blur-sm">
            {/* Popular badge */}
            <div className="absolute right-0 top-0">
              <div className="rounded-bl-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Most Popular
              </div>
            </div>

            <CardHeader className="pb-2 pt-8 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-violet-400">Pro Plan</p>
              <CardTitle className="mt-3">
                <span className="text-6xl font-black text-white">$15</span>
                <span className="ml-1 text-xl text-slate-400">/user/month</span>
              </CardTitle>
              <p className="mt-2 text-sm text-slate-400">Billed monthly · Cancel anytime · 14-day free trial</p>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-4">
              {/* Divider */}
              <div className="mb-6 h-px bg-white/10" />

              {/* Features grid */}
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                      <Check className="h-3 w-3 text-violet-400" />
                    </span>
                    <span className="text-sm text-slate-300">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-6 h-px bg-white/10" />

              {/* CTA */}
              {user ? (
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                  className="h-12 w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-base font-semibold text-white hover:from-violet-500 hover:to-cyan-500 disabled:opacity-70"
                >
                  {checkoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting to checkout…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start your free trial
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="h-12 w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-base font-semibold text-white hover:from-violet-500 hover:to-cyan-500">
                    <span className="flex items-center gap-2">
                      Get started free
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </SignInButton>
              )}

              {checkoutMutation.isError && (
                <p className="mt-3