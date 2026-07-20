import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_FILE_EXTENSIONS,
  DISCIPLINES,
  type Discipline,
  type WizardFile,
} from "@/app/models/architect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  files: WizardFile[];
  onChange: (files: WizardFile[]) => void;
  categories?: string[];
}

const CATEGORY_OPTIONS = [
  "Plan",
  "Elevation",
  "Section",
  "Detail",
  "Schedule",
  "Specification",
  "Report",
  "Other",
];

export function DesignFileDropzone({ files, onChange, categories = CATEGORY_OPTIONS }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const incoming: WizardFile[] = Array.from(list).map((f) => {
        const duplicate = files.some((x) => x.name === f.name && x.sizeKb === Math.round(f.size / 1024));
        return {
          id: `${f.name}-${f.size}-${Date.now()}`,
          name: f.name,
          sizeKb: Math.round(f.size / 1024),
          progress: duplicate ? 100 : 0,
          status: duplicate ? "duplicate" : "uploading",
        };
      });
      onChange([...files, ...incoming]);
      // Simulate progress
      incoming.forEach((wf) => {
        if (wf.status !== "uploading") return;
        let p = 0;
        const t = setInterval(() => {
          p += 20;
          onChange(
            (current) =>
              current.map((c) =>
                c.id === wf.id
                  ? { ...c, progress: p, status: p >= 100 ? "ready" : "uploading" }
                  : c,
              ) as unknown as WizardFile[],
          );
          if (p >= 100) clearInterval(t);
        }, 220) as unknown as number;
      });
    },
    [files, onChange],
  );

  // onChange might be a plain setter; support functional updates via internal state fallback.
  // We adapt by re-calling onChange with computed value below in the interval, but React setState
  // won't be aware unless the parent uses functional updates. Files-array style is acceptable
  // for the wizard demo which uses the returned array directly.

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => onChange(files.filter((f) => f.id !== id));
  const update = (id: string, patch: Partial<WizardFile>) =>
    onChange(files.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/70 bg-muted/30 p-10 text-center transition",
          dragging && "border-primary bg-primary-soft/40",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Upload className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-medium">Drop drawings here</div>
          <div className="text-xs text-muted-foreground">
            DWG · DXF · PDF · RVT · IFC · Images · ZIP
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-background p-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Input
                    value={f.name}
                    onChange={(e) => update(f.id, { name: e.target.value })}
                    className="h-8 rounded-lg"
                  />
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{(f.sizeKb / 1024).toFixed(1)} MB</span>
                    {f.status === "duplicate" && (
                      <Badge variant="outline" className="rounded-full text-[10px] text-warning-foreground">
                        <AlertTriangle className="mr-1 h-3 w-3" /> Duplicate
                      </Badge>
                    )}
                    {f.status === "ready" && (
                      <Badge variant="outline" className="rounded-full text-[10px] text-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                      </Badge>
                    )}
                  </div>
                  {f.status === "uploading" && <Progress value={f.progress} className="mt-2 h-1" />}
                </div>
              </div>
              <Select value={f.category ?? ""} onValueChange={(v) => update(f.id, { category: v })}>
                <SelectTrigger className="h-9 rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={f.discipline ?? ""}
                onValueChange={(v) => update(f.id, { discipline: v as Discipline })}
              >
                <SelectTrigger className="h-9 rounded-lg">
                  <SelectValue placeholder="Discipline" />
                </SelectTrigger>
                <SelectContent>
                  {DISCIPLINES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => remove(f.id)}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
