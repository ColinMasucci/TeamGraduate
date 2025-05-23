import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI);
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

export default Quiz;
