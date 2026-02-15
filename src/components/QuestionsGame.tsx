'use client';

import { useState, useEffect } from 'react';
import { Question, getRandomQuestions } from '@/data/questions';

interface QuestionsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean}>;
  setPlayers: (players: any[]) => void;
  questionsPerRound: number;
  onEndGame: () => void;
}

export default function QuestionsGame({
  players,
  setPlayers,
  questionsPerRound,
  onEndGame,
}: QuestionsGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Initialize questions based on questionsPerRound
  useEffect(() => {
    const qs = getRandomQuestions(questionsPerRound);
    setQuestions(qs);
  }, [questionsPerRound]);

  // Timer countdown
  useEffect(() => {
    if (answered || !questions.length || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired - automatically move to next question
          setAnswered(true);
          setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
              setCurrentQuestionIndex(nextIndex);
              setTimeLeft(15);
              setAnswered(false);
              setSelectedAnswer(null);
            } else {
              setGameOver(true);
            }
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, questions.length, gameOver, currentQuestionIndex]);

  const handleAnswerClick = (answerIndex: number) => {
    if (answered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const points = isCorrect ? Math.max(10, 15 - (15 - timeLeft)) : 0;

    // Award points to first player to answer (simplified)
    const updatedPlayers = [...players];
    updatedPlayers[0].score += points;
    setPlayers(updatedPlayers);

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    // Move to next question after 2 seconds
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setTimeLeft(15);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const handleEndGame = () => {
    const winner = [...players].sort((a, b) => b.score - a.score)[0];
    alert(`انتهت اللعبة! 🏆\n\nالفائز: ${winner.name}\nالنقاط: ${winner.score}`);
    onEndGame();
  };

  if (!questions.length) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-cyan-300">جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const timerColor =
    timeLeft > 10 ? 'text-cyan-400' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="w-full">
      {!gameOver ? (
        <>
          {/* Question Progress */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-cyan-300">
              السؤال {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className={`text-4xl font-bold ${timerColor}`}>{timeLeft}s</div>
          </div>

          {/* Question */}
          <div className="mb-8 p-6 bg-gradient-to-r from-cyan-600/20 to-pink-600/20 rounded-lg border-2 border-cyan-500">
            <h2 className="text-2xl font-bold text-cyan-300 text-center">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let bgColor = 'bg-slate-600/50 hover:bg-slate-600/70';
              let borderColor = 'border-slate-500';

              if (answered) {
                if (index === currentQuestion.correctAnswer) {
                  bgColor = 'bg-green-600/70';
                  borderColor = 'border-green-400';
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  bgColor = 'bg-red-600/70';
                  borderColor = 'border-red-400';
                } else {
                  bgColor = 'bg-slate-600/30';
                  borderColor = 'border-slate-600';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answered}
                  className={`p-4 rounded-lg border-2 transition-all text-white font-bold text-lg ${bgColor} ${borderColor} ${
                    !answered ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              );
            })}
          </div>

          {/* Players Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className="p-4 bg-cyan-900/50 rounded-lg border-2 border-cyan-500 text-center"
              >
                <div className="font-bold text-cyan-300 mb-2">{player.name}</div>
                <div className="text-3xl font-bold text-pink-400">{player.score}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-cyan-300 mb-8">🏆 انتهت اللعبة! 🏆</h2>

          {/* Final Rankings */}
          <div className="space-y-4 mb-8">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 bg-gradient-to-r from-cyan-600/30 to-pink-600/30 rounded-lg border-2 border-cyan-500"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-cyan-300">
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      {player.name}
                    </div>
                    <div className="text-3xl font-bold text-pink-400">{player.score}</div>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={handleEndGame}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            ← العودة للألعاب
          </button>
        </div>
      )}
    </div>
  );
}
