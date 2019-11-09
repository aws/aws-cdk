import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

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
            dimensions: { ActivityArn: { Ref: 'Activity04690B0A' }}
        };
        test.deepEqual(stack.resolve(activity.metricRunTime({id: 'm1'})), {
            ...sharedMetric,
            metricName: 'ActivityRunTime',
            statistic: 'Average',
            id: 'm1'
        });

        test.deepEqual(stack.resolve(activity.metricFailed({id: 'm2'})), {
            ...sharedMetric,
            metricName: 'ActivitiesFailed',
            statistic: 'Sum',
            id: 'm2'
        });

        test.done();
    }
};
