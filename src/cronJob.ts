import cron from 'node-cron';
import { UserDeletion, User } from '@/data/models';
import { incrementDeletionCount } from '@/databaseUtils';


cron.schedule('0 0 * * *', async () => {
  try {
    const usersToDelete = await UserDeletion.find({ scheduledFor: { $lte: new Date() } });

    if (usersToDelete.length > 0) {
      console.log(`Found ${usersToDelete.length} users for deletion.`);

      for (let userToDelete of usersToDelete) {
        await User.findByIdAndDelete(userToDelete.userId);

        await incrementDeletionCount();

        console.log(`Deleted user with ID: ${userToDelete.userId}`);

        await UserDeletion.findByIdAndDelete(userToDelete._id);
        console.log(`Deleted deletion request for user with ID: ${userToDelete.userId}`);
      }
    } else {
      console.log('No users to delete.');
    }
  } catch (error) {
    console.error('Error occurred while deleting users:', error);
  }
});