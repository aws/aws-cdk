import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ImportMock } from 'ts-mock-imports';
import { SdkProvider } from '../../lib';
import { execProgram } from '../../lib/api/cxapp/exec';
import { Configuration, Settings } from '../../lib/settings';
import * as cli from '../../lib/version';

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

test('execProgram throws when framework version > cli version', async () => {

    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));
    const manifestFilePath = path.join(outdir, 'manifest.json');

    const app = createApp(outdir);

    app.synth();

    // patch manifest version to simulate a larger framework version.
    const manifest = JSON.parse(fs.readFileSync(manifestFilePath, "UTF-8"));
    manifest.version = "999.0.0";
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest));

    const expectedError = `A newer version of the CDK CLI (>= ${manifest.version}) is necessary to interact with this app`;

    const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults();

    const config = new Configuration();
    config.settings = new Settings({
        app: outdir
    });

    try {
        await execProgram(sdkProvider, config);
        fail('Expected execProgram to throw');
    } catch (err) {
        expect(err.message).toEqual(expectedError);
    }

});

test('execProgram does not throw when framework version = cli version', async () => {

    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));

    const app = createApp(outdir);

    app.synth();

    const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults();

    const config = new Configuration();
    config.settings = new Settings({
        app: outdir
    });

    try {
        await execProgram(sdkProvider, config);
    } catch (err) {
        fail(err.message);
    }

});

test('execProgram does not throw when framework version < cli version', async () => {

    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-tests'));
    const manifestFilePath = path.join(outdir, 'manifest.json');

    const app = createApp(outdir);

    app.synth();

    // patch manifest version to make sure we don't compare 0.0.0 and 0.0.0 in case the mock
    // is faulty. (maybe someone changes the method name...)
    const manifest = JSON.parse(fs.readFileSync(manifestFilePath, "UTF-8"));
    manifest.version = "888.0.0";
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest));

    const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults();

    const config = new Configuration();
    config.settings = new Settings({
        app: outdir
    });

    const mockVersionNumber = ImportMock.mockFunction(cli, 'versionNumber', "999.0.0");
    try {
        await execProgram(sdkProvider, config);
    } catch (err) {
        fail(err.message);
    } finally {
        mockVersionNumber.restore();
    }

});
