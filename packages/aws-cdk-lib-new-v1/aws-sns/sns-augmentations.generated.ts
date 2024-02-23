// Copyright 2012-2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
/* eslint-disable prettier/prettier,max-len */
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { TopicBase } from "./topic-base";

declare module "./topic-base" {
  interface ITopic {
    /**
     * Return the given named metric for this Topic
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * Metric for the size of messages published through this topic
     *
     * Average over 5 minutes
     */
    metricPublishSize(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages published to your Amazon SNS topics.
     *
     * Sum over 5 minutes
     */
    metricNumberOfMessagesPublished(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsDelivered(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that Amazon SNS failed to deliver.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFailed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOut(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies because the messages have no attributes.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOutNoMessageAttributes(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOutInvalidAttributes(props?: cw.MetricOptions): cw.Metric;

    /**
     * The charges you have accrued since the start of the current calendar month for sending SMS messages.
     *
     * Maximum over 5 minutes
     */
    metricSMSMonthToDateSpentUSD(props?: cw.MetricOptions): cw.Metric;

    /**
     * The rate of successful SMS message deliveries.
     *
     * Sum over 5 minutes
     */
    metricSMSSuccessRate(props?: cw.MetricOptions): cw.Metric;
  }
}



declare module "./topic-base" {
  interface TopicBase {
    /**
     * Return the given named metric for this Topic
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * Metric for the size of messages published through this topic
     *
     * Average over 5 minutes
     */
    metricPublishSize(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages published to your Amazon SNS topics.
     *
     * Sum over 5 minutes
     */
    metricNumberOfMessagesPublished(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsDelivered(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that Amazon SNS failed to deliver.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFailed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOut(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies because the messages have no attributes.
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOutNoMessageAttributes(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid
     *
     * Sum over 5 minutes
     */
    metricNumberOfNotificationsFilteredOutInvalidAttributes(props?: cw.MetricOptions): cw.Metric;

    /**
     * The charges you have accrued since the start of the current calendar month for sending SMS messages.
     *
     * Maximum over 5 minutes
     */
    metricSMSMonthToDateSpentUSD(props?: cw.MetricOptions): cw.Metric;

    /**
     * The rate of successful SMS message deliveries.
     *
     * Sum over 5 minutes
     */
    metricSMSSuccessRate(props?: cw.MetricOptions): cw.Metric;
  }
}

TopicBase.prototype.metric = function(metricName: string, props?: cw.MetricOptions) {
  return new cw.Metric({
    "namespace": "AWS/SNS",
    "metricName": metricName,
    "dimensionsMap": {
      "TopicName": this.topicName
    },
    ...props
  }).attachTo(this);
};
TopicBase.prototype.metricPublishSize = function(props?: cw.MetricOptions) {
  return this.metric("PublishSize", {
    "statistic": "Average",
    ...props
  });
};
TopicBase.prototype.metricNumberOfMessagesPublished = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfMessagesPublished", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricNumberOfNotificationsDelivered = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfNotificationsDelivered", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricNumberOfNotificationsFailed = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfNotificationsFailed", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOut = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfNotificationsFilteredOut", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOutNoMessageAttributes = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfNotificationsFilteredOut-NoMessageAttributes", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricNumberOfNotificationsFilteredOutInvalidAttributes = function(props?: cw.MetricOptions) {
  return this.metric("NumberOfNotificationsFilteredOut-InvalidAttributes", {
    "statistic": "Sum",
    ...props
  });
};
TopicBase.prototype.metricSMSMonthToDateSpentUSD = function(props?: cw.MetricOptions) {
  return this.metric("SMSMonthToDateSpentUSD", {
    "statistic": "Maximum",
    ...props
  });
};
TopicBase.prototype.metricSMSSuccessRate = function(props?: cw.MetricOptions) {
  return this.metric("SMSSuccessRate", {
    "statistic": "Sum",
    ...props
  });
};