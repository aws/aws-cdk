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
 * The mixin doesn't check that the task definition uses the `awsvpc` network mode or that
 * `portName` names a port mapping of the task definition, and it doesn't make the service depend
 * on the gateway association of its cluster. The `gatewayConnector` property of `FargateService`,
 * `Ec2Service` and `ExternalService` does all three.
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
      const owner = construct.node.scope;
      const scope = owner?.node.defaultChild === construct ? owner : construct;
      Annotations.of(scope).addWarningV2('@aws-cdk/aws-ecs:gatewayConnectorPublicAccess',
        'This service can receive traffic from internet-facing gateways associated with its cluster; set gatewayConnector accessTypes to [GatewayAccessType.PRIVATE] if it must not be reachable from the internet.');
    }
  }
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
