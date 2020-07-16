/// !cdk-integ pragma:ignore-assets
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

const app = new cdk.App();

class AwsApi extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Force new deployment of 'cool-service' and stop 'dev-instance' at midnight everyday
    const scheduleRule = new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.cron({
        hour: '0',
        minute: '0',
      }),
    });

    scheduleRule.addTarget(new targets.AwsApi({
      service: 'ECS',
      action: 'updateService',
      parameters: {
        service: 'cool-service',
        forceNewDeployment: true,
      } as AWS.ECS.UpdateServiceRequest,
    }));

    scheduleRule.addTarget(new targets.AwsApi({
      service: 'RDS',
      action: 'stopDBInstance',
      parameters: {
        DBInstanceIdentifier: 'dev-instance',
      } as AWS.RDS.StopDBInstanceMessage,
    }));

    // Create snapshots when a DB instance restarts
    const patternRule = new events.Rule(this, 'PatternRule', {
      eventPattern: {
        detailType: ['RDS DB Instance Event'],
        detail: {
          Message: ['DB instance restarted'],
        },
      },
    });

    patternRule.addTarget(new targets.AwsApi({
      service: 'RDS',
      action: 'createDBSnapshot',
      parameters: {
        DBInstanceIdentifier: events.EventField.fromPath('$.detail.SourceArn'),
      } as AWS.RDS.CreateDBSnapshotMessage,
    }));
  }
}

new AwsApi(app, 'aws-cdk-aws-api-target-integ');
app.synth();
