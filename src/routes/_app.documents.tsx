import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Upload,
  FolderTree,
  Search,
  Filter,
  History,
  Download,
  ChevronRight,
  FileSignature,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({
    meta: [
      { title: "Documents — EasyConstruct" },
      { name: "description", content: "Central document repository with versioning." },
    ],
  }),
  component: DocumentsPage,
});

const folders = [
  { name: "Contracts", count: 142 },
  { name: "Drawings", count: 1284 },
  { name: "Proposals", count: 318 },
  { name: "RFIs & Submittals", count: 642 },
  { name: "Permits & Compliance", count: 96 },
  { name: "Reports", count: 207 },
];

const docs = [
  {
    id: "DR-302",
    title: "Curtain wall — Rev C",
    project: "WMT-204",
    type: "Drawing",
    version: "v3",
    size: "12.4 MB",
    updated: "2h ago",
    by: "P. Anand",
    icon: ImageIcon,
  },
  {
    id: "PR-2041",
    title: "Steel erection proposal",
    project: "WMT-204",
    type: "Proposal",
    version: "v2",
    size: "1.8 MB",
    updated: "1d ago",
    by: "L. Park",
    icon: FileText,
  },
  {
    id: "CT-014",
    title: "MEP subcontract",
    project: "WMT-204",
    type: "Contract",
    version: "v1",
    size: "884 KB",
    updated: "3d ago",
    by: "Legal",
    icon: FileSignature,
  },
  {
    id: "RP-208",
    title: "Geotechnical investigation",
    project: "HLH-118",
    type: "Report",
    version: "v1",
    size: "6.2 MB",
    updated: "1w ago",
    by: "GeoCon Ltd.",
    icon: FileText,
  },
  {
    id: "BD-051",
    title: "Cost forecast Q3",
    project: "Portfolio",
    type: "Spreadsheet",
    version: "v4",
    size: "412 KB",
    updated: "2w ago",
    by: "Finance",
    icon: FileSpreadsheet,
  },
];

function DocumentsPage() {
  return (
    <>
      <TopBar title="Documents" subtitle="Repository, versioning, contracts, drawings" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Document repository</h2>
            <p className="text-sm text-muted-foreground">
              2,689 documents across 24 projects · version-controlled
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              <FolderTree className="h-4 w-4" /> Browse all
            </Button>
            <Button className="rounded-xl">
              <Upload className="h-4 w-4" /> Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {folders.map((f) => (
            <Card
              key={f.name}
              className="cursor-pointer rounded-2xl border-border/70 shadow-sm transition hover:border-primary/40"
            >
              <CardContent className="space-y-1 p-4">
                <FolderTree className="h-5 w-5 text-primary" />
                <div className="text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground tabular-nums">{f.count} files</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents…"
                  className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border/70 bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5">Document</th>
                    <th className="px-3 py-2.5">Project</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Version</th>
                    <th className="px-3 py-2.5">Size</th>
                    <th className="px-3 py-2.5">Updated</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 text-secondary-foreground">
                            <d.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{d.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {d.id} · by {d.by}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-muted-foreground">
                        {d.project}
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {d.type}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-mono text-xs">{d.version}</span>
                      </td>
                      <td className="px-3 py-3.5 text-xs tabular-nums text-muted-foreground">
                        {d.size}
                      </td>
                      <td className="px-3 py-3.5 text-xs text-muted-foreground">{d.updated}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <History className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
