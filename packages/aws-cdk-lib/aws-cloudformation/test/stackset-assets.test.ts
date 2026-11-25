import fs from 'fs';
import path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import * as sns from '../../aws-sns';
import * as core from '../../core';
import {
  Annotations as CoreAnnotations,
  App,
  CfnCapabilities,
  CfnOutput,
  CfnParameter,
  DefaultStackSynthesizer,
  Stack,
  Stage,
  Token,
} from '../../core';
import type { StackSynthesizer } from '../../core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import * as cxapi from '../../cx-api';
import type { StackSetProps } from '../lib';
import {
  DeploymentType,
  NestedStack,
  StackSet,
  StackSetAssets,
  StackSetGrants,
  StackSetTarget,
} from '../lib';

class LambdaStackSet extends StackSet {
  constructor(scope: Construct, id: string, props?: StackSetProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    new lambda.Function(this, 'Lambda2', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}

/**
 * A StackSet is not a cloud assembly artifact, so read its template file from the assembly
 */
function stackSetTemplateOf(stackSet: StackSet): Template {
  const assembly = Stage.of(stackSet)!.synth();
  return Template.fromJSON(JSON.parse(fs.readFileSync(path.join(assembly.directory, stackSet.templateFile), 'utf-8')));
}

test('requires asset bucket to be passed', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new LambdaStackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      })],
      capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
    });
  }).toThrow('an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSet props');
});

test('test lambda assets with one asset bucket', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets') }),
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 1);
});

test('test lambda assets with two asset buckets', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: StackSetAssets.fromRegionalBuckets({
      'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets'),
      'eu-west-1': s3.Bucket.fromBucketName(stack, 'AssetBucket2', 'integ-assets2'),
    }),
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 2);
});

test('lambda asset bucket name is looked up by region in the stackset template', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stage = new Stage(app, 'Stage', { env: { account: '123456789012', region: 'us-east-1' } });
  const stack = new Stack(stage, 'Parent');
  const lambdaStack = new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    })],
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  stackSetTemplateOf(lambdaStack).hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      S3Bucket: { 'Fn::FindInMap': ['StackSetAssetBuckets', { Ref: 'AWS::Region' }, 'BucketName'] },
    },
  });
});

test('lambda asset is staged to the parent asset bucket and copied via bucket deployment', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets') }),
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    })],
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
    SourceBucketNames: [
      { 'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}' },
    ],
    DestinationBucketName: 'integ-assets',
  });
});

test('httpUrl and s3Url use the regional S3 endpoint', () => {
  const app = new App();
  const stack = new Stack(app, 'Admin');
  const stackSet = new StackSet(stack, 'StackSet', {
    assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
  });
  const scriptPath = path.join(__dirname, 'stackset-script', 'script.py');
  const script = new s3_assets.Asset(stackSet, 'Script', { path: scriptPath });
  const location = stackSet.synthesizer.addFileAsset({
    sourceHash: script.assetHash, fileName: scriptPath, packaging: core.FileAssetPackaging.FILE,
  });
  new CfnOutput(stackSet, 'HttpUrl', { value: script.httpUrl });
  new CfnOutput(stackSet, 'S3Url', { value: location.s3Url ?? 'no s3Url' });

  const outputs = stackSetTemplateOf(stackSet).toJSON().Outputs;
  const expectedUrl = {
    'Fn::Join': ['', [
      'https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/',
      { 'Fn::FindInMap': ['StackSetAssetBuckets', { Ref: 'AWS::Region' }, 'BucketName'] },
      `/${stackSet.resolve(script.s3ObjectKey)}`,
    ]],
  };
  expect(outputs.HttpUrl.Value).toEqual(expectedUrl);
  expect(outputs.S3Url.Value).toEqual(expectedUrl);
});

describe('StackSet template asset object keys', () => {
  interface AssetKeysOptions {
    readonly synthesizer?: StackSynthesizer;
    readonly context?: Record<string, unknown>;
    readonly addAssets: (scope: Construct) => void;
  }

  function addLambda(scope: Construct, id: string, code: lambda.Code) {
    new lambda.Function(scope, id, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code,
    });
  }

  function synthAssetKeys(options: AssetKeysOptions) {
    const app = new App({ context: options.context });
    const stack = new Stack(app, 'Parent', { synthesizer: options.synthesizer });
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
      targets: [StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      })],
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    options.addAssets(stackSet);

    app.synth();
    const stackSetTemplate = JSON.parse(
      fs.readFileSync(path.join(Stage.of(stack)!.outdir, stackSet.templateFile), 'utf-8'),
    );
    const templateKeys = [
      ...Object.values(Template.fromJSON(stackSetTemplate).findResources('AWS::Lambda::Function'))
        .map((resource) => resource.Properties.Code.S3Key),
      ...Object.values(stackSetTemplate.Outputs ?? {}).map((output: any) => output.Value),
    ];
    const parentTemplate = Template.fromStack(stack);
    const deployments = Object.values(parentTemplate.findResources('Custom::CDKBucketDeployment'));
    expect(deployments.map((resource) => resource.Properties.DestinationBucketKeyPrefix)).toEqual(
      deployments.map(() => 'cdk-stackset-assets/'));
    const sourceKeys = deployments.flatMap((resource) => resource.Properties.SourceObjectKeys);

    return { templateKeys, sourceKeys, parentTemplate };
  }

  // The handler (extract: false) writes each source object under the key prefix, with its file name only
  function expectSameFileNames(templateKeys: string[], sourceKeys: string[]) {
    expect(templateKeys.length).toBeGreaterThan(0);
    expect([...templateKeys].sort()).toEqual(sourceKeys.map((key) => `cdk-stackset-assets/${path.posix.basename(key)}`).sort());
  }

  test.each([
    ['no bucket prefix', new DefaultStackSynthesizer()],
    ['a bucket prefix with a slash', new DefaultStackSynthesizer({ bucketPrefix: 'assets/' })],
    ['a bucket with deploy-time/ prefix', new DefaultStackSynthesizer({ bucketPrefix: 'deploy-time/' })],
    ['a bucket prefix without a slash', new DefaultStackSynthesizer({ bucketPrefix: 'myapp-' })],
  ])('reference the file names the bucket deployment copies to, with %s', (_name, synthesizer) => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      synthesizer,
      addAssets: (scope) => {
        addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), { assetHash: 'custom-hash' }));
        const script = new s3_assets.Asset(scope, 'Script', { path: path.join(__dirname, 'stackset-script', 'script.py') });
        new CfnOutput(scope, 'ScriptKey', { value: script.s3ObjectKey });
      },
    });

    expect(sourceKeys).toHaveLength(2);
    expectSameFileNames(templateKeys, sourceKeys);
    expect(templateKeys.some((key: string) => key.endsWith('.py'))).toBe(true);
  });

  test('reference the file names the bucket deployment copies to, with an AwsCustomResource handler', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      addAssets: (scope) => {
        addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), { assetHash: 'custom-hash' }));
        new AwsCustomResource(scope, 'CustomResource', {
          onCreate: {
            service: 'S3',
            action: 'listBuckets',
            physicalResourceId: PhysicalResourceId.of('id'),
          },
          policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
      },
    });

    expect(sourceKeys).toHaveLength(2);
    expectSameFileNames(templateKeys, sourceKeys);
  });

  test('reference the file names the bucket deployment copies to, with asset staging disabled', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      context: { [cxapi.DISABLE_ASSET_STAGING_CONTEXT]: true },
      addAssets: (scope) => addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'))),
    });

    expectSameFileNames(templateKeys, sourceKeys);
  });

  test('reference the file names the bucket deployment copies to, with bundling skipped', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      context: { [cxapi.BUNDLING_STACKS]: [] },
      addAssets: (scope) => addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), {
        bundling: {
          image: lambda.Runtime.NODEJS_18_X.bundlingImage,
          command: ['bash', '-c', 'cp -r /asset-input/. /asset-output'],
        },
      })),
    });

    expectSameFileNames(templateKeys, sourceKeys);
  });
});

describe('StackSet asset bucket deployment dependencies', () => {
  function deploymentIdOf(template: Template, destinationBucketName: string): string {
    const deployments = template.findResources('Custom::CDKBucketDeployment', {
      Properties: { DestinationBucketName: destinationBucketName },
    });
    const ids = Object.keys(deployments);
    expect(ids).toHaveLength(1);
    return ids[0];
  }

  function dependsOnOf(template: Template, stackSetName: string): string[] {
    const stackSets = template.findResources('AWS::CloudFormation::StackSet', {
      Properties: { StackSetName: stackSetName },
    });
    const resources = Object.values(stackSets);
    expect(resources).toHaveLength(1);
    return resources[0].DependsOn ?? [];
  }

  test('each StackSet depends only on the bucket deployments of its own template', () => {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(stack, 'FirstStackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'FirstBucket', 'first-us-east-1') }),
      stackSetName: 'first',
      deploymentType: DeploymentType.serviceManaged(),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new LambdaStackSet(stack, 'SecondStackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'SecondBucket', 'second-us-east-1') }),
      stackSetName: 'second',
      deploymentType: DeploymentType.serviceManaged(),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    const template = Template.fromStack(stack);
    const firstDeployment = deploymentIdOf(template, 'first-us-east-1');
    const secondDeployment = deploymentIdOf(template, 'second-us-east-1');
    const firstDependsOn = dependsOnOf(template, 'first');
    const secondDependsOn = dependsOnOf(template, 'second');

    expect(firstDependsOn).toContain(firstDeployment);
    expect(firstDependsOn).not.toContain(secondDeployment);
    expect(secondDependsOn).toContain(secondDeployment);
    expect(secondDependsOn).not.toContain(firstDeployment);
  });

  test('depends on bucket deployments for assets added after the StackSet is created', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'late-us-east-1') }),
      stackSetName: 'late',
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new lambda.Function(stackSet, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    const template = Template.fromStack(stack);
    expect(dependsOnOf(template, 'late')).toContain(deploymentIdOf(template, 'late-us-east-1'));
  });

  test('a StackSet in a nested scope depends on the bucket deployments of its template', () => {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(new Construct(stack, 'Group'), 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'nested-us-east-1') }),
      stackSetName: 'nested',
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    const template = Template.fromStack(stack);
    expect(dependsOnOf(template, 'nested')).toContain(deploymentIdOf(template, 'nested-us-east-1'));
  });
});

describe('StackSet asset buckets', () => {
  const ACCOUNT = '111111111111';
  const MAPPING_LOOKUP = { 'Fn::FindInMap': ['StackSetAssetBuckets', { Ref: 'AWS::Region' }, 'BucketName'] };

  function hostStack(app: App = new App()) {
    return new Stack(app, 'Admin', { env: { account: ACCOUNT, region: 'us-east-1' } });
  }

  function bucketStack(app: App, region: string) {
    return new Stack(app, `Assets-${region}`, { env: { account: ACCOUNT, region } });
  }

  function addLambda(scope: Construct) {
    new lambda.Function(scope, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }

  function twoRegionStackSet(regions: string[]) {
    const app = new App();
    const stack = hostStack(app);
    const buckets: { [region: string]: s3.IBucket } = {};
    for (const region of regions) {
      buckets[region] = s3.Bucket.fromBucketName(stack, `Bucket-${region}`, `my-assets-${region}`);
    }
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets(buckets),
      targets: [StackSetTarget.fromAccounts({ accounts: ['222222222222'], regions: ['us-east-1', 'eu-west-1'] })],
    });
    addLambda(stackSet);
    return { app, stack, stackSet };
  }

  test('the template reads each asset from the bucket of its region through a mapping', () => {
    const { stackSet } = twoRegionStackSet(['us-east-1', 'eu-west-1']);

    const template = stackSetTemplateOf(stackSet);
    expect(template.toJSON().Mappings).toEqual({
      StackSetAssetBuckets: {
        'us-east-1': { BucketName: 'my-assets-us-east-1' },
        'eu-west-1': { BucketName: 'my-assets-eu-west-1' },
      },
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Code: { S3Bucket: MAPPING_LOOKUP, S3Key: Match.stringLikeRegexp('^cdk-stackset-assets/[0-9a-f]{64}\\.zip$') },
    });
  });

  test('a StackSet with asset buckets but no file assets renders no mappings', () => {
    const stack = hostStack();
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets') }),
    });
    new sns.Topic(stackSet, 'Topic');

    expect(stackSetTemplateOf(stackSet).toJSON().Mappings).toBeUndefined();
  });

  test('a lambda in a nested stack of the StackSet reads its code through a copy of the mapping', () => {
    const stack = hostStack();
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets-us-east-1') }),
    });
    const nested = new NestedStack(stackSet, 'Nested');
    addLambda(nested);

    const assembly = Stage.of(stack)!.synth();
    const nestedTemplate = Template.fromJSON(JSON.parse(fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8')));
    expect(Object.values(nestedTemplate.toJSON().Mappings)).toEqual([{ 'us-east-1': { BucketName: 'my-assets-us-east-1' } }]);
    const [mappingId] = Object.keys(nestedTemplate.toJSON().Mappings);
    nestedTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Code: { S3Bucket: { 'Fn::FindInMap': [mappingId, { Ref: 'AWS::Region' }, 'BucketName'] } },
    });
  });

  test.each([
    ['imported by name', (_app: App, host: Stack) => s3.Bucket.fromBucketName(host, 'Bucket', 'imported-assets'), 'us-east-1', 'imported-assets'],
    ['named, in the stack that contains the StackSet', (_app: App, host: Stack) => new s3.Bucket(host, 'Bucket', { bucketName: 'host-assets' }), 'us-east-1', 'host-assets'],
    ['named, in a stack of another region', (app: App) => new s3.Bucket(bucketStack(app, 'eu-west-1'), 'Bucket', { bucketName: 'eu-assets' }), 'eu-west-1', 'eu-assets'],
  ])('the mapping holds the name of a bucket %s', (_name, bucketOf, region, bucketName) => {
    const app = new App();
    const stack = hostStack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ [region]: bucketOf(app, stack) }),
    });
    addLambda(stackSet);

    expect(stackSetTemplateOf(stackSet).toJSON().Mappings).toEqual({ StackSetAssetBuckets: { [region]: { BucketName: bucketName } } });
  });

  test('the mapping holds the generated name of a bucket in a stack of another region', () => {
    const app = new App();
    const stack = hostStack(app);
    const assetsStack = bucketStack(app, 'eu-west-1');
    const bucket = new s3.Bucket(assetsStack, 'Bucket', { bucketName: core.PhysicalName.GENERATE_IF_NEEDED });
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'eu-west-1': bucket }),
    });
    addLambda(stackSet);

    const mapping = stackSetTemplateOf(stackSet).toJSON().Mappings.StackSetAssetBuckets;
    const [generatedName] = Object.values(Template.fromStack(assetsStack).findResources('AWS::S3::Bucket'))
      .map((resource) => resource.Properties.BucketName);
    expect(typeof generatedName).toBe('string');
    expect(mapping).toEqual({ 'eu-west-1': { BucketName: generatedName } });
  });

  const BUCKET_NAME_REQUIRED = 'the name of the asset bucket for region "us-east-1" must be known at synth time, set \'bucketName\' on the bucket';

  test.each([
    ['a bucket in the stack that contains the StackSet has no name', (host: Stack) => new s3.Bucket(host, 'Bucket')],
    ['an imported bucket name is a token', (host: Stack) => s3.Bucket.fromBucketName(host, 'Bucket', new CfnParameter(host, 'BucketName').valueAsString)],
  ])('fails when %s', (_name, bucketOf) => {
    const stack = hostStack();

    expect(() => new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': bucketOf(stack) }),
    })).toThrow(expect.objectContaining({
      name: 'BucketNameRequiredForAssets',
      message: BUCKET_NAME_REQUIRED,
      constructPath: 'Admin/StackSet',
    }));
  });

  test('fails when a bucket in another region has no name', () => {
    const app = new App();
    const stack = hostStack(app);
    const bucket = new s3.Bucket(bucketStack(app, 'eu-west-1'), 'Bucket');

    expect(() => new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'eu-west-1': bucket }),
    })).toThrow(expect.objectContaining({ name: 'CannotUseCrossEnvironment' }));
  });

  test('fails when fromRegionalBuckets gets no buckets', () => {
    expect(() => StackSetAssets.fromRegionalBuckets({})).toThrow(expect.objectContaining({
      name: 'StackSetAssetBucketsEmpty',
      message: 'fromRegionalBuckets requires at least one region and bucket',
    }));
  });

  test('fails when a bucket region key is a token', () => {
    const stack = hostStack();
    const region = Token.asString({ Ref: 'Region' });

    expect(() => StackSetAssets.fromRegionalBuckets({ [region]: s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets') })).toThrow(expect.objectContaining({
      name: 'StackSetAssetBucketRegionUnresolved',
      message: `the regions of the asset buckets must be region names known at synth time, got ${JSON.stringify(region)}`,
    }));
  });

  test('fails when a bucket is keyed by another region than its own', () => {
    const app = new App();
    const stack = hostStack(app);
    const bucket = new s3.Bucket(bucketStack(app, 'eu-west-1'), 'Bucket', { bucketName: 'eu-assets' });

    expect(() => new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': bucket }),
    })).toThrow(expect.objectContaining({
      name: 'StackSetAssetBucketRegionMismatch',
      message: 'the asset bucket for region "us-east-1" is in region "eu-west-1", use the region of each bucket as its key',
      constructPath: 'Admin/StackSet',
    }));
  });

  test('an imported bucket is not checked against its region key', () => {
    const stack = hostStack();
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'eu-west-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets') }),
    });
    addLambda(stackSet);

    expect(stackSetTemplateOf(stackSet).toJSON().Mappings).toEqual({ StackSetAssetBuckets: { 'eu-west-1': { BucketName: 'my-assets' } } });
  });

  test('copies the assets with one bucket deployment per region, keyed by region', () => {
    const { stack } = twoRegionStackSet(['us-east-1', 'eu-west-1']);

    const assets = stack.node.findChild('StackSet.Assets');
    for (const region of ['us-east-1', 'eu-west-1']) {
      const deployment = assets.node.findChild(region);
      Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        DestinationBucketName: `my-assets-${region}`,
        DestinationBucketKeyPrefix: 'cdk-stackset-assets/',
        Extract: false,
        Prune: false,
      });
      expect(deployment.node.path).toBe(`Admin/StackSet.Assets/${region}`);
    }
    Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 2);
  });

  test('reordering the buckets keeps the logical IDs of the bucket deployments', () => {
    function deploymentIds(regions: string[]) {
      const { stack } = twoRegionStackSet(regions);
      return Object.entries(Template.fromStack(stack).findResources('Custom::CDKBucketDeployment'))
        .map(([logicalId, resource]) => `${resource.Properties.DestinationBucketName}=${logicalId}`)
        .sort();
    }

    expect(deploymentIds(['us-east-1', 'eu-west-1'])).toEqual(deploymentIds(['eu-west-1', 'us-east-1']));
  });

  test('reordering the buckets keeps the template of the StackSet', () => {
    function templates(regions: string[]) {
      const { stack, stackSet } = twoRegionStackSet(regions);
      const [stackSetResource] = Object.values(Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet'));
      return {
        // the order of the keys is part of the template file, and so of its hash in the template URL
        template: JSON.stringify(stackSetTemplateOf(stackSet).toJSON()),
        templateUrl: stackSetResource.Properties.TemplateURL,
      };
    }

    expect(templates(['us-east-1', 'eu-west-1'])).toEqual(templates(['eu-west-1', 'us-east-1']));
  });

  describe('asset buckets in another Stage', () => {
    function stackSetWithBucketInOtherStage() {
      const app = new App();
      const stack = new Stack(new Stage(app, 'Main'), 'Host', { env: { account: ACCOUNT, region: 'us-east-1' } });
      const assetsStack = new Stack(new Stage(app, 'Buckets'), 'BucketStack', { env: { account: ACCOUNT, region: 'eu-west-1' } });
      const bucket = new s3.Bucket(assetsStack, 'Bucket', { bucketName: 'my-assets-eu-west-1' });
      const stackSet = new StackSet(stack, 'StackSet', {
        assetBuckets: StackSetAssets.fromRegionalBuckets({ 'eu-west-1': bucket }),
        deploymentType: DeploymentType.serviceManaged(),
      });
      return { app, stack, assetsStack, stackSet };
    }

    test('a file asset adds no dependency on the stack of the bucket', () => {
      const { app, stack, stackSet } = stackSetWithBucketInOtherStage();
      addLambda(stackSet);

      expect(() => app.synth()).not.toThrow();
      expect(stack.dependencies).toEqual([]);
      Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', { DestinationBucketName: 'my-assets-eu-west-1' });
    });

    test('a read grant adds no dependency on the bucket policy', () => {
      const { app, stack, assetsStack, stackSet } = stackSetWithBucketInOtherStage();
      stackSet.grants.readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5'));

      expect(() => app.synth()).not.toThrow();
      expect(stack.dependencies).toEqual([]);
      const [stackSetResource] = Object.values(Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet'));
      expect(stackSetResource.DependsOn).toBeUndefined();
      Template.fromStack(assetsStack).resourceCountIs('AWS::S3::BucketPolicy', 1);
    });
  });

  test('the stack that contains the StackSet depends on the stacks of asset buckets in other regions', () => {
    const app = new App();
    const stack = hostStack(app);
    const assetsStack = bucketStack(app, 'eu-west-1');
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({
        'us-east-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets-us-east-1'),
        'eu-west-1': new s3.Bucket(assetsStack, 'Bucket', { bucketName: 'my-assets-eu-west-1' }),
      }),
    });
    addLambda(stackSet);

    expect(stack.dependencies).toEqual([assetsStack]);
  });
});

describe('StackSet asset bucket regions', () => {
  const NOT_TARGETED = '@aws-cdk/aws-cloudformation:stackSetAssetBucketRegionNotTargeted';

  function stackSetWithBuckets(regions: string[], target?: StackSetTarget) {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const buckets: { [region: string]: s3.IBucket } = {};
    for (const region of regions) {
      buckets[region] = s3.Bucket.fromBucketName(stack, `Bucket-${region}`, `my-assets-${region}`);
    }
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets(buckets),
      targets: target ? [target] : undefined,
    });
    return { app, stack, stackSet };
  }

  function accounts(regions: string[]) {
    return StackSetTarget.fromAccounts({ accounts: ['222222222222'], regions });
  }

  test('fails when a target region has no asset bucket', () => {
    const { app } = stackSetWithBuckets(['us-east-1'], accounts(['us-east-1', 'eu-west-1']));

    expect(() => app.synth()).toThrow('the StackSet deploys to region "eu-west-1" but has no asset bucket for it, add a bucket for "eu-west-1" to \'StackSetAssets.fromRegionalBuckets()\'');
  });

  test('fails when a target added later has a region without an asset bucket', () => {
    const { app, stackSet } = stackSetWithBuckets(['us-east-1'], accounts(['us-east-1']));
    stackSet.addTarget(accounts(['eu-west-1', 'ap-south-1']));

    expect(() => app.synth()).toThrow(/"eu-west-1" but has no asset bucket[\s\S]*"ap-south-1" but has no asset bucket/);
  });

  test('warns when an asset bucket region is not targeted', () => {
    const { stack } = stackSetWithBuckets(['us-east-1', 'us-east1'], accounts(['us-east-1']));

    Annotations.fromStack(stack).hasWarning('/Admin/StackSet', Match.stringLikeRegexp(
      'the StackSet doesn\'t deploy to the regions of the asset buckets \\["us-east1"\\], remove them from \'StackSetAssets.fromRegionalBuckets\\(\\)\' or add a target with these regions'));
  });

  test('does not warn about an acknowledged untargeted asset bucket region', () => {
    const { stack, stackSet } = stackSetWithBuckets(['us-east-1', 'us-east1'], accounts(['us-east-1']));
    CoreAnnotations.of(stackSet).acknowledgeWarning(NOT_TARGETED, 'the region is targeted later');

    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('regions of the asset buckets'));
  });

  test.each([
    ['a token region', () => accounts([Token.asString({ Ref: 'Region' })])],
    ['a token list of regions', () => accounts(Token.asList({ Ref: 'Regions' }))],
  ])('skips %s for the coverage check', (_name, targetOf) => {
    const { app, stack } = stackSetWithBuckets(['us-east-1', 'eu-west-1'], targetOf());

    expect(() => app.synth()).not.toThrow();
    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('regions of the asset buckets'));
  });

  test('checks coverage even without file assets', () => {
    const { app, stackSet } = stackSetWithBuckets(['us-east-1'], accounts(['eu-west-1']));
    new sns.Topic(stackSet, 'Topic');

    expect(() => app.synth()).toThrow(/"eu-west-1" but has no asset bucket/);
  });

  test('a StackSet without asset buckets has no coverage check', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet', { targets: [accounts(['eu-west-1'])] });
    new sns.Topic(stackSet, 'Topic');

    expect(() => app.synth()).not.toThrow();
    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('regions of the asset buckets'));
  });
});

describe('StackSet asset read grants', () => {
  const ACCOUNT = '111111111111';
  const PUBLIC_READ = '@aws-cdk/aws-cloudformation:stackSetAssetsPublicRead';

  function assetObjectsArn(bucketLogicalId: string) {
    return { 'Fn::Join': ['', [{ 'Fn::GetAtt': [bucketLogicalId, 'Arn'] }, '/cdk-stackset-assets/*']] };
  }

  function bucketLogicalIdOf(stack: Stack): string {
    const [logicalId] = Object.keys(Template.fromStack(stack).findResources('AWS::S3::Bucket'));
    return logicalId;
  }

  /**
   * A StackSet whose asset buckets are defined in a stack per region, next to the stack that contains it
   */
  function stackSetWithBucketStacks() {
    const app = new App();
    const stack = new Stack(app, 'Admin', { env: { account: ACCOUNT, region: 'us-east-1' } });
    const bucketStacks = ['us-east-1', 'eu-west-1'].map((region) => new Stack(app, `Assets-${region}`, { env: { account: ACCOUNT, region } }));
    const buckets: { [region: string]: s3.IBucket } = {};
    for (const bucketStack of bucketStacks) {
      buckets[bucketStack.region] = new s3.Bucket(bucketStack, 'Bucket', { bucketName: `my-assets-${bucketStack.region}` });
    }
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets(buckets),
      targets: [StackSetTarget.fromOrganizationalUnits({ organizationalUnits: ['ou-1'], regions: ['us-east-1', 'eu-west-1'] })],
      deploymentType: DeploymentType.serviceManaged(),
    });
    return { app, stack, bucketStacks, stackSet };
  }

  /**
   * A StackSet whose asset bucket is defined in the stack that contains it
   */
  function stackSetWithHostBucket() {
    const app = new App();
    const stack = new Stack(app, 'Admin', { env: { account: ACCOUNT, region: 'us-east-1' } });
    const bucket = new s3.Bucket(stack, 'Bucket', { bucketName: 'my-assets-us-east-1' });
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': bucket }),
      stackSetName: 'with-host-bucket',
    });
    return { app, stack, bucket, stackSet };
  }

  function bucketPolicyStatements(stack: Stack): any[] {
    return Object.values(Template.fromStack(stack).findResources('AWS::S3::BucketPolicy'))
      .flatMap((policy) => policy.Properties.PolicyDocument.Statement);
  }

  test('readAssets adds s3:GetObject on the asset objects of each owned bucket to its bucket policy', () => {
    const { bucketStacks, stackSet } = stackSetWithBucketStacks();

    stackSet.grants.readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5'));

    for (const bucketStack of bucketStacks) {
      expect(bucketPolicyStatements(bucketStack)).toEqual([{
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Condition: { StringEquals: { 'aws:PrincipalOrgID': 'o-a1b2c3d4e5' } },
        Resource: assetObjectsArn(bucketLogicalIdOf(bucketStack)),
      }]);
    }
  });

  test('readAssets returns one grant with a statement for every bucket', () => {
    const { stackSet } = stackSetWithBucketStacks();

    const grant = stackSet.grants.readAssets(new iam.AccountPrincipal('222222222222'));

    expect(grant.success).toBe(true);
    expect(grant.resourceStatements).toHaveLength(2);
    expect(grant.resourceStatements.map((statement) => statement.actions)).toEqual([['s3:GetObject'], ['s3:GetObject']]);
  });

  test.each([
    ['a role of the account of the bucket', (stack: Stack) => new iam.Role(stack, 'Grantee', { assumedBy: new iam.AccountRootPrincipal() })],
    ['a user of the account of the bucket', (stack: Stack) => new iam.User(stack, 'Grantee')],
  ])('readAssets with %s adds to the policy of the principal', (_name, granteeOf) => {
    const { stack, stackSet } = stackSetWithHostBucket();

    stackSet.grants.readAssets(granteeOf(stack));

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::S3::BucketPolicy', 0);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{ Action: 's3:GetObject', Effect: 'Allow', Resource: assetObjectsArn(bucketLogicalIdOf(stack)) }],
      },
    });
  });

  test.each([
    ['a role of another account', (stack: Stack) => iam.Role.fromRoleArn(stack, 'Grantee', 'arn:aws:iam::222222222222:role/reader'),
      { AWS: 'arn:aws:iam::222222222222:role/reader' }],
    ['a service principal', () => new iam.ServicePrincipal('lambda.amazonaws.com'), { Service: 'lambda.amazonaws.com' }],
  ])('readAssets with %s adds to the bucket policy', (_name, granteeOf, principal) => {
    const { stack, stackSet } = stackSetWithHostBucket();

    stackSet.grants.readAssets(granteeOf(stack));

    expect(bucketPolicyStatements(stack)).toEqual([{
      Action: 's3:GetObject',
      Effect: 'Allow',
      Principal: principal,
      Resource: assetObjectsArn(bucketLogicalIdOf(stack)),
    }]);
  });

  test('the StackSet resource depends on the read grants', () => {
    const { stack, stackSet } = stackSetWithHostBucket();

    stackSet.grants.readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5'));

    const template = Template.fromStack(stack);
    const [policyId] = Object.keys(template.findResources('AWS::S3::BucketPolicy'));
    const [stackSetResource] = Object.values(template.findResources('AWS::CloudFormation::StackSet'));
    expect(stackSetResource.DependsOn).toContain(policyId);
  });

  test('readAssets leaves imported buckets unchanged', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets') }),
      deploymentType: DeploymentType.serviceManaged(),
    });

    const grant = stackSet.grants.readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5'));

    expect(grant.success).toBe(false);
    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('readAssets on a referenced StackSet grants nothing', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = StackSet.fromStackSetId(stack, 'Imported', 'my-stackset:2f0a8b4c-1234-5678-9abc-def012345678');

    const grant = StackSetGrants.fromStackSet(stackSet).readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5'));

    expect(grant.success).toBe(false);
    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
  });

  test('readAssets without asset buckets grants nothing', () => {
    const app = new App();
    const stackSet = new StackSet(new Stack(app, 'Admin'), 'StackSet');

    expect(stackSet.grants.readAssets(new iam.OrganizationPrincipal('o-a1b2c3d4e5')).success).toBe(false);
  });

  test.each([
    ['AnyPrincipal', () => new iam.AnyPrincipal()],
    ['StarPrincipal', () => new iam.StarPrincipal()],
    ['ArnPrincipal(\'*\')', () => new iam.ArnPrincipal('*')],
    ['a CompositePrincipal with AnyPrincipal', () => new iam.CompositePrincipal(new iam.AnyPrincipal(), new iam.AccountPrincipal('222222222222'))],
  ])('warns when read access is granted to everyone with %s', (_name, granteeOf) => {
    const { stack, stackSet } = stackSetWithHostBucket();

    stackSet.grants.readAssets(granteeOf());

    Annotations.fromStack(stack).hasWarning('/Admin/StackSet', Match.stringLikeRegexp(
      'granting read access to the file assets of the StackSet to everyone makes them public, grant access to the organization or the accounts the StackSet deploys to instead'));
  });

  test.each([
    ['OrganizationPrincipal', () => new iam.OrganizationPrincipal('o-a1b2c3d4e5')],
    ['AccountPrincipal', () => new iam.AccountPrincipal('222222222222')],
    ['a role', (stack: Stack) => new iam.Role(stack, 'Grantee', { assumedBy: new iam.AccountRootPrincipal() })],
  ])('does not warn when read access is granted to %s', (_name, granteeOf) => {
    const { stack, stackSet } = stackSetWithHostBucket();

    stackSet.grants.readAssets(granteeOf(stack));

    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('file assets of the StackSet to everyone'));
  });

  test('does not warn when every asset bucket is imported', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'Bucket', 'my-assets') }),
    });

    stackSet.grants.readAssets(new iam.AnyPrincipal());

    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('file assets of the StackSet to everyone'));
  });

  test('warns once when read access to several asset buckets is granted to everyone', () => {
    const { stack, stackSet } = stackSetWithBucketStacks();

    stackSet.grants.readAssets(new iam.AnyPrincipal());

    expect(Annotations.fromStack(stack).findWarning('/Admin/StackSet', Match.stringLikeRegexp('file assets of the StackSet to everyone'))).toHaveLength(1);
  });

  test('does not warn about acknowledged public read access', () => {
    const { stack, stackSet } = stackSetWithHostBucket();
    CoreAnnotations.of(stackSet).acknowledgeWarning(PUBLIC_READ, 'the assets are public');

    stackSet.grants.readAssets(new iam.AnyPrincipal());

    Annotations.fromStack(stack).hasNoWarning('/Admin/StackSet', Match.stringLikeRegexp('file assets of the StackSet to everyone'));
  });
});
