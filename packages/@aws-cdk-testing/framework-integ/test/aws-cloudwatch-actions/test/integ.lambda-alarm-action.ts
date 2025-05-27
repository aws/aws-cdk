import { App, Stack, StackProps, Duration, FeatureFlags } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION } from 'aws-cdk-lib/cx-api';

class LambdaAlarmActionIntegrationTestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const isFeature = FeatureFlags.of(this).isEnabled(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION);
    const lambdaIdSuffix = isFeature ? 'Feature' : '';

    const inAlarmLambda = new lambda.Function(this, `inAlarmLambda${lambdaIdSuffix}`, {
      functionName: `inAlarmLambda${lambdaIdSuffix}`,
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

    const alarmLambda = new lambda.Function(this, `alarmLambda${lambdaIdSuffix}`, {
      functionName: `alarmLambda${lambdaIdSuffix}`,
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });
    const version = alarmLambda.currentVersion;
    const aliasName = alarmLambda.addAlias('aliasName');
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(version));
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(aliasName));
    alarm.addAlarmAction(new cloudwatchActions.LambdaAction(alarmLambda));
    alarm.addOkAction(new cloudwatchActions.LambdaAction(version));
    alarm.addOkAction(new cloudwatchActions.LambdaAction(aliasName));
    alarm.addOkAction(new cloudwatchActions.LambdaAction(alarmLambda));
    alarm.addInsufficientDataAction(new cloudwatchActions.LambdaAction(version));
    alarm.addInsufficientDataAction(new cloudwatchActions.LambdaAction(aliasName));
    alarm.addInsufficientDataAction(new cloudwatchActions.LambdaAction(alarmLambda));

    if (isFeature) {
      const alarm2 = new cloudwatch.Alarm(this, `Alarm${lambdaIdSuffix}`, {
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        threshold: 1,
        evaluationPeriods: 1,
        metric: inAlarmLambda.metricErrors({ period: Duration.minutes(1) }),
        actionsEnabled: true,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      alarm2.addAlarmAction(new cloudwatchActions.LambdaAction(version));
      alarm2.addAlarmAction(new cloudwatchActions.LambdaAction(aliasName));
      alarm2.addAlarmAction(new cloudwatchActions.LambdaAction(alarmLambda));
      alarm2.addOkAction(new cloudwatchActions.LambdaAction(version));
      alarm2.addOkAction(new cloudwatchActions.LambdaAction(aliasName));
      alarm2.addOkAction(new cloudwatchActions.LambdaAction(alarmLambda));
      alarm2.addInsufficientDataAction(new cloudwatchActions.LambdaAction(version));
      alarm2.addInsufficientDataAction(new cloudwatchActions.LambdaAction(aliasName));
      alarm2.addInsufficientDataAction(new cloudwatchActions.LambdaAction(alarmLambda));
    }
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new LambdaAlarmActionIntegrationTestStack(app, 'LambdaAlarmActionIntegrationTestStack');
new integ.IntegTest(app, 'LambdaAlarmActionIntegrationTest', {
  testCases: [stack],
});
app.synth();

const appWithFeatureFlag = new App({
  context: {
    [LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stackWithFeatureFlag = new LambdaAlarmActionIntegrationTestStack(appWithFeatureFlag, 'LambdaAlarmActionIntegrationTestStackWithFeatureFlag');
new integ.IntegTest(appWithFeatureFlag, 'LambdaAlarmActionIntegrationTestWithFeatureFlag', {
  testCases: [stackWithFeatureFlag],
});
appWithFeatureFlag.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
