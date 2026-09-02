import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import { Customer } from "../models/Customer.js";
import { Mechanic } from "../models/Mechanic.js";
import { Booking } from "../models/Booking.js";

import {
  cities,
  customerNames,
  mechanicNames,
  services,
  vehicles,
} from "./data.js";

const randomItem = <T>(array: ReadonlyArray<T>): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDate = (daysBack: number): Date => {
  const now = new Date();
  const date = new Date(
    now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000
  );
  return date;
};

const generatePhone = (index: number): string => {
  return `98${String(10000000 + index).slice(0, 8)}`;
};

const generateRegistrationNumber = (index: number): string => {
  return `DL01AB${String(index).padStart(4, "0")}`;
};

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    console.log("Clearing existing data...");

    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Mechanic.deleteMany({});

    console.log("Creating customers...");

    const customers = customerNames.map((name, index) => ({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: generatePhone(index),
      address: `${randomNumber(1, 250)} ${randomItem(cities)}`,
      totalBookings: 0,
    }));

    const createdCustomers = await Customer.insertMany(customers);
    console.log(`${createdCustomers.length} customers created.`);

    console.log("Creating mechanics...");

    const mechanics = mechanicNames.map((name) => ({
      name,
      phone: `97${randomNumber(10000000, 99999999)}`,
      status: randomItem([
        "AVAILABLE",
        "BUSY",
        "OFFLINE",
        "ON_THE_WAY",
      ] as const),
      jobsCompleted: randomNumber(15, 250),
      location: {
        lat: 28.45 + Math.random() * 0.3,
        lng: 77.0 + Math.random() * 0.5,
      },
    }));

    const createdMechanics = await Mechanic.insertMany(mechanics);
    console.log(`${createdMechanics.length} mechanics created.`);

    console.log("Creating bookings...");

    const statuses = [
      "PENDING",
      "ASSIGNED",
      "MECHANIC_ON_THE_WAY",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ] as const;

    const bookings = [];

    for (let i = 1; i <= 600; i++) {
      const customer = randomItem(createdCustomers);
      const mechanic = randomItem(createdMechanics);
      const service = randomItem(services);
      const vehicle = randomItem(vehicles);
      const status = randomItem(statuses);

      const amount = randomNumber(service.minPrice, service.maxPrice);

      const booking = {
        bookingId: `IM-${String(i).padStart(5, "0")}`,
        customer: customer._id,
        mechanic:
          status === "PENDING" || status === "CANCELLED"
            ? null
            : mechanic._id,
        vehicle: {
          make: vehicle.make,
          model: vehicle.model,
          registrationNumber: generateRegistrationNumber(i),
        },
        service: {
          name: service.name,
          category: service.category,
        },
        status,
        amount,
        scheduledAt: randomDate(90),
      };

      bookings.push(booking);
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created.`);

    console.log("Updating customer booking counts...");

    for (const customer of createdCustomers) {
      const bookingCount = await Booking.countDocuments({
        customer: customer._id,
      });

      await Customer.updateOne(
        { _id: customer._id },
        {
          $set: {
            totalBookings: bookingCount,
          },
        }
      );
    }

    console.log("Database seeded successfully! 🚗");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();