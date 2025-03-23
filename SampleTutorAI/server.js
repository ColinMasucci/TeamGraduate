import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Load API key from .env file

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure you have a .env file with your API key
});

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});