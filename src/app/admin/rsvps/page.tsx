import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_RSVP_COOKIE,
  verifyAdminRsvpToken,
} from "@/lib/admin-pin-session";
import { connectDb } from "@/lib/mongodb";
import { labelRsvpEventSlugs } from "@/lib/rsvp-event-labels";
import { Rsvp } from "@/models/Rsvp";
import { AdminSignOut } from "./admin-sign-out";
import type { ExportableRsvpRow } from "./export-csv-button";
import { ExportCsvButton } from "./export-csv-button";

export const dynamic = "force-dynamic";

function toIsoString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return new Date(value).toISOString();
  }
  return new Date(0).toISOString();
}

export default async function AdminRsvpsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_RSVP_COOKIE)?.value;

  if (!verifyAdminRsvpToken(token)) {
    redirect("/");
  }

  await connectDb();
  const docs = await Rsvp.find().sort({ createdAt: -1 }).lean().exec();

  const rows: (ExportableRsvpRow & { id: string })[] = docs.map((d) => ({
    id: String(d._id),
    guestName: d.guestName,
    email: d.email,
    attending: d.attending === "yes" ? "yes" : "no",
    guestCount: typeof d.guestCount === "number" ? d.guestCount : null,
    events: labelRsvpEventSlugs((d.events as string[]) ?? []),
    shabbosHospitality:
      d.shabbosHospitality === "yes" || d.shabbosHospitality === "no"
        ? d.shabbosHospitality
        : null,
    notes:
      typeof d.notes === "string"
        ? d.notes
        : typeof d.dietary === "string"
          ? d.dietary
          : "",
    createdAt: toIsoString(d.createdAt),
  }));

  return (
    <div className="min-h-[calc(100vh-92px)] bg-[#e8f4f6]">
      <div className="border-b border-[#86dbe4]/60 bg-white/90 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#f38a4a]">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-[#006a78]">RSVP dashboard</h1>
            <p className="mt-1 max-w-xl text-sm text-[#006a78]/85">
              Live submissions from MongoDB, newest first.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <ExportCsvButton rows={rows} />
            <AdminSignOut />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-sm text-[#006a78]/80">
          {rows.length === 0
            ? "No RSVPs yet."
            : `${rows.length} submission${rows.length === 1 ? "" : "s"}`}
        </p>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-[#f3b28a]/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f6fbfc] text-xs font-semibold uppercase tracking-wide text-[#006a78]/90">
                  <th className="whitespace-nowrap px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="whitespace-nowrap px-4 py-3">Attending</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center">Guests</th>
                  <th className="px-4 py-3">Events</th>
                  <th className="whitespace-nowrap px-4 py-3">Hospitality</th>
                  <th className="min-w-[140px] px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="text-[#006a78]">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-[#006a78]/70"
                    >
                      When guests submit the RSVP form, their rows will appear
                      here.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={r.id}
                      className={
                        i % 2 === 0
                          ? "border-b border-[#f0f0f0] bg-white"
                          : "border-b border-[#f0f0f0] bg-[#fafcfc]"
                      }
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#006a78]/80">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#006a78]">
                        {r.guestName}
                      </td>
                      <td
                        className="max-w-[200px] truncate px-4 py-3 text-[#006a78]/90"
                        title={r.email}
                      >
                        {r.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            r.attending === "yes"
                              ? "inline-flex rounded-full bg-[#dff8ff] px-2 py-0.5 text-xs font-medium text-[#006a78]"
                              : "inline-flex rounded-full bg-[#f0f0f0] px-2 py-0.5 text-xs font-medium text-[#006a78]/80"
                          }
                        >
                          {r.attending === "yes" ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums font-medium">
                        {r.guestCount ?? "—"}
                      </td>
                      <td className="max-w-[260px] px-4 py-3 text-xs leading-relaxed text-[#006a78]/90">
                        {r.events.length > 0 ? r.events.join(" · ") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            r.shabbosHospitality === "yes"
                              ? "inline-flex rounded-full bg-[#dff8ff] px-2 py-0.5 text-xs font-medium text-[#006a78]"
                              : "inline-flex rounded-full bg-[#f0f0f0] px-2 py-0.5 text-xs font-medium text-[#006a78]/80"
                          }
                        >
                          {r.shabbosHospitality === null
                            ? "—"
                            : r.shabbosHospitality === "yes"
                              ? "Yes"
                              : "No"}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-4 py-3 text-xs leading-relaxed text-[#006a78]/85">
                        {r.notes ? r.notes : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
