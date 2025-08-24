import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    rno: {
      type: String,
      required: true,
      match: /^[0-9]{2}[A-Z]{1,2}[0-9]{3}$/, 
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
      uppercase: true,
    },
    batch: {
      type: String,
      required: true,
      match: /^[0-9]{2}[A-Z]{1,2}G[0-9]$/,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@psgtech\.ac\.in$/,
      lowercase: true,
    },
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement', 
      },
    ],
    github: {
      type: String,
      default: '',
    },
    leetcode: {
      type: String,
      default: '',
    },
    isRep: {
      type: Boolean,
      default: false, // Set default value to false
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
