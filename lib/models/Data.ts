import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: false,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Data || mongoose.model('Data', DataSchema);
