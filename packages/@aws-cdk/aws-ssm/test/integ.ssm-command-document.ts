import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ssm from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    ssm.CommandDocument.fromCommandDocumentName(
      this,
      'StartRdsDoc',
      'AWS-StartRDSInstance',
    );

    new ssm.CommandDocument(this, 'MyCommandDoc', {
      content: {
        schemaVersion: '2.2',
        description: 'My Command Document',
        parameters: {
          MyParameter: {
            type: 'String',
            description: 'My Parameter',
            default: 'MyParameterValue',
          },
        },
        mainSteps: [
          {
            action: 'aws:runShellScript',
            name: 'runShellScript',
            inputs: {
              runCommand: ['echo "Hello World"'],
            },
          },
        ],
      },
    });
  }
}

const app = new cdk.App();

new integ.IntegTest(app, 'Testing', {
  testCases: [
    new TestStack(app, 'aws-cdk-ssm-command-document'),
  ],
});
