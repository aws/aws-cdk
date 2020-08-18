import { StackActivityMonitor, IActivityPrinter, StackActivity } from '../../lib/api/util/cloudformation/stack-activity-monitor';
import { sleep } from '../integ/cli/aws-helpers';
import { MockSdk } from './mock-sdk';

let sdk: MockSdk;
let printer: FakePrinter;
beforeEach(() => {
  sdk = new MockSdk();
  printer = new FakePrinter();
});

test('retain page token between ticks', async () => {
  let finished = false;
  sdk.stubCloudFormation({
    describeStackEvents: (jest.fn() as jest.Mock<AWS.CloudFormation.DescribeStackEventsOutput, [AWS.CloudFormation.DescribeStackEventsInput]>)
      // First call, return a page token
      .mockImplementationOnce((request) => {
        expect(request.NextToken).toBeUndefined();
        return { NextToken: 'token' };
      })
      // Second call, expect page token, return no page
      .mockImplementationOnce(request => {
        expect(request.NextToken).toEqual('token');
        return { };
      })
      // Third call, ensure we still get the same page token
      .mockImplementationOnce(request => {
        expect(request.NextToken).toEqual('token');
        finished = true;
        return { };
      }),
  });

  const monitor = new StackActivityMonitor(sdk.cloudFormation(), 'StackName', printer).start();
  await waitForCondition(() => finished);
  await monitor.stop();
});


class FakePrinter implements IActivityPrinter {
  public updateSleep: number = 0;
  public readonly activities: StackActivity[] = [];

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