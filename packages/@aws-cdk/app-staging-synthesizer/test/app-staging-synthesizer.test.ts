/* eslint-disable jest/no-commented-out-tests */
import * as fs from 'fs';
import { App, Stack, CfnResource, FileAssetPackaging, Token, Lazy, Duration } from 'aws-cdk-lib';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import { evaluateCFN } from 'aws-cdk-lib/core/test/evaluate-cfn';
import { AppStagingSynthesizer } from '../lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { APP_ID, CFN_CONTEXT, TestAppScopedStagingSynthesizer, isAssetManifest, last } from './util';
// import { Repository } from 'aws-cdk-lib/aws-ecr';
// import { Bucket } from 'aws-cdk-lib/aws-s3';

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
    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-000000000000-us-east-1-${APP_ID.toLocaleLowerCase()}/${templateObjectKey}`);

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile).toEqual({
      source: { path: 'Stack.template.json', packaging: 'file' },
      destinations: {
        '000000000000-us-east-1': {
          bucketName: `cdk-000000000000-us-east-1-${APP_ID.toLocaleLowerCase()}`,
          objectKey: templateObjectKey,
          region: 'us-east-1',
          assumeRoleArn: `arn:\${AWS::Partition}:iam::000000000000:role/cdk-file-publishing-role-us-east-1-${APP_ID}`,
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
    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-${accountToken}-${regionToken}-${APP_ID.toLocaleLowerCase()}/${templateObjectKey}`);

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile).toEqual({
      source: { path: 'Stack2.template.json', packaging: 'file' },
      destinations: {
        '111111111111-us-east-2': {
          bucketName: `cdk-111111111111-us-east-2-${APP_ID.toLocaleLowerCase()}`,
          objectKey: templateObjectKey,
          region: 'us-east-2',
          assumeRoleArn: `arn:\${AWS::Partition}:iam::111111111111:role/cdk-file-publishing-role-us-east-2-${APP_ID}`,
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
    expect(depStack.stackName).toEqual(`StagingStack${APP_ID}`);
  });

  test('add file asset', () => {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location
    expect(evalCFN(location.bucketName)).toEqual(`cdk-000000000000-us-east-1-${APP_ID.toLocaleLowerCase()}`);
    expect(evalCFN(location.httpUrl)).toEqual(`https://s3.us-east-1.domain.aws/cdk-000000000000-us-east-1-${APP_ID.toLocaleLowerCase()}/abcdef.js`);

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
    test('ephemeral assets have the \'eph\' prefix', () => {
      // WHEN
      const location = stack.synthesizer.addFileAsset({
        fileName: __filename,
        packaging: FileAssetPackaging.FILE,
        sourceHash: 'abcdef',
        ephemeral: true,
      });

      // THEN - asset has bucket prefix
      expect(evalCFN(location.objectKey)).toEqual('eph-abcdef.js');
    });

    test('s3 bucket has lifecycle rule on ephemeral assets by default', () => {
      // GIVEN
      new CfnResource(stack, 'Resource', {
        type: 'Some::Resource',
      });

      // WHEN
      const asm = app.synth();

      // THEN
      const stagingStackArtifact = asm.getStackArtifact('StagingStack000000000000us-east-1');

      Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: [{
            ExpirationInDays: 10,
            Prefix: 'eph-',
            Status: 'Enabled',
          }],
        },
      });
    });

    test('lifecycle rule on ephemeral assets can be customized', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
          ephemeralFileAssetLifecycleRule: {
            prefix: 'eph-',
            objectSizeGreaterThan: 10000,
            expiration: Duration.days(1),
          },
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
      const stagingStackArtifact = asm.getStackArtifact('StagingStack000000000000us-west-2');

      Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: [{
            ExpirationInDays: 1,
            Prefix: 'eph-',
            Status: 'Enabled',
            ObjectSizeGreaterThan: 10000,
          }],
        },
      });
    });

    test('customized lifecycle rule must have correct prefix', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
          ephemeralFileAssetLifecycleRule: {
            objectSizeGreaterThan: 10000,
            expiration: Duration.days(1),
          },
        }),
      });
      expect(() => {
        new Stack(app, 'Stack', {
          env: {
            account: '000000000000',
            region: 'us-west-2',
          },
        });
      }).toThrowError('ephemeralAssetLifecycleRule must contain "prefix: \'eph-\'" but got "prefix: undefined". This prefix is the only way to identify ephemeral assets.');
    });

    test('lifecycle rule on ephemeral assets can be turned off', () => {
      // GIVEN
      app = new App({
        defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
          retainEphemeralFileAssets: true,
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
      const stagingStackArtifact = asm.getStackArtifact('StagingStack000000000000us-west-2');

      Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: Match.absent(),
      });
    });
  });

  // test('add docker image asset', () => {
  //   // WHEN
  //   const location = stack.synthesizer.addDockerImageAsset({
  //     directoryName: '.',
  //     sourceHash: 'abcdef',
  //     assetName: 'abcdef',
  //   });

  //   // THEN - we have a fixed asset location
  //   const repo = 'abcdef';
  //   expect(evalCFN(location.repositoryName)).toEqual(repo);
  //   expect(evalCFN(location.imageUri)).toEqual(`000000000000.dkr.ecr.us-east-1.domain.aws/${repo}:abcdef`);
  // });

  // test('throws with docker image asset without uniqueId', () => {
  //   expect(() => stack.synthesizer.addDockerImageAsset({
  //     directoryName: '.',
  //     sourceHash: 'abcdef',
  //   })).toThrowError('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
  // });

  // test('separate docker image assets have separate repos', () => {
  //   // WHEN
  //   const location1 = stack.synthesizer.addDockerImageAsset({
  //     directoryName: '.',
  //     sourceHash: 'abcdef',
  //     assetName: 'abcdef',
  //   });

  //   const location2 = stack.synthesizer.addDockerImageAsset({
  //     directoryName: './hello',
  //     sourceHash: 'abcdefg',
  //     assetName: 'abcdefg',
  //   });

  //   // THEN - images have different asset locations
  //   expect(evalCFN(location1.repositoryName)).not.toEqual(evalCFN(location2.repositoryName));
  // });

  // test('docker image assets with same unique id have same repos', () => {
  //   // WHEN
  //   const location1 = stack.synthesizer.addDockerImageAsset({
  //     directoryName: '.',
  //     sourceHash: 'abcdef',
  //     assetName: 'abcdef',
  //   });

  //   const location2 = stack.synthesizer.addDockerImageAsset({
  //     directoryName: './hello',
  //     sourceHash: 'abcdefg',
  //     assetName: 'abcdef',
  //   });

  //   // THEN - images share same ecr repo
  //   const repo = 'abcdef';
  //   expect(evalCFN(location1.repositoryName)).toEqual(repo);
  //   expect(evalCFN(location1.repositoryName)).toEqual(evalCFN(location2.repositoryName));
  // });

  describe('environment specifics', () => {
    test('throws if App includes env-agnostic and specific env stacks', () => {
      // GIVEN - App with Stack with specific environment

      // THEN - Expect environment agnostic stack to fail
      expect(() => new Stack(app, 'NoEnvStack')).toThrowError('AppStagingSynthesizer cannot synthesize CDK Apps with BOTH environment-agnostic stacks and set environment stacks.\nPlease either specify environments for all stacks or no stacks in the CDK App.');
    });

    test('metadata for cdk-env is only added once on the app', () => {
      // GIVEN - Additional App with specific environment
      new Stack(app, 'EnvStack', {
        env: {
          account: '000000000000',
          region: 'us-west-2',
        },
      });

      // THEN - We only add the env metadata once
      expect(app.node.metadata.filter((m) => m.type === 'cdk-env').length).toEqual(1);
    });
  });

  test('throws if synthesizer props have tokens', () => {
    expect(() => new App({
      defaultStackSynthesizer: TestAppScopedStagingSynthesizer.stackPerEnv({
        appId: Lazy.string({ produce: () => 'appId' }),
      }),
    })).toThrowError(/AppStagingSynthesizer property 'appId' cannot contain tokens;/);
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
