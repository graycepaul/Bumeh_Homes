import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

// app/layout.js
export const metadata = {
  title: {
    default: "Bumeh Homes",
    template: "%s | Hazel Thrills", // Automatically adds suffix to child page titles
  },
  description: "Unique 3D art pieces and custom installations by artist Joy",
  keywords: [
    "3D wall art",
    "sculptural installations",
    "custom art commissions",
    "textured artworks",
  ],
  openGraph: {
    title: "Hazel Thrills",
    description: "Dimensional art that transforms spaces",
    siteName: "Hazel Thrills",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazel Thrills",
    description: "Dimensional art that transforms spaces",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-primary-light dark:bg-primary-dark transition-colors">
        <div> {children}</div>
      </body>
    </html>
  );
}
