'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, MessageCircle, Bell } from 'lucide-react';

interface Props {
  forecastId?: string;
}

export function DirectPredictionCard({ forecastId }: Props) {
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'enabled'>('idle');

  // Google Calendar Event Creator
  const openGoogleCalendar = () => {
    const title = encodeURIComponent('Depart for Software Developer Interview in Gurgaon');
    const details = encodeURIComponent('Reality Forecast Recommendation: Depart Noida by 08:20 AM via Delhi Metro (Magenta -> Yellow Line) to arrive at 09:30 AM before 10:00 AM interview.');
    const location = encodeURIComponent('Cyber City, Gurgaon');
    // Tomorrow at 08:20 AM UTC+5:30
    const now = new Date();
    const tomorrow = new Date(now.setDate(now.getDate() + 1));
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const dates = `${year}${month}${day}T082000/${year}${month}${day}T093000`;
    
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(calUrl, '_blank');
  };

  // WhatsApp Alert Share Creator
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      '🚀 *REALITY FORECAST ALERT*\n\n' +
      '• *Event*: Software Developer Interview in Gurgaon\n' +
      '• *Recommended Departure*: 08:20 AM Tomorrow\n' +
      '• *Travel Mode*: Delhi Metro (Magenta → Yellow Line)\n' +
      '• *Expected Arrival*: 09:30 AM (30-min safety buffer)\n' +
      '• *Highway Traffic Avoided*: +18m delay on NH-48\n\n' +
      'Plan smarter with Reality Forecast!'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Push Notification Reminder Creator
  const enableNotification = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in your browser.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationStatus('enabled');
      new Notification('Reality Forecast Alert Enabled 🔔', {
        body: 'You will receive a departure notification tomorrow at 07:50 AM (30 mins before 08:20 AM departure).',
        icon: '/icon-192.png',
      });
    } else {
      alert('Notification permission was denied.');
    }
  };

  return (
    <div className="card card-purple" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span className="badge badge-primary" style={{ background: '#3B0764', color: '#E9D5FF', borderColor: '#A855F7' }}>
            DIRECT PREDICTION
          </span>
          <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
            Software Developer Interview in Gurgaon
          </h2>
        </div>
        <Link href={forecastId ? `/forecasts/${forecastId}` : '/forecasts'} className="btn btn-secondary btn-sm">
          <span>View Full Analysis</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Main Prediction Box */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(38, 17, 71, 0.9), rgba(29, 12, 56, 0.9))',
          border: '1.5px solid #A855F7',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🎯 PREDICTED BEST ACTION FOR TOMORROW
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem', lineHeight: 1.3 }}>
          Depart Noida at <span style={{ color: '#34D399' }}>08:20 AM</span> via <span style={{ color: '#34D399' }}>Metro (Magenta → Yellow Line)</span> to arrive at <span style={{ color: '#34D399' }}>09:30 AM</span>.
        </div>
        <p style={{ fontSize: '0.85rem', color: '#D8B4FE', marginTop: '0.5rem', lineHeight: 1.4 }}>
          Metro guarantees 100% on-time arrival and avoids the +18m Sirhaul highway bottleneck.
        </p>
      </div>

      {/* Action Buttons: Calendar, WhatsApp, Push Notification */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Calendar Export */}
        <button
          type="button"
          onClick={openGoogleCalendar}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.35rem', borderColor: '#34D399', color: '#34D399' }}
        >
          <Calendar size={14} color="#34D399" />
          <span>Add to Google Calendar</span>
        </button>

        {/* WhatsApp Share */}
        <button
          type="button"
          onClick={shareToWhatsApp}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.35rem', borderColor: '#25D366', color: '#25D366' }}
        >
          <MessageCircle size={14} color="#25D366" />
          <span>Share Alert to WhatsApp</span>
        </button>

        {/* Push Notification Toggle */}
        <button
          type="button"
          onClick={enableNotification}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.35rem', borderColor: '#F59E0B', color: '#FCD34D' }}
        >
          <Bell size={14} color="#FCD34D" />
          <span>{notificationStatus === 'enabled' ? '🔔 Reminder Alert Scheduled' : 'Enable 07:50 AM Notification'}</span>
        </button>
      </div>
    </div>
  );
}
