import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDataflowEndpointGroup } from './groundstation.generated';

/**
 * The address of the endpoint, such as 192.168.1.1.
 */
export interface SocketAddress {
  /**
   * The name of the endpoint, such as Endpoint 1.
   */
  readonly name: string
  /**
   * The port of the endpoint, such as 55888.
   */
  readonly port: number
}


/**
 * Contains information such as socket address and name that defines an endpoint.
 */
export interface DataflowEndpoint {
  /**
   *  The address and port of an endpoint.
   */
  readonly address: SocketAddress

  /**
   * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint. Valid values are between 1400 and 1500. A default value of 1500 is used if not set.
   */
  readonly mtu: number

  /**
   * The endpoint name. When listing available contacts for a satellite, Ground Station searches for a dataflow endpoint whose name matches the value specified by the dataflow endpoint config of the selected mission profile. If no matching dataflow endpoints are found then Ground Station will not display any available contacts for the satellite.
   */
  readonly name: string
}

/**
 * Information about IAM roles, subnets, and security groups needed for this DataflowEndpointGroup.
 */
export interface SecurityDetails {
  /**
   * The ARN of a role which Ground Station has permission to assume, such as arn:aws:iam::1234567890:role/DataDeliveryServiceRole. Ground Station will assume this role and create an ENI in your VPC on the specified subnet upon creation of a dataflow endpoint group. This ENI is used as the ingress/egress point for data streamed during a satellite contact.
   *
   * @default None
   */
  readonly roleArn?: string

  /**
   * The security group Ids of the security role, such as sg-1234567890abcdef0.
   *
   * @default None
   */
  readonly securityGroupIds?: string[]

  /**
   * The subnet Ids of the security details, such as subnet-12345678.
   *
   * @default None
   */
  readonly subnetIds?: string[]
}

/**
 * Endpoint Details, containing address and port for the endpoint.
 */
export interface EndpointDetails {
  /**
   * Information about the endpoint such as name and the endpoint address.
   */
  readonly endpoint: DataflowEndpoint

  /**
   * The role ARN, and IDs for security groups and subnets.
   */
  readonly securityDetails: SecurityDetails
}

/**
 * Dataflow Endpoint Group Properties
 */
export interface DataflowEndpointGroupProps {
  /**
   * List of Endpoint Details, containing address and port for each endpoint.
   */
  readonly endpointDetails: EndpointDetails[]
}

/**
 *  Dataflow endpoint groups contain a list of endpoints. When the name of a dataflow endpoint group is specified in a mission profile, the Ground Station service will connect to the endpoints and flow data during a contact.
 */
export abstract class DataflowEndpointGroup extends Resource {
  private readonly _resource: CfnDataflowEndpointGroup;

  /**
   * The ARN of the dataflow endpoint group.
   */
  public readonly arn: string

  /**
   * The logical ID of the dataflow endpoint group.
   */
  public readonly id: string

  constructor(scope: Construct, id: string, props: DataflowEndpointGroupProps) {
    super(scope, id);

    const resource = new CfnDataflowEndpointGroup(this, 'Resource', {
      endpointDetails: props.endpointDetails,
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
  }
}