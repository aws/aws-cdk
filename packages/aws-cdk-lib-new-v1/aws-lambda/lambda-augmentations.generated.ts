// Copyright 2012-2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
/* eslint-disable prettier/prettier,max-len */
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { FunctionBase } from "./function-base";

declare module "./function-base" {
  interface IFunction {
    /**
     * Return the given named metric for this Function
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * How often this Lambda is throttled
     *
     * Sum over 5 minutes
     */
    metricThrottles(props?: cw.MetricOptions): cw.Metric;

    /**
     * How often this Lambda is invoked
     *
     * Sum over 5 minutes
     */
    metricInvocations(props?: cw.MetricOptions): cw.Metric;

    /**
     * How many invocations of this Lambda fail
     *
     * Sum over 5 minutes
     */
    metricErrors(props?: cw.MetricOptions): cw.Metric;

    /**
     * How long execution of this Lambda takes
     *
     * Average over 5 minutes
     */
    metricDuration(props?: cw.MetricOptions): cw.Metric;
  }
}



declare module "./function-base" {
  interface FunctionBase {
    /**
     * Return the given named metric for this Function
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * How often this Lambda is throttled
     *
     * Sum over 5 minutes
     */
    metricThrottles(props?: cw.MetricOptions): cw.Metric;

    /**
     * How often this Lambda is invoked
     *
     * Sum over 5 minutes
     */
    metricInvocations(props?: cw.MetricOptions): cw.Metric;

    /**
     * How many invocations of this Lambda fail
     *
     * Sum over 5 minutes
     */
    metricErrors(props?: cw.MetricOptions): cw.Metric;

    /**
     * How long execution of this Lambda takes
     *
     * Average over 5 minutes
     */
    metricDuration(props?: cw.MetricOptions): cw.Metric;
  }
}

FunctionBase.prototype.metric = function(metricName: string, props?: cw.MetricOptions) {
  return new cw.Metric({
    "namespace": "AWS/Lambda",
    "metricName": metricName,
    "dimensionsMap": {
      "FunctionName": this.functionName
    },
    ...props
  }).attachTo(this);
};
FunctionBase.prototype.metricThrottles = function(props?: cw.MetricOptions) {
  return this.metric("Throttles", {
    "statistic": "Sum",
    ...props
  });
};
FunctionBase.prototype.metricInvocations = function(props?: cw.MetricOptions) {
  return this.metric("Invocations", {
    "statistic": "Sum",
    ...props
  });
};
FunctionBase.prototype.metricErrors = function(props?: cw.MetricOptions) {
  return this.metric("Errors", {
    "statistic": "Sum",
    ...props
  });
};
FunctionBase.prototype.metricDuration = function(props?: cw.MetricOptions) {
  return this.metric("Duration", {
    "statistic": "Average",
    ...props
  });
};