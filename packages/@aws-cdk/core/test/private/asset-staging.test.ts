import * as child_process from 'child_process';
import * as sinon from 'sinon';
import { AssetStaging, DockerImage } from '../../lib';
import { AssetBundlingBindMount, AssetBundlingVolumeCopy } from '../../lib/private/asset-staging';

const DOCKER_CMD = process.env.CDK_DOCKER ?? 'docker';

describe('bundling', () => {
  afterEach(() => {
    sinon.restore();
  });

  test('AssetBundlingVolumeCopy bundles with volume copy ', () => {
    // GIVEN
    sinon.stub(process, 'platform').value('darwin');
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const options = {
      sourcePath: '/tmp/source',
      bundleDir: '/tmp/output',
      image: DockerImage.fromRegistry('alpine'),
      user: '1000',
    };
    const helper = new AssetBundlingVolumeCopy(options);
    helper.run();

    // volume Creation
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'create', sinon.match(/assetInput.*/g),
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'create', sinon.match(/assetOutput.*/g),
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // volume removal
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'rm', sinon.match(/assetInput.*/g),
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'rm', sinon.match(/assetOutput.*/g),
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // prepare copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'run',
      '--name', sinon.match(/copyContainer.*/g),
      '-v', sinon.match(/assetInput.*/g),
      '-v', sinon.match(/assetOutput.*/g),
      'alpine',
      'sh',
      '-c',
      `mkdir -p ${AssetStaging.BUNDLING_INPUT_DIR} && chown -R ${options.user} ${AssetStaging.BUNDLING_OUTPUT_DIR} && chown -R ${options.user} ${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // delete copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'rm', sinon.match(/copyContainer.*/g),
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // copy files to copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'cp', `${options.sourcePath}/.`, `${helper.copyContainerName}:${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // copy files from copy container to host
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'cp', `${helper.copyContainerName}:${AssetStaging.BUNDLING_OUTPUT_DIR}/.`, options.bundleDir,
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

    // actual docker run
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match.array.contains([
      'run', '--rm',
      '--volumes-from', helper.copyContainerName,
      'alpine',
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

  });

  test('AssetBundlingBindMount bundles with bind mount ', () => {
    // GIVEN
    sinon.stub(process, 'platform').value('darwin');
    const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const options = {
      sourcePath: '/tmp/source',
      bundleDir: '/tmp/output',
      image: DockerImage.fromRegistry('alpine'),
      user: '1000',
    };
    const helper = new AssetBundlingBindMount(options);
    helper.run();

    // actual docker run with bind mount is called
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match.array.contains([
      'run', '--rm',
      '-v',
      'alpine',
    ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
  });
});
