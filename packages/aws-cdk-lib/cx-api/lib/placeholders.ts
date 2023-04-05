/**
 * Placeholders which can be used manifests
 *
 * These can occur both in the Asset Manifest as well as the general
 * Cloud Assembly manifest.
 */
export class EnvironmentPlaceholders {
  /**
   * Insert this into the destination fields to be replaced with the current region
   */
  public static readonly CURRENT_REGION = '${AWS::Region}';

  /**
   * Insert this into the destination fields to be replaced with the current account
   */
  public static readonly CURRENT_ACCOUNT = '${AWS::AccountId}';

  /**
   * Insert this into the destination fields to be replaced with the current partition
   */
  public static readonly CURRENT_PARTITION = '${AWS::Partition}';

  /**
   * Replace the environment placeholders in all strings found in a complex object.
   *
   * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
   * (they're nominally independent tools).
   */
  public static replace(object: any, values: EnvironmentPlaceholderValues): any {
    return this.recurse(object, value => {
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_REGION, values.region);
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_ACCOUNT, values.accountId);
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_PARTITION, values.partition);
      return value;
    });
  }

  /**
   * Like 'replace', but asynchronous
   */
  public static async replaceAsync(object: any, provider: IEnvironmentPlaceholderProvider): Promise<any> {
    let needRegion = false;
    let needAccountId = false;
    let needPartition = false;

    this.recurse(object, value => {
      if (value.indexOf(EnvironmentPlaceholders.CURRENT_REGION) > 1) { needRegion = true; }
      if (value.indexOf(EnvironmentPlaceholders.CURRENT_ACCOUNT) > 1) { needAccountId = true; }
      if (value.indexOf(EnvironmentPlaceholders.CURRENT_PARTITION) > 1) { needPartition = true; }
      return value;
    });

    const region = needRegion ? await provider.region() : undefined;
    const accountId = needAccountId ? await provider.accountId() : undefined;
    const partition = needPartition ? await provider.partition() : undefined;

    return this.recurse(object, value => {
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_REGION, region ?? 'WONTHAPPEN');
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_ACCOUNT, accountId ?? 'WONTHAPPEN');
      value = replaceAll(value, EnvironmentPlaceholders.CURRENT_PARTITION, partition ?? 'WONTHAPPEN');
      return value;
    });
  }

  private static recurse(value: any, cb: (x: string) => string): any {
    if (typeof value === 'string') { return cb(value); }
    if (typeof value !== 'object' || value === null) { return value; }
    if (Array.isArray(value)) { return value.map(x => this.recurse(x, cb)); }

    const ret: Record<string, any> = {};
    for (const [key, inner] of Object.entries(value)) {
      ret[key] = this.recurse(inner, cb);
    }
    return ret;
  }
}

/**
 * Return the appropriate values for the environment placeholders
 */
export interface EnvironmentPlaceholderValues {
  /**
   * Return the region
   */
  readonly region: string;

  /**
   * Return the account
   */
  readonly accountId: string;

  /**
   * Return the partition
   */
  readonly partition: string;
}

/**
 * Return the appropriate values for the environment placeholders
 */
export interface IEnvironmentPlaceholderProvider {
  /**
   * Return the region
   */
  region(): Promise<string>;

  /**
   * Return the account
   */
  accountId(): Promise<string>;

  /**
   * Return the partition
   */
  partition(): Promise<string>;
}

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}
