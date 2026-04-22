import Image from "next/image";
import Link from "next/link";
import { AdminNavModal } from "@/components/admin-nav-modal";

const navItems = [
  { href: "/", label: "RSVP" },
  { href: "/photos", label: "Ari Photos" },
  { href: "/weekend", label: "Weekend Plan" },
  { href: "/trivia", label: "Ari Trivia" },
];

export function SiteNav() {
  return (
    <header className="border-b border-[#2baab7] bg-[#005f6d]/95 text-white backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/ari-logo-transparent.png"
            alt="Ari Poznanski logo"
            width={112}
            height={88}
            className="h-auto w-28"
            priority
          />
        </Link>
        <ul className="flex flex-wrap items-center gap-2 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-1.5 py-1 text-[#dff8ff] transition hover:bg-[#0a7f91]"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <AdminNavModal />
        </ul>
      </nav>
    </header>
  );
}
