import * as util from 'util';
import { CloudWatchLogs } from 'aws-sdk';
import * as colors from 'colors/safe';
import { error } from '../../../logging';
import { ISDK } from '../../aws-auth';

export interface WithDefaultPrinterProps {
  /**
   * Time that the latest hotswap operation occurred
   *
   * @default - local machine's current time
   */
  readonly hotswapTime?: Date;

}

interface SDKMap {
  sdk: ISDK;
  resources: string[];
}

export interface CloudWatchLogEvent {
  readonly message: string;
  readonly logGroup: string;
  readonly logStream?: string;
  readonly ingestionTime: Date;
}

export class CloudWatchLogEventMonitor {
  public static withDefaultPrinter(options: WithDefaultPrinterProps = {}) {
    const stream = process.stderr;
    const props: PrinterProps = {
      stream,
    };

    return new CloudWatchLogEventMonitor(new EventPrinter(props), options.hotswapTime);
  }

  private active = false;

  /**
   * Determines which events not to display
   */
  private startTime: number;

  /**
   * Current tick timer
   */
  private tickTimer?: NodeJS.Timer;

  /**
   * Set to the activity of reading the current events
   */
  private readPromise?: Promise<any>;

  private activity: Map<string, boolean> = new Map();
  private sdkMaps: Map<string, SDKMap> = new Map();

  constructor(
    private readonly printer: IEventPrinter,
    hotswapTime?: Date,
  ) {
    this.startTime = hotswapTime?.getTime() ?? Date.now();
  }

  public start() {
    this.active = true;
    this.scheduleNextTick();
    return this;
  }

  /**
   * Adds a CloudWatch log group to read log events from
   * Since we could be reading from multiple log groups in multiple
   * AWS accounts, we also  need to pass an SDK object for that account
   */
  public async addLogGroups(sdk: ISDK, logGroups: string[]) {
    const currentAccount = await sdk.currentAccount();
    if (this.sdkMaps.has(currentAccount.accountId)) {
      let existing = this.sdkMaps.get(currentAccount.accountId)!.resources;
      existing.push(...logGroups);
      this.sdkMaps.set(currentAccount.accountId, {
        sdk,
        resources: existing,
      });
    } else {
      this.sdkMaps.set(currentAccount.accountId, {
        sdk,
        resources: logGroups,
      });
    }
  }

  public async stop() {
    this.active = false;
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
    }
  }

  private scheduleNextTick() {
    if (!this.active) {
      return;
    }
    this.tickTimer = setTimeout(() => void (this.tick()), this.printer.updateSleep);
  }

  private async tick() {
    if (!this.active) {
      return;
    }
    try {
      this.readPromise = this.readNewEvents();
      await this.readPromise;
      this.readPromise = undefined;

      if (!this.active) { return; }

    } catch (e) {
      error('Error occurred while monitoring logs: %s', e);
    }
    this.scheduleNextTick();

  }

  /**
   * Reads all new log events from a set of CloudWatch Log Groups
   * in parallel
   */
  private async readNewEvents(): Promise<void[]> {
    const promises: Array<Promise<void>> = [];
    for (const value of this.sdkMaps.values()) {
      const logs = value.sdk.cloudwatchLogs();

      promises.push(...value.resources.map(resource => {
        return this.readEventsFromLogGroup(resource, logs);
      }));
    }
    return Promise.all(promises);
  }

  /**
   * Reads all new log events from a CloudWatch Log Group
   * starting when the hotswap was triggered
   *
   * Only prints out events that have not been printed already
   */
  private async readEventsFromLogGroup(logGroupName: string, logsSDK: CloudWatchLogs): Promise<void> {
    try {
      let finished = false;
      let nextToken: string | undefined;
      while (!finished) {
        const response = await logsSDK.filterLogEvents({
          logGroupName: logGroupName,
          nextToken,
          startTime: this.startTime,
        }).promise();
        const eventPage = response.events ?? [];


        for (const event of eventPage) {
          if (event.eventId && this.activity.has(event.eventId)) {
          } else {
            if (event.eventId) this.activity.set(event.eventId, true);
            if (event.message) {
              const ingestionTime: Date = event.ingestionTime ?
                new Date(event.ingestionTime) : new Date();
              this.printer.print({
                message: event.message,
                logGroup: logGroupName,
                logStream: event.logStreamName,
                ingestionTime,
              });
            }

          }
        }

        nextToken = response.nextToken;
        if (nextToken === undefined) {
          finished = true;
        }
      }
    } catch (e) {
      // with Lambda functions the CloudWatch is not created
      // until something is logged, so just keep polling until
      // there is somthing to find
      if (e.code === 'ResourceNotFoundException') {
        return;
      }
      throw e;
    }
  }

}

interface PrinterProps {
  /**
   * Stream to write to
   */
  readonly stream: NodeJS.WriteStream;
}

export interface IEventPrinter {
  readonly updateSleep: number;

  print(event: CloudWatchLogEvent): void;
}

abstract class EventPrinterBase {
  public readonly updateSleep: number = 5_000;
  protected readonly stream: NodeJS.WriteStream;

  constructor(protected readonly props: PrinterProps) {
    this.stream = props.stream;
  }

  public abstract print(event: CloudWatchLogEvent): void;
}

export class EventPrinter extends EventPrinterBase {
  constructor(props: PrinterProps) {
    super(props);
  }

  public print(event: CloudWatchLogEvent): void {
    this.stream.write(
      util.format(
        '%s %s %s %s',
        colors.blue(event.logGroup),
        (event.logStream ? colors.blue(event.logStream) : ''),
        colors.yellow(event.ingestionTime.toLocaleTimeString()),
        event.message,
      ),
    );
  }
}
