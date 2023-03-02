import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogGroup, DataProtectionPolicy, DataIdentifier } from '../lib';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    var audit = new LogGroup(this, 'LogGroupLambdaAudit', {});

    var bucket = new Bucket(this, 'audit-bucket-id');

    const dataProtectionPolicy = new DataProtectionPolicy(this, {
      name: 'policy-name',
      description: 'policy description',
      identifiers: [DataIdentifier.DRIVERSLICENSE_US],
      identifierArnStrings: ['arn:aws:dataprotection::aws:data-identifier/EmailAddress'],
      logGroupNameAuditDestination: audit.logGroupName,
      s3BucketNameAuditDestination: bucket.bucketName,
    });

    new LogGroup(this, 'LogGroupLambda', {
      dataProtectionPolicy: dataProtectionPolicy,
    });
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-integ');
new IntegTest(app, 'LogGroupInteg', { testCases: [stack] });
app.synth();