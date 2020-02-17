/**
 * A destination configuration
 */
export interface DLQDestinationConfig {
    /**
     * The Amazon Resource Name (ARN) of the destination resource
     */
    readonly destination: string;
  }

/**
 * A DLQ for an event source
 */
export interface IEventSourceDLQ {
    /**
     * Returns the DLQ destination config of the DLQ
     */
    bind(): DLQDestinationConfig;
}
