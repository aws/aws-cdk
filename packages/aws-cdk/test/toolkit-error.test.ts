import { AuthenticationError, ToolkitError } from '../lib/toolkit/error';

describe('toolkit error', () => {
  let toolkitError = new ToolkitError('Test toolkit error');
  let authError = new AuthenticationError('Test authentication error');
  test('types are correctly assigned', async () => {
    expect(toolkitError.type).toBe('toolkit');
    expect(authError.type).toBe('authentication');
  });

  test('isToolkitError and isAuthenticationError functions work', () => {
    expect(ToolkitError.isToolkitError(toolkitError)).toBe(true);
    expect(ToolkitError.isToolkitError(authError)).toBe(true);
    expect(ToolkitError.isAuthenticationError(toolkitError)).toBe(false);
    expect(ToolkitError.isAuthenticationError(authError)).toBe(true);
  });
});
