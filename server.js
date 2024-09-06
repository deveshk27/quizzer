const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let quizzes = [];

app.post('/api/quizzes', (req, res) => {
  const newQuiz = req.body;
  newQuiz.id = quizzes.length + 1;
  quizzes.push(newQuiz);
  res.json(newQuiz);
});

app.get('/api/quizzes', (req, res) => {
  res.json(quizzes);
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzes.find(q => q.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).send('Quiz not found');
  res.json(quiz);
});

app.post('/api/quizzes/:id/submit', (req, res) => {
  const quiz = quizzes.find(q => q.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).send('Quiz not found');
  
  const userAnswers = req.body.answers;
  let score = 0;
  const results = quiz.questions.map((question, index) => {
    const isCorrect = question.correctAnswer === userAnswers[index];
    if (isCorrect) score++;
    return { ...question, userAnswer: userAnswers[index], isCorrect };
  });
  
  res.json({ score, total: quiz.questions.length, results });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

////////////////////////