/* eslint-disable jest/no-commented-out-tests */
import * as fs from 'fs';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, Stack, CfnResource, FileAssetPackaging, Token, Lazy, FileAssetSource, DockerImageAssetSource } from '@aws-cdk/core';
import { evaluateCFN } from '@aws-cdk/core/test/evaluate-cfn';
import * as cxapi from '@aws-cdk/cx-api';
import { AppStagingSynthesizer, BootstrapRole, FileAssetInfo, ImageAssetInfo, IStagingStack, StackPerEnvProps } from '../lib';
import { Repository } from '@aws-cdk/aws-ecr';
import { Bucket } from '@aws-cdk/aws-s3';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};
const APP_ID = 'appId';
const CLOUDFORMATION_EXECUTION_ROLE = 'role';
const DEPLOY_ACTION_ROLE = 'role';
const LOOKUP_ROLE = 'role';

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

describe('Boostrap Roles', () => {
  test('Can supply existing arns for bootstrapped roles', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.stackPerEnv({
        appId: APP_ID,
        bootstrapRoles: {
          cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
          lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
          deploymentActionRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
        },
      }),
    });
    const stack = new Stack(app, 'Stack', {
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
    const stackArtifact = asm.getStackArtifact('Stack');

    // Bootstrapped roles are as advertised
    expect(stackArtifact.cloudFormationExecutionRoleArn).toEqual(CLOUDFORMATION_EXECUTION_ROLE);
    expect(stackArtifact.lookupRole).toEqual({ arn: LOOKUP_ROLE });
    expect(stackArtifact.assumeRoleArn).toEqual(DEPLOY_ACTION_ROLE);
  });

  test('can supply existing arns for staging roles', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.stackPerEnv({
        appId: APP_ID,
        stagingRoles: {
          fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn'),
        },
      }),
    });
    const stack = new Stack(app, 'Stack', {
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
    // Staging roles are as advertised
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
    const firstFile: any = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
    expect(firstFile.destinations['000000000000-us-east-1'].assumeRoleArn).toEqual('arn');
  });

  test('bootstrap roles can be specified as current cli credentials instead', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.stackPerEnv({
        appId: APP_ID,
        bootstrapRoles: {
          cloudFormationExecutionRole: BootstrapRole.cliCredentials(),
          lookupRole: BootstrapRole.cliCredentials(),
          deploymentActionRole: BootstrapRole.cliCredentials(),
        },
      }),
    });
    const stack = new Stack(app, 'Stack', {
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
    const stackArtifact = asm.getStackArtifact('Stack');

    // Bootstrapped roles are undefined, which means current credentials are used
    expect(stackArtifact.cloudFormationExecutionRoleArn).toBeUndefined();
    expect(stackArtifact.lookupRole).toBeUndefined();
    expect(stackArtifact.assumeRoleArn).toBeUndefined();
  });

  test('staging roles cannot be specified as cli credentials', () => {
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.stackPerEnv({
        appId: APP_ID,
        stagingRoles: {
          fileAssetPublishingRole: BootstrapRole.cliCredentials(),
        },
      }),
    });

    expect(() => new Stack(app, 'Stack')).toThrowError('fileAssetPublishingRole and dockerAssetPublishingRole cannot be specified as cliCredentials(). Please supply an arn to reference an existing IAM role.');
  });
});

function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}

class TestAppScopedStagingSynthesizer {
  public static stackPerEnv(props: Partial<StackPerEnvProps> = {}): AppStagingSynthesizer {
    return AppStagingSynthesizer.stackPerEnv({
      appId: props.appId ?? APP_ID,
      bootstrapRoles: {
        cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
        deploymentActionRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
        lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
      },
      ...props,
    });
  }
}