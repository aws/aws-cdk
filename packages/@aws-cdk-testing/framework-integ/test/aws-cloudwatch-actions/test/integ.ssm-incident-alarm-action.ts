import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ssmIncidents from 'aws-cdk-lib/aws-ssmincidents';
import { App, Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';

class SsmIncidentAlarmActionIntegrationTestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const responsePlanName = 'test-response-plan';

    const key = new kms.Key(this, 'Key', {
      pendingWindow: Duration.days(7),
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const replicationSet = new ssmIncidents.CfnReplicationSet(this, 'ReplicationSet', {
      deletionProtected: false,
      regions: [{
        regionName: this.region,
        regionConfiguration: {
          sseKmsKeyId: key.keyArn,
        },
      }],
    });

    const responsePlan = new ssmIncidents.CfnResponsePlan(this, 'ResponsePlan', {
      name: responsePlanName,
      incidentTemplate: {
        title: 'Incident Title',
        impact: 1,
      },
    });

    responsePlan.node.addDependency(replicationSet);

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
    alarm.node.addDependency(responsePlan);

    alarm.addAlarmAction(new cloudwatchActions.SsmIncidentAction(responsePlanName));
  }
}

const app = new App();

const stack = new SsmIncidentAlarmActionIntegrationTestStack(app, 'SsmIncidentAlarmActionIntegrationTestStack');

new integ.IntegTest(app, 'SsmIncidentManagerAlarmActionTest', {
  testCases: [stack],
});

app.synth();
