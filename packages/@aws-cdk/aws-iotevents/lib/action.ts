import { CfnDetectorModel } from './iotevents.generated';

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
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
