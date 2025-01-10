import * as child_process from 'child_process';
import * as sinon from 'sinon';
import { DockerVolume, DockerVolumeConsistency, DockerVolumeType, type DockerRunOptions, type ExistingDockerVolume, type VolumeCopyDockerVolume } from '../../lib/bundling';
import { DockerVolumeHelper, isBindMountDockerVolume, isExistingDockerVolume, isVolumeCopyDockerVolume } from '../../lib/private/bundling';

const DOCKER_CMD = process.env.CDK_DOCKER ?? 'docker';

const DEFAULT_DOCKER_VOLUME: DockerVolume = {
  containerPath: '/container/path',
  hostPath: '/host/path',
  consistency: DockerVolumeConsistency.CONSISTENT,
};

const BIND_MOUNT_DOCKER_VOLUME: DockerVolume = {
  dockerVolumeType: DockerVolumeType.BIND_MOUNT,
  containerPath: '/container/path',
  hostPath: '/host/path',
  consistency: DockerVolumeConsistency.CONSISTENT,
};

const VOLUME_COPY_DOCKER_VOLUME: VolumeCopyDockerVolume = {
  dockerVolumeType: DockerVolumeType.VOLUME_COPY,
  containerPath: '/container/path',
  hostInputPath: '/host/input',
  hostOutputPath: '/host/output',
};

const EXISTING_DOCKER_VOLUME: ExistingDockerVolume = {
  dockerVolumeType: DockerVolumeType.EXISTING,
  containerPath: '/container/path',
  volumeName: 'existing-volume',
};
describe('bundling utils', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('docker volume type helpers', () => {
    test.each([
      [isBindMountDockerVolume, 'dockerVolumeType: undefined', true, DEFAULT_DOCKER_VOLUME],
      [isBindMountDockerVolume, 'DockerVolume (Bind Mount)', true, BIND_MOUNT_DOCKER_VOLUME],
      [isBindMountDockerVolume, 'VolumeCopyDockerVolume', false, VOLUME_COPY_DOCKER_VOLUME],
      [isBindMountDockerVolume, 'ExistingDockerVolume', false, EXISTING_DOCKER_VOLUME],
      [isVolumeCopyDockerVolume, 'dockerVolumeType: undefined', false, DEFAULT_DOCKER_VOLUME],
      [isVolumeCopyDockerVolume, 'DockerVolume (Bind Mount)', false, BIND_MOUNT_DOCKER_VOLUME],
      [isVolumeCopyDockerVolume, 'VolumeCopyDockerVolume', true, VOLUME_COPY_DOCKER_VOLUME],
      [isVolumeCopyDockerVolume, 'ExistingDockerVolume', false, EXISTING_DOCKER_VOLUME],
      [isExistingDockerVolume, 'dockerVolumeType: undefined', false, DEFAULT_DOCKER_VOLUME],
      [isExistingDockerVolume, 'DockerVolume (Bind Mount)', false, BIND_MOUNT_DOCKER_VOLUME],
      [isExistingDockerVolume, 'VolumeCopyDockerVolume', false, VOLUME_COPY_DOCKER_VOLUME],
      [isExistingDockerVolume, 'ExistingDockerVolume', true, EXISTING_DOCKER_VOLUME],
    ])(
      '%p evaluates %p to %p',
      (typeCheckFunction, _, result, object) => {
        expect(typeCheckFunction(object)).toBe(result);
      },
    );
  });

  describe('DockerVolumeHelper', () => {
    let spawnSyncStub: sinon.SinonStub;

    beforeEach(() => {
      spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
        status: 0,
        stderr: Buffer.from('stderr'),
        stdout: Buffer.from('stdout'),
        pid: 123,
        output: ['stdout', 'stderr'],
        signal: null,
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    test('minimal options', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');

      // WHEN
      const helper = new DockerVolumeHelper({});

      helper.cleanup();

      // THEN
      expect(spawnSyncStub.notCalled).toBe(true);
      expect(helper.volumeCommands).toMatchObject([]);
    });

    test('prepares and cleans up copy container for VolumeCopyDockerVolumes', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/1',
          hostInputPath: '/host/input/1',
        }, {
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/2',
          hostOutputPath: '/host/output/2',
        }, {
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/3',
          hostInputPath: '/host/input/3',
          hostOutputPath: '/host/output/3',
        }],
      };

      // WHEN
      const helper = new DockerVolumeHelper(options);

      helper.cleanup();

      // THEN
      // prepare copy container
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'run',
        '--name', sinon.match(/copyContainer.*/g),
        '-v', sinon.match(/\/container\/path\/1/g),
        '-v', sinon.match(/\/container\/path\/2/g),
        '-v', sinon.match(/\/container\/path\/3/g),
        'public.ecr.aws/docker/library/alpine',
        'sh',
        '-c',
        [
          `mkdir -p /container/path/1 && chown -R ${options.user} /container/path/1`,
          `mkdir -p /container/path/2 && chown -R ${options.user} /container/path/2`,
          `mkdir -p /container/path/3 && chown -R ${options.user} /container/path/3`,
        ].join(' && '),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // delete copy container
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'rm', '-v', sinon.match(/copyContainer.*/g),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // copy files to copy container volume 1
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'cp', '/host/input/1/.', `${helper.containerName}:/container/path/1`,
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // copy files from copy container volume 2 to host
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'cp', `${helper.containerName}:/container/path/2/.`, '/host/output/2',
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // copy files to copy container volume 3
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'cp', '/host/input/3/.', `${helper.containerName}:/container/path/3`,
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // copy files from copy container volume 3 to host
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'cp', `${helper.containerName}:/container/path/3/.`, '/host/output/3',
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // returned volumes command is correct
      expect(helper.volumeCommands).toMatchObject([
        '--volumes-from',
        expect.stringMatching(/copyContainer.*/),
      ]);
    });

    test('correctly builds volumes command with opts', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/1',
          hostInputPath: '/host/input/1',
        }, {
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/2',
          hostPath: '/host/path/2',
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/3',
          volumeName: 'container-volume-3',
        }, {
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/4',
          hostInputPath: '/host/input/4',
          opts: ['opt1', 'opt2'],
        }, {
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/5',
          hostPath: '/host/path/5',
          opts: ['opt1', 'opt2'],
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/6',
          volumeName: 'container-volume-6',
          opts: ['opt1', 'opt2'],
        }],
        volumesFrom: [
          'volumes-from-container-1',
          'volumes-from-container-2',
        ],
      };

      // WHEN
      const helper = new DockerVolumeHelper(options);

      // THEN
      // Copy volume opts are correct
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'run',
        '--name', sinon.match(/copyContainer.*/g),
        '-v', '/container/path/1',
        '-v', ':/container/path/4:opt1,opt2',
        'public.ecr.aws/docker/library/alpine',
        'sh',
        '-c',
        [
          `mkdir -p /container/path/1 && chown -R ${options.user} /container/path/1`,
          `mkdir -p /container/path/4 && chown -R ${options.user} /container/path/4`,
        ].join(' && '),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // returned volumes command is correct
      expect(helper.volumeCommands).toMatchObject([
        '-v',
        '/host/path/2:/container/path/2:delegated',
        '-v',
        '/host/path/5:/container/path/5:opt1,opt2,delegated',
        '-v',
        'container-volume-3:/container/path/3:',
        '-v',
        'container-volume-6:/container/path/6:opt1,opt2',
        '--volumes-from',
        'volumes-from-container-1',
        '--volumes-from',
        'volumes-from-container-2',
        '--volumes-from',
        expect.stringMatching(/copyContainer.*/),
      ]);
    });

    test('correctly includes selinux opt', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('linux');
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/1',
          hostInputPath: '/host/input/1',
        }, {
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/2',
          hostPath: '/host/path/2',
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/3',
          volumeName: 'container-volume-3',
        }, {
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/4',
          hostInputPath: '/host/input/4',
          opts: ['opt1', 'opt2'],
        }, {
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/5',
          hostPath: '/host/path/5',
          opts: ['opt1', 'opt2'],
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/6',
          volumeName: 'container-volume-6',
          opts: ['opt1', 'opt2'],
        }],
        volumesFrom: [
          'volumes-from-container-1',
          'volumes-from-container-2',
        ],
      };

      // WHEN
      const helper = new DockerVolumeHelper(options);

      // THEN
      // Copy volume opts are correct
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'run',
        '--name', sinon.match(/copyContainer.*/g),
        '-v', '/container/path/1',
        '-v', ':/container/path/4:opt1,opt2',
        'public.ecr.aws/docker/library/alpine',
        'sh',
        '-c',
        [
          `mkdir -p /container/path/1 && chown -R ${options.user} /container/path/1`,
          `mkdir -p /container/path/4 && chown -R ${options.user} /container/path/4`,
        ].join(' && '),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);

      // returned volumes command is correct
      expect(helper.volumeCommands).toMatchObject([
        '-v',
        '/host/path/2:/container/path/2:z,delegated',
        '-v',
        '/host/path/5:/container/path/5:opt1,opt2,delegated', // selinux flag is not added automatically when custom opts passed
        '-v',
        'container-volume-3:/container/path/3:',
        '-v',
        'container-volume-6:/container/path/6:opt1,opt2',
        '--volumes-from',
        'volumes-from-container-1',
        '--volumes-from',
        'volumes-from-container-2',
        '--volumes-from',
        expect.stringMatching(/copyContainer.*/),
      ]);
    });

    test('cleans up copy container when input copy fails', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');
      spawnSyncStub.withArgs(DOCKER_CMD, sinon.match.array.startsWith(['cp'])).returns({
        status: -1,
        stderr: Buffer.from('stderr'),
        stdout: Buffer.from('stdout'),
        pid: 123,
        output: ['stdout', 'stderr'],
        signal: null,
      });
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/1',
          hostInputPath: '/host/input/1',
        }],
      };

      // WHEN
      expect(() => new DockerVolumeHelper(options)).toThrow();

      // THEN
      // delete copy container
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'rm', '-v', sinon.match(/copyContainer.*/g),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });

    test('cleans up copy container when output copy fails', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');
      spawnSyncStub.withArgs(DOCKER_CMD, sinon.match.array.startsWith(['cp'])).returns({
        status: -1,
        stderr: Buffer.from('stderr'),
        stdout: Buffer.from('stdout'),
        pid: 123,
        output: ['stdout', 'stderr'],
        signal: null,
      });
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.VOLUME_COPY,
          containerPath: '/container/path/1',
          hostOutputPath: '/host/output/1',
        }],
      };

      // WHEN
      const helper = new DockerVolumeHelper(options);
      expect(() => helper.cleanup()).toThrow();

      // THEN
      // delete copy container
      expect(spawnSyncStub.calledWith(DOCKER_CMD, sinon.match([
        'rm', '-v', sinon.match(/copyContainer.*/g),
      ]), { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });

    test('does not spawn copy container with no copy volumes', () => {
      // GIVEN
      sinon.stub(process, 'platform').value('darwin');
      const options: DockerRunOptions = {
        user: '1000',
        volumes: [{
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/2',
          hostPath: '/host/path/2',
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/3',
          volumeName: 'container-volume-3',
        }, {
          dockerVolumeType: DockerVolumeType.BIND_MOUNT,
          containerPath: '/container/path/5',
          hostPath: '/host/path/5',
          opts: ['opt1', 'opt2'],
        }, {
          dockerVolumeType: DockerVolumeType.EXISTING,
          containerPath: '/container/path/6',
          volumeName: 'container-volume-6',
          opts: ['opt1', 'opt2'],
        }],
        volumesFrom: [
          'volumes-from-container-1',
          'volumes-from-container-2',
        ],
      };

      // WHEN
      const helper = new DockerVolumeHelper(options);

      // THEN
      expect(spawnSyncStub.neverCalledWith(DOCKER_CMD)).toBe(true);
      // returned volumes command is correct
      expect(helper.volumeCommands).toMatchObject([
        '-v',
        '/host/path/2:/container/path/2:delegated',
        '-v',
        '/host/path/5:/container/path/5:opt1,opt2,delegated', // selinux flag is not added automatically when custom opts passed
        '-v',
        'container-volume-3:/container/path/3:',
        '-v',
        'container-volume-6:/container/path/6:opt1,opt2',
        '--volumes-from',
        'volumes-from-container-1',
        '--volumes-from',
        'volumes-from-container-2',
      ]);
    });
  });
});
