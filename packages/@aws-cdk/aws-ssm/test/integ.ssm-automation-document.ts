import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ssm from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    ssm.AutomationDocument.fromAutomationDocumentName(
      this,
      'StartRdsDoc',
      'AWS-StartRDSInstance',
    );

    const automationAssumeRole = new iam.Role(this, 'AutomationAssumeRole', {
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
    });

    new ssm.AutomationDocument(this, 'MyAutomationDoc', {
      content: {
        schemaVersion: '0.3',
        assumeRole: automationAssumeRole.roleArn,
        description: 'My Automation Document',
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
    new TestStack(app, 'aws-cdk-ssm-automation-document'),
  ],
});
