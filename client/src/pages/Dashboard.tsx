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
          Create your first AI-powered invoice in seconds and get paid faster. Connect your email
          to send directly to clients.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onCreateClick} className="h-10 px-6">
            <Plus className="h-4 w-4 mr-2" />
            Create First Invoice
          </Button>
          <Button variant="outline" className="h-10 px-6">
            <Zap className="h-4 w-4 mr-2" />
            Import from QuickBooks
          </Button>
        </div>
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
                  <div className="grid grid-cols-1 gap-4">
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