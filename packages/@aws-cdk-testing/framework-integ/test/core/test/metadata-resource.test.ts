import { constructAnalyticsFromScope } from 'aws-cdk-lib/core/lib/helpers-internal';
import { localCdkVersion } from './util';
import type { IPolicyValidationPluginBeta1, PolicyViolationBeta1, PolicyValidationPluginReportBeta1, IPolicyValidationContextBeta1 } from 'aws-cdk-lib/core';
import { App, NestedStack, Stack, Stage } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    analyticsReporting: true,
  });
});

describe('constructAnalyticsFromScope', () => {
  test('returns stack itself and jsii runtime if stack is empty', () => {
    const constructInfos = constructAnalyticsFromScope(stack);

    expect(constructInfos.length).toEqual(2);

    const stackInfo = constructInfos.find(i => /Stack/.test(i.fqn));
    const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
    expect(stackInfo?.fqn).toEqual('aws-cdk-lib.Stack');
    expect(stackInfo?.version).toEqual(localCdkVersion());
    expect(jsiiInfo?.version).toMatch(/node.js/);
  });

  test('sanitizes jsii runtime info to remove unwanted characters', () => {
    process.env.JSII_AGENT = 'DotNet/5.0.3/.NETCore^App,Version=v3.1!/1.0.0_0';
    const constructInfos = constructAnalyticsFromScope(stack);
    const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');

    expect(jsiiInfo?.version).toEqual('DotNet/5.0.3/.NETCore-App-Version=v3.1-/1.0.0_0');

    delete process.env.JSII_AGENT;
  });

  test('returns info for constructs added to the stack', () => {
    new TestConstruct(stack, 'TestConstruct');

    const constructInfos = constructAnalyticsFromScope(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('returns unique info (no duplicates)', () => {
    new TestConstruct(stack, 'TestConstruct1');
    new TestConstruct(stack, 'TestConstruct2');

    const constructInfos = constructAnalyticsFromScope(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('returns info from nested constructs', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        new TestConstruct(this, 'TestConstruct');
      }
    }(stack, 'Nested');

    const constructInfos = constructAnalyticsFromScope(stack);

    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('does not return info from nested stacks', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new TestConstruct(this, 'TestConstruct');

        new class extends Stack {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestStackInsideStack', version: localCdkVersion() };
        }(this, 'StackInsideStack');

        new class extends NestedStack {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestNestedStackInsideStack', version: localCdkVersion() };
        }(this, 'NestedStackInsideStack');

        new class extends Stage {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestStageInsideStack', version: localCdkVersion() };
        }(this, 'StageInsideStack');
      }
    }(stack, 'ParentConstruct');

    const constructInfos = constructAnalyticsFromScope(stack);

    const fqns = constructInfos.map(info => info.fqn);
    expect(fqns).toContain('@aws-cdk/test.TestConstruct');
    expect(fqns).not.toContain('@aws-cdk/test.TestStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestNestedStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestStageInsideStack');
  });

  test('return info from validator plugins', () => {
    const validatedApp = new App({
      policyValidationBeta1: [new FakePlugin('fake', [], '1.0.0', ['RULE_1', 'RULE_2'])],
    });
    const validatedStack = new Stack(validatedApp, 'ValidatedStack');
    const constructInfos = constructAnalyticsFromScope(validatedStack);

    expect(constructInfos.map(info => info.fqn)).toContain('policyValidation.fake.RULE_1|RULE_2');
  });

  test('does not return info from validator plugins when no plugin is registered', () => {
    const constructInfos = constructAnalyticsFromScope(stack);

    expect(constructInfos.map(info => info.fqn)).not.toEqual(expect.arrayContaining([
      expect.stringMatching(/^policyValidation\./),
    ]));
  });
});

class TestConstruct extends Construct {
  // @ts-ignore
  private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestConstruct', version: localCdkVersion() };
}

class FakePlugin implements IPolicyValidationPluginBeta1 {
  constructor(
    public readonly name: string,
    private readonly violations: PolicyViolationBeta1[],
    public readonly version?: string,
    public readonly ruleIds?: string []) {
  }

  validate(_context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
      pluginVersion: this.version,
    };
  }
}
