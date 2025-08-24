import { createStudent } from "../models/studentAuth.js";
import StudentAuth from "../models/schemas/studentAuthSchema.js"
import Profile from "../models/schemas/profileSchema.js"

// render the student creation form
export const renderCreateStudentForm = (req, res) => {
  res.render("createStudent", { title: "Create Student" });
};

// handle form submission
export const createStudentHandler = async (req, res) => {
  try {
    const { email, name, batch, rollNumber, className, department } = req.body;

    // call the existing createStudent function
    await createStudent(email, name, batch, rollNumber, className, department);

    res.redirect("/staff"); // go back to staff dashboard
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(500).send("❌ Failed to create student: " + error.message);
  }
};

export const deleteStudentHandler = async (req, res) => {
  try {
    const { email } = req.params;

    const deletedAuth = await StudentAuth.findOneAndDelete({ email });
    const deletedProfile = await Profile.findOneAndDelete({ email });

    if (!deletedAuth && !deletedProfile) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ success: false, message: "Error deleting student" });
  }
};