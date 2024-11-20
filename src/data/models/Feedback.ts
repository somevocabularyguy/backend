import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  feedbackType: { type: String, required: true },
  feedbackText: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.Mixed }],
  date: { type: Date, default: Date.now },
  anonymous: { type: Boolean, default: true }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;