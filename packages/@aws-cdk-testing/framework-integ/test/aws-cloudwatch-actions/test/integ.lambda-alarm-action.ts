import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';

class LambdaAlarmActionIntegrationTestStack extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const inAlarmLambda = new lambda.Function(this, 'inAlarmLambda', {
      functionName: 'inAlarmLambda',
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });
    const alarm = new cloudwatch.Alarm(this, 'Alarm', {
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 1,
      evaluationPeriods: 1,
      metric: inAlarmLambda.metricErrors({ period: Duration.minutes(1) }),
      actionsEnabled: true,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    const alarmLambda = new lambda.Function(this, 'alarmLambda', {
      functionName: 'alarmLambda',
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });
    const version = alarmLambda.currentVersion;
    const aliasName = alarmLambda.addAlias('aliasName');
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(version));
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(aliasName));
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(alarmLambda));
  }
}

const app = new App();

const stack = new LambdaAlarmActionIntegrationTestStack(app, 'LambdaAlarmActionIntegrationTestStack');

new integ.IntegTest(app, 'LambdaAlarmActionIntegrationTest', {
  testCases: [stack],
});

app.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}