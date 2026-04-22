import mongoose, { Schema, model, models } from "mongoose";

const rsvpSchema = new Schema(
  {
    guestName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true },
    attending: { type: String, required: true, enum: ["yes", "no"] },
    guestCount: { type: Number, min: 1, max: 500 },
    events: { type: [String], default: [] },
    shabbosHospitality: {
      type: String,
      enum: ["yes", "no"],
    },
    notes: { type: String, default: "", maxlength: 4000 },
  },
  { timestamps: true },
);

const existingRsvpModel = models.Rsvp as mongoose.Model<unknown> | undefined;
if (existingRsvpModel) {
  const paths = existingRsvpModel.schema?.paths ?? {};
  // In dev hot-reload, discard stale cached model definitions.
  if (!("attending" in paths) || !("notes" in paths)) {
    delete models.Rsvp;
  }
}

export const Rsvp = models.Rsvp ?? model("Rsvp", rsvpSchema);
