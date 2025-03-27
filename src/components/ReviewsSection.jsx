import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReviewsSection() {
  return (
    <section className="py-12 bg-dark">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-white mb-8 text-center">
          What Musicians are saying...
        </h2>
      </div>
      <div className="container mx-auto px-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Incredible Platform!</CardTitle>
            <CardDescription>John Doe, Guitarist</CardDescription>
            ⭐⭐⭐⭐⭐
          </CardHeader>
          <CardContent>
            "LocalChord has completely transformed how I connect with other
            musicians in my city. Highly recommended!"
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Game Changer!</CardTitle>
            <CardDescription>Jane Smith, Vocalist</CardDescription>
            ⭐⭐⭐⭐⭐
          </CardHeader>
          <CardContent>
            "Finding gigs and collaborators has never been easier. LocalChord is
            a game changer for local musicians."
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best Music App Ever!</CardTitle>
            <CardDescription>Mike Johnson, Drummer</CardDescription>
            ⭐⭐⭐⭐⭐
          </CardHeader>
          <CardContent>
            "I've tried other platforms, but LocalChord is by far the best for
            connecting with the local music scene."
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
