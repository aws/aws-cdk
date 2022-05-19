import { IFunction } from './function-base';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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
export enum DestinationType {
  /**
   * Failure
   */
  FAILURE = 'Failure',

  /**
   * Success
   */
  SUCCESS = 'Success',
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
