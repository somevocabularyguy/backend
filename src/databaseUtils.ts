import { Counter } from '@/data/models';

const incrementDeletionCount = async () => {
  await Counter.findOneAndUpdate(
    { name: 'deletionCount' },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
};

export { incrementDeletionCount };