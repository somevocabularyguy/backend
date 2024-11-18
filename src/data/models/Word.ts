import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  definition: { type: String, required: true },
  frequency: { type: String },
  synonyms: { type: [String] },
  antonyms: { type: [String] },
  example: { type: String },
  difficulty: { type: String, required: true },
  levelName: { type: String }
});

const Word = mongoose.model('Word', wordSchema);

export default Word;