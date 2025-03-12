import { Bucket } from 'aws-cdk-lib/aws-s3';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, DataProtectionPolicy, DataIdentifier, CustomDataIdentifier, FieldIndexPolicy } from 'aws-cdk-lib/aws-logs';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    var audit = new LogGroup(this, 'LogGroupLambdaAudit', {});

    var bucket = new Bucket(this, 'audit-bucket-id');

    const dataProtectionPolicy = new DataProtectionPolicy({
      name: 'policy-name',
      description: 'policy description',
      identifiers: [DataIdentifier.DRIVERSLICENSE_US, new DataIdentifier('EmailAddress'), new CustomDataIdentifier('EmployeeId', 'EmployeeId-\\d{9}')],
      logGroupAuditDestination: audit,
      s3BucketAuditDestination: bucket,
    });

    const fieldIndexPolicy = new FieldIndexPolicy({
      fields: ['Operation', 'RequestId'],
    });

    new LogGroup(this, 'LogGroupLambda', {
      dataProtectionPolicy: dataProtectionPolicy,
      fieldIndexPolicies: [fieldIndexPolicy],
    });
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-integ');
new IntegTest(app, 'LogGroupInteg', { testCases: [stack] });
