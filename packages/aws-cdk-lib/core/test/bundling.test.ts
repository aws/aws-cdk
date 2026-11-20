import * as path from 'path';
import { App, AssetStaging, DockerBuildSecret, DockerImage, FileSystem } from '../lib';
import { FakeDocker } from './fake-docker';

const dockerCmd = process.env.CDK_DOCKER ?? 'docker';

let fakeDocker: FakeDocker;

const imageHash = '123456abcdef';
const tag = `cdk-${imageHash}`;

let fingerprintMock: jest.SpiedFunction<typeof FileSystem.fingerprint>;

beforeEach(() => {
  jest.restoreAllMocks();
  AssetStaging.clearAssetHashCache();
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

describe('fromBuildV2', () => {
  const originalDockerHost = process.env.DOCKER_HOST;
  afterEach(() => {
    if (originalDockerHost === undefined) {
      delete process.env.DOCKER_HOST;
    } else {
      process.env.DOCKER_HOST = originalDockerHost;
    }
  });

  test('builds the image once, when it first runs', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    fakeDocker.assertNotCalled(['build', '-t', tag, 'docker-path']);

    image.run();
    image.run();

    expect(dockerCalls('build')).toHaveLength(1);
  });

  test('builds the image before files are first copied out of it', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    fakeDocker.assertNotCalled(['build', '-t', tag, 'docker-path']);

    image.cp('/foo/bar', '/baz');

    const order = fakeDocker.spawnSync.mock.calls.map(([, args]) => args?.[0]);
    expect(order.indexOf('build')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('build')).toBeLessThan(order.indexOf('create'));
  });

  test('checks for an image with the same tag only once per app', () => {
    DockerImage.fromBuildV2('docker-path').buildImage();
    DockerImage.fromBuildV2('docker-path').buildImage();

    expect(dockerCalls('image')).toHaveLength(1);
  });

  test('checks the Docker daemon again for images used in a new app', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();

    new App();
    image.run();
    DockerImage.fromBuildV2('docker-path').buildImage();

    expect(dockerCalls('image')).toHaveLength(2);
  });

  test('checks again for an image with the same tag on a different Docker daemon', () => {
    DockerImage.fromBuildV2('docker-path').buildImage();
    process.env.DOCKER_HOST = 'tcp://other:2375';
    DockerImage.fromBuildV2('docker-path').buildImage();

    expect(dockerCalls('image')).toHaveLength(2);
  });

  test('has the same tag and hash as an image from fromBuild', () => {
    const options = { buildArgs: { A: '1' }, platform: 'linux/arm64' };
    const onDemand = DockerImage.fromBuildV2('docker-path', options);

    expect(fingerprintMock).toHaveBeenLastCalledWith('docker-path', expect.objectContaining({ extraHash: JSON.stringify(options) }));
    expect(onDemand.image).toEqual(DockerImage.fromBuild('docker-path', options).image);
    expect(onDemand.toJSON()).toEqual(imageHash);
  });

  test('passes its build options to docker build when it is built', () => {
    const image = DockerImage.fromBuildV2('docker-path', { buildArgs: { A: '1' }, platform: 'linux/arm64', file: 'Dockerfile.x' });

    image.buildImage();

    fakeDocker.assertCalled([
      'build', '-t', tag,
      '-f', path.join('docker-path', 'Dockerfile.x'),
      '--platform', 'linux/arm64',
      '--build-arg', 'A=1',
      'docker-path',
    ]);
  });

  test('fails when created with an absolute Docker file path', () => {
    expect(() => DockerImage.fromBuildV2('docker-path', { file: '/abs/Dockerfile' })).toThrow(/must be relative/);
  });

  test('builds with the build options as they were when the image was created', () => {
    const options = { buildArgs: { VERSION: '1' } };
    const image = DockerImage.fromBuildV2('docker-path', options);
    options.buildArgs.VERSION = '2';

    image.buildImage();

    fakeDocker.assertCalled(['build', '-t', tag, '--build-arg', 'VERSION=1', 'docker-path']);
  });

  test('fails when the image is built, not when it is created, and builds again on the next use', () => {
    fakeDocker.givenNextCommandFails(['build'], 'err-exit');
    const image = DockerImage.fromBuildV2('docker-path');

    expect(() => image.buildImage()).toThrow(/exited with status 1/);

    fakeDocker.reset();
    image.run();
    fakeDocker.assertCalled(['build', '-t', tag, 'docker-path']);
  });

  test('an image built eagerly is reused by later on-demand images and is not built again when it runs', () => {
    const eager = DockerImage.fromBuild('docker-path');
    eager.run();
    DockerImage.fromBuildV2('docker-path').buildImage();

    expect(dockerCalls('image')).toHaveLength(1);
    expect(dockerCalls('build')).toHaveLength(1);
  });

  test.each([
    ['Error response from daemon: No such image: cdk-123456abcdef', true],
    ['Error: No such object: cdk-123456abcdef', true],
    ['Error: cdk-123456abcdef: image not known', true],
    ['Cannot connect to the Docker daemon at unix:///var/run/docker.sock', false],
  ])('blames a removed image only if Docker reports it as missing: %s', (stderr, expectHint) => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    fakeDocker.reset();
    fakeDocker.spawnSync.mockImplementation((_command, args) => ({
      status: args?.[0] === 'run' ? 125 : 1,
      stderr: Buffer.from(args?.[0] === 'image' ? stderr : ''),
      stdout: Buffer.from(''),
      pid: 123,
      output: [],
      signal: null,
    }));

    const message = thrownMessage(() => image.run());
    if (expectHint) {
      expect(message).toMatch(/no longer in the local Docker daemon/);
    } else {
      expect(message).not.toMatch(/no longer in the local Docker daemon/);
    }
  });

  test('does not blame a removed image when the Docker daemon cannot be reached', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    // Every Docker command fails, including the check whether the image exists
    fakeDocker.givenNextCommandFails([], 'docker-error');

    const message = thrownMessage(() => image.run());
    expect(message).toMatch(/exited with status 125/);
    expect(message).not.toMatch(/no longer in the local Docker daemon/);
  });

  test('does not fingerprint the Docker file directory again when the image is built', () => {
    // For example, the directory contains the cloud assembly, which changes as assets are staged
    const image = DockerImage.fromBuildV2('docker-path');
    fingerprintMock.mockReturnValue('changed');

    image.buildImage();

    fakeDocker.assertCalled(['build', '-t', tag, 'docker-path']);
  });

  test('always rebuilds images with build contexts, even if the tag was built before', () => {
    const options = { buildContexts: { ctx: '/path/to/context' } };
    DockerImage.fromBuildV2('docker-path', options).buildImage();
    DockerImage.fromBuildV2('docker-path', options).buildImage();

    expect(dockerCalls('build')).toHaveLength(2);
  });

  test('fromBuild checks the Docker daemon every time', () => {
    DockerImage.fromBuild('docker-path');
    DockerImage.fromBuild('docker-path');

    expect(dockerCalls('image')).toHaveLength(2);
  });

  test('explains a failed run when the built image was removed', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    fakeDocker.reset();
    fakeDocker.givenNextCommandFails(['run'], 'docker-error');

    expect(() => image.run()).toThrow(/the image cdk-123456abcdef is no longer in the local Docker daemon/);
  });

  test('explains a failed docker create when the built image was removed', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    fakeDocker.reset();
    fakeDocker.givenNextCommandFails(['create'], 'docker-error');

    expect(() => image.cp('/foo/bar', '/baz')).toThrow(/the image cdk-123456abcdef is no longer in the local Docker daemon/);
  });

  test('does not blame a removed image when the bundling command fails', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    fakeDocker.reset();
    fakeDocker.givenNextCommandFails(['run'], 'err-exit');

    const message = thrownMessage(() => image.run());
    expect(message).toMatch(/exited with status 1/);
    expect(message).not.toMatch(/no longer in the local Docker daemon/);
  });

  test('does not blame a removed image when Docker fails but the image still exists', () => {
    const image = DockerImage.fromBuildV2('docker-path');
    image.buildImage();
    fakeDocker.givenNextCommandFails(['run'], 'docker-error');

    const message = thrownMessage(() => image.run());
    expect(message).toMatch(/exited with status 125/);
    expect(message).not.toMatch(/no longer in the local Docker daemon/);
  });

  test('does not blame a removed image when Docker fails to run a registry image', () => {
    fakeDocker.givenNextCommandFails(['run'], 'docker-error');

    const message = thrownMessage(() => DockerImage.fromRegistry('alpine').run());
    expect(message).toMatch(/exited with status 125/);
    expect(message).not.toMatch(/no longer in the local Docker daemon/);
  });
});

/**
 * The Docker CLI calls made so far with this subcommand
 */
function dockerCalls(subcommand: string) {
  return fakeDocker.spawnSync.mock.calls.filter(([, args]) => args?.[0] === subcommand);
}

/**
 * The message of the error that `fn` throws
 */
function thrownMessage(fn: () => void): string {
  try {
    fn();
  } catch (e: any) {
    return e.message;
  }
  throw new Error('Expected the function to throw');
}

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

  test('sshForwarding mounts the host SSH agent socket and sets SSH_AUTH_SOCK', () => {
    // GIVEN
    sinon.stub(process, 'platform').value('darwin');
    sinon.stub(process, 'env').value({ ...process.env, SSH_AUTH_SOCK: '/tmp/ssh-agent.sock' });
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    // WHEN
    const image = DockerImage.fromRegistry('alpine');
    image.run({ sshForwarding: true });

    // THEN
    expect(spawnSyncStub.calledWith(dockerCmd, [
      'run', '--rm',
      '-v', '/tmp/ssh-agent.sock:/run/host-services/ssh-auth.sock:delegated',
      '--env', 'SSH_AUTH_SOCK=/run/host-services/ssh-auth.sock',
      'alpine',
    ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });

  test('sshForwarding preserves caller-provided volumes and environment', () => {
    // GIVEN
    sinon.stub(process, 'platform').value('darwin');
    sinon.stub(process, 'env').value({ ...process.env, SSH_AUTH_SOCK: '/tmp/ssh-agent.sock' });
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    // WHEN
    const image = DockerImage.fromRegistry('alpine');
    image.run({
      sshForwarding: true,
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      environment: { VAR1: 'value1' },
    });

    // THEN
    expect(spawnSyncStub.calledWith(dockerCmd, [
      'run', '--rm',
      '-v', '/host-path:/container-path:delegated',
      '-v', '/tmp/ssh-agent.sock:/run/host-services/ssh-auth.sock:delegated',
      '--env', 'VAR1=value1',
      '--env', 'SSH_AUTH_SOCK=/run/host-services/ssh-auth.sock',
      'alpine',
    ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });

  test('sshForwarding throws when SSH_AUTH_SOCK is not set on the host', () => {
    // GIVEN
    const { SSH_AUTH_SOCK: _omit, ...envWithoutSshAuthSock } = process.env;
    sinon.stub(process, 'env').value(envWithoutSshAuthSock);

    // WHEN / THEN
    const image = DockerImage.fromRegistry('alpine');
    expect(() => image.run({ sshForwarding: true })).toThrow(/SSH_AUTH_SOCK environment variable is not set/);
  });

  test('sshForwarding off (default) does not mount the SSH agent socket', () => {
    // GIVEN
    sinon.stub(process, 'platform').value('darwin');
    sinon.stub(process, 'env').value({ ...process.env, SSH_AUTH_SOCK: '/tmp/ssh-agent.sock' });
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    // WHEN
    const image = DockerImage.fromRegistry('alpine');
    image.run();

    // THEN
    expect(spawnSyncStub.calledWith(dockerCmd, [
      'run', '--rm',
      'alpine',
    ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });
});

test('ensure correct Docker CLI arguments are returned', () => {
  const fromSrc = DockerBuildSecret.fromSrc('path.json');
  expect(fromSrc).toEqual('src=path.json');
});
