import 'aws-sdk-client-mock-jest';

import { ListStackResourcesCommand } from '@aws-sdk/client-cloudformation';
import { LazyListStackResources } from '../../lib/api/evaluate-cloudformation-template';
import { MockSdk, mockCloudFormationClient } from '../util/mock-sdk';

describe('Lazy ListStackResources', () => {
  test('correctly caches calls to the CloudFormation API', async () => {
    // GIVEN
    const mockSdk = new MockSdk();
    mockCloudFormationClient.on(ListStackResourcesCommand).resolves({
      StackResourceSummaries: [],
      NextToken: undefined,
    });
    const res = new LazyListStackResources(mockSdk, 'StackName');

    // WHEN
    void res.listStackResources();
    void res.listStackResources();
    void res.listStackResources();
    const result = await res.listStackResources();

    // THEN
    expect(result.length).toBe(0);
    expect(mockCloudFormationClient).toHaveReceivedCommandTimes(ListStackResourcesCommand, 1);
  });
});
