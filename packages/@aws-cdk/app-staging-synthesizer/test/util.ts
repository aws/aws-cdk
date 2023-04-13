import { DefaultResourcesOptions, AppStagingSynthesizer, BootstrapRole } from '../lib';
import * as cxapi from 'aws-cdk-lib/cx-api';

export const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};
export const APP_ID = 'appId';
export const CLOUDFORMATION_EXECUTION_ROLE = 'role';
export const DEPLOY_ACTION_ROLE = 'role';
export const LOOKUP_ROLE = 'role';

export function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

export function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}

export class TestAppScopedStagingSynthesizer {
  public static stackPerEnv(props: Partial<DefaultResourcesOptions> = {}): AppStagingSynthesizer {
    return AppStagingSynthesizer.defaultResources({
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