jest.mock('../../lib/api/deploy-stack');

import { CloudFormationDeployments } from '../../lib/api/cloudformation-deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { ToolkitInfo } from '../../lib/api/toolkit-info';
import { testStack } from '../util';
import { mockBootstrapStack, MockSdkProvider } from '../util/mock-sdk';

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
let mockToolkitInfoLookup: jest.Mock;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  deployments = new CloudFormationDeployments({ sdkProvider });
  ToolkitInfo.lookup = mockToolkitInfoLookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo(sdkProvider.sdk));
});

function mockSuccessfulBootstrapStackLookup(props?: Record<string, any>) {
  const outputs = {
    BucketName: 'BUCKET_NAME',
    BucketDomainName: 'BUCKET_ENDPOINT',
    BootstrapVersion: '1',
    ...props,
  };

  const fakeStack = mockBootstrapStack(sdkProvider.sdk, {
    Outputs: Object.entries(outputs).map(([k, v]) => ({
      OutputKey: k,
      OutputValue: `${v}`,
    })),
  });

  mockToolkitInfoLookup.mockResolvedValue(ToolkitInfo.fromStack(fakeStack, sdkProvider.sdk));
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
  })).rejects.toThrow(/requires a bootstrap stack/);
});

test('deployment fails if bootstrap stack is too old', async () => {
  mockSuccessfulBootstrapStackLookup({
    BootstrapVersion: 5,
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
    BootstrapVersion: 2,
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
