import { CfnDeploymentConfig } from './codedeploy.generated';
import { UnscopedValidationError } from '../../core';

/**
 * Minimum number of healthy hosts for a server deployment.
 */
export class MinimumHealthyHosts {
  /**
   * The minimum healthy hosts threshold expressed as an absolute number.
   */
  public static count(value: number): MinimumHealthyHosts {
    return new MinimumHealthyHosts({
      type: 'HOST_COUNT',
      value,
    });
  }

  /**
   * The minimum healthy hosts threshold expressed as a percentage of the fleet.
   */
  public static percentage(value: number): MinimumHealthyHosts {
    return new MinimumHealthyHosts({
      type: 'FLEET_PERCENT',
      value,
    });
  }

  private constructor(private readonly json: CfnDeploymentConfig.MinimumHealthyHostsProperty) { }

  /**
   * @internal
   */
  public get _json() {
    return this.json;
  }
}

/**
 * Minimum number of healthy hosts per availability zone for a server deployment.
 */
export class MinimumHealthyHostsPerZone {
  /**
   * The minimum healthy hosts threshold expressed as an absolute number.
   */
  public static count(value: number): MinimumHealthyHostsPerZone {
    return new MinimumHealthyHostsPerZone({
      type: 'HOST_COUNT',
      value,
    });
  }

  /**
   * The minimum healthy hosts threshold expressed as a percentage of the fleet.
   */
  public static percentage(value: number): MinimumHealthyHostsPerZone {
    return new MinimumHealthyHostsPerZone({
      type: 'FLEET_PERCENT',
      value,
    });
  }

  private constructor(private readonly json: CfnDeploymentConfig.MinimumHealthyHostsProperty) {
    if (!Number.isInteger(json.value)) {
      throw new UnscopedValidationError(`The percentage or count value of minimumHealthyHostsPerZone must be an integer, got: ${json.value}`);
    }
  }

  /**
   * @internal
   */
  public get _json() {
    return this.json;
  }
}
