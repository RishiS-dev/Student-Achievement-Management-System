import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import { login } from "../controllers/login.js";
import { studentDashboard, displayStudProfile, updateStudProfile, resetPassword } from "../controllers/studentController.js";
import { addAchievementController, achievementFormAdd, getEditAchieve, postEditAchieve, deleteAchieve } from "../controllers/studentAchievement.js";
import { upload } from '../middlewares/multerConfig.js';
import { verifyToken, checkStudent, checkStaff } from "../middlewares/auth.js";
import { createEvent, getEvents } from '../controllers/eventController.js';
import { renderCreateStudentForm, createStudentHandler, deleteStudentHandler } from "../controllers/adminController.js";
import Event from "../models/schemas/eventSchema.js";
import connectDB from "../models/config/db.js";
import { fetchAchievementDetailsForModal, fetchAchievementsForTable, renderStaffDashboard, getStaffProfile, resetStaffPassword } from "../controllers/staff.js";
import { getStudentsByBatch, resetStudentPassword, getStudentDetailsPage } from "../controllers/tutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const preventCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

// ------------------- ROUTES -------------------

app.get("/", (req, res) => {
  res.render("homePage", { title: "Home Page" });
});

app.post("/login", login);

app.get("/loginpage", (req, res) => {
  res.render("login", { title: "Login Page" });
});

// -------- Student Routes --------
app.get("/student", preventCache, verifyToken, checkStudent, studentDashboard);
app.get("/student/profile", preventCache, verifyToken, checkStudent, displayStudProfile);
app.post("/student/profile/update", preventCache, verifyToken, checkStudent, updateStudProfile);

app.get("/addachievement", preventCache, verifyToken, checkStudent, achievementFormAdd);
app.post("/addachievement", verifyToken, checkStudent, upload.single('certificate'), addAchievementController);

app.get('/editAchieve/:id', preventCache, verifyToken, checkStudent, getEditAchieve);
app.post('/editAchieve/:id', preventCache, verifyToken, checkStudent, upload.single('certificate'), postEditAchieve);
app.get('/deleteAchieve/:id', preventCache, verifyToken, checkStudent, deleteAchieve);

// -------- Staff Routes --------
app.get('/staff', preventCache, verifyToken, checkStaff, renderStaffDashboard);
app.get('/staff/fetchAchievements', preventCache, verifyToken, checkStaff, fetchAchievementsForTable);
app.get('/staff/achievement/:id', preventCache, verifyToken, checkStaff, fetchAchievementDetailsForModal);

app.get('/events', preventCache, verifyToken, checkStaff, (req, res) => res.render('event'));

// Staff events API
app.get('/staff/api/events', preventCache, verifyToken, checkStaff, getEvents);
app.delete('/api/events/:id', preventCache, verifyToken, checkStaff, async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event.' });
  }
});
app.post('/events', verifyToken, checkStaff, upload.single('eventFile'), createEvent);

// Staff student management
app.get('/staff/createStudent', preventCache, verifyToken, checkStaff, renderCreateStudentForm);
app.post('/staff/createStudent', preventCache, verifyToken, checkStaff, createStudentHandler);
app.delete('/deleteStudent/:email', preventCache, verifyToken, checkStaff, deleteStudentHandler);

app.get("/staff/profile", preventCache, verifyToken, checkStaff, getStaffProfile);

// -------- Tutor Routes --------
app.post('/tutorAccess', preventCache, verifyToken, checkStaff, getStudentsByBatch);
app.post('/resetStudPassword', preventCache, verifyToken, checkStaff, resetStudentPassword);
app.get('/studentDetails/:id', preventCache, verifyToken, checkStaff, getStudentDetailsPage);

// -------- Password Reset --------
app.get('/student/resetpassword', (req, res) => res.render('resetPassword'));
app.post('/student/resetpassword', preventCache, verifyToken, checkStudent, resetPassword);

app.get('/staff/resetpassword', (req, res) => res.render('resetPassword'));
app.post('/staff/resetpassword', preventCache, verifyToken, checkStaff, resetStaffPassword);

// -------- Logout --------
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// ------------------- DB CONNECTION -------------------

await connectDB();
export default app;



// Connect to DB before handling any request
// await connectDB();

// // Only start server if not running on Vercel
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`✅ Server running locally at http://localhost:${port}`);
//   });
// }

// export default app;