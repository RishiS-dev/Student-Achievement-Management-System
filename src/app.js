import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
import { title } from "process";
import {login} from "../controllers/login.js";
import { studentDashboard , displayStudProfile, updateStudProfile, resetPassword} from "../controllers/studentController.js";
import { addAchievementController, achievementFormAdd, getEditAchieve, postEditAchieve, deleteAchieve } from "../controllers/studentAchievement.js";
import { upload } from '../middlewares/multerConfig.js';
import { checkStaffSession, checkStudSession } from "../middlewares/sessionManage.js";
import { createEvent, getEvents } from '../controllers/eventController.js';
import Event from "../models/schemas/eventSchema.js";

import { fetchAchievementDetailsForModal,fetchAchievementsForTable,renderStaffDashboard, getStaffProfile, resetStaffPassword } from "../controllers/staff.js";
import { getStudentsByBatch, resetStudentPassword, getStudentDetailsPage } from "../controllers/tutor.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  session({
    secret: "secret-key",
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

app.get("/student/profile",preventCache, checkStudSession, displayStudProfile);

app.post("/student/profile/update",preventCache, checkStudSession, updateStudProfile);

app.get("/addachievement",preventCache, checkStudSession, achievementFormAdd);

app.post("/addachievement",checkStudSession, upload.single('certificate'), addAchievementController,);

app.get('/editAchieve/:id', preventCache, checkStudSession, getEditAchieve);

app.post('/editAchieve/:id', preventCache, checkStudSession, upload.single('certificate'), postEditAchieve);

app.get('/deleteAchieve/:id', preventCache, checkStudSession, deleteAchieve);

app.get('/staff', preventCache, checkStaffSession, renderStaffDashboard); 

app.get('/staff/fetchAchievements',preventCache, checkStaffSession, fetchAchievementsForTable); 

app.get('/staff/achievement/:id', preventCache, checkStaffSession, fetchAchievementDetailsForModal); 

app.get('/events', preventCache, checkStaffSession, (req, res) => res.render('event'));

app.get('/api/events', preventCache, checkStaffSession, getEvents);

app.delete('/api/events/:id', preventCache,checkStaffSession, async (req, res) => {
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

app.get("/staff/profile", preventCache, checkStaffSession, getStaffProfile);

app.post('/tutorAccess', preventCache, checkStaffSession, getStudentsByBatch);

app.post('/resetStudPassword', preventCache,checkStaffSession, resetStudentPassword);

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


app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
  });

export default app;
