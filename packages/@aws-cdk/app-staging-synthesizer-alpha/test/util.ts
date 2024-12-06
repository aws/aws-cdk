import { execSync } from 'child_process';
import * as cxapi from 'aws-cdk-lib/cx-api';

export const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};
export const APP_ID = 'appid';
export const APP_ID_MAX = 'default-resourcesmax';

export function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

export function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}

export function testWithXRepos(x: number): boolean {
  // set env variable
  process.env.IMAGE_COPIES = String(x);

  // execute cdk synth requesting 'copies' number of ecr repos
  try {
    execSync("npx cdk synth --app='node test/integ.synth-default-resources.js' --all", {
      stdio: 'pipe',
    });
  } catch (error: any) {
    // max size exceeded error
    if (error.message.includes('51200')) {
      return false;
    }
    throw error;
  }
  return true;
}
