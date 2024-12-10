import connectDB from '../models/config/db.js';
import bcrypt from 'bcrypt';
import StudentAuth from './schemas/studentAuthSchema.js';  
import Profile from './schemas/profileSchema.js';  



const authenticateStudent = async (email, password) => {
  try {
    const student = await StudentAuth.findOne({ email: email });

    if (!student) {
      return { success: false, message: 'Student not found' };
    }

    const isPasswordMatch = await bcrypt.compare(password, student.password);

    if (isPasswordMatch) {
      return { success: true, message: 'Authentication successful', student: student };
    } else {
      return { success: false, message: 'Incorrect password' };
    }
  } catch (error) {
    console.error('Error authenticating student:', error);
    return { success: false, message: 'An error occurred during authentication' };
  }
};


async function createStudent(email, name, batch, rollNumber, className, department) {

  const profile = await initProfileCreate(name, batch, rollNumber, className, department)
  try {
    const newStudentAuth = new StudentAuth({
      email : email,
      password : rollNumber,
      profile: profile._id, 
    });

    const savedStudentAuth = await newStudentAuth.save();
    return savedStudentAuth; 
  } catch (error) {
    throw new Error(error.message);
  }
}


async function initProfileCreate(name, batch, rollNumber, className, department) {
  try {
    const newProfile = new Profile({
      rno: rollNumber,
      name: name,
      class: className,
      batch: batch,
      department: department,
      achievements: [], 
      github: null,     
      leetcode: null,  
    });

    const savedProfile = await newProfile.save();
    console.log('Profile created successfully:', savedProfile);
    return savedProfile._id;
  } catch (error) {
    console.error('Error creating profile:', error.message);
    throw new Error(error.message);
  }
}


async function updatePassword(email, newPassword) {
    try {
      const student = await StudentAuth.findOne({ email });
      if (!student) {
        throw new Error("Student with the provided email does not exist.");
      }
  
      student.password = newPassword;
  
      const updatedStudent = await student.save();
      
      return updatedStudent;
    } catch (error) {
      console.error("Error updating password:", error.message);
      throw error;
    }
}
  

