import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  User as UserIcon,
  Building2,
  Bell,
  Palette,
  Plug,
  ShieldCheck,
  KeyRound,
  Trash2,
  Save,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EasyConstruct" },
      { name: "description", content: "Profile, workspace, notifications, integrations, and security settings." },
    ],
  }),
  component: Page,
});

const integrations = [
  { name: "Autodesk Construction Cloud", description: "Sync BIM 360 documents and RFIs", connected: true },
  { name: "Procore", description: "Bi-directional daily log and submittal sync", connected: false },
  { name: "Slack", description: "Push approvals and risk alerts to channels", connected: true },
  { name: "QuickBooks", description: "Post committed cost updates nightly", connected: false },
  { name: "DocuSign", description: "Electronic signature on approvals", connected: true },
];

function Page() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "Maya Rivera",
    email: "maya.rivera@easyconstruct.io",
    title: "Senior Project Manager",
    phone: "+1 (602) 555-0198",
    bio: "PMP-certified PM leading Westgate Medical Tower and 4 concurrent programs across the Southwest.",
  });
  const [notifs, setNotifs] = useState({
    approvals: true,
    tasks: true,
    risks: true,
    deadlines: true,
    weekly: false,
    email: true,
    push: true,
  });
  const [workspace, setWorkspace] = useState({
    name: "EasyConstruct — Westgate PMO",
    timezone: "America/Phoenix",
    currency: "USD",
    week: "Monday",
  });

  const save = (label: string) => toast.success(`${label} saved`);

  return (
    <>
      <TopBar title="Settings" subtitle="Manage your account, workspace, and integrations" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">Personalize EasyConstruct for you and your team.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-5">
          <TabsList className="h-10 rounded-xl">
            <TabsTrigger value="profile" className="gap-1.5 rounded-lg text-xs">
              <UserIcon className="h-3.5 w-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger value="workspace" className="gap-1.5 rounded-lg text-xs">
              <Building2 className="h-3.5 w-3.5" /> Workspace
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 rounded-lg text-xs">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1.5 rounded-lg text-xs">
              <Palette className="h-3.5 w-3.5" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-1.5 rounded-lg text-xs">
              <Plug className="h-3.5 w-3.5" /> Integrations
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 rounded-lg text-xs">
              <ShieldCheck className="h-3.5 w-3.5" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Personal information</CardTitle>
                <CardDescription>How you appear across projects and approvals.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                <Field label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
                <Field label="Job title" value={profile.title} onChange={(v) => setProfile({ ...profile, title: v })} />
                <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button className="rounded-xl" onClick={() => save("Profile")}>
                    <Save className="h-4 w-4" /> Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Workspace</CardTitle>
                <CardDescription>Defaults applied to every new project in this workspace.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Workspace name"
                  value={workspace.name}
                  onChange={(v) => setWorkspace({ ...workspace, name: v })}
                />
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select
                    value={workspace.timezone}
                    onValueChange={(v) => setWorkspace({ ...workspace, timezone: v })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Phoenix">America/Phoenix</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select
                    value={workspace.currency}
                    onValueChange={(v) => setWorkspace({ ...workspace, currency: v })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — Pound Sterling</SelectItem>
                      <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>First day of week</Label>
                  <Select
                    value={workspace.week}
                    onValueChange={(v) => setWorkspace({ ...workspace, week: v })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button className="rounded-xl" onClick={() => save("Workspace")}>
                    <Save className="h-4 w-4" /> Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Notification preferences</CardTitle>
                <CardDescription>Choose what reaches your inbox, email, and mobile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Approvals awaiting my review"
                  hint="Change orders, RFIs, submittals"
                  value={notifs.approvals}
                  onChange={(v) => setNotifs({ ...notifs, approvals: v })}
                />
                <ToggleRow
                  label="Task assignments"
                  hint="When a task is assigned or reassigned to me"
                  value={notifs.tasks}
                  onChange={(v) => setNotifs({ ...notifs, tasks: v })}
                />
                <ToggleRow
                  label="Risk escalations"
                  hint="AI-detected likelihood or severity increases"
                  value={notifs.risks}
                  onChange={(v) => setNotifs({ ...notifs, risks: v })}
                />
                <ToggleRow
                  label="Deadline reminders"
                  hint="72h and 24h reminders on due milestones"
                  value={notifs.deadlines}
                  onChange={(v) => setNotifs({ ...notifs, deadlines: v })}
                />
                <ToggleRow
                  label="Weekly executive digest"
                  hint="Sundays 8pm local time"
                  value={notifs.weekly}
                  onChange={(v) => setNotifs({ ...notifs, weekly: v })}
                />
                <Separator />
                <ToggleRow
                  label="Email delivery"
                  hint="maya.rivera@easyconstruct.io"
                  value={notifs.email}
                  onChange={(v) => setNotifs({ ...notifs, email: v })}
                />
                <ToggleRow
                  label="Mobile push"
                  hint="EasyConstruct app on iOS + Android"
                  value={notifs.push}
                  onChange={(v) => setNotifs({ ...notifs, push: v })}
                />
                <div className="flex justify-end">
                  <Button className="rounded-xl" onClick={() => save("Notification preferences")}>
                    <Save className="h-4 w-4" /> Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription>Match EasyConstruct to your environment.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      toast.success(`Theme set to ${t}`);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      theme === t ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/40"
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{t}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t === "light" && "Bright, high-contrast for daylight work."}
                      {t === "dark" && "Reduced glare for night and control rooms."}
                      {t === "system" && "Match your operating system."}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Integrations</CardTitle>
                <CardDescription>Connect construction and finance tools to EasyConstruct.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {integrations.map((i) => (
                  <div
                    key={i.name}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {i.name}
                        {i.connected && (
                          <Badge variant="outline" className="rounded-full border-success/30 bg-success/10 text-success">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{i.description}</div>
                    </div>
                    <Button
                      variant={i.connected ? "outline" : "default"}
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        toast.success(i.connected ? `${i.name} disconnected` : `${i.name} connected`)
                      }
                    >
                      {i.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="rounded-2xl border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Password & access</CardTitle>
                  <CardDescription>Keep your account safe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl"
                    onClick={() => toast.info("Password reset email sent")}
                  >
                    <KeyRound className="h-4 w-4" /> Change password
                  </Button>
                  <ToggleRow
                    label="Two-factor authentication"
                    hint="Require a 6-digit code on new devices"
                    value
                    onChange={() => toast.success("2FA updated")}
                  />
                  <ToggleRow
                    label="Single sign-on (SAML)"
                    hint="Enterprise IdP required"
                    value={false}
                    onChange={() => toast.info("Contact your admin to enable SSO")}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-destructive/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
                  <CardDescription>Irreversible actions on your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start rounded-xl text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete your EasyConstruct account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes access to all projects, tasks, and documents. Your
                          workspace admins will be notified.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => toast.success("Deletion scheduled for 30 days")}
                        >
                          Delete account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl" />
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
