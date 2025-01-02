import mongoose from 'mongoose';

const waitingVerifySchema = new mongoose.Schema({
  email: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)  
  },
  verified: { type: Boolean, default: false }
});

const WaitingVerify = mongoose.model('WaitingVerify', waitingVerifySchema);

export default WaitingVerify;