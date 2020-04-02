import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import { ImportMock } from 'ts-mock-imports';
import { SdkProvider } from '../../lib';
import { execProgram } from '../../lib/api/cxapp/exec';
import { Configuration, Settings } from '../../lib/settings';

// We need to increase the default 5s jest
// timeout for async tests because the 'execProgram' invocation
// might take a while :\
const TEN_SECOND_TIMEOUT = 10000;

function createApp(outdir: string): cdk.App {
  const app = new cdk.App({outdir});
  const stack = new cdk.Stack(app, 'Stack');

  new cdk.CfnResource(stack, "Role", {
      type: "AWS::IAM::Role",
      properties: {
        RoleName: "Role"
      }
  });

  return app;
}

async function createSdkProvider() {
  return await SdkProvider.withAwsCliCompatibleDefaults();
}

test('cli throws when manifest version > schema version', async () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));
  const app = createApp(outdir);
  const currentSchemaVersion = cxschema.Manifest.version();
  const mockManifestVersion = semver.inc(currentSchemaVersion, 'major');

  // this mock will cause the framework to use a greater schema version than the real one,
  // and should cause the CLI to fail.
  const mockVersionNumber = ImportMock.mockFunction(cxschema.Manifest, 'version', mockManifestVersion);
  try {
    app.synth();
  } finally {
    mockVersionNumber.restore();
  }

  const expectedError = `Cloud assembly schema version mismatch: Maximum schema version supported is ${currentSchemaVersion}, but found ${mockManifestVersion}.`
    +  '\nPlease upgrade your CLI in order to interact with this app.';
  const sdkProvider = await createSdkProvider();

  const config = new Configuration();
  config.settings = new Settings({
    app: outdir
  });

  await expect(execProgram(sdkProvider, config)).rejects.toEqual(new Error(expectedError));

}, TEN_SECOND_TIMEOUT);

test('cli does not throw when manifest version = schema version', async () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));
  const app = createApp(outdir);
  app.synth();

  const sdkProvider = await createSdkProvider();
  const config = new Configuration();
  config.settings = new Settings({
    app: outdir
  });

  await execProgram(sdkProvider, config);

}, TEN_SECOND_TIMEOUT);

test('cli does not throw when manifest version < schema version', async () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));
  const app = createApp(outdir);
  const currentSchemaVersion = cxschema.Manifest.version();

  app.synth();

  const sdkProvider = await createSdkProvider();
  const config = new Configuration();
  config.settings = new Settings({
    app: outdir
  });

  // this mock will cause the cli to think its exepcted schema version is
  // greater that the version created in the manifest, which is what we are testing for.
  const mockVersionNumber = ImportMock.mockFunction(cxschema.Manifest, 'version', semver.inc(currentSchemaVersion, 'major'));
  try {
    await execProgram(sdkProvider, config);
  } finally {
    mockVersionNumber.restore();
  }

}, TEN_SECOND_TIMEOUT);
