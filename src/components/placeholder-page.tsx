import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import type { ReactNode } from "react";

interface PlaceholderProps {
  title: string;
  subtitle: string;
  description: string;
  icon?: ReactNode;
}

export function PlaceholderPage({ title, subtitle, description, icon }: PlaceholderProps) {
  return (
    <>
      <TopBar title={title} subtitle={subtitle} />
      <div className="flex-1 p-4 md:p-8">
        <Card className="rounded-2xl border-dashed border-border/70 shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              {icon ?? <Construction className="h-6 w-6" />}
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <p className="max-w-md text-sm text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
