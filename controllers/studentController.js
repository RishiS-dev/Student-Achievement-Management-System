import { fetchDashAchievements } from '../models/student.js'; // Import the Achievements model
import Profile from '../models/schemas/profileSchema.js';
import Event from '../models/schemas/eventSchema.js';

export const studentDashboard = async (req, res) => {
  try {
   
    const achievements = await fetchDashAchievements(req.session.student.rollno);
    const events = await Event.find();
    res.render('studDash', {
      title: 'Student Dashboard',
      achievements, 
      events,
    });
    
  } catch (error) {
    console.error('Error fetching student dashboard:', error.message);
    res.render('studDash', {
      title: 'Student Dashboard',
      achievements:[], 
      events: [],
    });
  }
};


export const displayStudProfile = async (req, res) => {
  try {
    const { rollno } = req.session.student;

    const profile = await Profile.findOne({ rno: rollno });

    res.render('studProfile', {
      title: 'Student Profile',
      profile,
    });

  } catch (error) {
    console.error('Error displaying profile:', error.message);
  }
};

export async function updateStudProfile(req, res) {
  const { rollno } = req.session.student; 
  const { github, leetcode } = req.body; 

  try {

      const profile = await Profile.findOne({ rno: rollno });
      

      profile.github = github || profile.github; 
      profile.leetcode = leetcode || profile.leetcode;

      await profile.save();

      res.redirect('/student/profile');
  } catch (error) {
      console.error('Error updating profile:', error.message);
      
  }
}