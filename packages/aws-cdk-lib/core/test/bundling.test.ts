import * as path from 'path';
import { DockerBuildSecret, DockerImage, FileSystem } from '../lib';
import { FakeDocker } from './fake-docker';

const dockerCmd = process.env.CDK_DOCKER ?? 'docker';

let fakeDocker: FakeDocker;

const imageHash = '123456abcdef';
const tag = `cdk-${imageHash}`;

let fingerprintMock: jest.SpiedFunction<typeof FileSystem.fingerprint>;

beforeEach(() => {
  jest.restoreAllMocks();
  fakeDocker = new FakeDocker(dockerCmd);
  fingerprintMock = jest.spyOn(FileSystem, 'fingerprint').mockReturnValue(imageHash);
  Object.defineProperty(process, 'platform', { value: 'darwin' });
});

describe('bundling', () => {
  test('bundling with image from registry', () => {
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      environment: {
        VAR1: 'value1',
        VAR2: 'value2',
      },
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '--env', 'VAR1=value1',
      '--env', 'VAR2=value2',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });

  describe('fromBuild with uncached image', () => {
    test('bundling with image from asset', () => {
      const image = DockerImage.fromBuild('docker-path', {
        buildArgs: { TEST_ARG: 'cdk-test' },
      });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--build-arg', 'TEST_ARG=cdk-test',
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('with cache disabled', () => {
      const image = DockerImage.fromBuild('docker-path', { cacheDisabled: true });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--no-cache',
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('with platform', () => {
      const platform = 'linux/someArch99';
      const image = DockerImage.fromBuild('docker-path', { platform });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--platform', platform,
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('with cache-to & cache-from', () => {
      const cacheTo = { type: 'local', params: { dest: 'path/to/local/dir' } };
      const cacheFrom1 = {
        type: 's3', params: { region: 'us-west-2', bucket: 'my-bucket', name: 'foo' },
      };
      const cacheFrom2 = {
        type: 'gha', params: { url: 'https://example.com', token: 'abc123', scope: 'gh-ref-image2' },
      };

      const image = DockerImage.fromBuild('docker-path', { cacheTo, cacheFrom: [cacheFrom1, cacheFrom2] });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--cache-from', 'type=s3,region=us-west-2,bucket=my-bucket,name=foo',
        '--cache-from', 'type=gha,url=https://example.com,token=abc123,scope=gh-ref-image2',
        '--cache-to', 'type=local,dest=path/to/local/dir',
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('with target stage', () => {
      const targetStage = 'i-love-testing';
      const image = DockerImage.fromBuild('docker-path', { targetStage });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--target', targetStage,
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('with network', () => {
      const network = 'host';
      const image = DockerImage.fromBuild('docker-path', { network });
      image.run();

      fakeDocker.assertCalled([
        'build', '-t', tag,
        '--network', network,
        'docker-path',
      ]);

      fakeDocker.assertCalled([
        'run', '--rm',
        tag,
      ]);
    });

    test('BundlerDockerImage json is the bundler image if building an image', () => {
      const image = DockerImage.fromBuild('docker-path');

      expect(image.image).toEqual(tag);
      expect(image.toJSON()).toEqual(imageHash);
      expect(fingerprintMock).toHaveBeenCalledWith('docker-path', expect.objectContaining({ extraHash: JSON.stringify({}) }));
    });
  });

  test('fromBuild with build contexts (skips cache)', () => {
    const image = DockerImage.fromBuild('docker-path', {
      buildContexts: {
        mycontext: '/path/to/context',
        alpine: 'docker-image://alpine:latest',
      },
    });
    image.run();

    fakeDocker.assertNotCalled(['image', 'inspect', tag]);
  });
});

describe('fromBuild with cached image', () => {
  beforeEach(() => {
    fakeDocker.givenImageExists(tag);
  });

  test('skips docker build when image is already cached', () => {
    // WHEN
    const image = DockerImage.fromBuild('docker-path', {
      buildArgs: { TEST_ARG: 'cdk-test' },
    });

    // THEN
    fakeDocker.assertCalled([
      'image', 'inspect', tag,
    ]);
    expect(image.image).toEqual(tag);
  });

  test('rebuilds when fingerprint changes', () => {
    fingerprintMock.mockReturnValue('aaa');
    DockerImage.fromBuild('docker-path');
    fakeDocker.assertCalled(['build', '-t', 'cdk-aaa', 'docker-path']);

    fingerprintMock.mockReturnValue('bbb');
    DockerImage.fromBuild('docker-path');
    fakeDocker.assertCalled(['build', '-t', 'cdk-bbb', 'docker-path']);
  });
});

describe('fromAsset', () => {
  test('custom dockerfile is passed through to docker exec', () => {
    const imagePath = path.join(__dirname, 'fs', 'fixtures', 'test1');
    DockerImage.fromAsset(imagePath, { file: 'my-dockerfile' });

    const expected = path.join(imagePath, 'my-dockerfile');
    fakeDocker.assertCalled(expect.arrayContaining(['-f', expected]));
  });

  test('returns a defined image', () => {
    const imagePath = path.join(__dirname, 'fs', 'fixtures', 'test1');
    const image = DockerImage.fromAsset(imagePath, { file: 'my-dockerfile' });
    expect(image).toBeDefined();
    expect(image.image).toBeDefined();
  });
});

test('throws in case of spawnSync error', () => {
  fakeDocker.givenNextCommandFails(['run'], 'failed-to-start');

  const image = DockerImage.fromRegistry('alpine');
  expect(() => image.run()).toThrow(/UnknownError/);
});

test('throws if status is not 0', () => {
  fakeDocker.givenNextCommandFails(['run'], 'err-exit');

  const image = DockerImage.fromRegistry('alpine');
  expect(() => image.run()).toThrow(/exited with status 1/);
});

test('BundlerDockerImage json is the bundler image name by default', () => {
  const image = DockerImage.fromRegistry('alpine');
  expect(image.toJSON()).toEqual('alpine');
});

test('custom entrypoint is passed through to docker exec', () => {
  const image = DockerImage.fromRegistry('alpine');
  image.run({
    entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
    command: ['cool', 'command'],
    environment: {
      VAR1: 'value1',
      VAR2: 'value2',
    },
    volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
    workingDirectory: '/working-directory',
    user: 'user:group',
  });

  fakeDocker.assertCalled([
    'run', '--rm',
    '-u', 'user:group',
    '-v', '/host-path:/container-path:delegated',
    '--env', 'VAR1=value1',
    '--env', 'VAR2=value2',
    '-w', '/working-directory',
    '--entrypoint', '/cool/entrypoint',
    'alpine',
    '--cool-entrypoint-arg',
    'cool', 'command',
  ]);
});

describe('cp utility', () => {
  test('copies from an image', () => {
    DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');

    fakeDocker.assertCalled(['create', 'alpine']);
    fakeDocker.assertCalled(['cp', `${fakeDocker.containerId}:/foo/bar`, '/baz']);
    fakeDocker.assertCalled(['rm', '-v', fakeDocker.containerId]);
  });

  test('cleans up after itself even on failure', () => {
    fakeDocker.givenNextCommandFails(['cp'], 'err-exit');

    expect(() => {
      DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');
    }).toThrow(/Failed.*copy/i);

    fakeDocker.assertCalled(['rm', '-v', fakeDocker.containerId]);
  });

  test('copies to a temp dir if outputPath is omitted', () => {
    const tempPath = DockerImage.fromRegistry('alpine').cp('/foo/bar');
    expect(/cdk-docker-cp-/.test(tempPath)).toEqual(true);
  });
});

describe('docker run options', () => {
  test('adding user provided security-opt', () => {
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      environment: { VAR1: 'value1', VAR2: 'value2' },
      securityOpt: 'no-new-privileges',
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '--security-opt', 'no-new-privileges',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '--env', 'VAR1=value1',
      '--env', 'VAR2=value2',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });

  test('adding user provided network options', () => {
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      network: 'host',
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '--network', 'host',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });

  test('adding user provided platform', () => {
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      platform: 'linux/amd64',
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '--platform', 'linux/amd64',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });

  test('adding user provided docker volume options', () => {
    fakeDocker.givenNextCommandFails(['run'], 'err-exit');
    const image = DockerImage.fromRegistry('alpine');

    try {
      image.run({
        command: ['cool', 'command'],
        volumesFrom: ['foo', 'bar'],
        volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
        workingDirectory: '/working-directory',
        user: 'user:group',
      });
    } catch {
      // We expect this to fail as the test environment will not have the required docker setup for the command to exit successfully
    }

    fakeDocker.assertCalled([
      'run', '--rm',
      '-u', 'user:group',
      '--volumes-from', 'foo',
      '--volumes-from', 'bar',
      '-v', '/host-path:/container-path:delegated',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });
});

describe('selinux docker mount', () => {
  beforeEach(() => {
    Object.defineProperty(process, 'platform', { value: 'linux' });
  });

  test('adds :z flag when selinux is enabled', () => {
    fakeDocker.givenSeLinuxEnabled();

    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:z,delegated',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });

  test('no :z flag when selinux is disabled', () => {
    // Missing: givenSeLinuxEnabled
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      command: ['cool', 'command'],
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    fakeDocker.assertCalled([
      'run', '--rm',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ]);
  });
});

test('ensure correct Docker CLI arguments are returned', () => {
  const fromSrc = DockerBuildSecret.fromSrc('path.json');
  expect(fromSrc).toEqual('src=path.json');
});
