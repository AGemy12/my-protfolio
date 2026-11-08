import Link from "next/link";
import "./globals.css";

// Shown for paths outside a known language, such as /fr.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto grid min-h-svh max-w-[560px] content-center gap-4 px-6">
          <h1 className="text-4xl">Page not found</h1>
          <p className="text-muted">
            <Link href="/en" className="text-accent underline underline-offset-4">
              Go to the English site
            </Link>{" "}
            ·{" "}
            <Link href="/ar" lang="ar" className="text-accent underline underline-offset-4">
              الموقع العربي
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
