import mongoose from 'mongoose';

const connect = mongoose.connect('mongodb://localhost:27017/sams');

connect
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

  const userloginSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String
});

  const achievementSchema = new mongoose.Schema({
    username: String,
    name: String,
    date: Date,
    category: String,
    level: String,
    position: String,
    rewards: String,
});

const Achievements = mongoose.model("achievementsdatas", achievementSchema);
export { Achievements };
  
  const collection = mongoose.model("userlogins", userloginSchema);
  
  export { collection };
  
