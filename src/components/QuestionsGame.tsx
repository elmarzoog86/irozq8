'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Question, getRandomQuestions } from '@/data/questions';

interface QuestionsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean}>;
  setPlayers: (players: any[]) => void;
  questionsPerRound: number;
  onEndGame: () => void;
  onAnswerSubmitted?: (hasAnswered: boolean) => void;
  onPlayersAnswering?: (playerIds: number[]) => void;
}

export interface QuestionsGameHandle {
  handleChatAnswer: (playerIndex: number, playerName: string, answer: string) => void;
}

const QuestionsGame = forwardRef<QuestionsGameHandle, QuestionsGameProps>(({
  players,
  setPlayers,
  questionsPerRound,
  onEndGame,
  onAnswerSubmitted,
  onPlayersAnswering,
}: QuestionsGameProps, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState<{[key: number]: number}>({});
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{player: string; answer: string; correct: boolean}>>([]);

  // Initialize questions based on questionsPerRound
  useEffect(() => {
    const qs = getRandomQuestions(questionsPerRound);
    setQuestions(qs);
  }, [questionsPerRound]);

  // Notify parent when answer is submitted
  useEffect(() => {
    if (onAnswerSubmitted) {
      onAnswerSubmitted(answered);
    }
  }, [answered, onAnswerSubmitted]);

  // Notify parent of which players answered this question
  useEffect(() => {
    if (onPlayersAnswering) {
      const answeredPlayerIds = Object.keys(playerAnswers).map(key => {
        const playerIndex = parseInt(key);
        return players[playerIndex]?.id;
      }).filter(id => id !== undefined);
      onPlayersAnswering(answeredPlayerIds);
    }
  }, [playerAnswers, onPlayersAnswering, players]);

  // Timer countdown
  useEffect(() => {
    if (!questions.length || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired - show results
          setAnswered(true);
          setShowResults(true);
          setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
              setCurrentQuestionIndex(nextIndex);
              setTimeLeft(15);
              setAnswered(false);
              setShowResults(false);
              setPlayerAnswers({});
              setChatMessages([]);
            } else {
              setGameOver(true);
            }
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, gameOver, currentQuestionIndex, answered]);

  useImperativeHandle(ref, () => ({
    handleChatAnswer: (playerIndex: number, playerName: string, answer: string) => {
      handleChatAnswer(playerIndex, playerName, answer);
    },
  }));

  const handleChatAnswer = (playerIndex: number, playerName: string, answer: string) => {
    if (answered) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Try to find the answer by option text
    let answerIndex = currentQuestion.options.findIndex(
      (opt) => opt.toLowerCase().trim() === answer.toLowerCase().trim()
    );

    // Also check by letter (أ, ب, ج, د) or number (A, B, C, D)
    if (answerIndex === -1) {
      const letterMap: {[key: string]: number} = {
        'أ': 0, 'a': 0, 'ا': 0,
        'ب': 1, 'b': 1,
        'ج': 2, 'c': 2, 'ت': 2,
        'د': 3, 'd': 3,
      };
      const firstChar = answer.toLowerCase().trim()[0];
      if (letterMap[firstChar] !== undefined) {
        answerIndex = letterMap[firstChar];
      }
    }

    if (answerIndex !== -1) {
      // Only process first answer from this player
      if (playerAnswers[playerIndex]) return;

      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      // New scoring: max 86 points, faster = more points
      // Formula: If correct, give 86 - (seconds elapsed) = 86 - (15 - timeLeft)
      const points = isCorrect ? Math.max(1, 86 - (15 - timeLeft)) : 0;

      // Record the answer
      const updatedAnswers = { ...playerAnswers, [playerIndex]: answerIndex };
      setPlayerAnswers(updatedAnswers);

      // Award points
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].score += points;
      setPlayers(updatedPlayers);

      // Add to chat with the actual option text
      const newMessage = { 
        player: playerName, 
        answer: currentQuestion.options[answerIndex], 
        correct: isCorrect 
      };
      setChatMessages((prev) => [...prev, newMessage]);

      // If all players answered or it's the streamer's answer, show results
      if (Object.keys(updatedAnswers).length >= players.length || playerIndex === 0) {
        setAnswered(true);
        // Don't show results yet - wait for timer to expire
        // setShowResults will be set to true when timer reaches 0
      }
    }
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

          {/* Answer Input for Chat */}
          <div className="mb-8">
            <label className="block text-cyan-300 mb-3 font-bold">اكتب الإجابة في الدردشة:</label>
            <div className="p-4 bg-slate-700/30 rounded-lg border-2 border-cyan-500 min-h-48 max-h-48 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-12">في انتظار الإجابات...</div>
              ) : (
                <div className="space-y-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        showResults
                          ? msg.correct
                            ? 'bg-green-600/30 border-l-4 border-green-400'
                            : 'bg-red-600/30 border-l-4 border-red-400'
                          : 'bg-slate-600/30 border-l-4 border-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-cyan-300">{msg.player}:</span>
                        <span className={showResults ? (msg.correct ? 'text-green-300' : 'text-red-300') : 'text-gray-400'}>
                          {showResults ? (msg.correct ? '✅' : '❌') : '⏳'}
                        </span>
                      </div>
                      <div className="text-white ml-2">{msg.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-2">الدردشة: اكتب إحدى الخيارات (أ، ب، ج، د) أو اسم الخيار</p>
          </div>

          {/* Answer Options Display (always visible but visual feedback only after timer) */}
          <div className="mb-8">
            <p className="text-cyan-300 mb-3 font-bold">الخيارات:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                let bgColor = 'bg-slate-600/50';
                let borderColor = 'border-slate-500';
                let textColor = 'text-white';

                // Only show correct/wrong colors after timer expires or answer submitted
                if (showResults) {
                  if (index === currentQuestion.correctAnswer) {
                    bgColor = 'bg-green-600/70';
                    borderColor = 'border-green-400';
                    textColor = 'text-green-100';
                  } else if (playerAnswers[0] === index && index !== currentQuestion.correctAnswer) {
                    bgColor = 'bg-red-600/70';
                    borderColor = 'border-red-400';
                    textColor = 'text-red-100';
                  }
                }

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all font-bold text-lg ${bgColor} ${borderColor} ${textColor}`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show Result Message */}
          {showResults && (
            <div className="text-center p-6 bg-slate-800/80 rounded-lg border-2 border-cyan-500 mb-8">
              {playerAnswers[0] === currentQuestion.correctAnswer ? (
                <div className="text-2xl font-bold text-green-400">✅ إجابة صحيحة!</div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">❌ إجابة خاطئة</div>
                  <div className="text-cyan-300">
                    الإجابة الصحيحة: <span className="font-bold text-green-400">
                      {currentQuestion.options[currentQuestion.correctAnswer]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
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
});

QuestionsGame.displayName = 'QuestionsGame';

export default QuestionsGame;
