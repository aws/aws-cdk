import '@aws-cdk/assert-internal/jest';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import * as appscaling from '../lib';
import { createScalableTarget } from './util';

describe('scalable target', () => {
  test('test scalable target creation', () => {
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
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ServiceNamespace: 'dynamodb',
      ScalableDimension: 'test:TestCount',
      ResourceId: 'test:this/test',
      MinCapacity: 1,
      MaxCapacity: 20,
    });


  });

  test('validation does not fail when using Tokens', () => {
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
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ServiceNamespace: 'dynamodb',
      ScalableDimension: 'test:TestCount',
      ResourceId: 'test:this/test',
      MinCapacity: 10,
      MaxCapacity: 1,
    });


  });

  test('add scheduled scaling', () => {
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
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
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
    });


  });

  test('step scaling on MathExpression', () => {
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
    expect(stack).not.toHaveResource('AWS::CloudWatch::Alarm', {
      Period: 60,
    });

    expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
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
    });


  });

  test('test service namespace enum', () => {
    expect(appscaling.ServiceNamespace.APPSTREAM).toEqual( 'appstream');
    expect(appscaling.ServiceNamespace.COMPREHEND).toEqual( 'comprehend');
    expect(appscaling.ServiceNamespace.CUSTOM_RESOURCE).toEqual( 'custom-resource');
    expect(appscaling.ServiceNamespace.DYNAMODB).toEqual( 'dynamodb');
    expect(appscaling.ServiceNamespace.EC2).toEqual( 'ec2');
    expect(appscaling.ServiceNamespace.ECS).toEqual( 'ecs');
    expect(appscaling.ServiceNamespace.ELASTIC_MAP_REDUCE).toEqual( 'elasticmapreduce');
    expect(appscaling.ServiceNamespace.LAMBDA).toEqual( 'lambda');
    expect(appscaling.ServiceNamespace.RDS).toEqual( 'rds');
    expect(appscaling.ServiceNamespace.SAGEMAKER).toEqual( 'sagemaker');

  });
});
