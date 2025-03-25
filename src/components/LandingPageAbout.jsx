import Link from "next/link";
import Image from "next/image";

export default function LandingPageAbout() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Connect with local musicians
        </h1>
        <p className="text-lg text-center mb-8">
          Find gigs, collaborate on projects, meet other musicians in your area
          and build your local music community.
        </p>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center mt-12">
        {" "}
        <h2 className="text-2xl font-bold text-center mb-8">How it works</h2>
        <p className="text-gray-800 mb-4">
          Ensemble prodivdes the tools you need to thrive in your local music
          scene.
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Find local gigs and collaborators</li>
          <li>Connect with other musicians in your area</li>
          <li>Promote your music and events</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center mt-12">
        <Image
          src="https://www.dk-mba.com/u/images/blog/4635449/_f1500/band-rehearsing.png"
          alt="a group of musicians rehearsing"
          width={500}
          height={300}
        />
      </div>
    </section>
  );
}
