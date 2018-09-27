import cxapi = require('@aws-cdk/cx-api');
import aws = require('aws-sdk');
import colors = require('colors/safe');
import util = require('util');

interface StackActivity {
  readonly event: aws.CloudFormation.StackEvent;
  flushed: boolean;
}

export class StackActivityMonitor {
  private active = false;
  private activity: { [eventId: string]: StackActivity } = { };

  /**
   * Number of ms to wait between pings
   */
  private readonly tickSleep = 5000;

  /**
   * Number of ms to wait between pagination calls
   */
  private readonly pageSleep = 500;

  /**
   * Number of ms of change absence before we tell the user about the resources that are currently in progress.
   */
  private readonly inProgressDelay = 30_000;

  /**
   * Determines which events not to display
   */
  private startTime = Date.now();

  /**
   * Current tick timer
   */
  private tickTimer?: NodeJS.Timer;

  /**
   * A list of resource IDs which are currently being processed
   */
  private resourcesInProgress = new Set<string>();

  /**
   * Count of resources that have reported a _COMPLETE status
   */
  private resourcesDone: number = 0;

  /**
   * How many digits we need to represent the total count (for lining up the status reporting)
   */
  private resourceDigits: number = 0;

  /**
   * Last time we printed something to the console.
   *
   * Used to measure timeout for progress reporting.
   */
  private lastPrintTime = Date.now();

  constructor(private readonly cfn: aws.CloudFormation,
              private readonly stackName: string,
              private readonly metadata?: cxapi.StackMetadata,
              private readonly resourcesTotal?: number) {

    if (this.resourcesTotal != null) {
      // +1 because the stack also emits a "COMPLETE" event at the end, and that wasn't
      // counted yet. This makes it line up with the amount of events we expect.
      this.resourcesTotal++;

      // How many digits does this number take to represent?
      this.resourceDigits = Math.ceil(Math.log10(this.resourcesTotal));
    }
  }

  public start() {
    this.active = true;
    this.scheduleNextTick();
    return this;
  }

  public stop() {
    this.active = false;
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
    }
  }

  private scheduleNextTick() {
    if (!this.active) {
      return;
    }
    this.tickTimer = setTimeout(() => this.tick().then(), this.tickSleep);
  }

  private async tick() {
    if (!this.active) {
      return;
    }

    await this.readEvents();
    this.flushEvents();
    this.scheduleNextTick();
  }

  /**
   * Flushes all unflushed events sorted by timestamp.
   */
  private flushEvents() {
    Object.keys(this.activity)
      .map(a => this.activity[a])
      .filter(a => a.event.Timestamp.valueOf() > this.startTime)
      .filter(a => !a.flushed)
      .sort((lhs, rhs) => lhs.event.Timestamp.valueOf() - rhs.event.Timestamp.valueOf())
      .forEach(a => this.flushActivity(a));

    this.printInProgress();
  }

  private flushActivity(activity: StackActivity) {
    this.rememberActivity(activity);
    this.printActivity(activity);
    activity.flushed = true;
  }

  private rememberActivity(activity: StackActivity) {
    const status = activity.event.ResourceStatus;
    if (!status || !activity.event.LogicalResourceId) { return; }

    if (status.endsWith('_IN_PROGRESS')) {
      this.resourcesInProgress.add(activity.event.LogicalResourceId);
    }

    if (status.endsWith('_COMPLETE') || status.endsWith('_FAILED')) {
      this.resourcesInProgress.delete(activity.event.LogicalResourceId);
      this.resourcesDone++;
    }
  }

  private printActivity(activity: StackActivity) {
    const e = activity.event;
    const color = this.colorFromStatus(e.ResourceStatus);
    const md = this.findMetadataFor(e.LogicalResourceId);

    let suffix = '';
    if (md && e.ResourceStatus && e.ResourceStatus.indexOf('FAILED') !== -1) {
      suffix = `\n${md.entry.data} was created at: ${md.path}\n\t${md.entry.trace.join('\n\t\\_ ')}`;
    }

    process.stderr.write(util.format(color(`%s %s  %s  [%s] %s %s%s\n`),
          this.progress(),
          e.Timestamp,
          padRight(18, "" + e.ResourceStatus),
          e.ResourceType,
          e.LogicalResourceId,
          e.ResourceStatusReason ? e.ResourceStatusReason : '',
          suffix));

    this.lastPrintTime = Date.now();
  }

  /**
   * Report the current progress as a [34/42] string, or just [34] if the total is unknown
   */
  private progress(): string {
    if (this.resourcesTotal == null) {
      // Don't have total, show simple count and hope the human knows
      return util.format('[%s]', this.resourcesDone);
    }

    return util.format('[%s/%s]',
        padLeft(this.resourceDigits, this.resourcesDone.toString()),
        padLeft(this.resourceDigits, this.resourcesTotal != null ? this.resourcesTotal.toString() : '?'));
  }

  /**
   * If some resources are taking a while to create, notify the user about what's currently in progress
   */
  private printInProgress() {
    if (Date.now() < this.lastPrintTime + this.inProgressDelay) {
      return;
    }

    process.stderr.write(util.format(colors.blue('%s Currently in progress: %s\n'),
      this.progress(),
      Array.from(this.resourcesInProgress).join(', ')));

    // We cheat a bit here. To prevent printInProgress() from repeatedly triggering,
    // we set the timestamp into the future. It will be reset whenever a regular print
    // occurs, after which we can be triggered again.
    this.lastPrintTime = +Infinity;
  }

  private findMetadataFor(logicalId: string | undefined): { entry: cxapi.MetadataEntry, path: string } | undefined {
    if (!logicalId || !this.metadata) { return undefined; }
    for (const path of Object.keys(this.metadata)) {
      const entry = this.metadata[path].filter(e => e.type === 'aws:cdk:logicalId')
                      .find(e => e.data === logicalId);
      if (entry) { return { entry, path }; }
    }
    return undefined;
  }

  private colorFromStatus(status?: string) {
    if (!status) {
      return colors.reset;
    }

    if (status.indexOf('FAILED') !== -1) {
      return colors.red;
    }
    if (status.indexOf('ROLLBACK') !== -1) {
      return colors.yellow;
    }
    if (status.indexOf('COMPLETE') !== -1) {
      return colors.green;
    }

    return colors.reset;
  }

  private async readEvents(nextToken?: string) {
    const output = await this.cfn.describeStackEvents({ StackName: this.stackName, NextToken: nextToken }).promise()
      .catch( e => {
        if (e.code === 'ValidationError' && e.message === `Stack [${this.stackName}] does not exist`) {
          return undefined;
        }
        throw e;
      });

    let events = output && output.StackEvents || [ ];
    let allNew = true;

    // merge events into the activity and dedup by event id
    for (const e of events) {
      if (e.EventId in this.activity) {
        allNew = false;
        break;
      }

      this.activity[e.EventId] = { flushed: false, event: e };
    }

    // only read next page if all the events we read are new events. otherwise, we can rest.
    if (allNew && output && output.NextToken) {
      await new Promise(cb => setTimeout(cb, this.pageSleep));
      events = events.concat(await this.readEvents(output.NextToken));
    }

    return events;
  }
}

function padRight(n: number, x: string): string {
  return x + ' '.repeat(Math.max(0, n - x.length));
}

/**
 * Infamous padLeft()
 */
function padLeft(n: number, x: string): string {
  return ' '.repeat(Math.max(0, n - x.length)) + x;
}
