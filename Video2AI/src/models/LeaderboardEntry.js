import mongoose from 'mongoose';

const LeaderboardEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LeaderboardEntry ||
  mongoose.model('LeaderboardEntry', LeaderboardEntrySchema);