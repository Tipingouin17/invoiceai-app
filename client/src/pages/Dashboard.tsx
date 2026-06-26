import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "wouter";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const { data: invoices, isLoading: invoicesLoading } = trpc.feature.list.useQuery();
  const createInvoiceMutation = trpc.feature.create.useMutation({
    onSuccess: () => trpc.useUtils().feature.list.invalidate(),
  });

  if (loading || !isAuthenticated) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? <Skeleton className="h-8 w-16" /> : <span>{invoices?.length}</span>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span>
                  ${invoices?.filter(invoice => invoice.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2)}
                </span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <ul>
                  {invoices?.slice(0, 5).map(invoice => (
                    <li key={invoice.invoiceId}>{invoice.clientName} - {invoice.status}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => createInvoiceMutation.mutate({ content: "New Invoice" })}>
              Create New Invoice
            </Button>
            <Button onClick={() => navigate("/clients/add")}>
              Add Client
            </Button>
            <Button onClick={() => navigate("/reports/generate")}>
              Generate Report
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Invoices</h2>
          {invoicesLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : invoices?.length === 0 ? (
            <div className="text-center mt-4">
              <p>No invoices found. Start by creating a new invoice.</p>
              <Button onClick={() => createInvoiceMutation.mutate({ content: "New Invoice" })}>
                Create New Invoice
              </Button>
            </div>
          ) : (
            <ul className="mt-4">
              {invoices.map(invoice => (
                <li key={invoice.invoiceId} className="border-b py-2">
                  {invoice.clientName} - ${invoice.amount.toFixed(2)} - {invoice.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;