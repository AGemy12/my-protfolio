"use client";

// Last resort when the locale layout itself fails: it replaces the whole document,
// so there are no app styles, fonts or translations here. Text is in both languages.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          colorScheme: "light dark",
          background: "Canvas",
          color: "CanvasText",
        }}
      >
        <title>Something went wrong</title>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>The site didn&apos;t load properly. Please try again.</p>
          <h2 dir="rtl" lang="ar" style={{ fontSize: 24, margin: "24px 0 0" }}>
            حدث خطأ ما
          </h2>
          <p dir="rtl" lang="ar" style={{ opacity: 0.7 }}>
            لم يتم تحميل الموقع بشكل صحيح. حاول مرة أخرى.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid currentColor", background: "transparent", color: "inherit", cursor: "pointer", font: "inherit" }}
            >
              Try again · حاول مرة أخرى
            </button>
            <a href="/" style={{ padding: "10px 20px", color: "inherit" }}>
              Home · الرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
