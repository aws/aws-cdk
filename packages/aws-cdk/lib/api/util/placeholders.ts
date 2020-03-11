import { CloudFormationStackArtifact } from "@aws-cdk/cx-api";
import { Account, SdkProvider } from "../aws-auth";

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 *
 * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
 * (they're nominally independent tools).
 */
export async function replaceAwsPlaceholders<A extends { }>(object: A, aws: SdkProvider): Promise<A> {
  let region: string | undefined;
  let account: Account | undefined;

  return await recurse(object);

  async function recurse(value: any): Promise<any> {
    if (typeof value === 'string') {
      if (value.indexOf(CloudFormationStackArtifact.CURRENT_REGION) > -1) { await ensureRegion(); }
      if (value.indexOf(CloudFormationStackArtifact.CURRENT_ACCOUNT) > -1) { await ensureAccount(); }
      if (value.indexOf(CloudFormationStackArtifact.CURRENT_PARTITION) > -1) { await ensureAccount(); }

      value = replaceAll(value, CloudFormationStackArtifact.CURRENT_REGION, region ?? 'WONTHAPPEN');
      value = replaceAll(value, CloudFormationStackArtifact.CURRENT_ACCOUNT, account?.accountId ?? 'WONTHAPPEN');
      value = replaceAll(value, CloudFormationStackArtifact.CURRENT_PARTITION, account?.partition ?? 'WONTHAPPEN');

      return value;
    }

    if (typeof value !== 'object' || value === null) { return value; }
    if (Array.isArray(value)) { return value.map(recurse); }

    const ret: Record<string, any> = {};
    for (const [key, inner] of Object.entries(value)) {
      ret[key] = await recurse(inner);
    }
    return ret;
  }

  async function ensureRegion() {
    if (region === undefined) {
      region = aws.defaultRegion;
    }
  }

  async function ensureAccount() {
    if (account === undefined) {
      account = await aws.defaultAccount();
    }
  }
}

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}
