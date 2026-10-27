import child_process from 'child_process';
import sinon from 'sinon';
import { AssetStaging, DockerImage } from '../../lib';
import { AssetBundlingBindMount, AssetBundlingVolumeCopy, dockerExec } from '../../lib/private/asset-staging';

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
      image: DockerImage.fromRegistry('public.ecr.aws/docker/library/alpine'),
      user: '1000',
      platform: 'linux/amd64',
    };
    const helper = new AssetBundlingVolumeCopy(options);
    helper.run();

    // volume Creation
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'create', sinon.match(/assetInput.*/g),
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'create', sinon.match(/assetOutput.*/g),
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // volume removal
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'rm', sinon.match(/assetInput.*/g),
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'volume', 'rm', sinon.match(/assetOutput.*/g),
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // prepare copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'run',
      '--name', sinon.match(/copyContainer.*/g),
      '-v', sinon.match(/assetInput.*/g),
      '-v', sinon.match(/assetOutput.*/g),
      'public.ecr.aws/docker/library/alpine',
      'sh',
      '-c',
      `mkdir -p ${AssetStaging.BUNDLING_INPUT_DIR} && chown -R ${options.user} ${AssetStaging.BUNDLING_OUTPUT_DIR} && chown -R ${options.user} ${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // delete copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'rm', sinon.match(/copyContainer.*/g),
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // copy files to copy container
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'cp', `${options.sourcePath}/.`, `${helper.copyContainerName}:${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // copy files from copy container to host
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
      'cp', `${helper.copyContainerName}:${AssetStaging.BUNDLING_OUTPUT_DIR}/.`, options.bundleDir,
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);

    // actual docker run
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match.array.contains([
      'run', '--rm',
      '--platform', 'linux/amd64',
      '--volumes-from', helper.copyContainerName,
      'public.ecr.aws/docker/library/alpine',
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);
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
      image: DockerImage.fromRegistry('public.ecr.aws/docker/library/alpine'),
      user: '1000',
      network: 'host',
      platform: 'linux/amd64',
    };
    const helper = new AssetBundlingBindMount(options);
    helper.run();

    // actual docker run with bind mount is called
    expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match.array.contains([
      'run', '--rm',
      '--network', 'host',
      '--platform', 'linux/amd64',
      '-v',
      'public.ecr.aws/docker/library/alpine',
    ]), { encoding: 'utf-8', maxBuffer: Infinity, stdio: ['ignore', 'pipe', 'pipe'] })).toEqual(true);
  });
});

describe('dockerExec', () => {
  const previousDocker = process.env.CDK_DOCKER;

  afterEach(() => {
    if (previousDocker === undefined) {
      delete process.env.CDK_DOCKER;
    } else {
      process.env.CDK_DOCKER = previousDocker;
    }
  });

  test('throws an error that includes stdout and stderr when docker exits non-zero', () => {
    process.env.CDK_DOCKER = process.execPath;

    expect(() => dockerExec([
      '-e',
      'process.stdout.write("docker-stdout-marker\\n"); process.stderr.write("permission denied while trying to connect to the Docker daemon socket\\n"); process.exit(1);',
    ])).toThrow(/exited with status 1[\s\S]*docker-stdout-marker[\s\S]*permission denied while trying to connect to the Docker daemon socket/);
  });
});
