import type { Construct, IConstruct } from 'constructs';
import type { IClusterRef, IGatewayRef } from './ecs.generated';
import { CfnGatewayClusterAssociations } from './ecs.generated';
import { Resource, Stack, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Properties for associating an Amazon ECS gateway with a cluster.
 */
export interface GatewayClusterAssociationProps {
  /**
   * The cluster to associate the gateway with.
   *
   * The cluster, the gateway and the stack of the association must be in the same account and Region.
   */
  readonly cluster: IClusterRef;

  /**
   * The gateway to associate with the cluster.
   */
  readonly gateway: IGatewayRef;
}

/**
 * A cluster that keeps track of its gateway associations, so that services with a gateway
 * connector can depend on them.
 */
interface IGatewayAssociationTarget {
  _addGatewayAssociation(association: IConstruct, gateway: IGatewayRef): void;
}

function isGatewayAssociationTarget(x: IClusterRef): x is IClusterRef & IGatewayAssociationTarget {
  return typeof (x as any)._addGatewayAssociation === 'function';
}

/**
 * The association of an Amazon ECS gateway with a cluster.
 *
 * Services in the cluster with a `gatewayConnector` receive traffic through the gateways associated
 * with the cluster. A cluster can be associated with up to 5 gateways.
 *
 * Use this construct directly to associate a gateway with an imported cluster, or to choose the
 * construct ID of the association; `cluster.associateGateway()` creates one under the cluster.
 * For a cluster created in this app, services with a gateway connector depend on the association
 * automatically; for an imported cluster, add the dependency yourself.
 *
 * @resource AWS::ECS::GatewayClusterAssociations
 */
@propertyInjectable
export class GatewayClusterAssociation extends Resource {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ecs.GatewayClusterAssociation';

  constructor(scope: Construct, id: string, props: GatewayClusterAssociationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // the cluster, the gateway and the stack the association is deployed in must share an account
    // and Region; values are only compared when both are known at synthesis time
    const stack = Stack.of(this);
    const checks: Array<[string, string, string, string, string]> = [
      ['gateway', props.gateway.env.region, 'cluster', props.cluster.env.region, 'Region'],
      ['gateway', props.gateway.env.account, 'cluster', props.cluster.env.account, 'account'],
      ['cluster', props.cluster.env.region, 'stack', stack.region, 'Region'],
      ['cluster', props.cluster.env.account, 'stack', stack.account, 'account'],
      ['gateway', props.gateway.env.region, 'stack', stack.region, 'Region'],
      ['gateway', props.gateway.env.account, 'stack', stack.account, 'account'],
    ];
    for (const [aName, aValue, bName, bValue, what] of checks) {
      if (!Token.isUnresolved(aValue) && !Token.isUnresolved(bValue) && aValue !== bValue) {
        throw new ValidationError(lit`GatewayClusterEnvMismatch`, `a gateway, the cluster it is associated with and the stack of the association must be in the same account and Region, got ${aName} ${what} ${aValue} and ${bName} ${what} ${bValue}`, this);
      }
    }

    if (isGatewayAssociationTarget(props.cluster)) {
      props.cluster._addGatewayAssociation(this, props.gateway);
    }

    new CfnGatewayClusterAssociations(this, 'Resource', {
      cluster: props.cluster.clusterRef.clusterName,
      gateway: props.gateway.gatewayRef.gatewayArn,
    });
  }
}
