import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
import { title } from "process";
import {login} from "../controllers/login.js";
import { studentDashboard , displayStudProfile, updateStudProfile} from "../controllers/studentController.js";
import { addAchievementController, achievementFormAdd, getEditAchieve, postEditAchieve, deleteAchieve } from "../controllers/studentAchievement.js";
import { upload } from '../middlewares/multerConfig.js';
import { checkStaffSession, checkStudSession } from "../middlewares/sessionManage.js";
import { fetchAchievementDetailsForModal,fetchAchievementsForTable,renderStaffDashboard } from "../controllers/staff.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 8086;
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


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Error occurred during logout!");
    }
    res.redirect("/");
  });
});


app.listen(3000, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

export default app;
