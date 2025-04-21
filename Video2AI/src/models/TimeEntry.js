import mongoose from 'mongoose';

const TimeEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  page: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.TimeEntry || mongoose.model('TimeEntry', TimeEntrySchema);
