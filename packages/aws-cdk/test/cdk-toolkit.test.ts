import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormationDeployments, DeployStackOptions } from '../lib/api/cloudformation-deployments';
import { DeployStackResult } from '../lib/api/deploy-stack';
import { Template } from '../lib/api/util/cloudformation';
import { CdkToolkit, Tag } from '../lib/cdk-toolkit';
import { MockCloudExecutable } from './util';

let cloudExecutable: MockCloudExecutable;
beforeEach(() => {
  cloudExecutable = new MockCloudExecutable({
    stacks: [
      MockStack.MOCK_STACK_A,
      MockStack.MOCK_STACK_B,
    ],
  });
});

describe('deploy', () => {
  describe('makes correct CloudFormation calls', () => {
    test('without options', () => {
      // GIVEN
      const toolkit = new CdkToolkit({
        cloudExecutable,
        configuration: cloudExecutable.configuration,
        sdkProvider: cloudExecutable.sdkProvider,
        cloudFormation: new FakeCloudFormation({
          'Test-Stack-A': { Foo: 'Bar' },
          'Test-Stack-B': { Baz: 'Zinga!' },
        }),
      });

      // WHEN
      toolkit.deploy({ stackNames: ['Test-Stack-A', 'Test-Stack-B'] });
    });

    test('with sns notification arns', () => {
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
      toolkit.deploy({
        stackNames: ['Test-Stack-A', 'Test-Stack-B'],
        notificationArns,
      });
    });
  });
});

class MockStack {
  public static readonly MOCK_STACK_A = new MockStack('Test-Stack-A');
  public static readonly MOCK_STACK_B = new MockStack('Test-Stack-B');

  constructor(
    public readonly stackName: string,
    public readonly template: any = { Resources: { TempalteName: stackName } },
    public readonly templateFile: string = `fake/stack/${stackName}.json`,
    public readonly assets: cxapi.AssetMetadataEntry[] = [],
    public readonly parameters: { [id: string]: string } = {},
    public readonly environment: cxapi.Environment = { name: 'MockEnv', account: '123456789012', region: 'bermuda-triangle-1' },
  ) {}
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
          .sort((l, r) =>  l.Key.localeCompare(r.Key));
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
