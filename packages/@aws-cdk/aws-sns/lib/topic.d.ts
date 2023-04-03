import { IKey } from '@aws-cdk/aws-kms';
import { Construct } from 'constructs';
import { ITopic, TopicBase } from './topic-base';
/**
 * Properties for a new SNS topic
 */
export interface TopicProps {
    /**
     * A developer-defined string that can be used to identify this SNS topic.
     *
     * @default None
     */
    readonly displayName?: string;
    /**
     * A name for the topic.
     *
     * If you don't specify a name, AWS CloudFormation generates a unique
     * physical ID and uses that ID for the topic name. For more information,
     * see Name Type.
     *
     * @default Generated name
     */
    readonly topicName?: string;
    /**
     * A KMS Key, either managed by this CDK app, or imported.
     *
     * @default None
     */
    readonly masterKey?: IKey;
    /**
     * Enables content-based deduplication for FIFO topics.
     *
     * @default None
     */
    readonly contentBasedDeduplication?: boolean;
    /**
     * Set to true to create a FIFO topic.
     *
     * @default None
     */
    readonly fifo?: boolean;
}
/**
 * A new SNS topic
 */
export declare class Topic extends TopicBase {
    /**
     * Import an existing SNS topic provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param topicArn topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic)
     */
    static fromTopicArn(scope: Construct, id: string, topicArn: string): ITopic;
    readonly topicArn: string;
    readonly topicName: string;
    readonly fifo: boolean;
    protected readonly autoCreatePolicy: boolean;
    constructor(scope: Construct, id: string, props?: TopicProps);
}
