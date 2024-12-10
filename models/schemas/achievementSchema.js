import mongoose from 'mongoose';
import Profile from './profileSchema.js'; 

const achievementSchema = new mongoose.Schema({
    achievementName: { 
        type: String, 
        required: true 
    }, 
    date: { 
        type: Date, 
        required: true 
    },             
    position: { 
        type: String, 
        enum: ['1st', '2nd', '3rd', 'Participant', 'Other'], 
        default: 'Participant' 
    }, 
    level: { 
        type: String,
         enum: ['State', 'National', 'None'], 
         default: 'None' 
    }, 
    rewards: { 
        type: String,
        default: 'None' 
    },       
    organiser: { 
        type: String, 
        required: true 
    },       
    certificate: { 
        type: String 
    },                    
    category: {                                        
        type: String,
        required: true
    },
    rollNumber: {                                      
        type: String,
        required: true,
        match: /^[0-9]{2}[A-Z]{1,2}[0-9]{3}$/,
        uppercase: true,
    },
    batch: { 
        type: String, 
        required: true, 
        match: /^[0-9]{2}[A-Z]{1,2}G[0-9]$/,
        uppercase: true,
    },
});

achievementSchema.pre('findByIdAndDelete', async function (next) {
    const achievementId = this.getQuery()['_id']; 
    if (achievementId) {
        try {
            await Profile.updateMany(
                { achievements: achievementId }, 
                { $pull: { achievements: achievementId } }
            );
            console.log(`Achievement with ID ${achievementId} removed from profiles.`);
            next(); 
        } catch (error) {
            console.error('Error updating profiles before achievement deletion:', error.message);
            next(error); 
        }
    } else {
        next(); 
    }
});

achievementSchema.post('save', async function (doc) {
    try {
        const profile = await Profile.findOne({ rno: doc.rollNumber }); 
        if (profile) {
            profile.achievements.push(doc._id); 
            await profile.save(); 
            console.log(`Achievement ID ${doc._id} added to profile with roll number ${doc.rollNumber}`);
        } else {
            console.log(`Profile with roll number ${doc.rollNumber} not found.`);
        }
    } catch (error) {
        console.error('Error adding achievement to profile after save:', error.message);
    }
});


const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
