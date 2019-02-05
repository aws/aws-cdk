/**
 * The configuration for automatically rolling back deployments in a given Deployment Group.
 */
export interface AutoRollbackConfig {
  /**
   * Whether to automatically roll back a deployment that fails.
   *
   * @default true
   */
  failedDeployment?: boolean;

  /**
   * Whether to automatically roll back a deployment that was manually stopped.
   *
   * @default false
   */
  stoppedDeployment?: boolean;

  /**
   * Whether to automatically roll back a deployment during which one of the configured
   * CloudWatch alarms for this Deployment Group went off.
   *
   * @default true if you've provided any Alarms with the `alarms` property, false otherwise
   */
  deploymentInAlarm?: boolean;
}
