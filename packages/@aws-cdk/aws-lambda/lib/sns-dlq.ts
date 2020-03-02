import * as sns from '@aws-cdk/aws-sns';
import { DlqDestinationConfig, IEventSourceDlq } from "./dlq";

/**
 * An SNS dead letter queue destination configuration
 */
export class SnsDlq implements IEventSourceDlq {
    constructor(private readonly topic: sns.ITopic) {
    }

    /**
     * Returns a destination configuration for the DLQ
     */
    public bind(): DlqDestinationConfig {
        return {
            destination: this.topic.topicArn
        };
    }
}
