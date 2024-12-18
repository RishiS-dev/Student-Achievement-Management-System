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
  

export async function updatePassword(id, newPassword) {
    try {
      const staff = await Staff.findById(id);
      if (!staff) {
        return { success: false, message: 'Staff member not found.' };
      }
  
      staff.password = hashedPassword;
      await staff.save();
  
      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      console.error('Error updating password:', error.message);
      return { success: false, message: 'Error updating password. Please try again.' };
    }
}
  

async function createStaff(staffData) {
  try {
    const existingStaff = await Staff.findOne({ email: staffData.email });
    if (existingStaff) {
      return { success: false, message: 'Email already exists. Please use a different email.' };
    }

    const newStaff = new Staff({
      name: staffData.name,
      email: staffData.email,
      password: staffData.password, 
      role: staffData.role,
      department: staffData.department,
      tutoring: staffData.tutoring || [],
    });

    await newStaff.save();

    return { success: true, data: newStaff };
  } catch (error) {
    console.error('Error creating staff:', error.message);
    return { success: false, message: 'Error creating staff. Please try again later.' };
  }
}

// createStaff({
//   name:"Rishi",
//   email:"nire.mca@psgtech.ac.in",
//   department : "mx",
//   password : "rishi",
//   role : "professor",

// })

