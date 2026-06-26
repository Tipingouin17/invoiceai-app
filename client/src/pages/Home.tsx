import { useAuth } from "@/_core/hooks/useAuth";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { FaFileInvoiceDollar, FaUserFriends, FaDollarSign } from "react-icons/fa";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="sticky top-0 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-xl font-bold">InvoiceAI</div>
          <nav className="space-x-4">
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
          {isAuthenticated ? (
            <Button as="a" href="/dashboard" variant="primary">Go to Dashboard</Button>
          ) : (
            <SignInButton mode="modal">
              <Button variant="primary">Get Started</Button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Transform Your Invoicing Experience with InvoiceAI
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Say goodbye to the hassle of manual invoicing and let AI do the heavy lifting for you!
          </motion.p>
          <SignInButton mode="modal">
            <Button variant="secondary" size="lg">Start your free trial today!</Button>
          </SignInButton>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Effortless Invoice Management for Freelancers</h2>
          <p className="text-lg text-gray-700 mb-4">
            InvoiceAI helps freelancers manage their invoices automatically using AI, so you can focus on growing your business.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaFileInvoiceDollar}
              title="Automated Invoice Management"
              description="InvoiceAI uses advanced AI technology to automatically generate, send, and track your invoices."
            />
            <FeatureCard
              icon={FaUserFriends}
              title="User-Friendly Interface"
              description="Our intuitive dashboard makes it easy to manage invoices, view payment statuses, and access financial insights."
            />
            <FeatureCard
              icon={FaDollarSign}
              title="Affordable Pricing"
              description="Enjoy the power of AI-driven invoice management for just $10 a month. No hidden fees."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Pricing</h2>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>$10/month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">No hidden fees, no complicated contracts—just seamless invoicing at your fingertips.</p>
              <SignInButton mode="modal">
                <Button variant="primary" size="lg">Start your free trial</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your invoicing?</h2>
          <SignInButton mode="modal">
            <Button variant="secondary" size="lg">Get Started with InvoiceAI</Button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-6 text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Badge className="mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </Badge>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
}