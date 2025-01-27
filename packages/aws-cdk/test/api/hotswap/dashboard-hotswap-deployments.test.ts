import { CloudWatch } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockPutDashboard: (params: CloudWatch.Types.PutDashboardInput) => CloudWatch.Types.PutDashboardOutput;
let cfnMockProvider: setup.CfnMockProvider;

beforeEach(() => {
  cfnMockProvider = setup.setupHotswapTests();
  mockPutDashboard = jest.fn();
  cfnMockProvider.setPutDashboardMock(mockPutDashboard);
});

test('returns undefined when a new Dashboard is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::CloudWatch::Dashboard',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the putDashboard() API when it receives only a DashboardBody change', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Dashboard: {
        Type: 'AWS::CloudWatch::Dashboard',
        Properties: {
          DashboardBody: '{ "widgets": [] }',
          DashboardName: 'my-dashboard',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::CloudWatch::Dashboard',
          Properties: {
            DashboardBody: '{ "widgets": [{ "type": "text" }] }',
            DashboardName: 'my-dashboard',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockPutDashboard).toHaveBeenCalledWith({
    DashboardName: 'my-dashboard',
    DashboardBody: '{ "widgets": [{ "type": "text" }] }',
  });
});

test('does not call the putDashboard() API when a non-DashboardBody property is changed', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Dashboard: {
        Type: 'AWS::CloudWatch::Dashboard',
        Properties: {
          DashboardBody: '{ "widgets": [] }',
          Tags: [
            { Key: 'Environment', Value: 'Dev' },
          ],
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::CloudWatch::Dashboard',
          Properties: {
            DashboardBody: '{ "widgets": [] }',
            Tags: [
              { Key: 'Environment', Value: 'Prod' },
            ],
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockPutDashboard).not.toHaveBeenCalled();
});

test('does not call the putDashboard() API when the resource is not an AWS::CloudWatch::Dashboard', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Dashboard: {
        Type: 'AWS::NotCloudWatch::NotDashboard',
        Properties: {
          DashboardBody: '{ "widgets": [] }',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::NotCloudWatch::NotDashboard',
          Properties: {
            DashboardBody: '{ "widgets": [{ "type": "text" }] }',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockPutDashboard).not.toHaveBeenCalled();
});

test('can hotswap a dashboard with nested Fn::Join in DashboardBody', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Dashboard: {
        Type: 'AWS::CloudWatch::Dashboard',
        Properties: {
          DashboardBody: {
            'Fn::Join': [
              '',
              [
                '{ "widgets": [',
                '{ "type": "text", "text": "Old" }',
                '] }',
              ],
            ],
          },
          DashboardName: 'my-dashboard',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::CloudWatch::Dashboard',
          Properties: {
            DashboardBody: {
              'Fn::Join': [
                '',
                [
                  '{ "widgets": [',
                  '{ "type": "text", "text": "New" }',
                  '] }',
                ],
              ],
            },
            DashboardName: 'my-dashboard',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockPutDashboard).toHaveBeenCalledWith({
    DashboardName: 'my-dashboard',
    DashboardBody: '{ "widgets": [{ "type": "text", "text": "New" }] }',
  });
});

test('throws an error for invalid DashboardBody', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Dashboard: {
        Type: 'AWS::CloudWatch::Dashboard',
        Properties: {
          DashboardBody: '{ "invalid": "data" }',
          DashboardName: 'invalid-dashboard',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Dashboard: {
          Type: 'AWS::CloudWatch::Dashboard',
          Properties: {
            DashboardBody: '{ "widgets": "invalid-format" }',
            DashboardName: 'invalid-dashboard',
          },
        },
      },
    },
  });

  // THEN
  await expect(() =>
    cfnMockProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow(/Invalid DashboardBody/);
});
