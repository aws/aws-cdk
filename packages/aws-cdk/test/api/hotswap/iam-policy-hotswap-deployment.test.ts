/* eslint-disable import/order */
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('A change to an IAM Policy results in a full deployment for HOTSWAP and a noOp for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        RoleOne: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'sqs.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
          },
        },
        RoleDefaultPolicy: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: [
                    'sqs:ChangeMessageVisibility',
                    'sqs:DeleteMessage',
                    'sqs:GetQueueAttributes',
                    'sqs:GetQueueUrl',
                    'sqs:ReceiveMessage',
                  ],
                  Effect: 'Allow',
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
            PolicyName: 'roleDefaultPolicy',
            Roles: [
              {
                Ref: 'RoleOne',
              },
            ],
          },
        },
      },
    });
    setup.pushStackResourceSummaries({
      LogicalResourceId: 'RoleOne',
      PhysicalResourceId: 'RoleOne',
      ResourceType: 'AWS::IAM::Role',
      ResourceStatus: 'CREATE_COMPLETE',
      LastUpdatedTimestamp: new Date(),
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          RoleOne: {
            Type: 'AWS::IAM::Role',
            Properties: {
              AssumeRolePolicyDocument: {
                Statement: [
                  {
                    Action: 'sts:AssumeRole',
                    Effect: 'Allow',
                    Principal: {
                      Service: 'sqs.amazonaws.com',
                    },
                  },
                ],
                Version: '2012-10-17',
              },
            },
          },
          RoleDefaultPolicy: {
            Type: 'AWS::IAM::Policy',
            Properties: {
              PolicyDocument: {
                Statement: [
                  {
                    Action: [
                      'sqs:DeleteMessage',
                    ],
                    Effect: 'Allow',
                    Resource: '*',
                  },
                ],
                Version: '2012-10-17',
              },
              PolicyName: 'roleDefaultPolicy',
              Roles: [
                {
                  Ref: 'RoleOne',
                },
              ],
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
    }
  });
});
