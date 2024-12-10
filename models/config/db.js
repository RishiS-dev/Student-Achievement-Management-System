import mongoose from 'mongoose';

const connectDB = mongoose.connect('mongodb://localhost:27017/sams');

connectDB
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });


  export default connectDB;