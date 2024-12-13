import { fetchDashAchievements } from '../models/student.js'; // Import the Achievements model

export const studentDashboard = async (req, res) => {
  try {
    console.log(req.session.rollno)

    if (!req.session.rollno) {
      return res.redirect('/loginpage?error=Please login to access the dashboard');
    }

    const achievements = await fetchDashAchievements(req.session.rollno);

    res.render('studentDashboard', {
      title: 'Student Dashboard',
      achievements, 
    });
    
  } catch (error) {
    console.error('Error fetching student dashboard:', error.message);
    res.status(500).send('An error occurred while fetching the dashboard.');
  }
};
