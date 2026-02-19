'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Question, getRandomQuestions } from '@/data/questions';

interface QuestionsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean}>;
  setPlayers: (players: any[]) => void;
  questionsPerRound: number;
  onEndGame: () => void;
}

export interface QuestionsGameHandle {
  handleChatAnswer: (playerIndex: number, playerName: string, answer: string) => void;
}

const QuestionsGame = forwardRef<QuestionsGameHandle, QuestionsGameProps>(({
  players,
  setPlayers,
  questionsPerRound,
  onEndGame,
}: QuestionsGameProps, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState<{[key: number]: {answerIndex: number; timeLeft: number}}>({});
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{player: string; answer: string; correct: boolean}>>([]);
  const pointsAwardedRef = useRef(false);
  const playerAnswersRef = useRef<{[key: number]: {answerIndex: number; timeLeft: number}}>({});
  const inTransitionRef = useRef(false);
  const currentQuestionIndexRef = useRef(0);

  // Initialize questions based on questionsPerRound
  useEffect(() => {
    const qs = getRandomQuestions(questionsPerRound);
    setQuestions(qs);
  }, [questionsPerRound]);

  // Reset state when question changes
  useEffect(() => {
    if (!questions.length) return;
    
    currentQuestionIndexRef.current = currentQuestionIndex;
    setTimeLeft(15);
    setAnswered(false);
    setShowResults(false);
    setPlayerAnswers({});
    setChatMessages([]);
    pointsAwardedRef.current = false;
    playerAnswersRef.current = {};
    inTransitionRef.current = false;
  }, [currentQuestionIndex, questions.length]);

  // Timer countdown effect
  useEffect(() => {
    if (!questions.length || gameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, gameOver, timeLeft]);

  // Award points when time runs out
  useEffect(() => {
    if (!questions.length || gameOver || timeLeft > 0 || !answered) return;

    // Only award points once per question
    if (pointsAwardedRef.current || inTransitionRef.current) return;
    pointsAwardedRef.current = true;
    inTransitionRef.current = true;

    // Award points now that timer has ended
    const updatedPlayers = [...players];
    Object.entries(playerAnswersRef.current).forEach(([playerIndexStr, answerData]) => {
      const playerIndex = parseInt(playerIndexStr);
      const answerIndex = answerData.answerIndex;
      const timeLeftWhenAnswered = answerData.timeLeft;
      // Use ref to get the correct current question index without dependency
      const isCorrect = answerIndex === questions[currentQuestionIndexRef.current].correctAnswer;
      // Award points only if correct: max 86 points
      // Scoring: 86 at start (15s left), drops 3 points per second
      // Formula: 86 - (seconds elapsed * 3) = 86 - ((15 - timeLeftWhenAnswered) * 3)
      const points = isCorrect ? Math.max(0, 86 - ((15 - timeLeftWhenAnswered) * 3)) : 0;
      updatedPlayers[playerIndex].score += points;
    });
    setPlayers(updatedPlayers);
    setShowResults(true);

    setTimeout(() => {
      const nextIndex = currentQuestionIndexRef.current + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setGameOver(true);
      }
    }, 3000);
  }, [timeLeft, answered, questions.length, gameOver, players]);

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

    // Also check by number (1, 2, 3, 4)
    if (answerIndex === -1) {
      const numberMap: {[key: string]: number} = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
      };
      const firstChar = answer.trim()[0];
      if (numberMap[firstChar] !== undefined) {
        answerIndex = numberMap[firstChar];
      }
    }

    if (answerIndex !== -1) {
      // Only process first answer from this player
      if (playerAnswers[playerIndex]) return;

      const isCorrect = answerIndex === currentQuestion.correctAnswer;

      // Record the answer with the current timeLeft WITHOUT awarding points yet
      const updatedAnswers = { ...playerAnswers, [playerIndex]: {answerIndex, timeLeft} };
      setPlayerAnswers(updatedAnswers);
      playerAnswersRef.current = updatedAnswers;

      // Mark player as joined and update their name when they answer
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].joined = true;
      updatedPlayers[playerIndex].name = playerName; // Update with actual chat username
      setPlayers(updatedPlayers);

      // Add to chat with the actual option text (show hourglass, not checkmark)
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
        <div className="text-2xl text-yellow-300">جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const timerColor =
    timeLeft > 10 ? 'text-yellow-400' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="w-full">
      {!gameOver ? (
        <>
          {/* Question Progress */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-yellow-300">
              السؤال {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className={`text-4xl font-bold ${timerColor}`}>{timeLeft}s</div>
          </div>

          {/* Question */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-600/20 to-yellow-600/20 rounded-lg border-2 border-yellow-500">
            <h2 className="text-2xl font-bold text-yellow-300 text-center">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Input for Chat */}
          <div className="mb-8">
            <label className="block text-yellow-300 mb-3 font-bold">اكتب الإجابة في الدردشة:</label>
            <div className="p-4 bg-gray-800/30 rounded-lg border-2 border-yellow-500 min-h-48 max-h-48 overflow-y-auto">
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
                          : 'bg-slate-600/30 border-l-4 border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-yellow-300">{msg.player}:</span>
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
            <p className="text-gray-400 text-sm mt-2">الدردشة: اكتب رقم الخيار (1، 2، 3، 4) أو اسم الخيار</p>
          </div>

          {/* Answer Options Display - always visible so viewers can choose */}
          <div className="mb-8">
            <p className="text-yellow-300 mb-3 font-bold">الخيارات:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                let bgColor = 'bg-slate-600/50';
                let borderColor = 'border-gray-500';
                let textColor = 'text-white';

                // Show correct/wrong colors after timer expires
                if (showResults) {
                  if (index === currentQuestion.correctAnswer) {
                    bgColor = 'bg-green-600/70';
                    borderColor = 'border-green-400';
                    textColor = 'text-green-100';
                  } else if (playerAnswers[0]?.answerIndex === index && index !== currentQuestion.correctAnswer) {
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
                    {index + 1}. {option}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show Result Message */}
          {showResults && (
            <div className="text-center p-6 bg-gray-900/80 rounded-lg border-2 border-yellow-500 mb-8">
              {playerAnswers[0]?.answerIndex === currentQuestion.correctAnswer ? (
                <div className="text-2xl font-bold text-green-400">✅ إجابة صحيحة!</div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">❌ إجابة خاطئة</div>
                  <div className="text-yellow-300">
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
          <h2 className="text-4xl font-bold text-yellow-300 mb-8">🏆 انتهت اللعبة! 🏆</h2>

          {/* Final Rankings - Only show players who answered */}
          <div className="space-y-4 mb-8">
            {[...players]
              .filter(player => player.joined) // Only show players who answered
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 rounded-lg border-2 border-yellow-500"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-yellow-300">
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      {player.name}
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{player.score}</div>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={handleEndGame}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg"
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
