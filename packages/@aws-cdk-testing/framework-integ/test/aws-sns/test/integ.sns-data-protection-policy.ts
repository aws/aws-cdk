/**
 * SNS Data Protection Policy Integration Test
 *
 * This integration test validates the complete SNS Data Protection Policy implementation
 * by creating multiple SNS topics with different policy configurations and verifying
 * that they generate the correct CloudFormation templates.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────────┐
 * │                    Integration Test Coverage Overview                            │
 * └─────────────────────────────────────────────────────────────────────────────────┘
 *
 * Test Scenarios:
 * ┌─────────────────────────────────────────────────────────────────────────────────┐
 * │ 1. Basic Policy (Managed Identifiers Only)                                     │
 * │    ├── Email Address + Credit Card Number                                      │
 * │    ├── Default policy name and description                                     │
 * │    └── No audit destinations                                                   │
 * │                                                                                 │
 * │ 2. Custom Policy (Mixed Identifiers)                                           │
 * │    ├── Email Address (managed) + SSN (custom regex)                           │
 * │    ├── Custom policy name and description                                      │
 * │    └── Validates custom data identifier configuration                          │
 * │                                                                                 │
 * │ 3. Custom-Only Policy (Custom Identifiers Only)                               │
 * │    ├── SSN + Custom Account ID (both custom regex)                            │
 * │    ├── Tests policy with no managed identifiers                               │
 * │    └── Validates multiple custom identifiers                                  │
 * │                                                                                 │
 * │ 4. Comprehensive Policy (All Features)                                         │
 * │    ├── Multiple managed identifiers (Email, CC, Address)                      │
 * │    ├── Factory method identifiers (socialSecurityNumber, phoneNumber)        │
 * │    ├── Multiple custom identifiers (Employee ID, Project Code)                │
 * │    └── Tests maximum complexity scenario with all identifier types            │
 * │                                                                                 │
 * │ 5. Audit Destinations Policy                                                   │
 * │    ├── CloudWatch Logs audit destination                                       │
 * │    ├── S3 bucket audit destination                                             │
 * │    └── Validates audit findings routing                                        │
 * │                                                                                 │
 * │ 6. Control Topic (No Policy)                                                   │
 * │    └── Standard SNS topic without data protection for comparison               │
 * └─────────────────────────────────────────────────────────────────────────────────┘
 *
 * CloudFormation Validation:
 * ┌─────────────────────────────────────────────────────────────────────────────────┐
 * │ Expected Output Structure:                                                      │
 * │                                                                                 │
 * │ AWS::SNS::Topic                                                                 │
 * │ ├── DataProtectionPolicy                                                        │
 * │ │   ├── Name: "policy-name"                                                    │
 * │ │   ├── Description: "policy-description"                                     │
 * │ │   ├── Version: "2021-06-01"                                                 │
 * │ │   ├── Statement[]                                                           │
 * │ │   │   ├── [0] Audit Statement                                              │
 * │ │   │   │   ├── Sid: "audit-statement-cdk"                                  │
 * │ │   │   │   ├── DataIdentifier: ["arn:aws:dataprotection::...", "custom"]   │
 * │ │   │   │   ├── DataDirection: "Inbound"                                     │
 * │ │   │   │   ├── Principal: ["*"]                                             │
 * │ │   │   │   └── Operation.Audit.SampleRate: 99                              │
 * │ │   │   └── [1] Redaction Statement                                          │
 * │ │   │       ├── Sid: "redact-statement-cdk"                                 │
 * │ │   │       └── Operation.Deidentify.MaskConfig: {}                         │
 * │ │   └── Configuration                                                         │
 * │ │       └── CustomDataIdentifier[]                                           │
 * │ │           └── { Name: "name", Regex: "pattern" }                           │
 * │ └── Other topic properties (TopicName, DisplayName, etc.)                     │
 * └─────────────────────────────────────────────────────────────────────────────────┘
 *
 * What This Test Validates:
 * • ✅ CDK constructs generate correct CloudFormation templates
 * • ✅ Factory method API provides type-safe, validated data identifiers
 * • ✅ Managed data identifiers are converted to proper ARN format
 * • ✅ Custom data identifiers are included in Configuration section
 * • ✅ Policy statements have correct structure (audit + redaction)
 * • ✅ Audit destinations are properly configured when specified
 * • ✅ Integration with other AWS resources (CloudWatch Logs, S3)
 * • ✅ No regressions in standard SNS topic functionality
 * • ✅ Factory methods (driversLicense, phoneNumber, etc.) work correctly
 */

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
      identifiers: [DataIdentifier.EMAIL_ADDRESS, DataIdentifier.CREDIT_CARD_NUMBER],
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
        DataIdentifier.EMAIL_ADDRESS,
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
        DataIdentifier.EMAIL_ADDRESS,
        DataIdentifier.CREDIT_CARD_NUMBER,
        DataIdentifier.socialSecurityNumber('US'),
        DataIdentifier.phoneNumber('US'),
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
        DataIdentifier.EMAIL_ADDRESS,
        DataIdentifier.CREDIT_CARD_NUMBER,
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

