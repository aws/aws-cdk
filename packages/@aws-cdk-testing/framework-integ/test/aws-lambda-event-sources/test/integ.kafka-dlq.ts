import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import {
  AuthenticationMethod,
  SelfManagedKafkaEventSource,
  KafkaDlq,
} from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Integration test stack for SelfManagedKafka with KafkaDlq destination
 */
class SelfManagedKafkaWithKafkaDlqStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const dummyCertString = `-----BEGIN CERTIFICATE-----
MIIE5DCCAsygAwIBAgIRAPJdwaFaNRrytHBto0j5BA0wDQYJKoZIhvcNAQELBQAw
cmUuaAii9R0=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFgjCCA2qgAwIBAgIQdjNZd6uFf9hbNC5RdfmHrzANBgkqhkiG9w0BAQsFADBb
c8PH3PSoAaRwMMgOSA2ALJvbRz8mpg==
-----END CERTIFICATE-----`;

    const dummyPrivateKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
zp2mwJn2NYB7AZ7+imp0azDZb+8YG2aUCiyqb6PnnA==
-----END ENCRYPTED PRIVATE KEY-----`;

    const fn = new TestFunction(this, 'SelfManagedKafkaFunction');

    const rootCASecret = new secretsmanager.Secret(this, 'RootCASecret', {
      secretObjectValue: {
        certificate: cdk.SecretValue.unsafePlainText(dummyCertString),
      },
    });

    const clientCertificatesSecret = new secretsmanager.Secret(this, 'ClientCertSecret', {
      secretObjectValue: {
        certificate: cdk.SecretValue.unsafePlainText(dummyCertString),
        privateKey: cdk.SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });

    rootCASecret.grantRead(fn);
    clientCertificatesSecret.grantRead(fn);

    const bootstrapServers = [
      'self-managed-kafka-broker-1:9092',
      'self-managed-kafka-broker-2:9092',
      'self-managed-kafka-broker-3:9092',
    ];

    // Create KafkaDlq destination
    const kafkaDlq = new KafkaDlq('self-managed-kafka-failure-topic');

    // Add SelfManagedKafka event source with KafkaDlq destination
    fn.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'self-managed-test-topic',
      consumerGroupId: 'self-managed-test-consumer-group',
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      onFailure: kafkaDlq,
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 1,
      },
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const selfManagedKafkaStack = new SelfManagedKafkaWithKafkaDlqStack(
  app,
  'lambda-event-source-self-managed-kafka-dlq',
);

new integ.IntegTest(app, 'LambdaEventSourceKafkaDlqTest', {
  testCases: [selfManagedKafkaStack],
});

app.synth();
