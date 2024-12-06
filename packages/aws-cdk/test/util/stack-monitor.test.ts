import {
  DescribeStackEventsCommand,
  ResourceStatus,
  type StackEvent,
  StackStatus,
} from '@aws-sdk/client-cloudformation';
import { MockSdk, mockCloudFormationClient, restoreSdkMocksToDefault } from './mock-sdk';
import {
  StackActivityMonitor,
  type IActivityPrinter,
  type StackActivity,
} from '../../lib/api/util/cloudformation/stack-activity-monitor';

let sdk: MockSdk;
let printer: FakePrinter;
let monitor: StackActivityMonitor;
beforeEach(() => {
  sdk = new MockSdk();

  printer = new FakePrinter();
  monitor = new StackActivityMonitor(sdk.cloudFormation(), 'StackName', printer, undefined, new Date(T100)).start();

  restoreSdkMocksToDefault();
});

describe('stack monitor event ordering and pagination', () => {
  test('continue to the next page if it exists', async () => {
    mockCloudFormationClient.on(DescribeStackEventsCommand).resolvesOnce({
      StackEvents: [event(102), event(101)],
    });

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();

    // Printer sees them in chronological order
    expect(printer.eventIds).toEqual(['101', '102']);
  });

  test('do not page further if we already saw the last event', async () => {
    mockCloudFormationClient
      .on(DescribeStackEventsCommand)
      .resolvesOnce({
        StackEvents: [event(101)],
      })
      .resolvesOnce({
        StackEvents: [event(102), event(101)],
      })
      .resolvesOnce({});

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();

    // Seen in chronological order
    expect(printer.eventIds).toEqual(['101', '102']);
  });

  test('do not page further if the last event is too old', async () => {
    mockCloudFormationClient
      .on(DescribeStackEventsCommand)
      .resolvesOnce({
        StackEvents: [event(101), event(95)],
      })
      .resolvesOnce({
        StackEvents: [],
      });

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();

    // Seen only the new one
    expect(printer.eventIds).toEqual(['101']);
  });

  test('do a final request after the monitor is stopped', async () => {
    mockCloudFormationClient.on(DescribeStackEventsCommand).resolves({
      StackEvents: [event(101)],
    });
    // Establish that we've received events prior to stop and then reset the mock
    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    mockCloudFormationClient.resetHistory();
    await monitor.stop();
    mockCloudFormationClient.on(DescribeStackEventsCommand).resolves({
      StackEvents: [event(102), event(101)],
    });
    // Since we can't reset the mock to a new value before calling stop, we'll have to check
    // and make sure it's called again instead.
    expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand);
  });
});

describe('stack monitor, collecting errors from events', () => {
  test('return errors from the root stack', async () => {
    mockCloudFormationClient.on(DescribeStackEventsCommand).resolvesOnce({
      StackEvents: [addErrorToStackEvent(event(100))],
    });

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();
    expect(monitor.errors).toStrictEqual(['Test Error']);
  });

  test('return errors from the nested stack', async () => {
    mockCloudFormationClient
      .on(DescribeStackEventsCommand)
      .resolvesOnce({
        StackEvents: [
          addErrorToStackEvent(event(102), {
            logicalResourceId: 'nestedStackLogicalResourceId',
            physicalResourceId: 'nestedStackPhysicalResourceId',
            resourceType: 'AWS::CloudFormation::Stack',
            resourceStatusReason: 'nested stack failed',
            resourceStatus: ResourceStatus.UPDATE_FAILED,
          }),
          addErrorToStackEvent(event(100), {
            logicalResourceId: 'nestedStackLogicalResourceId',
            physicalResourceId: 'nestedStackPhysicalResourceId',
            resourceType: 'AWS::CloudFormation::Stack',
            resourceStatus: ResourceStatus.UPDATE_IN_PROGRESS,
          }),
        ],
      })
      .resolvesOnce({
        StackEvents: [
          addErrorToStackEvent(event(101), {
            logicalResourceId: 'nestedResource',
            resourceType: 'Some::Nested::Resource',
            resourceStatusReason: 'actual failure error message',
          }),
        ],
      });

    await eventually(
      () =>
        expect(mockCloudFormationClient).toHaveReceivedNthCommandWith(1, DescribeStackEventsCommand, {
          StackName: 'StackName',
        }),
      2,
    );

    await eventually(
      () =>
        expect(mockCloudFormationClient).toHaveReceivedNthCommandWith(2, DescribeStackEventsCommand, {
          StackName: 'nestedStackPhysicalResourceId',
        }),
      2,
    );
    await monitor.stop();
    expect(monitor.errors).toStrictEqual(['actual failure error message', 'nested stack failed']);
  });

  test('does not consider events without physical resource id for monitoring nested stacks', async () => {
    mockCloudFormationClient
      .on(DescribeStackEventsCommand)
      .resolvesOnce({
        StackEvents: [
          addErrorToStackEvent(event(100), {
            logicalResourceId: 'nestedStackLogicalResourceId',
            physicalResourceId: '',
            resourceType: 'AWS::CloudFormation::Stack',
            resourceStatusReason: 'nested stack failed',
          }),
        ],
        NextToken: 'nextToken',
      })
      .resolvesOnce({
        StackEvents: [
          addErrorToStackEvent(event(101), {
            logicalResourceId: 'OtherResource',
            resourceType: 'Some::Other::Resource',
            resourceStatusReason: 'some failure',
          }),
        ],
      });

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();

    expect(monitor.errors).toStrictEqual(['nested stack failed', 'some failure']);
    expect(mockCloudFormationClient).toHaveReceivedNthCommandWith(1, DescribeStackEventsCommand, {
      StackName: 'StackName',
    });
    // Note that the second call happened for the top level stack instead of a nested stack
    expect(mockCloudFormationClient).toHaveReceivedNthCommandWith(2, DescribeStackEventsCommand, {
      StackName: 'StackName',
    });
  });

  test('does not check for nested stacks that have already completed successfully', async () => {
    mockCloudFormationClient.on(DescribeStackEventsCommand).resolvesOnce({
      StackEvents: [
        addErrorToStackEvent(event(100), {
          logicalResourceId: 'nestedStackLogicalResourceId',
          physicalResourceId: 'nestedStackPhysicalResourceId',
          resourceType: 'AWS::CloudFormation::Stack',
          resourceStatusReason: 'nested stack status reason',
          resourceStatus: StackStatus.CREATE_COMPLETE,
        }),
      ],
    });

    await eventually(() => expect(mockCloudFormationClient).toHaveReceivedCommand(DescribeStackEventsCommand), 2);
    await monitor.stop();

    expect(monitor.errors).toStrictEqual([]);
  });
});

const T0 = 1597837230504;

// Events 0-99 are before we started paying attention
const T100 = T0 + 100 * 1000;

function event(nr: number): StackEvent {
  return {
    EventId: `${nr}`,
    StackId: 'StackId',
    StackName: 'StackName',
    Timestamp: new Date(T0 + nr * 1000),
  };
}

function addErrorToStackEvent(
  eventToUpdate: StackEvent,
  props: {
    resourceStatus?: ResourceStatus;
    resourceType?: string;
    resourceStatusReason?: string;
    logicalResourceId?: string;
    physicalResourceId?: string;
  } = {},
): StackEvent {
  eventToUpdate.ResourceStatus = props.resourceStatus ?? ResourceStatus.UPDATE_FAILED;
  eventToUpdate.ResourceType = props.resourceType ?? 'Test::Resource::Type';
  eventToUpdate.ResourceStatusReason = props.resourceStatusReason ?? 'Test Error';
  eventToUpdate.LogicalResourceId = props.logicalResourceId ?? 'testLogicalId';
  eventToUpdate.PhysicalResourceId = props.physicalResourceId ?? 'testPhysicalResourceId';
  return eventToUpdate;
}

class FakePrinter implements IActivityPrinter {
  public updateSleep: number = 0;
  public readonly activities: StackActivity[] = [];

  public get eventIds() {
    return this.activities.map((a) => a.event.EventId);
  }

  public addActivity(activity: StackActivity): void {
    this.activities.push(activity);
  }

  public print(): void {}
  public start(): void {}
  public stop(): void {}
}

const wait = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 5));

// Using the eventually function to ensure these functions have had sufficient time to execute.
const eventually = async (call: () => void, attempts: number): Promise<void> => {
  while (attempts-- >= 0) {
    try {
      return call();
    } catch (err) {
      if (attempts <= 0) throw err;
    }
    await wait();
  }

  throw new Error('An unexpected error has occurred.');
};
