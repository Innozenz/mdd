import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Connexion — MDD",
};

const LoginPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Accueil
      </Link>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
