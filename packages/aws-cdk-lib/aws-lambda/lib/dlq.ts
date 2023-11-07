import { IEventSourceOnFailureDestination, OnFailureDestinationConfig } from './on-failure-destination';

/**
 * A destination configuration
 */
export interface DlqDestinationConfig extends OnFailureDestinationConfig {
  /**
   * The Amazon Resource Name (ARN) of the destination resource
   */
}

/**
 * A DLQ for an event source
 */
export interface IEventSourceDlq extends IEventSourceOnFailureDestination {
  /**
   * Returns the DLQ destination config of the DLQ
   */
}
