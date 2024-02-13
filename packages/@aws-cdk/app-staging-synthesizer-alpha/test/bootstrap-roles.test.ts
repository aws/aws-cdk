import * as fs from 'fs';
import { App, Stack, CfnResource } from 'aws-cdk-lib';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import { APP_ID, isAssetManifest } from './util';
import { AppStagingSynthesizer, BootstrapRole, DeploymentIdentities } from '../lib';

const CLOUDFORMATION_EXECUTION_ROLE = 'cloudformation-execution-role';
const DEPLOY_ACTION_ROLE = 'deploy-action-role';
const LOOKUP_ROLE = 'lookup-role';

describe('Boostrap Roles', () => {
  test('default bootstrap role name is always under 64 characters', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: 'super long app id that needs to be cut',
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
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
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
    const firstFile: any = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
    expect(firstFile.destinations['000000000000-us-east-1'].assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-super-long-app-id-th-file-role-us-east-1');
  });

  test('can supply existing arns for bootstrapped roles', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        deploymentIdentities: DeploymentIdentities.specifyRoles({
          cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
          lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
          deploymentRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
        }),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
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

  test('can request other bootstrap region', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        deploymentIdentities: DeploymentIdentities.defaultBootstrapRoles({
          bootstrapRegion: 'us-west-2',
        }),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });

    // WHEN
    const stackArtifact = synthStack(app);

    // Bootstrapped roles are as advertised
    expect(stackArtifact.cloudFormationExecutionRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-hnb659fds-cfn-exec-role-000000000000-us-west-2');
    expect(stackArtifact.lookupRole).toEqual({ arn: 'arn:${AWS::Partition}:iam::000000000000:role/cdk-hnb659fds-lookup-role-000000000000-us-west-2' });
    expect(stackArtifact.assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-hnb659fds-deploy-role-000000000000-us-west-2');
  });

  test('can request other qualifier', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        bootstrapQualifier: 'Q',
        deploymentIdentities: DeploymentIdentities.defaultBootstrapRoles({
          bootstrapRegion: 'us-west-2',
        }),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });

    // WHEN
    const stackArtifact = synthStack(app);

    // Bootstrapped roles are as advertised
    expect(stackArtifact.cloudFormationExecutionRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-Q-cfn-exec-role-000000000000-us-west-2');
    expect(stackArtifact.lookupRole).toEqual({ arn: 'arn:${AWS::Partition}:iam::000000000000:role/cdk-Q-lookup-role-000000000000-us-west-2' });
    expect(stackArtifact.assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-Q-deploy-role-000000000000-us-west-2');
  });

  test('can supply existing arn for bucket staging role', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/S3Access'),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
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
    // Staging role is as advertised
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
    const firstFile: any = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
    expect(firstFile.destinations['000000000000-us-east-1'].assumeRoleArn).toEqual('arn:aws:iam::123456789012:role/S3Access');
  });

  test('can provide existing arn for image staging role', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        imageAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/ECRAccess'),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    const stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      assetName: 'myDockerAsset',
    });

    // WHEN
    const asm = app.synth();

    // THEN
    // Image role is as advertised
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
    const firstFile: any = (manifest.dockerImages ? manifest.dockerImages[Object.keys(manifest.dockerImages)[0]] : undefined) ?? {};
    expect(firstFile.destinations['000000000000-us-east-1'].assumeRoleArn).toEqual('arn:aws:iam::123456789012:role/ECRAccess');
  });

  test('bootstrap roles can be specified as current cli credentials instead', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        deploymentIdentities: DeploymentIdentities.cliCredentials(),
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
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

  test('qualifier is resolved in the synthesizer', () => {
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        bootstrapQualifier: 'abcdef',
        appId: APP_ID,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const stackArtifact = asm.getStackArtifact('Stack');

    // Bootstrapped role's asset manifest tokens are resolved, where possible
    expect(stackArtifact.cloudFormationExecutionRoleArn).toEqual('arn:${AWS::Partition}:iam::000000000000:role/cdk-abcdef-cfn-exec-role-000000000000-us-east-1');
  });
});

function synthStack(app: App) {
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
  return asm.getStackArtifact('Stack');
}
