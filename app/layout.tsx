// The real root layout lives in app/[locale]/layout.tsx, which sets the
// <html> lang and dir for each language.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
