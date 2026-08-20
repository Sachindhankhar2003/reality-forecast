'use client';

import { useState } from 'react';
import { ArrowRight, MapPin, Mic } from 'lucide-react';

export function QuickPredictInput() {
  const [promptText, setPromptText] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState('');
  const [isListening, setIsListening] = useState(false);

  const samplePrompts = [
    { label: '💼 Interview in Gurgaon', text: 'Tomorrow I have a 10 AM developer interview in Cyber City Gurgaon.' },
    { label: '✈️ Flight at IGI Airport', text: 'Tomorrow I have a 4 PM flight from IGI Airport Delhi T3.' },
    { label: '🚆 Train at NDLS Station', text: 'Tomorrow 6 AM Vande Bharat train from New Delhi Railway Station.' },
    { label: '🏢 Client Meeting CP', text: 'Tomorrow 11:30 AM client meeting in Connaught Place Block B.' },
  ];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        setDetectedLocation(`Noida / Delhi NCR (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
      },
      () => {
        setIsDetectingLocation(false);
        setDetectedLocation('Noida Sector 62 (Default)');
      }
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Speech Recognition is not supported in your browser. Please type your prompt.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPromptText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <form action="/forecasts/new" method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      
      {/* Location Auto-Detect Bar & Voice Input */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={detectLocation}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.35rem', color: '#60A5FA', borderColor: '#3B82F6' }}
          >
            <MapPin size={14} color="#60A5FA" />
            <span>{isDetectingLocation ? 'Detecting GPS...' : detectedLocation ? `📍 Origin: ${detectedLocation}` : 'Detect Current Location'}</span>
          </button>

          <button
            type="button"
            onClick={startVoiceInput}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.75rem',
              gap: '0.35rem',
              color: isListening ? '#EF4444' : '#C084FC',
              borderColor: isListening ? '#EF4444' : '#A855F7',
              background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
            }}
          >
            <Mic size={14} color={isListening ? '#EF4444' : '#C084FC'} className={isListening ? 'animate-pulse' : ''} />
            <span>{isListening ? '🎙️ Listening... Speak Now' : 'Voice Input'}</span>
          </button>
        </div>

        <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
          Tip: Tap any template pill below to auto-fill
        </span>
      </div>

      {/* Main Input Textarea */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <textarea
          name="prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Type or speak what you need to do tomorrow (e.g. Tomorrow 10 AM interview in Gurgaon)..."
          className="textarea"
          style={{ flex: 1, minWidth: '280px', minHeight: '75px', fontSize: '0.95rem', lineHeight: 1.4 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', alignSelf: 'stretch', fontWeight: 700 }}>
          <span>Predict Plan</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Quick Template Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          TRY SAMPLES:
        </span>
        {samplePrompts.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => setPromptText(sample.text)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {sample.label}
          </button>
        ))}
      </div>
    </form>
  );
}
