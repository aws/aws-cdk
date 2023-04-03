import { Construct } from 'constructs';
import { IFunction } from './function-base';
/**
 * A destination configuration
 */
export interface DestinationConfig {
    /**
     * The Amazon Resource Name (ARN) of the destination resource
     */
    readonly destination: string;
}
/**
 * The type of destination
 */
export declare enum DestinationType {
    /**
     * Failure
     */
    FAILURE = "Failure",
    /**
     * Success
     */
    SUCCESS = "Success"
}
/**
 * Options when binding a destination to a function
 */
export interface DestinationOptions {
    /**
     * The destination type
     */
    readonly type: DestinationType;
}
/**
 * A Lambda destination
 */
export interface IDestination {
    /**
     * Binds this destination to the Lambda function
     */
    bind(scope: Construct, fn: IFunction, options?: DestinationOptions): DestinationConfig;
}
