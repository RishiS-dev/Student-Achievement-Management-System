import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{2}[a-zA-Z]{2,3}[0-9]{3}@psgtech\.ac\.in$/, 
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile', 
    },
  }
);

studentAuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

studentAuthSchema.statics.createStudentAuth = async function (email, password, profileId) {
  try {
    const newStudentAuth = new this({
      email,
      password,
      profile: profileId, 
    });

    const savedStudentAuth = await newStudentAuth.save();
    return savedStudentAuth;
  } catch (error) {
    throw new Error(error.message);
  }
};

const StudentAuth = mongoose.model('StudentAuth', studentAuthSchema);

export default StudentAuth;
