import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  AlertCircle,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Zap,
  Bell,
} from "lucide-react";

type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled"
  | "written_off";

function getStatusBadgeVariant(
  status: InvoiceStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "paid":
      return "default";
    case "overdue":
      return "destructive";
    case "sent":
    case "viewed":
      return "secondary";
    default:
      return "outline";
  }
}

function getStatusIcon(status: InvoiceStatus) {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-3 w-3" />;
    case "overdue":
      return <XCircle className="h-3 w-3" />;
    case "sent":
      return <Send className="h-3 w-3" />;
    case "viewed":
      return <Eye className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
}

function formatCurrency(amount: string | number, currency = "USD") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(num || 0);
}

function formatDate(date: string | Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  loading,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-7 w-24 mt-1" />
            ) : (
              <p className="text-xl md:text-2xl font-bold mt-1 truncate">{value}</p>
            )}
            {subtitle && !loading && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
            )}
            {trend && !loading && (
              <p
                className={`text-xs mt-1 font-medium ${
                  trend.positive ? "text-green-600" : "text-red-500"
                }`}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="ml-3 p-2 md:p-3 rounded-full bg-primary/10 shrink-0">
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyInvoicesState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Create your first AI-powered invoice in seconds and get paid faster.
        </p>
        <Button onClick={onCreateClick} className="h-10 px-6">
          <Plus className="h-4 w-4 mr-2" />
          Create First Invoice
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Redirect to="/" />;

  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [createClientOpen, setCreateClientOpen] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    clientId: "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    currency: "USD",
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    currency: "USD",
    paymentTermsDays: "30",
  });

  const [lineItems, setLineItems] = useState([
    { description: "", quantity: "1", unitPrice: "" },
  ]);

  const invoicesQuery = trpc.invoices.list.useQuery();
  const clientsQuery = trpc.clients.list.useQuery();
  const statsQuery = trpc.invoices.stats.useQuery();

  const utils = trpc.useUtils();

  const createInvoiceMutation = trpc.invoices.create.useMutation({
    onSuccess: () => {
      utils.invoices.list.invalidate();
      utils.invoices.stats.invalidate();
      setCreateInvoiceOpen(false);
      setInvoiceForm({
        clientId: "",
        invoiceNumber: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        notes: "",
        currency: "USD",
      });
      setLineItems([{ description: "", quantity: "1", unitPrice: "" }]);
    },
  });

  const createClientMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      setCreateClientOpen(false);
      setClientForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        currency: "USD",
        paymentTermsDays: "30",
      });
    },
  });

  const sendReminderMutation = trpc.reminders.send.useMutation({
    onSuccess: () => {
      utils.invoices.list.invalidate();
    },
  });

  function handleCreateInvoice() {
    if (!invoiceForm.clientId || !invoiceForm.dueDate) return;
    const validLineItems = lineItems.filter(
      (item) => item.description && item.unitPrice
    );
    if (validLineItems.length === 0) return;

    createInvoiceMutation.mutate({
      clientId: parseInt(invoiceForm.clientId),
      invoiceNumber:
        invoiceForm.invoiceNumber ||
        `INV-${Date.now().toString().slice(-6)}`,
      issueDate: new Date(invoiceForm.issueDate).toISOString(),
      dueDate: new Date(invoiceForm.dueDate).toISOString(),
      notes: invoiceForm.notes,
      currency: invoiceForm.currency,
      lineItems: validLineItems.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
      })),
    });
  }

  function handleCreateClient() {
    if (!clientForm.name || !clientForm.email) return;
    createClientMutation.mutate({
      name: clientForm.name,
      email: clientForm.email,
      company: clientForm.company || undefined,
      phone: clientForm.phone || undefined,
      currency: clientForm.currency,
      paymentTermsDays: parseInt(clientForm.paymentTermsDays) || 30,
    });
  }

  function handleSendReminder(invoiceId: number, clientId: number) {
    sendReminderMutation.mutate({ invoiceId, clientId });
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: "description" | "quantity" | "unitPrice",
    value: string
  ) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  const invoices = invoicesQuery.data ?? [];
  const clients = clientsQuery.data ?? [];
  const stats = statsQuery.data;

  const totalRevenue = stats?.totalPaid ?? "0";
  const totalOutstanding = stats?.totalOutstanding ?? "0";
  const overdueCount = stats?.overdueCount ?? 0;
  const totalInvoices = stats?.totalCount ?? 0;

  const recentInvoices = invoices.slice(0, 8);

  const isLoadingStats = statsQuery.isLoading;
  const isLoadingInvoices = invoicesQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.firstName || user?.username || "there"} 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Here's what's happening with your invoices today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Add Client Dialog */}
            <Dialog open={createClientOpen} onOpenChange={setCreateClientOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10 px-4">
                  <Users className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="client-name">Full Name *</Label>
                    <Input
                      id="client-name"
                      placeholder="Jane Smith"
                      value={clientForm.name}
                      onChange={(e) =>
                        setClientForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client-email">Email Address *</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="jane@company.com"
                      value={clientForm.email}
                      onChange={(e) =>
                        setClientForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client-company">Company</Label>
                    <Input
                      id="client-company"
                      placeholder="Acme Corp"
                      value={clientForm.company}
                      onChange={(e) =>
                        setClientForm((prev) => ({ ...prev, company: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input
                      id="client-phone"
                      placeholder="+1 (555) 000-0000"
                      value={clientForm.phone}
                      onChange={(e) =>
                        setClientForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Currency</Label>
                      <Select
                        value={clientForm.currency}
                        onValueChange={(val) =>
                          setClientForm((prev) => ({ ...prev, currency: val }))
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Payment Terms</Label>
                      <Select
                        value={clientForm.paymentTermsDays}
                        onValueChange={(val) =>
                          setClientForm((prev) => ({ ...prev, paymentTermsDays: val }))
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Net 7</SelectItem>
                          <SelectItem value="14">Net 14</SelectItem>
                          <SelectItem value="30">Net 30</SelectItem>
                          <SelectItem value="60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCreateClientOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateClient}
                    disabled={
                      !clientForm.name ||
                      !clientForm.email ||
                      createClientMutation.isPending
                    }
                  >
                    {createClientMutation.isPending ? "Adding..." : "Add Client"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create Invoice Dialog */}
            <Dialog open={createInvoiceOpen} onOpenChange={setCreateInvoiceOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 px-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Invoice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Client *</Label>
                    <Select
                      value={invoiceForm.clientId}
                      onValueChange={(val) =>
                        setInvoiceForm((prev) => ({ ...prev, clientId: val }))
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name} {c.company ? `(${c.company})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Invoice #</Label>
                      <Input
                        placeholder="INV-001"
                        value={invoiceForm.invoiceNumber}
                        onChange={(e) =>
                          setInvoiceForm((prev) => ({ ...prev, invoiceNumber: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Currency</Label>
                      <Select
                        value={invoiceForm.currency}
                        onValueChange={(val) =>
                          setInvoiceForm((prev) => ({ ...prev, currency: val }))
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={invoiceForm.issueDate}
                        onChange={(e) =>
                          setInvoiceForm((prev) => ({ ...prev, issueDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Due Date *</Label>
                      <Input
                        type="date"
                        value={invoiceForm.dueDate}
                        onChange={(e) =>
                          setInvoiceForm((prev) => ({ ...prev, dueDate: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2">
                    <Label>Line Items *</Label>
                    {lineItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-5">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(index, "description", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Qty"
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(index, "quantity", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder="Price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateLineItem(index, "unitPrice", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            disabled={lineItems.length === 1}
                            className="h-10 w-10 p-0"
                          >
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addLineItem}
                      className="w-full h-9"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Line Item
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Payment instructions, thank you message..."
                      value={invoiceForm.notes}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCreateInvoiceOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateInvoice}
                    disabled={
                      !invoiceForm.clientId ||
                      !invoiceForm.dueDate ||
                      lineItems.every((i) => !i.description || !i.unitPrice) ||
                      createInvoiceMutation.isPending
                    }
                  >
                    {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            loading={isLoadingStats}
            trend={{ value: "vs last month", positive: true }}
          />
          <StatCard
            title="Outstanding"
            value={formatCurrency(totalOutstanding)}
            icon={Clock}
            loading={isLoadingStats}
          />
          <StatCard
            title="Overdue"
            value={String(overdueCount)}
            subtitle={overdueCount === 1 ? "invoice" : "invoices"}
            icon={AlertCircle}
            loading={isLoadingStats}
          />
          <StatCard
            title="Total Invoices"
            value={String(totalInvoices)}
            icon={FileText}
            loading={isLoadingStats}
          />
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => invoicesQuery.refetch()}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingInvoices ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentInvoices.length === 0 ? (
              <div className="p-6">
                <EmptyInvoicesState
                  onCreateClick={() => setCreateInvoiceOpen(true)}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Invoice
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                        Client
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                        Due Date
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice: any) => (
                      <tr
                        key={invoice.id}
                        className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">
                              {invoice.invoiceNumber || `#${invoice.id}`}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {invoice.client?.name || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                          {invoice.client?.name || "—"}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(invoice.totalAmount || invoice.total, invoice.currency)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={getStatusBadgeVariant(invoice.status as InvoiceStatus)}
                            className="gap-1 text-xs"
                          >
                            {getStatusIcon(invoice.status as InvoiceStatus)}
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              onClick={() =>
                                handleSendReminder(invoice.id, invoice.clientId)
                              }
                              disabled={sendReminderMutation.isPending}
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              Remind
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        {overdueCount > 0 && (
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">AI Insight:</span> You have{" "}
              {overdueCount} overdue invoice{overdueCount !== 1 ? "s" : ""}. Send
              automated reminders to recover{" "}
              {formatCurrency(totalOutstanding)} in outstanding payments.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
