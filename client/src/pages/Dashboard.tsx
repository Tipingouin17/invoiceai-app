import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(getLoginUrl());
    }
  }, [isAuthenticated, loading, navigate]);

  const { data: invoices, isLoading: invoicesLoading } = trpc.feature.list.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.stats.overview.useQuery();

  if (loading || !isAuthenticated) {
    return <Skeleton className="h-screen" />;
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Invoices Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? <Skeleton className="h-8 w-full" /> : <p>{stats?.totalInvoices}</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Amount Due</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? <Skeleton className="h-8 w-full" /> : <p>${stats?.totalAmountDue}</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button>Create New Invoice</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : invoices?.length ? (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Invoice Number</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.invoiceNumber}</td>
                        <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                        <td>${invoice.amount}</td>
                        <td>{invoice.status}</td>
                        <td>
                          <Button>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center">
                  <p>No invoices found. Start by creating a new invoice.</p>
                  <Button>Create Invoice</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}