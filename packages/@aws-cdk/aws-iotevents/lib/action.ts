import { IDetectorModel } from './detector-model';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * An abstract action for DetectorModel.
 */
export interface IAction {
  /**
   * Returns the detector model action specification.
   *
   * @param detectorModel The DetectorModel that would trigger this action.
   */
  bind(detectorModel: IDetectorModel): ActionConfig;
}

/**
 * Properties for a detector model action
 */
export interface ActionConfig {
  /**
   * The configuration for this action.
   */
  readonly configuration: CfnDetectorModel.ActionProperty;
}
