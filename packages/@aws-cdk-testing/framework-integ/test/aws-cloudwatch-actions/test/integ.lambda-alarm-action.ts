import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';

class LambdaAlarmActionIntegrationTestStack extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const inAlarmLambda = new lambda.Function(this, 'inAlarmLambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'inAlarmLambda',
      code: lambda.Code.fromInline(`
def handler(event, context):
  make this fn fail
  prinr22(''hello)`),
      handler: 'index.handler',
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
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'alarmLambda',
      code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
      handler: 'index.handler',
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
