import type { Metadata } from "next";
import { Newsreader, Onest } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmad Marzouk · Full Stack Developer",
  description:
    "Ahmad Marzouk is a full stack developer who builds clear, reliable web products with Next.js and NestJS, from idea to launch.",
  openGraph: {
    title: "Ahmad Marzouk · Full Stack Developer",
    description:
      "Clear, reliable web products with Next.js and NestJS, from idea to launch.",
    type: "website",
  },
};

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || ((!theme || theme === 'system') && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${newsreader.variable} ${onest.variable} antialiased`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
