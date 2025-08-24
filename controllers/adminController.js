import { createStudent } from "../models/studentAuth.js";

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
