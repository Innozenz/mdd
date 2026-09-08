"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Formulaire de connexion. L'identifiant accepte l'e-mail OU le nom
 * d'utilisateur. L'état d'erreur provient de la Server Action `loginAction`.
 */
export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Se connecter</CardTitle>
        <CardDescription>
          Accédez à votre fil d&apos;actualité MDD.
        </CardDescription>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-4">
          {state?.message && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.message}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">E-mail ou nom d&apos;utilisateur</Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              defaultValue={state?.values?.identifier}
              required
              aria-invalid={!!state?.errors?.identifier}
              aria-describedby={
                state?.errors?.identifier ? "identifier-error" : undefined
              }
            />
            {state?.errors?.identifier && (
              <p id="identifier-error" className="text-sm text-destructive">
                {state.errors.identifier[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-invalid={!!state?.errors?.password}
              aria-describedby={
                state?.errors?.password ? "password-error" : undefined
              }
            />
            {state?.errors?.password && (
              <p id="password-error" className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Connexion…" : "Se connecter"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
