import { debug } from '../../logging';
import { ISDK } from '../aws-auth/sdk';

export async function determineAllowCrossAccountAssetPublishing(sdk: ISDK, customStackName?: string): Promise<boolean> {
  const stackName = customStackName || 'CDKToolkit';
  if (!(await _stagingBucketInToolkitStack(sdk, stackName))) {
    // indicates an intentional cross account setup
    return true;
  }

  if (await _bootstrapVersion(sdk, stackName) >= 21) {
    // bootstrap stack version 21 contains a fix that will prevent cross
    // account publishing on the IAM level. Therefore, we can safely allow this in the CLI.
    // It will either fail, or if it succeeds then the user has customized their bootstrap stack
    // to explicitly allow it, which is also fine.
    // https://github.com/aws/aws-cdk/pull/30823
    return true;
  }

  // other scenarios are highly irregular and potentially dangerous so we prevent it by
  // instructing cdk-assets to detect foriegn bucket ownership and reject.
  return false;
}

async function _stagingBucketInToolkitStack(sdk: ISDK, stackName?: string): Promise<boolean> {
  const toolkitStackName = stackName || 'CDKToolkit';
  try {
    // Create the SDKs for this enviornment, and use it to get the stack
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();
    const response = await cfn.describeStacks({ StackName: toolkitStackName }).promise();

    // Check if the toolkit stack exists
    if (!response.Stacks || response.Stacks.length === 0) {
      throw new Error(`Toolkit stack ${toolkitStackName} not found`);
    }

    // Check if we can retrieve the bucketName from the output
    const bucketNameOutput = response.Stacks[0].Outputs?.find(
      output => output.OutputKey === 'BucketName',
    );
    if (!bucketNameOutput || !bucketNameOutput.OutputValue) {
      throw new Error(`Unable to locate the Staging BucketName output value in the toolkit stack ${toolkitStackName}`);
    }

    // Check if the bucket exists and is accessible
    try {
      await s3.headBucket({ Bucket: bucketNameOutput.OutputValue }).promise();
      return true;
    } catch (s3Error) {
      debug(`Bucket ${bucketNameOutput.OutputValue} either does not exist, or is not accessible: ${s3Error}`);
      return false;
    }
  } catch (e) {
    debug(`Error checking for staging bucket in toolkit stack: ${e}`);
    return false;
  }
}

async function _bootstrapVersion(sdk: ISDK, stackName: string): Promise<number> {

  try {
    // get the toolkit stack
    const cfn = sdk.cloudFormation();
    const response = await cfn.describeStacks({ StackName: stackName }).promise();

    // Check if the toolkit stack exists
    if (!response.Stacks || response.Stacks.length === 0) {
      throw new Error(`Toolkit stack ${stackName} not found`);
    }

    // Determine if the bootstrap version is available
    const versionOutput = response.Stacks[0].Outputs?.find(
      output => output.OutputKey === 'BootstrapVersion',
    );
    if (!versionOutput || !versionOutput.OutputValue) {
      throw new Error(`Unable to find BootstrapVersion output in the toolkit stack ${stackName}`);
    }

    // Determine if the version is a valid number
    const version = parseInt(versionOutput.OutputValue);
    if (isNaN(version)) {
      throw new Error(`Invalid BootstrapVersion value: ${versionOutput.OutputValue}`);
    }

    return version;
  } catch (e) {
    throw new Error(`Error retrieving bootstrap version: ${e}`);
  }
}