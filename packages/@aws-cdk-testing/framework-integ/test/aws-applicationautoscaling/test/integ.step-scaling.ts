import * as appscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-applicationautoscaling-step-scaling');

const target = new appscaling.ScalableTarget(stack, 'Target', {
  serviceNamespace: appscaling.ServiceNamespace.CUSTOM_RESOURCE,
  scalableDimension: 'custom-resource:ResourceType:Property',
  resourceId: 'https://custom-resource',
  minCapacity: 1,
  maxCapacity: 10,
});

const metric = new cloudwatch.Metric({
  namespace: 'Test',
  metricName: 'Metric',
});

target.scaleOnMetric('StepScaling', {
  metric,
  scalingSteps: [
    { upper: 0, change: -1 },
    { lower: 100, change: +1 },
    { lower: 500, change: +5 },
  ],
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
});

app.synth();
