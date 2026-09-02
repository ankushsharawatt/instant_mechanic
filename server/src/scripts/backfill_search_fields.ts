import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/instant-mechanic-dashboard";
const BATCH_SIZE = 200;

function normalizeName(name?: string): string | undefined {
  if (!name) return undefined;
  return name.trim().toLowerCase();
}

function normalizeEmail(email?: string): string | undefined {
  if (!email) return undefined;
  return email.trim().toLowerCase();
}

function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits || undefined;
}

function normalizeReg(reg?: string): string | undefined {
  if (!reg) return undefined;
  return reg.replace(/\s+/g, "").toLowerCase();
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;
  const bookings = db.collection("bookings");
  const customers = db.collection("customers");
  const mechanics = db.collection("mechanics");

  console.log("Starting backfill of search fields on bookings...");

  const total = await bookings.countDocuments();
  console.log(`Total bookings: ${total}`);

  let processed = 0;
  const cursor = bookings.find({});

  while (await cursor.hasNext()) {
    const batch: any[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      if (!(await cursor.hasNext())) break;
      const doc = await cursor.next();
      batch.push(doc);
    }

    const bulkOps: any[] = [];

    for (const b of batch) {
      const customer = b.customer ? await customers.findOne({ _id: b.customer }) : null;
      const mechanic = b.mechanic ? await mechanics.findOne({ _id: b.mechanic }) : null;

      const search = {
        customerName: normalizeName(customer?.name),
        customerEmail: normalizeEmail(customer?.email),
        customerPhoneDigits: normalizePhone(customer?.phone),
        vehicleReg: normalizeReg(b?.vehicle?.registrationNumber),
        mechanicName: normalizeName(mechanic?.name),
      };

      bulkOps.push({
        updateOne: {
          filter: { _id: b._id },
          update: { $set: { search } },
        },
      });
    }

    if (bulkOps.length) {
      const res = await bookings.bulkWrite(bulkOps);
      processed += batch.length;
      console.log(`Processed ${processed}/${total} bookings`);
    }
  }

  console.log("Backfill complete");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
