import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Properties for a new Slack channel configuration
 */
export interface SlackChannelConfigurationProps {
    /**
     * The name of Slack channel configuration
     */
    readonly slackChannelConfigurationName: string;
    /**
     * The permission role of Slack channel configuration
     *
     * @default - A role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * The ID of the Slack workspace authorized with AWS Chatbot.
     *
     * To get the workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console.
     * Then you can copy and paste the workspace ID from the console.
     * For more details, see steps 1-4 in Setting Up AWS Chatbot with Slack in the AWS Chatbot User Guide.
     * @see https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro
     */
    readonly slackWorkspaceId: string;
    /**
     * The ID of the Slack channel.
     *
     * To get the ID, open Slack, right click on the channel name in the left pane, then choose Copy Link.
     * The channel ID is the 9-character string at the end of the URL. For example, ABCBBLZZZ.
     */
    readonly slackChannelId: string;
    /**
     * The SNS topics that deliver notifications to AWS Chatbot.
     *
     * @default None
     */
    readonly notificationTopics?: sns.ITopic[];
    /**
     * Specifies the logging level for this configuration.
     * This property affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * @default LoggingLevel.NONE
     */
    readonly loggingLevel?: LoggingLevel;
    /**
     * The number of days log events are kept in CloudWatch Logs. When updating
     * this property, unsetting it doesn't remove the log retention policy. To
     * remove the retention policy, set the value to `INFINITE`.
     *
     * @default logs.RetentionDays.INFINITE
     */
    readonly logRetention?: logs.RetentionDays;
    /**
     * The IAM role for the Lambda function associated with the custom resource
     * that sets the retention policy.
     *
     * @default - A new role is created.
     */
    readonly logRetentionRole?: iam.IRole;
    /**
     * When log retention is specified, a custom resource attempts to create the CloudWatch log group.
     * These options control the retry policy when interacting with CloudWatch APIs.
     *
     * @default - Default AWS SDK retry options.
     */
    readonly logRetentionRetryOptions?: logs.LogRetentionRetryOptions;
}
/**
 * Logging levels include ERROR, INFO, or NONE.
 */
export declare enum LoggingLevel {
    /**
     * ERROR
     */
    ERROR = "ERROR",
    /**
     * INFO
     */
    INFO = "INFO",
    /**
     * NONE
     */
    NONE = "NONE"
}
/**
 * Represents a Slack channel configuration
 */
export interface ISlackChannelConfiguration extends cdk.IResource, iam.IGrantable, notifications.INotificationRuleTarget {
    /**
     * The ARN of the Slack channel configuration
     * In the form of arn:aws:chatbot:{region}:{account}:chat-configuration/slack-channel/{slackChannelName}
     * @attribute
     */
    readonly slackChannelConfigurationArn: string;
    /**
     * The name of Slack channel configuration
     * @attribute
     */
    readonly slackChannelConfigurationName: string;
    /**
     * The permission role of Slack channel configuration
     * @attribute
     *
     * @default - A role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * Adds a statement to the IAM role.
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Return the given named metric for this SlackChannelConfiguration
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
/**
 * Either a new or imported Slack channel configuration
 */
declare abstract class SlackChannelConfigurationBase extends cdk.Resource implements ISlackChannelConfiguration {
    abstract readonly slackChannelConfigurationArn: string;
    abstract readonly slackChannelConfigurationName: string;
    abstract readonly grantPrincipal: iam.IPrincipal;
    abstract readonly role?: iam.IRole;
    /**
     * Adds extra permission to iam-role of Slack channel configuration
     * @param statement
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Return the given named metric for this SlackChannelConfiguration
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    bindAsNotificationRuleTarget(_scope: Construct): notifications.NotificationRuleTargetConfig;
}
/**
 * A new Slack channel configuration
 */
export declare class SlackChannelConfiguration extends SlackChannelConfigurationBase {
    /**
     * Import an existing Slack channel configuration provided an ARN
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param slackChannelConfigurationArn configuration ARN (i.e. arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack)
     *
     * @returns a reference to the existing Slack channel configuration
     */
    static fromSlackChannelConfigurationArn(scope: Construct, id: string, slackChannelConfigurationArn: string): ISlackChannelConfiguration;
    /**
     * Return the given named metric for All SlackChannelConfigurations
     */
    static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    readonly slackChannelConfigurationArn: string;
    readonly slackChannelConfigurationName: string;
    readonly role?: iam.IRole;
    readonly grantPrincipal: iam.IPrincipal;
    /**
     * The SNS topic that deliver notifications to AWS Chatbot.
     * @attribute
     */
    private readonly notificationTopics;
    constructor(scope: Construct, id: string, props: SlackChannelConfigurationProps);
    /**
     * Adds a SNS topic that deliver notifications to AWS Chatbot.
     * @param notificationTopic
     */
    addNotificationTopic(notificationTopic: sns.ITopic): void;
}
export {};
