import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Info } from "lucide-react";
import { TopBar } from "@/components/top-bar";
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

export const Route = createFileRoute("/_app/projects/new")({
  head: () => ({
    meta: [
      { title: "Create project — EasyConstruct" },
      { name: "description", content: "Create a new construction project." },
    ],
  }),
  component: NewProjectPage,
});

function NewProjectPage() {
  return (
    <>
      <TopBar title="Create project" subtitle="Set up a new engagement in 3 sections" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <form className="space-y-5">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Basics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Project name" required>
                  <Input placeholder="e.g. Westgate Medical Tower" className="rounded-xl" />
                </Field>
                <Field label="Project code" required>
                  <Input placeholder="WMT-204" className="rounded-xl font-mono" />
                </Field>
                <Field label="Client" required>
                  <Input placeholder="Westgate Health Network" className="rounded-xl" />
                </Field>
                <Field label="Sector">
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <Textarea
                      placeholder="Short scope summary used by the AI to generate proposals and risk baselines."
                      className="min-h-[88px] rounded-xl"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Schedule & budget</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Start date">
                  <Input type="date" className="rounded-xl" />
                </Field>
                <Field label="Target completion">
                  <Input type="date" className="rounded-xl" />
                </Field>
                <Field label="Budget (USD)">
                  <Input placeholder="84,500,000" className="rounded-xl tabular-nums" />
                </Field>
                <Field label="Contract type">
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lump">Lump sum</SelectItem>
                      <SelectItem value="gmp">GMP</SelectItem>
                      <SelectItem value="cost">Cost plus</SelectItem>
                      <SelectItem value="unit">Unit price</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Team & governance</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Project Manager">
                  <Select defaultValue="maya">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maya">Maya Rivera</SelectItem>
                      <SelectItem value="tomi">Tomi Okafor</SelectItem>
                      <SelectItem value="sara">Sara Aquino</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Approval workflow">
                  <Select defaultValue="standard">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (PM → Finance → Exec)</SelectItem>
                      <SelectItem value="fast">Expedited (PM → Exec)</SelectItem>
                      <SelectItem value="public">Public works (PM → Compliance → Exec)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Department access">
                  <Select defaultValue="all">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All departments</SelectItem>
                      <SelectItem value="ops">Operations only</SelectItem>
                      <SelectItem value="custom">Custom…</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Visibility">
                  <Select defaultValue="org">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org">Organization</SelectItem>
                      <SelectItem value="team">Project team</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" className="rounded-xl">
                Save draft
              </Button>
              <Button className="rounded-xl">Create project</Button>
            </div>
          </form>

          <aside className="space-y-4">
            <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
              <CardContent className="space-y-3 p-5">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[11px] text-ai"
                >
                  <Sparkles className="mr-1 h-3 w-3" /> AI assistant
                </Badge>
                <h4 className="text-sm font-medium">Generate from a proposal</h4>
                <p className="text-xs text-muted-foreground">
                  Upload a proposal PDF and we'll pre-fill basics, scope, risk baselines, and a
                  suggested milestone schedule.
                </p>
                <Button size="sm" variant="outline" className="w-full rounded-xl">
                  Upload proposal
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-2 p-5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 text-info" />
                  <p>
                    Required fields trigger validation. The system generates a baseline workflow
                    automatically; you can refine it after creation.
                  </p>
                </div>
                <Separator className="my-2" />
                <p>Average setup time: <span className="font-medium text-foreground">3 min</span></p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
