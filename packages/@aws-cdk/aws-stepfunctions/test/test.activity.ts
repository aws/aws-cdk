import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
    'instantiate Activity'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.Activity(stack, 'Activity');

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::Activity', {
            Name: 'Activity'
        }));

        test.done();
    },

    'Activity exposes metrics'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const activity = new stepfunctions.Activity(stack, 'Activity');

        // THEN
        const sharedMetric = {
            period: cdk.Duration.minutes(5),
            namespace: 'AWS/States',
            dimensions: { ActivityArn: { Ref: 'Activity04690B0A' }},
        };
        test.deepEqual(stack.resolve(activity.metricRunTime()), {
            ...sharedMetric,
            metricName: 'ActivityRunTime',
            statistic: 'Average'
        });

        test.deepEqual(stack.resolve(activity.metricFailed()), {
            ...sharedMetric,
            metricName: 'ActivitiesFailed',
            statistic: 'Sum'
        });

        test.done();
    }
};
