import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

/**
 * Bouton de déconnexion. Rendu serveur : la Server Action `logoutAction`
 * est appelée directement via l'attribut `action` du formulaire.
 */
export const LogoutButton = () => {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline">
        Se déconnecter
      </Button>
    </form>
  );
};
