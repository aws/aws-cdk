import { debug } from "../../logging";
import { SharedIniFile } from "./sdk_ini_file";

/**
 * Return the default region in a CLI-compatible way
 *
 * Mostly copied from node_loader.js, but with the following differences to make it
 * AWS CLI compatible:
 *
 * 1. Takes a profile name as an argument (instead of forcing it to be taken from $AWS_PROFILE).
 *    This requires having made a copy of the SDK's `SharedIniFile` (the original
 *    does not take an argument).
 * 2. $AWS_DEFAULT_PROFILE and $AWS_DEFAULT_REGION are also respected.
 *
 * Lambda and CodeBuild set the $AWS_REGION variable.
 *
 * FIXME: EC2 instances require querying the metadata service to determine the current region.
 */
export async function getAwsCliCompatibleDefaultRegion(profile: string | undefined): Promise<string> {
  profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

  // Defaults inside constructor
  const toCheck = [
    {filename: process.env.AWS_SHARED_CREDENTIALS_FILE },
    {isConfig: true, filename: process.env.AWS_CONFIG_FILE},
  ];

  let region = process.env.AWS_REGION || process.env.AMAZON_REGION ||
    process.env.AWS_DEFAULT_REGION || process.env.AMAZON_DEFAULT_REGION;

  while (!region && toCheck.length > 0) {
    const configFile = new SharedIniFile(toCheck.shift());
    const section = await configFile.getProfile(profile);
    region = section && section.region;
  }

  if (!region) {
    const usedProfile = !profile ? '' : ` (profile: "${profile}")`;
    region = 'us-east-1'; // This is what the AWS CLI does
    debug(`Unable to determine AWS region from environment or AWS configuration${usedProfile}, defaulting to '${region}'`);
  }

  return region;
}