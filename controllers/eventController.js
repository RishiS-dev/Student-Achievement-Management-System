// controllers/eventController.js
import Event from '../models/schemas/eventSchema.js';

// Function to create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventOrganizer,
      eventCategory,
      eventRewards,
      eventInstructions,
    } = req.body;

    const newEvent = new Event({
      eventName,
      eventDate,
      eventOrganizer,
      eventCategory,
      eventRewards,
      eventInstructions,
    });

    // Handle file upload
    if (req.file) {
      newEvent.eventFile = req.file.filename;
      newEvent.eventFileType = req.file.mimetype;  // ✅ needed for preview
    }


    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event.' });
  }
};

// Function to get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events); // Send events data as JSON
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events.' });
  }
};