import * as fs from 'fs';
import * as path from 'path';
import { App, Stack, CfnResource, FileAssetPackaging, Token, Lazy, Duration } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import { CloudAssembly } from 'aws-cdk-lib/cx-api';
import { evaluateCFN } from './evaluate-cfn';
import { APP_ID, CFN_CONTEXT, isAssetManifest, last } from './util';
import { AppStagingSynthesizer, DEPLOY_TIME_PREFIX } from '../lib';

describe(AppStagingSynthesizer, () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({ appId: APP_ID, stagingBucketEncryption: BucketEncryption.S3_MANAGED }),
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

    const templateObjectKey = `${DEPLOY_TIME_PREFIX}${last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'))}`;
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
          assumeRoleArn: `arn:\${AWS::Partition}:iam::000000000000:role/cdk-${APP_ID}-file-role-us-east-1`,
        },
      },
    });
  });

  test('stack template is in the asset manifest - environment tokens', () => {
    const app2 = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({ appId: APP_ID, stagingBucketEncryption: BucketEncryption.S3_MANAGED }),
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

    const templateObjectKey = `${DEPLOY_TIME_PREFIX}${last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'))}`;
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
          assumeRoleArn: `arn:\${AWS::Partition}:iam::111111111111:role/cdk-${APP_ID}-file-role-us-east-2`,
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

  test('stack has dummy construct for metrics', () => {
    // WHEN
    const dummyConstruct = stack.node.tryFindChild(`UsingAppStagingSynthesizer/${stack.stackName}`);
    expect(dummyConstruct).toBeDefined();
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
    expect(evalCFN(location.httpUrl)).toEqual(`https://s3.us-east-1.domain.aws/cdk-${APP_ID}-staging-000000000000-us-east-1/abcdef.ts`);

    // THEN - object key contains source hash somewhere
    expect(location.objectKey.indexOf('abcdef')).toBeGreaterThan(-1);
  });

  test('file asset depends on staging stack', () => {
    // WHEN
    stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    const asm = app.synth();

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    expect(manifestArtifact.manifest.dependencies).toEqual([`StagingStack-${APP_ID}-000000000000-us-east-1`]);
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

  describe('deploy time assets', () => {
    test('have the \'deploy-time/\' prefix', () => {
      // WHEN
      const location = stack.synthesizer.addFileAsset({
        fileName: __filename,
        packaging: FileAssetPackaging.FILE,
        sourceHash: 'abcdef',
        deployTime: true,
      });

      // THEN - asset has deploy time prefix
      expect(evalCFN(location.objectKey)).toEqual(`${DEPLOY_TIME_PREFIX}abcdef.ts`);
    });

    test('lambda assets are by default deploy time assets', () => {
      // WHEN
      new lambda.Function(stack, 'Lambda', {
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
        runtime: lambda.Runtime.PYTHON_3_10,
      });

      // THEN - lambda asset has deploy time prefix
      const asm = app.synth();

      const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
      expect(manifestArtifact).toBeDefined();
      const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

      expect(manifest.files).toBeDefined();
      expect(Object.keys(manifest.files!).length).toEqual(2);
      const firstFile = manifest.files![Object.keys(manifest.files!)[0]];
      const assetHash = '68539effc3f7ad46fff9765606c2a01b7f7965833643ab37e62799f19a37f650';
      expect(firstFile).toEqual({
        source: {
          packaging: 'zip',
          path: `asset.${assetHash}`,
        },
        destinations: {
          '000000000000-us-east-1': {
            bucketName: `cdk-${APP_ID}-staging-000000000000-us-east-1`,
            objectKey: `${DEPLOY_TIME_PREFIX}${assetHash}.zip`,
            region: 'us-east-1',
            assumeRoleArn: `arn:\${AWS::Partition}:iam::000000000000:role/cdk-${APP_ID}-file-role-us-east-1`,
          },
        },
      });
    });

    test('have s3 bucket has lifecycle rule by default', () => {
      // GIVEN
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([{
            ExpirationInDays: 30,
            Prefix: DEPLOY_TIME_PREFIX,
            Status: 'Enabled',
          }]),
        },
      });
    });

    test('can have customized lifecycle rules', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
          appId: APP_ID,
          deployTimeFileAssetLifetime: Duration.days(1),
          stagingBucketEncryption: BucketEncryption.KMS,
        }),
      });
      stack = new Stack(app, 'Stack', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
      });
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([{
            ExpirationInDays: 1,
            Prefix: DEPLOY_TIME_PREFIX,
            Status: 'Enabled',
          }]),
        },
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        },
      });
    });

    test('staging bucket with SSE-S3 encryption', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
          appId: APP_ID,
          deployTimeFileAssetLifetime: Duration.days(1),
          stagingBucketEncryption: BucketEncryption.S3_MANAGED,
        }),
      });
      stack = new Stack(app, 'Stack', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
      });
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
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
              AWS: Match.anyValue(),
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
    })).toThrow('Assets synthesized with AppScopedStagingSynthesizer must include an \'assetName\' in the asset source definition.');
  });

  test('docker image asset depends on staging stack', () => {
    // WHEN
    const assetName = 'abcdef';
    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    const asm = app.synth();

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    expect(manifestArtifact.manifest.dependencies).toEqual([`StagingStack-${APP_ID}-000000000000-us-east-1`]);
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

  test('docker image repositories have lifecycle rule - default', () => {
    // GIVEN
    const assetName = 'abcdef';
    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    // WHEN
    const asm = app.synth();

    // THEN
    Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        LifecyclePolicyText: Match.serializedJson({
          rules: Match.arrayWith([
            Match.objectLike({
              selection: Match.objectLike({
                countType: 'imageCountMoreThan',
                countNumber: 3,
              }),
            }),
          ]),
        }),
      },
      RepositoryName: `${APP_ID}/${assetName}`,
    });
  });

  test('docker image repositories have lifecycle rule - specified', () => {
    // GIVEN
    app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        imageAssetVersionCount: 1,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    const assetName = 'abcdef';
    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    // WHEN
    const asm = app.synth();

    // THEN
    Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        LifecyclePolicyText: Match.serializedJson({
          rules: Match.arrayWith([
            Match.objectLike({
              selection: Match.objectLike({
                countType: 'imageCountMoreThan',
                countNumber: 1,
              }),
            }),
          ]),
        }),
      },
      RepositoryName: `${APP_ID}/${assetName}`,
    });
  });

  test('auto delete assets can be turned off', () => {
    // GIVEN
    app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        autoDeleteStagingAssets: false,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    const assetName = 'abcdef';
    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName,
    });

    // WHEN
    const asm = app.synth();

    // THEN
    Template.fromJSON(getStagingResourceStack(asm).template).resourceCountIs('Custom::ECRAutoDeleteImages', 0);
    Template.fromJSON(getStagingResourceStack(asm).template).resourceCountIs('Custom::S3AutoDeleteObjects', 0);
  });

  test('stack prefix can be customized', () => {
    // GIVEN
    const prefix = 'Prefix';
    app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        stagingStackNamePrefix: prefix,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    // WHEN
    const asm = app.synth();

    // THEN
    expect(getStagingResourceStack(asm, prefix).template).toBeDefined();
  });

  describe('environment specifics', () => {
    test('throws if App includes env-agnostic and specific env stacks', () => {
      // GIVEN - App with Stack with specific environment

      // THEN - Expect environment agnostic stack to fail
      expect(() => new Stack(app, 'NoEnvStack')).toThrow(/It is not safe to use AppStagingSynthesizer/);
    });
  });

  test('throws if synthesizer props have tokens', () => {
    expect(() => new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: Lazy.string({ produce: () => 'appId' }),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    })).toThrow(/AppStagingSynthesizer property 'appId' may not contain tokens;/);
  });

  test('throws when staging resource stack is too large', () => {
    // WHEN
    const assetName = 'abcdef';
    for (let i = 0; i < 100; i++) {
      stack.synthesizer.addDockerImageAsset({
        directoryName: '.',
        sourceHash: 'abcdef',
        assetName: assetName + i,
      });
    }

    // THEN
    expect(() => app.synth()).toThrow(/Staging resource template cannot be greater than 51200 bytes/);
  });

  /**
  * Evaluate a possibly string-containing value the same way CFN would do
  *
  * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
  */
  function evalCFN(value: any) {
    return evaluateCFN(stack.resolve(value), CFN_CONTEXT);
  }

  /**
   * Return the staging resource stack that is generated as part of the assembly
   */
  function getStagingResourceStack(asm: CloudAssembly, prefix?: string) {
    return asm.getStackArtifact(`${prefix ?? 'StagingStack'}-${APP_ID}-000000000000-us-east-1`);
  }
});
