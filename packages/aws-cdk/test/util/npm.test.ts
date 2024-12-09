import * as npm from '../../lib/util/npm';

jest.mock('util', () => {
  const mockExec = jest.fn();
  return {
    promisify: jest.fn(() => mockExec),
    __mockExec: mockExec, // Expose the mockExec for dynamic manipulation
  };
});

const { __mockExec } = jest.requireMock('util') as any;

describe('Testing isVersionMarkedDeprecated', () => {
  beforeEach(() => {
    // Clear mock calls and results before each test
    __mockExec.mockClear();
  });

  it('should return false when version is not deprecated', async () => {
    __mockExec.mockResolvedValueOnce({
      stdout: JSON.stringify({}),
      stderr: '',
    });

    await expect(npm.isVersionMarkedDeprecated('sample', '1.0'))
      .resolves.toEqual({ isDeprecated: false, deprecatedReason: '' });

    expect(__mockExec).toHaveBeenCalledWith('npm info sample@1.0 --json', { timeout: 5000 });
  });

  it('should return true and the reason when version is deprecated', async () => {
    __mockExec.mockResolvedValueOnce({
      stdout: JSON.stringify({ deprecated: 'This version is deprecated' }),
      stderr: '',
    });

    await expect(npm.isVersionMarkedDeprecated('sample', '1.0'))
      .resolves.toEqual({ isDeprecated: true, deprecatedReason: 'This version is deprecated' });

    expect(__mockExec).toHaveBeenCalledWith('npm info sample@1.0 --json', { timeout: 5000 });
  });

  it('Expect SyntaxError when invalid JSON is being pulled from npm', async () => {
    __mockExec.mockResolvedValueOnce({
      stdout: 'invalid JSON',
      stderr: '',
    });

    await expect(npm.isVersionMarkedDeprecated('sample', '1.0'))
      .rejects.toThrow(SyntaxError);

    expect(__mockExec).toHaveBeenCalledWith('npm info sample@1.0 --json', { timeout: 5000 });
  });

  it('should handle cases where exec times out', async () => {
    const timeoutError = new Error('Command timed out');
    timeoutError.name = 'TimeoutError';
    __mockExec.mockRejectedValueOnce(timeoutError);

    await expect(npm.isVersionMarkedDeprecated('sample', '1.0'))
      .rejects.toThrow('Command timed out');

    expect(__mockExec).toHaveBeenCalledWith('npm info sample@1.0 --json', { timeout: 5000 });
  });
});
