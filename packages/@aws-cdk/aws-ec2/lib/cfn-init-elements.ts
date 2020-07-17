import { Duration } from '@aws-cdk/core';
import { InitBindOptions, InitElementConfig, InitElementType, InitPlatform } from './private/cfn-init-internal';

/**
 * An object that represents reasons to restart an InitService
 *
 * Pass an instance of this object to all the `InitFile`, `InitCommand`,
 * `InitSource` and `InitPackage` objects that you want to restart
 * a service, and finally to the `InitService` itself as well.
 */
export class InitServiceRestartHandle {
  private readonly commands = new Array<string>();
  private readonly files = new Array<string>();
  private readonly sources = new Array<string>();
  private readonly packages: Record<string, string[]> = {};

  /**
   * Add a command key to the restart set
   * @internal
   */
  public _addCommand(key: string) {
    return this.commands.push(key);
  }

  /**
   * Add a file key to the restart set
   * @internal
   */
  public _addFile(key: string) {
    return this.files.push(key);
  }

  /**
   * Add a source key to the restart set
   * @internal
   */
  public _addSource(key: string) {
    return this.sources.push(key);
  }

  /**
   * Add a package key to the restart set
   * @internal
   */
  public _addPackage(packageType: string, key: string) {
    if (!this.packages[packageType]) {
      this.packages[packageType] = [];
    }
    this.packages[packageType].push(key);
  }

  /**
   * Render the restart handles for use in an InitService declaration
   * @internal
   */
  public _renderRestartHandles(): any {
    const nonEmpty = <A>(x: A[]) => x.length > 0 ? x : undefined;

    return {
      commands: nonEmpty(this.commands),
      files: nonEmpty(this.files),
      packages: Object.keys(this.packages).length > 0 ? this.packages : undefined,
      sources: nonEmpty(this.sources),
    };
  }
}

/**
 * Base class for all CloudFormation Init elements
 */
export abstract class InitElement {

  /**
   * Returns the init element type for this element.
   */
  public abstract readonly elementType: string;

  /**
   * Called when the Init config is being consumed. Renders the CloudFormation
   * representation of this init element, and calculates any authentication
   * properties needed, if any.
   *
   * @param options bind options for the element.
   * @internal
   */
  public abstract _bind(options: InitBindOptions): InitElementConfig;

}

/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
  /**
   * Identifier key for this command
   *
   * Commands are executed in lexicographical order of their key names.
   *
   * @default - Automatically generated
   */
  readonly key?: string;

  /**
   * Sets environment variables for the command.
   *
   * This property overwrites, rather than appends, the existing environment.
   *
   * @default - Use current environment
   */
  readonly env?: Record<string, string>;

  /**
   * The working directory
   *
   * @default - Use default working directory
   */
  readonly cwd?: string;

  /**
   * Command to determine whether this command should be run
   *
   * If the test passes (exits with error code of 0), the command is run.
   *
   * @default - Always run this command
   */
  readonly test?: string;

  /**
   * Continue running if this command fails
   *
   * @default false
   */
  readonly ignoreErrors?: boolean;

  /**
   * The duration to wait after a command has finished in case the command causes a reboot.
   *
   * Set this value to `InitCommandWaitDuration.none()` if you do not want to wait for every command;
   * `InitCommandWaitDuration.forever()` directs cfn-init to exit and resume only after the reboot is complete.
   *
   * For Windows systems only.
   *
   * @default - 60 seconds
   */
  readonly waitAfterCompletion?: InitCommandWaitDuration;

  /**
   * Restart the given service(s) after this command has run
   *
   * @default - Do not restart any service
   */
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
}

/**
 * Represents a duration to wait after a command has finished, in case of a reboot (Windows only).
 */
export abstract class InitCommandWaitDuration {
  /** Wait for a specified duration after a command. */
  public static of(duration: Duration): InitCommandWaitDuration {
    return new class extends InitCommandWaitDuration {
      /** @internal */
      public _render() { return duration.toSeconds(); }
    }();
  }

  /** Do not wait for this command. */
  public static none(): InitCommandWaitDuration {
    return InitCommandWaitDuration.of(Duration.seconds(0));
  }

  /** cfn-init will exit and resume only after a reboot. */
  public static forever(): InitCommandWaitDuration {
    return new class extends InitCommandWaitDuration {
      /** @internal */
      public _render() { return 'forever'; }
    }();
  }

  /**
   * Render to a CloudFormation value.
   * @internal
   */
  public abstract _render(): any;
}

/**
 * Command to execute on the instance
 */
export class InitCommand extends InitElement {
  /**
   * Run a shell command
   *
   * You must escape the string appropriately.
   */
  public static shellCommand(shellCommand: string, options: InitCommandOptions = {}): InitCommand {
    return new InitCommand([shellCommand], options);
  }

  /**
   * Run a command from an argv array
   *
   * You do not need to escape space characters or enclose command parameters in quotes.
   */
  public static argvCommand(argv: string[], options: InitCommandOptions = {}): InitCommand {
    if (argv.length === 0) {
      throw new Error('Cannot define argvCommand with an empty arguments');
    }
    return new InitCommand(argv, options);
  }

  public readonly elementType = InitElementType.COMMAND.toString();

  private constructor(private readonly command: string[], private readonly options: InitCommandOptions) {
    super();
  }

  /** @internal */
  public _bind(options: InitBindOptions): InitElementConfig {
    const commandKey = this.options.key || `${options.index}`.padStart(3, '0'); // 001, 005, etc.

    if (options.platform !== InitPlatform.WINDOWS && this.options.waitAfterCompletion !== undefined) {
      throw new Error(`Command '${this.command}': 'waitAfterCompletion' is only valid for Windows systems.`);
    }

    for (const handle of this.options.serviceRestartHandles ?? []) {
      handle._addCommand(commandKey);
    }

    return {
      config: {
        [commandKey]: {
          command: this.command,
          env: this.options.env,
          cwd: this.options.cwd,
          test: this.options.test,
          ignoreErrors: this.options.ignoreErrors,
          waitAfterCompletion: this.options.waitAfterCompletion?._render(),
        },
      },
    };
  }

}

/**
 * Options for an InitService
 */
export interface InitServiceOptions {
  /**
   * Enable or disable this service
   *
   * Set to true to ensure that the service will be started automatically upon boot.
   *
   * Set to false to ensure that the service will not be started automatically upon boot.
   *
   * @default - true if used in `InitService.enable()`, no change to service
   * state if used in `InitService.fromOptions()`.
   */
  readonly enabled?: boolean;

  /**
   * Make sure this service is running or not running after cfn-init finishes.
   *
   * Set to true to ensure that the service is running after cfn-init finishes.
   *
   * Set to false to ensure that the service is not running after cfn-init finishes.
   *
   * @default - same value as `enabled`.
   */
  readonly ensureRunning?: boolean;

  /**
   * Restart service when the actions registered into the restartHandle have been performed
   *
   * Register actions into the restartHandle by passing it to `InitFile`, `InitCommand`,
   * `InitPackage` and `InitSource` objects.
   *
   * @default - No files trigger restart
   */
  readonly serviceRestartHandle?: InitServiceRestartHandle;
}

/**
 * A services that be enabled, disabled or restarted when the instance is launched.
 */
export class InitService extends InitElement {
  /**
   * Enable and start the given service, optionally restarting it
   */
  public static enable(serviceName: string, options: InitServiceOptions = {}): InitService {
    const { enabled, ensureRunning, ...otherOptions } = options;
    return new InitService(serviceName, {
      enabled: enabled ?? true,
      ensureRunning: ensureRunning ?? enabled ?? true,
      ...otherOptions,
    });
  }

  /**
   * Disable and stop the given service
   */
  public static disable(serviceName: string): InitService {
    return new InitService(serviceName, { enabled: false, ensureRunning: false });
  }

  public readonly elementType = InitElementType.SERVICE.toString();

  private constructor(private readonly serviceName: string, private readonly serviceOptions: InitServiceOptions) {
    super();
  }

  /** @internal */
  public _bind(options: InitBindOptions): InitElementConfig {
    const serviceManager = options.platform === InitPlatform.LINUX ? 'sysvinit' : 'windows';

    return {
      config: {
        [serviceManager]: {
          [this.serviceName]: {
            enabled: this.serviceOptions.enabled,
            ensureRunning: this.serviceOptions.ensureRunning,
            ...this.serviceOptions.serviceRestartHandle?._renderRestartHandles(),
          },
        },
      },
    };
  }

}
