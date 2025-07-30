import { Construct } from 'constructs';
import { CfnConnectionGroup } from './cloudfront.generated';
import { CfnTag, IResource, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

export interface IConnectionGroup extends IResource {
  /**
   * The name of the connection group
   */
  readonly name: string;

  /**
   * The routing endpoint (also known as the DNS name) that is assigned to the connection group, such as d111111abcdef8.cloudfront.net.
   */
  readonly routingEndpoint: string;

  /**
   * The Amazon Resource Name (ARN) of the connection group.
   */
  readonly arn: string;

  /**
   * The unique identifier for the connection group.
   */
  readonly groupId: string;

}

/**
 * Attributes for importing an existing connection group
 */
export interface ConnectionGroupAttributes {
  /**
   * The name of the connection group
   */
  readonly name: string;

  /**
   * The routing endpoint (also known as the DNS name) that is assigned to the connection group, such as d111111abcdef8.cloudfront.net.
   */
  readonly routingEndpoint: string;

  /**
   * The Amazon Resource Name (ARN) of the connection group.
   */
  readonly arn: string;

  /**
   * The unique identifier for the connection group.
   */
  readonly groupId: string;
}

export interface ConnectionGroupProps {
  /**
   * The name of the connection group.
   */
  readonly name: string;

  /**
   * Whether the connection group is enabled
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Whether IPv6 is enabled for the connection group
   * @default false
   */
  readonly ipv6Enabled?: boolean;

  /**
   * The ID of the Anycast static IP list.
   * @default - none
   */
  readonly anycastIpListID?: string;

  /**
   * The ID of the Anycast static IP list.
   * @default - none
   */
  readonly tags?: CfnTag[];
}

export class ConnectionGroup extends Resource implements IConnectionGroup {
  /**
   * Import an existing connection group
   */
  public static fromConnectionGroupAttributes(scope: Construct, id: string, attrs: ConnectionGroupAttributes): IConnectionGroup {
    return new class extends Resource implements IConnectionGroup {
      public readonly name: string;
      public readonly routingEndpoint: string;
      public readonly arn: string;
      public readonly groupId: string;

      constructor() {
        super(scope, id);
        this.name = attrs.name;
        this.routingEndpoint = attrs.routingEndpoint;
        this.arn = attrs.arn;
        this.groupId = attrs.groupId;
      }
    }();
  }

  public readonly name: string;
  public readonly routingEndpoint: string;
  public readonly arn: string;
  public readonly groupId: string;

  constructor(scope: Construct, id: string, props: ConnectionGroupProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.name = props.name;

    const connectionGroup = new CfnConnectionGroup(this, 'Resource', {
      name: this.name,
      anycastIpListId: props.anycastIpListID,
      enabled: props.enabled ?? true,
      ipv6Enabled: props.ipv6Enabled ?? false,
      tags: props.tags,
    });

    this.routingEndpoint = connectionGroup.attrRoutingEndpoint;
    this.arn = connectionGroup.attrArn;
    this.groupId = connectionGroup.ref;
  }
}
