import connectDB from '../models/config/db.js';
import Achievement from './schemas/achievementSchema.js';



async function addAchievement(data) {
  try {
    const newAchievement = new Achievement({
      achievementName: data.achievementName,
      date: data.date,
      position: data.position,
      level: data.level,
      rewards: data.rewards || "None", 
      certificate: data.certificate || null, 
      category: data.category,
      rollNumber: data.rollNumber,
      batch: data.batch,
    });

    const savedAchievement = await newAchievement.save();
    console.log("Achievement added successfully:", savedAchievement);
    return savedAchievement; 
  } catch (error) {
    console.error("Error adding achievement:", error.message);
    throw error;
  }
}


async function fetchDashAchievements(rollNumber) {
  try {

    const achievements = await Achievement.find({ rollNumber })
      .select('_id achievementName category date') 
      .sort({ date: -1 }); 

    if (achievements.length === 0) {
      throw new Error('No achievements found for this roll number.');
    }

    return achievements;
  } catch (error) {
    console.error('Error fetching achievements:', error.message);
    throw error;
  }
}


async function viewAchievement(achievementId) {
  try {

    const achievement = await Achievement.findById(achievementId)
      .select('achievementName date position level category rewards certificate'); 
    
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    return {
      id: achievement._id,
      name: achievement.achievementName,
      date: achievement.date,
      position: achievement.position,
      level: achievement.level,
      category: achievement.category,
      reward: achievement.rewards,
      certificate: achievement.certificate
    };

  } catch (error) {
      console.error('Error fetching achievement:', error.message);
      throw error;
  }
}


async function updateAchievement(achievementId, updateObj) {
  try {
    // Validate the input fields in updateObj
    const validFields = ['achievementName', 'date', 'rewards', 'certificate', 'category'];
    const updateData = {};
    
    for (const key of Object.keys(updateObj)) {
      if (validFields.includes(key)) {
        updateData[key] = updateObj[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    // Update the achievement
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      achievementId, 
      updateData, 
      { new: true } // Return the updated document
    ).select('_id achievementName date rewards certificate category');

    if (!updatedAchievement) {
      throw new Error('Achievement not found or update failed.');
    }

    return updatedAchievement;
  } catch (error) {
    console.error('Error updating achievement:', error.message);
    throw error;
  }

}


