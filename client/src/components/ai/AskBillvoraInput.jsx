import { forwardRef, useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const AskBillvoraInput = forwardRef(function AskBillvoraInput(
  { onSend, disabled = false },
  ref
) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage('');

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-default bg-surface p-3 sm:p-4"
    >
      <div className="min-w-0 flex-1">
        <textarea
          ref={(element) => {
            textareaRef.current = element;

            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your purchases..."
          rows={1}
          disabled={disabled}
          className="max-h-32 min-h-[48px] w-full resize-none rounded-xl border border-default bg-surface-secondary px-4 py-3 text-sm text-primary outline-none transition-all placeholder:text-secondary focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Ask Billvora a question"
        />
      </div>

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="button-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Send message"
        title="Send message"
      >
        <ArrowUp size={20} />
      </button>
    </form>
  );
});

export default AskBillvoraInput;