import mongoose from 'mongoose';
import UserData from '@/data/models/UserData';
import { CustomError } from '@/errorTypes';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  willBeDeleted: { type: Boolean, default: false }
});

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const newUserData = new UserData({ userId: this._id });
      await newUserData.save();
    } catch (error: unknown) {
      throw new CustomError(500, 'MongoDB Save Error.')
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;