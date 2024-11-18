import mongoose from 'mongoose';
import Word from './Word';

const categorizedWordsSchema = new mongoose.Schema(Word.schema.obj);

const CategorizedWords = mongoose.model('CategorizedWords', categorizedWordsSchema);

export default CategorizedWords;