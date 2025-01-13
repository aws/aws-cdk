import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as crypto from 'crypto';
import {
  DockerRunOptions,
  DockerVolume,
  DockerVolumeConsistency,
  DockerVolumeType,
  ExistingDockerVolume,
  VolumeCopyDockerVolume,
  type DockerVolumeBase,
} from '../bundling';

export function isBindMountDockerVolume(volume: DockerVolumeBase): volume is DockerVolume {
  return ('dockerVolumeType' in volume && volume.dockerVolumeType === DockerVolumeType.BIND_MOUNT)
  || (!('dockerVolumeType' in volume) || volume.dockerVolumeType === undefined) && 'hostPath' in volume;
}

export function isVolumeCopyDockerVolume(volume: DockerVolumeBase): volume is VolumeCopyDockerVolume {
  return 'dockerVolumeType' in volume && volume.dockerVolumeType === DockerVolumeType.VOLUME_COPY;
}

export function isExistingDockerVolume(volume: DockerVolumeBase): volume is ExistingDockerVolume {
  return 'dockerVolumeType' in volume && volume.dockerVolumeType === DockerVolumeType.EXISTING;
}

export interface DockerVolumes {
  bindMountVolumes: DockerVolume[];
  existingVolumes: ExistingDockerVolume[];
  volumeCopyVolumes: VolumeCopyDockerVolume[];
};

/**
 * Runs a helper container that holds copy volumes and does some preparation tasks.
 * `DockerVolumeHelper.cleanup()` needs to be called to ensure containers
 * and volumes aren't left on the host.
 */
export class DockerVolumeHelper {
  readonly volumeCommands: string[];
  readonly containerName?: string;
  readonly volumes: DockerVolumes;

  constructor(readonly options: DockerRunOptions) {
    this.volumes = {
      bindMountVolumes: [],
      existingVolumes: [],
      volumeCopyVolumes: [],
    };
    for (let volume of this.options.volumes ?? []) {
      if (isBindMountDockerVolume(volume)) {
        this.volumes.bindMountVolumes.push(volume);
      } else if (isVolumeCopyDockerVolume(volume)) {
        this.volumes.volumeCopyVolumes.push(volume);
      } else if (isExistingDockerVolume(volume)) {
        this.volumes.existingVolumes.push(volume);
      }
    }
    if (this.volumes.volumeCopyVolumes.length > 0) {
      this.containerName = `copyContainer${crypto.randomBytes(12).toString('hex')}`;
      const copyVolumeCommands = this.volumes.volumeCopyVolumes.flatMap(volume => [
        '-v',
        // leading ':' is required for anonymous volume with opts
        volume.opts ? `:${volume.containerPath}:${volume.opts.join(',')}` : `${volume.containerPath}`,
      ]);
      const directoryCommands: string[] = [];
      for (let volume of this.volumes.volumeCopyVolumes) {
        directoryCommands.push(`mkdir -p ${volume.containerPath}`);
        if (options.user) directoryCommands.push(`chown -R ${options.user} ${volume.containerPath}`);
      }
      dockerExec([
        'run',
        '--name',
        this.containerName,
        ...copyVolumeCommands,
        'public.ecr.aws/docker/library/alpine',
        'sh',
        '-c',
        directoryCommands.join(' && '),
      ]);
      try {
        this.copyInputVolumes();
      } catch (e) {
        // If copy in fails, cleanup before re-throwing
        dockerExec(['rm', '-v', this.containerName]);
        throw e;
      }
    }
    this.volumeCommands = this.buildVolumeCommands();
  };

  /**
   * removes the Docker helper container and copy volumes
   */
  public cleanup() {
    if (this.containerName) {
      try {
        this.copyOutputVolumes();
      } finally {
        dockerExec(['rm', '-v', this.containerName]);
      }
    }
  }

  private buildVolumeCommands(): string[] {
    const volumeCommands = [];
    for (let volume of this.volumes.bindMountVolumes) {
      const bindMountDefaultOpts = isSeLinux() ? ['z'] : [];
      const opts = [
        ...(volume.opts ?? bindMountDefaultOpts),
        volume.consistency ?? DockerVolumeConsistency.DELEGATED,
      ].join(',');
      volumeCommands.push('-v', [`${volume.hostPath}`, `${volume.containerPath}`, opts].join(':'));
    }
    for (let volume of this.volumes.existingVolumes) {
      const opts = (volume.opts ?? []).join(',');
      volumeCommands.push('-v', [`${volume.volumeName}`, `${volume.containerPath}`, opts].join(':'));
    }
    volumeCommands.push(...this.options.volumesFrom?.flatMap(containerName => ['--volumes-from', containerName]) ?? []);
    if (this.containerName) {
      volumeCommands.push('--volumes-from', this.containerName);
    }
    return volumeCommands;
  }

  /**
   * copy files from the host where this is executed into the input volume
   * @param sourcePath - path to folder where files should be copied from - without trailing slash
   */
  private copyInputVolumes() {
    for (let volume of this.volumes.volumeCopyVolumes) {
      if (volume.hostInputPath) {
        dockerExec([
          'cp',
          `${volume.hostInputPath}/.`,
          `${this.containerName}:${volume.containerPath}`,
        ]);
      }
    }
  }

  /**
   * copy files from the the output volume to the host where this is executed
   * @param outputPath - path to folder where files should be copied to - without trailing slash
   */
  private copyOutputVolumes() {
    for (let volume of this.volumes.volumeCopyVolumes) {
      if (volume.hostOutputPath) {
        dockerExec([
          'cp',
          `${this.containerName}:${volume.containerPath}/.`,
          `${volume.hostOutputPath}`,
        ]);
      }
    }
  }
}

export function dockerExec(args: string[], options?: SpawnSyncOptions) {
  const prog = process.env.CDK_DOCKER ?? 'docker';
  const proc = spawnSync(prog, args, options ?? {
    encoding: 'utf-8',
    stdio: [ // show Docker output
      'ignore', // ignore stdio
      process.stderr, // redirect stdout to stderr
      'inherit', // inherit stderr
    ],
  });

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    const reason = proc.signal != null
      ? `signal ${proc.signal}`
      : `status ${proc.status}`;
    const command = [prog, ...args.map((arg) => /[^a-z0-9_-]/i.test(arg) ? JSON.stringify(arg) : arg)].join(' ');

    function prependLines(firstLine: string, text: Buffer | string | undefined): string[] {
      if (!text || text.length === 0) {
        return [];
      }
      const padding = ' '.repeat(firstLine.length);
      return text.toString('utf-8').split('\n').map((line, idx) => `${idx === 0 ? firstLine : padding}${line}`);
    }

    throw new Error([
      `${prog} exited with ${reason}`,
      ...prependLines('--> STDOUT:  ', proc.stdout ) ?? [],
      ...prependLines('--> STDERR:  ', proc.stderr ) ?? [],
      `--> Command: ${command}`,
    ].join('\n'));
  }

  return proc;
}

function isSeLinux(): boolean {
  if (process.platform != 'linux') {
    return false;
  }
  const prog = 'selinuxenabled';
  const proc = spawnSync(prog, [], {
    stdio: [ // show selinux status output
      'pipe', // get value of stdio
      process.stderr, // redirect stdout to stderr
      'inherit', // inherit stderr
    ],
  });
  if (proc.error) {
    // selinuxenabled not a valid command, therefore not enabled
    return false;
  }
  if (proc.status == 0) {
    // selinux enabled
    return true;
  } else {
    // selinux not enabled
    return false;
  }
}
