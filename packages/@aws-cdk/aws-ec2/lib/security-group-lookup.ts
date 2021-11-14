import { IVpc } from './vpc';

/**
 * Properties for looking up an existing SecurityGroup.
 *
 * Either `securityGroupName` or `securityGroupId` has to be specified.
 */
export interface SecurityGroupLookupOptions {
  /**
   * The name of the security group
   *
   * If given, will import the SecurityGroup with this name.
   *
   * @default Don't filter on securityGroupName
   */
  readonly securityGroupName?: string;

  /**
   * The ID of the security group
   *
   * If given, will import the SecurityGroup with this ID.
   *
   * @default Don't filter on securityGroupId
   */
  readonly securityGroupId?: string;

  /**
   * The VPC of the security group
   *
   * If given, will filter the SecurityGroup based on the VPC.
   *
   * @default Don't filter on VPC
   */
  readonly vpc?: IVpc,
}