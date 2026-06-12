import child_process from 'child_process';
import * as path from 'path';
import sinon from 'sinon';
import { DockerBuildSecret, DockerImage, FileSystem } from '../lib';

const dockerCmd = process.env.CDK_DOCKER ?? 'docker';

describe('bundling', () => {
  afterEach(() => {
    sinon.restore();
  });

  test('bundling with image from registry', () => {
    sinon.stub(process, 'platform').value('darwin');
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());

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

    expect(spawnSyncStub.calledWith(dockerCmd, [
      'run', '--rm',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '--env', 'VAR1=value1',
      '--env', 'VAR2=value2',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });

  describe('fromBuild with uncached image', () => {
    const imageHash = '123456abcdef';
    const tag = `cdk-${imageHash}`;
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());
      spawnSyncStub.onFirstCall().returns(failureResult());
      sinon.stub(FileSystem, 'fingerprint').callsFake(() => imageHash);
    });

    test('bundling with image from asset', () => {
      const image = DockerImage.fromBuild('docker-path', {
        buildArgs: { TEST_ARG: 'cdk-test' },
      });
      image.run();

      expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
        'image', 'inspect', tag,
      ], { stdio: 'ignore' })).toEqual(true);

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--build-arg', 'TEST_ARG=cdk-test',
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('with cache disabled', () => {
      const image = DockerImage.fromBuild('docker-path', { cacheDisabled: true });
      image.run();

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--no-cache',
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('with platform', () => {
      const platform = 'linux/someArch99';
      const image = DockerImage.fromBuild('docker-path', { platform });
      image.run();

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--platform', platform,
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
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

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--cache-from', 'type=s3,region=us-west-2,bucket=my-bucket,name=foo',
        '--cache-from', 'type=gha,url=https://example.com,token=abc123,scope=gh-ref-image2',
        '--cache-to', 'type=local,dest=path/to/local/dir',
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('with target stage', () => {
      const targetStage = 'i-love-testing';
      const image = DockerImage.fromBuild('docker-path', { targetStage });
      image.run();

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--target', targetStage,
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('with network', () => {
      const network = 'host';
      const image = DockerImage.fromBuild('docker-path', { network });
      image.run();

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--network', network,
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.thirdCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('BundlerDockerImage json is the bundler image if building an image', () => {
      const fingerprintStub = FileSystem.fingerprint as sinon.SinonStub;
      const image = DockerImage.fromBuild('docker-path');

      expect(image.image).toEqual(tag);
      expect(image.toJSON()).toEqual(imageHash);
      expect(fingerprintStub.calledWith('docker-path', sinon.match({ extraHash: JSON.stringify({}) }))).toEqual(true);
    });
  });

  describe('fromBuild with build contexts (skips cache)', () => {
    const imageHash = '123456abcdef';
    const tag = `cdk-${imageHash}`;
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());
      sinon.stub(FileSystem, 'fingerprint').callsFake(() => imageHash);
    });

    test('with build contexts', () => {
      const image = DockerImage.fromBuild('docker-path', {
        buildContexts: {
          mycontext: '/path/to/context',
          alpine: 'docker-image://alpine:latest',
        },
      });
      image.run();

      expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--build-context', 'mycontext=/path/to/context',
        '--build-context', 'alpine=docker-image://alpine:latest',
        'docker-path',
      ])).toEqual(true);

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'run', '--rm',
        tag,
      ])).toEqual(true);
    });

    test('with build args and build contexts', () => {
      const image = DockerImage.fromBuild('docker-path', {
        buildArgs: { TEST_ARG: 'cdk-test' },
        buildContexts: { mycontext: '/path/to/context' },
      });
      image.run();

      expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
        'build', '-t', tag,
        '--build-arg', 'TEST_ARG=cdk-test',
        '--build-context', 'mycontext=/path/to/context',
        'docker-path',
      ])).toEqual(true);
    });
  });

  describe('fromBuild with cached image', () => {
    test('skips docker build when image is already cached', () => {
      const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());
      const imageHash = '123456abcdef';
      sinon.stub(FileSystem, 'fingerprint').callsFake(() => imageHash);

      const image = DockerImage.fromBuild('docker-path', {
        buildArgs: { TEST_ARG: 'cdk-test' },
      });

      const tag = `cdk-${imageHash}`;

      expect(spawnSyncStub.calledOnce).toEqual(true);
      expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
        'image', 'inspect', tag,
      ], { stdio: 'ignore' })).toEqual(true);
      expect(image.image).toEqual(tag);
    });

    test('rebuilds when source content changes', () => {
      const spawnSyncStub = sinon.stub(child_process, 'spawnSync').callsFake((_cmd, args) => ({
        status: (args as string[])[0] === 'image' ? 1 : 0,
        stderr: Buffer.from(''),
        stdout: Buffer.from(''),
        pid: 123,
        output: ['', ''],
        signal: null,
      }));

      const fingerprintStub = sinon.stub(FileSystem, 'fingerprint').returns('aaa');
      DockerImage.fromBuild('docker-path');
      expect(spawnSyncStub.calledWith(dockerCmd, ['build', '-t', 'cdk-aaa', 'docker-path'])).toEqual(true);

      fingerprintStub.returns('bbb');
      DockerImage.fromBuild('docker-path');
      expect(spawnSyncStub.calledWith(dockerCmd, ['build', '-t', 'cdk-bbb', 'docker-path'])).toEqual(true);
    });
  });

  describe('fromAsset', () => {
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult('sha256:1234567890abcdef'));
      spawnSyncStub.onFirstCall().returns(failureResult());
    });

    test('custom dockerfile is passed through to docker exec', () => {
      const imagePath = path.join(__dirname, 'fs', 'fixtures', 'test1');
      DockerImage.fromAsset(imagePath, { file: 'my-dockerfile' });

      expect(spawnSyncStub.calledTwice).toEqual(true);
      const expected = path.join(imagePath, 'my-dockerfile');
      expect(new RegExp(`-f ${expected}`).test(spawnSyncStub.secondCall.args[1]?.join(' ') ?? '')).toEqual(true);
    });

    test('returns a defined image', () => {
      const imagePath = path.join(__dirname, 'fs', 'fixtures', 'test1');
      const image = DockerImage.fromAsset(imagePath, { file: 'my-dockerfile' });
      expect(image).toBeDefined();
      expect(image.image).toBeDefined();
    });
  });

  test('throws in case of spawnSync error', () => {
    sinon.stub(child_process, 'spawnSync').returns({
      ...successResult(),
      error: new Error('UnknownError'),
    });

    const image = DockerImage.fromRegistry('alpine');
    expect(() => image.run()).toThrow(/UnknownError/);
  });

  test('throws if status is not 0', () => {
    sinon.stub(child_process, 'spawnSync').returns({
      status: -1,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const image = DockerImage.fromRegistry('alpine');
    expect(() => image.run()).toThrow(/exited with status -1/);
  });

  test('BundlerDockerImage json is the bundler image name by default', () => {
    const image = DockerImage.fromRegistry('alpine');
    expect(image.toJSON()).toEqual('alpine');
  });

  test('custom entrypoint is passed through to docker exec', () => {
    sinon.stub(process, 'platform').value('darwin');
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());

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

    expect(spawnSyncStub.calledWith(dockerCmd, [
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
    ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });

  describe('cp utility', () => {
    const containerId = '1234567890abcdef1234567890abcdef';

    test('copies from an image', () => {
      const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(
        successResult(`${containerId}\n`),
      );

      DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');

      expect(spawnSyncStub.calledWith(sinon.match.any, ['create', 'alpine'], sinon.match.any)).toEqual(true);
      expect(spawnSyncStub.calledWith(sinon.match.any, ['cp', `${containerId}:/foo/bar`, '/baz'], sinon.match.any)).toEqual(true);
      expect(spawnSyncStub.calledWith(sinon.match.any, ['rm', '-v', containerId])).toEqual(true);
    });

    test('cleans up after itself', () => {
      const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(
        successResult(`${containerId}\n`),
      );

      spawnSyncStub.withArgs(sinon.match.any, sinon.match.array.startsWith(['cp']), sinon.match.any)
        .returns({
          status: 1,
          stderr: Buffer.from('it failed for a very good reason'),
          stdout: Buffer.from('stdout'),
          pid: 123,
          output: ['stdout', 'stderr'],
          signal: null,
        });

      expect(() => {
        DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');
      }).toThrow(/Failed.*copy/i);

      expect(spawnSyncStub.calledWith(sinon.match.any, ['rm', '-v', containerId])).toEqual(true);
    });

    test('copies to a temp dir if outputPath is omitted', () => {
      sinon.stub(child_process, 'spawnSync').returns(
        successResult(`${containerId}\n`),
      );

      const tempPath = DockerImage.fromRegistry('alpine').cp('/foo/bar');
      expect(/cdk-docker-cp-/.test(tempPath)).toEqual(true);
    });
  });

  describe('docker run options', () => {
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      sinon.stub(process, 'platform').value('darwin');
      spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns(successResult());
    });

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

      expect(spawnSyncStub.calledWith(dockerCmd, [
        'run', '--rm',
        '--security-opt', 'no-new-privileges',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:delegated',
        '--env', 'VAR1=value1',
        '--env', 'VAR2=value2',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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

      expect(spawnSyncStub.calledWith(dockerCmd, [
        'run', '--rm',
        '--network', 'host',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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

      expect(spawnSyncStub.calledWith(dockerCmd, [
        'run', '--rm',
        '--platform', 'linux/amd64',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });

    test('adding user provided docker volume options', () => {
      spawnSyncStub.returns({
        status: 1,
        stderr: Buffer.from('stderr'),
        stdout: Buffer.from('stdout'),
        pid: 123,
        output: ['stdout', 'stderr'],
        signal: null,
      });
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

      expect(spawnSyncStub.calledWith(dockerCmd, [
        'run', '--rm',
        '-u', 'user:group',
        '--volumes-from', 'foo',
        '--volumes-from', 'bar',
        '-v', '/host-path:/container-path:delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
  });

  describe('selinux docker mount', () => {
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      sinon.stub(process, 'platform').value('linux');
      spawnSyncStub = sinon.stub(child_process, 'spawnSync');
      spawnSyncStub.onSecondCall().returns(successResult());
    });

    test('adds :z flag when selinux is enabled', () => {
      spawnSyncStub.onFirstCall().returns(successResult());

      const image = DockerImage.fromRegistry('alpine');
      image.run({
        command: ['cool', 'command'],
        volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
        workingDirectory: '/working-directory',
        user: 'user:group',
      });

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'run', '--rm',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:z,delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });

    test('no :z flag when selinux is disabled', () => {
      spawnSyncStub.onFirstCall().returns(failureResult());

      const image = DockerImage.fromRegistry('alpine');
      image.run({
        command: ['cool', 'command'],
        volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
        workingDirectory: '/working-directory',
        user: 'user:group',
      });

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'run', '--rm',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });

    test('no :z flag when selinuxenabled command is unavailable', () => {
      spawnSyncStub.onFirstCall().returns({
        status: 127,
        stderr: Buffer.from('stderr'),
        stdout: Buffer.from('stdout'),
        pid: 123,
        output: ['selinuxenabled output', 'stderr'],
        signal: null,
      });

      const image = DockerImage.fromRegistry('alpine');
      image.run({
        command: ['cool', 'command'],
        volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
        workingDirectory: '/working-directory',
        user: 'user:group',
      });

      expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
        'run', '--rm',
        '-u', 'user:group',
        '-v', '/host-path:/container-path:delegated',
        '-w', '/working-directory',
        'alpine',
        'cool', 'command',
      ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
  });

  test('ensure correct Docker CLI arguments are returned', () => {
    const fromSrc = DockerBuildSecret.fromSrc('path.json');
    expect(fromSrc).toEqual('src=path.json');
  });
});

function successResult(stdout = 'stdout'): child_process.SpawnSyncReturns<NonSharedBuffer> {
  return {
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from(stdout),
    pid: 123,
    output: [Buffer.from('stdout'), Buffer.from('stderr')],
    signal: null,
  };
}

function failureResult(): child_process.SpawnSyncReturns<NonSharedBuffer> {
  return {
    status: 1,
    stderr: Buffer.from(''),
    stdout: Buffer.from(''),
    pid: 123,
    output: [Buffer.from(''), Buffer.from('')],
    signal: null,
  };
}

