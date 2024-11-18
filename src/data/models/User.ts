import mongoose from 'mongoose';
import UserData from './UserData';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const newUserData = new UserData({ userId: this._id });
      await newUserData.save();
    } catch (error: unknown) {
      return next(error as Error);
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;