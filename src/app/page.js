import Link from "next/link";
import LandingPageHeader from "@/components/LandingPageHeader";
import LandingPageAbout from "@/components/LandingPageAbout";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <LandingPageHeader />
      <LandingPageAbout />
      <ReviewsSection />
    </main>
  );
}
