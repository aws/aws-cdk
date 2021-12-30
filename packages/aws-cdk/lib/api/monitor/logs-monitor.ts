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
  readonly message: string;
  readonly logGroup: string;
  readonly timestamp: Date;
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

  private logGroups = new Set<string>();
  private sdk?: ISDK;

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

  public addSdk(sdk: ISDK): void {
    this.sdk = sdk;
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
   * Adds a CloudWatch log group to read log events from
   */
  public addLogGroups(logGroups: string[]): void {
    logGroups.forEach(group => {
      this.logGroups.add(group);
    });
  }

  public resetLogGroups(): void {
    this.logGroups = new Set();
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
      if (events.length > 0) {
        this.startTime = Date.now();
      }
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
    const groups = Array.from(this.logGroups);
    return Promise.all(groups.map(group => {
      return this.readEventsFromLogGroup(group);
    }));
  }

  /**
   * Reads all new log events from a CloudWatch Log Group
   * starting when the hotswap was triggered
   *
   * Only prints out events that have not been printed already
   */
  private async readEventsFromLogGroup(logGroupName: string): Promise<CloudWatchLogEvent[]> {
    const events: CloudWatchLogEvent[] = [];
    try {
      let nextToken: string | undefined;
      do {
        const response = await this.sdk!.cloudWatchLogs().filterLogEvents({
          logGroupName: logGroupName,
          nextToken,
          limit: 100,
          startTime: this.startTime,
        }).promise();
        const eventPage = response.events ?? [];

        for (const event of eventPage) {
          if (event.message) {
            events.push({
              message: event.message,
              logGroup: logGroupName,
              timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            });
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
