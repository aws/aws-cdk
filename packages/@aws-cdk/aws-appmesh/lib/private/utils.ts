import * as cdk from '@aws-cdk/core';
import { CfnVirtualGateway, CfnVirtualNode } from '../appmesh.generated';

type AppMeshHealthCheck = CfnVirtualNode.HealthCheckProperty | CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty

/**
 * Validates health check properties, throws an error if they are misconfigured.
 *
 * @param healthCheck Healthcheck property from a Virtual Node or Virtual Gateway
 */
export function validateHealthChecks(healthCheck: AppMeshHealthCheck) {
  (Object.keys(healthCheck) as Array<keyof AppMeshHealthCheck>)
    .filter((key) =>
      HEALTH_CHECK_PROPERTY_THRESHOLDS[key] &&
          typeof healthCheck[key] === 'number' &&
          !cdk.Token.isUnresolved(healthCheck[key]),
    ).map((key) => {
      const [min, max] = HEALTH_CHECK_PROPERTY_THRESHOLDS[key]!;
      const value = healthCheck[key]!;

      if (value < min) {
        throw new Error(`The value of '${key}' is below the minimum threshold (expected >=${min}, got ${value})`);
      }
      if (value > max) {
        throw new Error(`The value of '${key}' is above the maximum threshold (expected <=${max}, got ${value})`);
      }
    });
}

/**
 * Minimum and maximum thresholds for HeathCheck numeric properties
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/APIReference/API_HealthCheckPolicy.html
 */
const HEALTH_CHECK_PROPERTY_THRESHOLDS: {[key in (keyof AppMeshHealthCheck)]?: [number, number]} = {
  healthyThreshold: [2, 10],
  intervalMillis: [5000, 300000],
  port: [1, 65535],
  timeoutMillis: [2000, 60000],
  unhealthyThreshold: [2, 10],
};