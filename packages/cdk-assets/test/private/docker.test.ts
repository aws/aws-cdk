import { Docker } from '../../lib/private/docker';
import { ShellOptions, ProcessFailedError } from '../../lib/private/shell';

type ShellExecuteMock = jest.SpyInstance<ReturnType<Docker['execute']>, Parameters<Docker['execute']>>;

describe('Docker', () => {
  describe('exists', () => {
    let docker: Docker;

    const makeShellExecuteMock = (
      fn: (params: string[]) => void,
    ): ShellExecuteMock =>
      jest.spyOn<{ execute: Docker['execute'] }, 'execute'>(Docker.prototype as any, 'execute').mockImplementation(
        async (params: string[], _options?: ShellOptions) => fn(params),
      );

    afterEach(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      docker = new Docker();
    });

    test('returns true when image inspect command does not throw', async () => {
      const spy = makeShellExecuteMock(() => undefined);

      const imageExists = await docker.exists('foo');

      expect(imageExists).toBe(true);
      expect(spy.mock.calls[0][0]).toEqual(['inspect', 'foo']);
    });

    test('throws when an arbitrary error is caught', async () => {
      makeShellExecuteMock(() => {
        throw new Error();
      });

      await expect(docker.exists('foo')).rejects.toThrow();
    });

    test('throws when the error is a shell failure but the exit code is unrecognized', async () => {
      makeShellExecuteMock(() => {
        throw new (class extends Error implements ProcessFailedError {
          public readonly code = 'PROCESS_FAILED'
          public readonly exitCode = 47
          public readonly signal = null

          constructor() {
            super('foo');
          }
        });
      });

      await expect(docker.exists('foo')).rejects.toThrow();
    });

    test('returns false when the error is a shell failure and the exit code is 1 (Docker)', async () => {
      makeShellExecuteMock(() => {
        throw new (class extends Error implements ProcessFailedError {
          public readonly code = 'PROCESS_FAILED'
          public readonly exitCode = 1
          public readonly signal = null

          constructor() {
            super('foo');
          }
        });
      });

      const imageExists = await docker.exists('foo');

      expect(imageExists).toBe(false);
    });

    test('returns false when the error is a shell failure and the exit code is 125 (Podman)', async () => {
      makeShellExecuteMock(() => {
        throw new (class extends Error implements ProcessFailedError {
          public readonly code = 'PROCESS_FAILED'
          public readonly exitCode = 125
          public readonly signal = null

          constructor() {
            super('foo');
          }
        });
      });

      const imageExists = await docker.exists('foo');

      expect(imageExists).toBe(false);
    });
  });
});
