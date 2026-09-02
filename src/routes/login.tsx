import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | EasyConstruct Construction Decision Support" },
      {
        name: "description",
        content:
          "Sign in to EasyConstruct to manage construction projects, workforce, finance and AI-assisted decision support.",
      },
      { property: "og:title", content: "Sign in | EasyConstruct" },
      {
        property: "og:description",
        content:
          "Secure access to the EasyConstruct construction operations workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthShell>
      <h1 className="sr-only">Sign in to EasyConstruct</h1>
      <LoginForm />
    </AuthShell>
  );
}
