import * as fs from 'fs';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, Stack, CfnResource, FileAssetPackaging, Aws, FileAssetSource, DockerImageAssetSource, Token } from '@aws-cdk/core';
import { evaluateCFN } from '@aws-cdk/core/test/evaluate-cfn';
import * as cxapi from '@aws-cdk/cx-api';
import { AppScopedStagingSynthesizer, AppScopedStagingSynthesizerProps, BootstrapRole, DockerAssetInfo, FileAssetInfo, IStagingStack } from '../lib';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};
const APP_ID = 'appId';
const CLOUDFORMATION_EXECUTION_ROLE = 'role';
const DEPLOY_ACTION_ROLE = 'role';
const LOOKUP_ROLE = 'role';

describe(AppScopedStagingSynthesizer, () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      appId: APP_ID,
      defaultStackSynthesizer: new TestAppScopedStagingSynthesizer(),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
    // TODO: test with tokens
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
          assumeRoleArn: `arn:${Aws.PARTITION}:iam:us-east-1:000000000000:role:cdk-file-publishing-role-us-east-1-${APP_ID}`,
        },
      },
    });
  });

  test('stack template is in the asset manifest - environment tokens', () => {
    const app2 = new App({
      appId: APP_ID,
      defaultStackSynthesizer: new TestAppScopedStagingSynthesizer(),
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
          assumeRoleArn: `arn:${Aws.PARTITION}:iam:us-east-2:111111111111:role:cdk-file-publishing-role-us-east-2-${APP_ID}`,
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

  test('add docker image asset', () => {
    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    // THEN - we have a fixed asset location
    const repo = 'abcdefrepo';
    expect(evalCFN(location.repositoryName)).toEqual(repo);
    expect(evalCFN(location.imageUri)).toEqual(`000000000000.dkr.ecr.us-east-1.domain.aws/${repo}:abcdef`);
  });

  test('throws with docker image asset without uniqueId', () => {
    expect(() => stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
    })).toThrowError('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
  });

  test('separate docker image assets have separate repos', () => {
    // WHEN
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdefg',
      uniqueId: 'abcdefg',
    });

    // THEN - images have different asset locations
    expect(evalCFN(location1.repositoryName)).not.toEqual(evalCFN(location2.repositoryName));
  });

  test('docker image assets with same unique id have same repos', () => {
    // WHEN
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdefg',
      uniqueId: 'abcdef',
    });

    // THEN - images share same ecr repo
    const repo = 'abcdefrepo';
    expect(evalCFN(location1.repositoryName)).toEqual(repo);
    expect(evalCFN(location1.repositoryName)).toEqual(evalCFN(location2.repositoryName));
  });

  test('throws when App uses DefaultStagingStack and does not have appId', () => {
    const app2 = new App({
      defaultStackSynthesizer: new TestAppScopedStagingSynthesizer(),
    });
    expect(() => new Stack(app2, 'Stack')).toThrowError('DefaultStagingStack can only be used on Apps with a user-specified appId, but no appId found.');
  });

  test('does not throw when App does not have appId and does not use DefaultStagingStack', () => {
    class TestStagingStack extends Stack implements IStagingStack {
      readonly appId = 'appId';
      readonly stagingRepos = {};
      addFile(_asset: FileAssetSource): FileAssetInfo {
        return {
          assumeRoleArn: 'assumeRoleArn',
          bucketName: 'bucketName',
        };
      }
      addDockerImage(_asset: DockerImageAssetSource): DockerAssetInfo {
        return {
          assumeRoleArn: 'assumeRoleArn',
          repoName: 'repoName',
        };
      }
    }

    const app2 = new App({
      defaultStackSynthesizer: new TestAppScopedStagingSynthesizer({
        stagingStack: new TestStagingStack(),
      }),
    });
    expect(() => new Stack(app2, 'Stack')).not.toThrow();
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

describe('Custom Roles on AppScopedStagingSynthesizer', () => {
  test('Can supply different roles', () => {
    const app = new App({
      appId: APP_ID,
      defaultStackSynthesizer: new AppScopedStagingSynthesizer({
        bootstrapRoles: {
          cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
          lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
          deploymentActionRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
          fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn'),
          dockerAssetPublishingRole: BootstrapRole.fromRoleArn('arn'),
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

    // CloudFormation roles are as advertised
    expect(stackArtifact.cloudFormationExecutionRoleArn).toEqual(CLOUDFORMATION_EXECUTION_ROLE);
    expect(stackArtifact.lookupRole).toEqual({ arn: LOOKUP_ROLE });
    expect(stackArtifact.assumeRoleArn).toEqual(DEPLOY_ACTION_ROLE);

    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
    const firstFile: any = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile.destinations['000000000000-us-east-1'].assumeRoleArn).toEqual('arn');
  });
});

function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}

class TestAppScopedStagingSynthesizer extends AppScopedStagingSynthesizer {
  public constructor(props: Partial<AppScopedStagingSynthesizerProps> = {}) {
    super({
      bootstrapRoles: {
        cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
        deploymentActionRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
        lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
      },
      ...props,
    });
  }
}