import * as child_process from 'child_process';
import { Test } from 'nodeunit';
import * as sinon from 'sinon';
import { BundlingDockerImage, FileSystem } from '../lib';

export = {
  'tearDown'(callback: any) {
    sinon.restore();
    callback();
  },

  'bundling with image from registry'(test: Test) {
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const image = BundlingDockerImage.fromRegistry('alpine');
    image._run({
      command: ['cool', 'command'],
      environment: {
        VAR1: 'value1',
        VAR2: 'value2',
      },
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
      workingDirectory: '/working-directory',
      user: 'user:group',
    });

    test.ok(spawnSyncStub.calledWith('docker', [
      'run', '--rm',
      '-u', 'user:group',
      '-v', '/host-path:/container-path:delegated',
      '--env', 'VAR1=value1',
      '--env', 'VAR2=value2',
      '-w', '/working-directory',
      'alpine',
      'cool', 'command',
    ], { stdio: ['ignore', process.stderr, 'inherit'] }));
    test.done();
  },

  'bundling with image from asset'(test: Test) {
    const imageId = 'abcdef123456';
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from(`sha256:${imageId}`),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const imageHash = '123456abcdef';
    const fingerprintStub = sinon.stub(FileSystem, 'fingerprint');
    fingerprintStub.callsFake(() => imageHash);

    const image = BundlingDockerImage.fromAsset('docker-path', {
      buildArgs: {
        TEST_ARG: 'cdk-test',
      },
    });
    image._run();

    test.ok(spawnSyncStub.firstCall.calledWith('docker', [
      'build', '-q',
      '--build-arg', 'TEST_ARG=cdk-test',
      'docker-path',
    ]));

    test.ok(spawnSyncStub.secondCall.calledWith('docker', [
      'run', '--rm',
      imageId,
    ]));
    test.done();
  },

  'throws if image id cannot be extracted from build output'(test: Test) {
    sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    test.throws(() => BundlingDockerImage.fromAsset('docker-path'), /Failed to extract image ID from Docker build output/);
    test.done();
  },

  'throws in case of spawnSync error'(test: Test) {
    sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
      error: new Error('UnknownError'),
    });

    const image = BundlingDockerImage.fromRegistry('alpine');
    test.throws(() => image._run(), /UnknownError/);
    test.done();
  },

  'throws if status is not 0'(test: Test) {
    sinon.stub(child_process, 'spawnSync').returns({
      status: -1,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const image = BundlingDockerImage.fromRegistry('alpine');
    test.throws(() => image._run(), /\[Status -1\]/);
    test.done();
  },

  'BundlerDockerImage json is the bundler image name by default'(test: Test) {
    const image = BundlingDockerImage.fromRegistry('alpine');

    test.equals(image.toJSON(), 'alpine');
    test.done();
  },

  'BundlerDockerImage json is the bundler image if building an image'(test: Test) {
    const imageId = 'abcdef123456';
    sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from(`sha256:${imageId}`),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const imageHash = '123456abcdef';
    const fingerprintStub = sinon.stub(FileSystem, 'fingerprint');
    fingerprintStub.callsFake(() => imageHash);

    const image = BundlingDockerImage.fromAsset('docker-path');

    test.equals(image.image, imageId);
    test.equals(image.toJSON(), imageHash);
    test.ok(fingerprintStub.calledWith('docker-path', sinon.match({ extraHash: JSON.stringify({}) })));
    test.done();
  },
};
