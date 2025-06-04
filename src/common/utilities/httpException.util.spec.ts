import { extractHttpExceptionMessage } from './httpException.util';

describe('extractHttpExceptionMessage', () => {
  it('returns the string if response is a string', () => {
    expect(extractHttpExceptionMessage('Simple error')).toBe('Simple error');
  });

  it('returns joined string if response.message is an array of strings', () => {
    const response = { message: ['Error 1', 'Error 2', 'Error 3'] };
    expect(extractHttpExceptionMessage(response)).toBe('Error 1, Error 2, Error 3');
  });

  it('returns message string if response.message is a string', () => {
    const response = { message: 'Single error message' };
    expect(extractHttpExceptionMessage(response)).toBe('Single error message');
  });

  it('returns "Unexpected error" if response is an object without message property', () => {
    const response = { error: 'some error' };
    expect(extractHttpExceptionMessage(response)).toBe('Unexpected error');
  });

  it('returns "Unexpected error" if response.message is not string or array', () => {
    const response = { message: 12345 };
    expect(extractHttpExceptionMessage(response)).toBe('Unexpected error');
  });

  it('returns "Unexpected error" if response is null', () => {
    expect(extractHttpExceptionMessage(null)).toBe('Unexpected error');
  });

  it('returns "Unexpected error" if response is undefined', () => {
    expect(extractHttpExceptionMessage(undefined)).toBe('Unexpected error');
  });

  it('returns "Unexpected error" if response is a number', () => {
    expect(extractHttpExceptionMessage(123)).toBe('Unexpected error');
  });
});
