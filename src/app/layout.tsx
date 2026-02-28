import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pro6 Admin - CMS",
  description: "Pro6 Content Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {/* Font Awesome for admin icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
