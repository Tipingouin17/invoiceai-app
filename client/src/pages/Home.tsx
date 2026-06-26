import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { LucideIcon, DollarSign, CheckCircle, Send } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="text-xl font-bold">InvoiceAI</div>
          <div className="flex space-x-4">
            <a href="#features" className="text-gray-700 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
            {isAuthenticated ? (
              <Button href="/dashboard">Go to Dashboard</Button>
            ) : (
              <SignInButton mode="modal">
                <Button>Get Started</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold">Transform Your Invoicing Experience with InvoiceAI</h1>
            <p className="mt-4 text-lg">Say goodbye to the hassle of manual invoicing and let AI do the heavy lifting for you!</p>
            <div className="mt-8">
              {isAuthenticated ? (
                <Button href="/dashboard" className="bg-white text-blue-600">Go to Dashboard</Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-white text-blue-600">Start your free trial today</Button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Effortless Invoice Management for Freelancers</h2>
            <p className="mt-4 text-gray-600">InvoiceAI helps freelancers manage their invoices automatically using AI.</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center">Features</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<LucideIcon />}
                title="Automated Invoice Management"
                description="InvoiceAI uses advanced AI technology to automatically generate, send, and track your invoices."
              />
              <FeatureCard
                icon={<LucideIcon />}
                title="User-Friendly Interface"
                description="Our intuitive dashboard makes it easy to manage invoices, view payment statuses, and access financial insights."
              />
              <FeatureCard
                icon={<LucideIcon />}
                title="Instant Payment Reminders"
                description="Never miss a payment again! InvoiceAI sends automatic reminders to your clients."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Affordable Pricing</h2>
            <p className="mt-4 text-gray-600">Enjoy the power of AI-driven invoice management for just $10 a month.</p>
            <div className="mt-8">
              <Card className="max-w-sm mx-auto">
                <CardHeader>
                  <CardTitle>Monthly Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-baseline">
                    <span className="text-4xl font-extrabold">$10</span>
                    <span className="text-gray-600 ml-2">/ month</span>
                  </div>
                  <Button className="mt-4">Choose Plan</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Start Your Free Trial Today</h2>
            <p className="mt-4">Experience effortless invoicing with InvoiceAI!</p>
            <div className="mt-8">
              {isAuthenticated ? (
                <Button href="/dashboard" className="bg-white text-blue-600">Go to Dashboard</Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-white text-blue-600">Get Started</Button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}