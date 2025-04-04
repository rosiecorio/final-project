import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="m-4 py-12 rounded-md bg-orange-600 text-white text-center flex flex-col items-center">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-lora italic font-semibold mb-4">
          Ready to Join the Ensemble Community?
        </h2>
        <p className="text-xl font-inter mb-8">
          Sign up today and start connecting with musicians in your area!
        </p>
        <Button asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    </section>
  );
}
