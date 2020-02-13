import * as sns from '@aws-cdk/aws-sns';
import { DLQDestinationConfig, IEventSourceDLQ } from "./dlq";

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