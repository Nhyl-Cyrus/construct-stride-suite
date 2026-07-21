import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  FileText,
  Info,
  Layers,
  Sparkles,
  Upload,
  Users,
  ClipboardCheck,
  GitBranch,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DesignFileDropzone } from "@/components/architect/design-file-dropzone";
import { architectService } from "@/app/services/architect.service";
import {
  ARCHITECT_PROJECTS,
  ARCHITECT_PEOPLE,
  DISCIPLINES,
  DESIGN_CATEGORIES,
  PHASES,
  emptyDesignDraft,
  generateDesignCode,
  type DesignWizardDraft,
  type WizardFile,
  type Discipline,
  type DesignCategory,
  type ConstructionPhase,
} from "@/app/models/architect";

export const Route = createFileRoute("/_app/architect/designs/new")({
  head: () => ({
    meta: [
      { title: "New design — EasyConstruct" },
      { name: "description", content: "Create a new design with the 7-step enterprise wizard." },
    ],
  }),
  component: NewDesignPage,
});

const STEPS = [
  { key: "basics", label: "Basic information", helper: "Design name & discipline", icon: FileText },
  { key: "project", label: "Project information", helper: "Building, floor, phase", icon: Layers },
  { key: "files", label: "File upload", helper: "Drawings & attachments", icon: Upload },
  { key: "version", label: "Version information", helper: "Version & change reason", icon: GitBranch },
  { key: "collab", label: "Collaborators", helper: "Reviewers & consultants", icon: Users },
  { key: "ai", label: "AI analysis", helper: "Automated design checks", icon: Sparkles },
  { key: "review", label: "Review & submit", helper: "Final confirmation", icon: ClipboardCheck },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

function NewDesignPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepKey>("basics");
  const [draft, setDraft] = useState<DesignWizardDraft>(emptyDesignDraft);
  const [code, setCode] = useState(generateDesignCode());

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const set = <K extends keyof DesignWizardDraft>(key: K, value: DesignWizardDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setFiles = (updater: WizardFile[] | ((prev: WizardFile[]) => WizardFile[])) =>
    setDraft((d) => ({
      ...d,
      files: typeof updater === "function" ? (updater as (p: WizardFile[]) => WizardFile[])(d.files) : updater,
    }));

  const project = ARCHITECT_PROJECTS.find((p) => p.id === draft.projectId);

  const stepErrors = useMemo(() => {
    const e: Record<StepKey, string[]> = {
      basics: [],
      project: [],
      files: [],
      version: [],
      collab: [],
      ai: [],
      review: [],
    };
    if (!draft.name.trim() || draft.name.trim().length < 2) e.basics.push("Design name is required");
    if (!draft.projectId) e.basics.push("Select a project");
    if (!draft.discipline) e.basics.push("Select a discipline");
    if (!draft.category) e.basics.push("Select a category");
    if (!draft.phase) e.project.push("Select a construction phase");
    if (draft.files.length === 0) e.files.push("Upload at least one file");
    if (!draft.version) e.version.push("Version is required");
    return e;
  }, [draft]);

  const canAdvance = stepErrors[step].length === 0;

  const next = () => {
    if (!canAdvance) {
      toast.error("Complete required fields", { description: stepErrors[step].join(" · ") });
      return;
    }
    const nextIdx = Math.min(stepIndex + 1, STEPS.length - 1);
    setStep(STEPS[nextIdx].key);
  };
  const back = () => {
    const prev = Math.max(stepIndex - 1, 0);
    setStep(STEPS[prev].key);
  };

  const submit = () => {
    const parsed = architectService.validateDraft(draft);
    if (!parsed.success) {
      toast.error("Draft invalid", { description: parsed.error.issues[0]?.message });
      return;
    }
    toast.success("Design created", { description: `${code} · ${draft.name}` });
    navigate({ to: "/architect/designs" });
  };

  const aiChecks = [
    { label: "Completeness", value: Math.min(100, 40 + draft.files.length * 12) },
    { label: "Confidence", value: draft.reviewers.length > 0 ? 82 : 61 },
    { label: "Compliance", value: draft.phase ? 90 : 55 },
  ];

  return (
    <>
      <TopBar title="Create new design" subtitle="Design Studio" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 rounded-xl">
              <Link to="/architect/designs">
                <ChevronLeft className="h-4 w-4" /> All designs
              </Link>
            </Button>
            <h2 className="text-2xl font-semibold tracking-tight">Create new design</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-generated code <span className="font-mono">{code}</span>{" "}
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => setCode(generateDesignCode(project?.name, draft.discipline || undefined))}
              >
                regenerate
              </button>
            </p>
          </div>
          <div className="w-full md:w-64">
            <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          {/* Left rail — stepper */}
          <aside className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-2">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = s.key === step;
                  const done = i < stepIndex;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStep(s.key)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm transition",
                        active ? "bg-primary-soft text-primary" : "hover:bg-muted/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-semibold",
                          done && "border-primary bg-primary text-primary-foreground",
                          active && "border-primary text-primary",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-[11px] text-muted-foreground">{s.helper}</div>
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-primary/20 bg-primary-soft/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Need help?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Ask the assistant to draft a description, suggest reviewers, or pre-check code compliance.
                <Button size="sm" variant="outline" className="mt-3 w-full rounded-xl" onClick={() => toast.info("AI drafting…")}>
                  Draft with AI
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Center — active step */}
          <section>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">{STEPS[stepIndex].label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {step === "basics" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="name">Design name *</Label>
                      <Input id="name" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Westgate Tower · Floor 14 Plan" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Project *</Label>
                      <Select value={draft.projectId} onValueChange={(v) => set("projectId", v)}>
                        <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                        <SelectContent>
                          {ARCHITECT_PROJECTS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Discipline *</Label>
                      <Select value={draft.discipline} onValueChange={(v) => set("discipline", v as Discipline)}>
                        <SelectTrigger><SelectValue placeholder="Select discipline" /></SelectTrigger>
                        <SelectContent>
                          {DISCIPLINES.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Category *</Label>
                      <Select value={draft.category} onValueChange={(v) => set("category", v as DesignCategory)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {DESIGN_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="desc">Description</Label>
                      <Textarea id="desc" value={draft.description} onChange={(e) => set("description", e.target.value)} placeholder="Design intent, scope, notes…" />
                    </div>
                  </div>
                )}

                {step === "project" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Phase *</Label>
                      <Select value={draft.phase} onValueChange={(v) => set("phase", v as ConstructionPhase)}>
                        <SelectTrigger><SelectValue placeholder="Select phase" /></SelectTrigger>
                        <SelectContent>
                          {PHASES.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="building">Building</Label>
                      <Input id="building" value={draft.building} onChange={(e) => set("building", e.target.value)} placeholder="Tower A" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="floor">Floor</Label>
                      <Input id="floor" value={draft.floor} onChange={(e) => set("floor", e.target.value)} placeholder="14" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="zone">Zone</Label>
                      <Input id="zone" value={draft.zone} onChange={(e) => set("zone", e.target.value)} placeholder="North" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="client">Client</Label>
                      <Input id="client" value={draft.client} onChange={(e) => set("client", e.target.value)} placeholder="Westgate Holdings" />
                    </div>
                  </div>
                )}

                {step === "files" && <DesignFileDropzone files={draft.files} onChange={setFiles} />}

                {step === "version" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="v">Version *</Label>
                      <Input id="v" value={draft.version} onChange={(e) => set("version", e.target.value)} placeholder="v0.1" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rn">Revision number</Label>
                      <Input id="rn" type="number" min={1} value={draft.revisionNumber} onChange={(e) => set("revisionNumber", Number(e.target.value) || 1)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pv">Parent version</Label>
                      <Input id="pv" value={draft.parentVersion} onChange={(e) => set("parentVersion", e.target.value)} placeholder="v0.0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reason">Reason for revision</Label>
                      <Input id="reason" value={draft.reason} onChange={(e) => set("reason", e.target.value)} placeholder="Initial issue" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="cs">Change summary</Label>
                      <Textarea id="cs" value={draft.changeSummary} onChange={(e) => set("changeSummary", e.target.value)} placeholder="What changed and why?" />
                    </div>
                  </div>
                )}

                {step === "collab" && (
                  <div className="space-y-4">
                    {(["reviewers", "engineers", "consultants"] as const).map((key) => (
                      <div key={key}>
                        <Label className="capitalize">{key}</Label>
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          {ARCHITECT_PEOPLE.map((p) => {
                            const checked = draft[key].includes(p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-2 rounded-xl border p-2.5 text-sm">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() =>
                                    set(
                                      key,
                                      checked
                                        ? draft[key].filter((x) => x !== p.id)
                                        : [...draft[key], p.id],
                                    )
                                  }
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{p.name}</div>
                                  <div className="text-[11px] text-muted-foreground">{p.role}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <Label>Project manager</Label>
                      <Select value={draft.projectManager} onValueChange={(v) => set("projectManager", v)}>
                        <SelectTrigger><SelectValue placeholder="Assign PM" /></SelectTrigger>
                        <SelectContent>
                          {ARCHITECT_PEOPLE.filter((p) => p.role.includes("Project")).map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === "ai" && (
                  <div className="space-y-4">
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle>AI advisory only</AlertTitle>
                      <AlertDescription>
                        Model results below are recommendations. Final decisions stay with the design team.
                      </AlertDescription>
                    </Alert>
                    <div className="grid gap-3 md:grid-cols-3">
                      {aiChecks.map((c) => (
                        <div key={c.label} className="rounded-2xl border p-4">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                          <div className="mt-2 text-2xl font-semibold tabular-nums">{c.value}%</div>
                          <Progress value={c.value} className="mt-3 h-1.5" />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border p-4">
                      <div className="text-sm font-semibold">Suggested checks</div>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>· Confirm code compliance for egress and accessibility.</li>
                        <li>· Coordinate structural grid with MEP routing.</li>
                        <li>· Verify sheet naming matches project template.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {step === "review" && (
                  <div className="space-y-4">
                    <ReviewBlock label="Basics" items={[
                      ["Name", draft.name || "—"],
                      ["Project", project?.name ?? "—"],
                      ["Discipline", draft.discipline || "—"],
                      ["Category", draft.category || "—"],
                    ]} onEdit={() => setStep("basics")} />
                    <ReviewBlock label="Project" items={[
                      ["Phase", draft.phase || "—"],
                      ["Building", draft.building || "—"],
                      ["Floor", draft.floor || "—"],
                      ["Zone", draft.zone || "—"],
                      ["Client", draft.client || "—"],
                    ]} onEdit={() => setStep("project")} />
                    <ReviewBlock label="Files" items={[["Uploaded", `${draft.files.length} file(s)`]]} onEdit={() => setStep("files")} />
                    <ReviewBlock label="Version" items={[
                      ["Version", draft.version],
                      ["Revision", `${draft.revisionNumber}`],
                      ["Parent", draft.parentVersion || "—"],
                      ["Reason", draft.reason || "—"],
                    ]} onEdit={() => setStep("version")} />
                    <ReviewBlock label="Collaborators" items={[
                      ["Reviewers", `${draft.reviewers.length}`],
                      ["Engineers", `${draft.engineers.length}`],
                      ["Consultants", `${draft.consultants.length}`],
                    ]} onEdit={() => setStep("collab")} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer nav */}
            <div className="sticky bottom-0 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background/95 p-3 backdrop-blur">
              <Button variant="ghost" onClick={() => navigate({ to: "/architect/designs" })}>Cancel</Button>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={() => toast.success("Draft saved")}>Save draft</Button>
                <Button variant="outline" onClick={back} disabled={stepIndex === 0}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {stepIndex < STEPS.length - 1 ? (
                  <Button onClick={next}>
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={submit}>
                    <Check className="h-4 w-4" /> Create design
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Right rail */}
          <aside className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Code">{code}</Row>
                <Row label="Name">{draft.name || "—"}</Row>
                <Row label="Project">{project?.name ?? "—"}</Row>
                <Row label="Discipline">{draft.discipline || "—"}</Row>
                <Row label="Version">{draft.version}</Row>
                <Separator />
                <Row label="Files">{draft.files.length}</Row>
                <Row label="Reviewers">{draft.reviewers.length}</Row>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Validation</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {STEPS.map((s) => {
                  const errs = stepErrors[s.key];
                  const ok = errs.length === 0;
                  return (
                    <div key={s.key} className="flex items-start gap-2 text-xs">
                      <span className={cn("mt-0.5 h-1.5 w-1.5 rounded-full", ok ? "bg-success" : "bg-warning-foreground")} />
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-muted-foreground">{ok ? "Ready" : errs.join(" · ")}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-primary/20 bg-primary-soft/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Upload at least one drawing to unlock AI completeness scoring.
                <Badge variant="outline" className="mt-2 block w-fit rounded-full text-[10px]">Best practice</Badge>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

function ReviewBlock({ label, items, onEdit }: { label: string; items: [string, string][]; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">{label}</div>
        <Button variant="ghost" size="sm" className="rounded-xl" onClick={onEdit}>Edit</Button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map(([k, v]) => (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="text-sm">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
