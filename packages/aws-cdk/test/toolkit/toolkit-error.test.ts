import { AssemblyError, AuthenticationError, ContextProviderError, ToolkitError } from '../../lib/toolkit/error';

describe('toolkit error', () => {
  let toolkitError = new ToolkitError('Test toolkit error');
  let authError = new AuthenticationError('Test authentication error');
  let assemblyError = new AssemblyError('Test authentication error');
  let contextProviderError = new ContextProviderError('Test context provider error');

  test('types are correctly assigned', async () => {
    expect(toolkitError.type).toBe('toolkit');
    expect(authError.type).toBe('authentication');
    expect(assemblyError.type).toBe('assembly');
    expect(contextProviderError.type).toBe('context-provider');
  });

  test('isToolkitError works', () => {
    expect(ToolkitError.isToolkitError(toolkitError)).toBe(true);
    expect(ToolkitError.isToolkitError(authError)).toBe(true);
    expect(ToolkitError.isToolkitError(assemblyError)).toBe(true);
    expect(ToolkitError.isToolkitError(contextProviderError)).toBe(true);
  });

  test('isAuthenticationError works', () => {
    expect(ToolkitError.isAuthenticationError(toolkitError)).toBe(false);
    expect(ToolkitError.isAuthenticationError(authError)).toBe(true);
  });

  test('isAssemblyError works', () => {
    expect(ToolkitError.isAssemblyError(assemblyError)).toBe(true);
    expect(ToolkitError.isAssemblyError(toolkitError)).toBe(false);
    expect(ToolkitError.isAssemblyError(authError)).toBe(false);
  });

  test('isContextProviderError works', () => {
    expect(ToolkitError.isContextProviderError(contextProviderError)).toBe(true);
    expect(ToolkitError.isContextProviderError(toolkitError)).toBe(false);
    expect(ToolkitError.isContextProviderError(authError)).toBe(false);
  });
});
