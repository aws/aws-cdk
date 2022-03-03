import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * TODO:
 */
export interface ActionBindOptions {
  /**
   * TODO:
   */
  readonly role: iam.IRole;
}

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
  /**
   * Returns the AWS IoT Events action specification.
   */
  bind(scope: Construct, options: ActionBindOptions): ActionConfig;
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
