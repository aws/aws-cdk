import * as cdk from '@aws-cdk/core';
import { IAccelerator } from './accelerator';
import * as ga from './globalaccelerator.generated';

export interface IListener {
  /**
   * @attribute
   */
  readonly ListenerArn: string;
}

export interface ListenerProps {
  readonly accelerator: IAccelerator;
  readonly portRanges: PortRange[];
  readonly protocol?: AcceleratorProtocol;
  readonly clientAffinity?: ClientAffinity;
}

export interface PortRange {
  fromPort: number,
  toPort: number,
}

enum AcceleratorProtocol {
  TCP = 'TCP',
  UDP = 'UDP',
}

enum ClientAffinity {
  NONE = 'NONE',
  SOURCE_IP = 'SOURCE_IP',
}

export class Listener extends cdk.Resource implements IListener {

  public readonly ListenerArn: string;

  constructor(scope: cdk.Construct, id: string, props: ListenerProps) {
    super(scope, id);

    const resource = new ga.CfnListener(this, 'Resource', {
      acceleratorArn: props.accelerator.acceleratorArn,
      portRanges: props.portRanges.map(m => ({
        fromPort: m.fromPort,
        toPort: m.toPort
      })),
      protocol: props.protocol ?? AcceleratorProtocol.TCP,
      clientAffinity: props.clientAffinity ?? ClientAffinity.NONE,
    });

    this.ListenerArn = resource.attrListenerArn;

  }
}
