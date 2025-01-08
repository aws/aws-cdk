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

    // If there is a staging bucket AND the bootstrap version is old, then we want to protect
    // against accidental cross-account publishing.
    return false;
  } catch (e) {
    // You would think we would need to fail closed here, but the reality is
    // that we get here if we couldn't find the bootstrap stack: that is
    // completely valid, and many large organizations may have their own method
    // of creating bootstrap resources. If they do, there's nothing for us to validate,
    // but we can't use that as a reason to disallow cross-account publishing. We'll just
    // have to trust they did their due diligence. So we fail open.
    debug(`Error determining cross account asset publishing: ${e}`);
    debug('Defaulting to allowing cross account asset publishing');
    return true;
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

    // try to get bucketname from the logical resource id. If there is no
    // bucketname, or the value doesn't look like an S3 bucket name, we assume
    // the bucket doesn't exist (this is for the case where a template customizer did
    // not dare to remove the Output, but put a dummy value there like '' or '-' or '***').
    //
    // We would have preferred to look at the stack resources here, but
    // unfortunately the deploy role doesn't have permissions call DescribeStackResources.
    const bucketName = stack.Outputs?.find(output => output.OutputKey === 'BucketName')?.OutputValue;
    // Must begin and end with letter or number.
    const hasStagingBucket = !!(bucketName && bucketName.match(/^[a-z0-9]/) && bucketName.match(/[a-z0-9]$/));

    return {
      hasStagingBucket,
      bootstrapVersion,
    };
  } catch (e) {
    throw new Error(`Error retrieving toolkit stack info: ${e}`);
  }
}
