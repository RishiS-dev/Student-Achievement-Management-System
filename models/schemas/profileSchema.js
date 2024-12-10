import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    rno: {
      type: String,
      required: true,
      match: /^[0-9]{2}[A-Z]{1,2}[0-9]{3}$/, 
    },
    name: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
      match: /^[0-9]{2}[A-Z]{1,2}G[0-9]$/,
    },
    department: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
