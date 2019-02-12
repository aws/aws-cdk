import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import cdk = require('@aws-cdk/cdk');
import dynamodb = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-dynamodb');

const table = new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.String }
});

/// !show
const readScaling = table.autoScaleReadCapacity({ minCapacity: 1, maxCapacity: 50 });

readScaling.scaleOnUtilization({
  targetUtilizationPercent: 50
});

readScaling.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: appscaling.Cron.dailyUtc(8),
  minCapacity: 20,
});

readScaling.scaleOnSchedule('ScaleDownAtNight', {
  schedule: appscaling.Cron.dailyUtc(20),
  maxCapacity: 20
});
/// !hide

app.run();