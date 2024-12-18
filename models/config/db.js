import mongoose from 'mongoose';

const connectDB = mongoose.connect("mongodb+srv://samsadmin:admin1234@manikandan.hnwgo.mongodb.net/sams");

connectDB
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });


export default connectDB;
