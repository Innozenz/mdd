"use client";

import { useActionState } from "react";
import type { Topic } from "@prisma/client";

import { createArticleAction } from "@/features/articles/actions";
import { ARTICLE_LIMITS } from "@/lib/definitions/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Formulaire de création d'un article : choix du thème, titre et contenu.
 * L'auteur et la date sont ajoutés côté serveur.
 */
export const ArticleForm = ({ topics }: { topics: Topic[] }) => {
  const [state, formAction, isPending] = useActionState(
    createArticleAction,
    null,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.message && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="topicId">Thème</Label>
        <select
          id="topicId"
          name="topicId"
          required
          defaultValue={state?.values?.topicId ?? ""}
          aria-invalid={!!state?.errors?.topicId}
          aria-describedby={state?.errors?.topicId ? "topicId-error" : undefined}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive"
        >
          <option value="" disabled>
            Choisir un thème…
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        {state?.errors?.topicId && (
          <p id="topicId-error" className="text-sm text-destructive">
            {state.errors.topicId[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          minLength={ARTICLE_LIMITS.titleMin}
          maxLength={ARTICLE_LIMITS.titleMax}
          defaultValue={state?.values?.title}
          aria-invalid={!!state?.errors?.title}
          aria-describedby={state?.errors?.title ? "title-error" : undefined}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-destructive">
            {state.errors.title[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={8}
          maxLength={ARTICLE_LIMITS.contentMax}
          defaultValue={state?.values?.content}
          aria-invalid={!!state?.errors?.content}
          aria-describedby={state?.errors?.content ? "content-error" : undefined}
        />
        {state?.errors?.content && (
          <p id="content-error" className="text-sm text-destructive">
            {state.errors.content[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Publication…" : "Publier l'article"}
      </Button>
    </form>
  );
};
