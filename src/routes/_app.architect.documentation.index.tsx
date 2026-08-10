import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Search, FileText } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDocuments } from "@/app/controllers/architect/useArchitect";
import { UploadDrawingDialog } from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";
import { DOCUMENT_CATEGORIES, type DocumentCategory } from "@/app/models/architect";

export const Route = createFileRoute("/_app/architect/documentation/")({
  head: () => ({
    meta: [
      { title: "Documentation — EasyConstruct" },
      { name: "description", content: "Design documentation hub organised by category." },
    ],
  }),
  component: DocumentationPage,
});

const TAB_CATEGORIES: DocumentCategory[] = [
  "Specifications",
  "Material Schedule",
  "Technical",
  "Compliance",
  "Permits",
  "Inspection",
  "RFI",
  "Submittal",
  "As-Built",
];

function DocumentationPage() {
  const navigate = useNavigate();
  const rows = useDocuments();
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tab, setTab] = useState<DocumentCategory | "all">("all");

  const filtered = rows.filter((r) => {
    if (tab !== "all" && r.category !== tab) return false;
    if (!query.trim()) return true;
    return r.title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <TopBar title="Documentation" subtitle="Design Studio" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Documentation hub</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Specifications, permits, RFIs, submittals and every supporting document.
            </p>
          </div>
          <Button size="sm" className="rounded-xl" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" /> Upload document
          </Button>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents…"
                className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {rows.length}
            </div>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {TAB_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tab} className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((d) => (
                <button
                  key={d.id}
                  className="rounded-2xl border bg-background p-4 text-left transition hover:border-primary/40 hover:bg-muted/30"
                  onClick={() => navigate({ to: "/architect/documentation/$docId", params: { docId: d.id } })}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{d.title}</div>
                        <div className="text-[11px] text-muted-foreground">{d.category} · {d.version}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px]">{d.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{d.owner}</span>
                    <span>{formatDate(d.updatedAt)}</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full rounded-2xl border p-10 text-center text-sm text-muted-foreground">
                  No documents in this category yet.
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.info("Choose a file to upload")}>Upload</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <UploadDrawingDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
