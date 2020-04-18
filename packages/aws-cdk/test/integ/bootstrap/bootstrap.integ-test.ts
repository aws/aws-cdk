import * as core from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { bootstrapEnvironment, deployStack, destroyStack, ISDK, Mode, SdkProvider, ToolkitInfo } from '../../../lib/api';
import { bootstrapEnvironment2 } from '../../../lib/api/bootstrap/bootstrap-environment2';
import { ExampleAsset, MyTestCdkStack } from './example-cdk-app/my-test-cdk-stack';

jest.setTimeout(600_000);

describe('Bootstrapping', () => {
  const bootstrapStackName = 'AwsCdkBootstrapIntegTestLegacy';

  const account = requireEnvVariable('TEST_ACCOUNT');
  const region = requireEnvVariable('TEST_REGION');
  let s3: AWS.S3;
  let env: cxapi.Environment;
  let sdkProvider: SdkProvider;
  let sdk: ISDK;

  beforeAll(async () => {
    env = {
      name: 'aws-cdk-bootstrap-integ-test',
      account,
      region,
    };
    sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
      httpOptions: {
        userAgent: 'aws-cdk-bootstrap-integ-test',
      }
    });
    sdk = await sdkProvider.forEnvironment(env.account, env.region, Mode.ForWriting);
    s3 = sdk.s3();
  });

  describe('deploys the legacy bootstrap stack', () => {
    const legacyBootstrapBucketName = 'aws-cdk-bootstrap-integ-test-legacy-bckt';
    const newBootstrapBucketName = 'aws-cdk-bootstrap-integ-test-v2-bckt';
    const exampleAppStack = 'BootstrapIntegTestExampleCdkAppStack';
    const outdir = path.join(__dirname, 'cdk.out');

    let bootstrapStack: cxapi.CloudFormationStackArtifact;
    let testStack: cxapi.CloudFormationStackArtifact;

    beforeAll(async () => {
      // bootstrap the "old" way
      const bootstrapResults = await bootstrapEnvironment(env, sdkProvider, bootstrapStackName, undefined, {
        bucketName: legacyBootstrapBucketName,
      });
      bootstrapStack = bootstrapResults.stackArtifact;
    });

    test('and then can deploy a CDK app using that bootstrap stack', async () => {
      testStack = await deployCdkApp(outdir, env, sdkProvider, sdk, bootstrapStackName, (app) => {
        new MyTestCdkStack(app, exampleAppStack, {
          assetType: ExampleAsset.ASSET_1,
          env,
        });
      });
    });

    describe('and then updates the bootstrap stack with the new resources', () => {
      beforeAll(async () => {
        // bootstrap the "new" way
        const bootstrapResults = await bootstrapEnvironment2(env, sdkProvider, bootstrapStackName, undefined, {
          bucketName: newBootstrapBucketName,
          trustedAccounts: ['790124522186', '593667001225'],
          cloudFormationExecutionPolicies: [
            'arn:aws:iam::aws:policy/AdministratorAccess',
            'arn:aws:iam::aws:policy/AmazonS3FullAccess',
          ],
        });
        bootstrapStack = bootstrapResults.stackArtifact;
      });

      test('can now update the CDK app with the new bootstrap stack', async () => {
        await deployCdkApp(outdir, env, sdkProvider, sdk, bootstrapStackName, (app) => {
          new MyTestCdkStack(app, exampleAppStack, {
            assetType: ExampleAsset.ASSET_2,
            env,
          });
        });
      });

      afterAll(async () => {
        // empty and delete the now orphaned previous bootstrap bucket
        await emptyBucket(s3, legacyBootstrapBucketName);
        return s3.deleteBucket({ Bucket: legacyBootstrapBucketName }).promise();
      });
    });

    afterAll(() => {
      // delete the test CDK app stack
      return destroyStack({
        stack: testStack,
        sdk,
      });
    });

    afterAll(async () => {
      // empty the bootstrap bucket -
      // otherwise, CloudFormation will fail to delete the bootstrap stack
      await emptyBucket(s3, newBootstrapBucketName);

      return destroyStack({
        stack: bootstrapStack,
        sdk,
      });
    });
  });
});

function requireEnvVariable(variableName: string): string {
  const ret = process.env[variableName];
  if (!ret) {
    throw new Error(`It is mandatory to set the '${variableName}' environment variable before running this test`);
  }
  return ret;
}

async function deployCdkApp(
  outdir: string, env: cxapi.Environment, sdkProvider: SdkProvider,
  sdk: ISDK, bootstrapStackName: string, cdkCode: (app: core.App) => void) {
  // clean the output directory, just to make 100% sure there is no junk left there
  await fs.remove(outdir);

  // synthesize an app to a local cdk.out
  const app = new core.App({ outdir });
  cdkCode(app);
  const assembly = app.synth();

  // now deploy the synthesized app
  const toolkitInfo = await ToolkitInfo.lookup(env, sdk, bootstrapStackName);
  const testStack = assembly.stacks[0]; // we assume there's just one stack
  await deployStack({
    stack: testStack,
    resolvedEnvironment: env,
    toolkitInfo,
    sdkProvider,
    sdk,
  });
  return testStack;
}

async function emptyBucket(s3: AWS.S3, bucketName: string) {
  const objects = await s3.listObjects({ Bucket: bucketName }).promise();
  const deletes = (objects.Contents || []).map(obj => obj.Key || '').filter(d => !!d);
  if (deletes.length === 0) {
    return Promise.resolve();
  }
  return s3.deleteObjects({
    Bucket: bucketName,
    Delete: {
      Objects: deletes.map(d => ({ Key: d })),
      Quiet: false,
    },
  }).promise();
}
