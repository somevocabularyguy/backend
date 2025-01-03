import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalUseTime: { type: Number, default: 0},
  languageArray: { type: [String], default: ['en']},
  hiddenWordIds: [String],
  customWordIds: [String],
  wordsData: [
    {
      _id: false,
      id: { type: String, required: true },
      notShownTimeSpent: { type: Number },
      shownTimeSpent: { type: Number },
      notShownSeen: { type: Number },
      shownSeen: { type: Number },
      lastViewed: { type: Number },
      learningScore: { type: Number }
    }
  ],
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.userId;
      delete ret._id;
      delete ret.__v;
    }
  }
});

const UserData = mongoose.model('UserData', userDataSchema);

export default UserData;