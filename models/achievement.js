// models/achievement.js
import mongoose from 'mongoose';
import achievementSchema from '../models/schemas/achievementSchema.js'; // Make sure path is correct

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
