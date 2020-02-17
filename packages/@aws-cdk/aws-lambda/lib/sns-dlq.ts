import * as sns from '@aws-cdk/aws-sns';
import { DLQDestinationConfig, IEventSourceDLQ } from "./dlq";

/**
 * An SNS dead letter queue destination configuration
 */
export class SnsDLQ implements IEventSourceDLQ {
    constructor(private readonly topic: sns.ITopic) {
    }

    /**
     * Returns a destination configuration for the DLQ
     */
    public bind(): DLQDestinationConfig {
        return {
            destination: this.topic.topicArn
        };
    }
}
