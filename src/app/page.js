import Link from "next/link";
import LandingPageHeader from "@/components/Header";
import LandingPageAbout from "@/components/LandingPageAbout";
import ReviewsSection from "@/components/ReviewsSection";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center ">
      <LandingPageAbout />
      <ReviewsSection />
      <CallToAction />
    </main>
  );
}
