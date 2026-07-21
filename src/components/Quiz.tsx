 
import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizProps {
  skill: string;
  questions: Question[];
  onClose: () => void;
}

function Quiz({ skill, questions, onClose }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
  }

  function nextQuestion() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  }

  const score = answers.filter((ans, i) => ans === questions[i]?.correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  function getScoreColor() {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  }

  function getScoreMessage() {
    if (percentage >= 80) return '🎉 Excellent! You have great knowledge!';
    if (percentage >= 60) return '👍 Good job! Keep practicing!';
    return '📚 Keep learning! You will get better!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>

      <div className="w-full max-w-lg rounded-2xl p-8"
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid rgba(255,255,255,0.15)' }}>

        {!showResult ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">🤖 AI Quiz</h2>
                <p className="text-purple-300 text-sm mt-1">{skill}</p>
              </div>
              <span className="text-gray-400 text-sm">
                {currentQ + 1} / {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }} />
            </div>

            {/* Question */}
            <div className="mb-6 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-white text-lg leading-relaxed">{questions[currentQ].question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {questions[currentQ].options.map((option, i) => {
                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.1)';
                let color = 'white';

                if (selected !== null) {
                  if (i === questions[currentQ].correct) {
                    bg = 'rgba(16,185,129,0.2)';
                    border = 'rgba(16,185,129,0.5)';
                    color = '#86efac';
                  } else if (i === selected && selected !== questions[currentQ].correct) {
                    bg = 'rgba(239,68,68,0.2)';
                    border = 'rgba(239,68,68,0.5)';
                    color = '#fca5a5';
                  }
                } else if (selected === i) {
                  bg = 'rgba(124,58,237,0.3)';
                  border = 'rgba(168,85,247,0.5)';
                }

                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-xl text-left transition-all duration-200"
                    style={{ background: bg, border: `1px solid ${border}`, color }}>
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button onClick={nextQuestion} disabled={selected === null}
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{
                background: selected !== null ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                opacity: selected !== null ? 1 : 0.5,
                cursor: selected !== null ? 'pointer' : 'not-allowed'
              }}>
              {currentQ + 1 === questions.length ? 'See Results 🎯' : 'Next Question →'}
            </button>
          </>
        ) : (
          // Results
          <div className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-400 mb-6">{skill}</p>

            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `${getScoreColor()}20`, border: `3px solid ${getScoreColor()}` }}>
              <div>
                <div className="text-3xl font-bold" style={{ color: getScoreColor() }}>{percentage}%</div>
                <div className="text-xs text-gray-400">{score}/{questions.length}</div>
              </div>
            </div>

            <p className="text-lg text-white mb-8">{getScoreMessage()}</p>

            <div className="space-y-2 mb-8 text-left">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{answers[i] === q.correct ? '✅' : '❌'}</span>
                  <span className="text-gray-300 truncate">{q.question}</span>
                </div>
              ))}
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' }}>
              Close Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;