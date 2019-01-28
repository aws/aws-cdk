export enum ComputePlatform {
  Lambda = 'Lambda',
  Server = 'Server',
}

export enum DeploymentType {
  InPlace = 'IN_PLACE',
  BlueGreen = 'BLUE_GREEN'
}

export enum TrafficShiftConfig {
  AllAtOnce = 'AllAtOnce',
  Canary10Percent30Minutes = 'Canary10Percent30Minutes',
  Canary10Percent5Minutes = 'Canary10Percent5Minutes',
  Canary10Percent10Minutes = 'Canary10Percent10Minutes',
  Canary10Percent15Minutes = 'Canary10Percent15Minutes',
  Linear10PercentEvery10Minutes = 'Linear10PercentEvery10Minutes',
  Linear10PercentEvery1Minute = 'Linear10PercentEvery1Minute',
  Linear10PercentEvery2Minutes = 'Linear10PercentEvery2Minutes',
  Linear10PercentEvery3Minutes = 'Linear10PercentEvery3Minutes'
}

export enum DeploymentOption {
  WithTrafficControl = 'WITH_TRAFFIC_CONTROL',
  WithoutTrafficControl = 'WITHOUT_TRAFFIC_CONTROL',
}

export enum AutoRollbackEvent {
  DeploymentFailure = 'DEPLOYMENT_FAILURE',
  DeploymentStopOnAlarm = 'DEPLOYMENT_STOP_ON_ALARM',
  DeploymentStopOnRequest = 'DEPLOYMENT_STOP_ON_REQUEST'
}

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
