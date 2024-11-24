import mongoose from 'mongoose';

const userDeletionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedAt: { type: Date, default: Date.now },
  scheduledFor: { 
    type: Date, 
    default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)  
  },
  reason: { type: String, required: false }
});

const UserDeletion = mongoose.model('UserDeletion', userDeletionSchema);

export default UserDeletion;