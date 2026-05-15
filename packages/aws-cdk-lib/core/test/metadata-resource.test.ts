/**
 * Unit tests that depend on 'aws-cdk-lib' having been compiled using jsii
 */
import * as zlib from 'zlib';
import { Construct } from 'constructs';
import { ENABLE_ADDITIONAL_METADATA_COLLECTION } from '../../cx-api';
import type { IPolicyValidationPluginBeta1, IPolicyValidationContextBeta1, PolicyValidationPluginReportBeta1 } from '../lib';
import { App, Stack, Stage, Resource } from '../lib';
import { JSII_RUNTIME_SYMBOL } from '../lib/constants';
import { MetadataType } from '../lib/metadata-type';
import { formatAnalytics, parseAnalytics } from '../lib/private/metadata-resource';
import type { ConstructInfo } from '../lib/private/runtime-info';
import { constructAnalyticsFromScope } from '../lib/private/stack-metadata';

describe('MetadataResource', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { return true; });
    jest.spyOn(console, 'error').mockImplementation(() => { return true; });
    app = new App({
      analyticsReporting: true,
    });
    stack = new Stack(app, 'Stack');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('is not included if the region is known and metadata is not available', () => {
    new Stack(app, 'StackUnavailable', {
      env: { region: 'definitely-no-metadata-resource-available-here' },
    });

    const stackTemplate = app.synth().getStackByName('StackUnavailable').template;

    expect(stackTemplate.Resources?.CDKMetadata).toBeUndefined();
  });

  test('is included if the region is known and metadata is available', () => {
    new Stack(app, 'StackPresent', {
      env: { region: 'us-east-1' },
    });

    const stackTemplate = app.synth().getStackByName('StackPresent').template;

    expect(stackTemplate.Resources?.CDKMetadata).toBeDefined();
  });

  test('is included if the region is unknown with conditions', () => {
    new Stack(app, 'StackUnknown');

    const stackTemplate = app.synth().getStackByName('StackUnknown').template;

    expect(stackTemplate.Resources?.CDKMetadata).toBeDefined();
    expect(stackTemplate.Resources?.CDKMetadata?.Condition).toBeDefined();
  });

  test('when no metadata is added by default, CDKMetadata should be the same', () => {
    const myApps = [
      new App({
        analyticsReporting: true,
        postCliContext: {
          [ENABLE_ADDITIONAL_METADATA_COLLECTION]: true,
        },
      }),
      new App({
        analyticsReporting: true,
        postCliContext: {
          [ENABLE_ADDITIONAL_METADATA_COLLECTION]: false,
        },
      }),
      new App({
        analyticsReporting: true,
        postCliContext: {
          [ENABLE_ADDITIONAL_METADATA_COLLECTION]: undefined,
        },
      }),
    ];

    for (const myApp of myApps) {
      new Stack(myApp, 'MyStack');
    }

    const stackTemplate1 = myApps[0].synth().getStackByName('MyStack').template;
    const stackTemplate2 = myApps[1].synth().getStackByName('MyStack').template;
    const stackTemplate3 = myApps[2].synth().getStackByName('MyStack').template;
    expect(stackTemplate1.Resources?.CDKMetadata).toEqual(stackTemplate2.Resources?.CDKMetadata);
    expect(stackTemplate1.Resources?.CDKMetadata).toEqual(stackTemplate3.Resources?.CDKMetadata);
  });

  test('includes the formatted Analytics property', () => {
    // A very simple check that the jsii runtime psuedo-construct is present.
    // This check works whether we're running locally or on CodeBuild, on v1 or v2.
    // Other tests(in app.test.ts) will test version-specific results.
    expect(stackAnalytics()).toMatch(/jsii-runtime.Runtime/);
  });

  test('includes the current jsii runtime version', () => {
    process.env.JSII_AGENT = 'Java/1.2.3.4';

    expect(stackAnalytics()).toContain('Java/1.2.3.4!jsii-runtime.Runtime');
    delete process.env.JSII_AGENT;
  });

  test('includes constructs added to the stack', () => {
    new TestConstruct(stack, 'Test');

    expect(stackAnalytics()).toContain('FakeVersion.2.3!@amzn/core.TestConstruct');
  });

  test('only includes constructs in the allow list', () => {
    new TestThirdPartyConstruct(stack, 'Test');

    expect(stackAnalytics()).not.toContain('TestConstruct');
  });

  test('validation plugins included', () => {
    const newApp = new App({
      analyticsReporting: true,
      policyValidationBeta1: [
        new ValidationPlugin('plugin1'),
      ],
    });

    const stage1 = new Stage(newApp, 'Stage1', {
      policyValidationBeta1: [
        new ValidationPlugin('plugin11'),
      ],
    });

    const stack1 = new Stack(stage1, 'Stack1', { stackName: 'stack1' });

    const stage2 = new Stage(newApp, 'Stage2', {
      policyValidationBeta1: [
        new ValidationPlugin('plugin12'),
      ],
    });
    const stack2 = new Stack(stage2, 'Stack2', { stackName: 'stack1' });

    expect(stackAnalytics(stage1, stack1.stackName)).toMatch(/policyValidation.{plugin11,plugin1}/);
    expect(stackAnalytics(stage2, stack2.stackName)).toMatch(/policyValidation.{plugin12,plugin1}/);
  });

  test('metadata types are filtered correctly', () => {
    const construct = new TestConstruct(stack, 'Test');
    construct.node.addMetadata(MetadataType.CONSTRUCT, { hello: 'world' });
    construct.node.addMetadata(MetadataType.METHOD, {
      bool: true,
      nested: { foo: 'bar' },
      arr: [1, 2, 3],
      str: 'foo',
      arrOfObjects: [{ foo: { hello: 'world' } }],
    });
    construct.node.addMetadata(MetadataType.FEATURE_FLAG, 'foobar');
    construct.node.addMetadata('hello', { bool: true, nested: { foo: 'bar' }, arr: [1, 2, 3], str: 'foo' });

    const analytics = constructAnalyticsFromScope(construct);
    expect(analytics).toBeDefined();
    expect(analytics.length).toBe(2); // TestConstruct + jsii-runtime
    expect(analytics[0].fqn).toEqual('@amzn/core.TestConstruct');
    expect(analytics[0].additionalTelemetry).toBeDefined();
    expect(analytics[0].additionalTelemetry).toEqual([
      { hello: 'world' },
      {
        bool: true,
        nested: { foo: 'bar' },
        arr: [1, 2, 3],
        str: 'foo',
        arrOfObjects: [{ foo: { hello: 'world' } }],
      },
      'foobar',
    ]);
  });

  test('mixin metadata is always collected', () => {
    const construct = new TestConstruct(stack, 'Test');
    construct.node.addMetadata(MetadataType.MIXIN, { mixin: '@aws-cdk/mixins-preview.TestMixin' });

    const analytics = constructAnalyticsFromScope(construct);
    expect(analytics[0].metadata).toEqual([{ mixin: '@aws-cdk/mixins-preview.TestMixin' }]);
  });

  test('mixin metadata is included even without feature flag', () => {
    const appWithoutFlag = new App({
      analyticsReporting: true,
      postCliContext: {
        [ENABLE_ADDITIONAL_METADATA_COLLECTION]: false,
      },
    });
    const stackWithoutFlag = new Stack(appWithoutFlag, 'Stack');
    const construct = new TestConstruct(stackWithoutFlag, 'Test');
    construct.node.addMetadata(MetadataType.MIXIN, { mixin: '@aws-cdk/mixins-preview.TestMixin' });

    const analytics = constructAnalyticsFromScope(construct);
    expect(analytics[0].metadata).toEqual([{ mixin: '@aws-cdk/mixins-preview.TestMixin' }]);
  });

  function stackAnalytics(stage: Stage = app, stackName: string = 'Stack') {
    let stackArtifact;
    if (App.isApp(stage)) {
      stackArtifact = stage.synth().getStackByName(stackName);
    } else {
      const a = App.of(stage)!;
      stackArtifact = a.synth().getNestedAssembly(stage.artifactId).getStackByName(stackName);
    }
    let encodedAnalytics = stackArtifact.template.Resources?.CDKMetadata?.Properties?.Analytics as string;
    return plaintextConstructsFromAnalytics(encodedAnalytics);
  }
});

describe('formatAnalytics', () => {
  test('analytics are formatted with a prefix of v2:deflate64:', () => {
    const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];

    expect(formatAnalytics(constructInfo)).toMatch(/v2:deflate64:.*/);
  });

  test('single construct', () => {
    const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];

    expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.Construct');
  });

  test('common prefixes with same versions are combined', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
    ];

    expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack}');
  });

  test('nested modules with common prefixes and same versions are combined', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.aws_servicefoo.CoolResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.aws_servicefoo.OtherResource', version: '1.2.3' },
    ];

    expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack,aws_servicefoo.{CoolResource,OtherResource}}');
  });

  test('constructs are grouped by version', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CoolResource', version: '0.1.2' },
      { fqn: 'aws-cdk-lib.OtherResource', version: '0.1.2' },
    ];

    expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack},0.1.2!aws-cdk-lib.{CoolResource,OtherResource}');
  });

  it.each([
    [[{ custom: { foo: 'bar' } }], '1.2.3!aws-cdk-lib.Construct[{\"custom\":{\"foo\":\"bar\"}}]'],
    [[], '1.2.3!aws-cdk-lib.Construct'],
    [undefined, '1.2.3!aws-cdk-lib.Construct'],
  ])('format analytics with metadata and enabled additional telemetry', (additionalTelemetry, output) => {
    const constructAnalytics = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3', additionalTelemetry },
    ];

    expect(plaintextConstructsFromAnalytics(formatAnalytics(constructAnalytics))).toMatch(output);
  });

  test('ensure gzip is encoded with "unknown" operating system to maintain consistent output across systems', () => {
    const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];
    const analytics = formatAnalytics(constructInfo);
    const gzip = Buffer.from(analytics.split(':')[2], 'base64');
    expect(gzip[9]).toBe(255);
  });

  // Compares the output of formatAnalytics with an expected (plaintext) output.
  // For ease of testing, the plaintext versions are compared rather than the encoded versions.
  function expectAnalytics(constructs: ConstructInfo[], expectedPlaintext: string) {
    expect(plaintextConstructsFromAnalytics(formatAnalytics(constructs))).toEqual(expectedPlaintext);
  }
});

describe('parseAnalytics', () => {
  test('parseAnalytics is the inverse of formatAnalytics for single construct', () => {
    const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];
    const analytics = formatAnalytics(constructInfo);
    expect(parseAnalytics(analytics)).toEqual(constructInfo);
  });

  test('parseAnalytics is the inverse of formatAnalytics for multiple constructs', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
    ];
    const analytics = formatAnalytics(constructInfo);
    expect(parseAnalytics(analytics)).toEqual(constructInfo);
  });

  test('parseAnalytics is the inverse of formatAnalytics for nested modules', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.aws_servicefoo.CoolResource', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.aws_servicefoo.OtherResource', version: '1.2.3' },
    ];
    const analytics = formatAnalytics(constructInfo);
    expect(parseAnalytics(analytics)).toEqual(constructInfo);
  });

  test('parseAnalytics is the inverse of formatAnalytics for different versions', () => {
    const constructInfo = [
      { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
      { fqn: 'aws-cdk-lib.CoolResource', version: '0.1.2' },
    ];
    const analytics = formatAnalytics(constructInfo);
    expect(parseAnalytics(analytics)).toEqual(constructInfo);
  });
});

function plaintextConstructsFromAnalytics(analytics: string) {
  return zlib.gunzipSync(Buffer.from(analytics.split(':')[2], 'base64')).toString('utf-8');
}

class TestConstruct extends Resource {
  // @ts-ignore
  private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@amzn/core.TestConstruct', version: 'FakeVersion.2.3' };
}

class TestThirdPartyConstruct extends Construct {
  // @ts-ignore
  private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: 'mycoolthing.TestConstruct', version: '1.2.3' };
}

class ValidationPlugin implements IPolicyValidationPluginBeta1 {
  constructor(public readonly name: string) {}

  validate(_context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
    return {
      success: true,
      violations: [],
    };
  }
}
