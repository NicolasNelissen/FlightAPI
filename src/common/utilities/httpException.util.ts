/**
 * Extracts a human-readable error message from an HTTP exception response.
 *
 * Handles string messages, arrays of messages, and objects with a `message` property.
 * Returns a default message if none can be extracted.
 *
 * @param response - The response object or string from an HTTP exception.
 * @returns The extracted error message as a string.
 */
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
