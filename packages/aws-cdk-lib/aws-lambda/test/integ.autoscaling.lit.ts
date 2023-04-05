import * as appscaling from '../../aws-applicationautoscaling';
import * as cdk from '../../core';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from '../../cx-api';
import * as lambda from '../lib';

/**
* Stack verification steps:
* aws application-autoscaling describe-scalable-targets --service-namespace lambda --resource-ids function:<function name>:prod
* has a minCapacity of 3 and maxCapacity of 50
*/
class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'MyLambda', {
      code: new lambda.InlineCode('exports.handler = async () => { console.log(\'hello world\'); };'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.currentVersion;

    const alias = new lambda.Alias(this, 'Alias', {
      aliasName: 'prod',
      version,
    });

    const scalingTarget = alias.addAutoScaling({ minCapacity: 3, maxCapacity: 50 });

    scalingTarget.scaleOnUtilization({
      utilizationTarget: 0.5,
    });

    scalingTarget.scaleOnSchedule('ScaleUpInTheMorning', {
      schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
      minCapacity: 20,
    });

    scalingTarget.scaleOnSchedule('ScaleDownAtNight', {
      schedule: appscaling.Schedule.cron({ hour: '20', minute: '0' }),
      maxCapacity: 20,
    });

    new cdk.CfnOutput(this, 'FunctionName', {
      value: fn.functionName,
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'aws-lambda-autoscaling');

// Changes the function description when the feature flag is present
// to validate the changed function hash.
cdk.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));

app.synth();
