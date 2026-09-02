import mongoose, { Document, Schema } from "mongoose";

export type MechanicStatus =
  | "AVAILABLE"
  | "BUSY"
  | "OFFLINE"
  | "ON_THE_WAY";

export interface IMechanic extends Document {
  name: string;
  phone: string;
  status: MechanicStatus;
  jobsCompleted: number;
  currentBooking?: mongoose.Types.ObjectId;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

const mechanicSchema = new Schema<IMechanic>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE", "ON_THE_WAY"],
      default: "AVAILABLE",
    },

    jobsCompleted: {
      type: Number,
      default: 0,
    },

    currentBooking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },

      lng: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Mechanic = mongoose.model<IMechanic>(
  "Mechanic",
  mechanicSchema
);