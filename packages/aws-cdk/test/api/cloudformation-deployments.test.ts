jest.mock('../../lib/api/deploy-stack');
jest.mock('../../lib/api/toolkit-info');

import { CloudFormationDeployments } from '../../lib/api/cloudformation-deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { testStack } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  deployments = new CloudFormationDeployments({ sdkProvider });
});

test('placeholders are substituted in CloudFormation execution role', async () => {
  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        cloudFormationExecutionRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(deployStack).toHaveBeenCalledWith(expect.objectContaining({
    roleArn: 'bloop:here:12345'
  }));
});

test('role with placeholders is assumed if assumerole is given', async () => {
  const mockWithAssumedRole = jest.fn();
  sdkProvider.withAssumedRole = mockWithAssumedRole;

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(mockWithAssumedRole).toHaveBeenCalledWith('bloop:here:12345', undefined, expect.anything());
});