import type { IConstruct } from 'constructs';
import type { Duration } from '../../../core';
import { Annotations, Token, UnscopedValidationError } from '../../../core';
import { CfnPropsMixin } from '../../../core/lib/helpers-internal';
import { Mixin, PropertyMergeStrategy } from '../../../core/lib/mixins';
import { lit } from '../../../core/lib/private/literal-string';
import { CfnService } from '../ecs.generated';
import type { GatewayConnectorOptions } from '../gateway';
import { GatewayAccessType } from '../gateway';

/**
 * ECS-specific Mixin to connect a service to the Amazon ECS gateways associated with its cluster.
 *
 * Sets the `gatewayConnectors` property of the service to this one connector, replacing any
 * existing `gatewayConnectors`. The connector options are validated when the mixin is created.
 *
 * Applied to a bare `CfnService`, the mixin doesn't check that the task definition uses the
 * `awsvpc` network mode or that `portName` names a port mapping of the task definition, and it
 * doesn't make the service depend on the gateway associations of its cluster. Applied to a
 * `FargateService` or `Ec2Service`, or through their `gatewayConnector` property, it checks the
 * network mode and `portName` and, for a cluster created in this app, makes the service depend on
 * the cluster's gateway associations; for an imported cluster, add that dependency yourself.
 * `ExternalService` doesn't support gateway connectors, so applying the mixin to one throws.
 *
 * When `accessTypes` is omitted or includes `PUBLIC`, the mixin adds a warning: any
 * internet-facing gateway associated with the cluster can then send traffic to the service.
 */
export class ServiceGatewayConnector extends Mixin {
  private readonly connector: GatewayConnectorOptions;

  constructor(connector: GatewayConnectorOptions) {
    super();
    validateGatewayConnector(connector);
    this.connector = connector;
  }

  public supports(construct: IConstruct): construct is CfnService {
    return CfnService.isCfnService(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    // when the L1 is the default child of an L2 service, let the L2 check the connector against its
    // task definition and cluster, so `service.with(...)` and the `gatewayConnector` property agree
    const owner = construct.node.scope;
    const l2 = owner?.node.defaultChild === construct ? owner : undefined;
    if (isGatewayConnectorOwner(l2)) {
      l2._checkGatewayConnector(this.connector);
    }

    // a service has one connector here, so the whole list is replaced rather than merged
    new CfnPropsMixin(CfnService, {
      gatewayConnectors: [renderGatewayConnector(this.connector)],
    }, { strategy: PropertyMergeStrategy.override() }).applyTo(construct);

    // any internet-facing gateway associated with the cluster, including one imported or associated
    // outside this app, can serve a service that accepts PUBLIC gateways
    const accessTypes = this.connector.accessTypes;
    if (accessTypes === undefined
      || (!Token.isUnresolved(accessTypes) && accessTypes.includes(GatewayAccessType.PUBLIC))) {
      // warn on the L2 service when the L1 is its default child, so the warning can be acknowledged there
      const scope = l2 ?? construct;
      Annotations.of(scope).addWarningV2('@aws-cdk/aws-ecs:gatewayConnectorPublicAccess',
        'This service can receive traffic from internet-facing gateways associated with its cluster; set gatewayConnector accessTypes to [GatewayAccessType.PRIVATE] if it must not be reachable from the internet.');
    }
  }
}

/**
 * An L2 service that checks a gateway connector applied to its `CfnService`. `BaseService`
 * implements this; it isn't imported here because base-service.ts imports this module.
 */
interface IGatewayConnectorOwner extends IConstruct {
  _checkGatewayConnector(connector: GatewayConnectorOptions): void;
}

function isGatewayConnectorOwner(x: IConstruct | undefined): x is IGatewayConnectorOwner {
  return x !== undefined && typeof (x as Partial<IGatewayConnectorOwner>)._checkGatewayConnector === 'function';
}

function validateGatewayConnector(connector: GatewayConnectorOptions) {
  const accessTypes = connector.accessTypes;
  if (accessTypes !== undefined && !Token.isUnresolved(accessTypes)
    && (accessTypes.length === 0 || new Set(accessTypes).size !== accessTypes.length)) {
    throw new UnscopedValidationError(lit`GatewayAccessTypesValid`, `gatewayConnector accessTypes must be a non-empty list without duplicates, got ${JSON.stringify(accessTypes)}`);
  }

  const hc = connector.healthCheck;
  if (hc) {
    if (hc.port !== undefined && !Token.isUnresolved(hc.port)
      && (!Number.isInteger(hc.port) || hc.port < 1 || hc.port > 65535)) {
      throw new UnscopedValidationError(lit`GatewayHealthCheckPortValid`, `gatewayConnector health check port must be between 1 and 65535, got ${hc.port}`);
    }
    if (hc.path !== undefined && !Token.isUnresolved(hc.path) && !hc.path.startsWith('/')) {
      throw new UnscopedValidationError(lit`GatewayHealthCheckPathValid`, `gatewayConnector health check path must start with '/', got ${JSON.stringify(hc.path)}`);
    }
    const interval = gatewayConnectorSeconds('health check interval', hc.interval, 5, 300);
    const timeout = gatewayConnectorSeconds('health check timeout', hc.timeout, 2, 120);
    if (interval !== undefined && timeout !== undefined && timeout >= interval) {
      throw new UnscopedValidationError(lit`GatewayHealthCheckTimeoutValid`, `gatewayConnector health check timeout must be less than the interval, got timeout ${timeout} seconds and interval ${interval} seconds`);
    }
    for (const [name, count] of [['healthyThresholdCount', hc.healthyThresholdCount], ['unhealthyThresholdCount', hc.unhealthyThresholdCount]] as const) {
      if (count !== undefined && !Token.isUnresolved(count) && (!Number.isInteger(count) || count < 2 || count > 10)) {
        throw new UnscopedValidationError(lit`GatewayHealthCheckThresholdValid`, `gatewayConnector health check ${name} must be a whole number between 2 and 10, got ${count}`);
      }
    }
    if (hc.healthyHttpCodes !== undefined && hc.healthyGrpcCodes !== undefined) {
      throw new UnscopedValidationError(lit`GatewayHealthCheckMatcherValid`, 'gatewayConnector health check can have healthyHttpCodes or healthyGrpcCodes, not both');
    }
  }
  gatewayConnectorSeconds('deregistrationDelay', connector.deregistrationDelay, 0, 3600);
}

/**
 * Validate a gateway connector duration and return it in seconds, or undefined if it is a token or not set.
 */
function gatewayConnectorSeconds(name: string, duration: Duration | undefined, min: number, max: number): number | undefined {
  if (duration === undefined || duration.isUnresolved()) {
    return undefined;
  }
  const seconds = duration.toSeconds({ integral: false });
  if (!Number.isInteger(seconds) || seconds < min || seconds > max) {
    throw new UnscopedValidationError(lit`GatewayConnectorDurationValid`, `gatewayConnector ${name} must be a whole number of seconds between ${min} and ${max}, got ${seconds} seconds`);
  }
  return seconds;
}

function renderGatewayConnector(connector: GatewayConnectorOptions): CfnService.GatewayConnectorProperty {
  const hc = connector.healthCheck;
  return {
    portName: connector.portName,
    // validated as whole seconds; a token amount must be in seconds, or toSeconds() throws
    deregistrationDelay: connector.deregistrationDelay
      ? { timeoutSeconds: connector.deregistrationDelay.toSeconds() }
      : undefined,
    filters: connector.accessTypes ? { accessTypes: connector.accessTypes } : undefined,
    healthCheck: hc ? {
      healthCheckPath: hc.path,
      healthCheckPort: hc.port,
      healthCheckProtocol: hc.protocol,
      // validated as whole seconds; a token amount must be in seconds, or toSeconds() throws
      healthCheckIntervalSeconds: hc.interval?.toSeconds(),
      healthCheckTimeoutSeconds: hc.timeout?.toSeconds(),
      healthyThresholdCount: hc.healthyThresholdCount,
      unhealthyThresholdCount: hc.unhealthyThresholdCount,
      matcher: hc.healthyHttpCodes !== undefined || hc.healthyGrpcCodes !== undefined
        ? { httpCode: hc.healthyHttpCodes, grpcCode: hc.healthyGrpcCodes }
        : undefined,
    } : undefined,
  };
}
