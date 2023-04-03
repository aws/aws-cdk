import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
declare module "./function-base" {
    interface IFunction {
        /**
         * Return the given named metric for this Function
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How often this Lambda is throttled
         *
         * Sum over 5 minutes
         */
        metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How often this Lambda is invoked
         *
         * Sum over 5 minutes
         */
        metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How many invocations of this Lambda fail
         *
         * Sum over 5 minutes
         */
        metricErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How long execution of this Lambda takes
         *
         * Average over 5 minutes
         */
        metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
    interface FunctionBase {
        /**
         * Return the given named metric for this Function
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How often this Lambda is throttled
         *
         * Sum over 5 minutes
         */
        metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How often this Lambda is invoked
         *
         * Sum over 5 minutes
         */
        metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How many invocations of this Lambda fail
         *
         * Sum over 5 minutes
         */
        metricErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * How long execution of this Lambda takes
         *
         * Average over 5 minutes
         */
        metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
}
