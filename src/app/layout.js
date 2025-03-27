import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Rye, Lora, Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: '400',
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight:['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
          className={`${rye.variable} ${lora.variable} ${inter.variable} antialiased`}
        >
          <header className="flex flex-row justify-between items-center">
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
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
