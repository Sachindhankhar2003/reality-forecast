import { prisma } from '@/lib/db';
import { Cpu } from 'lucide-react';

export default async function AdminAIPage() {
  const [totalRequests, successfulRequests, failedRequests, totalConversations, totalMessages] = await Promise.all([
    prisma.aPIUsage.count(),
    prisma.aPIUsage.count({ where: { success: true } }),
    prisma.aPIUsage.count({ where: { success: false } }),
    prisma.conversation.count(),
    prisma.conversationMessage.count(),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          AI Operational Activity
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Safe operational AI request counts, success rates, and tool activity metadata.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card card-purple">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>AI CONVERSATIONS</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {totalConversations}
          </div>
        </div>

        <div className="card card-indigo">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>MESSAGES STORED</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818CF8', marginTop: '0.25rem' }}>
            {totalMessages}
          </div>
        </div>

        <div className="card card-emerald">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>TOTAL API REQUESTS</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
            {totalRequests}
          </div>
        </div>
      </div>
    </div>
  );
}
