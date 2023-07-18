import * as util from 'util';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { print, error } from '../../logging';
import { flatten } from '../../util/arrays';
import { ISDK } from '../aws-auth';

/**
 * After reading events from all CloudWatch log groups
 * how long should we wait to read more events.
 *
 * If there is some error with reading events (i.e. Throttle)
 * then this is also how long we wait until we try again
 */
const SLEEP = 2_000;

/**
 * Represents a CloudWatch Log Event that will be
 * printed to the terminal
 */
interface CloudWatchLogEvent {
  /**
   * The log event message
   */
  readonly message: string;

  /**
   * The name of the log group
   */
  readonly logGroupName: string;

  /**
   * The time at which the event occurred
   */
  readonly timestamp: Date;
}

/**
 * Configuration tracking information on the log groups that are
 * being monitored
 */
interface LogGroupsAccessSettings {
  /**
   * The SDK for a given environment (account/region)
   */
  readonly sdk: ISDK;

  /**
   * A map of log groups and associated startTime in a given account.
   *
   * The monitor will read events from the log group starting at the
   * associated startTime
   */
  readonly logGroupsStartTimes: { [logGroupName: string]: number };
}

export class CloudWatchLogEventMonitor {
  /**
   * Determines which events not to display
   */
  private startTime: number;

  /**
   * Map of environment (account:region) to LogGroupsAccessSettings
   */
  private readonly envsLogGroupsAccessSettings = new Map<string, LogGroupsAccessSettings>();

  private active = false;

  constructor(startTime?: Date) {
    this.startTime = startTime?.getTime() ?? Date.now();
  }

  /**
   * resume reading/printing events
   */
  public activate(): void {
    this.active = true;
    this.scheduleNextTick(0);
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
    this.envsLogGroupsAccessSettings.clear();
  }

  /**
   * Adds CloudWatch log groups to read log events from.
   * Since we could be watching multiple stacks that deploy to
   * multiple environments (account+region), we need to store a list of log groups
   * per env along with the SDK object that has access to read from
   * that environment.
   */
  public addLogGroups(env: cxapi.Environment, sdk: ISDK, logGroupNames: string[]): void {
    const awsEnv = `${env.account}:${env.region}`;
    const logGroupsStartTimes = logGroupNames.reduce((acc, groupName) => {
      acc[groupName] = this.startTime;
      return acc;
    }, {} as { [logGroupName: string]: number });
    this.envsLogGroupsAccessSettings.set(awsEnv, {
      sdk,
      logGroupsStartTimes: {
        ...this.envsLogGroupsAccessSettings.get(awsEnv)?.logGroupsStartTimes,
        ...logGroupsStartTimes,
      },
    });
  }

  private scheduleNextTick(sleep: number): void {
    setTimeout(() => void(this.tick()), sleep);
  }

  private async tick(): Promise<void> {
    if (!this.active) {
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

    this.scheduleNextTick(SLEEP);
  }

  /**
   * Reads all new log events from a set of CloudWatch Log Groups
   * in parallel
   */
  private async readNewEvents(): Promise<Array<Array<CloudWatchLogEvent>>> {
    const promises: Array<Promise<Array<CloudWatchLogEvent>>> = [];
    for (const settings of this.envsLogGroupsAccessSettings.values()) {
      for (const group of Object.keys(settings.logGroupsStartTimes)) {
        promises.push(this.readEventsFromLogGroup(settings, group));
      }
    }
    return Promise.all(promises);
  }

  /**
   * Print out a cloudwatch event
   */
  private print(event: CloudWatchLogEvent): void {
    print(util.format('[%s] %s %s',
      chalk.blue(event.logGroupName),
      chalk.yellow(event.timestamp.toLocaleTimeString()),
      event.message.trim()));
  }

  /**
   * Reads all new log events from a CloudWatch Log Group
   * starting at either the time the hotswap was triggered or
   * when the last event was read on the previous tick
   */
  private async readEventsFromLogGroup(
    logGroupsAccessSettings: LogGroupsAccessSettings,
    logGroupName: string,
  ): Promise<Array<CloudWatchLogEvent>> {
    const events: CloudWatchLogEvent[] = [];

    // log events from some service are ingested faster than others
    // so we need to track the start/end time for each log group individually
    // to make sure that we process all events from each log group
    const startTime = logGroupsAccessSettings.logGroupsStartTimes[logGroupName] ?? this.startTime;
    let endTime = startTime;
    try {
      const response = await logGroupsAccessSettings.sdk.cloudWatchLogs().filterLogEvents({
        logGroupName: logGroupName,
        limit: 100,
        startTime: startTime,
      }).promise();
      const filteredEvents = response.events ?? [];

      for (const event of filteredEvents) {
        if (event.message) {
          events.push({
            message: event.message,
            logGroupName,
            timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
          });

          if (event.timestamp && endTime < event.timestamp) {
            endTime = event.timestamp;
          }

        }
      }
      // As long as there are _any_ events in the log group `filterLogEvents` will return a nextToken.
      // This is true even if these events are before `startTime`. So if we have 100 events and a nextToken
      // then assume that we have hit the limit and let the user know some messages have been supressed.
      // We are essentially showing them a sampling (10000 events printed out is not very useful)
      if (filteredEvents.length === 100 && response.nextToken) {
        events.push({
          message: '>>> `watch` shows only the first 100 log messages - the rest have been truncated...',
          logGroupName,
          timestamp: new Date(endTime),
        });
      }
    } catch (e: any) {
      // with Lambda functions the CloudWatch is not created
      // until something is logged, so just keep polling until
      // there is somthing to find
      if (e.code === 'ResourceNotFoundException') {
        return [];
      }
      throw e;
    }
    logGroupsAccessSettings.logGroupsStartTimes[logGroupName] = endTime + 1;
    return events;
  }
}
