import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useCallback, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Info,
  MapPin,
  Sparkles,
  Upload,
  Users,
  Wallet,
  X,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Plus,
  ClipboardCheck,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { useWorkflows } from "@/app/controllers/shared/useWorkflows";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  emptyDraft,
  autoGenerateProjectCode,
  PROJECT_TYPES,
  CATEGORIES,
  CURRENCIES,
  PAYMENT_SCHEDULES,
  FUNDING_SOURCES,
  TAX_CATEGORIES,
  SKILL_OPTIONS,
  TEAM_MEMBERS,
  PROVINCES,
  type NewProjectDraft,
  type UploadedDoc,
  type Priority,
  type ProjectStatus,
} from "@/app/models/new-project";

export const Route = createFileRoute("/_app/projects/new")({
  head: () => ({
    meta: [
      { title: "Create project — EasyConstruct" },
      {
        name: "description",
        content:
          "Enterprise project creation wizard: define scope, budget, workforce, and documents.",
      },
    ],
  }),
  component: NewProjectPage,
});

const STEPS = [
  { key: "basics", label: "Project information", helper: "Basic details", icon: FileText },
  { key: "location", label: "Location", helper: "Site & address", icon: MapPin },
  { key: "financial", label: "Financial", helper: "Budget & funding", icon: Wallet },
  { key: "workforce", label: "Workforce", helper: "Team & skills", icon: Users },
  { key: "documents", label: "Documents", helper: "Contracts & files", icon: Upload },
  { key: "ai", label: "AI validation", helper: "Automated review", icon: Sparkles },
  { key: "review", label: "Review & create", helper: "Confirm and submit", icon: ClipboardCheck },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

function NewProjectPage() {
  const { permissions, actions } = useWorkflows("project-manager");
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<NewProjectDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const step = STEPS[stepIndex];

  const update = useCallback(<K extends keyof NewProjectDraft>(key: K, value: NewProjectDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const { [key as string]: _, ...rest } = e;
      return rest;
    });
  }, []);

  const validation = useMemo(() => runValidation(draft), [draft]);
  const completion = useMemo(() => computeCompletion(draft), [draft]);
  const ai = useMemo(() => runAIReview(draft, validation, completion), [draft, validation, completion]);

  const validateStep = (key: StepKey): boolean => {
    const stepErrs = validateForStep(key, draft);
    setErrors(stepErrs);
    if (Object.keys(stepErrs).length > 0) {
      toast.error("Please complete required fields before continuing.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step.key)) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goTo = (i: number) => {
    if (i < stepIndex) return setStepIndex(i);
    // require validation up to current
    for (let s = stepIndex; s < i; s += 1) {
      if (!validateStep(STEPS[s].key)) return;
    }
    setStepIndex(i);
  };

  const saveDraft = () => {
    toast.success("Draft saved", { description: `${draft.name || "Untitled project"} kept locally.` });
  };

  const createProject = async () => {
    if (!permissions.canCreateProject) {
      toast.error("Not permitted", { description: "Your role cannot create projects." });
      return;
    }
    // Final validation across all required steps
    const all: Record<string, string> = {};
    (["basics", "location", "financial", "workforce"] as StepKey[]).forEach((s) => {
      Object.assign(all, validateForStep(s, draft));
    });
    if (Object.keys(all).length) {
      setErrors(all);
      toast.error("Fix outstanding validation errors before creating.");
      return;
    }
    // Persists through service -> repository -> audit trail (future POST /api/projects)
    const created = await actions.createProject(draft);
    if (!created) return;
    navigate({ to: "/projects" });
  };

  return (
    <>
      <TopBar title="Create new project" subtitle="Configure project information before deployment." />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/projects" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Projects
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">New project</span>
        </nav>

        {/* Header + progress */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
                Create new project
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Step {stepIndex + 1} of {STEPS.length} · {step.label}
              </p>
            </div>
            <div className="w-full max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Completion</span>
                <span className="font-medium text-foreground tabular-nums">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_320px]">
          {/* Left: stepper */}
          <aside className="space-y-4">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="p-3">
                <ol className="space-y-1">
                  {STEPS.map((s, i) => {
                    const state: "done" | "current" | "todo" =
                      i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
                    return (
                      <li key={s.key}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          className={cn(
                            "group flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition",
                            state === "current" && "border-primary/30 bg-primary/5",
                            state !== "current" && "hover:bg-muted/60",
                          )}
                          aria-current={state === "current" ? "step" : undefined}
                        >
                          <span
                            className={cn(
                              "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1",
                              state === "done" && "bg-success text-success-foreground ring-success/30",
                              state === "current" && "bg-primary text-primary-foreground ring-primary/30",
                              state === "todo" && "bg-muted text-muted-foreground ring-border",
                            )}
                          >
                            {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{s.label}</span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                              {s.helper}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-ai" />
                  <span className="text-xs font-medium">Need help?</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a proposal or contract and let AI pre-fill scope, milestones, and risk baselines.
                </p>
                <Button size="sm" variant="outline" className="w-full rounded-xl">
                  <Sparkles className="h-3.5 w-3.5" /> Generate with AI
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Center: step content */}
          <div className="min-w-0 space-y-4">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="border-b border-border/60">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{step.label}</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.helper}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {step.key === "basics" && (
                  <BasicsStep draft={draft} update={update} errors={errors} />
                )}
                {step.key === "location" && (
                  <LocationStep draft={draft} update={update} errors={errors} />
                )}
                {step.key === "financial" && (
                  <FinancialStep draft={draft} update={update} errors={errors} />
                )}
                {step.key === "workforce" && (
                  <WorkforceStep draft={draft} update={update} errors={errors} />
                )}
                {step.key === "documents" && (
                  <DocumentsStep draft={draft} update={update} />
                )}
                {step.key === "ai" && <AIStep ai={ai} completion={completion} />}
                {step.key === "review" && <ReviewStep draft={draft} ai={ai} onEdit={setStepIndex} />}
              </CardContent>
            </Card>

            {/* Footer actions */}
            <div className="sticky bottom-4 z-10">
              <Card className="rounded-2xl border-border/70 shadow-lg">
                <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="rounded-xl"
                      asChild
                    >
                      <Link to="/projects">
                        <X className="h-4 w-4" /> Cancel
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={saveDraft}>
                      Save draft
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={goBack}
                      disabled={stepIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    {stepIndex < STEPS.length - 1 ? (
                      <Button className="rounded-xl" onClick={goNext}>
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button className="rounded-xl" onClick={createProject}>
                        <CheckCircle2 className="h-4 w-4" /> Create project
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: summary */}
          <aside className="space-y-4">
            <SummaryCard draft={draft} completion={completion} />
            <AIInsightsCard ai={ai} />
            <ValidationCard validation={validation} />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ---------------- Step: Basics ---------------- */

function BasicsStep({
  draft,
  update,
  errors,
}: {
  draft: NewProjectDraft;
  update: <K extends keyof NewProjectDraft>(k: K, v: NewProjectDraft[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Project name" required error={errors.name}>
        <Input
          value={draft.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Westgate Commercial Tower"
          className="rounded-xl"
        />
      </Field>
      <Field label="Project code" required error={errors.code}>
        <div className="flex items-center gap-2">
          <Input
            value={draft.code}
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            placeholder="e.g. WCT-2026-001"
            className="rounded-xl font-mono"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => update("code", autoGenerateProjectCode(draft.name))}
            aria-label="Auto-generate project code"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Field>
      <Field label="Client / Owner" required error={errors.client}>
        <Input
          value={draft.client}
          onChange={(e) => update("client", e.target.value)}
          placeholder="Client organization"
          className="rounded-xl"
        />
      </Field>
      <Field label="Project type" required error={errors.projectType}>
        <Select value={draft.projectType} onValueChange={(v) => update("projectType", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select project type" /></SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Construction category" error={errors.category}>
        <Select value={draft.category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Priority">
        <Select value={draft.priority} onValueChange={(v) => update("priority", v as Priority)}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Status">
        <Select value={draft.status} onValueChange={(v) => update("status", v as ProjectStatus)}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Description" hint={`${draft.description.length}/500`}>
          <Textarea
            value={draft.description}
            onChange={(e) => update("description", e.target.value.slice(0, 500))}
            placeholder="Brief description of the project, objectives, and key deliverables…"
            className="min-h-[96px] rounded-xl"
          />
        </Field>
      </div>
      <Field label="Estimated start date" required error={errors.startDate}>
        <Input
          type="date"
          value={draft.startDate}
          onChange={(e) => update("startDate", e.target.value)}
          className="rounded-xl"
        />
      </Field>
      <Field label="Estimated end date" required error={errors.endDate}>
        <Input
          type="date"
          value={draft.endDate}
          onChange={(e) => update("endDate", e.target.value)}
          className="rounded-xl"
        />
      </Field>

      <div className="md:col-span-2">
        <Alert className="rounded-xl border-info/30 bg-info/5">
          <Info className="h-4 w-4 text-info" />
          <AlertTitle className="text-sm">Tip</AlertTitle>
          <AlertDescription className="text-xs">
            You can edit these details later. Fields marked with <span className="text-destructive">*</span> are required.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

/* ---------------- Step: Location ---------------- */

function LocationStep({
  draft,
  update,
  errors,
}: {
  draft: NewProjectDraft;
  update: <K extends keyof NewProjectDraft>(k: K, v: NewProjectDraft[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Project address" required error={errors.address}>
          <Input
            value={draft.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Street, building number"
            className="rounded-xl"
          />
        </Field>
      </div>
      <Field label="Province" required error={errors.province}>
        <Select value={draft.province} onValueChange={(v) => update("province", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select province" /></SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="City" required error={errors.city}>
        <Input value={draft.city} onChange={(e) => update("city", e.target.value)} className="rounded-xl" />
      </Field>
      <Field label="Barangay">
        <Input value={draft.barangay} onChange={(e) => update("barangay", e.target.value)} className="rounded-xl" />
      </Field>
      <Field label="Zip code">
        <Input
          value={draft.zipCode}
          onChange={(e) => update("zipCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="rounded-xl"
          inputMode="numeric"
        />
      </Field>
      <Field label="Latitude">
        <Input
          value={draft.latitude ?? ""}
          onChange={(e) => update("latitude", e.target.value)}
          placeholder="14.5995"
          className="rounded-xl"
        />
      </Field>
      <Field label="Longitude">
        <Input
          value={draft.longitude ?? ""}
          onChange={(e) => update("longitude", e.target.value)}
          placeholder="120.9842"
          className="rounded-xl"
        />
      </Field>

      <div className="md:col-span-2">
        <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className="relative flex h-full flex-col items-center justify-center gap-1 text-center">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Map preview</p>
            <p className="text-xs text-muted-foreground">
              {draft.address || "Enter an address to preview the site location"}
            </p>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <Field label="Site notes">
          <Textarea
            value={draft.siteNotes}
            onChange={(e) => update("siteNotes", e.target.value)}
            placeholder="Access constraints, soil conditions, neighboring sites…"
            className="min-h-[80px] rounded-xl"
          />
        </Field>
      </div>
    </div>
  );
}

/* ---------------- Step: Financial ---------------- */

function FinancialStep({
  draft,
  update,
  errors,
}: {
  draft: NewProjectDraft;
  update: <K extends keyof NewProjectDraft>(k: K, v: NewProjectDraft[K]) => void;
  errors: Record<string, string>;
}) {
  const remaining = draft.budget - draft.initialAllocation - draft.contingency;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Estimated budget" required error={errors.budget}>
        <Input
          type="number"
          min={0}
          value={draft.budget || ""}
          onChange={(e) => update("budget", Number(e.target.value))}
          placeholder="0"
          className="rounded-xl tabular-nums"
        />
      </Field>
      <Field label="Currency" required>
        <Select value={draft.currency} onValueChange={(v) => update("currency", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Cost center">
        <Input value={draft.costCenter} onChange={(e) => update("costCenter", e.target.value)} placeholder="e.g. CC-OPS-2026" className="rounded-xl" />
      </Field>
      <Field label="Payment schedule">
        <Select value={draft.paymentSchedule} onValueChange={(v) => update("paymentSchedule", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select schedule" /></SelectTrigger>
          <SelectContent>
            {PAYMENT_SCHEDULES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Funding source">
        <Select value={draft.fundingSource} onValueChange={(v) => update("fundingSource", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select source" /></SelectTrigger>
          <SelectContent>
            {FUNDING_SOURCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Tax category">
        <Select value={draft.taxCategory} onValueChange={(v) => update("taxCategory", v)}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TAX_CATEGORIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Initial budget allocation" error={errors.initialAllocation}>
        <Input
          type="number"
          min={0}
          value={draft.initialAllocation || ""}
          onChange={(e) => update("initialAllocation", Number(e.target.value))}
          className="rounded-xl tabular-nums"
        />
      </Field>
      <Field label="Contingency budget">
        <Input
          type="number"
          min={0}
          value={draft.contingency || ""}
          onChange={(e) => update("contingency", Number(e.target.value))}
          className="rounded-xl tabular-nums"
        />
      </Field>

      <div className="md:col-span-2">
        <Card className="rounded-xl border-border/70 bg-muted/30">
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <Stat label="Total budget" value={formatMoney(draft.budget, draft.currency)} />
            <Stat label="Initial" value={formatMoney(draft.initialAllocation, draft.currency)} />
            <Stat label="Contingency" value={formatMoney(draft.contingency, draft.currency)} />
            <Stat
              label="Unallocated"
              value={formatMoney(remaining, draft.currency)}
              tone={remaining < 0 ? "destructive" : "default"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Step: Workforce ---------------- */

function WorkforceStep({
  draft,
  update,
  errors,
}: {
  draft: NewProjectDraft;
  update: <K extends keyof NewProjectDraft>(k: K, v: NewProjectDraft[K]) => void;
  errors: Record<string, string>;
}) {
  const toggleSkill = (skill: string) => {
    const has = draft.requiredSkills.includes(skill);
    update("requiredSkills", has
      ? draft.requiredSkills.filter((s) => s !== skill)
      : [...draft.requiredSkills, skill]);
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PersonSelect label="Project Manager" required value={draft.projectManager} onChange={(v) => update("projectManager", v)} error={errors.projectManager} />
        <PersonSelect label="Architect" value={draft.architect} onChange={(v) => update("architect", v)} />
        <PersonSelect label="Lead Engineer" value={draft.leadEngineer} onChange={(v) => update("leadEngineer", v)} />
        <PersonSelect label="HR Representative" value={draft.hrRepresentative} onChange={(v) => update("hrRepresentative", v)} />
        <PersonSelect label="Finance Officer" value={draft.financeOfficer} onChange={(v) => update("financeOfficer", v)} />
        <PersonSelect label="Site Supervisor" value={draft.siteSupervisor} onChange={(v) => update("siteSupervisor", v)} />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Expected workforce size">
          <Input
            type="number"
            min={0}
            value={draft.workforceSize || ""}
            onChange={(e) => update("workforceSize", Number(e.target.value))}
            className="rounded-xl tabular-nums"
          />
        </Field>
        <Field label="Estimated labor cost">
          <Input
            type="number"
            min={0}
            value={draft.estimatedLaborCost || ""}
            onChange={(e) => update("estimatedLaborCost", Number(e.target.value))}
            className="rounded-xl tabular-nums"
          />
        </Field>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-medium">Required skills</Label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => {
            const active = draft.requiredSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={active}
              >
                {active && <Check className="h-3 w-3" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PersonSelect({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Assign team member" /></SelectTrigger>
        <SelectContent>
          {TEAM_MEMBERS.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name} <span className="text-muted-foreground">· {m.role}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

/* ---------------- Step: Documents ---------------- */

const DOC_CATEGORIES: UploadedDoc["category"][] = [
  "Contract",
  "Proposal",
  "Blueprint",
  "Scope of Work",
  "Permit",
  "Supporting",
];

function DocumentsStep({
  draft,
  update,
}: {
  draft: NewProjectDraft;
  update: <K extends keyof NewProjectDraft>(k: K, v: NewProjectDraft[K]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState<UploadedDoc["category"]>("Contract");

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const invalid = list.filter((f) => f.size > 20 * 1024 * 1024);
    if (invalid.length) {
      toast.error("Some files exceed the 20 MB limit and were skipped.");
    }
    const valid = list.filter((f) => f.size <= 20 * 1024 * 1024);
    const next: UploadedDoc[] = valid.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      category,
      size: f.size,
      progress: 100,
    }));
    update("documents", [...draft.documents, ...next]);
    if (next.length) toast.success(`${next.length} file(s) uploaded`);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const remove = (id: string) => {
    update("documents", draft.documents.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Category">
          <Select value={category} onValueChange={(v) => setCategory(v as UploadedDoc["category"])}>
            <SelectTrigger className="w-full rounded-xl sm:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DOC_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30",
        )}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">Drag and drop files here</p>
        <p className="text-xs text-muted-foreground">or click to browse (max 20 MB per file)</p>
        <label className="mt-2">
          <input type="file" multiple className="sr-only" onChange={onSelect} />
          <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <Plus className="h-3.5 w-3.5" /> Choose files
          </span>
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-xs font-medium">Uploaded documents</Label>
          <span className="text-xs text-muted-foreground">{draft.documents.length} file(s)</span>
        </div>
        {draft.documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No files uploaded yet.
          </div>
        ) : (
          <ScrollArea className="max-h-64 rounded-xl border border-border">
            <ul className="divide-y divide-border">
              {draft.documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{doc.name}</span>
                      <Badge variant="outline" className="rounded-full text-[10px]">{doc.category}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{formatBytes(doc.size)}</span>
                      <span>·</span>
                      <span>Uploaded</span>
                    </div>
                    <Progress value={doc.progress} className="mt-1.5 h-1" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => remove(doc.id)}
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step: AI Validation ---------------- */

function AIStep({ ai, completion }: { ai: AIReview; completion: number }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ScoreTile label="Completeness" value={`${completion}%`} tone={completion >= 80 ? "success" : completion >= 50 ? "warning" : "destructive"} />
        <ScoreTile label="AI confidence" value={`${ai.confidence}%`} tone={ai.confidence >= 75 ? "success" : ai.confidence >= 50 ? "warning" : "destructive"} />
        <ScoreTile label="Risk level" value={ai.riskLevel} tone={ai.riskLevel === "Low" ? "success" : ai.riskLevel === "Medium" ? "warning" : "destructive"} />
      </div>

      {ai.warnings.length > 0 && (
        <Alert className="rounded-xl border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning-foreground" />
          <AlertTitle className="text-sm">Warnings</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
              {ai.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h4 className="mb-2 text-sm font-medium">Recommended actions</h4>
        <ul className="space-y-2">
          {ai.recommendations.map((r) => (
            <li key={r} className="flex items-start gap-2 rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-ai" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-muted-foreground">
        AI only recommends — no fields are modified automatically.
      </p>
    </div>
  );
}

/* ---------------- Step: Review ---------------- */

function ReviewStep({
  draft,
  ai,
  onEdit,
}: {
  draft: NewProjectDraft;
  ai: AIReview;
  onEdit: (i: number) => void;
}) {
  return (
    <div className="space-y-4">
      <ReviewSection title="General information" onEdit={() => onEdit(0)}>
        <ReviewRow k="Name" v={draft.name || "—"} />
        <ReviewRow k="Code" v={draft.code || "—"} />
        <ReviewRow k="Client" v={draft.client || "—"} />
        <ReviewRow k="Type" v={draft.projectType || "—"} />
        <ReviewRow k="Category" v={draft.category || "—"} />
        <ReviewRow k="Priority" v={draft.priority} />
        <ReviewRow k="Status" v={draft.status} />
        <ReviewRow k="Timeline" v={`${draft.startDate || "—"} → ${draft.endDate || "—"}`} />
      </ReviewSection>

      <ReviewSection title="Location" onEdit={() => onEdit(1)}>
        <ReviewRow k="Address" v={draft.address || "—"} />
        <ReviewRow k="Province / City" v={`${draft.province || "—"} / ${draft.city || "—"}`} />
        <ReviewRow k="Barangay" v={draft.barangay || "—"} />
        <ReviewRow k="Zip" v={draft.zipCode || "—"} />
      </ReviewSection>

      <ReviewSection title="Financial" onEdit={() => onEdit(2)}>
        <ReviewRow k="Budget" v={formatMoney(draft.budget, draft.currency)} />
        <ReviewRow k="Initial allocation" v={formatMoney(draft.initialAllocation, draft.currency)} />
        <ReviewRow k="Contingency" v={formatMoney(draft.contingency, draft.currency)} />
        <ReviewRow k="Funding" v={draft.fundingSource || "—"} />
        <ReviewRow k="Payment schedule" v={draft.paymentSchedule || "—"} />
        <ReviewRow k="Tax" v={draft.taxCategory} />
      </ReviewSection>

      <ReviewSection title="Assignments" onEdit={() => onEdit(3)}>
        <ReviewRow k="Project Manager" v={personName(draft.projectManager)} />
        <ReviewRow k="Architect" v={personName(draft.architect)} />
        <ReviewRow k="Lead Engineer" v={personName(draft.leadEngineer)} />
        <ReviewRow k="HR" v={personName(draft.hrRepresentative)} />
        <ReviewRow k="Finance" v={personName(draft.financeOfficer)} />
        <ReviewRow k="Site Supervisor" v={personName(draft.siteSupervisor)} />
        <ReviewRow k="Workforce size" v={String(draft.workforceSize || 0)} />
        <ReviewRow k="Skills" v={draft.requiredSkills.join(", ") || "—"} />
      </ReviewSection>

      <ReviewSection title="Documents" onEdit={() => onEdit(4)}>
        {draft.documents.length === 0 ? (
          <p className="text-xs text-muted-foreground">No documents uploaded.</p>
        ) : (
          <ul className="space-y-1 text-xs">
            {draft.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2">
                <span className="truncate">{d.name}</span>
                <Badge variant="outline" className="rounded-full text-[10px]">{d.category}</Badge>
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>

      <ReviewSection title="AI recommendations" onEdit={() => onEdit(5)}>
        <ReviewRow k="Confidence" v={`${ai.confidence}%`} />
        <ReviewRow k="Risk level" v={ai.riskLevel} />
        {ai.recommendations.length > 0 && (
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
            {ai.recommendations.slice(0, 3).map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
      </ReviewSection>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <Card className="rounded-xl border-border/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 py-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-7 rounded-lg text-xs">Edit</Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-6 gap-y-1.5 p-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function ReviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{k}</span>
      <span className="max-w-[60%] truncate text-right font-medium">{v}</span>
    </div>
  );
}

/* ---------------- Right sidebar cards ---------------- */

function SummaryCard({ draft, completion }: { draft: NewProjectDraft; completion: number }) {
  const durationDays = draft.startDate && draft.endDate
    ? Math.max(0, Math.round((+new Date(draft.endDate) - +new Date(draft.startDate)) / 86_400_000))
    : 0;
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Project summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium tabular-nums">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>
        <Separator />
        <SummaryRow label="Name" value={draft.name || "—"} />
        <SummaryRow label="Code" value={draft.code || "—"} mono />
        <SummaryRow label="Budget" value={formatMoney(draft.budget, draft.currency)} />
        <SummaryRow label="Workforce" value={draft.workforceSize ? `${draft.workforceSize} people` : "—"} />
        <SummaryRow label="Timeline" value={durationDays ? `${durationDays} days` : "—"} />
        <SummaryRow label="Priority" value={draft.priority} />
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("max-w-[60%] truncate text-right font-medium", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function AIInsightsCard({ ai }: { ai: AIReview }) {
  return (
    <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-ai" />
          <CardTitle className="text-sm">AI insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium tabular-nums">{ai.confidence}%</span>
        </div>
        <Progress value={ai.confidence} className="h-1.5" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Risk</span>
          <Badge variant="outline" className="rounded-full text-[10px]">{ai.riskLevel}</Badge>
        </div>
        {ai.recommendations.slice(0, 2).map((r) => (
          <p key={r} className="text-[11px] text-muted-foreground">• {r}</p>
        ))}
      </CardContent>
    </Card>
  );
}

function ValidationCard({ validation }: { validation: ValidationResult }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {validation.items.map((v) => (
          <div key={v.label} className="flex items-start gap-2 text-xs">
            {v.ok ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-success" />
            ) : (
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-warning-foreground" />
            )}
            <div>
              <p className={cn("font-medium", !v.ok && "text-warning-foreground")}>{v.label}</p>
              {v.detail && <p className="text-[11px] text-muted-foreground">{v.detail}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------- Primitives ---------------- */

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "destructive" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm font-semibold tabular-nums", tone === "destructive" && "text-destructive")}>{value}</p>
    </div>
  );
}

function ScoreTile({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "destructive" }) {
  const toneMap = {
    success: "border-success/30 bg-success/5 text-success",
    warning: "border-warning/30 bg-warning/5 text-warning-foreground",
    destructive: "border-destructive/30 bg-destructive/5 text-destructive",
  } as const;
  return (
    <div className={cn("rounded-xl border p-3", toneMap[tone])}>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function formatMoney(n: number, currency: string) {
  if (!n) return `${currency} 0`;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function personName(id: string) {
  return TEAM_MEMBERS.find((m) => m.id === id)?.name ?? "—";
}

/* ---------------- Validation logic ---------------- */

function validateForStep(step: StepKey, d: NewProjectDraft): Record<string, string> {
  const errs: Record<string, string> = {};
  if (step === "basics") {
    if (!d.name.trim()) errs.name = "Project name is required.";
    if (!d.code.trim()) errs.code = "Project code is required.";
    else if (!/^[A-Z0-9-]{3,}$/.test(d.code)) errs.code = "Use uppercase letters, numbers, dashes.";
    if (!d.client.trim()) errs.client = "Client is required.";
    if (!d.projectType) errs.projectType = "Select a project type.";
    if (!d.startDate) errs.startDate = "Start date is required.";
    if (!d.endDate) errs.endDate = "End date is required.";
    if (d.startDate && d.endDate && new Date(d.endDate) <= new Date(d.startDate)) {
      errs.endDate = "End date must be after start date.";
    }
  }
  if (step === "location") {
    if (!d.address.trim()) errs.address = "Address is required.";
    if (!d.province) errs.province = "Province is required.";
    if (!d.city.trim()) errs.city = "City is required.";
  }
  if (step === "financial") {
    if (!d.budget || d.budget <= 0) errs.budget = "Budget must be greater than zero.";
    if (d.initialAllocation + d.contingency > d.budget) {
      errs.initialAllocation = "Allocation + contingency exceeds total budget.";
    }
  }
  if (step === "workforce") {
    if (!d.projectManager) errs.projectManager = "Project Manager is required.";
  }
  return errs;
}

interface ValidationItem { label: string; ok: boolean; detail?: string }
interface ValidationResult { items: ValidationItem[]; ok: boolean }

function runValidation(d: NewProjectDraft): ValidationResult {
  const items: ValidationItem[] = [
    { label: "Basic information", ok: !!(d.name && d.code && d.client && d.projectType) },
    { label: "Timeline set", ok: !!(d.startDate && d.endDate && new Date(d.endDate) > new Date(d.startDate)) },
    { label: "Location provided", ok: !!(d.address && d.province && d.city) },
    { label: "Budget defined", ok: d.budget > 0 },
    {
      label: "Budget allocation balanced",
      ok: d.budget === 0 || d.initialAllocation + d.contingency <= d.budget,
      detail: d.initialAllocation + d.contingency > d.budget ? "Over-allocated" : undefined,
    },
    { label: "Project Manager assigned", ok: !!d.projectManager },
    { label: "Documents attached", ok: d.documents.length > 0, detail: d.documents.length === 0 ? "Optional but recommended" : undefined },
  ];
  return { items, ok: items.every((i) => i.ok) };
}

function computeCompletion(d: NewProjectDraft): number {
  const checks = [
    d.name, d.code, d.client, d.projectType, d.category, d.description,
    d.startDate, d.endDate,
    d.address, d.province, d.city,
    d.budget > 0, d.currency, d.paymentSchedule, d.fundingSource,
    d.projectManager, d.workforceSize > 0, d.requiredSkills.length > 0,
    d.documents.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

interface AIReview {
  confidence: number;
  riskLevel: "Low" | "Medium" | "High";
  warnings: string[];
  recommendations: string[];
}

function runAIReview(d: NewProjectDraft, v: ValidationResult, completion: number): AIReview {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (d.budget > 0 && d.contingency / d.budget < 0.05) {
    warnings.push("Contingency budget is below 5% of total — consider raising for risk buffer.");
  }
  if (d.startDate && d.endDate) {
    const days = Math.round((+new Date(d.endDate) - +new Date(d.startDate)) / 86_400_000);
    if (days > 0 && days < 60) warnings.push("Timeline under 60 days is aggressive for construction scope.");
  }
  if (d.workforceSize && d.budget && d.estimatedLaborCost === 0) {
    recommendations.push("Estimate labor cost to enable payroll forecasting for HR & Finance.");
  }
  if (d.documents.length === 0) recommendations.push("Attach the signed contract and scope of work to activate approvals.");
  if (!d.category) recommendations.push("Set a construction category to unlock category-based analytics.");
  if (d.priority === "Critical" && !d.siteSupervisor) recommendations.push("Assign a site supervisor for a Critical-priority project.");
  if (recommendations.length === 0) recommendations.push("Project looks well-formed. You're ready to create it.");

  const riskScore = warnings.length * 20 + (v.ok ? 0 : 15) + (completion < 60 ? 20 : 0);
  const riskLevel: AIReview["riskLevel"] = riskScore >= 40 ? "High" : riskScore >= 20 ? "Medium" : "Low";
  const confidence = Math.max(20, Math.min(98, completion - warnings.length * 8));

  return { confidence, riskLevel, warnings, recommendations };
}
