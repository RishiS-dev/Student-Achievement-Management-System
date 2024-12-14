import { addAchievement, updateAchievement, deleteAchievement, fetchDashAchievements, viewAchievement } from '../models/student.js'; // Import your service functions



export const addAchievementController = async (req, res) => {
    try {
      const {
        achievementName,
        date,
        position,
        level,
        rewards,
        category,
        rollNumber,
        batch,
        organiser,
      } = req.body;
  
      const certificate = req.file ? req.file.path : null;
  
      const achievementData = {
        achievementName,
        date,
        position,
        level,
        rewards,
        certificate, 
        category,
        rollNumber:req.session.student.rollno,
        batch:req.session.student.batch,
        organiser,
      };
  
      const savedAchievement = await addAchievement(achievementData);
  
      res.redirect("/student");
    } catch (error) {
      console.error('Error in addAchievementController:', error.message);
  
      res.status(500).json({
        error: 'Failed to add achievement. Please try again.',
        details: error.message,
      });
    }
};


export const achievementFormAdd = (req, res) => {
    try {
      res.render('achievementForm', {
        pageTitle: 'Add Achievement',
        formAction: '/addachievement', 
      });
    } catch (error) {
      console.error('Error rendering achievement form:', error.message);
      res.status(500).send('Error displaying the achievement form. Please try again later.');
    }
};
  


export const getEditAchieve = async (req, res) => {
  try {
    const achievementId = req.params.id;  
console.log("in EDIT ")
    console.log(req.params)
 
    const achievement = await viewAchievement(achievementId); 
    console.log(achievement)
    res.render('editAchieve', { achievement }); 

  } catch (error) {
    console.error('Error fetching achievement:', error.message);
    res.status(500).send('Server error');
  }
};

export const postEditAchieve = async (req, res) => {
  try {
    const { achievementName, date, category, position, level, rewards, organiser, certificate } = req.body;
    const achievementId = req.params.id; 

    const updateObj = { achievementName, date, category, position, level, rewards, organiser, certificate };

    const updatedAchievement = await updateAchievement(achievementId, updateObj); 

    res.redirect(`/student`); 
  } catch (error) {
    console.error('Error updating achievement:', error.message);
    res.status(500).send('Server error');
  }
};

export const deleteAchieve = async (req, res) => {
  try {
    const achievementId = req.params.id;
    console.log("in delete : ",req.params)  
    const isDeleted = await deleteAchievement(achievementId); 

    if (isDeleted) {
      res.redirect(`/student`); 
    } else {
      res.status(404).send('Achievement not found');
    }
  } catch (error) {
    console.error('Error deleting achievement:', error.message);
    res.status(500).send('Server error');
  }
};