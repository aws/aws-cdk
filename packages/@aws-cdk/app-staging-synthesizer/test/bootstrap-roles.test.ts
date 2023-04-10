import { App, Stack, CfnResource } from 'aws-cdk-lib';
import { isAssetManifest } from 'aws-cdk-lib/pipelines/lib/private/cloud-assembly-internals';
import { AppStagingSynthesizer, BootstrapRole } from '../lib';
import { APP_ID, CLOUDFORMATION_EXECUTION_ROLE, DEPLOY_ACTION_ROLE, LOOKUP_ROLE } from './util';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
import * as fs from 'fs';

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

  test('qualifier is resolved in the synthesizer', () => {
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.stackPerEnv({
        qualifier: 'abcdef',
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