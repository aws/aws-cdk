import * as appscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-applicationautoscaling-high-resolution');

const target = new appscaling.ScalableTarget(stack, 'ECSScalableTarget', {
  serviceNamespace: appscaling.ServiceNamespace.ECS,
  scalableDimension: 'ecs:service:DesiredCount',
  minCapacity: 1,
  maxCapacity: 20,
  resourceId: 'service/MyCluster/MyService',
});

target.scaleToTrackMetric('CpuHighResolution', {
  targetValue: 60,
  predefinedMetric: appscaling.PredefinedMetric.ECS_SERVICE_AVERAGE_CPU_UTILIZATION_HIGH_RESOLUTION,
});

target.scaleToTrackMetric('MemoryHighResolution', {
  targetValue: 60,
  predefinedMetric: appscaling.PredefinedMetric.ECS_SERVICE_AVERAGE_MEMORY_UTILIZATION_HIGH_RESOLUTION,
});

new integ.IntegTest(app, 'HighResolutionEcsMetricsTest', {
  testCases: [stack],
});
