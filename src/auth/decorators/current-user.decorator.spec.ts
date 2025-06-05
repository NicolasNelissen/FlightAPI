import { ExecutionContext } from '@nestjs/common';

import { extractUserFromRequest } from './current-user.decorator';

describe('extractUserFromRequest', () => {
  const mockUser = {
    userId: '1234567890abcdef',
    username: 'testuser',
  };

  const createMockContext = (user?: unknown): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('should return the user object if valid', () => {
    const ctx = createMockContext(mockUser);
    const result = extractUserFromRequest(ctx);
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user is missing', () => {
    const ctx = createMockContext(undefined);
    expect(() => extractUserFromRequest(ctx)).toThrowError('User not found in request');
  });

  it('should throw error if userId is missing', () => {
    const ctx = createMockContext({ username: 'testuser' });
    expect(() => extractUserFromRequest(ctx)).toThrowError('Invalid user data in request');
  });

  it('should throw error if username is missing', () => {
    const ctx = createMockContext({ userId: '123' });
    expect(() => extractUserFromRequest(ctx)).toThrowError('Invalid user data in request');
  });
});
