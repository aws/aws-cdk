import * as appscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-dynamodb');

const table = new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

/// !show
const readScaling = table.autoScaleReadCapacity({ minCapacity: 1, maxCapacity: 50 });

readScaling.scaleOnUtilization({
  targetUtilizationPercent: 50,
});

readScaling.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 20,
});

readScaling.scaleOnSchedule('ScaleDownAtNight', {
  schedule: appscaling.Schedule.cron({ hour: '20', minute: '0' }),
  maxCapacity: 20,
});
/// !hide

app.synth();
