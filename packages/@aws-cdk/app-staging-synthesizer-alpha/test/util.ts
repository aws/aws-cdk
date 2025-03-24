import { execSync } from 'child_process';
import * as fs from 'fs';
import * as cxschema from 'aws-cdk-lib/cloud-assembly-schema';
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

export function getAssetManifest(asm: cxapi.CloudAssembly): cxapi.AssetManifestArtifact {
  const manifestArtifact = asm.artifacts.find(isAssetManifest);
  if (!manifestArtifact) { throw new Error('no asset manifest in assembly'); }
  return manifestArtifact;
}

export function readAssetManifest(manifestArtifact: cxapi.AssetManifestArtifact): cxschema.AssetManifest {
  return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}
