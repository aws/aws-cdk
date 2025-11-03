import * as iam from '../../aws-iam';
import { IResource } from '../../core';

/**
 * Imported or created hosted zone
 */
export interface IHostedZone extends IResource {
  /**
   * ID of this hosted zone, such as "Z23ABC4XYZL05B"
   *
   * @attribute
   */
  readonly hostedZoneId: string;

  /**
   * FQDN of this hosted zone
   */
  readonly zoneName: string;

  /**
   * ARN of this hosted zone, such as arn:${Partition}:route53:::hostedzone/${Id}
   *
   * @attribute
   */
  readonly hostedZoneArn: string;

  /**
   * Returns the set of name servers for the specific hosted zone. For example:
   * ns1.example.com.
   *
   * This attribute will be undefined for private hosted zones or hosted zones imported from another stack.
   *
   * @attribute
   */
  readonly hostedZoneNameServers?: string[];

  /**
   * Grant permissions to add delegation records to this zone
   */
  grantDelegation(grantee: iam.IGrantable, options?: GrantDelegationOptions): iam.Grant;
}

/**
 * Options for the delegation permissions granted
 */
export interface GrantDelegationOptions {
  /**
   * List of hosted zone names to allow delegation to in the grant permissions.
   * If the delegated zone name contains an unresolved token,
   * it must resolve to a zone name that satisfies the requirements according to the documentation:
   * https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-conditions-route53.html#route53_rrset_conditionkeys_normalization
   *
   * > All letters must be lowercase.
   * > The DNS name must be without the trailing dot.
   * > Characters other than a–z, 0–9, - (hyphen), _ (underscore), and . (period, as a delimiter between labels) must use escape codes in the format \three-digit octal code. For example, \052 is the octal code for character *.
   *
   * @default the grant allows delegation to any hosted zone
   */
  readonly delegatedZoneNames?: string[];
}

/**
 * Reference to a hosted zone
 */
export interface HostedZoneAttributes {
  /**
   * Identifier of the hosted zone
   */
  readonly hostedZoneId: string;

  /**
   * Name of the hosted zone
   */
  readonly zoneName: string;
}

/**
 * Reference to a public hosted zone
 */
export interface PublicHostedZoneAttributes extends HostedZoneAttributes { }

/**
 * Reference to a private hosted zone
 */
export interface PrivateHostedZoneAttributes extends HostedZoneAttributes { }
