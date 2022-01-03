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
 * Configuration that holds an SDK and list of log groups
 */
export interface LogGroupConfig {
  /**
   * The SDK for a given account
   */
  readonly sdk: ISDK;

  /**
   * A list of log groups in a given account
   */
  readonly groups: Set<string>;
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

  /**
   * The EventPrinter to use to print out CloudWatch events
   *
   * @default - a default printer will be created
   */
  readonly printer?: IEventPrinter;
}

export class CloudWatchLogEventMonitor {
  /**
   * Determines which events not to display
   */
  private startTime: number;

  /**
   * Tracks the startTime for each log group separately
   * Map of group name to starTime
   */
  private readonly groupStartTime = new Map<string, number>();

  /**
   * Map of account to LogGroupConfig
   */
  private readonly logGroups = new Map<string, LogGroupConfig>();

  private active = false;

  /**
   * The event printer that controls printing out
   * CloudWatchLog Events
   */
  private readonly printer: IEventPrinter;

  constructor(options: CloudWatchLogEventMonitorOptions = {}) {
    this.startTime = options.hotswapTime?.getTime() ?? Date.now();
    this.printer = options.printer ?? new EventPrinter();

    this.scheduleNextTick();
  }

  // allows the ability to "pause" the monitor. The primary
  // use case for this is when we are in the middle of performing a deployment
  // and don't want to interweave all the logs together
  public activate(): void {
    this.active = true;
  }

  public deactivate(): void {
    this.active = false;
  }

  /**
   * Adds CloudWatch log groups to read log events from.
   * Since we could be watching multiple stacks that deploy to
   * multiple AWS accounts, we need to store a list of log groups
   * per account along with the SDK object that has access to read from
   * that AWS account.
   */
  public addLogGroups(account: string, config: LogGroupConfig): void {
    const logGroup = this.logGroups.get(account);
    if (logGroup) {
      config.groups.forEach(group => {
        logGroup.groups.add(group);
        this.groupStartTime.set(group, this.startTime);
      });
    } else {
      this.logGroups.set(account, config);
    }
  }

  /**
   * reset the list of log groups that are being monitored
   * along with the startTime.
   *
   * This should only be triggered prior to a CFN deployment
   */
  public resetLogGroups(): void {
    this.startTime = Date.now();
    this.logGroups.clear();
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
        this.printer.print(event);
      });
    } catch (e) {
      error('Error occurred while monitoring logs: %s', e);
    }
    this.scheduleNextTick();
  }

  /**
   * Reads all new log events from a set of CloudWatch Log Groups
   * in parallel
   */
  private async readNewEvents(): Promise<Array<Array<CloudWatchLogEvent>>> {
    const promises: Array<Promise<Array<CloudWatchLogEvent>>> = [];
    for (const config of this.logGroups.values()) {
      const sdk = config.sdk;
      for (const group of config.groups) {
        promises.push(this.readEventsFromLogGroup(sdk, group));
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
  private async readEventsFromLogGroup(sdk: ISDK, logGroupName: string): Promise<CloudWatchLogEvent[]> {
    const events: CloudWatchLogEvent[] = [];

    // log events from some service are ingested faster than others
    // so we need to track the start/end time for each log group individually
    // to make sure that we process all events from each log group
    const startTime = this.groupStartTime.get(logGroupName) ?? this.startTime;
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
    this.groupStartTime.set(logGroupName, endTime+1);
    return events;
  }
}

interface PrinterProps {}

export interface IEventPrinter {
  print(event: CloudWatchLogEvent): void;
}

abstract class EventPrinterBase {
  constructor(protected readonly props?: PrinterProps) {
  }

  public abstract print(event: CloudWatchLogEvent): void;
}

/**
 * a CloudWatchLogs event printer
 */
export class EventPrinter extends EventPrinterBase {
  constructor(props?: PrinterProps) {
    super(props);
  }

  public print(event: CloudWatchLogEvent): void {
    print(util.format('[%s] %s %s',
      colors.blue(event.logGroup),
      colors.yellow(event.timestamp.toLocaleTimeString()),
      event.message));
  }
}
