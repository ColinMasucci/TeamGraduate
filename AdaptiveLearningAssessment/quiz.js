let studentId = 1; // Example student ID
        let quizData = [];

        async function fetchQuiz() {
            const response = await fetch(`http://127.0.0.1:8000/get_quiz/${studentId}`);
            const questionsData = await response.json(); // Convert response to JSON
            quizData = questionsData.quiz; //Takes out the quiz array from its initial array

            console.log("Received questions:", questionsData); // Debugging line

            //If there was no data to begin with print error to page
            if (questionsData.length === 0) {
                document.getElementById("quiz-container").innerHTML = "<p>No questions available.</p>";
                return;
            }

            let quizHTML = "";

            quizData.forEach((q, index) => {
                let correctAnswer = q[4];
                let options = [...q[5], correctAnswer]; // Add the correct answer to the options array

                // Shuffle function (Fisher-Yates Algorithm)
                for (let i = options.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }

                let optionsHTML = options.map((option, i) => 
                    `<input type="radio" name="q${index}" value="${option}"> ${option}<br>`
                ).join("");

                quizHTML += `
                    <div class="question">
                        <p><strong>Q${index + 1}:</strong> ${q[3]}</p>
                        ${optionsHTML}
                    </div>
                `;
            });

            document.getElementById("quiz-container").innerHTML = quizHTML;

            //Display the submit buttton and hide generate quiz button after generating quiz
            document.getElementById("submitBtn").style.display = "inline-block";
            document.getElementById("generateQuizBtn").style.display = "none";
            document.getElementById("feedbackBtn").style.display = "none";
        }

        async function submitAnswers() {
            let results = [];
            quizData.forEach((q, index) => {
                let selected = document.querySelector(`input[name="q${index}"]:checked`);
                if (selected) {
                    let isCorrect = selected.value === q[4];
                    results.push({ student_id: studentId, question_id: q[0], is_correct: isCorrect });
                }
            });

            console.log("Submitting answers:", JSON.stringify(results, null, 2)); //Debugging Line

            // Send answers to the backend
            let response = await fetch("http://localhost:8000/submit_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(results)
            });

            if (!response.ok) {
                console.error("Error submitting answers:", await response.text());
            } else {
                document.getElementById("quiz-container").innerHTML = "<h3>Results submitted! Click 'Generate New Quiz' to retry.</h3>";
                document.getElementById("submitBtn").style.display = "none";
                document.getElementById("generateQuizBtn").style.display = "inline-block";
                document.getElementById("feedbackBtn").style.display = "inline-block";
            }
        }

        async function get_feedback() {
            const response = await fetch(`http://127.0.0.1:8000/get_feedback/${studentId}`);
            const feedbackData = await response.json(); // Convert response to JSON
            let tipsData = feedbackData.feedback; //Takes out the tips array from its initial array

            console.log("Received feedback:", feedbackData); // Debugging line

            //If there was no data to begin with print error to page
            if (feedbackData.length === 0) {
                document.getElementById("feedback-container").innerHTML = "<p>No feedback available.</p>";
                return;
            }

            let feedbackHTML = "";

            tipsData.forEach((t, index) => {
                feedbackHTML += `
                    <div class="tip">
                        <p><strong>Tip ${index + 1}:</strong> ${t}</p>
                    </div>
                `;
            });

            document.getElementById("feedback-container").innerHTML = feedbackHTML;
        }