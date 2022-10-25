import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import * as ssm from '@aws-cdk/aws-ssm';
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

    const myDocument = new ssm.CfnDocument(this, 'MyDocument', {
      content: {
        schemaVersion: '2.2',
        description: 'My Document',
        parameters: {
          MyParameter: {
            type: 'String',
            description: 'My Parameter',
          },
        },
        mainSteps: [
          {
            action: 'aws:runShellScript',
            name: 'runShellScript',
            precondition: {
              StringEquals: [
                'platformType',
                'Linux',
              ],
            },
            inputs: {
              runCommand: ['echo "Hello World"'],
            },
          },
        ],
      },
      documentType: 'Command',
      name: 'my-document',
    });

    const deadLetterQueue = new sqs.Queue(this, 'MyDeadLetterQueue');

    event.addTarget(new targets.SsmRunCommand(myDocument, {
      targetKey: 'InstanceIds',
      targetValues: ['i-asdfiuh2304f'],
      input: {
        MyParameter: ['MyParameterValue'],
      },
      retryAttempts: 0,
      deadLetterQueue,
    }));
  }
}

const app = new cdk.App();

new integ.IntegTest(app, 'Testing', {
  testCases: [
    new TestStack(app, 'aws-cdk-ssm-runcommand-event-target'),
  ],
});
