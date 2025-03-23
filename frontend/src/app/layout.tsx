import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"; // ✅ Add this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your App Name",
  description: "Your app description here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" /> {/* ✅ Toast notifications appear here */}
        {children}
      </body>
    </html>
  );
}
