import { App, Stack, StackProps } from '@aws-cdk/core';
import * as cloudwatch from '../../aws-cloudwatch';
import * as cloudwatchActions from '../lib';
import * as ssmIncidents from '../../aws-ssmincidents';
import * as integ from '@aws-cdk/integ-tests';

class SsmIncidentAlarmActionIntegrationTestStack extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const responsePlan = new ssmIncidents.CfnResponsePlan(this, 'ResponsePlan', {
      name: 'test-response-plan',
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

    alarm.addAlarmAction(new cloudwatchActions.SsmIncidentAction(responsePlan.attrArn));
  }
}

const app = new App();

const stack = new SsmIncidentAlarmActionIntegrationTestStack(app, 'SsmIncidentAlarmActionIntegrationTestStack');

const integTest = new integ.IntegTest(app, 'SsmIncidentManagerAlarmActionTest', {
  testCases: [stack],
});

app.synth();
