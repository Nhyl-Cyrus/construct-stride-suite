import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Grid3x3,
  List as ListIcon,
  Search,
  Star,
  Folder,
  Download,
  Share2,
  Upload,
  FileText,
  Filter,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBlueprints } from "@/app/controllers/architect/useArchitect";
import { UploadDrawingDialog } from "@/components/architect/dialogs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/architect/blueprints")({
  head: () => ({
    meta: [
      { title: "Blueprint library — EasyConstruct" },
      { name: "description", content: "Enterprise blueprint library with folders, tags and version history." },
    ],
  }),
  component: BlueprintsPage,
});

function BlueprintsPage() {
  const navigate = useNavigate();
  const rows = useBlueprints();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folder, setFolder] = useState<string | null>(null);

  const folders = useMemo(() => Array.from(new Set(rows.map((r) => r.folder))).sort(), [rows]);
  const filtered = rows.filter((r) => {
    if (folder && r.folder !== folder) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.drawingNumber.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const favorites = filtered.filter((r) => r.favorite);

  return (
    <>
      <TopBar title="Blueprint library" subtitle="Design Studio" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Blueprints</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Browse, preview and manage every drawing across projects. Grouped by folder, filterable by tag, favorites pinned on top.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-xl rounded-r-none"
                onClick={() => setView("grid")}
              >
                <Grid3x3 className="h-4 w-4" /> Grid
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none rounded-r-xl"
                onClick={() => setView("list")}
              >
                <ListIcon className="h-4 w-4" /> List
              </Button>
            </div>
            <Button size="sm" className="rounded-xl" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Folders</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted/40",
                  !folder && "bg-muted/60 font-medium",
                )}
                onClick={() => setFolder(null)}
              >
                <Folder className="h-4 w-4" /> All folders
              </button>
              <Accordion type="multiple" className="w-full">
                {folders.map((f) => (
                  <AccordionItem key={f} value={f} className="border-b-0">
                    <AccordionTrigger className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted/40 hover:no-underline">
                      <span className="flex items-center gap-2"><Folder className="h-4 w-4" /> {f}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pl-6 text-xs">
                      <button
                        className={cn(
                          "block w-full rounded-md px-2 py-1 text-left text-xs hover:bg-muted/40",
                          folder === f && "bg-primary-soft text-primary",
                        )}
                        onClick={() => setFolder(f)}
                      >
                        Show only this folder
                      </button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                <div className="relative max-w-sm flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search blueprints, tags…"
                    className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
                <div className="ml-auto text-xs text-muted-foreground">
                  {filtered.length} of {rows.length} drawings
                </div>
              </CardContent>
            </Card>

            {favorites.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-warning-foreground" /> Favorites
                </div>
                <div className={cn(view === "grid" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "space-y-2")}>
                  {favorites.map((r) => (
                    <BlueprintCard key={r.id} r={r} view={view} onOpen={() => navigate({ to: "/architect/blueprints/$blueprintId", params: { blueprintId: r.id } })} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">All drawings</div>
              <div className={cn(view === "grid" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "space-y-2")}>
                {filtered.map((r) => (
                  <BlueprintCard
                    key={r.id}
                    r={r}
                    view={view}
                    onOpen={() => navigate({ to: "/architect/blueprints/$blueprintId", params: { blueprintId: r.id } })}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="rounded-2xl border p-10 text-center text-sm text-muted-foreground">
                    No blueprints match this view.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <UploadDrawingDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}

function BlueprintCard({
  r,
  view,
  onOpen,
}: {
  r: ReturnType<typeof useBlueprints>[number];
  view: "grid" | "list";
  onOpen: () => void;
}) {
  if (view === "list") {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-background p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <button className="truncate text-sm font-medium hover:underline" onClick={onOpen}>
            {r.drawingNumber} · {r.title}
          </button>
          <div className="text-[11px] text-muted-foreground">
            {r.folder} · Scale {r.scale} · Rev {r.revision} · {r.author}
          </div>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
        <BlueprintActions onOpen={onOpen} />
      </div>
    );
  }
  return (
    <Card className="group rounded-2xl">
      <CardContent className="space-y-3 p-4">
        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 text-xs text-muted-foreground">
          Drawing preview · {r.fileType}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button className="truncate text-sm font-medium hover:underline" onClick={onOpen}>
              {r.drawingNumber} · {r.title}
            </button>
            <div className="text-[11px] text-muted-foreground">{r.folder}</div>
          </div>
          {r.favorite && <Star className="h-4 w-4 shrink-0 fill-warning text-warning-foreground" />}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="rounded-full text-[10px]">Scale {r.scale}</Badge>
          <Badge variant="outline" className="rounded-full text-[10px]">Rev {r.revision}</Badge>
          <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{r.author}</span>
          <BlueprintActions onOpen={onOpen} />
        </div>
      </CardContent>
    </Card>
  );
}

function BlueprintActions({ onOpen }: { onOpen: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-xl">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onOpen}>Open</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.info("Preview opened")}>Preview</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success("Download started")}>
          <Download className="h-4 w-4" /> Download
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
          <Share2 className="h-4 w-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.message("Version history opened")}>Version history</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
