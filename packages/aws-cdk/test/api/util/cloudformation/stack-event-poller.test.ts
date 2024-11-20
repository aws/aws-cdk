import { CloudFormationClient, DescribeStackEventsCommandInput, StackEvent } from '@aws-sdk/client-cloudformation';
import { SDK } from '../../../../lib';
import { StackEventPoller } from '../../../../lib/api/util/cloudformation/stack-event-poller';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('poll', () => {

  test('does not poll unnecessary pages', async () => {

    const now = Date.now();

    const pastEvent: StackEvent = {
      Timestamp: new Date(now - 1000),
      EventId: 'event-1',
      StackId: 'stack-id',
      StackName: 'stack',
    };

    const sdk = new SDK({ accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey' }, 'region', {});

    jest.spyOn(CloudFormationClient.prototype, 'send').mockImplementation((command) => {
      const input: DescribeStackEventsCommandInput = command.input as DescribeStackEventsCommandInput;

      // the first event we return should stop the polling. we therefore
      // do not expect a second page to be polled.
      expect(input.NextToken).toBe(undefined);

      return {
        StackEvents: [pastEvent],
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
