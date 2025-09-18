import { IPipe, ITarget } from '@aws-cdk/aws-pipes-alpha';
import { Resource } from 'aws-cdk-lib';
import { Metric, MetricOptions } from 'aws-cdk-lib/aws-cloudwatch';
import { NotificationRuleTargetConfig } from 'aws-cdk-lib/aws-codestarnotifications';
import { AddToResourcePolicyResult, Grant, IGrantable, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { ITopic, ITopicSubscription, Subscription } from 'aws-cdk-lib/aws-sns';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class TestTarget implements ITarget {
  readonly targetArn: string = 'target-arn';
  private targetParameters: CfnPipe.PipeTargetParametersProperty = {};
  public grantPush = jest.fn();

  constructor(parameters?: CfnPipe.PipeTargetParametersProperty) {
    if (parameters) {
      this.targetParameters = parameters;
    }
  }
  public bind = (_pipe: IPipe)=>({
    targetParameters: this.targetParameters,
  });
}

export class TestQueue extends Resource implements IQueue {
  public readonly queueArn: string = 'queue-arn';
  public readonly queueUrl: string = 'https://sqs.fake-region.amazonaws.com/123456789012/fake-queue';
  public readonly queueName: string = 'fake-queue';
  public readonly fifo: boolean = false;

  // Jest mocks for interface methods
  grantConsumeMessages = jest.fn<Grant, [IGrantable]>();
  grant = jest.fn<Grant, [IGrantable, ...string[]]>();
  grantPurge = jest.fn<Grant, [IGrantable]>();
  grantSendMessages = jest.fn<Grant, [IGrantable]>();

  addToResourcePolicy = jest.fn<AddToResourcePolicyResult, [PolicyStatement]>();

  metric = jest.fn<Metric, [string, MetricOptions?]>();
  metricApproximateAgeOfOldestMessage = jest.fn<Metric, [MetricOptions?]>();
  metricApproximateNumberOfMessagesDelayed = jest.fn<Metric, [MetricOptions?]>();
  metricApproximateNumberOfMessagesNotVisible = jest.fn<Metric, [MetricOptions?]>();
  metricApproximateNumberOfMessagesVisible = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfMessagesDeleted = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfEmptyReceives = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfMessagesReceived = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfMessagesSent = jest.fn<Metric, [MetricOptions?]>();
  metricSentMessageSize = jest.fn<Metric, [MetricOptions?]>();

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

export class TestTopic extends Resource implements ITopic {
  public readonly topicArn = 'test-topic-arn';
  public readonly topicName = 'mock-topic';
  public readonly fifo = false;
  public readonly contentBasedDeduplication = false;

  // Jest mock methods to simulate SNS topic behavior
  grantPublish = jest.fn<Grant, [IGrantable]>();
  grantSubscribe = jest.fn<Grant, [IGrantable]>();
  addToResourcePolicy = jest.fn<AddToResourcePolicyResult, [PolicyStatement]>();
  addSubscription = jest.fn<Subscription, [ITopicSubscription]>();
  bindAsNotificationRuleTarget = jest.fn<NotificationRuleTargetConfig, []>();

  metric = jest.fn<Metric, [string, MetricOptions?]>();
  metricPublishSize = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfMessagesPublished = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfNotificationsDelivered = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfNotificationsFailed = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfNotificationsFilteredOut = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfNotificationsFilteredOutInvalidAttributes = jest.fn<Metric, [MetricOptions?]>();
  metricNumberOfNotificationsFilteredOutNoMessageAttributes = jest.fn<Metric, [MetricOptions?]>();
  metricSMSMonthToDateSpentUSD = jest.fn<Metric, [MetricOptions?]>();
  metricSMSSuccessRate = jest.fn<Metric, [MetricOptions?]>();

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}
