import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDataflowEndpointGroup } from './groundstation.generated';

export interface SocketAddress {
  name: string
  port: number
}

export interface DataflowEndpoint {
  address: SocketAddress
  mtu: number
  name: string
}

export interface SecurityDetails {
  roleArn: string
  securityGroupIds: string[]
  subnetIds: string[]
}

export interface EndpointDetails {
  endpoint: DataflowEndpoint
  securityDetails: SecurityDetails
}

export interface DataflowEndpointGroupProps {
  endpointDetails: EndpointDetails[]
}

export abstract class DataflowEndpointGroup extends Resource {
  private readonly _resource: CfnDataflowEndpointGroup;

  public readonly arn: string
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