import * as util from 'util';
import * as colors from 'colors/safe';
import { print, error } from '../../logging';
import { flatten } from '../../util/arrays';
import { ISDK } from '../aws-auth';

// how often we should read events from CloudWatchLogs
const SLEEP = 2_000;

/**
 * Represents a CloudWatch Log Event that will be
 * printed to the terminal
 */
export interface CloudWatchLogEvent {
  /**
   * The log event message
   */
  readonly message: string;

  /**
   * The name of the log group
   */
  readonly logGroup: string;

  /**
   * The time at which the event occurred
   */
  readonly timestamp: Date;
}

/**
 * Options for adding log groups to the CloudWatchLogEventMonitor
 */
export interface AddLogGroupOptions {
  /**
   * The AWS account that the log group lives in
   */
  readonly account: string;

  /**
   * The AWS region that the log group lives in
   */
  readonly region: string;

  /**
   * The SDK for a given account
   */
  readonly sdk: ISDK;

  /**
   * A map of log groups and startTime in a given account
   */
  readonly groups: Set<string>;
}

/**
 * Configuration tracking information on the log groups that are
 * being monitored
 */
export interface LogGroupConfig {
  /**
   * The SDK for a given account
   */
  readonly sdk: ISDK;

  /**
   * A map of log groups and startTime in a given account
   */
  readonly groups: Map<string, number>;
}

/**
 * Options for creating a CloudWatchLogEventMonitor
 */
export interface CloudWatchLogEventMonitorOptions {
  /**
   * The time that watch was first triggered.
   * CloudWatch logs will be filtered using this start time
   *
   * @default - the current time
   */
  readonly hotswapTime?: Date;
}

export class CloudWatchLogEventMonitor {
  /**
   * Determines which events not to display
   */
  private startTime: number;

  /**
   * Map of account to LogGroupConfig
   */
  private readonly logGroups = new Map<string, LogGroupConfig>();

  private active = false;

  constructor(options: CloudWatchLogEventMonitorOptions = {}) {
    this.startTime = options.hotswapTime?.getTime() ?? Date.now();
    this.scheduleNextTick();
  }

  /**
   * resume reading/printing events
   */
  public activate(): void {
    this.active = true;
  }

  /**
   * deactivates the monitor so no new events are read
   * use case for this is when we are in the middle of performing a deployment
   * and don't want to interweave all the logs together with the CFN
   * deployment logs
   *
   * Also resets the start time to be when the new deployment was triggered
   * and clears the list of tracked log groups
   */
  public deactivate(): void {
    this.active = false;
    this.startTime = Date.now();
    this.logGroups.clear();
  }

  /**
   * Adds CloudWatch log groups to read log events from.
   * Since we could be watching multiple stacks that deploy to
   * multiple environments (account+region), we need to store a list of log groups
   * per env along with the SDK object that has access to read from
   * that AWS account.
   */
  public addLogGroups(options: AddLogGroupOptions): void {
    const env = `${options.account}:${options.region}`;
    const groups = new Map<string, number>();
    options.groups.forEach(group => {
      groups.set(group, this.startTime);
    });
    const logGroup = this.logGroups.get(env);
    if (logGroup) {
      groups.forEach((time, group) => {
        logGroup.groups.set(group, time);
      });
    } else {
      this.logGroups.set(env, {
        sdk: options.sdk,
        groups,
      });
    }
  }

  private scheduleNextTick(): void {
    setTimeout(() => void(this.tick()), SLEEP);
  }

  private async tick(): Promise<void> {
    if (!this.active) {
      this.scheduleNextTick();
      return;
    }
    try {
      const events = flatten(await this.readNewEvents());
      events.forEach(event => {
        this.print(event);
      });
    } catch (e) {
      error('Error occurred while monitoring logs: %s', e);
    }
    this.scheduleNextTick();
  }

  /**
   * Print out a cloudwatch event
   */
  private print(event: CloudWatchLogEvent): void {
    print(util.format('[%s] %s %s',
      colors.blue(event.logGroup),
      colors.yellow(event.timestamp.toLocaleTimeString()),
      event.message.trim()));
  }

  /**
   * Reads all new log events from a set of CloudWatch Log Groups
   * in parallel
   */
  private async readNewEvents(): Promise<Array<Array<CloudWatchLogEvent>>> {
    const promises: Array<Promise<Array<CloudWatchLogEvent>>> = [];
    for (const config of this.logGroups.values()) {
      const sdk = config.sdk;
      for (const group of config.groups.keys()) {
        promises.push(this.readEventsFromLogGroup(config.groups, sdk, group));
      }
    }
    return Promise.all(promises);
  }

  /**
   * Reads all new log events from a CloudWatch Log Group
   * starting when the hotswap was triggered
   *
   * Only prints out events that have not been printed already
   */
  private async readEventsFromLogGroup(logGroupConfig: Map<string, number>, sdk: ISDK, logGroupName: string): Promise<CloudWatchLogEvent[]> {
    const events: CloudWatchLogEvent[] = [];

    // log events from some service are ingested faster than others
    // so we need to track the start/end time for each log group individually
    // to make sure that we process all events from each log group
    const startTime = logGroupConfig.get(logGroupName) ?? this.startTime;
    let endTime = startTime;
    try {
      let nextToken: string | undefined;
      do {
        const response = await sdk.cloudWatchLogs().filterLogEvents({
          logGroupName: logGroupName,
          nextToken,
          limit: 100,
          startTime: startTime,
        }).promise();
        const eventPage = response.events ?? [];

        for (const event of eventPage) {
          if (event.message) {
            events.push({
              message: event.message,
              logGroup: logGroupName,
              timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            });

            if (event.timestamp && endTime < event.timestamp) {
              endTime = event.timestamp;
            }
          }
        }
        nextToken = response.nextToken;
      } while (nextToken);
    } catch (e) {
      // with Lambda functions the CloudWatch is not created
      // until something is logged, so just keep polling until
      // there is somthing to find
      if (e.code === 'ResourceNotFoundException') {
        return [];
      }
      throw e;
    }
    logGroupConfig.set(logGroupName, endTime+1);
    return events;
  }
}
