import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CfnSlackChannelConfiguration } from './chatbot.generated';

/**
 * @TODO test
 */
export enum LoggingLevel {
  ERROR = 'ERROR',
  INFO  = 'INFO',
  NONE  = 'NONE',
}

/**
 * @TODO test
 */
export interface ISlackChannelConfiguration extends cdk.IResource {

  /**
   * @TODO test
   */
  readonly configurationArn: string;

  /**
   * @TODO test
   */
  readonly configurationName: string;

  /**
   * @TODO test
   */
  readonly configurationRole?: iam.IRole;
}

/**
 * @TODO test
 */
export abstract class SlackChannelConfigurationBase extends cdk.Resource implements ISlackChannelConfiguration {
  /**
   * @TODO test
   */
  abstract readonly configurationArn: string;

  /**
   * @TODO test
   */
  abstract readonly configurationName: string;

  /**
   * @TODO test
   */
  abstract readonly configurationRole?: iam.IRole;

  public addToPrincipalPolicy(statement: iam.PolicyStatement): void {
    if (!this.configurationRole) {
      return;
    }

    this.configurationRole!.addToPrincipalPolicy(statement);
  }

  /**
   * Allows AWS Chatbot to retrieve metric graphs from Amazon CloudWatch.
   */
  public addNotificationPermissions(): void {
    this.configurationRole!.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudwatch:Describe*',
        'cloudwatch:Get*',
        'cloudwatch:List*',
      ],
      resources: ['*'],
    }));
  }

  /**
   * Allows read-only commands in supported clients.
   */
  public addReadOnlyCommandPermissions(): void {
    this.configurationRole!.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

    this.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      actions: [
        'iam:*',
        's3:GetBucketPolicy',
        'ssm:*',
        'sts:*',
        'kms:*',
        'cognito-idp:GetSigningCertificate',
        'ec2:GetPasswordData',
        'ecr:GetAuthorizationToken',
        'gamelift:RequestUploadCredentials',
        'gamelift:GetInstanceAccess',
        'lightsail:DownloadDefaultKeyPair',
        'lightsail:GetInstanceAccessDetails',
        'lightsail:GetKeyPair',
        'lightsail:GetKeyPairs',
        'redshift:GetClusterCredentials',
        'storagegateway:DescribeChapCredentials',
      ],
      resources: ['*'],
    }));
  }

  /**
   * Allows Lambda-invoke commands in supported clients.
   */
  public addLambdaInvokeCommandPermissions(lambdaFunctionArn?: string[]): void {
    this.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'lambda:invokeAsync',
        'lambda:invokeFunction',
      ],
      resources: lambdaFunctionArn || ['*'],
    }));
  }

  /**
   * Allows calling AWS Support APIs in supported clients.
   */
  public addSupportCommandPermissions(): void {
    this.configurationRole!.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSSupportAccess'));
  }
}

/**
 * @TODO test
 */
export interface SlackChannelConfigurationProps {

  /**
   * @TODO test
   */
  readonly configurationName: string;

  /**
   * @TODO test
   */
  readonly configurationRole?: iam.IRole;

  /**
   * @TODO test
   */
  readonly slackWorkspaceId: string;

  /**
   * @TODO test
   */
  readonly slackChannelId: string;

  /**
   * @TODO test
   */
  readonly notificationTopics?: sns.ITopic[];

  /**
   * @TODO test
   */
  readonly loggingLevel?: LoggingLevel;
}

/**
 * @TODO test
 */
export class SlackChannelConfiguration extends SlackChannelConfigurationBase {
  public static fromConfigurationArn(scope: cdk.Construct, id: string, configurationArn: string): ISlackChannelConfiguration {
    class Import extends SlackChannelConfigurationBase {
      readonly configurationArn = configurationArn;
      readonly configurationName = cdk.Stack.of(scope).parseArn(configurationArn).resource;
      readonly configurationRole?: iam.IRole = undefined;
    }

    return new Import(scope, id);
  }

  /**
   * @TODO test
   */
  readonly configurationArn: string;

  /**
   * @TODO test
   */
  readonly configurationName: string;

  /**
   * @TODO test
   */
  readonly configurationRole?: iam.IRole;

  constructor(scope: cdk.Construct, id: string, props: SlackChannelConfigurationProps) {
    super(scope, id);

    this.configurationRole = props.configurationRole || new iam.Role(this, 'ConfigurationRole', {
      assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com'),
    });

    const topicArns = !!props.notificationTopics
      ? props.notificationTopics.map((topic) => topic.topicArn)
      : undefined;

    const configuration =  new CfnSlackChannelConfiguration(this, 'Resource', {
      configurationName: props.configurationName,
      iamRoleArn: this.configurationRole.roleArn,
      slackWorkspaceId: props.slackWorkspaceId, //`T49239U4W`,
      slackChannelId: props.slackChannelId,     //`C5HUEP2CX`,
      snsTopicArns: topicArns,
      loggingLevel: props.loggingLevel || LoggingLevel.NONE,
    });

    this.configurationArn = configuration.ref;
    this.configurationName = props.configurationName;
  }
}

