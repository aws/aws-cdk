/**
 * Destination for assets that need to be uploaded to AWS
 */
export interface AwsDestination {
  /**
   * The region where this asset will need to be published
   *
   * @default - Current region
   */
  readonly region?: string;

  /**
   * The role that needs to be assumed while publishing this asset
   *
   * @default - No role will be assumed
   */
  readonly assumeRoleArn?: string;

  /**
   * The ExternalId that needs to be supplied while assuming this role
   *
   * @default - No ExternalId will be supplied
   */
  readonly assumeRoleExternalId?: string;
}

/**
 * Placeholders which can be used in the destinations
 */
export class Placeholders {
  /**
   * Insert this into the destination fields to be replaced with the current region
   */
  public static readonly CURRENT_REGION = '${AWS::Region}';

  /**
   * Insert this into the destination fields to be replaced with the current account
   */
  public static readonly CURRENT_ACCOUNT = '${AWS::AccountId}';
}