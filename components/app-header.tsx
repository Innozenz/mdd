"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";

import { logoutAction } from "@/features/auth/actions";
import { MddLogo } from "@/components/mdd-logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/feed", label: "Articles" },
  { href: "/themes", label: "Thèmes" },
];

/**
 * En-tête de navigation des pages authentifiées (conforme aux maquettes) :
 * logo MDD, liens Articles / Thèmes, accès au profil et déconnexion.
 * Responsive : menu déroulant (hamburger) sur mobile.
 */
export const AppHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive(href) ? "text-primary" : "text-foreground",
    );

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/feed" aria-label="Accueil MDD">
          <MddLogo className="h-9" />
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile"
            aria-label="Mon profil"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent",
              isActive("/profile") && "border-primary text-primary",
            )}
          >
            <User className="size-4" aria-hidden="true" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
            >
              Se déconnecter
            </button>
          </form>
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border sm:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <nav
          aria-label="Navigation principale"
          className="flex flex-col gap-1 border-t px-4 py-3 sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn("rounded-md px-3 py-2 text-sm font-medium", linkClass(link.href))}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={cn("rounded-md px-3 py-2 text-sm font-medium", linkClass("/profile"))}
          >
            Mon profil
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive"
            >
              Se déconnecter
            </button>
          </form>
        </nav>
      )}
    </header>
  );
};
