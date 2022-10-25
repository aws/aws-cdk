import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as targets from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const event = new events.Rule(this, 'MyRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    const automationArn = `arn:aws:ssm:${cdk.Stack.of(this).region}::automation-definition/AWS-StopRdsInstance:$DEFAULT`;

    const deadLetterQueue = new sqs.Queue(this, 'MyDeadLetterQueue');

    const ssmAssumeRole = new iam.Role(this, 'SSMAssumeRole', {
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
    });

    event.addTarget(new targets.SsmAutomation(automationArn, {
      input: {
        InstanceId: ['my-rds-instance'],
      },
      ssmAssumeRole,
      deadLetterQueue,
    }));
  }
}

const app = new cdk.App();

new integ.IntegTest(app, 'Testing', {
  testCases: [
    new TestStack(app, 'aws-cdk-ssm-automation-event-target'),
  ],
});
