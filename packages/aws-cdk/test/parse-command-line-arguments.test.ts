import { parseCommandLineArguments } from '../lib/parse-command-line-arguments';

test('cdk deploy -R sets rollback to false', async () => {
  const argv = await parseCommandLineArguments(['deploy', '-R']);
  expect(argv.rollback).toBe(false);
});

describe('cdk docs', () => {
  const originalPlatform = process.platform;
  // Helper to mock process.platform
  const mockPlatform = (platform: string) => {
    Object.defineProperty(process, 'platform', {
      value: platform,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  };

  // Restore original platform after each test
  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  });

  test.each([
    ['darwin', 'open %u'],
    ['win32', 'start %u'],
    ['linux', 'xdg-open %u'],
    ['freebsd', 'xdg-open %u'],
  ])('for %s should return "%s"', async (platform, browser) => {
    mockPlatform(platform);
    const argv = await parseCommandLineArguments(['docs']);
    expect(argv.browser).toBe(browser);
  });
});
