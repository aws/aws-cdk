import * as sqs from '@aws-cdk/aws-sqs';
import { DLQDestinationConfig, IEventSourceDLQ } from "./dlq";

/**
 * An SQS destination configuration
 */
export class SqsDLQ implements IEventSourceDLQ {
    constructor(private readonly queue: sqs.IQueue) {
    }

    /**
     * Returns a destination configuration for the DLQ
     */
    public bind(): DLQDestinationConfig {
        return {
            destination: this.queue.queueArn
        };
    }
}
