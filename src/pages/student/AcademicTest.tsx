import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const questions = [
  { id: 1, text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
  { id: 2, text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars' },
  { id: 3, text: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Great White Shark'], answer: 'Blue Whale' },
  { id: 4, text: 'Who wrote the play Romeo and Juliet?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], answer: 'William Shakespeare' },
  { id: 5, text: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], answer: 'H2O' },
];

export default function AcademicTestPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setSubmitted(true);
    try {
      const response = await fetch('/api/student/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: correctAnswers }),
      });
      if (!response.ok) throw new Error('Failed to submit test results');
    } catch (err) {
      console.error(err);
      // Optionally show an error message to the user
    }
  };

  if (submitted) {
    return (
      <div className="bg-gray-50 h-full p-6 font-sans flex flex-col items-center justify-center text-center">
        <Check className="w-24 h-24 text-green-500 bg-green-100 rounded-full p-4 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Submitted!</h1>
        <p className="text-gray-600 mb-4">Your score has been recorded.</p>
        <p className="text-5xl font-bold text-blue-500">{score} / {questions.length}</p>
        <button className="mt-8 text-blue-500 font-semibold flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-full p-6 font-sans">
      <header className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Academic Ability Test</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="font-semibold text-lg text-gray-800 mb-4">{index + 1}. {q.text}</p>
            <div className="space-y-3">
              {q.options.map(option => (
                <label key={option} className="flex items-center p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                  <input 
                    type="radio" 
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleOptionChange(q.id, option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-4 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/30"
          >
            Submit Test
          </button>
        </div>
      </form>
    </div>
  );
}
