import * as iam from '@aws-cdk/aws-iam';
import { Construct, Duration } from '@aws-cdk/core';

/**
 * Defines whether this Init template will is being rendered for Windows or Linux-based systems.
 */
export enum InitPlatform {
  /**
   * Render the config for a Windows platform
   */
  WINDOWS = 'WINDOWS',

  /**
   * Render the config for a Linux platform
   */
  LINUX = 'LINUX',
}

/**
 * The type of the init element.
 */
export enum InitElementType {
  /**
   * A package
   */
  PACKAGE = 'PACKAGE',

  /**
   * A group
   */
  GROUP = 'GROUP',

  /**
   * A user
   */
  USER = 'USER',

  /**
   * A source
   */
  SOURCE = 'SOURCE',

  /**
   * A file
   */
  FILE = 'FILE',

  /**
   * A command
   */
  COMMAND = 'COMMAND',

  /**
   * A service
   */
  SERVICE = 'SERVICE',
}

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
   */
  public addCommand(key: string) {
    return this.commands.push(key);
  }

  /**
   * Add a file key to the restart set
   */
  public addFile(key: string) {
    return this.files.push(key);
  }

  /**
   * Add a source key to the restart set
   */
  public addSource(key: string) {
    return this.sources.push(key);
  }

  /**
   * Add a package key to the restart set
   */
  public addPackage(packageType: string, key: string) {
    if (!this.packages[packageType]) {
      this.packages[packageType] = [];
    }
    this.packages[packageType].push(key);
  }

  /**
   * Render the restart handles for use in an InitService declaration
   */
  public renderRestartHandles(): any {
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
 * Context information passed when an InitElement is being consumed
 */
export interface InitBindOptions {
  /**
   * Scope in which to define any resources, if necessary.
   */
  readonly scope: Construct;

  /**
   * Which OS platform (Linux, Windows) the init block will be for.
   * Impacts which config types are available and how they are created.
   */
  readonly platform: InitPlatform;

  /**
   * Ordered index of current element type. Primarily used to auto-generate
   * command keys and retain ordering.
   */
  readonly index: number;

  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;
}

/**
 * A return type for a configured InitElement. Both its CloudFormation representation, and any
 * additional metadata needed to create the CloudFormation:Init.
 */
export interface InitElementConfig {
  /**
   * The CloudFormation representation of the configuration of an InitElement.
   */
  readonly config: Record<string, any>;

  /**
   * Optional authentication blocks to be associated with the Init Config
   *
   * @default - No authentication associated with the config
   */
  readonly authentication?: Record<string, any>;
}

/**
 * Base class for all CloudFormation Init elements
 */
export abstract class InitElement {

  /**
   * Returns the init element type for this element.
   */
  public abstract readonly elementType: InitElementType;

  /**
   * Called when the Init config is being consumed. Renders the CloudFormation
   * representation of this init element, and calculates any authentication
   * properties needed, if any.
   *
   * @param options bind options for the element.
   */
  public abstract bind(options: InitBindOptions): InitElementConfig;

}

/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
  /**
   * Identifier key for this command
   *
   * You can use this to order commands.
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
   * Specifies how long to wait (in seconds) after a command has finished in case the command causes a reboot.
   *
   * A value of "forever" directs cfn-init to exit and resume only after the
   * reboot is complete. Set this value to 0 if you do not want to wait for
   * every command.
   *
   * For Windows systems only.
   *
   * @default Duration.seconds(60)
   */
  readonly waitAfterCompletion?: Duration;

  /**
   * Restart the given service(s) after this command has run
   *
   * @default - Do not restart any service
   */
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
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
    return new InitCommand(shellCommand, options);
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

  public readonly elementType = InitElementType.COMMAND;

  protected constructor(private readonly command: any, private readonly options: InitCommandOptions) {
    super();

    if (typeof this.command !== 'string' && !(Array.isArray(command) && command.every(s => typeof s === 'string'))) {
      throw new Error('\'command\' must be either a string or an array of strings');
    }
  }

  public bind(options: InitBindOptions): InitElementConfig {
    const commandKey = this.options.key || `${options.index}`.padStart(3, '0'); // 001, 005, etc.

    if (options.platform !== InitPlatform.WINDOWS && this.options.waitAfterCompletion !== undefined) {
      throw new Error(`Command '${this.command}': 'waitAfterCompletion' is only valid for Windows systems.`);
    }

    for (const handle of this.options.serviceRestartHandles ?? []) {
      handle.addCommand(commandKey);
    }

    return {
      config: {
        [commandKey]: {
          command: this.command,
          env: this.options.env,
          cwd: this.options.cwd,
          test: this.options.test,
          ignoreErrors: this.options.ignoreErrors,
          waitAfterCompletion: this.options.waitAfterCompletion?.toSeconds(),
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

  /**
   * Create a service restart definition from the given options, not imposing any defaults.
   *
   * @param serviceName the name of the service to restart
   * @param options service options
   */
  public static fromOptions(serviceName: string, options: InitServiceOptions = {}): InitService {
    return new InitService(serviceName, options);
  }

  public readonly elementType = InitElementType.SERVICE;

  protected constructor(private readonly serviceName: string, private readonly serviceOptions: InitServiceOptions) {
    super();
  }

  public bind(options: InitBindOptions): InitElementConfig {
    const serviceManager = options.platform === InitPlatform.LINUX ? 'sysvinit' : 'windows';

    return {
      config: {
        [serviceManager]: {
          [this.serviceName]: {
            enabled: this.serviceOptions.enabled,
            ensureRunning: this.serviceOptions.ensureRunning,
            ...this.serviceOptions.serviceRestartHandle?.renderRestartHandles(),
          },
        },
      },
    };
  }

}
