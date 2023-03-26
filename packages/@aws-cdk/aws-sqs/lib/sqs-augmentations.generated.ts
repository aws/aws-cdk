// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { QueueBase } from "./queue-base";
declare module "./queue-base" {
    interface IQueue {
        /**
         * Return the given named metric for this Queue
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The approximate age of the oldest non-deleted message in the queue.
         *
         * Maximum over 5 minutes
         */
        metricApproximateAgeOfOldestMessage(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages in the queue that are delayed and not available for reading immediately.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesDelayed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that are in flight.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesNotVisible(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages available for retrieval from the queue.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesVisible(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of ReceiveMessage API calls that did not return a message.
         *
         * Sum over 5 minutes
         */
        metricNumberOfEmptyReceives(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages deleted from the queue.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesDeleted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages returned by calls to the ReceiveMessage action.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesReceived(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages added to a queue.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesSent(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The size of messages added to a queue.
         *
         * Average over 5 minutes
         */
        metricSentMessageSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
    interface QueueBase {
        /**
         * Return the given named metric for this Queue
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The approximate age of the oldest non-deleted message in the queue.
         *
         * Maximum over 5 minutes
         */
        metricApproximateAgeOfOldestMessage(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages in the queue that are delayed and not available for reading immediately.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesDelayed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages that are in flight.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesNotVisible(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages available for retrieval from the queue.
         *
         * Maximum over 5 minutes
         */
        metricApproximateNumberOfMessagesVisible(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of ReceiveMessage API calls that did not return a message.
         *
         * Sum over 5 minutes
         */
        metricNumberOfEmptyReceives(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages deleted from the queue.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesDeleted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages returned by calls to the ReceiveMessage action.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesReceived(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The number of messages added to a queue.
         *
         * Sum over 5 minutes
         */
        metricNumberOfMessagesSent(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The size of messages added to a queue.
         *
         * Average over 5 minutes
         */
        metricSentMessageSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
}
QueueBase.prototype.metric = function(metricName: string, props?: cloudwatch.MetricOptions) {
  return new cloudwatch.Metric({
    namespace: 'AWS/SQS',
    metricName,
    dimensionsMap: { QueueName: this.queueName },
    ...props
  }).attachTo(this);
};
QueueBase.prototype.metricApproximateAgeOfOldestMessage = function(props?: cloudwatch.MetricOptions) {
  return this.metric('ApproximateAgeOfOldestMessage', { statistic: 'Maximum', ...props });
};
QueueBase.prototype.metricApproximateNumberOfMessagesDelayed = function(props?: cloudwatch.MetricOptions) {
  return this.metric('ApproximateNumberOfMessagesDelayed', { statistic: 'Maximum', ...props });
};
QueueBase.prototype.metricApproximateNumberOfMessagesNotVisible = function(props?: cloudwatch.MetricOptions) {
  return this.metric('ApproximateNumberOfMessagesNotVisible', { statistic: 'Maximum', ...props });
};
QueueBase.prototype.metricApproximateNumberOfMessagesVisible = function(props?: cloudwatch.MetricOptions) {
  return this.metric('ApproximateNumberOfMessagesVisible', { statistic: 'Maximum', ...props });
};
QueueBase.prototype.metricNumberOfEmptyReceives = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfEmptyReceives', { statistic: 'Sum', ...props });
};
QueueBase.prototype.metricNumberOfMessagesDeleted = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfMessagesDeleted', { statistic: 'Sum', ...props });
};
QueueBase.prototype.metricNumberOfMessagesReceived = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfMessagesReceived', { statistic: 'Sum', ...props });
};
QueueBase.prototype.metricNumberOfMessagesSent = function(props?: cloudwatch.MetricOptions) {
  return this.metric('NumberOfMessagesSent', { statistic: 'Sum', ...props });
};
QueueBase.prototype.metricSentMessageSize = function(props?: cloudwatch.MetricOptions) {
  return this.metric('SentMessageSize', { statistic: 'Average', ...props });
};
