import Link from "next/link";

export default function LandingPageHeader() {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-5 flex items-center justify-between">
        <nav>
          <Link
            href="http://localhost:3000"
            className="text-2xl font-bold text-orange-600"
          >
            LocalChord
          </Link>

          <Link
            href="http://localhost:3000/login"
            className="text-gray-700 hover:text-blue-600"
          >
            Sign In/ Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
