import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import {
  Topic,
  DataProtectionPolicy,
  DataProtectionPolicyStatement,
  DataDirection,
  CustomDataIdentifier,
  MaskOperation,
  RedactOperation,
  AuditOperation,
  DenyOperation,
  PersonalIdentifiers,
  FinancialIdentifiers,
  CredentialsIdentifiers,
} from 'aws-cdk-lib/aws-sns';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';

class SNSDataProtectionInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create custom data identifiers
    const employeeIdPattern = new CustomDataIdentifier({
      name: 'EmployeeID',
      regex: 'EMP-[0-9]{6}',
    });

    const customerIdPattern = new CustomDataIdentifier({
      name: 'CustomerID',
      regex: 'CUST-[0-9]{8}',
    });

    // Create a CloudWatch log group for SNS data protection findings
    const logGroup = new logs.LogGroup(this, 'DataProtectionLogGroup', {
      logGroupName: '/aws/vendedlogs/sns-data-protection',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create an SNS topic with data protection policy
    const topic = new Topic(this, 'ProtectedTopic', {
      topicName: 'topic-data-protection',
      dataProtectionPolicy: new DataProtectionPolicy({
        name: 'ComprehensiveProtectionPolicy',
        description: 'SNS data protection policy integration test',
        statements: [
          // Audit statement for PII data
          new DataProtectionPolicyStatement({
            sid: 'AuditPII',
            dataDirection: DataDirection.INBOUND,
            dataIdentifiers: [
              // Basic personal identifiers
              PersonalIdentifiers.NAME,
              PersonalIdentifiers.EMAIL_ADDRESS,
              PersonalIdentifiers.ADDRESS,
            ],
            operation: new AuditOperation({
              sampleRate: 99,
              findingsDestination: {
                cloudWatchLogs: {
                  logGroup: logGroup.logGroupName,
                },
              },
            }),
          }),

          // Mask financial information
          new DataProtectionPolicyStatement({
            sid: 'MaskFinancialData',
            dataDirection: DataDirection.INBOUND,
            dataIdentifiers: [
              FinancialIdentifiers.CREDIT_CARD_NUMBER,
              FinancialIdentifiers.CREDIT_CARD_EXPIRATION,
              FinancialIdentifiers.CREDIT_CARD_CVV,
            ],
            operation: new MaskOperation({
              maskWithCharacter: '#',
            }),
          }),

          // Redact custom patterns
          new DataProtectionPolicyStatement({
            sid: 'RedactCustomPatterns',
            dataDirection: DataDirection.INBOUND,
            dataIdentifiers: [employeeIdPattern, customerIdPattern],
            operation: new RedactOperation(),
          }),

          // Block messages with credentials
          new DataProtectionPolicyStatement({
            sid: 'BlockCredentials',
            dataDirection: DataDirection.INBOUND,
            dataIdentifiers: [
              CredentialsIdentifiers.AWS_SECRET_KEY,
              CredentialsIdentifiers.PRIVATE_KEY,
            ],
            operation: new DenyOperation(),
          }),
        ],
      }),
    });

    // Apply removal policy to SNS topic
    topic.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

const app = new App();

const stack = new SNSDataProtectionInteg(app, 'SNSDataProtectionInteg');

// Create an integration test that will deploy the stack and create a snapshot test
new integ.IntegTest(app, 'SNSDataProtectionTest', {
  testCases: [stack],
});

app.synth();
