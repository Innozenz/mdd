import { AppHeader } from "@/components/app-header";

/**
 * Layout des pages authentifiées : en-tête de navigation commun (logo,
 * Articles, Thèmes, profil, déconnexion) et zone de contenu principale.
 * Chaque page gère sa propre largeur de contenu à l'intérieur du `<main>`.
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Aller au contenu
      </a>
      <AppHeader />
      <main id="main-content">{children}</main>
    </>
  );
};

export default AppLayout;
