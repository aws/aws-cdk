import { DlqDestinationConfig, IEventSourceDlq } from "@aws-cdk/aws-lambda";
import * as sqs from '@aws-cdk/aws-sqs';

/**
 * An SQS dead letter queue destination configuration for a Lambda event source
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
