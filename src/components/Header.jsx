import Link from "next/link";
import Image from "next/image";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <nav className="flex justify-between p-2">
      <Link href="/timeline" className="text-2xl font-bold text-orange-600">
       <Image src="/images/logo1.png"
       alt="brand logo"
       width={80}
       height={80}
        />
      </Link>
    </nav>
  );
}
