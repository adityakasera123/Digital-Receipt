import ReactMarkdown from 'react-markdown';

function AskBillvoraMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex w-full ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? 'button-primary'
            : 'border border-default bg-surface-secondary text-primary'
        }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default AskBillvoraMessage;