import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notre Famille — Calendrier Familial",
  description: "Calendrier partagé pour les familles Guerchet, Viney et Juszczak",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Script pour éviter le flash de thème */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = document.cookie.match(/nf_theme=([^;]*)/);
                  theme = theme ? theme[1] : 'system';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
