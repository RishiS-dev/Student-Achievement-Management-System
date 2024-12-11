import connectDB from '../models/config/db.js';
import Achievement from './schemas/achievementSchema.js';



async function fetchFilteredAchievement(filters, page = 1, pageSize = 10) {
  try {
    // Build the query object based on the provided filters
    const query = {};

    if (filters.department) query.batch = { $regex: new RegExp(filters.department, 'i') }; // Partial match with department code
    if (filters.from && filters.to) query.date = { $gte: new Date(filters.from), $lte: new Date(filters.to) }; // Date range
    if (filters.position) query.position = filters.position;
    if (filters.level) query.level = filters.level;
    if (filters.category) query.category = filters.category;
    if (filters.class) query.batch = { $regex: new RegExp(filters.class, 'i') };
    if (filters.year) query.batch = { $regex: new RegExp(`^${filters.year}`) }; // Match year at start of batch

    // Pagination logic
    const totalResults = await Achievement.countDocuments(query); // Count total documents matching the query
    const results = await Achievement.find(query)
      .select('_id achievementName date category') // Select only required fields
      .sort({ date: -1 }) // Sort by date in descending order
      .skip((page - 1) * pageSize) // Skip documents for previous pages
      .limit(pageSize); // Limit results to the current page size

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



(async () => {
  const filters = {
    department: 'CSE',
    from: '2024-01-01',
    to: '2024-12-31',
    position: '1st',
    level: 'National',
    category: 'Hackathon',
    year: '24',
  };
  const page = 2;
  const pageSize = 5;

  const result = await fetchFilteredAchievement(filters, page, pageSize);
  console.log(result);
})();