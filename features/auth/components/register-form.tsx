"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction } from "@/features/auth/actions";
import { AUTH_LIMITS } from "@/lib/definitions/auth";
import { MddLogo } from "@/components/mdd-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Formulaire d'inscription (nom d'utilisateur + e-mail + mot de passe, dans
 * l'ordre des maquettes). En cas de succès, l'utilisateur est connecté
 * automatiquement puis redirigé.
 */
export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <MddLogo className="h-12" />
        <CardTitle className="mt-2">Inscription</CardTitle>
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
            <Label htmlFor="username">Nom d&apos;utilisateur</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              defaultValue={state?.values?.username}
              minLength={AUTH_LIMITS.usernameMin}
              maxLength={AUTH_LIMITS.usernameMax}
              required
              aria-invalid={!!state?.errors?.username}
              aria-describedby={
                state?.errors?.username ? "username-error" : undefined
              }
            />
            {state?.errors?.username && (
              <p id="username-error" className="text-sm text-destructive">
                {state.errors.username[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state?.values?.email}
              required
              aria-invalid={!!state?.errors?.email}
              aria-describedby={state?.errors?.email ? "email-error" : undefined}
            />
            {state?.errors?.email && (
              <p id="email-error" className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              aria-invalid={!!state?.errors?.password}
              aria-describedby="password-hint password-error"
            />
            <p id="password-hint" className="text-xs text-muted-foreground">
              Au moins {AUTH_LIMITS.passwordMin} caractères, avec une minuscule,
              une majuscule, un chiffre et un caractère spécial.
            </p>
            {state?.errors?.password && (
              <ul id="password-error" className="space-y-1 text-sm text-destructive">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Création…" : "S'inscrire"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
