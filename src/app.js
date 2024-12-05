import express from 'express';
import { Achievements, collection } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import { title } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'../public')));

app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized: true,
    cookie:{secure:false}
}))

const preventCache = (req,res,next)=>{
    res.setHeader('Cache-Control',"no-store")
    res.setHeader('Pragme','no-cache')
    res.setHeader('Expires','0')
    next();
};

app.get("/",(req,res) => {
    res.render("homePage",{title: 'Home Page'});
})
app.get("/loginpage",(req,res)=>{
    res.render("login",{title:"Login Page"});
})

app.post("/login",async (req,res)=>{
    try{

        const check = await collection.findOne({username: req.body.username});

        if(!check){
            res.render("login", {title:"login Page",error:"User not found!"})
            
        }
        else{
        req.session.user = {type: check.type,username:check.username};
        if (req.body.password === check.password) {
            if (check.type === "teacher") {
                res.redirect("/teacher");
            } else {
                res.redirect("/student");
            }
        } else {
            res.render("login", {title:"login Page",error:"Incorrect Password!"})
        }
    }
    } catch {
        res.send("An error occurred during login.");
    }
})

app.get("/teacher",preventCache,async (req,res)=>{
    if(!req.session.user||req.session.user.type !== 'teacher'){
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return
    }
    try{
        const achievements = await Achievements.find().sort({date:-1});
        res.render("teachDash",{title: 'Teacher Dashboard',username:req.session.user.username,achievements});
    }   
    catch(err){
        res.status(500).send("Failed to fetch achievements")
    }

})

app.get("/profile",preventCache,(req,res)=>{
    if(!req.session.user){
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return
    }
    if(req.session.user.type === 'teacher'){
        res.render("teachProfile",{title:'Profile Page',username:req.session.user.username,type:req.session.user.type});
    }
    else{
        res.render("studProfile",{title:'Profile Page',username:req.session.user.username,type:req.session.user.type});
    }
    
})

app.get("/student",preventCache,async (req,res)=>{
    if(!req.session.user||req.session.user.type !== 'student'){
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return
    }
    try{
        const achievements = await Achievements.find({username: req.session.user.username}).sort({date:-1});
        res.render("studDash",{title: 'Student Dashboard',username:req.session.user.username,achievements});
    }   
    catch(err){
        res.status(500).send("Failed to fetch achievements")
    }
})

app.get("/getAchieve",preventCache,async (req,res)=>{
    if(!req.session.user){
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return
    }
    try {
        const {id} = req.query
        let achievement = await Achievements.findOne({_id:id});

        res.render("addAchieve",{title: 'Achievement Details',type: req.session.user.type,achievement});

    } catch (error) {
        res.status(500).send("Failed to get achievement")
    }
    
})
app.post('/addachievement',preventCache,async (req,res)=>{
    if(!req.session.user||req.session.user.type !== 'student'){
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return
    }
    const {name, date, category, level, position, rewards} = req.body;
    const{username} = req.session.user;
    try {
        let achievement = await Achievements.findOne({username,name});
        if(achievement){
            achievement.date = date;
            achievement.category = category;
            achievement.level = level;
            achievement.position = position;
            achievement.rewards = rewards;
            
            await achievement.save();
        }
        else{
            const newAchievement = new Achievements({ username, name, date, category, level, position, rewards });
            await newAchievement.save();
        }
        
        return res.redirect("/student")
    } catch (error) {
        res.status(300).send("Error saving achievement")
    }
});

app.post("/deleteachievement", preventCache, async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'student') {
        setTimeout(() => {
            return res.redirect("/?error=not-logged-in");
        }, 1000);
        return;
    }

    const { name } = req.body;

    try {
        const achievement = await Achievements.findOneAndDelete({
            username: req.session.user.username,
            name: name
        });
        if (achievement) {
            res.redirect("/student");
        } else {
            res.status(404).send("Achievement not found or already deleted");
        }
    } catch (error) {
        res.status(500).send("Error while deleting achievement");
    }
});


app.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        if(err){
            res.send("Error occurred during logout!")
        }
        res.redirect("/");  
    });
});

app.listen(8086,()=>{
    console.log("Server is running...");
})