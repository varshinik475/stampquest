import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Chat } from '../src/components/Chat';

const { useChatMock } = vi.hoisted(() => ({
  useChatMock: vi.fn()
}));

vi.mock('@ai-sdk/react', () => ({
  useChat: useChatMock
}));

const destination = {
  destination: 'Kyoto',
  country: 'Japan',
  description: 'A quiet mix of temples and gardens.',
  bestFor: ['Culture', 'Food'],
  stampDifficulty: 'Easy',
  recommendedDays: 3,
  reason: 'Great for a first visit.'
};

function mockChat(overrides = {}) {
  useChatMock.mockReturnValue({
    messages: [],
    sendMessage: vi.fn(),
    status: 'ready',
    stop: vi.fn(),
    error: undefined,
    ...overrides
  });
}

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChat();
  });

  it('renders text and every destination tool lifecycle result', () => {
    mockChat({
      messages: [{
        id: 'assistant-1',
        role: 'assistant',
        parts: [
          { type: 'text', text: 'Here is a destination guide.' },
          { type: 'tool-getDestinationInfo', state: 'input-streaming' },
          { type: 'tool-getDestinationInfo', state: 'input-available', input: { destination: 'Kyoto' } },
          { type: 'tool-getDestinationInfo', state: 'output-available', output: destination },
          { type: 'tool-getDestinationInfo', state: 'output-error', errorText: 'Service unavailable.' }
        ]
      }]
    });

    render(<Chat />);

    expect(screen.getByText('Here is a destination guide.')).toBeInTheDocument();
    expect(screen.getByText('Preparing destination search')).toBeInTheDocument();
    expect(screen.getByText('Looking up destination')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kyoto' })).toBeInTheDocument();
    expect(screen.getByText('Culture')).toBeInTheDocument();
    expect(screen.getByText('Destination lookup failed')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable.')).toBeInTheDocument();
  });

  it('shows the empty state and fills the labeled prompt from a suggestion', async () => {
    const user = userEvent.setup();
    render(<Chat />);

    await user.click(screen.getByRole('button', { name: 'Tell me about Tokyo' }));

    expect(screen.getByRole('textbox', { name: 'Message StampQuest AI' })).toHaveValue('Tell me about Tokyo');
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('shows the pending state and prevents another submission', () => {
    mockChat({ status: 'submitted' });
    render(<Chat />);

    expect(screen.getByText('StampQuest AI is thinking...')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Message StampQuest AI' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
  });

  it('shows the streaming state and exposes stop', async () => {
    const stop = vi.fn();
    mockChat({
      status: 'streaming',
      stop,
      messages: [{ id: 'assistant-2', role: 'assistant', parts: [{ type: 'text', text: 'Still planning...' }] }]
    });
    const user = userEvent.setup();
    render(<Chat />);

    expect(screen.getByText('Still planning...')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Stop' }));
    expect(stop).toHaveBeenCalledOnce();
  });

  it('renders an API error and retries the latest user message', async () => {
    const sendMessage = vi.fn();
    mockChat({
      error: new Error('Route failed'),
      sendMessage,
      messages: [{ id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'Tell me about Rome' }] }]
    });
    const user = userEvent.setup();
    render(<Chat />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByText('Route failed')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(sendMessage).toHaveBeenCalledWith({ text: 'Tell me about Rome' });
  });

  it('submits a trimmed labeled prompt', async () => {
    const sendMessage = vi.fn();
    mockChat({ sendMessage });
    const user = userEvent.setup();
    render(<Chat />);

    await user.type(screen.getByRole('textbox', { name: 'Message StampQuest AI' }), '  Tokyo  ');
    fireEvent.submit(screen.getByRole('button', { name: 'Send' }).closest('form')!);

    expect(sendMessage).toHaveBeenCalledWith({ text: 'Tokyo' });
    expect(screen.getByRole('textbox', { name: 'Message StampQuest AI' })).toHaveValue('');
  });
});
