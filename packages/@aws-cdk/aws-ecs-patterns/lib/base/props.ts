import ecs = require('@aws-cdk/aws-ecs');

/**
 * Base properties for service and task.
 */
export interface BaseProps {
  /**
   * The cluster where your service will be deployed
   */
  readonly cluster: ecs.ICluster;

  /**
   * The image to start.
   */
  readonly image: ecs.ContainerImage;

  /**
   * Secret environment variables to pass to the container
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: ecs.Secret };
}
