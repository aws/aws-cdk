import { readFileSync } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as mockfs from 'mock-fs';
import { Docker } from '../../lib/private/docker';
import { ShellOptions, ProcessFailedError } from '../../lib/private/shell';

type ShellExecuteMock = jest.SpyInstance<ReturnType<Docker['execute']>, Parameters<Docker['execute']>>;

const _ENV = process.env;

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
          public readonly code = 'PROCESS_FAILED';
          public readonly exitCode = 47;
          public readonly signal = null;

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
          public readonly code = 'PROCESS_FAILED';
          public readonly exitCode = 1;
          public readonly signal = null;

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
          public readonly code = 'PROCESS_FAILED';
          public readonly exitCode = 125;
          public readonly signal = null;

          constructor() {
            super('foo');
          }
        });
      });

      const imageExists = await docker.exists('foo');

      expect(imageExists).toBe(false);
    });
  });

  describe('dockerConfigFile', () => {
    let docker: Docker;

    beforeEach(() => {
      docker = new Docker();
      process.env = { ..._ENV };
    });

    afterEach(() => {
      process.env = _ENV;
    });

    test('Can be overridden by CDK_DOCKER_CONFIG_FILE', () => {
      const configFile = '/tmp/insertfilenamehere_docker_config.json';
      process.env.CDK_DOCKER_CONFIG_FILE = configFile;

      expect(docker.dockerConfigFile()).toEqual(configFile);
    });

    test('Uses homedir if no process env is set', () => {
      expect(docker.dockerConfigFile()).toEqual(path.join(os.userInfo().homedir, '.docker', 'config.json'));
    });
  });

  describe('dockerConfig', () => {
    let docker: Docker;
    const configFile = '/tmp/foo/bar/does/not/exist/config.json';
    afterEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    beforeEach(() => {
      docker = new Docker();
      process.env.CDK_DOCKER_CONFIG_FILE = configFile;
    });

    afterEach(() => {
      mockfs.restore();
      process.env = { ..._ENV };
    });

    test('returns empty object if no config exists', () => {
      expect(docker.dockerConfig()).toEqual({});
    });

    test('returns parsed config if it exists', () => {
      mockfs({
        [configFile]: JSON.stringify({
          proxies: {
            default: {
              httpProxy: 'http://proxy.com',
              httpsProxy: 'https://proxy.com',
              noProxy: '.amazonaws.com',
            },
          },
        }),
      });

      const config = docker.dockerConfig();
      expect(config).toBeDefined();
      expect(config.proxies).toEqual({
        default: {
          httpProxy: 'http://proxy.com',
          httpsProxy: 'https://proxy.com',
          noProxy: '.amazonaws.com',
        },
      });
    });
  });

  describe('configureCdkCredentials', () => {
    let docker: Docker;
    const credsFile = '/tmp/foo/bar/does/not/exist/config-cred.json';
    const configFile = '/tmp/foo/bar/does/not/exist/config.json';

    afterEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    beforeEach(() => {
      docker = new Docker();
      process.env.CDK_DOCKER_CREDS_FILE = credsFile;
      process.env.CDK_DOCKER_CONFIG_FILE = configFile;
    });

    afterEach(() => {
      mockfs.restore();
      process.env = { ..._ENV };
    });

    test('returns false if no cred config exists', () => {
      expect(docker.configureCdkCredentials()).toBeFalsy();
    });

    test('returns true if cred config exists', () => {
      mockfs({
        [credsFile]: JSON.stringify({
          version: '0.1',
          domainCredentials: {
            'test1.example.com': { secretsManagerSecretId: 'mySecret' },
            'test2.example.com': { ecrRepository: 'arn:aws:ecr:bar' },
          },
        }),
      });

      expect(docker.configureCdkCredentials()).toBeTruthy();

      const config = JSON.parse(readFileSync(path.join(docker.configDirectory!, 'config.json'), 'utf-8'));
      expect(config).toBeDefined();
      expect(config).toEqual({
        credHelpers: {
          'test1.example.com': 'cdk-assets',
          'test2.example.com': 'cdk-assets',
        },
      });
    });

    test('returns true if cred config and docker config exists', () => {
      mockfs({
        [credsFile]: JSON.stringify({
          version: '0.1',
          domainCredentials: {
            'test1.example.com': { secretsManagerSecretId: 'mySecret' },
            'test2.example.com': { ecrRepository: 'arn:aws:ecr:bar' },
          },
        }),
        [configFile]: JSON.stringify({
          proxies: {
            default: {
              httpProxy: 'http://proxy.com',
              httpsProxy: 'https://proxy.com',
              noProxy: '.amazonaws.com',
            },
          },
        }),
      });

      expect(docker.configureCdkCredentials()).toBeTruthy();

      const config = JSON.parse(readFileSync(path.join(docker.configDirectory!, 'config.json'), 'utf-8'));
      expect(config).toBeDefined();
      expect(config).toEqual({
        credHelpers: {
          'test1.example.com': 'cdk-assets',
          'test2.example.com': 'cdk-assets',
        },
        proxies: {
          default: {
            httpProxy: 'http://proxy.com',
            httpsProxy: 'https://proxy.com',
            noProxy: '.amazonaws.com',
          },
        },
      });
    });
  });
});

