import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

/**
 * To verify that the Glue job script is deployed to the user-supplied bucket instead of the CDK asset bucket.
 *
 * Once deployed, confirm the script object exists in the custom bucket:
 *   `aws s3 ls s3://<ScriptsBucket name>/hello_world.py`
 *
 * Run the job using
 *   `aws glue start-job-run --region us-east-1 --job-name <job name>`
 * and confirm it can read its script from the custom bucket and completes successfully.
 */
const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-job-custom-script-bucket');

// The user-supplied bucket that Glue scripts should be deployed to, separate from the CDK asset bucket.
const scriptsBucket = new s3.Bucket(stack, 'ScriptsBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const script = glue.Code.fromAsset(
  path.join(__dirname, 'job-script', 'hello_world.py'),
  undefined,
  scriptsBucket,
);

const iamRole = new iam.Role(stack, 'IAMServiceRole', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
});

new glue.PythonShellJob(stack, 'ShellJobWithCustomScriptBucket', {
  script,
  role: iamRole,
});

new integ.IntegTest(app, 'aws-glue-job-custom-script-bucket-integ-test', {
  testCases: [stack],
});

app.synth();
