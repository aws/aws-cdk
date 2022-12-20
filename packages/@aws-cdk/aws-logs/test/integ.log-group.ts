import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogGroup, RetentionDays } from '../lib';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new LogGroup(this, 'LogGroupLambda', {
      logGroupName: 'cdkIntegLogGroup',
      retention: RetentionDays.ONE_DAY,
      dataProtectionPolicy:
        {
          Name: 'data-protection-policy',
          Description: 'test description',
          Version: '2021-06-01',
          Statement: [{
            Sid: 'audit-policy test',
            DataIdentifier: [
              'arn:aws:dataprotection::aws:data-identifier/EmailAddress',
              'arn:aws:dataprotection::aws:data-identifier/DriversLicense-US',
            ],
            Operation: {
              Audit: {
                FindingsDestination: {},
              },
            },
          },
          {
            Sid: 'redact-policy',
            DataIdentifier: [
              'arn:aws:dataprotection::aws:data-identifier/EmailAddress',
              'arn:aws:dataprotection::aws:data-identifier/DriversLicense-US',
            ],
            Operation: {
              Deidentify: {
                MaskConfig: {},
              },
            },
          }],
        },
    });
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-integ');
new IntegTest(app, 'LogGroupInteg', { testCases: [stack] });
app.synth();