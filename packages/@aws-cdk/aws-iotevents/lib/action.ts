import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * Options when binding a Action to a detector model.
 */
export interface ActionBindOptions {
  /**
   * The IAM role assumed by IoT Events to perform the action.
   */
  readonly role: iam.IRole;
}

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
  /**
   * Returns the AWS IoT Events action specification.
   * @internal
   */
  public _bind(scope: Construct, options: ActionBindOptions): ActionConfig;
}

/**
 * Properties for a AWS IoT Events action
 */
export interface ActionConfig {
  /**
   * The configuration for this action.
   */
  readonly configuration: CfnDetectorModel.ActionProperty;
}
