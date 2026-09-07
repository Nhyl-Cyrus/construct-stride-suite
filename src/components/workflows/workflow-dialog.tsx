import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export interface WorkflowField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "select";
  options?: string[];
  placeholder?: string;
  span?: 1 | 2;
  defaultValue?: string;
}

export type WorkflowValues = Record<string, string>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  fields: WorkflowField[];
  /** Return true when the record was saved; the dialog then closes and resets. */
  onSubmit: (values: WorkflowValues) => Promise<boolean>;
  disabled?: boolean;
  disabledReason?: string;
  footerNote?: ReactNode;
}

function initial(fields: WorkflowField[]): WorkflowValues {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.defaultValue ?? ""]),
  ) as WorkflowValues;
}

/**
 * Generic create-record dialog used by the primary action of each workspace.
 * Validation, permissions and persistence live in the service layer; this
 * component only collects values and reports the outcome.
 */
export function WorkflowDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Submit",
  fields,
  onSubmit,
  disabled,
  disabledReason,
  footerNote,
}: Props) {
  const [values, setValues] = useState<WorkflowValues>(() => initial(fields));
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const submit = async () => {
    setSaving(true);
    try {
      const ok = await onSubmit(values);
      if (ok) {
        setValues(initial(fields));
        onOpenChange(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {disabled ? (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {disabledReason ?? "Your role does not have permission for this action."}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={`space-y-1.5 ${f.span === 2 ? "sm:col-span-2" : ""}`}
              >
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={values[f.name] ?? ""}
                    onValueChange={(v) => set(f.name, v)}
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder={f.placeholder ?? "Select…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {footerNote}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving || disabled}>
            {saving ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
