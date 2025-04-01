CREATE DATABASE trivia_db; 
\c trivia_db;

CREATE TABLE trivia_questions (
    id SERIAL PRIMARY KEY,
    category TEXT,
    difficulty TEXT,
    question TEXT UNIQUE,
    correct_answer TEXT,
    incorrect_answers TEXT[]
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY
);

CREATE TABLE student_progress (
    submission_id SERIAL PRIMARY KEY,
    student_id INT,
    question_id INT REFERENCES trivia_questions(id),
    is_correct BOOLEAN,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT question, correct_answer FROM trivia_questions LIMIT 5;
SELECT * FROM trivia_questions ORDER BY RANDOM() LIMIT 5;
SELECT COUNT(*) FROM trivia_questions;
SELECT COUNT(*) FROM trivia_questions WHERE difficulty = 'easy';
SELECT * FROM trivia_questions WHERE difficulty = 'easy';
SELECT * FROM trivia_questions WHERE category = 'Science: Mathematics' LIMIT 5;
SELECT * FROM trivia_questions WHERE category = 'Science: Mathematics' AND difficulty = 'hard';
SELECT * FROM trivia_questions WHERE category != 'Entertainment' AND difficulty IN ('medium', 'hard') ORDER BY RANDOM() LIMIT 10;

SELECT category, COUNT(*) AS total_attempts, 
       SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct_answers,
       ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS accuracy_percentage
FROM student_progress sp
JOIN trivia_questions q ON sp.question_id = q.id
WHERE student_id = 1
GROUP BY category
ORDER BY accuracy_percentage;


--Select All submissions joined by the question id to get other question info as well
SELECT 
    sp.submission_id,
    sp.student_id,
    sp.timestamp,
	sp.is_correct,
    tq.category,
    tq.difficulty,
    tq.question
FROM student_progress sp
JOIN trivia_questions tq ON sp.question_id = tq.id;