import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
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
