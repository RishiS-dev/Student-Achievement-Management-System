import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventOrganizer: String,
    eventCategory: String,
    eventRewards: String,
    eventInstructions: String,
    eventImages: String,
});
const Event = mongoose.model('Event', eventSchema);
export default Event;