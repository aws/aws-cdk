import * as cxapi from '@aws-cdk/cx-api';
import { AppStacks, Tag } from '../lib/api/cxapp/stacks';
import { DeployStackResult } from '../lib/api/deploy-stack';
import { DeployStackOptions, IDeploymentTarget, Template } from '../lib/api/deployment-target';
import { SDK } from '../lib/api/util/sdk';
import { CdkToolkit } from '../lib/cdk-toolkit';

describe('deploy', () => {
  describe('makes correct CloudFormation calls', () => {
    test('without options', () => {
      // GIVEN
      const toolkit = new CdkToolkit({
        appStacks: new TestAppStacks(),
        provisioner: new TestProvisioner({
          'Test-Stack-A': { Foo: 'Bar' },
          'Test-Stack-B': { Baz: 'Zinga!' },
        }),
      });

      // WHEN
      toolkit.deploy({ stackNames: ['Test-Stack-A', 'Test-Stack-B'], sdk: new SDK() });
    });

    test('with sns notification arns', () => {
      // GIVEN
      const notificationArns = ['arn:aws:sns:::cfn-notifications', 'arn:aws:sns:::my-cool-topic'];
      const toolkit = new CdkToolkit({
        appStacks: new TestAppStacks(),
        provisioner: new TestProvisioner({
          'Test-Stack-A': { Foo: 'Bar' },
          'Test-Stack-B': { Baz: 'Zinga!' },
        }, notificationArns),
      });

      // WHEN
      toolkit.deploy({
        stackNames: ['Test-Stack-A', 'Test-Stack-B'],
        notificationArns,
        sdk: new SDK()
      });
    });
  });
});

class MockStack {
  constructor(
    public readonly stackName: string,
    public readonly template: any = { Resources: { TempalteName: stackName } },
    public readonly templateFile: string = `fake/stack/${stackName}.json`,
    public readonly assets: cxapi.AssetMetadataEntry[] = [],
    public readonly parameters: { [id: string]: string } = {},
    public readonly environment: cxapi.Environment = { name: 'MockEnv', account: '123456789012', region: 'bermuda-triangle-1' },
  ) {}
}

class TestAppStacks extends AppStacks {
  public static readonly MOCK_STACK_A = new MockStack('Test-Stack-A');
  public static readonly MOCK_STACK_B = new MockStack('Test-Stack-B');

  constructor() {
    super(undefined as any);
  }

  public getTagsFromStackMetadata(stack: cxapi.CloudFormationStackArtifact): Tag[] {
    switch (stack.stackName) {
      case TestAppStacks.MOCK_STACK_A.stackName:
        return [{ Key: 'Foo', Value: 'Bar' }];
      case TestAppStacks.MOCK_STACK_B.stackName:
        return [{ Key: 'Baz', Value: 'Zinga!' }];
      default:
        throw new Error(`Not an expected mock stack: ${stack.stackName}`);
    }
  }

  public selectStacks(selectors: string[]): Promise<cxapi.CloudFormationStackArtifact[]> {
    expect(selectors).toEqual(['Test-Stack-A', 'Test-Stack-B']);
    return Promise.resolve([
      // Cheating the type system here (intentionally, so we have to stub less!)
      TestAppStacks.MOCK_STACK_A as cxapi.CloudFormationStackArtifact,
      TestAppStacks.MOCK_STACK_B as cxapi.CloudFormationStackArtifact,
    ]);
  }

  public processMetadata(stacks: cxapi.CloudFormationStackArtifact[]): void {
    stacks.forEach(stack =>
      expect([TestAppStacks.MOCK_STACK_A, TestAppStacks.MOCK_STACK_B]).toContain(stack));
  }

  public listStacks(): never {
    throw new Error('Not Implemented');
  }

  public synthesizeStack(): never {
    throw new Error('Not Implemented');
  }

  public synthesizeStacks(): never {
    throw new Error('Not Implemented');
  }
}

class TestProvisioner implements IDeploymentTarget {
  private readonly expectedTags: { [stackName: string]: Tag[] } = {};
  private readonly expectedNotificationArns?: string[];

  constructor(
    expectedTags: { [stackName: string]: { [key: string]: string } } = {},
    expectedNotificationArns?: string[],
  ) {
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
    expect([TestAppStacks.MOCK_STACK_A.stackName, TestAppStacks.MOCK_STACK_B.stackName])
      .toContain(options.stack.stackName);
    expect(options.tags).toEqual(this.expectedTags[options.stack.stackName]);
    expect(options.notificationArns).toEqual(this.expectedNotificationArns);
    return Promise.resolve({
      stackArn: `arn:aws:cloudformation:::stack/${options.stack.stackName}/MockedOut`,
      noOp: false,
      outputs: { StackName: options.stack.stackName },
    });
  }

  public readCurrentTemplate(stack: cxapi.CloudFormationStackArtifact): Promise<Template> {
    switch (stack.stackName) {
      case TestAppStacks.MOCK_STACK_A.stackName:
        return Promise.resolve({});
      case TestAppStacks.MOCK_STACK_B.stackName:
        return Promise.resolve({});
      default:
        return Promise.reject(`Not an expected mock stack: ${stack.stackName}`);
    }
  }
}
