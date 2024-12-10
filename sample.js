// Insert a document into the "achievements" collection
import Achievement from './models/achievement.js'; // Correct path

const createAchievement = async () => {
  try {
    const newAchievement = new Achievement({
      achievementName: "AI Hackathon Winner",
      date: new Date(),
      position: "1st",
      level: "National",
      rewards: "Cash Prize - $1000",
      organiser: "TechFest",
      certificate: "/uploads/certificates/ai-hackathon.pdf",
      category: "Hackathon",
      rollNumber: "24MX112",
      batch: "24MXG1"
    });

    await newAchievement.save();  // This will create the collection "achievements" if it doesn't exist
    console.log("Achievement saved!");
  } catch (error) {
    console.error("Error saving achievement:", error);
  }
};

createAchievement();
