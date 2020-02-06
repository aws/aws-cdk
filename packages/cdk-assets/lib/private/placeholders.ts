import { AssetManifest } from "@aws-cdk/cx-api";
import { IAws } from "../aws-operations";

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 */
export async function replaceAwsPlaceholders<A extends { region: string }>(object: A, aws: IAws): Promise<A> {
  let region: string | undefined;
  let account: string | undefined;

  return await recurse(object);

  async function recurse(value: any): Promise<any> {
    if (typeof value === 'string') {
      if (value.indexOf(AssetManifest.CURRENT_REGION_PLACEHOLDER) > -1) { await ensureRegion(); }
      if (value.indexOf(AssetManifest.CURRENT_ACCOUNT_PLACEHOLDER) > -1) { await ensureAccount(); }

      value = replaceAll(value, AssetManifest.CURRENT_REGION_PLACEHOLDER, region ?? '*');
      value = replaceAll(value, AssetManifest.CURRENT_ACCOUNT_PLACEHOLDER, account ?? '*');

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
      region = object.region ?? await aws.defaultRegion();
    }
  }

  async function ensureAccount() {
    if (account === undefined) {
      account = await aws.currentAccount();
    }
  }
}

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}