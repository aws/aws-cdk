import { CfnDeploymentConfig } from './codedeploy.generated';

/**
 * Minimum number of healthy hosts for a server deployment.
 */
export class MinimumHealthyHosts {

  /**
   * The minimum healhty hosts threshold expressed as an absolute number.
   */
  public static count(value: number): MinimumHealthyHosts {
    return new MinimumHealthyHosts({
      type: 'HOST_COUNT',
      value,
    });
  }

  /**
   * The minmum healhty hosts threshold expressed as a percentage of the fleet.
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
