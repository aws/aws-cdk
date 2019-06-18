import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import appscaling = require('../lib');
import { createScalableTarget } from './util';

export = {
  'test scalable target creation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appscaling.ScalableTarget(stack, 'Target', {
      serviceNamespace: appscaling.ServiceNamespace.DynamoDb,
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

  'add scheduled scaling'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleOnSchedule('ScaleUp', {
      schedule: appscaling.Schedule.rate(1, appscaling.TimeUnit.Minute),
      maxCapacity: 50,
      minCapacity: 1,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: {
            MaxCapacity: 50,
            MinCapacity: 1
          },
          Schedule: "rate(1 minute)",
          ScheduledActionName: "ScaleUp"
        }
      ]
    }));

    test.done();
  }
};