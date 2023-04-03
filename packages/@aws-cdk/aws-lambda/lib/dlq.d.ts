import { IEventSourceMapping } from './event-source-mapping';
import { IFunction } from './function-base';
/**
 * A destination configuration
 */
export interface DlqDestinationConfig {
    /**
     * The Amazon Resource Name (ARN) of the destination resource
     */
    readonly destination: string;
}
/**
 * A DLQ for an event source
 */
export interface IEventSourceDlq {
    /**
     * Returns the DLQ destination config of the DLQ
     */
    bind(target: IEventSourceMapping, targetHandler: IFunction): DlqDestinationConfig;
}
