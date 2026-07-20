import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ARCHITECT_PEOPLE } from "@/app/models/architect";
import { DesignFileDropzone } from "./design-file-dropzone";
import type { WizardFile } from "@/app/models/architect";

// ---------- Upload Drawing ----------
export function UploadDrawingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [files, setFiles] = useState<WizardFile[]>([]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload drawing</DialogTitle>
          <DialogDescription>
            Add new DWG, PDF, RVT or IFC drawings to the design library.
          </DialogDescription>
        </DialogHeader>
        <DesignFileDropzone files={files} onChange={setFiles} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              toast.success(`${files.length} file${files.length === 1 ? "" : "s"} uploaded`);
              setFiles([]);
              onOpenChange(false);
            }}
            disabled={files.length === 0}
          >
            Upload {files.length > 0 ? `(${files.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Submit Review ----------
export function SubmitReviewDialog({
  open,
  onOpenChange,
  designName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  designName?: string;
}) {
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [priority, setPriority] = useState("Medium");
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const toggle = (id: string) =>
    setReviewers((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit for review</DialogTitle>
          <DialogDescription>
            {designName ?? "Selected design"} will be routed to the chosen reviewers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reviewers</Label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border p-2">
              {ARCHITECT_PEOPLE.map((p) => (
                <label key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/40">
                  <Checkbox checked={reviewers.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                  <span className="text-sm">{p.name}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{p.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due">Due date</Label>
              <Input id="due" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="h-9 rounded-lg" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Context for reviewers" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={reviewers.length === 0 || !due}
            onClick={() => {
              toast.success("Review submitted", { description: `${reviewers.length} reviewer(s) notified.` });
              onOpenChange(false);
            }}
          >
            Submit review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Create Revision ----------
export function CreateRevisionDialog({
  open,
  onOpenChange,
  designName,
  parentVersion = "v1.0",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  designName?: string;
  parentVersion?: string;
}) {
  const [version, setVersion] = useState("");
  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");
  const [sheets, setSheets] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create revision</DialogTitle>
          <DialogDescription>
            {designName ?? "Design"} — branching from {parentVersion}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Parent version</Label>
              <Input value={parentVersion} disabled className="h-9 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ver">New version</Label>
              <Input id="ver" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.1" className="h-9 rounded-lg" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason for revision</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Client feedback, code compliance…" className="h-9 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sum">Change summary</Label>
            <Textarea id="sum" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What changed?" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sheets">Affected sheets</Label>
            <Input id="sheets" value={sheets} onChange={(e) => setSheets(e.target.value)} placeholder="A-101, A-102" className="h-9 rounded-lg" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!version || !reason || !summary}
            onClick={() => {
              toast.success("Revision drafted", { description: `${version} branched from ${parentVersion}.` });
              onOpenChange(false);
            }}
          >
            Create revision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Approval Dialog ----------
export function ApprovalDialog({
  open,
  onOpenChange,
  mode,
  entity,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "approve" | "reject" | "changes";
  entity: string;
}) {
  const [note, setNote] = useState("");
  const meta = {
    approve: { title: "Approve", cta: "Approve", tone: "" },
    reject: { title: "Reject", cta: "Reject", tone: "destructive" as const },
    changes: { title: "Request changes", cta: "Send request", tone: "" },
  }[mode];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{meta.title} · {entity}</DialogTitle>
          <DialogDescription>Add optional notes for the record.</DialogDescription>
        </DialogHeader>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional notes" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant={meta.tone as "default" | "destructive" | undefined}
            onClick={() => {
              toast.success(`${meta.title} recorded`, { description: entity });
              onOpenChange(false);
            }}
          >
            {meta.cta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Comment Dialog ----------
export function CommentDialog({
  open,
  onOpenChange,
  target,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  target: string;
}) {
  const [body, setBody] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add comment</DialogTitle>
          <DialogDescription>Comment on {target}. Use @name to mention.</DialogDescription>
        </DialogHeader>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your comment…" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!body.trim()}
            onClick={() => {
              toast.success("Comment posted");
              setBody("");
              onOpenChange(false);
            }}
          >
            Post comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Delete / Archive confirmation ----------
export function DestructiveConfirm({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onConfirm,
  destructive = true,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  actionLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            onClick={onConfirm}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------- Simple presentational wrapper for arbitrary dialogs ----------
export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
