"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/features/profile/actions";
import { AUTH_LIMITS } from "@/lib/definitions/auth";
import type { UserProfile } from "@/features/profile/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Formulaire de modification du profil : e-mail, nom d'utilisateur et
 * (optionnellement) mot de passe. Les champs sont pré-remplis avec les valeurs
 * actuelles ; le mot de passe reste vide et n'est changé que s'il est saisi.
 */
export const ProfileForm = ({ profile }: { profile: UserProfile }) => {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.success && state?.message && (
        <p
          role="status"
          className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary"
        >
          {state.message}
        </p>
      )}
      {!state?.success && state?.message && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.values?.email ?? profile.email}
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
        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          minLength={AUTH_LIMITS.usernameMin}
          maxLength={AUTH_LIMITS.usernameMax}
          required
          defaultValue={state?.values?.username ?? profile.username}
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
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!state?.errors?.password}
          aria-describedby="password-hint password-error"
        />
        <p id="password-hint" className="text-xs text-muted-foreground">
          Laissez vide pour ne pas le changer. Sinon : au moins{" "}
          {AUTH_LIMITS.passwordMin} caractères, avec minuscule, majuscule,
          chiffre et caractère spécial.
        </p>
        {state?.errors?.password && (
          <ul id="password-error" className="space-y-1 text-sm text-destructive">
            {state.errors.password.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
};
