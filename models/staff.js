import connectDB from '../models/config/db.js';
import Achievement from './schemas/achievementSchema.js';

export async function fetchFilteredAchievements(filters, page = 1, pageSize = 10) {
  try {
    const query = {};

    if (filters.department) query.batch = { $regex: new RegExp(filters.department, 'i') }; 
    if (filters.from && filters.to) query.date = { $gte: new Date(filters.from), $lte: new Date(filters.to) }; 
    if (filters.position) query.position = filters.position;
    if (filters.level) query.level = filters.level;
    if (filters.category) query.category = filters.category;
    if (filters.class) query.batch = { $regex: new RegExp(filters.class, 'i') };
    if (filters.year) query.batch = { $regex: new RegExp(`^${filters.year}`) }; 

    const selectFields = filters.select && Array.isArray(filters.select) ? filters.select.join(' ') : '_id achievementName date category';

    const totalResults = await Achievement.countDocuments(query);
    const results = await Achievement.find(query)
      .select(selectFields) 
      .sort({ date: -1 }) 
      .skip((page - 1) * pageSize) 
      .limit(pageSize); 

    return {
      success: true,
      data: results,
      pagination: {
        totalResults,
        currentPage: page,
        totalPages: Math.ceil(totalResults / pageSize),
        pageSize,
      },
    };
  } catch (error) {
    console.error('Error fetching filtered achievements:', error.message);
    return { success: false, message: 'Error fetching achievements. Please try again.' };
  }
}


