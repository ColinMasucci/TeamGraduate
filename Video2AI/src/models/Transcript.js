import mongoose from 'mongoose';

const TranscriptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoUrl: { type: String, required: true },
  transcript: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transcript || mongoose.model('Transcript', TranscriptSchema);
