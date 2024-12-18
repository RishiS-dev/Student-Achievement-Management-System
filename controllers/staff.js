import { fetchFilteredAchievements } from "../models/staff.js";
import { viewAchievement } from "../models/student.js";
import Staff from "../models/schemas/staffSchema.js"

export const renderStaffDashboard = (req, res) => {
  try {
    res.render("teachDash", {
      department: req.session.staff.dep,
    });
  } catch (error) {
    console.error("Error rendering staff dashboard:", error.message);
    res.status(500).send("Server Error");
  }
};

export const fetchAchievementsForTable = async (req, res) => {
  try {
    const department = req.session.staff.dep;

    const filters = { ...req.query, department };

    const page = parseInt(req.query.page) || 1;

    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await fetchFilteredAchievements(filters, page, pageSize);

    if (!result.success) {
      return res.status(500).json({ message: "Failed to fetch achievements" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching achievements:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const fetchAchievementDetailsForModal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Achievement ID is required" });
    }


    const achievement = await viewAchievement(id);

    if(achievement.certificate){
      achievement.certificate = achievement.certificate.replace(/\\/g, '/');
    }


    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (error) {
    console.error("Error fetching achievement details:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};



export async function getStaffProfile(req, res) {
  try {
    const staffId = req.session.staff.id; 
    

    const staff = await Staff.findById(staffId).select('-password'); 
    if (!staff) {
      return res.status(404).send('Staff member not found.');
    }

    res.render('staffProfile', { staff });
  } catch (error) {
    console.error('Error fetching staff profile:', error.message);
    res.status(500).send('Internal Server Error');
  }
}
