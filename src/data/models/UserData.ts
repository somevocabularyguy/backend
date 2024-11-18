import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User schema
  timeStamp: { type: Number, default: 0 },
  totalUseTime: { type: Number, default: 0},
  wordsData: [{
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Word', required: true }, // Link to the Word document
    notShownTimeSpent: { type: Number, default: 0 },
    shownTimeSpent: { type: Number, default: 0 },
    notShownSeen: { type: Number, default: 0 },
    shownSeen: { type: Number, default: 0 },
    lastViewed: { type: Date, default: Date.now },
    timeSinceLastView: { type: Number, default: 0 }
  }],
  // Add other user-specific data as needed
});

const UserData = mongoose.model('UserData', userDataSchema);

export default UserData;