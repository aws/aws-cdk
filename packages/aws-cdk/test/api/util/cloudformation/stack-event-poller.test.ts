import { DescribeStackEventsCommand, DescribeStackEventsCommandInput, StackEvent } from '@aws-sdk/client-cloudformation';
import { StackEventPoller } from '../../../../lib/api/util/cloudformation/stack-event-poller';
import { MockSdk, mockCloudFormationClient } from '../../../util/mock-sdk';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('poll', () => {

  test('polls all necessary pages', async () => {

    const deployTime = Date.now();

    const postDeployEvent1: StackEvent = {
      Timestamp: new Date(deployTime + 1000),
      EventId: 'event-1',
      StackId: 'stack-id',
      StackName: 'stack',
    };

    const postDeployEvent2: StackEvent = {
      Timestamp: new Date(deployTime + 2000),
      EventId: 'event-2',
      StackId: 'stack-id',
      StackName: 'stack',
    };

    const sdk = new MockSdk();
    mockCloudFormationClient.on(DescribeStackEventsCommand).callsFake((input: DescribeStackEventsCommandInput) => {
      const result = {
        StackEvents: input.NextToken === 'token' ? [postDeployEvent2] : [postDeployEvent1],
        NextToken: input.NextToken === 'token' ? undefined : 'token', // simulate a two page event stream.
      };

      return result;
    });

    const poller = new StackEventPoller(sdk.cloudFormation(), {
      stackName: 'stack',
      startTime: new Date().getTime(),
    });

    const events = await poller.poll();
    expect(events.length).toEqual(2);

  });

  test('does not poll unnecessary pages', async () => {

    const deployTime = Date.now();

    const preDeployTimeEvent: StackEvent = {
      Timestamp: new Date(deployTime - 1000),
      EventId: 'event-1',
      StackId: 'stack-id',
      StackName: 'stack',
    };

    const sdk = new MockSdk();
    mockCloudFormationClient.on(DescribeStackEventsCommand).callsFake((input: DescribeStackEventsCommandInput) => {

      // the first event we return should stop the polling. we therefore
      // do not expect a second page to be polled.
      expect(input.NextToken).toBe(undefined);

      return {
        StackEvents: [preDeployTimeEvent],
        NextToken: input.NextToken === 'token' ? undefined : 'token', // simulate a two page event stream.
      };

    });

    const poller = new StackEventPoller(sdk.cloudFormation(), {
      stackName: 'stack',
      startTime: new Date().getTime(),
    });

    await poller.poll();

  });

});
