import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Inscription — MDD",
};

const RegisterPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
