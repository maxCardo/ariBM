"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminNavModal() {
  const router = useRouter();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    setPin("");
    setError(null);
  }, []);

  const tryGoToAdminPage = useCallback(async () => {
    const res = await fetch("/api/admin/rsvps", { credentials: "same-origin" });
    if (res.ok) {
      router.push("/admin/rsvps");
      return true;
    }
    return false;
  }, [router]);

  const handleAdminClick = useCallback(async () => {
    setChecking(true);
    try {
      const went = await tryGoToAdminPage();
      if (went) {
        return;
      }
      setPin("");
      setError(null);
      setOpen(true);
    } finally {
      setChecking(false);
    }
  }, [tryGoToAdminPage]);

  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ pin }),
      });
      if (res.status === 503) {
        setError(
          "Admin is not configured (set ADMIN_SESSION_SECRET on the server).",
        );
        return;
      }
      if (!res.ok) {
        setError("Incorrect PIN.");
        return;
      }
      dismiss();
      router.push("/admin/rsvps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  return (
    <li>
      <button
        type="button"
        onClick={() => void handleAdminClick()}
        disabled={checking}
        className="rounded-md px-1.5 py-1 text-[#dff8ff] transition hover:bg-[#0a7f91] disabled:opacity-60"
      >
        {checking ? "…" : "Admin"}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => dismiss()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-[#efefef] shadow-xl ring-2 ring-[#f3b28a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f3b28a] bg-[#e9f8fa] px-4 py-3">
              <h2 id={titleId} className="text-lg font-semibold text-[#006a78]">
                Admin
              </h2>
              <button
                type="button"
                onClick={() => dismiss()}
                className="rounded-md px-2 py-1 text-sm font-medium text-[#006a78] hover:bg-[#dff8ff]"
              >
                Close
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={(e) => void submitPin(e)} className="space-y-3">
                <p className="text-sm text-[#006a78]">
                  Enter the admin PIN to open the RSVP dashboard.
                </p>
                <label className="grid gap-1 text-sm text-[#006a78]">
                  PIN
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
                    disabled={loading}
                  />
                </label>
                {error ? (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-[#f38a4a] px-4 py-2 font-medium text-white transition hover:bg-[#df7636] disabled:opacity-60"
                >
                  {loading ? "Checking…" : "Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
