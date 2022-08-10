import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ssmIncidents from '@aws-cdk/aws-ssmincidents';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';

import * as cloudwatchActions from '../lib';

class SsmIncidentAlarmActionIntegrationTestStack extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const responsePlanName = 'test-response-plan';

    new ssmIncidents.CfnResponsePlan(this, 'ResponsePlan', {
      name: responsePlanName,
      incidentTemplate: {
        title: 'Incident Title',
        impact: 1,
      },
    });

    const metric = new cloudwatch.Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
      label: 'Metric [AVG: ${AVG}]',
    });

    const alarm = new cloudwatch.Alarm(this, 'Alarm1', {
      metric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    alarm.addAlarmAction(new cloudwatchActions.SsmIncidentAction(responsePlanName));
  }
}

const app = new App();

const stack = new SsmIncidentAlarmActionIntegrationTestStack(app, 'SsmIncidentAlarmActionIntegrationTestStack');

new integ.IntegTest(app, 'SsmIncidentManagerAlarmActionTest', {
  testCases: [stack],
});

app.synth();
