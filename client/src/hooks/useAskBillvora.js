import { useCallback, useState } from 'react';

const ASK_BILLVORA_URL =
  'https://us-central1-billvora-e91e7.cloudfunctions.net/askBillvora';

function useAskBillvora() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askBillvora = useCallback(async (message) => {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) {
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(ASK_BILLVORA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to get a response from Billvora.'
        );
      }

      return data.message;
    } catch (requestError) {
      console.error('Ask Billvora Error:', requestError);

      const errorMessage =
        requestError?.message ||
        'Something went wrong. Please try again.';

      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    askBillvora,
    loading,
    error,
  };
}

export default useAskBillvora;