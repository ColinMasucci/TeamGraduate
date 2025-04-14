
import mongoose from 'mongoose';
const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URI, {});
      console.log("MongoDB Connected");
const quizSchema = new mongoose.Schema({
  // userIdentifier: {type: String, required:true},
  userIdentifier: { type: String, required: false }, 
  videoUrl: { type: String, required: true },
  quiz: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correct_answer: { type: String, required: true },
    }
  ]
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
  } catch (error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
  }
};


export default Quiz;
