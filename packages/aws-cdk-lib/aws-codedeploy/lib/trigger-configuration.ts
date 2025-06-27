/**
 * Type of Code Deploy events for which you can trigger notifications
 */
export enum TriggerEvent {
  DEPLOYMENT_START = 'DeploymentStart',
  DEPLOYMENT_SUCCESS = 'DeploymentSuccess',
  DEPLOYMENT_FAILURE = 'DeploymentFailure',
  DEPLOYMENT_STOP = 'DeploymentStop',
  /**
   * Applies only to replacement instances in a blue/green deployment
   */
  DEPLOYMENT_READY = 'DeploymentReady',
  DEPLOYMENT_ROLLBACK = 'DeploymentRollback',
  INSTANCE_START = 'InstanceStart',
  INSTANCE_SUCCESS = 'InstanceSuccess',
  INSTANCE_FAILURE = 'InstanceFailure',
  /**
   * Applies only to replacement instances in a blue/green deployment
   */
  INSTANCE_READY = 'InstanceReady',
}

/**
 * Event trigger configuration that can be attached to a Deployment Group
 */
export interface TriggerConfiguration {
  /**
   * The event type or types that trigger notifications.
   */
  readonly events: TriggerEvent[];

  /**
   * The name you want to give the trigger so you can easily identify it.
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service topic
   * through which notifications about deployment or instance events are sent.
   */
  readonly targetArn: string;
}
