import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAccelerator } from './accelerator';
import * as ga from './globalaccelerator.generated';

/**
 * Interface of the Listener
 */
export interface IListener extends cdk.IResource {
  /**
   * The ARN of the listener
   *
   * @attribute
   */
  readonly listenerArn: string;
}

/**
 * construct properties for Listener
 */
export interface ListenerProps {
  /**
   * Name of the listener
   *
   * @default - logical ID of the resource
   */
  readonly listenerName?: string;

  /**
   * The accelerator for this listener
   */
  readonly accelerator: IAccelerator;

  /**
   * The list of port ranges for the connections from clients to the accelerator
   */
  readonly portRanges: PortRange[];

  /**
   * The protocol for the connections from clients to the accelerator
   *
   * @default TCP
   */
  readonly protocol?: ConnectionProtocol;

  /**
   * Client affinity to direct all requests from a user to the same endpoint
   *
   * @default NONE
   */
  readonly clientAffinity?: ClientAffinity;
}

/**
 * The list of port ranges for the connections from clients to the accelerator.
 */
export interface PortRange {
  /**
   * The first port in the range of ports, inclusive.
   */
  readonly fromPort: number,
  /**
   * The last port in the range of ports, inclusive.
   */
  readonly toPort: number,
}

/**
 * The protocol for the connections from clients to the accelerator.
 */
export enum ConnectionProtocol {
  /**
   * TCP
   */
  TCP = 'TCP',
  /**
   * UDP
   */
  UDP = 'UDP',
}

/**
 * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications,
 * regardless of the port and protocol of the client request. Client affinity gives you control over whether to always
 * route each client to the same specific endpoint. If you want a given client to always be routed to the same
 * endpoint, set client affinity to SOURCE_IP.
 *
 * @see https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html#about-listeners-client-affinity
 */
export enum ClientAffinity {
  /**
   * default affinity
   */
  NONE = 'NONE',
  /**
   * affinity by source IP
   */
  SOURCE_IP = 'SOURCE_IP',
}

/**
 * The construct for the Listener
 */
export class Listener extends cdk.Resource implements IListener {
  /**
   * import from ARN
   */
  public static fromListenerArn(scope: Construct, id: string, listenerArn: string): IListener {
    class Import extends cdk.Resource implements IListener {
      public readonly listenerArn = listenerArn;
    }
    return new Import(scope, id);
  }

  public readonly listenerArn: string;
  /**
   * The name of the listener
   *
   * @attribute
   */
  public readonly listenerName: string;

  constructor(scope: Construct, id: string, props: ListenerProps) {
    super(scope, id);

    const resource = new ga.CfnListener(this, 'Resource', {
      acceleratorArn: props.accelerator.acceleratorArn,
      portRanges: props.portRanges.map(m => ({
        fromPort: m.fromPort,
        toPort: m.toPort,
      })),
      protocol: props.protocol ?? ConnectionProtocol.TCP,
      clientAffinity: props.clientAffinity ?? ClientAffinity.NONE,
    });

    this.listenerArn = resource.attrListenerArn;
    this.listenerName = props.listenerName ?? resource.logicalId;

  }
}
