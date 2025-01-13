// We need to mock the chokidar library, used by 'cdk watch'
const mockChokidarWatcherOn = jest.fn();
const fakeChokidarWatcher = {
  on: mockChokidarWatcherOn,
};
const fakeChokidarWatcherOn = {
  get readyCallback(): () => void {
    expect(mockChokidarWatcherOn.mock.calls.length).toBeGreaterThanOrEqual(1);
    // The call to the first 'watcher.on()' in the production code is the one we actually want here.
    // This is a pretty fragile, but at least with this helper class,
    // we would have to change it only in one place if it ever breaks
    const firstCall = mockChokidarWatcherOn.mock.calls[0];
    // let's make sure the first argument is the 'ready' event,
    // just to be double safe
    expect(firstCall[0]).toBe('ready');
    // the second argument is the callback
    return firstCall[1];
  },

  get fileEventCallback(): (
  event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  path: string,
  ) => Promise<void> {
    expect(mockChokidarWatcherOn.mock.calls.length).toBeGreaterThanOrEqual(2);
    const secondCall = mockChokidarWatcherOn.mock.calls[1];
    // let's make sure the first argument is not the 'ready' event,
    // just to be double safe
    expect(secondCall[0]).not.toBe('ready');
    // the second argument is the callback
    return secondCall[1];
  },
};

const mockChokidarWatch = jest.fn();
jest.mock('chokidar', () => ({
  watch: mockChokidarWatch,
}));
const fakeChokidarWatch = {
  get includeArgs(): string[] {
    expect(mockChokidarWatch.mock.calls.length).toBe(1);
    // the include args are the first parameter to the 'watch()' call
    return mockChokidarWatch.mock.calls[0][0];
  },

  get excludeArgs(): string[] {
    expect(mockChokidarWatch.mock.calls.length).toBe(1);
    // the ignore args are a property of the second parameter to the 'watch()' call
    const chokidarWatchOpts = mockChokidarWatch.mock.calls[0][1];
    return chokidarWatchOpts.ignored;
  },
};

const mockData = jest.fn();
jest.mock('../lib/logging', () => ({
  ...jest.requireActual('../lib/logging'),
  data: mockData,
}));
jest.setTimeout(30_000);

import 'aws-sdk-client-mock';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { DescribeStacksCommand, GetTemplateCommand, StackStatus } from '@aws-sdk/client-cloudformation';
import { GetParameterCommand } from '@aws-sdk/client-ssm';
import * as fs from 'fs-extra';
import * as promptly from 'promptly';
import { instanceMockFrom, MockCloudExecutable, TestStackArtifact } from './util';
import { SdkProvider } from '../lib';
import {
  mockCloudFormationClient,
  MockSdk,
  MockSdkProvider,
  mockSSMClient,
  restoreSdkMocksToDefault,
} from './util/mock-sdk';
import { Bootstrapper, type BootstrapSource } from '../lib/api/bootstrap';
import { DeployStackResult, SuccessfulDeployStackResult } from '../lib/api/deploy-stack';
import {
  Deployments,
  DeployStackOptions,
  DestroyStackOptions,
  RollbackStackOptions,
  RollbackStackResult,
} from '../lib/api/deployments';
import { HotswapMode } from '../lib/api/hotswap/common';
import { Mode } from '../lib/api/plugin/mode';
import { Template } from '../lib/api/util/cloudformation';
import { CdkToolkit, markTesting, Tag } from '../lib/cdk-toolkit';
import { RequireApproval } from '../lib/diff';
import { Configuration } from '../lib/settings';
import { flatten } from '../lib/util';

markTesting();

const defaultBootstrapSource: BootstrapSource = { source: 'default' };
const bootstrapEnvironmentMock = jest.spyOn(Bootstrapper.prototype, 'bootstrapEnvironment');
let cloudExecutable: MockCloudExecutable;
let stderrMock: jest.SpyInstance;
beforeEach(() => {
  jest.resetAllMocks();
  restoreSdkMocksToDefault();

  mockChokidarWatch.mockReturnValue(fakeChokidarWatcher);
  // on() in chokidar's Watcher returns 'this'
  mockChokidarWatcherOn.mockReturnValue(fakeChokidarWatcher);

  bootstrapEnvironmentMock.mockResolvedValue({
    noOp: false,
    outputs: {},
    type: 'did-deploy-stack',
    stackArn: 'fake-arn',
  });

  cloudExecutable = new MockCloudExecutable({
    stacks: [MockStack.MOCK_STACK_A, MockStack.MOCK_STACK_B],
    nestedAssemblies: [
      {
        stacks: [MockStack.MOCK_STACK_C],
      },
    ],
  });

  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => {
    return true;
  });
});

function defaultToolkitSetup() {
  return new CdkToolkit({
    cloudExecutable,
    configuration: cloudExecutable.configuration,
    sdkProvider: cloudExecutable.sdkProvider,
    deployments: new FakeCloudFormation({
      'Test-Stack-A': { Foo: 'Bar' },
      'Test-Stack-B': { Baz: 'Zinga!' },
      'Test-Stack-C': { Baz: 'Zinga!' },
    }),
  });
}

const mockSdk = new MockSdk();

describe('readCurrentTemplate', () => {
  let template: any;
  let mockCloudExecutable: MockCloudExecutable;
  let sdkProvider: SdkProvider;
  let mockForEnvironment: any;
  beforeEach(() => {
    jest.resetAllMocks();
    template = {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Key: 'Value',
          },
        },
      },
    };
    mockCloudExecutable = new MockCloudExecutable({
      stacks: [
        {
          stackName: 'Test-Stack-C',
          template,
          properties: {
            assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
            lookupRole: {
              arn: 'bloop-lookup:${AWS::Region}:${AWS::AccountId}',
              requiresBootstrapStackVersion: 5,
              bootstrapStackVersionSsmParameter: '/bootstrap/parameter',
            },
          },
        },
        {
          stackName: 'Test-Stack-A',
          template,
          properties: {
            assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
          },
        },
      ],
    });
    sdkProvider = mockCloudExecutable.sdkProvider;
    mockForEnvironment = jest
      .spyOn(sdkProvider, 'forEnvironment')
      .mockResolvedValue({ sdk: mockSdk, didAssumeRole: true });
    mockCloudFormationClient
      .on(GetTemplateCommand)
      .resolves({
        TemplateBody: JSON.stringify(template),
      })
      .on(DescribeStacksCommand)
      .resolves({
        Stacks: [
          {
            StackName: 'Test-Stack-C',
            StackStatus: StackStatus.CREATE_COMPLETE,
            CreationTime: new Date(),
          },
          {
            StackName: 'Test-Stack-A',
            StackStatus: StackStatus.CREATE_COMPLETE,
            CreationTime: new Date(),
          },
        ],
      });
  });

  test('lookup role is used', async () => {
    // GIVEN
    mockSSMClient.on(GetParameterCommand).resolves({ Parameter: { Value: '6' } });

    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(mockSSMClient).toHaveReceivedCommandWith(GetParameterCommand, {
      Name: '/bootstrap/parameter',
    });
    expect(mockForEnvironment).toHaveBeenCalledTimes(2);
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop-lookup:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });

  test('fallback to deploy role if bootstrap stack version is not valid', async () => {
    // GIVEN
    mockSSMClient.on(GetParameterCommand).resolves({ Parameter: { Value: '1' } });

    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(
      expect.arrayContaining([

        expect.stringContaining(
          "Bootstrap stack version '5' is required, found version '1'. To get rid of this error, please upgrade to bootstrap version >= 5",
        ),
      ]),
    );
    expect(mockSSMClient).toHaveReceivedCommandWith(GetParameterCommand, {
      Name: '/bootstrap/parameter',
    });
    expect(mockForEnvironment).toHaveBeenCalledTimes(3);
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop-lookup:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      2,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });

  test('fallback to deploy role if bootstrap version parameter not found', async () => {
    // GIVEN
    mockSSMClient.on(GetParameterCommand).callsFake(() => {
      const e: any = new Error('not found');
      e.code = e.name = 'ParameterNotFound';
      throw e;
    });

    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(
      expect.arrayContaining([expect.stringMatching(/SSM parameter.*not found./)]),
    );
    expect(mockForEnvironment).toHaveBeenCalledTimes(3);
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop-lookup:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      2,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });

  test('fallback to deploy role if forEnvironment throws', async () => {
    // GIVEN
    // throw error first for the 'prepareSdkWithLookupRoleFor' call and succeed for the rest
    mockForEnvironment = jest.spyOn(sdkProvider, 'forEnvironment').mockImplementationOnce(() => {
      throw new Error('TheErrorThatGetsThrown');
    });

    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(mockSSMClient).not.toHaveReceivedAnyCommand();
    expect(flatten(stderrMock.mock.calls)).toEqual(
      expect.arrayContaining([expect.stringMatching(/TheErrorThatGetsThrown/)]),
    );
    expect(mockForEnvironment).toHaveBeenCalledTimes(3);
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop-lookup:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      2,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: 'bloop:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });

  test('dont lookup bootstrap version parameter if default credentials are used', async () => {
    // GIVEN
    mockForEnvironment = jest.fn().mockImplementation(() => {
      return { sdk: mockSdk, didAssumeRole: false };
    });
    mockCloudExecutable.sdkProvider.forEnvironment = mockForEnvironment;
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Lookup role.*was not assumed. Proceeding with default credentials./),
      ]),
    );
    expect(mockSSMClient).not.toHaveReceivedAnyCommand();
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      Mode.ForReading,
      {
        assumeRoleArn: 'bloop-lookup:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      2,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      Mode.ForWriting,
      {
        assumeRoleArn: 'bloop:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });

  test('do not print warnings if lookup role not provided in stack artifact', async () => {
    // GIVEN
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      deployments: new Deployments({
        sdkProvider: mockCloudExecutable.sdkProvider,
      }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-A'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Could not assume/),
        expect.stringMatching(/please upgrade to bootstrap version/),
      ]),
    );
    expect(mockSSMClient).not.toHaveReceivedAnyCommand();
    expect(mockForEnvironment).toHaveBeenCalledTimes(2);
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      1,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      0,
      {
        assumeRoleArn: undefined,
        assumeRoleExternalId: undefined,
      },
    );
    expect(mockForEnvironment).toHaveBeenNthCalledWith(
      2,
      {
        account: '123456789012',
        name: 'aws://123456789012/here',
        region: 'here',
      },
      1,
      {
        assumeRoleArn: 'bloop:here:123456789012',
        assumeRoleExternalId: undefined,
      },
    );
  });
});

describe('bootstrap', () => {
  test('accepts qualifier from context', async () => {
    // GIVEN
    const toolkit = defaultToolkitSetup();
    const configuration = new Configuration();
    configuration.context.set('@aws-cdk/core:bootstrapQualifier', 'abcde');

    // WHEN
    await toolkit.bootstrap(['aws://56789/south-pole'], {
      source: defaultBootstrapSource,
      parameters: {
        qualifier: configuration.context.get('@aws-cdk/core:bootstrapQualifier'),
      },
    });

    // THEN
    expect(bootstrapEnvironmentMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
      parameters: {
        qualifier: 'abcde',
      },
      source: defaultBootstrapSource,
    });
  });
});

describe('deploy', () => {
  test('fails when no valid stack names are given', async () => {
    // GIVEN
    const toolkit = defaultToolkitSetup();

    // WHEN
    await expect(() =>
      toolkit.deploy({
        selector: { patterns: ['Test-Stack-D'] },
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      }),
    ).rejects.toThrow('No stacks match the name(s) Test-Stack-D');
  });

  describe('with hotswap deployment', () => {
    test("passes through the 'hotswap' option to CloudFormationDeployments.deployStack()", async () => {
      // GIVEN
      const mockCfnDeployments = instanceMockFrom(Deployments);
      mockCfnDeployments.deployStack.mockReturnValue(
        Promise.resolve({
          type: 'did-deploy-stack',
          noOp: false,
          outputs: {},
          stackArn: 'stackArn',
          stackArtifact: instanceMockFrom(cxapi.CloudFormationStackArtifact),
        }),
      );
      const cdkToolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        deployments: mockCfnDeployments,
      });

      // WHEN
      await cdkToolkit.deploy({
        selector: { patterns: ['Test-Stack-A-Display-Name'] },
        requireApproval: RequireApproval.Never,
        hotswap: HotswapMode.FALL_BACK,
      });

      // THEN
      expect(mockCfnDeployments.deployStack).toHaveBeenCalledWith(
        expect.objectContaining({
          hotswap: HotswapMode.FALL_BACK,
        }),
      );
    });
  });

  describe('makes correct CloudFormation calls', () => {
    test('without options', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({
        selector: { patterns: ['Test-Stack-A', 'Test-Stack-B'] },
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      });
    });

    test('with stacks all stacks specified as double wildcard', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({
        selector: { patterns: ['**'] },
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      });
    });

    test('with one stack specified', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({
        selector: { patterns: ['Test-Stack-A-Display-Name'] },
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      });
    });

    test('with stacks all stacks specified as wildcard', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({
        selector: { patterns: ['*'] },
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      });
    });

    describe('sns notification arns', () => {
      beforeEach(() => {
        cloudExecutable = new MockCloudExecutable({
          stacks: [
            MockStack.MOCK_STACK_A,
            MockStack.MOCK_STACK_B,
            MockStack.MOCK_STACK_WITH_NOTIFICATION_ARNS,
            MockStack.MOCK_STACK_WITH_BAD_NOTIFICATION_ARNS,
          ],
        });
      });

      test('with sns notification arns as options', async () => {
        // GIVEN
        const notificationArns = [
          'arn:aws:sns:us-east-2:444455556666:MyTopic',
          'arn:aws:sns:eu-west-1:111155556666:my-great-topic',
        ];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-A': { Foo: 'Bar' },
            },
            notificationArns,
          ),
        });

        // WHEN
        await toolkit.deploy({
          // Stacks should be selected by their hierarchical ID, which is their displayName, not by the stack ID.
          selector: { patterns: ['Test-Stack-A-Display-Name'] },
          notificationArns,
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        });
      });

      test('fail with incorrect sns notification arns as options', async () => {
        // GIVEN
        const notificationArns = ['arn:::cfn-my-cool-topic'];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-A': { Foo: 'Bar' },
            },
            notificationArns,
          ),
        });

        // WHEN
        await expect(() =>
          toolkit.deploy({
            // Stacks should be selected by their hierarchical ID, which is their displayName, not by the stack ID.
            selector: { patterns: ['Test-Stack-A-Display-Name'] },
            notificationArns,
            hotswap: HotswapMode.FULL_DEPLOYMENT,
          }),
        ).rejects.toThrow('Notification arn arn:::cfn-my-cool-topic is not a valid arn for an SNS topic');
      });

      test('with sns notification arns in the executable', async () => {
        // GIVEN
        const expectedNotificationArns = ['arn:aws:sns:bermuda-triangle-1337:123456789012:MyTopic'];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-Notification-Arns': { Foo: 'Bar' },
            },
            expectedNotificationArns,
          ),
        });

        // WHEN
        await toolkit.deploy({
          selector: { patterns: ['Test-Stack-Notification-Arns'] },
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        });
      });

      test('fail with incorrect sns notification arns in the executable', async () => {
        // GIVEN
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation({
            'Test-Stack-Bad-Notification-Arns': { Foo: 'Bar' },
          }),
        });

        // WHEN
        await expect(() =>
          toolkit.deploy({
            selector: { patterns: ['Test-Stack-Bad-Notification-Arns'] },
            hotswap: HotswapMode.FULL_DEPLOYMENT,
          }),
        ).rejects.toThrow('Notification arn arn:1337:123456789012:sns:bad is not a valid arn for an SNS topic');
      });

      test('with sns notification arns in the executable and as options', async () => {
        // GIVEN
        const notificationArns = [
          'arn:aws:sns:us-east-2:444455556666:MyTopic',
          'arn:aws:sns:eu-west-1:111155556666:my-great-topic',
        ];

        const expectedNotificationArns = notificationArns.concat([
          'arn:aws:sns:bermuda-triangle-1337:123456789012:MyTopic',
        ]);
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-Notification-Arns': { Foo: 'Bar' },
            },
            expectedNotificationArns,
          ),
        });

        // WHEN
        await toolkit.deploy({
          selector: { patterns: ['Test-Stack-Notification-Arns'] },
          notificationArns,
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        });
      });

      test('fail with incorrect sns notification arns in the executable and incorrect sns notification arns as options', async () => {
        // GIVEN
        const notificationArns = ['arn:::cfn-my-cool-topic'];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-Bad-Notification-Arns': { Foo: 'Bar' },
            },
            notificationArns,
          ),
        });

        // WHEN
        await expect(() =>
          toolkit.deploy({
            selector: { patterns: ['Test-Stack-Bad-Notification-Arns'] },
            notificationArns,
            hotswap: HotswapMode.FULL_DEPLOYMENT,
          }),
        ).rejects.toThrow('Notification arn arn:::cfn-my-cool-topic is not a valid arn for an SNS topic');
      });

      test('fail with incorrect sns notification arns in the executable and correct sns notification arns as options', async () => {
        // GIVEN
        const notificationArns = ['arn:aws:sns:bermuda-triangle-1337:123456789012:MyTopic'];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-Bad-Notification-Arns': { Foo: 'Bar' },
            },
            notificationArns,
          ),
        });

        // WHEN
        await expect(() =>
          toolkit.deploy({
            selector: { patterns: ['Test-Stack-Bad-Notification-Arns'] },
            notificationArns,
            hotswap: HotswapMode.FULL_DEPLOYMENT,
          }),
        ).rejects.toThrow('Notification arn arn:1337:123456789012:sns:bad is not a valid arn for an SNS topic');
      });

      test('fail with correct sns notification arns in the executable and incorrect sns notification arns as options', async () => {
        // GIVEN
        const notificationArns = ['arn:::cfn-my-cool-topic'];
        const toolkit = new CdkToolkit({
          cloudExecutable,
          configuration: cloudExecutable.configuration,
          sdkProvider: cloudExecutable.sdkProvider,
          deployments: new FakeCloudFormation(
            {
              'Test-Stack-Notification-Arns': { Foo: 'Bar' },
            },
            notificationArns,
          ),
        });

        // WHEN
        await expect(() =>
          toolkit.deploy({
            selector: { patterns: ['Test-Stack-Notification-Arns'] },
            notificationArns,
            hotswap: HotswapMode.FULL_DEPLOYMENT,
          }),
        ).rejects.toThrow('Notification arn arn:::cfn-my-cool-topic is not a valid arn for an SNS topic');
      });
    });
  });

  test('globless bootstrap uses environment without question', async () => {
    // GIVEN
    const toolkit = defaultToolkitSetup();

    // WHEN
    await toolkit.bootstrap(['aws://56789/south-pole'], {
      source: defaultBootstrapSource,
    });

    // THEN
    expect(bootstrapEnvironmentMock).toHaveBeenCalledWith(
      {
        account: '56789',
        region: 'south-pole',
        name: 'aws://56789/south-pole',
      },
      expect.anything(),
      expect.anything(),
    );
    expect(bootstrapEnvironmentMock).toHaveBeenCalledTimes(1);
  });

  test('globby bootstrap uses whats in the stacks', async () => {
    // GIVEN
    const toolkit = defaultToolkitSetup();
    cloudExecutable.configuration.settings.set(['app'], 'something');

    // WHEN
    await toolkit.bootstrap(['aws://*/bermuda-triangle-1'], {
      source: defaultBootstrapSource,
    });

    // THEN
    expect(bootstrapEnvironmentMock).toHaveBeenCalledWith(
      {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      expect.anything(),
      expect.anything(),
    );
    expect(bootstrapEnvironmentMock).toHaveBeenCalledTimes(1);
  });

  test('bootstrap can be invoked without the --app argument', async () => {
    // GIVEN
    cloudExecutable.configuration.settings.clear();
    const mockSynthesize = jest.fn();
    cloudExecutable.synthesize = mockSynthesize;

    const toolkit = defaultToolkitSetup();

    // WHEN
    await toolkit.bootstrap(['aws://123456789012/west-pole'], {
      source: defaultBootstrapSource,
    });

    // THEN
    expect(bootstrapEnvironmentMock).toHaveBeenCalledWith(
      {
        account: '123456789012',
        region: 'west-pole',
        name: 'aws://123456789012/west-pole',
      },
      expect.anything(),
      expect.anything(),
    );
    expect(bootstrapEnvironmentMock).toHaveBeenCalledTimes(1);

    expect(cloudExecutable.hasApp).toEqual(false);
    expect(mockSynthesize).not.toHaveBeenCalled();
  });
});

describe('destroy', () => {
  test('destroy correct stack', async () => {
    const toolkit = defaultToolkitSetup();

    expect(() => {
      return toolkit.destroy({
        selector: { patterns: ['Test-Stack-A/Test-Stack-C'] },
        exclusively: true,
        force: true,
        fromDeploy: true,
      });
    }).resolves;
  });
});

describe('watch', () => {
  test("fails when no 'watch' settings are found", async () => {
    const toolkit = defaultToolkitSetup();

    await expect(() => {
      return toolkit.watch({
        selector: { patterns: [] },
        hotswap: HotswapMode.HOTSWAP_ONLY,
      });
    }).rejects.toThrow(
      "Cannot use the 'watch' command without specifying at least one directory to monitor. " +
        'Make sure to add a "watch" key to your cdk.json',
    );
  });

  test('observes only the root directory by default', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    const includeArgs = fakeChokidarWatch.includeArgs;
    expect(includeArgs.length).toBe(1);
  });

  test("allows providing a single string in 'watch.include'", async () => {
    cloudExecutable.configuration.settings.set(['watch'], {
      include: 'my-dir',
    });
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    expect(fakeChokidarWatch.includeArgs).toStrictEqual(['my-dir']);
  });

  test("allows providing an array of strings in 'watch.include'", async () => {
    cloudExecutable.configuration.settings.set(['watch'], {
      include: ['my-dir1', '**/my-dir2/*'],
    });
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    expect(fakeChokidarWatch.includeArgs).toStrictEqual(['my-dir1', '**/my-dir2/*']);
  });

  test('ignores the output dir, dot files, dot directories, and node_modules by default', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    cloudExecutable.configuration.settings.set(['output'], 'cdk.out');
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    expect(fakeChokidarWatch.excludeArgs).toStrictEqual(['cdk.out/**', '**/.*', '**/.*/**', '**/node_modules/**']);
  });

  test("allows providing a single string in 'watch.exclude'", async () => {
    cloudExecutable.configuration.settings.set(['watch'], {
      exclude: 'my-dir',
    });
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    const excludeArgs = fakeChokidarWatch.excludeArgs;
    expect(excludeArgs.length).toBe(5);
    expect(excludeArgs[0]).toBe('my-dir');
  });

  test("allows providing an array of strings in 'watch.exclude'", async () => {
    cloudExecutable.configuration.settings.set(['watch'], {
      exclude: ['my-dir1', '**/my-dir2'],
    });
    const toolkit = defaultToolkitSetup();

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    const excludeArgs = fakeChokidarWatch.excludeArgs;
    expect(excludeArgs.length).toBe(6);
    expect(excludeArgs[0]).toBe('my-dir1');
    expect(excludeArgs[1]).toBe('**/my-dir2');
  });

  test('allows watching with deploy concurrency', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({
      selector: { patterns: [] },
      concurrency: 3,
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toHaveBeenCalledWith(expect.objectContaining({ concurrency: 3 }));
  });

  describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
    test('passes through the correct hotswap mode to deployStack()', async () => {
      cloudExecutable.configuration.settings.set(['watch'], {});
      const toolkit = defaultToolkitSetup();
      const cdkDeployMock = jest.fn();
      toolkit.deploy = cdkDeployMock;

      await toolkit.watch({
        selector: { patterns: [] },
        hotswap: hotswapMode,
      });
      fakeChokidarWatcherOn.readyCallback();

      expect(cdkDeployMock).toHaveBeenCalledWith(expect.objectContaining({ hotswap: hotswapMode }));
    });
  });

  test('respects HotswapMode.HOTSWAP_ONLY', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toHaveBeenCalledWith(expect.objectContaining({ hotswap: HotswapMode.HOTSWAP_ONLY }));
  });

  test('respects HotswapMode.FALL_BACK', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.FALL_BACK,
    });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toHaveBeenCalledWith(expect.objectContaining({ hotswap: HotswapMode.FALL_BACK }));
  });

  test('respects HotswapMode.FULL_DEPLOYMENT', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({
      selector: { patterns: [] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toHaveBeenCalledWith(expect.objectContaining({ hotswap: HotswapMode.FULL_DEPLOYMENT }));
  });

  describe('with file change events', () => {
    let toolkit: CdkToolkit;
    let cdkDeployMock: jest.Mock;

    beforeEach(async () => {
      cloudExecutable.configuration.settings.set(['watch'], {});
      toolkit = defaultToolkitSetup();
      cdkDeployMock = jest.fn();
      toolkit.deploy = cdkDeployMock;
      await toolkit.watch({
        selector: { patterns: [] },
        hotswap: HotswapMode.HOTSWAP_ONLY,
      });
    });

    test("does not trigger a 'deploy' before the 'ready' event has fired", async () => {
      await fakeChokidarWatcherOn.fileEventCallback('add', 'my-file');

      expect(cdkDeployMock).not.toHaveBeenCalled();
    });

    describe("when the 'ready' event has already fired", () => {
      beforeEach(() => {
        // The ready callback triggers a deployment so each test
        // that uses this function will see 'cdkDeployMock' called
        // an additional time.
        fakeChokidarWatcherOn.readyCallback();
      });

      test("an initial 'deploy' is triggered, without any file changes", async () => {
        expect(cdkDeployMock).toHaveBeenCalledTimes(1);
      });

      test("does trigger a 'deploy' for a file change", async () => {
        await fakeChokidarWatcherOn.fileEventCallback('add', 'my-file');

        expect(cdkDeployMock).toHaveBeenCalledTimes(2);
      });

      test("triggers a 'deploy' twice for two file changes", async () => {
        // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
        await Promise.all([
          fakeChokidarWatcherOn.fileEventCallback('add', 'my-file1'),
          fakeChokidarWatcherOn.fileEventCallback('change', 'my-file2'),
        ]);

        expect(cdkDeployMock).toHaveBeenCalledTimes(3);
      });

      test("batches file changes that happen during 'deploy'", async () => {
        // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
        await Promise.all([
          fakeChokidarWatcherOn.fileEventCallback('add', 'my-file1'),
          fakeChokidarWatcherOn.fileEventCallback('change', 'my-file2'),
          fakeChokidarWatcherOn.fileEventCallback('unlink', 'my-file3'),
          fakeChokidarWatcherOn.fileEventCallback('add', 'my-file4'),
        ]);

        expect(cdkDeployMock).toHaveBeenCalledTimes(3);
      });
    });
  });
});

describe('synth', () => {
  test('successful synth outputs hierarchical stack ids', async () => {
    const toolkit = defaultToolkitSetup();
    await toolkit.synth([], false, false);

    // Separate tests as colorizing hampers detection
    expect(stderrMock.mock.calls[1][0]).toMatch('Test-Stack-A-Display-Name');
    expect(stderrMock.mock.calls[1][0]).toMatch('Test-Stack-B');
  });

  test('with no stdout option', async () => {
    // GIVE
    const toolkit = defaultToolkitSetup();

    // THEN
    await toolkit.synth(['Test-Stack-A-Display-Name'], false, true);
    expect(mockData.mock.calls.length).toEqual(0);
  });

  describe('migrate', () => {
    const testResourcePath = [__dirname, 'commands', 'test-resources'];
    const templatePath = [...testResourcePath, 'templates'];
    const sqsTemplatePath = path.join(...templatePath, 'sqs-template.json');
    const autoscalingTemplatePath = path.join(...templatePath, 'autoscaling-template.yml');
    const s3TemplatePath = path.join(...templatePath, 's3-template.json');

    test('migrate fails when both --from-path and --from-stack are provided', async () => {
      const toolkit = defaultToolkitSetup();
      await expect(() =>
        toolkit.migrate({
          stackName: 'no-source',
          fromPath: './here/template.yml',
          fromStack: true,
        }),
      ).rejects.toThrow('Only one of `--from-path` or `--from-stack` may be provided.');
      expect(stderrMock.mock.calls[1][0]).toContain(
        ' ❌  Migrate failed for `no-source`: Only one of `--from-path` or `--from-stack` may be provided.',
      );
    });

    test('migrate fails when --from-path is invalid', async () => {
      const toolkit = defaultToolkitSetup();
      await expect(() =>
        toolkit.migrate({
          stackName: 'bad-local-source',
          fromPath: './here/template.yml',
        }),
      ).rejects.toThrow("'./here/template.yml' is not a valid path.");
      expect(stderrMock.mock.calls[1][0]).toContain(
        " ❌  Migrate failed for `bad-local-source`: './here/template.yml' is not a valid path.",
      );
    });

    test('migrate fails when --from-stack is used and stack does not exist in account', async () => {
      const mockSdkProvider = new MockSdkProvider();
      mockCloudFormationClient.on(DescribeStacksCommand).rejects(new Error('Stack does not exist in this environment'));

      const mockCloudExecutable = new MockCloudExecutable({
        stacks: [],
      });

      const cdkToolkit = new CdkToolkit({
        cloudExecutable: mockCloudExecutable,
        deployments: new Deployments({ sdkProvider: mockSdkProvider }),
        sdkProvider: mockSdkProvider,
        configuration: mockCloudExecutable.configuration,
      });

      await expect(() =>
        cdkToolkit.migrate({
          stackName: 'bad-cloudformation-source',
          fromStack: true,
        }),
      ).rejects.toThrow('Stack does not exist in this environment');
      expect(stderrMock.mock.calls[1][0]).toContain(
        ' ❌  Migrate failed for `bad-cloudformation-source`: Stack does not exist in this environment',
      );
    });

    test('migrate fails when stack cannot be generated', async () => {
      const toolkit = defaultToolkitSetup();
      await expect(() =>
        toolkit.migrate({
          stackName: 'cannot-generate-template',
          fromPath: path.join(__dirname, 'commands', 'test-resources', 'templates', 'sqs-template.json'),
          language: 'rust',
        }),
      ).rejects.toThrow(
        'CannotGenerateTemplateStack could not be generated because rust is not a supported language',
      );
      expect(stderrMock.mock.calls[1][0]).toContain(
        ' ❌  Migrate failed for `cannot-generate-template`: CannotGenerateTemplateStack could not be generated because rust is not a supported language',
      );
    });

    cliTest('migrate succeeds for valid template from local path when no language is provided', async (workDir) => {
      const toolkit = defaultToolkitSetup();
      await toolkit.migrate({
        stackName: 'SQSTypeScript',
        fromPath: sqsTemplatePath,
        outputPath: workDir,
      });

      // Packages created for typescript
      expect(fs.pathExistsSync(path.join(workDir, 'SQSTypeScript', 'package.json'))).toBeTruthy();
      expect(fs.pathExistsSync(path.join(workDir, 'SQSTypeScript', 'bin', 'sqs_type_script.ts'))).toBeTruthy();
      expect(fs.pathExistsSync(path.join(workDir, 'SQSTypeScript', 'lib', 'sqs_type_script-stack.ts'))).toBeTruthy();
    });

    cliTest('migrate succeeds for valid template from local path when language is provided', async (workDir) => {
      const toolkit = defaultToolkitSetup();
      await toolkit.migrate({
        stackName: 'S3Python',
        fromPath: s3TemplatePath,
        outputPath: workDir,
        language: 'python',
      });

      // Packages created for typescript
      expect(fs.pathExistsSync(path.join(workDir, 'S3Python', 'requirements.txt'))).toBeTruthy();
      expect(fs.pathExistsSync(path.join(workDir, 'S3Python', 'app.py'))).toBeTruthy();
      expect(fs.pathExistsSync(path.join(workDir, 'S3Python', 's3_python', 's3_python_stack.py'))).toBeTruthy();
    });

    cliTest('migrate call is idempotent', async (workDir) => {
      const toolkit = defaultToolkitSetup();
      await toolkit.migrate({
        stackName: 'AutoscalingCSharp',
        fromPath: autoscalingTemplatePath,
        outputPath: workDir,
        language: 'csharp',
      });

      // Packages created for typescript
      expect(fs.pathExistsSync(path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp.sln'))).toBeTruthy();
      expect(
        fs.pathExistsSync(path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp', 'Program.cs')),
      ).toBeTruthy();
      expect(
        fs.pathExistsSync(
          path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp', 'AutoscalingCSharpStack.cs'),
        ),
      ).toBeTruthy();

      // One more time
      await toolkit.migrate({
        stackName: 'AutoscalingCSharp',
        fromPath: autoscalingTemplatePath,
        outputPath: workDir,
        language: 'csharp',
      });

      // Packages created for typescript
      expect(fs.pathExistsSync(path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp.sln'))).toBeTruthy();
      expect(
        fs.pathExistsSync(path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp', 'Program.cs')),
      ).toBeTruthy();
      expect(
        fs.pathExistsSync(
          path.join(workDir, 'AutoscalingCSharp', 'src', 'AutoscalingCSharp', 'AutoscalingCSharpStack.cs'),
        ),
      ).toBeTruthy();
    });
  });

  describe('stack with error and flagged for validation', () => {
    beforeEach(() => {
      cloudExecutable = new MockCloudExecutable({
        stacks: [MockStack.MOCK_STACK_A, MockStack.MOCK_STACK_B],
        nestedAssemblies: [
          {
            stacks: [
              {
                properties: { validateOnSynth: true },
                ...MockStack.MOCK_STACK_WITH_ERROR,
              },
            ],
          },
        ],
      });
    });

    test('causes synth to fail if autoValidate=true', async () => {
      const toolkit = defaultToolkitSetup();
      const autoValidate = true;
      await expect(toolkit.synth([], false, true, autoValidate)).rejects.toBeDefined();
    });

    test('causes synth to succeed if autoValidate=false', async () => {
      const toolkit = defaultToolkitSetup();
      const autoValidate = false;
      await toolkit.synth([], false, true, autoValidate);
      expect(mockData.mock.calls.length).toEqual(0);
    });
  });

  test('stack has error and was explicitly selected', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [MockStack.MOCK_STACK_A, MockStack.MOCK_STACK_B],
      nestedAssemblies: [
        {
          stacks: [
            {
              properties: { validateOnSynth: false },
              ...MockStack.MOCK_STACK_WITH_ERROR,
            },
          ],
        },
      ],
    });

    const toolkit = defaultToolkitSetup();

    await expect(toolkit.synth(['Test-Stack-A/witherrors'], false, true)).rejects.toBeDefined();
  });

  test('stack has error, is not flagged for validation and was not explicitly selected', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [MockStack.MOCK_STACK_A, MockStack.MOCK_STACK_B],
      nestedAssemblies: [
        {
          stacks: [
            {
              properties: { validateOnSynth: false },
              ...MockStack.MOCK_STACK_WITH_ERROR,
            },
          ],
        },
      ],
    });

    const toolkit = defaultToolkitSetup();

    await toolkit.synth([], false, true);
  });

  test('stack has dependency and was explicitly selected', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [MockStack.MOCK_STACK_C, MockStack.MOCK_STACK_D],
    });

    const toolkit = defaultToolkitSetup();

    await toolkit.synth([MockStack.MOCK_STACK_D.stackName], true, false);

    expect(mockData.mock.calls.length).toEqual(1);
    expect(mockData.mock.calls[0][0]).toBeDefined();
  });

  test('rollback uses deployment role', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [MockStack.MOCK_STACK_C],
    });

    const mockedRollback = jest.spyOn(Deployments.prototype, 'rollbackStack').mockResolvedValue({
      success: true,
    });

    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new Deployments({ sdkProvider: new MockSdkProvider() }),
    });

    await toolkit.rollback({
      selector: { patterns: [] },
    });

    expect(mockedRollback).toHaveBeenCalled();
  });

  test.each([
    [{ type: 'failpaused-need-rollback-first', reason: 'replacement', status: 'OOPS' }, false],
    [{ type: 'failpaused-need-rollback-first', reason: 'replacement', status: 'OOPS' }, true],
    [{ type: 'failpaused-need-rollback-first', reason: 'not-norollback', status: 'OOPS' }, false],
    [{ type: 'replacement-requires-rollback' }, false],
    [{ type: 'replacement-requires-rollback' }, true],
  ] satisfies Array<[DeployStackResult, boolean]>)('no-rollback deployment that cant proceed will be called with rollback on retry: %p (using force: %p)', async (firstResult, useForce) => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_C,
      ],
    });

    const deployments = new Deployments({ sdkProvider: new MockSdkProvider() });

    // Rollback might be called -- just don't do nothing.
    const mockRollbackStack = jest.spyOn(deployments, 'rollbackStack').mockResolvedValue({});

    const mockedDeployStack = jest
      .spyOn(deployments, 'deployStack')
      .mockResolvedValueOnce(firstResult)
      .mockResolvedValueOnce({
        type: 'did-deploy-stack',
        noOp: false,
        outputs: {},
        stackArn: 'stack:arn',
      });

    const mockedConfirm = jest.spyOn(promptly, 'confirm').mockResolvedValue(true);

    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments,
    });

    await toolkit.deploy({
      selector: { patterns: [] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
      rollback: false,
      requireApproval: RequireApproval.Never,
      force: useForce,
    });

    if (firstResult.type === 'failpaused-need-rollback-first') {
      expect(mockRollbackStack).toHaveBeenCalled();
    }

    if (!useForce) {
      // Questions will have been asked only if --force is not specified
      if (firstResult.type === 'failpaused-need-rollback-first') {
        expect(mockedConfirm).toHaveBeenCalledWith(expect.stringContaining('Roll back first and then proceed with deployment'));
      } else {
        expect(mockedConfirm).toHaveBeenCalledWith(expect.stringContaining('Perform a regular deployment'));
      }
    }

    expect(mockedDeployStack).toHaveBeenNthCalledWith(1, expect.objectContaining({ rollback: false }));
    expect(mockedDeployStack).toHaveBeenNthCalledWith(2, expect.objectContaining({ rollback: true }));
  });
});

class MockStack {
  public static readonly MOCK_STACK_A: TestStackArtifact = {
    stackName: 'Test-Stack-A',
    template: { Resources: { TemplateName: 'Test-Stack-A' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-A': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Foo', value: 'Bar' }],
        },
      ],
    },
    displayName: 'Test-Stack-A-Display-Name',
  };
  public static readonly MOCK_STACK_B: TestStackArtifact = {
    stackName: 'Test-Stack-B',
    template: { Resources: { TemplateName: 'Test-Stack-B' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-B': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Baz', value: 'Zinga!' }],
        },
      ],
    },
  };
  public static readonly MOCK_STACK_C: TestStackArtifact = {
    stackName: 'Test-Stack-C',
    template: { Resources: { TemplateName: 'Test-Stack-C' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-C': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Baz', value: 'Zinga!' }],
        },
      ],
    },
    displayName: 'Test-Stack-A/Test-Stack-C',
  };
  public static readonly MOCK_STACK_D: TestStackArtifact = {
    stackName: 'Test-Stack-D',
    template: { Resources: { TemplateName: 'Test-Stack-D' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-D': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Baz', value: 'Zinga!' }],
        },
      ],
    },
    depends: [MockStack.MOCK_STACK_C.stackName],
  };
  public static readonly MOCK_STACK_WITH_ERROR: TestStackArtifact = {
    stackName: 'witherrors',
    env: 'aws://123456789012/bermuda-triangle-1',
    template: { resource: 'errorresource' },
    metadata: {
      '/resource': [
        {
          type: cxschema.ArtifactMetadataEntryType.ERROR,
          data: 'this is an error',
        },
      ],
    },
    displayName: 'Test-Stack-A/witherrors',
  };
  public static readonly MOCK_STACK_WITH_ASSET: TestStackArtifact = {
    stackName: 'Test-Stack-Asset',
    template: { Resources: { TemplateName: 'Test-Stack-Asset' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    assetManifest: {
      version: Manifest.version(),
      files: {
        xyz: {
          source: {
            path: path.resolve(__dirname, '..', 'LICENSE'),
          },
          destinations: {},
        },
      },
    },
  };
  public static readonly MOCK_STACK_WITH_NOTIFICATION_ARNS: TestStackArtifact = {
    stackName: 'Test-Stack-Notification-Arns',
    notificationArns: ['arn:aws:sns:bermuda-triangle-1337:123456789012:MyTopic'],
    template: { Resources: { TemplateName: 'Test-Stack-Notification-Arns' } },
    env: 'aws://123456789012/bermuda-triangle-1337',
    metadata: {
      '/Test-Stack-Notification-Arns': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Foo', value: 'Bar' }],
        },
      ],
    },
  };

  public static readonly MOCK_STACK_WITH_BAD_NOTIFICATION_ARNS: TestStackArtifact = {
    stackName: 'Test-Stack-Bad-Notification-Arns',
    notificationArns: ['arn:1337:123456789012:sns:bad'],
    template: { Resources: { TemplateName: 'Test-Stack-Bad-Notification-Arns' } },
    env: 'aws://123456789012/bermuda-triangle-1337',
    metadata: {
      '/Test-Stack-Bad-Notification-Arns': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
          data: [{ key: 'Foo', value: 'Bar' }],
        },
      ],
    },
  };
}

class FakeCloudFormation extends Deployments {
  private readonly expectedTags: { [stackName: string]: Tag[] } = {};
  private readonly expectedNotificationArns?: string[];

  constructor(
    expectedTags: { [stackName: string]: { [key: string]: string } } = {},
    expectedNotificationArns?: string[],
  ) {
    super({ sdkProvider: new MockSdkProvider() });

    for (const [stackName, tags] of Object.entries(expectedTags)) {
      this.expectedTags[stackName] = Object.entries(tags)
        .map(([Key, Value]) => ({ Key, Value }))
        .sort((l, r) => l.Key.localeCompare(r.Key));
    }
    this.expectedNotificationArns = expectedNotificationArns;
  }

  public deployStack(options: DeployStackOptions): Promise<SuccessfulDeployStackResult> {
    expect([
      MockStack.MOCK_STACK_A.stackName,
      MockStack.MOCK_STACK_B.stackName,
      MockStack.MOCK_STACK_C.stackName,
      // MockStack.MOCK_STACK_D deliberately omitted.
      MockStack.MOCK_STACK_WITH_ASSET.stackName,
      MockStack.MOCK_STACK_WITH_ERROR.stackName,
      MockStack.MOCK_STACK_WITH_NOTIFICATION_ARNS.stackName,
      MockStack.MOCK_STACK_WITH_BAD_NOTIFICATION_ARNS.stackName,
    ]).toContain(options.stack.stackName);

    if (this.expectedTags[options.stack.stackName]) {
      expect(options.tags).toEqual(this.expectedTags[options.stack.stackName]);
    }

    // In these tests, we don't make a distinction here between `undefined` and `[]`.
    //
    // In tests `deployStack` itself we do treat `undefined` and `[]` differently,
    // and in `aws-cdk-lib` we emit them under different conditions. But this test
    // without normalization depends on a version of `aws-cdk-lib` that hasn't been
    // released yet.
    expect(options.notificationArns ?? []).toEqual(this.expectedNotificationArns ?? []);
    return Promise.resolve({
      type: 'did-deploy-stack',
      stackArn: `arn:aws:cloudformation:::stack/${options.stack.stackName}/MockedOut`,
      noOp: false,
      outputs: { StackName: options.stack.stackName },
      stackArtifact: options.stack,
    });
  }

  public rollbackStack(_options: RollbackStackOptions): Promise<RollbackStackResult> {
    return Promise.resolve({
      success: true,
    });
  }

  public destroyStack(options: DestroyStackOptions): Promise<void> {
    expect(options.stack).toBeDefined();
    return Promise.resolve();
  }

  public readCurrentTemplate(stack: cxapi.CloudFormationStackArtifact): Promise<Template> {
    switch (stack.stackName) {
      case MockStack.MOCK_STACK_A.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_B.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_C.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_WITH_ASSET.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_WITH_NOTIFICATION_ARNS.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_WITH_BAD_NOTIFICATION_ARNS.stackName:
        return Promise.resolve({});
      default:
        throw new Error(`not an expected mock stack: ${stack.stackName}`);
    }
  }
}

function cliTest(name: string, handler: (dir: string) => void | Promise<any>): void {
  test(name, () => withTempDir(handler));
}

async function withTempDir(cb: (dir: string) => void | Promise<any>) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  try {
    await cb(tmpDir);
  } finally {
    await fs.remove(tmpDir);
  }
}
