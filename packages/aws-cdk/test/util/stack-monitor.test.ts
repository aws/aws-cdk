/* eslint-disable import/order */
import { MockSdk } from './mock-sdk';
import { StackActivityMonitor, IActivityPrinter, StackActivity } from '../../lib/api/util/cloudformation/stack-activity-monitor';
import { sleep } from '../util';

let sdk: MockSdk;
let printer: FakePrinter;
beforeEach(() => {
  sdk = new MockSdk();
  printer = new FakePrinter();
});

describe('stack monitor event ordering and pagination', () => {
  test('continue to the next page if it exists', async () => {
    await testMonitorWithEventCalls([
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(102)],
          NextToken: 'some-token',
        };
      },
      (request) => {
        expect(request.NextToken).toBe('some-token');
        return {
          StackEvents: [event(101)],
        };
      },
    ]);

    // Printer sees them in chronological order
    expect(printer.eventIds).toEqual(['101', '102']);
  });

  test('do not page further if we already saw the last event', async () => {
    await testMonitorWithEventCalls([
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(101)],
        };
      },
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(102), event(101)],
          NextToken: 'some-token',
        };
      },
      (request) => {
        // Did not use the token
        expect(request.NextToken).toBeUndefined();
        return {};
      },
    ]);

    // Seen in chronological order
    expect(printer.eventIds).toEqual(['101', '102']);
  });

  test('do not page further if the last event is too old', async () => {
    await testMonitorWithEventCalls([
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(101), event(95)],
          NextToken: 'some-token',
        };
      },
      (request) => {
        // Start again from the top
        expect(request.NextToken).toBeUndefined();
        return {};
      },
    ]);

    // Seen only the new one
    expect(printer.eventIds).toEqual(['101']);
  });

  test('do a final request after the monitor is stopped', async () => {
    await testMonitorWithEventCalls([
      // Before stop
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(101)],
        };
      },
    ],
    // After stop
    [
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [event(102), event(101)],
        };
      },
    ]);

    // Seen both
    expect(printer.eventIds).toEqual(['101', '102']);
  });
});

describe('stack monitor, collecting errors from events', () => {
  test('return errors from the root stack', async () => {
    const monitor = await testMonitorWithEventCalls([
      (request) => {
        expect(request.NextToken).toBeUndefined();
        return {
          StackEvents: [addErrorToStackEvent(event(100))],
        };
      },
    ]);

    expect(monitor.errors).toStrictEqual(['Test Error']);
  });

  test('return errors from the nested stack', async () => {
    const monitor = await testMonitorWithEventCalls([
      (request) => {
        expect(request.StackName).toStrictEqual('StackName');
        return {
          StackEvents: [
            addErrorToStackEvent(
              event(100), {
                logicalResourceId: 'nestedStackLogicalResourceId',
                physicalResourceId: 'nestedStackPhysicalResourceId',
                resourceType: 'AWS::CloudFormation::Stack',
                resourceStatusReason: 'nested stack failed',
              },
            ),
          ],
        };
      },
      (request) => {
        expect(request.StackName).toStrictEqual('nestedStackPhysicalResourceId');
        return {
          StackEvents: [
            addErrorToStackEvent(
              event(101), {
                logicalResourceId: 'nestedResource',
                resourceType: 'Some::Nested::Resource',
                resourceStatusReason: 'actual failure error message',
              },
            ),
          ],
        };
      },
    ]);

    expect(monitor.errors).toStrictEqual(['actual failure error message', 'nested stack failed']);
  });

  test('does not consider events without physical resource id for monitoring nested stacks', async () => {
    const monitor = await testMonitorWithEventCalls([
      (request) => {
        expect(request.StackName).toStrictEqual('StackName');
        return {
          StackEvents: [
            addErrorToStackEvent(
              event(100), {
                logicalResourceId: 'nestedStackLogicalResourceId',
                physicalResourceId: '',
                resourceType: 'AWS::CloudFormation::Stack',
                resourceStatusReason: 'nested stack failed',
              },
            ),
          ],
        };
      },
      (request) => {
        // Note that the second call happened for the top level stack instead of a nested stack
        expect(request.StackName).toStrictEqual('StackName');
        return {
          StackEvents: [
            addErrorToStackEvent(
              event(101), {
                logicalResourceId: 'OtherResource',
                resourceType: 'Some::Other::Resource',
                resourceStatusReason: 'some failure',
              },
            ),
          ],
        };
      },
    ]);

    expect(monitor.errors).toStrictEqual(['nested stack failed', 'some failure']);
  });

  test('does not check for nested stacks that have already completed successfully', async () => {
    const monitor = await testMonitorWithEventCalls([
      (request) => {
        expect(request.StackName).toStrictEqual('StackName');
        return {
          StackEvents: [
            addErrorToStackEvent(
              event(100), {
                logicalResourceId: 'nestedStackLogicalResourceId',
                physicalResourceId: 'nestedStackPhysicalResourceId',
                resourceType: 'AWS::CloudFormation::Stack',
                resourceStatusReason: 'nested stack status reason',
                resourceStatus: 'CREATE_COMPLETE',
              },
            ),
          ],
        };
      },
    ]);

    expect(monitor.errors).toStrictEqual([]);
  });
});

const T0 = 1597837230504;

// Events 0-99 are before we started paying attention
const T100 = T0 + 100 * 1000;

function event(nr: number): AWS.CloudFormation.StackEvent {
  return {
    EventId: `${nr}`,
    StackId: 'StackId',
    StackName: 'StackName',
    Timestamp: new Date(T0 + nr * 1000),
  };
}

function addErrorToStackEvent(
  eventToUpdate: AWS.CloudFormation.StackEvent,
  props: {
    resourceStatus?: string;
    resourceType?: string;
    resourceStatusReason?: string;
    logicalResourceId?: string;
    physicalResourceId?: string;
  } = {},
): AWS.CloudFormation.StackEvent {
  eventToUpdate.ResourceStatus = props.resourceStatus ?? 'UPDATE_FAILED';
  eventToUpdate.ResourceType = props.resourceType ?? 'Test::Resource::Type';
  eventToUpdate.ResourceStatusReason = props.resourceStatusReason ?? 'Test Error';
  eventToUpdate.LogicalResourceId = props.logicalResourceId ?? 'testLogicalId';
  eventToUpdate.PhysicalResourceId = props.physicalResourceId ?? 'testPhysicalResourceId';
  return eventToUpdate;
}

async function testMonitorWithEventCalls(
  beforeStopInvocations: Array<(x: AWS.CloudFormation.DescribeStackEventsInput) => AWS.CloudFormation.DescribeStackEventsOutput>,
  afterStopInvocations: Array<(x: AWS.CloudFormation.DescribeStackEventsInput) => AWS.CloudFormation.DescribeStackEventsOutput> = [],
): Promise<StackActivityMonitor> {
  let describeStackEvents = (jest.fn() as jest.Mock<AWS.CloudFormation.DescribeStackEventsOutput, [AWS.CloudFormation.DescribeStackEventsInput]>);

  let finished = false;

  for (const invocation of beforeStopInvocations) {
    const invocation_ = invocation; // Capture loop variable in local because of closure semantics
    const isLast = invocation === beforeStopInvocations[beforeStopInvocations.length - 1];
    describeStackEvents = describeStackEvents.mockImplementationOnce(request => {
      const ret = invocation_(request);
      if (isLast) {
        finished = true;
      }
      return ret;
    });
  }
  for (const invocation of afterStopInvocations) {
    describeStackEvents = describeStackEvents.mockImplementationOnce(invocation);
  }
  describeStackEvents.mockImplementation(() => { return {}; });

  sdk.stubCloudFormation({ describeStackEvents });

  const monitor = new StackActivityMonitor(sdk.cloudFormation(), 'StackName', printer, undefined, new Date(T100)).start();
  await waitForCondition(() => finished);
  await monitor.stop();
  return monitor;
}

class FakePrinter implements IActivityPrinter {
  public updateSleep: number = 0;
  public readonly activities: StackActivity[] = [];

  public get eventIds() {
    return this.activities.map(a => a.event.EventId);
  }

  public addActivity(activity: StackActivity): void {
    this.activities.push(activity);
  }

  public print(): void { }
  public start(): void { }
  public stop(): void { }
}

async function waitForCondition(cb: () => boolean): Promise<void> {
  while (!cb()) {
    await sleep(10);
  }
}
