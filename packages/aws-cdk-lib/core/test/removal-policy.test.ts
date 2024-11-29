import { toCloudFormation } from './util';
import { CfnResource, Stack, RemovalPolicy } from '../lib';

describe('removal policy', () => {
  test.each([
    [RemovalPolicy.RETAIN, 'Retain'],
    [RemovalPolicy.DESTROY, 'Delete'],
    [RemovalPolicy.SNAPSHOT, 'Snapshot'],
    [RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, 'RetainExceptOnCreate'],
  ])('should set correct DeletionPolicy for RemovalPolicy.%s', (removalPolicy: RemovalPolicy, deletionPolicy: string) => {
    const stack = new Stack();

    const resource = new CfnResource(stack, 'Resource', { type: 'MOCK' });
    resource.applyRemovalPolicy(removalPolicy);

    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        Resource: expect.objectContaining({
          Type: 'MOCK',
          DeletionPolicy: deletionPolicy,
        }),
      },
    });
  });

  test.each([
    [RemovalPolicy.RETAIN, 'Retain'],
    [RemovalPolicy.DESTROY, 'Delete'],
    [RemovalPolicy.SNAPSHOT, 'Snapshot'],
    [RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, 'Retain'],
  ])('should set correct UpdateReplacePolicy for RemovalPolicy.%s', (removalPolicy: RemovalPolicy, updateReplacePolicy: string) => {
    const stack = new Stack();

    const resource = new CfnResource(stack, 'Resource', { type: 'MOCK' });
    resource.applyRemovalPolicy(removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });

    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        Resource: expect.objectContaining({
          Type: 'MOCK',
          UpdateReplacePolicy: updateReplacePolicy,
        }),
      },
    });
  });
});
