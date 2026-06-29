import { SignInButton } from "@clerk/clerk-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const FEATURES = [
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

export default function Pricing() {
  const { user } = useAuth();
  const checkoutMutation = trpc.payments.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to start checkout");
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate({ priceId: import.meta.env.VITE_STRIPE_PRICE_ID });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              InvoiceAI
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Simple Pricing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to get paid faster.
          </p>
        </div>

        <Card className="border-2 border-violet-500 dark:border-violet-400 shadow-xl shadow-violet-100 dark:shadow-violet-900/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Pro Plan</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                $15
              </span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cancel anytime. No hidden fees.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}

            <div className="pt-4">
              {user ? (
                <Button
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 font-semibold"
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 font-semibold">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
