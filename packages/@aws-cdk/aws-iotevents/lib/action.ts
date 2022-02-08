import { IDetectorModel } from './detector-model';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
  /**
   * Returns the AWS IoT Events action specification.
   *
   * @param detectorModel The DetectorModel that has the state this action is set in.
   */
  bind(detectorModel: IDetectorModel): ActionConfig;
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
