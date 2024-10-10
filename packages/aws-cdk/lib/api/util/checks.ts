import { debug } from '../../logging';
import { ISDK } from '../aws-auth/sdk';

export async function determineAllowCrossAccountAssetPublishing(sdk: ISDK, customStackName?: string): Promise<boolean> {
  try {
    const stackName = customStackName || 'CDKToolkit';
    const stackInfo = await getBootstrapStackInfo(sdk, stackName);

    if (!stackInfo.hasStagingBucket) {
      // indicates an intentional cross account setup
      return true;
    }

    if (stackInfo.bootstrapVersion >= 21) {
      // bootstrap stack version 21 contains a fix that will prevent cross
      // account publishing on the IAM level
      // https://github.com/aws/aws-cdk/pull/30823
      return true;
    }

    // other scenarios are highly irregular and potentially dangerous so we prevent it by
    // instructing cdk-assets to detect foreign bucket ownership and reject.
    return false;
  } catch (e) {
    debug(`Error determining cross account asset publishing: ${e}`);
    debug(`Defaulting to disallowing cross account asset publishing`);
    return false;
  }
}

interface BootstrapStackInfo {
  hasStagingBucket: boolean;
  bootstrapVersion: number;
}

async function getBootstrapStackInfo(sdk: ISDK, stackName: string): Promise<BootstrapStackInfo> {
  try {
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();
    const response = await cfn.describeStacks({ StackName: stackName }).promise();

    if (!response.Stacks || response.Stacks.length === 0) {
      throw new Error(`Toolkit stack ${stackName} not found`);
    }

    const stack = response.Stacks[0];
    const bucketNameOutput = stack.Outputs?.find(output => output.OutputKey === 'BucketName');
    const versionOutput = stack.Outputs?.find(output => output.OutputKey === 'BootstrapVersion');

    if (!bucketNameOutput?.OutputValue) {
      throw new Error(`Unable to locate the Staging BucketName output value in the toolkit stack ${stackName}`);
    }

    if (!versionOutput?.OutputValue) {
      throw new Error(`Unable to find BootstrapVersion output in the toolkit stack ${stackName}`);
    }

    const bootstrapVersion = parseInt(versionOutput.OutputValue);
    if (isNaN(bootstrapVersion)) {
      throw new Error(`Invalid BootstrapVersion value: ${versionOutput.OutputValue}`);
    }

    let hasStagingBucket = false;
    try {
      await s3.headBucket({ Bucket: bucketNameOutput.OutputValue }).promise();
      hasStagingBucket = true;
    } catch (s3Error) {
      debug(`Bucket ${bucketNameOutput.OutputValue} either does not exist, or is not accessible: ${s3Error}`);
    }

    return {
      hasStagingBucket,
      bootstrapVersion,
    };
  } catch (e) {
    throw new Error(`Error retrieving toolkit stack info: ${e}`);
  }
}