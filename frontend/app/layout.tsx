import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vargo Cargo | Rastreo de paquetes en tiempo real",
  description:
    "Consulte el estado de sus envíos en tiempo real con Vargo Cargo. notificaciones.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
