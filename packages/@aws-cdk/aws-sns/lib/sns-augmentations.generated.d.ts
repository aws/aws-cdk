import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
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
