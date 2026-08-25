import { useState } from 'react';
import AskBillvoraInput from '../../components/ai/AskBillvoraInput';
import AskBillvoraMessage from '../../components/ai/AskBillvoraMessage';
import useAskBillvora from '../../hooks/useAskBillvora';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);

  const { askBillvora, loading, error } = useAskBillvora();

  const handleSend = async (content) => {
    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    const response = await askBillvora(content);

    if (response) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: response,
        },
      ]);
    }
  };

  return (
    <div className="min-h-full bg-app text-primary">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ask Billvora
          </h1>

          <p className="mt-1 text-sm text-secondary sm:text-base">
            Your personal purchase intelligence assistant
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-default bg-surface shadow-sm">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md text-center">
                  <h2 className="text-lg font-semibold text-primary">
                    Ask anything about your purchases
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-secondary">
                    Billvora will help you understand your receipts,
                    spending, warranties, and return windows.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <AskBillvoraMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}

                {loading && (
                  <AskBillvoraMessage
                    role="assistant"
                    content="Thinking..."
                  />
                )}

                {error && !loading && (
                  <AskBillvoraMessage
                    role="assistant"
                    content={error}
                  />
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <AskBillvoraInput
            onSend={handleSend}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;