import * as iam from '@aws-cdk/aws-iam';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
  /**
   * The policies to perform the AWS IoT Events action.
   */
  readonly actionPolicies?: iam.PolicyStatement[];

  /**
   * Returns the AWS IoT Events action specification.
   */
  renderActionConfig(): ActionConfig;
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
