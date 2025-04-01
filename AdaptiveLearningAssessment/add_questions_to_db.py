import requests
import psycopg2
import json

# Database connection
conn = psycopg2.connect(database="trivia_db", user="postgres", password="Namibia36", host="localhost", port="5432")
cur = conn.cursor()

# Fetch trivia questions
url = "https://opentdb.com/api.php?amount=50"
response = requests.get(url)
data = response.json()

# Insert into the database
for item in data['results']:
    category = item['category']
    difficulty = item['difficulty']
    question = item['question']
    correct_answer = item['correct_answer']
    incorrect_answers = item['incorrect_answers']

    cur.execute("""
        INSERT INTO trivia_questions (category, difficulty, question, correct_answer, incorrect_answers)
        VALUES (%s, %s, %s, %s, %s) ON CONFLICT (question) DO NOTHING;
    """, (category, difficulty, question, correct_answer, incorrect_answers))

conn.commit()
cur.close()
conn.close()

print("Trivia questions added to database!")