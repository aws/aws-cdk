// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { FunctionBase } from "./function-base";
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
FunctionBase.prototype.metric = function(metricName: string, props?: cloudwatch.MetricOptions) {
  return new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName,
    dimensionsMap: { FunctionName: this.functionName },
    ...props
  }).attachTo(this);
};
FunctionBase.prototype.metricThrottles = function(props?: cloudwatch.MetricOptions) {
  return this.metric('Throttles', { statistic: 'Sum', ...props });
};
FunctionBase.prototype.metricInvocations = function(props?: cloudwatch.MetricOptions) {
  return this.metric('Invocations', { statistic: 'Sum', ...props });
};
FunctionBase.prototype.metricErrors = function(props?: cloudwatch.MetricOptions) {
  return this.metric('Errors', { statistic: 'Sum', ...props });
};
FunctionBase.prototype.metricDuration = function(props?: cloudwatch.MetricOptions) {
  return this.metric('Duration', { statistic: 'Average', ...props });
};
