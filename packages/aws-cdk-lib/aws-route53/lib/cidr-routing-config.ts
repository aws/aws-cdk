import { Token, UnscopedValidationError } from '../../core';

/**
 * Properties for configuring CIDR routing in Route 53 resource record set objects.
 */
export interface CidrRoutingConfigProps {
  /**
   * The CIDR collection ID.
   */
  readonly collectionId: string;

  /**
   * The CIDR collection location name.
   */
  readonly locationName: string;
}

/**
 * Configuration for CIDR routing in Route 53 resource record set objects.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordset.html#cfn-route53-recordset-cidrroutingconfig
 */
export class CidrRoutingConfig {
  /**
   * Creates a new instance of CidrRoutingConfig
   */
  public static new(props: CidrRoutingConfigProps): CidrRoutingConfig {
    return new CidrRoutingConfig(props);
  }

  /**
   * The CIDR collection ID.
   */
  readonly collectionId: string;

  /**
   * The CIDR collection location name.
   */
  readonly locationName: string;

  private constructor(props: CidrRoutingConfigProps) {
    const COLLECTION_ID_REGEX = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
    const LOCATION_NAME_REGEX = /^[0-9A-Za-z_\-\*]{1,16}$/;
    if (!Token.isUnresolved(props.collectionId) && !COLLECTION_ID_REGEX.test(props.collectionId)) {
      throw new UnscopedValidationError(`collectionId(${props.collectionId}) is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx(8-4-4-4-12 digits)`);
    }
    if (!props.locationName || !LOCATION_NAME_REGEX.test(props.locationName)) {
      throw new UnscopedValidationError(`locationName(${props.locationName}) is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks`);
    }
    this.collectionId = props.collectionId;
    this.locationName = props.locationName;
  }
}
