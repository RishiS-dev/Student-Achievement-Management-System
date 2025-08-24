import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventOrganizer: String,
  eventCategory: String,
  eventRewards: String,
  eventInstructions: String,
  eventFile: String,          // ✅ match controller
  eventFileType: String       // ✅ optional: store MIME type
});

const Event = mongoose.model('Event', eventSchema);
export default Event;