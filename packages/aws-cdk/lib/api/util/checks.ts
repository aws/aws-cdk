import { debug } from '../../logging';
import { SDK } from '../aws-auth/sdk';

export async function determineAllowCrossAccountAssetPublishing(sdk: SDK, customStackName?: string): Promise<boolean> {
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
    debug('Defaulting to disallowing cross account asset publishing');
    return false;
  }
}

interface BootstrapStackInfo {
  hasStagingBucket: boolean;
  bootstrapVersion: number;
}

export async function getBootstrapStackInfo(sdk: SDK, stackName: string): Promise<BootstrapStackInfo> {
  try {
    const cfn = sdk.cloudFormation();
    const stackResponse = await cfn.describeStacks({ StackName: stackName });

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

    // try to get bucketname from the logical resource id
    let bucketName: string | undefined;
    const resourcesResponse = await cfn.describeStackResources({ StackName: stackName });
    const bucketResource = resourcesResponse.StackResources?.find(resource =>
      resource.ResourceType === 'AWS::S3::Bucket',
    );
    bucketName = bucketResource?.PhysicalResourceId;

    let hasStagingBucket = !!bucketName;

    return {
      hasStagingBucket,
      bootstrapVersion,
    };
  } catch (e) {
    throw new Error(`Error retrieving toolkit stack info: ${e}`);
  }
}