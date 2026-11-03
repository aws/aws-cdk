import type { SpawnSyncOptions, SpawnSyncReturns } from 'child_process';
import child_process from 'child_process';

export type FailureType = 'err-exit' | 'failed-to-start';

/**
 * A mock for spawnSync that emulates a real Docker with respect to the 'inspect' command
 */
export class FakeDocker {
  public readonly containerId = '1234567890abcdef1234567890abcdef';
  public readonly spawnSync: jest.SpiedFunction<typeof child_process.spawnSync>;
  private readonly builtImages = new Set<string>();
  private failurePrefix: string[] | undefined;
  private failureType: FailureType = 'err-exit';
  private seLinuxEnabled: boolean = false;

  constructor(private readonly expectedDockerCommand: string) {
    this.spawnSync = jest.spyOn(child_process, 'spawnSync');
    this.reset();
  }

  public reset() {
    this.spawnSync.mockReset();
    this.spawnSync.mockImplementation((command, args, options) =>
      this.called(command, args, options),
    );

    this.builtImages.clear();
    this.failurePrefix = undefined;
    this.failureType = 'err-exit';
    this.seLinuxEnabled = false;
  }

  public givenImageExists(tag: string) {
    this.builtImages.add(tag);
  }

  public givenNextCommandFails(argsPrefix: string[], failureType: FailureType) {
    this.failurePrefix = argsPrefix;
    this.failureType = failureType;
  }

  public givenSeLinuxEnabled() {
    this.seLinuxEnabled = true;
  }

  public assertCalled(args: string[]) {
    expect(this.spawnSync).toHaveBeenCalledWith(this.expectedDockerCommand, args, expect.anything());
  }

  public assertNotCalled(args: string[]) {
    expect(this.spawnSync).not.toHaveBeenCalledWith(this.expectedDockerCommand, args, expect.anything());
  }

  private called(command: string, args?: readonly string[], _options?: SpawnSyncOptions): SpawnSyncReturns<string | NonSharedBuffer> {
    if (command === this.expectedDockerCommand) {
      if (!args) {
        throw new Error('Expected args, not a shell string');
      }

      if (this.failurePrefix) {
        let prefixMatch = true;
        for (let i = 0; i < Math.min(args.length, this.failurePrefix.length); i++) {
          if (args[i] !== this.failurePrefix[i]) {
            prefixMatch = false;
          }
        }
        if (prefixMatch) {
          return this.failureType === 'err-exit' ? failureResult() : { ...successResult(), error: new Error('UnknownError') };
        }
      }

      if (args[0] === 'image' && args[1] === 'inspect') {
        const image = args[2];
        return this.builtImages.has(image) ? successResult() : failureResult();
      }
      if (args[0] === 'build') {
        const image = opt(args, '-t');
        this.builtImages.add(image);
        return successResult('sha256:1234567890abcdef');
      }
      if (args[0] === 'create') {
        return successResult(this.containerId);
      }

      // Didn't get any other instructions, so just succeed this
      return successResult();
    }

    if (command === 'selinuxenabled') {
      return this.seLinuxEnabled ? successResult() : failureResult();
    }

    throw new Error(`Expected command ${this.expectedDockerCommand}, got ${command}`);
  }
}

function opt(args: readonly string[], after: string) {
  let i = args.indexOf(after);
  if (i === -1) {
    throw new Error(`Could not find ${after} in ${JSON.stringify(args)}`);
  }
  if (i === args.length - 1) {
    throw new Error(`No argument for ${after} in ${JSON.stringify(args)}`);
  }
  return args[i + 1];
}

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

