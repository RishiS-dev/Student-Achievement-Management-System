import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
import { title } from "process";
import { login } from "../controllers/login.js";
import { studentDashboard, displayStudProfile, updateStudProfile, resetPassword } from "../controllers/studentController.js";
import { addAchievementController, achievementFormAdd, getEditAchieve, postEditAchieve, deleteAchieve } from "../controllers/studentAchievement.js";
import { upload } from '../middlewares/multerConfig.js';
import { checkStaffSession, checkStudSession } from "../middlewares/sessionManage.js";
import { createEvent, getEvents } from '../controllers/eventController.js';
import { renderCreateStudentForm, createStudentHandler, deleteStudentHandler } from "../controllers/adminController.js";
import Event from "../models/schemas/eventSchema.js";
import connectDB from "../models/config/db.js";


import { fetchAchievementDetailsForModal, fetchAchievementsForTable, renderStaffDashboard, getStaffProfile, resetStaffPassword } from "../controllers/staff.js";
import { getStudentsByBatch, resetStudentPassword, getStudentDetailsPage } from "../controllers/tutor.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT;
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const preventCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragme", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

app.get("/", (req, res) => {
  res.render("homePage", { title: "Home Page" });
});


app.post("/login", login);

app.get("/loginpage", (req, res) => {
  res.render("login", { title: "Login Page" });
});

app.get("/student", preventCache, checkStudSession, studentDashboard);

app.get("/student/profile", preventCache, checkStudSession, displayStudProfile);

app.post("/student/profile/update", preventCache, checkStudSession, updateStudProfile);

app.get("/addachievement", preventCache, checkStudSession, achievementFormAdd);

app.post("/addachievement", checkStudSession, upload.single('certificate'), addAchievementController,);

app.get('/editAchieve/:id', preventCache, checkStudSession, getEditAchieve);

app.post('/editAchieve/:id', preventCache, checkStudSession, upload.single('certificate'), postEditAchieve);

app.get('/deleteAchieve/:id', preventCache, checkStudSession, deleteAchieve);

app.get('/staff', preventCache, checkStaffSession, renderStaffDashboard);

app.get('/staff/fetchAchievements', preventCache, checkStaffSession, fetchAchievementsForTable);

app.get('/staff/achievement/:id', preventCache, checkStaffSession, fetchAchievementDetailsForModal);

app.get('/events', preventCache, checkStaffSession, (req, res) => res.render('event'));

// Staff events endpoint
app.get('/staff/api/events', preventCache, checkStaffSession, getEvents);

// Student events endpoint
app.get('/student/api/events', preventCache, checkStudSession, getEvents);


app.delete('/api/events/:id', preventCache, checkStaffSession, async (req, res) => {
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

app.post('/events', upload.single('eventFile'), createEvent);


// staff: show create student form
app.get('/staff/createStudent', preventCache, checkStaffSession, renderCreateStudentForm);

// staff: submit new student
app.post('/staff/createStudent', preventCache, checkStaffSession, createStudentHandler);

app.delete('/deleteStudent/:email', preventCache, checkStaffSession, deleteStudentHandler);

app.get("/staff/profile", preventCache, checkStaffSession, getStaffProfile);

app.post('/tutorAccess', preventCache, checkStaffSession, getStudentsByBatch);

app.post('/resetStudPassword', preventCache, checkStaffSession, resetStudentPassword);

app.get('/studentDetails/:id', preventCache, checkStaffSession, getStudentDetailsPage);

app.get('/student/resetpassword', (req, res) => {
  res.render('resetPassword');
});

app.post('/student/resetpassword', preventCache, checkStaffSession, resetPassword);

app.get('/staff/resetpassword', (req, res) => {
  res.render('resetPassword');
});

app.post('/staff/resetpassword', preventCache, checkStaffSession, resetStaffPassword);



app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Error occurred during logout!");
    }
    res.redirect("/");
  });
});


// Connect to DB before handling any request
// await connectDB();

// // Only start server if not running on Vercel
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`✅ Server running locally at http://localhost:${port}`);
//   });
// }

// export default app;
await connectDB();
export default app;