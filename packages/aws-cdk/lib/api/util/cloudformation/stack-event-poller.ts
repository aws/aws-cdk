import * as aws from 'aws-sdk';

export interface StackEventPollerProps {
  /**
   * The stack to poll
   */
  readonly stackName: string;

  /**
   * IDs of parent stacks of this resource, in case of resources in nested stacks
   */
  readonly parentStackLogicalIds?: string[];

  /**
   * Timestamp for the oldest event we're interested in
   *
   * @default - Read all events
   */
  readonly startTime?: number;

  /**
   * Stop reading when we see the stack entering this status
   *
   * Should be something like `CREATE_IN_PROGRESS`, `UPDATE_IN_PROGRESS`,
   * `DELETE_IN_PROGRESS, `ROLLBACK_IN_PROGRESS`.
   *
   * @default - Read all events
   */
  readonly stackStatuses?: string[];
}

export interface ResourceEvent {
  readonly event: aws.CloudFormation.StackEvent;
  readonly parentStackLogicalIds: string[];

  /**
   * Whether this event regards the root stack
   *
   * @default false
   */
  readonly isStackEvent?: boolean;
}

export class StackEventPoller {
  public readonly events: ResourceEvent[] = [];
  public complete: boolean = false;

  private readonly eventIds = new Set<string>();
  private readonly nestedStackPollers: Record<string, StackEventPoller> = {};

  constructor(private readonly cfn: aws.CloudFormation, private readonly props: StackEventPollerProps) {
  }

  /**
   * From all accumulated events, return only the errors
   */
  public get resourceErrors(): ResourceEvent[] {
    return this.events.filter(e => e.event.ResourceStatus?.endsWith('_FAILED') && !e.isStackEvent);
  }

  /**
   * Poll for new stack events
   *
   * Will not return events older than events indicated by the constructor filters.
   *
   * Recurses into nested stacks, and returns events old-to-new.
   */
  public async poll(): Promise<ResourceEvent[]> {
    const events: ResourceEvent[] = [];
    try {
      let nextToken: string | undefined;
      let finished = false;
      while (!finished) {
        const response = await this.cfn.describeStackEvents({ StackName: this.props.stackName, NextToken: nextToken }).promise();
        const eventPage = response?.StackEvents ?? [];

        for (const event of eventPage) {
          // Event from before we were interested in 'em
          if (this.props.startTime !== undefined && event.Timestamp.valueOf() < this.props.startTime) {
            finished = true;
            break;
          }

          // Already seen this one
          if (this.eventIds.has(event.EventId)) {
            finished = true;
            break;
          }
          this.eventIds.add(event.EventId);

          // The events for the stack itself are also included next to events about resources; we can test for them in this way.
          const isParentStackEvent = event.PhysicalResourceId === event.StackId;

          if (isParentStackEvent && this.props.stackStatuses?.includes(event.ResourceStatus ?? '')) {
            finished = true;
            break;
          }

          // Fresh event
          const resEvent: ResourceEvent = {
            event: event,
            parentStackLogicalIds: this.props.parentStackLogicalIds ?? [],
            isStackEvent: isParentStackEvent,
          };
          events.push(resEvent);

          if (!isParentStackEvent && event.ResourceType === 'AWS::CloudFormation::Stack' && isStackBeginOperationState(event.ResourceStatus)) {
            // If the event is not for `this` stack and has a physical resource Id, recursively call for events in the nested stack
            this.trackNestedStack(event, [...this.props.parentStackLogicalIds ?? [], event.LogicalResourceId ?? '']);
          }

          if (isParentStackEvent && isStackTerminalState(event.ResourceStatus)) {
            this.complete = true;
          }
        }

        // We're also done if there's nothing left to read
        nextToken = response?.NextToken;
        if (nextToken === undefined) {
          finished = true;
        }
      }
    } catch (e: any) {
      if (e.code === 'ValidationError' && e.message === `Stack [${this.props.stackName}] does not exist`) {
        // Ignore
      } else {
        throw e;
      }
    }

    // Also poll all nested stacks we're currently tracking
    for (const [logicalId, poller] of Object.entries(this.nestedStackPollers)) {
      events.push(...await poller.poll());
      if (poller.complete) {
        delete this.nestedStackPollers[logicalId];
      }
    }

    // Return what we have so far
    events.sort((a, b) => a.event.Timestamp.valueOf() - b.event.Timestamp.valueOf());
    this.events.push(...events);
    return events;
  }

  /**
   * On the CREATE_IN_PROGRESS, UPDATE_IN_PROGRESS, DELETE_IN_PROGRESS event of a nested stack, poll the nested stack updates
   */
  private trackNestedStack(event: aws.CloudFormation.StackEvent, parentStackLogicalIds: string[]) {
    const logicalId = event.LogicalResourceId ?? '';
    if (!this.nestedStackPollers[logicalId]) {
      this.nestedStackPollers[logicalId] = new StackEventPoller(this.cfn, {
        stackName: event.PhysicalResourceId ?? '',
        parentStackLogicalIds: parentStackLogicalIds,
        startTime: event.Timestamp.valueOf(),
      });
    }
  }
}

function isStackBeginOperationState(state: string | undefined) {
  return [
    'CREATE_IN_PROGRESS',
    'UPDATE_IN_PROGRESS',
    'DELETE_IN_PROGRESS',
    'UPDATE_ROLLBACK_IN_PROGRESS',
    'ROLLBACK_IN_PROGRESS',
  ].includes(state ?? '');
}

function isStackTerminalState(state: string | undefined) {
  return !(state ?? '').endsWith('_IN_PROGRESS');
}