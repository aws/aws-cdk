import { Construct } from '@aws-cdk/core';
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
 * A Lambda destination
 */
export interface IDestination {
  /**
   * Binds this destination to the Lambda function
   */
  bind(scope: Construct, fn: IFunction, type?: DestinationType): DestinationConfig;
}
