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
 * A Lambda destination
 */
export interface IDestination {
  /**
   * Binds this destination to the Lambda function
   */
  bind(fn: IFunction): DestinationConfig;
}
