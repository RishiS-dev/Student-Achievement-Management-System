import mongoose from "mongoose";
import dotenv from "dotenv";

import {createStudent} from "../models/studentAuth.js"   // Student creator
import {createStaff} from "../models/staffAuth.js";    // Staff creator

dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas for seeding");

    // --- Create default student ---
    await createStudent(
      "24mx412@psgtech.ac.in",   // email
      "Test Student",       // name
      "24mxg1",             // batch
      "24mx412",            // rollNumber
      "g1",                 // className
      "CA"                  // department
    );
    console.log("🎓 Default student created: student@test.com / password=24mx412");

    // --- Create default staff ---
    const staffResult = await createStaff({
      name: "Admin Staff",
      email: "staff.mca@psgtech.ac.in",
      password: "staff123",
      role: "professor",
      department: "MX",
      tutoring: [],
    });

    if (staffResult.success) {
      console.log("👨‍🏫 Default staff created: staff@test.com / password=staff123");
    } else {
      console.log("⚠️ Staff seeding skipped:", staffResult.message);
    }

    await mongoose.disconnect();
    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

runSeed();
