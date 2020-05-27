import * as cdk from '@aws-cdk/core';
import * as ga from './globalaccelerator.generated';
import { IListener } from './listener';

export interface IEndpointGroup {
  /**
   * @attribute
   */
  readonly EndpointGroupArn: string;
}

export interface EndpointGroupProps {
  readonly listener: IListener;
  readonly region?: string;
  readonly clientIpReservation?: boolean;
  readonly endpointId: string;
  readonly weight?: number;
}

export class EndpointGroup extends cdk.Resource implements IEndpointGroup {

  public readonly EndpointGroupArn: string;

  constructor(scope: cdk.Construct, id: string, props: EndpointGroupProps) {
    super(scope, id);

    const resource = new ga.CfnEndpointGroup(this, 'Resource', {
      listenerArn: props.listener.ListenerArn,
      endpointGroupRegion: props.region ?? cdk.Stack.of(this).region,
      endpointConfigurations: [
        {
          clientIpPreservationEnabled: props.clientIpReservation ?? true,
          endpointId: props.endpointId,
          weight: props.weight,
        }
      ]
    });

    this.EndpointGroupArn = resource.attrEndpointGroupArn;

  }
}
