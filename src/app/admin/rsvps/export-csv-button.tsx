"use client";

export type ExportableRsvpRow = {
  guestName: string;
  email: string;
  attending: "yes" | "no";
  guestCount: number | null;
  events: string[];
  shabbosHospitality: "yes" | "no" | null;
  notes: string;
  createdAt: string;
};

function escapeCsvCell(value: string): string {
  const s = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(rows: ExportableRsvpRow[]): string {
  const headers = [
    "Submitted",
    "Guest name",
    "Email",
    "Attending",
    "Guest count",
    "Events",
    "Shabbos hospitality",
    "Notes",
  ];
  const lines = [headers.map((h) => escapeCsvCell(h)).join(",")];

  for (const r of rows) {
    const submitted = new Date(r.createdAt).toLocaleString();
    const eventsJoined = r.events.join("; ");
    const notes = r.notes || "";
    const attending = r.attending === "yes" ? "Yes" : "No";
    const guestCount = r.guestCount === null ? "" : String(r.guestCount);
    const hospitality =
      r.shabbosHospitality === null
        ? ""
        : r.shabbosHospitality === "yes"
          ? "Yes"
          : "No";
    lines.push(
      [
        submitted,
        r.guestName,
        r.email,
        attending,
        guestCount,
        eventsJoined,
        hospitality,
        notes,
      ]
        .map(escapeCsvCell)
        .join(","),
    );
  }

  return `\uFEFF${lines.join("\r\n")}`;
}

export function ExportCsvButton({ rows }: { rows: ExportableRsvpRow[] }) {
  const download = () => {
    if (rows.length === 0) {
      return;
    }
    const csv = rowsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      aria-label="Export RSVPs to CSV"
      title="Download a CSV file of the table below"
      className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 text-sm font-medium text-[#006a78] shadow-sm transition hover:bg-[#e9f8fa] disabled:opacity-60"
    >
      Export
    </button>
  );
}
