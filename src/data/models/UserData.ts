import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  totalUseTime: { type: Number, default: 0},
  hiddenWordIds: [String],
  CustomWordIds: [String],
  wordsData: [{
    wordId: { type: String, required: true },
    notShownTimeSpent: { type: Number },
    shownTimeSpent: { type: Number },
    notShownSeen: { type: Number },
    shownSeen: { type: Number },
    lastViewed: { type: Number },
    learningScore: { type: Number }
  }],
});

const UserData = mongoose.model('UserData', userDataSchema);

export default UserData;