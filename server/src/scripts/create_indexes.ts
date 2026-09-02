import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/instant-mechanic-dashboard";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  console.log("Creating indexes on bookings, customers and mechanics collections...");

  const bookings = db.collection("bookings");
  const customers = db.collection("customers");
  const mechanics = db.collection("mechanics");

  try {
    // Bookings indexes
    await bookings.createIndex({ bookingId: 1 }, { name: "bookingId_idx", unique: true });
    console.log("Created bookingId_idx");

    await bookings.createIndex({ "vehicle.registrationNumber": 1 }, { name: "vehicleReg_idx" });
    console.log("Created vehicleReg_idx");

    await bookings.createIndex({ status: 1, scheduledAt: -1 }, { name: "status_scheduledAt_idx" });
    console.log("Created status_scheduledAt_idx");

    await bookings.createIndex({ "service.category": 1, scheduledAt: -1 }, { name: "serviceCategory_scheduledAt_idx" });
    console.log("Created serviceCategory_scheduledAt_idx");

    await bookings.createIndex({ mechanic: 1, scheduledAt: -1 }, { name: "mechanic_scheduledAt_idx" });
    console.log("Created mechanic_scheduledAt_idx");

    // Index denormalized search fields on bookings
    await bookings.createIndex({ "search.customerName": 1 }, { name: "search_customerName_idx" });
    console.log("Created search_customerName_idx");
    await bookings.createIndex({ "search.customerEmail": 1 }, { name: "search_customerEmail_idx" });
    console.log("Created search_customerEmail_idx");
    await bookings.createIndex({ "search.customerPhoneDigits": 1 }, { name: "search_customerPhoneDigits_idx" });
    console.log("Created search_customerPhoneDigits_idx");
    await bookings.createIndex({ "search.vehicleReg": 1 }, { name: "search_vehicleReg_idx" });
    console.log("Created search_vehicleReg_idx");
    await bookings.createIndex({ "search.mechanicName": 1 }, { name: "search_mechanicName_idx" });
    console.log("Created search_mechanicName_idx");

    // Customers indexes (search on name/email/phone)
    await customers.createIndex({ name: "text", email: "text" }, { name: "customersTextIndex", weights: { name: 10, email: 5 } });
    console.log("Created customersTextIndex");

    await customers.createIndex({ phone: 1 }, { name: "customersPhone_idx" });
    console.log("Created customersPhone_idx");

    // Mechanics indexes (search on name/phone/status)
    await mechanics.createIndex({ name: "text" }, { name: "mechanicsNameTextIndex", weights: { name: 10 } });
    console.log("Created mechanicsNameTextIndex");

    await mechanics.createIndex({ phone: 1 }, { name: "mechanicsPhone_idx" });
    console.log("Created mechanicsPhone_idx");

    await mechanics.createIndex({ status: 1 }, { name: "mechanicsStatus_idx" });
    console.log("Created mechanicsStatus_idx");

    console.log("All indexes created.");
  } catch (err) {
    console.error("Error creating indexes:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});