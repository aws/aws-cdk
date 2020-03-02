import * as sqs from '@aws-cdk/aws-sqs';
import { DlqDestinationConfig, IEventSourceDlq } from "./dlq";

/**
 * An SQS dead letter queue destination configuration
 */
export class SqsDlq implements IEventSourceDlq {
    constructor(private readonly queue: sqs.IQueue) {
    }

    /**
     * Returns a destination configuration for the DLQ
     */
    public bind(): DlqDestinationConfig {
        return {
            destination: this.queue.queueArn
        };
    }
}
