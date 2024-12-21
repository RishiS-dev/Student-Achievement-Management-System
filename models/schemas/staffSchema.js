import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-z]+\.[a-z]+@psgtech\.ac\.in$|^[a-z]+\.[a-z]+@psgtech\.in$/, 
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      uppercase:true,
    },
    tutoring: {
      type: [String],
      default: [],
      uppercase:true,
    },
  },
  { timestamps: true }
);

staffSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
