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
    const stackResponse = await cfn.describeStacks({ StackName: stackName }).promise();

    if (!stackResponse.Stacks || stackResponse.Stacks.length === 0) {
      throw new Error(`Toolkit stack ${stackName} not found`);
    }

    const stack = stackResponse.Stacks[0];
    const versionOutput = stack.Outputs?.find(output => output.OutputKey === 'BootstrapVersion');

    if (!versionOutput?.OutputValue) {
      throw new Error(`Unable to find BootstrapVersion output in the toolkit stack ${stackName}`);
    }

    const bootstrapVersion = parseInt(versionOutput.OutputValue);
    if (isNaN(bootstrapVersion)) {
      throw new Error(`Invalid BootstrapVersion value: ${versionOutput.OutputValue}`);
    }

    // Try to get the bucket name from the stack outputs first
    let bucketName = stack.Outputs?.find(output => output.OutputKey === 'BucketName')?.OutputValue;

    // If not found in outputs, try to get it from the logical resource id
    if (!bucketName) {
      const resourcesResponse = await cfn.describeStackResources({ StackName: stackName }).promise();
      const bucketResource = resourcesResponse.StackResources?.find(resource => 
        resource.LogicalResourceId === 'StagingBucket' && 
        resource.ResourceType === 'AWS::S3::Bucket'
      );
      bucketName = bucketResource?.PhysicalResourceId;
    }

    let hasStagingBucket = !!bucketName;

    return {
      hasStagingBucket,
      bootstrapVersion,
    };
  } catch (e) {
    throw new Error(`Error retrieving toolkit stack info: ${e}`);
  }
}