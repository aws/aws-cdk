import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDataflowEndpointGroup } from './groundstation.generated';

export interface SocketAddress {
  readonly name: string
  readonly port: number
}

export interface DataflowEndpoint {
  readonly address: SocketAddress
  readonly mtu: number
  readonly name: string
}

export interface SecurityDetails {
  readonly roleArn: string
  readonly securityGroupIds: string[]
  readonly subnetIds: string[]
}

export interface EndpointDetails {
  readonly endpoint: DataflowEndpoint
  readonly securityDetails: SecurityDetails
}

export interface DataflowEndpointGroupProps {
  readonly endpointDetails: EndpointDetails[]
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