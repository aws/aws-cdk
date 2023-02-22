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

  get fileEventCallback(): (event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', path: string) => Promise<void> {
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

import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { instanceMockFrom, MockCloudExecutable, TestStackArtifact, withMocked } from './util';
import { MockSdkProvider } from './util/mock-sdk';
import { Bootstrapper } from '../lib/api/bootstrap';
import { CloudFormationDeployments, DeployStackOptions, DestroyStackOptions } from '../lib/api/cloudformation-deployments';
import { DeployStackResult } from '../lib/api/deploy-stack';
import { HotswapMode } from '../lib/api/hotswap/common';
import { Template } from '../lib/api/util/cloudformation';
import { CdkToolkit, Tag, AssetBuildTime } from '../lib/cdk-toolkit';
import { RequireApproval } from '../lib/diff';
import { flatten } from '../lib/util';

let cloudExecutable: MockCloudExecutable;
let bootstrapper: jest.Mocked<Bootstrapper>;
let stderrMock: jest.SpyInstance;
beforeEach(() => {
  jest.resetAllMocks();

  mockChokidarWatch.mockReturnValue(fakeChokidarWatcher);
  // on() in chokidar's Watcher returns 'this'
  mockChokidarWatcherOn.mockReturnValue(fakeChokidarWatcher);

  bootstrapper = instanceMockFrom(Bootstrapper);
  bootstrapper.bootstrapEnvironment.mockResolvedValue({ noOp: false, outputs: {} } as any);

  cloudExecutable = new MockCloudExecutable({
    stacks: [
      MockStack.MOCK_STACK_A,
      MockStack.MOCK_STACK_B,
    ],
    nestedAssemblies: [{
      stacks: [MockStack.MOCK_STACK_C],
    }],
  });

  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
});

function defaultToolkitSetup() {
  return new CdkToolkit({
    cloudExecutable,
    configuration: cloudExecutable.configuration,
    sdkProvider: cloudExecutable.sdkProvider,
    cloudFormation: new FakeCloudFormation({
      'Test-Stack-A': { Foo: 'Bar' },
      'Test-Stack-B': { Baz: 'Zinga!' },
      'Test-Stack-C': { Baz: 'Zinga!' },
    }),
  });
}

describe('readCurrentTemplate', () => {
  let template: any;
  let mockForEnvironment = jest.fn();
  let mockCloudExecutable: MockCloudExecutable;
  beforeEach(() => {

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
    mockForEnvironment = jest.fn().mockImplementation(() => { return { sdk: mockCloudExecutable.sdkProvider.sdk, didAssumeRole: true }; });
    mockCloudExecutable.sdkProvider.forEnvironment = mockForEnvironment;
    mockCloudExecutable.sdkProvider.stubCloudFormation({
      getTemplate() {
        return {
          TemplateBody: JSON.stringify(template),
        };
      },
      describeStacks() {
        return {
          Stacks: [
            {
              StackName: 'Test-Stack-C',
              StackStatus: 'CREATE_COMPLETE',
              CreationTime: new Date(),
            },
            {
              StackName: 'Test-Stack-A',
              StackStatus: 'CREATE_COMPLETE',
              CreationTime: new Date(),
            },
          ],
        };
      },
    });
  });

  test('lookup role is used', async () => {
    // GIVEN
    let requestedParameterName: string;
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter(request) {
        requestedParameterName = request.Name;
        return {
          Parameter: {
            Value: '6',
          },
        };
      },
    });
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(requestedParameterName!).toEqual('/bootstrap/parameter');
    expect(mockForEnvironment.mock.calls.length).toEqual(2);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: 'bloop-lookup:here:123456789012',
    });
  });

  test('fallback to deploy role if bootstrap stack version is not valid', async () => {
    // GIVEN
    let requestedParameterName: string;
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter(request) {
        requestedParameterName = request.Name;
        return {
          Parameter: {
            Value: '1',
          },
        };
      },
    });
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(expect.arrayContaining([
      expect.stringMatching(/Could not assume bloop-lookup:here:123456789012/),
      expect.stringMatching(/please upgrade to bootstrap version >= 5/),
    ]));
    expect(requestedParameterName!).toEqual('/bootstrap/parameter');
    expect(mockForEnvironment.mock.calls.length).toEqual(3);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: 'bloop-lookup:here:123456789012',
    });
    expect(mockForEnvironment.mock.calls[1][2]).toEqual({
      assumeRoleArn: 'bloop:here:123456789012',
    });
  });

  test('fallback to deploy role if bootstrap version parameter not found', async () => {
    // GIVEN
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter() {
        throw new Error('not found');
      },
    });
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(expect.arrayContaining([
      expect.stringMatching(/Could not assume bloop-lookup:here:123456789012/),
      expect.stringMatching(/please upgrade to bootstrap version >= 5/),
    ]));
    expect(mockForEnvironment.mock.calls.length).toEqual(3);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: 'bloop-lookup:here:123456789012',
    });
    expect(mockForEnvironment.mock.calls[1][2]).toEqual({
      assumeRoleArn: 'bloop:here:123456789012',
    });
  });

  test('fallback to deploy role if forEnvironment throws', async () => {
    // GIVEN
    // throw error first for the 'prepareSdkWithLookupRoleFor' call and succeed for the rest
    mockForEnvironment = jest.fn().mockImplementationOnce(() => { throw new Error('error'); })
      .mockImplementation(() => { return { sdk: mockCloudExecutable.sdkProvider.sdk, didAssumeRole: true };});
    mockCloudExecutable.sdkProvider.forEnvironment = mockForEnvironment;
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter() {
        return { };
      },
    });
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(mockCloudExecutable.sdkProvider.sdk.ssm).not.toHaveBeenCalled();
    expect(flatten(stderrMock.mock.calls)).toEqual(expect.arrayContaining([
      expect.stringMatching(/Could not assume bloop-lookup:here:123456789012/),
      expect.stringMatching(/please upgrade to bootstrap version >= 5/),
    ]));
    expect(mockForEnvironment.mock.calls.length).toEqual(3);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: 'bloop-lookup:here:123456789012',
    });
    expect(mockForEnvironment.mock.calls[1][2]).toEqual({
      assumeRoleArn: 'bloop:here:123456789012',
    });
  });

  test('dont lookup bootstrap version parameter if default credentials are used', async () => {
    // GIVEN
    mockForEnvironment = jest.fn().mockImplementation(() => { return { sdk: mockCloudExecutable.sdkProvider.sdk, didAssumeRole: false }; });
    mockCloudExecutable.sdkProvider.forEnvironment = mockForEnvironment;
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter() {
        return { };
      },
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-C'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).toEqual(expect.arrayContaining([
      expect.stringMatching(/please upgrade to bootstrap version >= 5/),
    ]));
    expect(mockCloudExecutable.sdkProvider.sdk.ssm).not.toHaveBeenCalled();
    expect(mockForEnvironment.mock.calls.length).toEqual(3);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: 'bloop-lookup:here:123456789012',
    });
    expect(mockForEnvironment.mock.calls[1][2]).toEqual({
      assumeRoleArn: 'bloop:here:123456789012',
    });
  });

  test('do not print warnings if lookup role not provided in stack artifact', async () => {
    // GIVEN
    mockCloudExecutable.sdkProvider.stubSSM({
      getParameter() {
        return {};
      },
    });
    const cdkToolkit = new CdkToolkit({
      cloudExecutable: mockCloudExecutable,
      configuration: mockCloudExecutable.configuration,
      sdkProvider: mockCloudExecutable.sdkProvider,
      cloudFormation: new CloudFormationDeployments({ sdkProvider: mockCloudExecutable.sdkProvider }),
    });

    // WHEN
    await cdkToolkit.deploy({
      selector: { patterns: ['Test-Stack-A'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(flatten(stderrMock.mock.calls)).not.toEqual(expect.arrayContaining([
      expect.stringMatching(/Could not assume/),
      expect.stringMatching(/please upgrade to bootstrap version/),
    ]));
    expect(mockCloudExecutable.sdkProvider.sdk.ssm).not.toHaveBeenCalled();
    expect(mockForEnvironment.mock.calls.length).toEqual(2);
    expect(mockForEnvironment.mock.calls[0][2]).toEqual({
      assumeRoleArn: undefined,
      assumeRoleExternalId: undefined,
    });
  });
});

describe('deploy', () => {
  test('fails when no valid stack names are given', async () => {
    // GIVEN
    const toolkit = defaultToolkitSetup();

    // WHEN
    await expect(() => toolkit.deploy({
      selector: { patterns: ['Test-Stack-D'] },
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    })).rejects.toThrow('No stacks match the name(s) Test-Stack-D');
  });

  describe('with hotswap deployment', () => {
    test("passes through the 'hotswap' option to CloudFormationDeployments.deployStack()", async () => {
      // GIVEN
      const mockCfnDeployments = instanceMockFrom(CloudFormationDeployments);
      mockCfnDeployments.deployStack.mockReturnValue(Promise.resolve({
        noOp: false,
        outputs: {},
        stackArn: 'stackArn',
        stackArtifact: instanceMockFrom(cxapi.CloudFormationStackArtifact),
      }));
      const cdkToolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: mockCfnDeployments,
      });

      // WHEN
      await cdkToolkit.deploy({
        selector: { patterns: ['Test-Stack-A-Display-Name'] },
        requireApproval: RequireApproval.Never,
        hotswap: HotswapMode.FALL_BACK,
      });

      // THEN
      expect(mockCfnDeployments.deployStack).toHaveBeenCalledWith(expect.objectContaining({
        hotswap: HotswapMode.FALL_BACK,
      }));
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

    test('with sns notification arns', async () => {
      // GIVEN
      const notificationArns = [
        'arn:aws:sns:us-east-2:444455556666:MyTopic',
        'arn:aws:sns:eu-west-1:111155556666:my-great-topic',
      ];
      const toolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: new FakeCloudFormation({
          'Test-Stack-A': { Foo: 'Bar' },
          'Test-Stack-B': { Baz: 'Zinga!' },
        }, notificationArns),
      });

      // WHEN
      await toolkit.deploy({
        selector: { patterns: ['Test-Stack-A', 'Test-Stack-B'] },
        notificationArns,
        hotswap: HotswapMode.FULL_DEPLOYMENT,
      });
    });

    test('fail with incorrect sns notification arns', async () => {
      // GIVEN
      const notificationArns = ['arn:::cfn-my-cool-topic'];
      const toolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: new FakeCloudFormation({
          'Test-Stack-A': { Foo: 'Bar' },
        }, notificationArns),
      });

      // WHEN
      await expect(() =>
        toolkit.deploy({
          selector: { patterns: ['Test-Stack-A'] },
          notificationArns,
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        }),
      ).rejects.toThrow('Notification arn arn:::cfn-my-cool-topic is not a valid arn for an SNS topic');

    });

    test('globless bootstrap uses environment without question', async () => {
    // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.bootstrap(['aws://56789/south-pole'], bootstrapper, {});

      // THEN
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledWith({
        account: '56789',
        region: 'south-pole',
        name: 'aws://56789/south-pole',
      }, expect.anything(), expect.anything());
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledTimes(1);
    });

    test('globby bootstrap uses whats in the stacks', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();
      cloudExecutable.configuration.settings.set(['app'], 'something');

      // WHEN
      await toolkit.bootstrap(['aws://*/bermuda-triangle-1'], bootstrapper, {});

      // THEN
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledWith({
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      }, expect.anything(), expect.anything());
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledTimes(1);
    });

    test('bootstrap can be invoked without the --app argument', async () => {
      // GIVEN
      cloudExecutable.configuration.settings.clear();
      const mockSynthesize = jest.fn();
      cloudExecutable.synthesize = mockSynthesize;

      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.bootstrap(['aws://123456789012/west-pole'], bootstrapper, {});

      // THEN
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledWith({
        account: '123456789012',
        region: 'west-pole',
        name: 'aws://123456789012/west-pole',
      }, expect.anything(), expect.anything());
      expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledTimes(1);

      expect(cloudExecutable.hasApp).toEqual(false);
      expect(mockSynthesize).not.toHaveBeenCalled();
    });

    test('can disable asset parallelism', async () => {
      // GIVEN
      cloudExecutable = new MockCloudExecutable({
        stacks: [MockStack.MOCK_STACK_WITH_ASSET],
      });
      const fakeCloudFormation = new FakeCloudFormation({});

      const toolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: fakeCloudFormation,
      });

      // WHEN
      // Not the best test but following this through to the asset publishing library fails
      await withMocked(fakeCloudFormation, 'buildStackAssets', async (mockBuildStackAssets) => {
        await toolkit.deploy({
          selector: { patterns: ['Test-Stack-Asset'] },
          assetParallelism: false,
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        });

        expect(mockBuildStackAssets).toHaveBeenCalledWith(expect.objectContaining({
          buildOptions: expect.objectContaining({
            parallel: false,
          }),
        }));
      });
    });

    test('can disable asset prebuild', async () => {
      // GIVEN
      cloudExecutable = new MockCloudExecutable({
        stacks: [MockStack.MOCK_STACK_WITH_ASSET],
      });
      const fakeCloudFormation = new FakeCloudFormation({});

      const toolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: fakeCloudFormation,
      });

      // WHEN
      // Not the best test but following this through to the asset publishing library fails
      await withMocked(fakeCloudFormation, 'buildStackAssets', async (mockBuildStackAssets) => {
        await toolkit.deploy({
          selector: { patterns: ['Test-Stack-Asset'] },
          assetBuildTime: AssetBuildTime.JUST_IN_TIME,
          hotswap: HotswapMode.FULL_DEPLOYMENT,
        });

        expect(mockBuildStackAssets).not.toHaveBeenCalled();
      });
    });
  });
});

describe('destroy', () => {
  test('destroy correct stack', async () => {
    const toolkit = defaultToolkitSetup();

    await expect(() => {
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
    }).rejects.toThrow("Cannot use the 'watch' command without specifying at least one directory to monitor. " +
      'Make sure to add a "watch" key to your cdk.json');
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

    expect(fakeChokidarWatch.excludeArgs).toStrictEqual([
      'cdk.out/**',
      '**/.*',
      '**/.*/**',
      '**/node_modules/**',
    ]);
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

    expect(cdkDeployMock).toBeCalledWith(expect.objectContaining({ concurrency: 3 }));
  });

  describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
    test('passes through the correct hotswap mode to deployStack()', async () => {
      cloudExecutable.configuration.settings.set(['watch'], {});
      const toolkit = defaultToolkitSetup();
      const cdkDeployMock = jest.fn();
      toolkit.deploy = cdkDeployMock;

      await toolkit.watch({ selector: { patterns: [] }, hotswap: hotswapMode });
      fakeChokidarWatcherOn.readyCallback();

      expect(cdkDeployMock).toBeCalledWith(expect.objectContaining({ hotswap: hotswapMode }));
    });
  });

  test('respects HotswapMode.HOTSWAP_ONLY', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({ selector: { patterns: [] }, hotswap: HotswapMode.HOTSWAP_ONLY });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toBeCalledWith(expect.objectContaining({ hotswap: HotswapMode.HOTSWAP_ONLY }));
  });

  test('respects HotswapMode.FALL_BACK', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({ selector: { patterns: [] }, hotswap: HotswapMode.FALL_BACK });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toBeCalledWith(expect.objectContaining({ hotswap: HotswapMode.FALL_BACK }));
  });


  test('respects HotswapMode.FULL_DEPLOYMENT', async () => {
    cloudExecutable.configuration.settings.set(['watch'], {});
    const toolkit = defaultToolkitSetup();
    const cdkDeployMock = jest.fn();
    toolkit.deploy = cdkDeployMock;

    await toolkit.watch({ selector: { patterns: [] }, hotswap: HotswapMode.FULL_DEPLOYMENT });
    fakeChokidarWatcherOn.readyCallback();

    expect(cdkDeployMock).toBeCalledWith(expect.objectContaining({ hotswap: HotswapMode.FULL_DEPLOYMENT }));
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
        await Promise.all([
          fakeChokidarWatcherOn.fileEventCallback('add', 'my-file1'),
          fakeChokidarWatcherOn.fileEventCallback('change', 'my-file2'),
        ]);

        expect(cdkDeployMock).toHaveBeenCalledTimes(3);
      });

      test("batches file changes that happen during 'deploy'", async () => {
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

  afterEach(() => {
    process.env.STACKS_TO_VALIDATE = undefined;
  });

  describe('stack with error and flagged for validation', () => {
    beforeEach(() => {
      cloudExecutable = new MockCloudExecutable({
        stacks: [
          MockStack.MOCK_STACK_A,
          MockStack.MOCK_STACK_B,
        ],
        nestedAssemblies: [{
          stacks: [
            { properties: { validateOnSynth: true }, ...MockStack.MOCK_STACK_WITH_ERROR },
          ],
        }],
      });
    });

    test('causes synth to fail if autoValidate=true', async() => {
      const toolkit = defaultToolkitSetup();
      const autoValidate = true;
      await expect(toolkit.synth([], false, true, autoValidate)).rejects.toBeDefined();
    });

    test('causes synth to succeed if autoValidate=false', async() => {
      const toolkit = defaultToolkitSetup();
      const autoValidate = false;
      await toolkit.synth([], false, true, autoValidate);
      expect(mockData.mock.calls.length).toEqual(0);
    });
  });

  test('stack has error and was explicitly selected', async() => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        MockStack.MOCK_STACK_B,
      ],
      nestedAssemblies: [{
        stacks: [
          { properties: { validateOnSynth: false }, ...MockStack.MOCK_STACK_WITH_ERROR },
        ],
      }],
    });

    const toolkit = defaultToolkitSetup();

    await expect(toolkit.synth(['Test-Stack-A/witherrors'], false, true)).rejects.toBeDefined();
  });

  test('stack has error, is not flagged for validation and was not explicitly selected', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        MockStack.MOCK_STACK_B,
      ],
      nestedAssemblies: [{
        stacks: [
          { properties: { validateOnSynth: false }, ...MockStack.MOCK_STACK_WITH_ERROR },
        ],
      }],
    });

    const toolkit = defaultToolkitSetup();

    await toolkit.synth([], false, true);
  });

  test('stack has dependency and was explicitly selected', async () => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_C,
        MockStack.MOCK_STACK_D,
      ],
    });

    const toolkit = defaultToolkitSetup();

    await toolkit.synth([MockStack.MOCK_STACK_D.stackName], true, false);

    expect(mockData.mock.calls.length).toEqual(1);
    expect(mockData.mock.calls[0][0]).toBeDefined();
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
          data: [
            { key: 'Foo', value: 'Bar' },
          ],
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
          data: [
            { key: 'Baz', value: 'Zinga!' },
          ],
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
          data: [
            { key: 'Baz', value: 'Zinga!' },
          ],
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
          data: [
            { key: 'Baz', value: 'Zinga!' },
          ],
        },
      ],
    },
    depends: [MockStack.MOCK_STACK_C.stackName],
  }
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
  }
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
          destinations: {
          },
        },
      },
    },
  }
}

class FakeCloudFormation extends CloudFormationDeployments {
  private readonly expectedTags: { [stackName: string]: Tag[] } = {};
  private readonly expectedNotificationArns?: string[];

  constructor(
    expectedTags: { [stackName: string]: { [key: string]: string } } = {},
    expectedNotificationArns?: string[],
  ) {
    super({ sdkProvider: new MockSdkProvider() });

    for (const [stackName, tags] of Object.entries(expectedTags)) {
      this.expectedTags[stackName] =
        Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
          .sort((l, r) => l.Key.localeCompare(r.Key));
    }
    if (expectedNotificationArns) {
      this.expectedNotificationArns = expectedNotificationArns;
    }
  }

  public deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    expect([
      MockStack.MOCK_STACK_A.stackName,
      MockStack.MOCK_STACK_B.stackName,
      MockStack.MOCK_STACK_C.stackName,
      MockStack.MOCK_STACK_WITH_ASSET.stackName,
    ]).toContain(options.stack.stackName);

    if (this.expectedTags[options.stack.stackName]) {
      expect(options.tags).toEqual(this.expectedTags[options.stack.stackName]);
    }

    expect(options.notificationArns).toEqual(this.expectedNotificationArns);
    return Promise.resolve({
      stackArn: `arn:aws:cloudformation:::stack/${options.stack.stackName}/MockedOut`,
      noOp: false,
      outputs: { StackName: options.stack.stackName },
      stackArtifact: options.stack,
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
      default:
        return Promise.reject(`Not an expected mock stack: ${stack.stackName}`);
    }
  }
}
