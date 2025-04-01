from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from pydantic import BaseModel
import random

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any frontend (you can replace "*" with specific URLs for more direct security access)
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows any headers (e.g., Authorization, Content-Type)
)


# Database Connection
def get_db():
    return psycopg2.connect(database="trivia_db", user="postgres", password="Namibia36", host="localhost", port="5432")

# Student Model
class AnswerSubmission(BaseModel):
    student_id: int
    question_id: int
    is_correct: bool

# API: Get Adaptive Quiz
@app.get("/get_quiz/{student_id}")
def get_adaptive_quiz(student_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT q.category, COUNT(*) AS wrong_answers
        FROM student_progress sp
        JOIN trivia_questions q ON sp.question_id = q.id
        WHERE sp.student_id = %s AND sp.is_correct = FALSE
        GROUP BY q.category
        ORDER BY wrong_answers DESC
        LIMIT 3;
    """, (student_id,))
    
    weak_categories = [row[0] for row in cur.fetchall()]

    if not weak_categories:
        cur.execute("SELECT * FROM trivia_questions ORDER BY RANDOM() LIMIT 3;")
    else:
        cur.execute("""
            SELECT * FROM trivia_questions WHERE category IN %s ORDER BY RANDOM() LIMIT 3;
        """, (tuple(weak_categories),))
    
    weak_questions = cur.fetchall()

    # Get 2 completely random questions
    cur.execute("SELECT * FROM trivia_questions ORDER BY RANDOM() LIMIT 2;")
    random_questions = cur.fetchall()

    # Combine both sets of questions
    questions = weak_questions + random_questions
    random.shuffle(questions)

    cur.close()
    conn.close()
    
    return {"quiz": questions}

# API: Submit Answer
@app.post("/submit_answer")
def submit_answer(answers: List[AnswerSubmission]):
    conn = get_db()
    cur = conn.cursor()

    for answer in answers:
        cur.execute("""
            INSERT INTO student_progress (student_id, question_id, is_correct)
            VALUES (%s, %s, %s);
        """, (answer.student_id, answer.question_id, answer.is_correct))

    conn.commit()
    cur.close()
    conn.close()
    
    return {"message": "Answer recorded!"}

# API: Get Feedback
@app.get("/get_feedback/{student_id}")
def get_feedback(student_id: int):
    conn = get_db()
    cur = conn.cursor()

    # Get weak topics
    cur.execute("""
        SELECT category, ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS accuracy_percentage
        FROM student_progress sp
        JOIN trivia_questions q ON sp.question_id = q.id
        WHERE student_id = %s
        GROUP BY category
        ORDER BY accuracy_percentage;
    """, (student_id,))
    
    results = cur.fetchall()
    cur.close()
    conn.close()

    tips = []
    for category, accuracy in results:
        if accuracy < 50:
            tips.append(f"You need more practice in {category}. Your Accuracy Rate is %{accuracy} in this subject. Try reviewing key concepts!")
        elif accuracy < 80:
            tips.append(f"You're doing well in {category}, but keep practicing! Your Accuracy Rate so far is %{accuracy}")
        else:
            tips.append(f"Great job in {category}! You have a strong understanding with an Accuracy Rate of %{accuracy}.")

    return {"feedback":tips}