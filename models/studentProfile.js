import Profile from './schemas/profileSchema.js';  
import connectDB from '../models/config/db.js';


async function viewProfile(rollNumber) {
  try {

    const profile = await Profile.findOne({ rno: rollNumber }).select(
      'name rno department class github leetcode'
    );

    if (!profile) {
      throw new Error('Profile not found.');
    }

    return {
      name: profile.name,
      rollNumber: profile.rno,
      department: profile.department,
      class: profile.class,
      github: profile.github || 'Not provided',
      leetcode: profile.leetcode || 'Not provided',
    };
  } catch (error) {
    console.error('Error retrieving profile:', error.message);
    throw error;
  }
}


async function updateProfile(rollNumber, github, leetcode) {
  try {

    const updatedProfile = await Profile.findOneAndUpdate(
      { rno: rollNumber }, 
      { github: github || null, leetcode: leetcode || null },
      { new: true, runValidators: true } 
    );

    if (!updatedProfile) {
      throw new Error('Profile not found.');
    }

    return true;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
}
