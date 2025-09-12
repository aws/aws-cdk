import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic, DataProtectionPolicy, DataIdentifier, CustomDataIdentifier } from 'aws-cdk-lib/aws-sns';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';

class SNSDataProtectionPolicyInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Topic with basic DataProtectionPolicy
    const basicDataProtectionPolicy = new DataProtectionPolicy({
      identifiers: [DataIdentifier.EMAILADDRESS, DataIdentifier.CREDITCARDNUMBER],
    });

    new Topic(this, 'TopicWithBasicDataProtectionPolicy', {
      topicName: 'topic-with-basic-data-protection-policy',
      displayName: 'Topic with Basic Data Protection Policy',
      dataProtectionPolicy: basicDataProtectionPolicy,
    });

    // Topic with custom DataProtectionPolicy
    const customDataProtectionPolicy = new DataProtectionPolicy({
      name: 'CustomDataProtectionPolicy',
      description: 'Custom data protection policy for integration test',
      identifiers: [
        DataIdentifier.EMAILADDRESS,
        new CustomDataIdentifier('SSN', '[0-9]{3}-[0-9]{2}-[0-9]{4}'),
      ],
    });

    new Topic(this, 'TopicWithCustomDataProtectionPolicy', {
      topicName: 'topic-with-custom-data-protection-policy',
      displayName: 'Topic with Custom Data Protection Policy',
      dataProtectionPolicy: customDataProtectionPolicy,
    });

    // Topic with only custom data identifiers
    const customOnlyDataProtectionPolicy = new DataProtectionPolicy({
      name: 'CustomOnlyDataProtectionPolicy',
      description: 'Policy with only custom data identifiers',
      identifiers: [
        new CustomDataIdentifier('SSN', '[0-9]{3}-[0-9]{2}-[0-9]{4}'),
        new CustomDataIdentifier('CustomAccountId', 'ACCT-[A-Z]{3}-[0-9]{6}'),
      ],
    });

    new Topic(this, 'TopicWithCustomOnlyDataProtectionPolicy', {
      topicName: 'topic-with-custom-only-data-protection-policy',
      displayName: 'Topic with Custom Only Data Protection Policy',
      dataProtectionPolicy: customOnlyDataProtectionPolicy,
    });

    // Topic with mixed managed and custom identifiers (comprehensive test)
    const comprehensiveDataProtectionPolicy = new DataProtectionPolicy({
      name: 'ComprehensiveDataProtectionPolicy',
      description: 'Comprehensive policy with multiple identifier types',
      identifiers: [
        DataIdentifier.EMAILADDRESS,
        DataIdentifier.CREDITCARDNUMBER,
        DataIdentifier.SSN_US,
        DataIdentifier.PHONENUMBER_US,
        DataIdentifier.ADDRESS,
        new CustomDataIdentifier('EmployeeId', 'EMP-[0-9]{6}'),
        new CustomDataIdentifier('ProjectCode', 'PROJ-[A-Z]{2}-[0-9]{4}'),
      ],
    });

    new Topic(this, 'TopicWithComprehensiveDataProtectionPolicy', {
      topicName: 'topic-with-comprehensive-data-protection-policy',
      displayName: 'Topic with Comprehensive Data Protection Policy',
      dataProtectionPolicy: comprehensiveDataProtectionPolicy,
    });

    // Topic with audit destinations
    const auditLogGroup = new LogGroup(this, 'AuditLogGroup', {
      logGroupName: `/aws/vendedlogs/sns-data-protection-audit-${this.node.addr}`,
    });

    const auditBucket = new Bucket(this, 'AuditBucket');

    const auditDestinationPolicy = new DataProtectionPolicy({
      name: 'AuditDestinationPolicy',
      description: 'Policy with audit destinations for integration test',
      identifiers: [
        DataIdentifier.EMAILADDRESS,
        DataIdentifier.CREDITCARDNUMBER,
      ],
      logGroupAuditDestination: auditLogGroup,
      s3BucketAuditDestination: auditBucket,
    });

    new Topic(this, 'TopicWithAuditDestinations', {
      topicName: 'topic-with-audit-destinations',
      displayName: 'Topic with Audit Destinations',
      dataProtectionPolicy: auditDestinationPolicy,
    });

    // Topic without DataProtectionPolicy for comparison
    new Topic(this, 'TopicWithoutDataProtectionPolicy', {
      topicName: 'topic-without-data-protection-policy',
      displayName: 'Topic without Data Protection Policy',
    });
  }
}

const app = new App();
const stack = new SNSDataProtectionPolicyInteg(app, 'SNSDataProtectionPolicyInteg');

new integ.IntegTest(app, 'SNSDataProtectionPolicyTest', {
  testCases: [stack],
});

app.synth();

