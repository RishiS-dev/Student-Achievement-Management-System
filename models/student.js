import Achievement from './schemas/achievementSchema.js';



export async function addAchievement(data) {
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
      organiser:data.organiser
    });

    const savedAchievement = await newAchievement.save();
    return savedAchievement; 
  } catch (error) {
    console.error("Error adding achievement:", error.message);
    throw error;
  }
}


export async function fetchDashAchievements(rollNumber) {
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


export async function viewAchievement(achievementId) {
  try {
    const achievement = await Achievement.findById(achievementId)
    
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    return achievement;

  } catch (error) {
      console.error('Error fetching achievement:', error.message);
      throw error;
  }
}


export async function updateAchievement(achievementId, updateObj) {
  try {
    const updatedAchievement = await Achievement.findOneAndUpdate({_id:achievementId},updateObj)

    return updatedAchievement;
  } catch (error) {
    console.error('Error updating achievement:', error.message);
    throw error;
  }

}


export async function deleteAchievement(achievementId) {
  try {

    const deletedAchievement = await Achievement.findByIdAndDelete(achievementId);

    if (!deletedAchievement) {
      throw new Error('Achievement not found or already deleted.');
    }

    return true; 
  } catch (error) {
    console.error('Error deleting achievement:', error.message);
    throw error;
  }
}

