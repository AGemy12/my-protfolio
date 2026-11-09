// Fallback for URLs outside any locale (the proxy normally redirects these).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
          <p>
            <a href="/">Go home</a>
          </p>
        </div>
      </body>
    </html>
  );
}
