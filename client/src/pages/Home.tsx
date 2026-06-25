import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react"; // Assuming lucide-react is installed
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const ctaText = isAuthenticated ? "Go to Dashboard" : "Get Started";
  const ctaLink = isAuthenticated ? "/dashboard" : getLoginUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-xl font-bold">InvoiceAI</div>
          <div className="flex space-x-4">
            <Link href="/features" className="hover:text-blue-500">Features</Link>
            <Link href="/pricing" className="hover:text-blue-500">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-500">Contact</Link>
            <Button as="a" href={ctaLink} className="ml-4">
              {ctaText}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Transform Your Invoicing Process with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg"
          >
            Say goodbye to manual invoices and hello to seamless automation. InvoiceAI takes the hassle out of invoicing, so you can focus on what you do best—growing your business.
          </motion.p>
          <Button as="a" href={ctaLink} className="mt-8">
            {ctaText}
          </Button>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Effortless Invoicing for Freelancers and Small Agencies</h2>
            <p className="mt-4 text-gray-600">
              Automatically generate invoices from time tracking data, send them via email, and follow up on late payments with our AI-powered tool.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Automated Invoice Generation",
              description: "Effortlessly generate professional invoices in seconds from your time tracking data.",
              icon: "FileText",
            },
            {
              title: "Instant Email Delivery",
              description: "Send invoices directly to your clients' inboxes with one click.",
              icon: "Mail",
            },
            {
              title: "Smart Payment Follow-ups",
              description: "Automatically reminds clients of overdue invoices.",
              icon: "Clock",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    <LucideIcon name={feature.icon} className="w-6 h-6 text-blue-500" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Simple Pricing</h2>
            <p className="mt-4 text-gray-600">Just $10/month per user. Start your free trial today!</p>
            <Button as="a" href={ctaLink} className="mt-8">
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Start Your Free Trial Today</h2>
            <p className="mt-4">Experience hassle-free invoicing for just $10/month!</p>
            <Button as="a" href={ctaLink} className="mt-8">
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}