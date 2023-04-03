import { IFunction } from './function-base';
/**
 * An abstract class which represents an AWS Lambda event source.
 */
export interface IEventSource {
    /**
     * Called by `lambda.addEventSource` to allow the event source to bind to this
     * function.
     *
     * @param target That lambda function to bind to.
     */
    bind(target: IFunction): void;
}
