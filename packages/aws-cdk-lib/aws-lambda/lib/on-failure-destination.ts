import { IEventSourceMapping } from './event-source-mapping';
import { IFunction } from './function-base';

/**
 * A destination configuration
 */
export interface OnFailureDestinationConfig {
  /**
   * The Amazon Resource Name (ARN) of the destination resource
   */
  readonly destination: string;
}

/**
 * An Onfailure Destination for an Event
 */
export interface IEventSourceOnFailureDestination {
  /**
   * Returns the parent class for onfailure destination
   */
  bind(target: IEventSourceMapping, targetHandler: IFunction): OnFailureDestinationConfig;
}
