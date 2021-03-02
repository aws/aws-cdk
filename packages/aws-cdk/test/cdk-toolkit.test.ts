import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Bootstrapper } from '../lib/api/bootstrap';
import { CloudFormationDeployments, DeployStackOptions } from '../lib/api/cloudformation-deployments';
import { DeployStackResult } from '../lib/api/deploy-stack';
import { Template } from '../lib/api/util/cloudformation';
import { CdkToolkit, Tag } from '../lib/cdk-toolkit';
import { MockCloudExecutable, TestStackArtifact, instanceMockFrom } from './util';

let cloudExecutable: MockCloudExecutable;
let bootstrapper: jest.Mocked<Bootstrapper>;
beforeEach(() => {
  bootstrapper = instanceMockFrom(Bootstrapper);
  bootstrapper.bootstrapEnvironment.mockResolvedValue({ noOp: false, outputs: {} } as any);

  cloudExecutable = new MockCloudExecutable({
    stacks: [
      MockStack.MOCK_STACK_A,
      MockStack.MOCK_STACK_B,
    ],
  });

});

function defaultToolkitSetup() {
  return new CdkToolkit({
    cloudExecutable,
    configuration: cloudExecutable.configuration,
    sdkProvider: cloudExecutable.sdkProvider,
    cloudFormation: new FakeCloudFormation({
      'Test-Stack-A': { Foo: 'Bar' },
      'Test-Stack-B': { Baz: 'Zinga!' },
    }),
  });
}

describe('deploy', () => {
  describe('makes correct CloudFormation calls', () => {
    test('without options', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({ stackNames: ['Test-Stack-A', 'Test-Stack-B'] });
    });

    test('with one stack specified', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({ stackNames: ['Test-Stack-A'] });
    });

    test('with stacks all stacks specified as wildcard', async () => {
      // GIVEN
      const toolkit = defaultToolkitSetup();

      // WHEN
      await toolkit.deploy({ stackNames: ['*'] });
    });

    test('with sns notification arns', async () => {
      // GIVEN
      const notificationArns = ['arn:aws:sns:::cfn-notifications', 'arn:aws:sns:::my-cool-topic'];
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
        stackNames: ['Test-Stack-A', 'Test-Stack-B'],
        notificationArns,
      });
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
  });
});

describe('synth', () => {
  test('with no stdout option', async () => {
    // GIVE
    const toolkit = defaultToolkitSetup();

    // THEN
    await expect(toolkit.synth(['Test-Stack-A'], false, true)).resolves.toBeUndefined();
  });
});

class MockStack {
  public static readonly MOCK_STACK_A: TestStackArtifact = {
    stackName: 'Test-Stack-A',
    template: { Resources: { TempalteName: 'Test-Stack-A' } },
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
  };
  public static readonly MOCK_STACK_B: TestStackArtifact = {
    stackName: 'Test-Stack-B',
    template: { Resources: { TempalteName: 'Test-Stack-B' } },
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
}

class FakeCloudFormation extends CloudFormationDeployments {
  private readonly expectedTags: { [stackName: string]: Tag[] } = {};
  private readonly expectedNotificationArns?: string[];

  constructor(
    expectedTags: { [stackName: string]: { [key: string]: string } } = {},
    expectedNotificationArns?: string[],
  ) {
    super({ sdkProvider: undefined as any });

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
    expect([MockStack.MOCK_STACK_A.stackName, MockStack.MOCK_STACK_B.stackName])
      .toContain(options.stack.stackName);
    expect(options.tags).toEqual(this.expectedTags[options.stack.stackName]);
    expect(options.notificationArns).toEqual(this.expectedNotificationArns);
    return Promise.resolve({
      stackArn: `arn:aws:cloudformation:::stack/${options.stack.stackName}/MockedOut`,
      noOp: false,
      outputs: { StackName: options.stack.stackName },
      stackArtifact: options.stack,
    });
  }

  public readCurrentTemplate(stack: cxapi.CloudFormationStackArtifact): Promise<Template> {
    switch (stack.stackName) {
      case MockStack.MOCK_STACK_A.stackName:
        return Promise.resolve({});
      case MockStack.MOCK_STACK_B.stackName:
        return Promise.resolve({});
      default:
        return Promise.reject(`Not an expected mock stack: ${stack.stackName}`);
    }
  }
}
