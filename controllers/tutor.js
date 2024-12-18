import StudentAuth from "../models/schemas/studentAuthSchema.js";
import bcrypt from "bcryptjs";

import Profile from "../models/schemas/profileSchema.js";

export const getStudentsByBatch = async (req, res) => {
  const { batch } = req.body;
  try {
    const students = await Profile.find({ batch })
      .select("name rno batch class department")
      .lean();

    const response = students.map((student) => ({
      id: student._id,
      name: student.name,
      rollNumber: student.rno,
      email: `${student.rno.toLowerCase()}@psgtech.ac.in`,
    }));

    res.render("tutorAccess", { batch, students: response });
  } catch (error) {
    res.status(500).send("Error fetching students");
  }
};

export const getStudentDetailsPage = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the student and populate achievements
    const student = await Profile.findById(id)
      .populate("achievements") // Populate the achievements data
      .lean();

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Format achievements
    const achievements = student.achievements.map((a) => ({
      name: a.achievementName || "N/A",
      date: a.date ? a.date.toISOString().split("T")[0] : "N/A", // Format date
      position: a.position || "N/A",
      level: a.level || "N/A",
      rewards: a.rewards || "N/A",
      organiser: a.organiser || "N/A",
      certificate: a.certificate || "N/A",
      category: a.category || "N/A",
    }));

    // Render the student details page with achievements
    res.render("studentDetails", { student, achievements });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching student details");
  }
};

export const resetStudentPassword = async (req, res) => {
  const { id } = req.body;
  try {
    const studentAuth = await StudentAuth.findOne({ profile: id });
    if (!studentAuth)
      return res.json({ success: false, message: "Student not found" });

    studentAuth.password = studentAuth.email.split("@")[0]; // Reset password to roll number
    await studentAuth.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    res.json({ success: false, message: "Failed to reset password." });
  }
};
