import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
  createdAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model<ICustomer>(
  "Customer",
  customerSchema
);