export function extractHttpExceptionMessage(response: unknown): string {
  if (typeof response === 'string') {
    return response;
  }

  if (typeof response === 'object' && response !== null) {
    const maybeMessage = (response as { message?: unknown }).message;

    if (Array.isArray(maybeMessage)) {
      return maybeMessage.join(', ');
    }

    if (typeof maybeMessage === 'string') {
      return maybeMessage;
    }
  }

  return 'Unexpected error';
}
