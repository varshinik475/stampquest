import { useEffect, useRef, useState } from 'react';

const stateCopy = {
  idle: { label: 'Send message', icon: '↗', hint: 'Ready when you are.' },
  loading: { label: 'Sending', icon: '•••', hint: 'A simulated request is in flight.' },
  success: { label: 'Sent', icon: '✓', hint: 'Your message arrived safely.' },
  error: { label: 'Try again', icon: '↻', hint: 'The simulated request failed.' }
};

function MotionButton({ mode, onComplete }) {
  const [state, setState] = useState('idle');
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const run = () => {
    if (state === 'loading') return;
    setState('loading');
    timeoutRef.current = setTimeout(() => {
      setState(mode === 'failure' ? 'error' : 'success');
      onComplete?.(mode);
      if (mode === 'success') {
        timeoutRef.current = setTimeout(() => setState('idle'), 1500);
      }
    }, 700);
  };

  const copy = stateCopy[state];

  return (
    <div className={`motion-control motion-control--${state}`}>
      <button
        type="button"
        className="motion-button"
        onClick={run}
        disabled={state === 'loading'}
        aria-label={copy.label}
        aria-busy={state === 'loading'}
      >
        <span key={`${state}-icon`} className="motion-button__icon" aria-hidden="true">{copy.icon}</span>
        <span key={`${state}-label`} className="motion-button__label">{copy.label}</span>
      </button>
      <span className="motion-control__hint" role="status">{copy.hint}</span>
    </div>
  );
}

export default function MotionDemoPage() {
  const [lastEvent, setLastEvent] = useState('Choose a trigger to begin.');

  return (
    <section className="motion-page" aria-label="Motion interaction lab">
      <section className="motion-hero" aria-labelledby="motion-title">
        <div className="motion-kicker"><span className="motion-kicker__dot" /> Interaction lab / 01</div>
        <h1 id="motion-title">Send a little<br /><em>signal.</em></h1>
        <p className="motion-intro">A tiny message button, choreographed through the uncertain middle between intention and arrival.</p>
        <div className="motion-meta" aria-label="Demo properties">
          <span>CSS transitions</span><span>Keyboard ready</span><span>Motion aware</span>
        </div>
      </section>

      <section className="motion-stage" aria-labelledby="stage-title">
        <div className="motion-stage__header">
          <div>
            <p className="motion-overline">Choose an outcome</p>
            <h2 id="stage-title">The same gesture, two endings.</h2>
          </div>
          <p className="motion-event" role="status">{lastEvent}</p>
        </div>
        <div className="motion-controls">
          <div className="motion-option">
            <p className="motion-option__label">Success path</p>
            <MotionButton mode="success" onComplete={() => setLastEvent('Success: the message was delivered.')} />
          </div>
          <div className="motion-option">
            <p className="motion-option__label">Failure path</p>
            <MotionButton mode="failure" onComplete={() => setLastEvent('Error: delivery needs another try.')} />
          </div>
        </div>
      </section>

      <section className="motion-notes" aria-labelledby="notes-title">
        <p className="motion-overline">Choreography notes</p>
        <h2 id="notes-title">Nothing jumps. Everything answers.</h2>
        <p>Hover and focus use a quick 180ms ease-out lift. Loading and result changes use a 320ms cubic-bezier transition so the label, color, and icon feel connected. Success lingers for 1.5 seconds before returning to idle; errors stay available for retry. Reduced-motion users keep every state and color cue, with transforms and delays removed.</p>
      </section>
    </section>
  );
}
