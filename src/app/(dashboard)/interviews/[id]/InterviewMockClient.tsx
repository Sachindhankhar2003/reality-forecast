'use client';

import { useState } from 'react';
import { InterviewAnalysis } from '@/services/interview/interview-engine';
import { submitMockAnswerAction } from '@/actions/interview-actions';
import { Briefcase, Send, CheckCircle2, AlertCircle, ArrowLeft, MessageSquare, Award, Sparkles, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  interview: InterviewAnalysis;
}

export function InterviewMockClient({ interview }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [turns, setTurns] = useState<{
    question: string;
    answer?: string;
    evaluation?: { score: number; feedback: string; strengths: string[]; improvements: string[]; followUpQuestion?: string };
  }[]>([
    { question: interview.suggestedQuestions[0].text }
  ]);

  const currentQ = interview.suggestedQuestions[currentQuestionIndex];

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);

    const res = await submitMockAnswerAction(currentQ.text, userAnswer);

    if (res.success && res.data) {
      const newTurns = [...turns];
      newTurns[currentQuestionIndex] = {
        question: currentQ.text,
        answer: userAnswer,
        evaluation: res.data,
      };
      setTurns(newTurns);
      setUserAnswer('');

      if (currentQuestionIndex + 1 < interview.suggestedQuestions.length) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTurns((prev) => [
            ...prev,
            { question: interview.suggestedQuestions[currentQuestionIndex + 1].text }
          ]);
        }, 500);
      } else {
        setCompleted(true);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back Navigation */}
      <div>
        <Link href="/interviews" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Interview Intelligence</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              ADAPTIVE INTERVIEW PREPARATION
            </span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {interview.roleTitle} @ {interview.companyName}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Adaptive technical question generation & STAR method evaluation simulator.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TECHNICAL</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                {Math.round(interview.technicalReadiness * 100)}%
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>BEHAVIORAL</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {Math.round(interview.behavioralReadiness * 100)}%
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>ROLE MATCH</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {Math.round(interview.roleMatchScore * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Session Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)', gap: '1.5rem' }}>
        {/* Left Column: Active Question & Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!completed ? (
            <div className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary">
                  QUESTION {currentQuestionIndex + 1} OF {interview.suggestedQuestions.length}
                </span>
                <span className="badge badge-neutral">{currentQ?.difficulty || 'MEDIUM'} DIFFICULTY</span>
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                "{currentQ?.text}"
              </div>

              <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Provide your structured response (Use Situation, Task, Action, Result)..."
                  className="textarea"
                  style={{ minHeight: '120px', fontSize: '0.875rem' }}
                  disabled={loading}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !userAnswer.trim()}>
                    <Send size={15} />
                    <span>{loading ? 'Evaluating STAR Answer...' : 'Submit Answer'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card" style={{ background: 'var(--bg-secondary)', textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={36} color="var(--success)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Interview Preparation Session Complete
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                You have completed all generated interview questions. Your responses have been evaluated using the STAR framework.
              </p>
              <Link href="/interviews" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                View Final Readiness Report
              </Link>
            </div>
          )}

          {/* Previous Evaluated Responses */}
          {turns.filter((t) => t.evaluation).map((turn, i) => (
            <div key={i} className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Q: {turn.question}
              </div>
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Your Answer:</strong> {turn.answer}
              </div>
              {turn.evaluation && (
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', border: '1px solid rgba(37,99,235,0.2)', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                    STAR Evaluation Score: {turn.evaluation.score}/100
                  </div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{turn.evaluation.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Question Roadmap & Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Interview Question Roadmap
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {interview.suggestedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: idx === currentQuestionIndex ? 'var(--accent-glow)' : 'var(--bg-muted)',
                    border: idx === currentQuestionIndex ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    fontWeight: idx === currentQuestionIndex ? 700 : 500,
                    color: idx === currentQuestionIndex ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <span style={{ marginRight: '0.4rem' }}>{idx + 1}.</span>
                  {q.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
