"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={busy}
      className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 text-sm font-medium text-[#006a78] shadow-sm transition hover:bg-[#e9f8fa] disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
