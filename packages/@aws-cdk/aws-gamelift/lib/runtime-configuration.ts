import * as cdk from '@aws-cdk/core';

/**
 * Configuration of a fleet server process
 */
export interface ServerProcessConfig {
  /**
     * The number of server processes using this configuration that run concurrently on each instance. Minimum is `1`
     */
  readonly concurrentExecutions: number;
  /**
     * The location of a game build executable or the Realtime script file that contains the Init() function. Game builds and Realtime scripts are installed on instances at the root:
     * - Windows (custom game builds only): `C:\game`. Example: `C:\game\MyGame\server.exe`
     * - Linux: `/local/game`. Examples: `/local/game/MyGame/server.exe` or `/local/game/MyRealtimeScript.js`
     */
  readonly launchPath: string;

  /**
     * An optional list of parameters to pass to the server executable or Realtime script on launch.
     *
     * @default no parameters
     */
  readonly parameters: string;
}

/**
 * A set of instructions for launching server processes on each instance in a fleet.
 * Server processes run either an executable in a custom game build or a Realtime Servers script.
 */
export class ServerProcess {
  constructor(private readonly props: ServerProcessConfig) {
    if (!cdk.Token.isUnresolved(this.props.concurrentExecutions)) {
      if (this.props.concurrentExecutions < 1) {
        throw new Error(`The number of server processes cannot be lower than 1, given ${this.props.concurrentExecutions}`);
      }
    }
  }

  /**
   * Convert a Server process entity to its Json representation
   */
  public toJson() {
    return {
      parameters: this.props.parameters,
      launchPath: this.props.launchPath,
      concurrentExecutions: this.props.concurrentExecutions,
    };
  }
}

/**
 * Configuration of a fleet runtime configuration
 */
export interface RuntimeConfigurationConfig {
  /**
     * The maximum amount of time allowed to launch a new game session and have it report ready to host players.
     * During this time, the game session is in status `ACTIVATING`.
     *
     * If the game session does not become active before the timeout, it is ended and the game session status is changed to `TERMINATED`.
     *
     * @default by default game session activation timeout is 300 seconds
     */
  readonly gameSessionActivationTimeout?: cdk.Duration;
  /**
     * The number of game sessions in status `ACTIVATING` to allow on an instance.
     *
     * This setting limits the instance resources that can be used for new game activations at any one time.
     *
     * @default no limit
     */
  readonly maxConcurrentGameSessionActivations?: number;

  /**
     * A collection of server process configurations that identify what server processes to run on each instance in a fleet.
     */
  readonly serverProcesses: ServerProcess[];
}

/**
 * A collection of server process configurations that describe the set of processes to run on each instance in a fleet.
 * Server processes run either an executable in a custom game build or a Realtime Servers script.
 * GameLift launches the configured processes, manages their life cycle, and replaces them as needed.
 * Each instance checks regularly for an updated runtime configuration.
 *
 * A GameLift instance is limited to 50 processes running concurrently.
 * To calculate the total number of processes in a runtime configuration, add the values of the `ConcurrentExecutions` parameter for each `ServerProcess`.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-multiprocess.html
 */
export class RuntimeConfiguration {
  constructor(private readonly props: RuntimeConfigurationConfig) {
    if (!cdk.Token.isUnresolved(this.props.serverProcesses)) {
      if (this.props.serverProcesses.length > 50) {
        throw new Error(`No more than 50 server processes configuration are allowed per fleet, given ${this.props.serverProcesses.length}`);
      }
    }
  }

  /**
   * Convert a runtime configuration entity to its Json representation
   */
  public toJson() {
    return {
      gameSessionActivationTimeout: this.props.gameSessionActivationTimeout && this.props.gameSessionActivationTimeout.toSeconds(),
      maxConcurrentGameSessionActivations: this.props.maxConcurrentGameSessionActivations,
      serverProcesses: this.props.serverProcesses && this.props.serverProcesses.map((serverProcess: ServerProcess) => serverProcess.toJson()),
    };
  }
}