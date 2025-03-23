const Personality = Object.freeze({
    HELPFUL: "You are a helpful assistant.",
    SARCASTIC: "You are a sarcastic assistant who gives witty and snarky responses.",
    GRUMPY: "You are a grumpy assistant who is always annoyed at the user's questions.",
    MEAN: "You are a mean assistant who makes fun of the user.",
    FRIENDLY: "You are a friendly assistant who is always cheerful and supportive.",
    COMEDIC: "You are a comedian who responds to everything with humor and jokes.",
    CAT: "You are a cat and can only respond in meows or hisses."
});

document.getElementById("generateQuestion").addEventListener("click", generateQuestion);
document.getElementById("submitAnswer").addEventListener("click", checkAnswer);
document.getElementById("askFollowUp").addEventListener("click", askFollowUp);

let currentQuestion = ""; 
let correctAnswer = ""; 
let personality = Personality.HELPFUL;

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".personality-btn");
    const personalityName = document.getElementById("personalityName");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active")); // Remove active class
            this.classList.add("active"); // Highlight selected button
            personality = Personality[this.getAttribute("data-personality")];
            console.log("Selected Personality:", personality);
        });

        // Show personality name on hover
        button.addEventListener("mouseenter", function () {
            personalityName.innerText = this.getAttribute("data-name");
        });

        // Reset personality name when not hovering
        button.addEventListener("mouseleave", function () {
            const activeButton = document.querySelector(".personality-btn.active");
            personalityName.innerText = activeButton ? activeButton.getAttribute("data-name") : "";
        });
    });

    // Set default active button (HELPFUL)
    buttons[0].classList.add("active");
});


async function generateQuestion() {
    //const prompt = "Generate a simple algebra question. Provide the correct answer as well.";
    const prompt = "Generate a multiple choice question about the french revolution. Provide the correct answer as well.";
    
    const response = await fetchOpenAI(prompt);
    const parts = response.split("Answer: ");
    
    if (parts.length === 2) {
        currentQuestion = parts[0];
        correctAnswer = parts[1].trim();
        document.getElementById("questionText").innerText = currentQuestion;
        document.getElementById("feedback").innerText = "";
        document.getElementById("solution").innerText = "";
    }
}

async function checkAnswer() {
    const userAnswer = document.getElementById("answerInput").value.trim();
    if (!userAnswer) return;

    let prompt = `The question was: "${currentQuestion}". The correct answer is ${correctAnswer}. The student answered: ${userAnswer}. 
    Provide feedback on correctness and a step-by-step solution. If incorrect, explain why.`;

    const response = await fetchOpenAI(prompt);
    document.getElementById("feedback").innerText = response;
}

async function askFollowUp() {
    const selectedQuestion = document.getElementById("followUpQuestions").value;
    if (!selectedQuestion) return;

    let prompt = "";
    if (selectedQuestion === "real_world_example") {
        prompt = `Provide a real-world example of this math problem: "${currentQuestion}"`;
    } else if (selectedQuestion === "alternative_method") {
        prompt = `Explain another way to solve: "${currentQuestion}"`;
    }

    const response = await fetchOpenAI(prompt);
    document.getElementById("followUpResponse").innerText = response;
}

// Function to call OpenAI API
async function fetchOpenAI(prompt) {
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                messages: [
                    { role: "system", content: personality },
                    { role: "user", content: prompt }
                ]
            })
        });

        //console.log("Response ID:", response.id);  // Correct way to access response
        //console.log("AI Response:", response.choices[0].message.content);
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "Error fetching response.";
    }
}