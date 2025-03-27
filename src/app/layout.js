import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Rye, Lora, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ['400', '500', '600', '700'],

});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Ensemble",
  description: "Where local musicians connect",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${rye.variable} ${lora.variable} ${inter.variable} antialiased h-screen flex flex-col`}
        >
          <header className="flex flex-row justify-between items-center bg-background-dark w-screen">
            <Header />
            <div className="self-center justify-self-center mr-5 flex flex-row justify-between">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <SignedIn>
            <div className="flex flex-1">
              <Sidebar className="w-64 shrink-0" />
              <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4">{children}</main>
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <main className="flex-1 flex flex-col">{children}</main>
          </SignedOut>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
