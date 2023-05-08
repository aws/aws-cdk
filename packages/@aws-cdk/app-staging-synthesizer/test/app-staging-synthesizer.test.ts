import * as fs from 'fs';
import { App, Stack, CfnResource, FileAssetPackaging, Token, Lazy, Duration } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import { evaluateCFN } from './evaluate-cfn';
import { APP_ID, CFN_CONTEXT, TestAppScopedStagingSynthesizer, isAssetManifest, last } from './util';
import { AppStagingSynthesizer } from '../lib';

describe(AppStagingSynthesizer, () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv(),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
  });

  test('stack template is in asset manifest', () => {
    // GIVEN
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app.synth();

    // THEN -- the S3 url is advertised on the stack artifact
    const stackArtifact = asm.getStackArtifact('Stack');

    const templateObjectKey = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-${APP_ID}-staging-000000000000-us-east-1/${templateObjectKey}`);

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile).toEqual({
      source: { path: 'Stack.template.json', packaging: 'file' },
      destinations: {
        '000000000000-us-east-1': {
          bucketName: `cdk-${APP_ID}-staging-000000000000-us-east-1`,
          objectKey: templateObjectKey,
          region: 'us-east-1',
          assumeRoleArn: `arn:\${AWS::Partition}:iam::000000000000:role/cdk-${APP_ID}-file-publishing-role-us-east-1`,
        },
      },
    });
  });

  test('stack template is in the asset manifest - environment tokens', () => {
    const app2 = new App({
      defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv(),
    });
    const accountToken = Token.asString('111111111111');
    const regionToken = Token.asString('us-east-2');
    const stack2 = new Stack(app2, 'Stack2', {
      env: {
        account: accountToken,
        region: regionToken,
      },
    });

    // GIVEN
    new CfnResource(stack2, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app2.synth();

    // THEN -- the S3 url is advertised on the stack artifact
    const stackArtifact = asm.getStackArtifact('Stack2');

    const templateObjectKey = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-${APP_ID}-staging-${accountToken}-${regionToken}/${templateObjectKey}`);

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile).toEqual({
      source: { path: 'Stack2.template.json', packaging: 'file' },
      destinations: {
        '111111111111-us-east-2': {
          bucketName: `cdk-${APP_ID}-staging-111111111111-us-east-2`,
          objectKey: templateObjectKey,
          region: 'us-east-2',
          assumeRoleArn: `arn:\${AWS::Partition}:iam::111111111111:role/cdk-${APP_ID}-file-publishing-role-us-east-2`,
        },
      },
    });
  });

  test('stack depends on staging stack', () => {
    // WHEN
    stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a stack dependency on the staging stack
    expect(stack.dependencies.length).toEqual(1);
    const depStack = stack.dependencies[0];
    expect(depStack.stackName).toEqual(`StagingStack-${APP_ID}`);
  });

  test('add file asset', () => {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location
    expect(evalCFN(location.bucketName)).toEqual(`cdk-${APP_ID}-staging-000000000000-us-east-1`);
    expect(evalCFN(location.httpUrl)).toEqual(`https://s3.us-east-1.domain.aws/cdk-${APP_ID}-staging-000000000000-us-east-1/abcdef.js`);

    // THEN - object key contains source hash somewhere
    expect(location.objectKey.indexOf('abcdef')).toBeGreaterThan(-1);
  });

  test('adding multiple files only creates one bucket', () => {
    // WHEN
    const location1 = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });
    const location2 = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'zyxwvu',
    });

    // THEN - assets have the same location
    expect(evalCFN(location1.bucketName)).toEqual(evalCFN(location2.bucketName));
  });

  describe('ephemeral assets', () => {
    test('ephemeral assets have the \'handoff/\' prefix', () => {
      // WHEN
      const location = stack.synthesizer.addFileAsset({
        fileName: __filename,
        packaging: FileAssetPackaging.FILE,
        sourceHash: 'abcdef',
        ephemeral: true,
      });

      // THEN - asset has bucket prefix
      expect(evalCFN(location.objectKey)).toEqual('handoff/abcdef.js');
    });

    test('ephemeral assets do not get specified bucketPrefix', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({}),
      });
      stack = new Stack(app, 'Stack', {
        env: {
          account: '000000000000',
          region: 'us-west-2',
        },
      });

      // WHEN
      const location = stack.synthesizer.addFileAsset({
        fileName: __filename,
        packaging: FileAssetPackaging.FILE,
        sourceHash: 'abcdef',
        ephemeral: true,
      });

      // THEN - asset has bucket prefix
      expect(evalCFN(location.objectKey)).toEqual('handoff/abcdef.js');
    });

    test('s3 bucket has lifecycle rule on ephemeral assets by default', () => {
      // GIVEN
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      const stagingStackArtifact = asm.getStackArtifact(`StagingStack-${APP_ID}-000000000000-us-east-1`);

      Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([{
            ExpirationInDays: 30,
            Prefix: 'handoff/',
            Status: 'Enabled',
          }]),
        },
      });
    });

    test('lifecycle rule on ephemeral assets can be customized', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
          handoffFileAssetLifetime: Duration.days(1),
        }),
      });
      stack = new Stack(app, 'Stack', {
        env: {
          account: '000000000000',
          region: 'us-west-2',
        },
      });
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      const stagingStackArtifact = asm.getStackArtifact(`StagingStack-${APP_ID}-000000000000-us-west-2`);

      Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([{
            ExpirationInDays: 1,
            Prefix: 'handoff/',
            Status: 'Enabled',
          }]),
        },
      });
    });
  });

  test('bucket has policy referring to deploymentrolearn', () => {
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const stagingStackArtifact = asm.getStackArtifact(`StagingStack-${APP_ID}-000000000000-us-east-1`);

    Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: {
              AWS: 'role',
            },
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
          }),
        ]),
      },
    });
  });

  test('add docker image asset', () => {
    // WHEN
    const assetName = 'abcdef';
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    // THEN - we have a fixed asset location
    const repo = `${APP_ID}/${assetName}`;
    expect(evalCFN(location.repositoryName)).toEqual(repo);
    expect(evalCFN(location.imageUri)).toEqual(`000000000000.dkr.ecr.us-east-1.domain.aws/${repo}:abcdef`);
  });

  test('throws with docker image asset without assetName', () => {
    expect(() => stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
    })).toThrowError('Assets synthesized with AppScopedStagingSynthesizer must include an \'assetName\' in the asset source definition.');
  });

  test('docker image assets with different assetName have separate repos', () => {
    // WHEN
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName: 'firstAsset',
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdef',
      assetName: 'secondAsset',
    });

    // THEN - images have different asset locations
    expect(evalCFN(location1.repositoryName)).not.toEqual(evalCFN(location2.repositoryName));
  });

  test('docker image assets with same assetName live in same repos', () => {
    // WHEN
    const assetName = 'abcdef';
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdefg',
      assetName,
    });

    // THEN - images share same ecr repo
    expect(evalCFN(location1.repositoryName)).toEqual(`${APP_ID}/${assetName}`);
    expect(evalCFN(location1.repositoryName)).toEqual(evalCFN(location2.repositoryName));
  });

  describe('environment specifics', () => {
    test('throws if App includes env-agnostic and specific env stacks', () => {
      // GIVEN - App with Stack with specific environment

      // THEN - Expect environment agnostic stack to fail
      expect(() => new Stack(app, 'NoEnvStack')).toThrowError(/It is not safe to use AppStagingSynthesizer/);
    });
  });

  test('throws if synthesizer props have tokens', () => {
    expect(() => new App({
      defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
        appId: Lazy.string({ produce: () => 'appId' }),
      }),
    })).toThrowError(/AppStagingSynthesizer property 'appId' may not contain tokens;/);
  });

  /**
  * Evaluate a possibly string-containing value the same way CFN would do
  *
  * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
  */
  function evalCFN(value: any) {
    return evaluateCFN(stack.resolve(value), CFN_CONTEXT);
  }
});
