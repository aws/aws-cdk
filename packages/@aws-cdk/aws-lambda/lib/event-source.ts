import { FunctionRef } from './lambda-ref';

/**
 * An abstract class which represents an AWS Lambda event source.
 */
export interface IEventSource {
  bind(target: FunctionRef): void;
}

