// The real <html> lives in app/[locale]/layout.tsx so it can set lang/dir.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
