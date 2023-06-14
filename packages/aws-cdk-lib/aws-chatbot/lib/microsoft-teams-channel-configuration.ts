import { Construct } from 'constructs';
import { CfnMicrosoftTeamsChannelConfiguration } from './chatbot.generated';
import { LoggingLevel } from './logging-level';
import * as cloudwatch from '../../aws-cloudwatch';
import * as notifications from '../../aws-codestarnotifications';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';

/**
 * Properties for a new Microsoft Teams channel configuration
 */
export interface MicrosoftTeamsChannelConfigurationProps {

  /**
   * The name of Microsoft Teams channel configuration
   */
  readonly microsoftTeamsChannelConfigurationName: string;

  /**
   * The permission role of Microsoft Teams channel configuration
   *
   * @default - A role will be created.
   */
  readonly role?: iam.IRole;

  /**
   * The ID of the Microsoft Team authorized with AWS Chatbot .
   *
   * To get the team ID, you must perform the initial authorization flow with Microsoft Teams in the AWS Chatbot console.
   * Then you can copy and paste the team ID from the console.
   * For more details, see steps 1-4 in Get started with Microsoft Teams in the AWS Chatbot Administrator Guide.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamid
   */
  readonly teamId: string;

  /**
   * The ID of the Microsoft Teams channel.
   *
   * To get the channel ID, open Microsoft Teams, right click on the channel name in the left pane, then choose Copy.
   * An example of the channel ID syntax is: `19%3ab6ef35dc342d56ba5654e6fc6d25a071%40thread.tacv2` .
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamschannelid
   */
  readonly teamsChannelId: string;

  /**
   * The ID of the Microsoft Teams tenant.
   *
   * To get the tenant ID, you must perform the initial authorization flow with Microsoft Teams in the AWS Chatbot console.
   * Then you can copy and paste the tenant ID from the console.
   * For more details, see steps 1-4 in Get started with Microsoft Teams in the AWS Chatbot Administrator Guide.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamstenantid
   */
  readonly teamsTenantId: string;

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

  /**
   * A list of IAM managed policies that are applied as channel guardrails.
   * @default - The AWS managed 'AdministratorAccess' policy is applied as a default if this is not set.
   */
  readonly guardrailPolicies?: iam.IManagedPolicy[];
}

/**
 * Represents a Microsoft Teams channel configuration
 */
export interface IMicrosoftTeamsChannelConfiguration extends cdk.IResource, iam.IGrantable, notifications.INotificationRuleTarget {

  /**
   * The ARN of the Microsoft Teams channel configuration
   * In the form of arn:aws:chatbot:{region}:{account}:chat-configuration/microsoft-teams-channel/{microsoftTeamsChannelName}
   * @attribute
   */
  readonly microsoftTeamsChannelConfigurationArn: string;

  /**
   * The name of Microsoft Teams channel configuration
   * @attribute
   */
  readonly microsoftTeamsChannelConfigurationName: string;

  /**
   * The permission role of Microsoft Teams channel configuration
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
   * Return the given named metric for this MicrosoftTeamsChannelConfiguration
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Either a new or imported Microsoft Teams channel configuration
 */
abstract class MicrosoftTeamsChannelConfigurationBase extends cdk.Resource implements IMicrosoftTeamsChannelConfiguration {
  abstract readonly microsoftTeamsChannelConfigurationArn: string;

  abstract readonly microsoftTeamsChannelConfigurationName: string;

  abstract readonly grantPrincipal: iam.IPrincipal;

  abstract readonly role?: iam.IRole;

  /**
   * Adds extra permission to iam-role of Microsoft Teams channel configuration
   * @param statement
   */
  public addToRolePolicy(statement: iam.PolicyStatement): void {
    if (!this.role) {
      return;
    }

    this.role.addToPrincipalPolicy(statement);
  }

  /**
   * Return the given named metric for this MicrosoftTeamsChannelConfiguration
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    // AWS Chatbot publishes metrics to us-east-1 regardless of stack region
    // https://docs.aws.amazon.com/chatbot/latest/adminguide/monitoring-cloudwatch.html
    return new cloudwatch.Metric({
      namespace: 'AWS/Chatbot',
      region: 'us-east-1',
      dimensionsMap: {
        ConfigurationName: this.microsoftTeamsChannelConfigurationName,
      },
      metricName,
      ...props,
    });
  }

  public bindAsNotificationRuleTarget(_scope: Construct): notifications.NotificationRuleTargetConfig {
    return {
      targetType: 'AWSChatbotMicrosoftTeams',
      targetAddress: this.microsoftTeamsChannelConfigurationArn,
    };
  }
}

/**
 * A new Microsoft Teams channel configuration
 */
export class MicrosoftTeamsChannelConfiguration extends MicrosoftTeamsChannelConfigurationBase {

  /**
   * Import an existing Microsoft Teams channel configuration provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param microsoftTeamsChannelConfigurationArn configuration ARN (i.e. arn:aws:chatbot::1234567890:chat-configuration/microsoft-teams-channel/my-channel)
   *
   * @returns a reference to the existing Microsoft Teams channel configuration
   */
  public static fromMicrosoftTeamsChannelConfigurationArn
  (scope: Construct, id: string, microsoftTeamsChannelConfigurationArn: string): IMicrosoftTeamsChannelConfiguration {
    const re = /^microsoft-teams-channel\//;
    const resourceName = cdk.Arn.extractResourceName(microsoftTeamsChannelConfigurationArn, 'chat-configuration');

    if (!cdk.Token.isUnresolved(microsoftTeamsChannelConfigurationArn) && !re.test(resourceName)) {
      throw new Error('The ARN of a Microsoft Teams integration must be in the form: arn:<partition>:chatbot:<region>:<account>:chat-configuration/microsoft-teams-channel/<microsoftTeamsChannelName>');
    }

    class Import extends MicrosoftTeamsChannelConfigurationBase {

      /**
       * @attribute
       */
      readonly microsoftTeamsChannelConfigurationArn = microsoftTeamsChannelConfigurationArn;
      readonly role?: iam.IRole = undefined;
      readonly grantPrincipal: iam.IPrincipal;

      /**
       * Returns a name of Microsoft Teams channel configuration
       *
       * NOTE:
       * For example: arn:aws:chatbot::1234567890:chat-configuration/microsoft-teams-channel/my-channel
       * The ArnComponents API will return `microsoft-teams-channel/my-channel`
       * It need to handle that to gets a correct name.`my-channel`
       */
      readonly microsoftTeamsChannelConfigurationName: string;

      constructor(s: Construct, i: string) {
        super(s, i);
        this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });

        // handle microsoftTeamsChannelConfigurationName as specified above
        if (cdk.Token.isUnresolved(microsoftTeamsChannelConfigurationArn)) {
          this.microsoftTeamsChannelConfigurationName = cdk.Fn.select(1, cdk.Fn.split('microsoft-teams-channel/', resourceName));
        } else {
          this.microsoftTeamsChannelConfigurationName = resourceName.substring('microsoft-teams-channel/'.length);
        }
      }
    }

    return new Import(scope, id);
  }

  /**
   * Return the given named metric for All MicrosoftTeamsChannelConfigurations
   */
  public static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    // AWS Chatbot publishes metrics to us-east-1 regardless of stack region
    // https://docs.aws.amazon.com/chatbot/latest/adminguide/monitoring-cloudwatch.html
    return new cloudwatch.Metric({
      namespace: 'AWS/Chatbot',
      region: 'us-east-1',
      metricName,
      ...props,
    });
  }

  readonly microsoftTeamsChannelConfigurationArn: string;

  readonly microsoftTeamsChannelConfigurationName: string;

  readonly role?: iam.IRole;

  readonly grantPrincipal: iam.IPrincipal;

  /**
   * The SNS topic that deliver notifications to AWS Chatbot.
   * @attribute
   */
  private readonly notificationTopics: sns.ITopic[];

  constructor(scope: Construct, id: string, props: MicrosoftTeamsChannelConfigurationProps) {
    super(scope, id, {
      physicalName: props.microsoftTeamsChannelConfigurationName,
    });

    this.role = props.role || new iam.Role(this, 'ConfigurationRole', {
      assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com'),
    });

    this.grantPrincipal = this.role;

    this.notificationTopics = props.notificationTopics ?? [];

    const configuration = new CfnMicrosoftTeamsChannelConfiguration(this, 'Resource', {
      configurationName: props.microsoftTeamsChannelConfigurationName,
      iamRoleArn: this.role.roleArn,
      teamId: props.teamId,
      teamsChannelId: props.teamsChannelId,
      teamsTenantId: props.teamsTenantId,
      snsTopicArns: cdk.Lazy.list({ produce: () => this.notificationTopics.map(topic => topic.topicArn) }, { omitEmpty: true } ),
      loggingLevel: props.loggingLevel?.toString(),
      guardrailPolicies: cdk.Lazy.list({ produce: () => props.guardrailPolicies?.map(policy => policy.managedPolicyArn) }, { omitEmpty: true } ),
    });

    // Log retention
    // AWS Chatbot publishes logs to us-east-1 regardless of stack region https://docs.aws.amazon.com/chatbot/latest/adminguide/cloudwatch-logs.html
    if (props.logRetention) {
      new logs.LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/chatbot/${props.microsoftTeamsChannelConfigurationName}`,
        retention: props.logRetention,
        role: props.logRetentionRole,
        logGroupRegion: 'us-east-1',
        logRetentionRetryOptions: props.logRetentionRetryOptions,
      });
    }

    this.microsoftTeamsChannelConfigurationArn = configuration.ref;
    this.microsoftTeamsChannelConfigurationName = props.microsoftTeamsChannelConfigurationName;
  }

  /**
   * Adds a SNS topic that deliver notifications to AWS Chatbot.
   * @param notificationTopic
   */
  public addNotificationTopic(notificationTopic: sns.ITopic): void {
    this.notificationTopics.push(notificationTopic);
  }
}

