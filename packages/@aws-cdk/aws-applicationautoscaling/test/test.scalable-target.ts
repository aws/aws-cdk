import { expect, haveResource } from '@aws-cdk/assert';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as appscaling from '../lib';
import { createScalableTarget } from './util';

export = {
  'test scalable target creation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appscaling.ScalableTarget(stack, 'Target', {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      scalableDimension: 'test:TestCount',
      resourceId: 'test:this/test',
      minCapacity: 1,
      maxCapacity: 20,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ServiceNamespace: 'dynamodb',
      ScalableDimension: 'test:TestCount',
      ResourceId: 'test:this/test',
      MinCapacity: 1,
      MaxCapacity: 20,
    }));

    test.done();
  },

  'validation does not fail when using Tokens'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appscaling.ScalableTarget(stack, 'Target', {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      scalableDimension: 'test:TestCount',
      resourceId: 'test:this/test',
      minCapacity: cdk.Lazy.number({ produce: () => 10 }),
      maxCapacity: cdk.Lazy.number({ produce: () => 1 }),
    });

    // THEN: no exception
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ServiceNamespace: 'dynamodb',
      ScalableDimension: 'test:TestCount',
      ResourceId: 'test:this/test',
      MinCapacity: 10,
      MaxCapacity: 1,
    }));

    test.done();
  },

  'add scheduled scaling'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleOnSchedule('ScaleUp', {
      schedule: appscaling.Schedule.rate(cdk.Duration.minutes(1)),
      maxCapacity: 50,
      minCapacity: 1,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: {
            MaxCapacity: 50,
            MinCapacity: 1,
          },
          Schedule: 'rate(1 minute)',
          ScheduledActionName: 'ScaleUp',
        },
      ],
    }));

    test.done();
  },

  'step scaling on MathExpression'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleOnMetric('Metric', {
      metric: new cloudwatch.MathExpression({
        expression: 'a',
        usingMetrics: {
          a: new cloudwatch.Metric({
            namespace: 'Test',
            metricName: 'Metric',
          }),
        },
      }),
      adjustmentType: appscaling.AdjustmentType.CHANGE_IN_CAPACITY,
      scalingSteps: [
        { change: -1, lower: 0, upper: 49 },
        { change: 0, lower: 50, upper: 99 },
        { change: 1, lower: 100 },
      ],
    });

    // THEN
    expect(stack).notTo(haveResource('AWS::CloudWatch::Alarm', {
      Period: 60,
    }));

    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'LessThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      Metrics: [
        {
          Expression: 'a',
          Id: 'expr_1',
        },
        {
          Id: 'a',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
      ],
      Threshold: 49,
    }));

    test.done();
  },

  'test service namespace enum'(test: Test) {
    test.equals(appscaling.ServiceNamespace.APPSTREAM, 'appstream');
    test.equals(appscaling.ServiceNamespace.COMPREHEND, 'comprehend');
    test.equals(appscaling.ServiceNamespace.CUSTOM_RESOURCE, 'custom-resource');
    test.equals(appscaling.ServiceNamespace.DYNAMODB, 'dynamodb');
    test.equals(appscaling.ServiceNamespace.EC2, 'ec2');
    test.equals(appscaling.ServiceNamespace.ECS, 'ecs');
    test.equals(appscaling.ServiceNamespace.ELASTIC_MAP_REDUCE, 'elasticmapreduce');
    test.equals(appscaling.ServiceNamespace.LAMBDA, 'lambda');
    test.equals(appscaling.ServiceNamespace.RDS, 'rds');
    test.equals(appscaling.ServiceNamespace.SAGEMAKER, 'sagemaker');
    test.done();
  },
};
