import type { CommentWithAuthor } from "@/features/comments/data";
import { formatDate } from "@/lib/format";

/**
 * Liste des commentaires d'un article (non récursifs), du plus ancien au plus
 * récent. Affiche l'auteur, la date et le contenu de chaque commentaire.
 */
export const CommentList = ({
  comments,
}: {
  comments: CommentWithAuthor[];
}) => {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun commentaire pour le moment. Soyez le premier à réagir.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-lg border p-4">
          <p className="text-sm font-medium">
            {comment.author.username}{" "}
            <span className="font-normal text-muted-foreground">
              · {formatDate(comment.createdAt)}
            </span>
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {comment.content}
          </p>
        </li>
      ))}
    </ul>
  );
};
