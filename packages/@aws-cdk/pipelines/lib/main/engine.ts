import { Construct } from 'constructs';
import { Blueprint } from '../blueprint';

/**
 * A CDK Pipelines deployment engine
 *
 * Implement a CDK Deployment engine by implementing this interface.
 */
export interface IDeploymentEngine {
  /**
   * Called when the pipeline is configured and the deployment should to be created
   */
  buildDeployment(options: BuildDeploymentOptions): void;
}


/**
 * Options for the `IDeploymentEngine.buildDeployment()` calls.
 */
export interface BuildDeploymentOptions {
  /**
   * A scope where new constructs can be added
   */
  readonly scope: Construct;

  /**
   * The blueprint that contains the description of the deployment
   */
  readonly blueprint: Blueprint;
}