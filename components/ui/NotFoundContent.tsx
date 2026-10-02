"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

/** Translated 404 body (client: follows the language store). */
export default function NotFoundContent() {
  const { dict } = useLanguage();
  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 px-5 md:px-16">
      <p className="label">404</p>
      <h1 className="display display-lg">{dict.notFound.title}</h1>
      <Link href="/" className="btn">
        {dict.notFound.back}
      </Link>
    </main>
  );
}
