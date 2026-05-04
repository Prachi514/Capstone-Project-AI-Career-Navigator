import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Attempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`/api/assessment/attempts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAttempt(data.attempt);
      } catch (err) {
        console.error('Failed to load attempt', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!attempt) return <div className="min-h-screen flex items-center justify-center">Attempt not found or you don't have access.</div>;

  const qs = attempt.questions || [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Attempt Analysis</h2>
            <div className="text-sm text-gray-600">{new Date(attempt.date).toLocaleString()} • Class: {attempt.class}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{attempt.correct}/{attempt.totalQuestions}</div>
            <div className="text-sm text-gray-500">{Number(attempt.percentage).toFixed(2)}%</div>
          </div>
        </div>

        {qs.length === 0 ? (
          <div className="text-sm text-gray-600">No detailed questions were saved for this attempt.</div>
        ) : (
          <div className="space-y-4">
            {qs.map((q, idx) => {
              const userAns = attempt.answers?.[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={idx} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-4">
                    <div className="font-semibold">Q{idx+1}.</div>
                    <div className="flex-1">
                      <div className="mb-2 font-medium">{q.question}</div>
                      <div className="space-y-2">
                        {q.options && q.options.map((opt, oi) => (
                          <div key={oi} className={`p-2 rounded ${userAns === oi ? (isCorrect ? 'bg-green-200' : 'bg-red-200') : 'bg-white'} border`}>
                            <div className="flex items-center justify-between">
                              <div>{String.fromCharCode(65+oi)}. {opt}</div>
                              {q.correctAnswer === oi && <span className="text-sm text-green-700 font-semibold">Correct</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-sm">
                        <div className="font-semibold">Your Answer:</div>
                        <div>{userAns !== undefined ? (q.options?.[userAns] ?? 'Not answered') : 'Not answered'}</div>
                      </div>

                      <div className="mt-2 text-sm text-gray-700">
                        <div className="font-semibold">Explanation:</div>
                        <div>{q.explanation || 'No explanation provided.'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
