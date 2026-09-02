import mongoose, { Document, Schema } from "mongoose";

export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "MECHANIC_ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IBooking extends Document {
  bookingId: string;

  customer: mongoose.Types.ObjectId;

  mechanic?: mongoose.Types.ObjectId;

  vehicle: {
    make: string;
    model: string;
    registrationNumber: string;
  };

  service: {
    name: string;
    category: string;
  };

  status: BookingStatus;

  amount: number;

  scheduledAt: Date;

  createdAt: Date;

  // Denormalized searchable fields (optional)
  search?: {
    customerName?: string;
    customerEmail?: string;
    customerPhoneDigits?: string;
    vehicleReg?: string;
    mechanicName?: string;
  };
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    mechanic: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    vehicle: {
      make: {
        type: String,
        required: true,
      },

      model: {
        type: String,
        required: true,
      },

      registrationNumber: {
        type: String,
        required: true,
      },
    },

    service: {
      name: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "MECHANIC_ON_THE_WAY",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Denormalized searchable fields to improve search performance
    search: {
      customerName: { type: String, index: true },
      customerEmail: { type: String, index: true },
      customerPhoneDigits: { type: String, index: true },
      vehicleReg: { type: String, index: true },
      mechanicName: { type: String, index: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);