"use client";

import { useActionState } from "react";

import { addCommentAction } from "@/features/comments/actions";
import { COMMENT_LIMITS } from "@/lib/definitions/comment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Formulaire d'ajout d'un commentaire à un article.
 * `articleId` est lié à la Server Action ; l'auteur et la date sont ajoutés
 * côté serveur. Le formulaire se vide après un envoi réussi.
 */
export const CommentForm = ({ articleId }: { articleId: string }) => {
  const boundAction = addCommentAction.bind(null, articleId);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  return (
    <form action={formAction} noValidate className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="content">Ajouter un commentaire</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={3}
          maxLength={COMMENT_LIMITS.contentMax}
          placeholder="Votre commentaire…"
          aria-invalid={!!state?.errors?.content}
          aria-describedby={state?.errors?.content ? "content-error" : undefined}
        />
        {state?.errors?.content && (
          <p id="content-error" className="text-sm text-destructive">
            {state.errors.content[0]}
          </p>
        )}
        {state?.message && !state?.errors?.content && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi…" : "Commenter"}
      </Button>
    </form>
  );
};
