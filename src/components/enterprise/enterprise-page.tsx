import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Upload,
  Share2,
  Archive,
  Printer,
  Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  tone?: "success" | "warning" | "destructive" | "info" | "muted";
}

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface RowAction<T> {
  label: string;
  onSelect: (row: T) => void;
  destructive?: boolean;
}

const toneToText: Record<NonNullable<Kpi["tone"]>, string> = {
  success: "text-success",
  warning: "text-warning-foreground",
  destructive: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
};

export interface EnterprisePageProps<T> {
  title: string;
  subtitle: string;
  description?: string;
  kpis?: Kpi[];
  rows: T[];
  columns: Column<T>[];
  searchable?: (row: T) => string;
  searchPlaceholder?: string;
  primaryAction?: { label: string; onSelect: () => void };
  createDialog?: {
    label: string;
    title: string;
    description: string;
    fields: { name: string; label: string; placeholder?: string; textarea?: boolean }[];
    onSubmit: (values: Record<string, string>) => void;
  };
  rowActions?: RowAction<T>[];
  filters?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
}

export function EnterprisePage<T extends { id?: string | number }>(
  props: EnterprisePageProps<T>,
) {
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (!query.trim() || !props.searchable) return props.rows;
    const q = query.toLowerCase();
    return props.rows.filter((r) => props.searchable!(r).toLowerCase().includes(q));
  }, [props.rows, props.searchable, query]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(props.rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded", { description: `${props.rows.length} rows exported.` });
  };

  const submit = () => {
    props.createDialog?.onSubmit(form);
    toast.success(`${props.createDialog?.label ?? "Record"} created`);
    setForm({});
    setDialogOpen(false);
  };

  return (
    <>
      <TopBar title={props.title} subtitle={props.subtitle} />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{props.title}</h2>
            {props.description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {props.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => toast.info("Import ready", { description: "Choose a CSV to upload." })}
            >
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            {props.createDialog && (
              <Button size="sm" className="rounded-xl" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> {props.createDialog.label}
              </Button>
            )}
            {props.primaryAction && (
              <Button size="sm" className="rounded-xl" onClick={props.primaryAction.onSelect}>
                <Sparkles className="h-4 w-4" /> {props.primaryAction.label}
              </Button>
            )}
          </div>
        </div>

        {props.kpis && props.kpis.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {props.kpis.map((k) => (
              <Card key={k.label} className="rounded-2xl border-border/70 shadow-sm">
                <CardContent className="space-y-1 p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </div>
                  <div className={`text-2xl font-semibold tabular-nums ${k.tone ? toneToText[k.tone] : ""}`}>
                    {k.value}
                  </div>
                  {k.delta && (
                    <div className="text-xs text-muted-foreground">{k.delta}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(props.searchable || props.filters) && (
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              {props.searchable && (
                <div className="relative max-w-sm flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={props.searchPlaceholder ?? "Search…"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                  />
                </div>
              )}
              {props.filters}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto rounded-xl"
                onClick={() => toast.info("Filters", { description: "Advanced filters coming online." })}
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="h-4 w-4" /> Print
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {props.columns.map((c) => (
                        <th key={c.key} className={`px-5 py-2.5 ${c.className ?? ""}`}>
                          {c.header}
                        </th>
                      ))}
                      {props.rowActions && props.rowActions.length > 0 && (
                        <th className="px-5 py-2.5" />
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={props.columns.length + (props.rowActions ? 1 : 0)}
                          className="px-5 py-16 text-center text-sm text-muted-foreground"
                        >
                          No records match the current filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, i) => (
                        <tr
                          key={row.id ?? i}
                          className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                        >
                          {props.columns.map((c) => (
                            <td key={c.key} className={`px-5 py-3.5 ${c.className ?? ""}`}>
                              {c.render(row)}
                            </td>
                          ))}
                          {props.rowActions && props.rowActions.length > 0 && (
                            <td className="px-5 py-3.5 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  {props.rowActions.map((a, idx) => (
                                    <div key={a.label}>
                                      {idx > 0 && a.destructive && <DropdownMenuSeparator />}
                                      <DropdownMenuItem
                                        className={a.destructive ? "text-destructive" : ""}
                                        onSelect={() => a.onSelect(row)}
                                      >
                                        {a.label}
                                      </DropdownMenuItem>
                                    </div>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {props.aside && <div className="space-y-4">{props.aside}</div>}
        </div>

        {props.footer}
      </div>

      {props.createDialog && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{props.createDialog.title}</DialogTitle>
              <DialogDescription>{props.createDialog.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {props.createDialog.fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.textarea ? (
                    <Textarea
                      id={f.name}
                      placeholder={f.placeholder}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  ) : (
                    <Input
                      id={f.name}
                      placeholder={f.placeholder}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Convenience re-exports so route files stay short
export { toast, Badge, Progress, Archive };
