import connectDB from '../models/config/db.js';
import bcrypt from 'bcrypt';
import Staff from './schemas/staffSchema.js';

export async function staffAuth(email, password) {
    try {
      const staff = await Staff.findOne({ email });
      
      if (!staff) {
        
        return { success: false, message: 'Staff not found' };
      }
  
      const isMatch = await bcrypt.compare(password, staff.password);
      
      if (!isMatch) {
        return { success: false, message: 'Incorrect password' };
      }
  
      return { success: true, message: 'Authentication successful', staff: staff }; 
    } catch (error) {
      console.error('Error during authentication:', error.message);
      return false; 
    }
  }
  

async function updatePassword(email, newPassword) {
    try {
      // Find the staff member by email
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return { success: false, message: 'Staff member not found.' };
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the password and save the document
      staff.password = hashedPassword;
      await staff.save();
  
      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      console.error('Error updating password:', error.message);
      return { success: false, message: 'Error updating password. Please try again.' };
    }
}
  
