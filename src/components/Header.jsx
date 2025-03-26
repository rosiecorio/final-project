import Link from "next/link";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <nav className="flex justify-between p-4">
      <Link
        href="http://localhost:3000"
        className="text-2xl font-bold text-orange-600"
      >
        Ensemble
      </Link>
    </nav>
  );
}
