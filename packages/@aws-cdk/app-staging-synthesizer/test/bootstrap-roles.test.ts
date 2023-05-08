import * as fs from 'fs';
import { App, Stack, CfnResource } from 'aws-cdk-lib';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import { APP_ID, CLOUDFORMATION_EXECUTION_ROLE, DEPLOY_ACTION_ROLE, LOOKUP_ROLE, isAssetManifest } from './util';
import { AppStagingSynthesizer, BootstrapRole } from '../lib';

describe('Boostrap Roles', () => {
  test('Can supply existing arns for bootstrapped roles', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        deploymentRoles: {
          cloudFormationExecutionRole: BootstrapRole.fromRoleArn(CLOUDFORMATION_EXECUTION_ROLE),
          lookupRole: BootstrapRole.fromRoleArn(LOOKUP_ROLE),
          deploymentRole: BootstrapRole.fromRoleArn(DEPLOY_ACTION_ROLE),
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

  test('can supply existing arns for bucket staging role', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/S3Access'),
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

  test('can provide existing arns for image staging role', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        imageAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/ECRAccess'),
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
        deploymentRoles: {
          cloudFormationExecutionRole: BootstrapRole.cliCredentials(),
          lookupRole: BootstrapRole.cliCredentials(),
          deploymentRole: BootstrapRole.cliCredentials(),
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

  test('qualifier is resolved in the synthesizer', () => {
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        bootstrapQualifier: 'abcdef',
        appId: APP_ID,
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
