// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { TopicBase } from "./topic-base";
declare module "./topic-base" {
    interface ITopic {
        /**
         * Return the given named metric for this Topic
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * Metric for the size of messages published through this topic
         *
         * Average over 5 minutes
         */
        metricPublishSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages published to your Amazon SNS topics.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesPublished(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsDelivered(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that Amazon SNS failed to deliver.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies because the messages have no attributes.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOutNoMessageAttributes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOutInvalidAttributes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The charges you have accrued since the start of the current calendar month for sending SMS messages.
         *
         * Maximum over 5 minutes
         */
        metricSMSMonthToDateSpentUSD(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The rate of successful SMS message deliveries.
         *
         * Sum over 5 minutes
         */
        metricSMSSuccessRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
    interface TopicBase {
        /**
         * Return the given named metric for this Topic
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * Metric for the size of messages published through this topic
         *
         * Average over 5 minutes
         */
        metricPublishSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages published to your Amazon SNS topics.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesPublished(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsDelivered(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that Amazon SNS failed to deliver.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies because the messages have no attributes.
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOutNoMessageAttributes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid
         *
         * Sum over 5 minutes
         */
        metricNumberOfNotificationsFilteredOutInvalidAttributes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The charges you have accrued since the start of the current calendar month for sending SMS messages.
         *
         * Maximum over 5 minutes
         */
        metricSMSMonthToDateSpentUSD(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The rate of successful SMS message deliveries.
         *
         * Sum over 5 minutes
         */
        metricSMSSuccessRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
}
TopicBase.prototype.metric = function(metricName: string, props?: cloudwatch.MetricOptions) {
  return new cloudwatch.Metric({
    namespace: 'AWS/SNS',
    metricName,
    dimensionsMap: { TopicName: this.topicName },
    ...props
  }).attachTo(this);
};
TopicBase.prototype.metricPublishSize = function(props?: cloudwatch.MetricOptions) {
  return this.metric('PublishSize', { statistic: 'Average', ...props });
};
TopicBase.prototype.metricNumberOfMessagesPublished = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfMessagesPublished', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricNumberOfNotificationsDelivered = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfNotificationsDelivered', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricNumberOfNotificationsFailed = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfNotificationsFailed', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOut = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfNotificationsFilteredOut', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOutNoMessageAttributes = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfNotificationsFilteredOut-NoMessageAttributes', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOutInvalidAttributes = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfNotificationsFilteredOut-InvalidAttributes', { statistic: 'Sum', ...props });
};
TopicBase.prototype.metricSMSMonthToDateSpentUSD = function(props?: cloudwatch.MetricOptions) {
  return this.metric('SMSMonthToDateSpentUSD', { statistic: 'Maximum', ...props });
};
TopicBase.prototype.metricSMSSuccessRate = function(props?: cloudwatch.MetricOptions) {
  return this.metric('SMSSuccessRate', { statistic: 'Sum', ...props });
};
