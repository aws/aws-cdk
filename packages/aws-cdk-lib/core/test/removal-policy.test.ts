import { toCloudFormation } from './util';
import { CfnResource, Stack, RemovalPolicy } from '../lib';

describe('removal policy', () => {
  const removalPolicies = [
    RemovalPolicy.RETAIN,
    RemovalPolicy.DESTROY,
    RemovalPolicy.SNAPSHOT,
    RemovalPolicy.RETAIN_EXCEPT_ON_CREATE,
  ];
  removalPolicies.forEach((policy) => {
    test(`should handle RemovalPolicy.${policy}`, () => {
      const stack = new Stack();

      new CfnResource(stack, 'Resource', {
        type: 'MOCK',
        properties: {
          RemovalPolicy: policy,
        },
      });

      expect(toCloudFormation(stack)).toEqual({
        Resources: {
          Resource: {
            Type: 'MOCK',
            Properties: { RemovalPolicy: policy.valueOf() },
          },
        },
      });
    });
  });
});
