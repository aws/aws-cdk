jest.mock('../../lib/api/deploy-stack');

import { ToolkitResorcesInfoProps, ToolkitResourcesInfo } from '../../lib';
import { CloudFormationDeployments } from '../../lib/api/cloudformation-deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { testStack } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
let mockToolkitInfoLookup: jest.Mock;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  deployments = new CloudFormationDeployments({ sdkProvider });
  ToolkitResourcesInfo.lookup = mockToolkitInfoLookup = jest.fn();
});

function mockSuccessfulBootstrapStackLookup(props: Partial<ToolkitResorcesInfoProps>) {
  mockToolkitInfoLookup.mockResolvedValue(new ToolkitResourcesInfo(sdkProvider.sdk, {
    bucketDomainName: '',
    bucketName: '',
    version: 0,
    ...props,
  }));
}

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
    roleArn: 'bloop:here:123456789012',
  }));
});

test('role with placeholders is assumed if assumerole is given', async () => {
  const mockForEnvironment = jest.fn();
  sdkProvider.forEnvironment = mockForEnvironment;

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(mockForEnvironment).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
    assumeRoleArn: 'bloop:here:123456789012',
  }));
});

test('deployment fails if bootstrap stack is missing', async () => {
  await expect(deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
      },
    }),
  })).rejects.toThrow(/no bootstrap stack found/);
});

test('deployment fails if bootstrap stack is too old', async () => {
  mockSuccessfulBootstrapStackLookup({
    version: 5,
  });

  await expect(deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
      },
    }),
  })).rejects.toThrow(/requires bootstrap stack version '99', found '5'/);
});

test('if toolkit stack cannot be found but SSM parameter name is present deployment succeeds', async () => {
  // FIXME: Mocking a successful bootstrap stack lookup here should not be necessary.
  // This should fail and return a placeholder failure object.
  mockSuccessfulBootstrapStackLookup({
    version: 2,
  });

  let requestedParameterName: string;
  sdkProvider.stubSSM({
    getParameter(request) {
      requestedParameterName = request.Name;
      return {
        Parameter: {
          Value: '99',
        },
      };
    },
  });

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
        bootstrapStackVersionSsmParameter: '/some/parameter',
      },
    }),
  });

  expect(requestedParameterName!).toEqual('/some/parameter');
});
