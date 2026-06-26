import React from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: invoices, isLoading: invoicesLoading } = trpc.feature.list.useQuery();
  const createInvoiceMutation = trpc.feature.create.useMutation({
    onSuccess: () => trpc.useUtils().feature.list.invalidate(),
  });

  if (authLoading) {
    return <Skeleton />;
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleCreateInvoice = () => {
    createInvoiceMutation.mutate({ content: "New Invoice" });
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? <Skeleton /> : <p>{invoices?.length || 0}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? <Skeleton /> : <p>$0.00</p>} {/* Replace with actual data */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton />
              ) : (
                <ul>
                  {invoices?.map((invoice) => (
                    <li key={invoice.id}>{invoice.status}</li>
                  )) || <p>No recent activity.</p>}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="flex space-x-4 mt-2">
            <Button onClick={handleCreateInvoice}>Create New Invoice</Button>
            <Button>Add Client</Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Invoices</h2>
          {invoicesLoading ? (
            <Skeleton />
          ) : invoices?.length ? (
            <ul className="mt-2">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <Card>
                    <CardContent>
                      <p>Invoice ID: {invoice.id}</p>
                      <p>Amount: ${invoice.amount}</p>
                      <p>Status: {invoice.status}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p>No invoices available. <Button onClick={handleCreateInvoice}>Create your first invoice</Button></p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}