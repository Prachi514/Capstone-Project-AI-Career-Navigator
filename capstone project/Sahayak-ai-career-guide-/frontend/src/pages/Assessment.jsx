import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { questionBanks } from '../data/assessmentQuestions';

const QUIZ_TIME_LIMIT = 30 * 60; // 30 minutes in seconds

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState('classSelection'); // classSelection, quiz, results
  const [selectedClass, setSelectedClass] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_LIMIT);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const quizContainerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const [attempts, setAttempts] = useState([]);

  const classOptions = ['10th', '12th'];

  // Timer effect
  useEffect(() => {
    if (step !== 'quiz') return;

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [step, questions]);

  // When entering the quiz step we attempt to enter fullscreen automatically
  useEffect(() => {
    if (step === 'quiz' && quizContainerRef.current && !document.fullscreenElement) {
      quizContainerRef.current.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          /* user may block fullscreen - ignore */
        });
    }
  }, [step]);

  // Fetch user's past attempts to show on the Assessment page
  useEffect(() => {
    const fetchAttempts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/assessment/my-attempts', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setAttempts(data.attempts || []);
      } catch (err) {
        console.error('Failed to load attempts', err);
      }
    };

    fetchAttempts();
  }, []);

  const handleAutoSubmit = () => {
    if (step === 'quiz') {
      handleSubmitQuiz();
    }
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      quizContainerRef.current?.requestFullscreen?.().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClassSelect = (cls) => {
    // Prepare questions and show instructions before starting
    setSelectedClass(cls);
    setQuestions(questionBanks[cls].questions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setStep('instructions');
  };

  const startTest = () => {
    // Start the quiz; a useEffect will attempt fullscreen automatically
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setStep('quiz');
  };

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitQuiz = () => {
    // Calculate results
    let correct = 0;
    let wrong = 0;
    const wrongAnswerDetails = [];
    const categoryScores = { aptitude: { correct: 0, total: 0 }, english: { correct: 0, total: 0 } };

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correct++;
      } else {
        wrong++;
        wrongAnswerDetails.push({
          questionIndex: index + 1,
          question: question.question,
          userAnswer: question.options[userAnswer] || 'Not answered',
          correctAnswer: question.options[question.correctAnswer],
          explanation: question.explanation,
          type: question.type
        });
      }

      // Category-wise scoring
      categoryScores[question.type].total++;
      if (isCorrect) {
        categoryScores[question.type].correct++;
      }
    });

    const percentage = (correct / questions.length) * 100;

    // Exit fullscreen before showing results
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }

    setResults({
      correct,
      wrong,
      percentage: percentage.toFixed(2),
      wrongAnswerDetails,
      categoryScores,
      selectedClass,
      timeSpent: QUIZ_TIME_LIMIT - timeRemaining
    });

    // Save attempt to server and update local attempts list
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const payload = {
          selectedClass,
          totalQuestions: questions.length,
          correct,
          wrong,
          percentage: Number((percentage).toFixed(2)),
          answers,
          timeSpent: QUIZ_TIME_LIMIT - timeRemaining,
          questions // include full question objects for later analysis
        };
        const res = await fetch('/api/assessment/save-quiz-attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          const savedAttempt = data.attempt || ({ ...payload, date: new Date().toISOString() });
          setAttempts(prev => [savedAttempt, ...(prev || [])]);
        }
      } catch (err) {
        console.error('Failed to save attempt:', err);
      }
    })();

    setStep('results');
    
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleRestart = () => {
    setStep('classSelection');
    setSelectedClass('');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setQuestions([]);
    setTimeRemaining(QUIZ_TIME_LIMIT);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const answerPercentage = (answeredCount / questions.length) * 100;
  const isTimeWarning = timeRemaining < 300; // Warning in last 5 minutes
  const isTimeCritical = timeRemaining < 60; // Critical in last minute

  // === RENDER: Class Selection ===
  if (step === 'classSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Aptitude & English Assessment</h1>
            <p className="text-gray-600">Select your class to begin the test</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 mb-6">Choose your current class:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classOptions.map(cls => (
                <button
                  key={cls}
                  onClick={() => handleClassSelect(cls)}
                  className="p-8 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
                >
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{cls}</div>
                  <p className="text-gray-600">20 Questions (Aptitude & English)</p>
                </button>
              ))}
            </div>

            {/* Past Attempts (visible on Assessment page) */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">My Past Attempts</h3>
              <div className="max-h-64 overflow-y-auto">
                {attempts.length === 0 ? (
                  <div className="text-sm text-gray-600">No attempts yet. Take a test to see your results here.</div>
                ) : (
                  <div className="space-y-3">
                    {attempts.map((a, i) => (
                      <div key={a._id || i} onClick={() => navigate(`/attempts/${a._id || a.id}`)} role="button" tabIndex={0} className="p-4 border rounded-lg bg-white hover:shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">{new Date(a.date).toLocaleString()}</div>
                            <div className="text-md font-semibold">Class: {a.class || 'N/A'}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{a.correct}/{a.totalQuestions}</div>
                            <div className="text-sm text-gray-500">{Number(a.percentage).toFixed(2)}%</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">Time Spent: {a.timeSpent ? `${Math.floor(a.timeSpent/60)}m ${a.timeSpent%60}s` : 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: Instructions Before Starting ===
  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setStep('classSelection')}
              className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
            >
              ← Change Class
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Instructions</h1>
            <p className="text-gray-600">Read the following instructions before starting the test.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
              <li>Total duration: <strong>30 minutes</strong>.</li>
              <li>The test contains <strong>20 multiple-choice</strong> questions (Aptitude & English).</li>
              <li>Once you click <strong>Start Test</strong>, the test will enter fullscreen mode.</li>
              <li>The timer will begin immediately and auto-submit when time runs out.</li>
              <li>You can navigate between questions and submit anytime before the time ends.</li>
            </ul>

            <div className="flex items-center gap-4">
              <button
                onClick={startTest}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition"
              >
                🖥️ Start Test (Enter Fullscreen)
              </button>
              <button
                onClick={() => setStep('classSelection')}
                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: Quiz ===
  if (step === 'quiz' && currentQuestion) {
    return (
      <div 
        ref={quizContainerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900`}
      >
        <div className={`${isFullscreen ? 'h-screen overflow-y-auto' : ''}`}>
          {/* Professional Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 text-white sticky top-0 z-40 shadow-2xl">
            <div className={`${isFullscreen ? 'px-8 py-4' : 'max-w-6xl mx-auto px-6 py-4'}`}>
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Manzil Assessment Test</h1>
                    <p className="text-indigo-200 text-sm">Class {selectedClass} | Question {currentQuestionIndex + 1}/{questions.length}</p>
                  </div>
                </div>

                {/* Right Section - Timer & Actions */}
                <div className="flex items-center gap-6">
                  {/* Timer */}
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                    isTimeCritical 
                      ? 'bg-red-500/20 border-2 border-red-400' 
                      : isTimeWarning 
                      ? 'bg-yellow-500/20 border-2 border-yellow-400'
                      : 'bg-white/10 border-2 border-white/20'
                  }`}>
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <p className="text-xs text-indigo-200">Time Remaining</p>
                      <p className={`text-lg font-bold ${
                        isTimeCritical ? 'text-red-300 animate-pulse' : isTimeWarning ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {formatTime(timeRemaining)}
                      </p>
                    </div>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-2 hover:bg-white/20 rounded-lg transition text-xl"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {/* {isFullscreen ? '⛔' : '🖥️'} */}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${isFullscreen ? 'px-8 py-6' : 'max-w-6xl mx-auto px-6 py-8'}`}>
            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Answered</p>
                <p className="text-3xl font-bold text-white">{answeredCount}/{questions.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Progress</p>
                <p className="text-3xl font-bold text-white">{answerPercentage.toFixed(0)}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Unanswered</p>
                <p className="text-3xl font-bold text-white">{questions.length - answeredCount}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="flex justify-between mb-3">
                <p className="text-indigo-200 font-semibold">Test Progress</p>
                <p className="text-white font-bold">{answerPercentage.toFixed(0)}%</p>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-3 rounded-full transition duration-300"
                  style={{ width: `${answerPercentage}%` }}
                />
              </div>
            </div>

            {/* Question Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Card */}
              <div className="lg:col-span-3">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
                  {/* Type Badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      currentQuestion.type === 'aptitude' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {currentQuestion.type === 'aptitude' ? '🧮 Aptitude' : '📖 English'}
                    </span>
                  </div>

                  {/* Question Number & Text */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                    Q{currentQuestionIndex + 1}. {currentQuestion.question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full p-5 rounded-xl border-3 text-left transition duration-200 transform hover:scale-105 ${
                          answers[currentQuestionIndex] === idx
                            ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition ${
                            answers[currentQuestionIndex] === idx
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-gray-300 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className={`text-lg ${answers[currentQuestionIndex] === idx ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>
                            {option}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ← Previous
                    </button>
                    
                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition shadow-lg"
                      >
                        ✓ Submit Test Now
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition shadow-lg"
                      >
                        Next Question →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Navigator Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sticky top-32">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Question Navigator</h3>
                  <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-full aspect-square rounded-lg font-bold text-sm transition transform hover:scale-110 ${
                          idx === currentQuestionIndex
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                            : answers[idx] !== undefined
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-xs text-gray-600">Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs text-gray-600">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded"></div>
                      <span className="text-xs text-gray-600">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis Modal for a selected attempt
  

  // === RENDER: Results ===
  if (step === 'results' && results) {
    const aptitudePercentage = (results.categoryScores.aptitude.correct / results.categoryScores.aptitude.total) * 100;
    const englishPercentage = (results.categoryScores.english.correct / results.categoryScores.english.total) * 100;

    // Chart Data
    const categoryChartData = {
      labels: ['Aptitude', 'English'],
      datasets: [{
        label: 'Correct Answers',
        data: [results.categoryScores.aptitude.correct, results.categoryScores.english.correct],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderRadius: 8
      }]
    };

    const performanceChartData = {
      labels: ['Correct', 'Wrong'],
      datasets: [{
        data: [results.correct, results.wrong],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0
      }]
    };

    const categoryPercentageChartData = {
      labels: ['Aptitude', 'English'],
      datasets: [{
        label: 'Percentage',
        data: [aptitudePercentage.toFixed(1), englishPercentage.toFixed(1)],
        borderColor: ['#3b82f6', '#10b981'],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderWidth: 2,
        pointRadius: 6,
        fill: true,
        tension: 0.4
      }]
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">🎉 Assessment Results - Class {results.selectedClass}</h1>

          {/* Main Score Card */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white mb-8">
            <div className="text-center">
              <div className="text-7xl font-bold mb-2 animate-bounce">{results.percentage}%</div>
              <div className="text-2xl font-bold mb-4">Score: {results.correct}/{questions.length} Correct</div>
              <p className="text-indigo-100 text-lg mb-6">
                ✓ Correct: {results.correct} | ✗ Wrong: {results.wrong}
              </p>
              
              {/* Time Spent */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 inline-block">
                <p className="text-indigo-200 text-sm">Time Spent</p>
                <p className="text-2xl font-bold text-white">
                  {formatTime(results.timeSpent || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart - Category Wise */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Questions by Category</h3>
              <div className="relative h-64">
                <Bar
                  data={categoryChartData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
            </div>

            {/* Pie Chart - Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Performance</h3>
              <div className="relative h-64">
                <Pie
                  data={performanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>
            </div>

            {/* Line Chart - Category Percentage */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Category Performance %</h3>
              <div className="relative h-64">
                <Line
                  data={categoryPercentageChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aptitude */}
              <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-900">🧮 Aptitude</h3>
                  <span className="text-2xl font-bold text-blue-600">{aptitudePercentage.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-blue-700 mb-3">
                  {results.categoryScores.aptitude.correct} / {results.categoryScores.aptitude.total} correct
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition"
                    style={{ width: `${aptitudePercentage}%` }}
                  />
                </div>
              </div>

              {/* English */}
              <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-900">📖 English</h3>
                  <span className="text-2xl font-bold text-green-600">{englishPercentage.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-green-700 mb-3">
                  {results.categoryScores.english.correct} / {results.categoryScores.english.total} correct
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition"
                    style={{ width: `${englishPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wrong Answers */}
          {results.wrongAnswerDetails.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Wrong Answers ({results.wrongAnswerDetails.length})</h2>
              <div className="space-y-6">
                {results.wrongAnswerDetails.map((detail, idx) => (
                  <div key={idx} className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl font-bold text-red-600">Q{detail.questionIndex}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-3">{detail.question}</h3>
                        
                        <div className="space-y-2 mb-3">
                          <div className="p-3 rounded-lg bg-red-100 border-l-4 border-red-600">
                            <p className="text-sm font-semibold text-red-700">Your Answer: <span className="text-red-900">{detail.userAnswer}</span></p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-100 border-l-4 border-green-600">
                            <p className="text-sm font-semibold text-green-700">Correct Answer: <span className="text-green-900">{detail.correctAnswer}</span></p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Explanation:</span></p>
                          <p className="text-sm text-gray-600">{detail.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleRestart}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition"
            >
              Take Test Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
