import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from '../lib';

class KafkaSelfManagedEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const dummyCertString = `-----BEGIN CERTIFICATE-----
MIIE5DCCAsygAwIBAgIRAPJdwaFaNRrytHBto0j5BA0wDQYJKoZIhvcNAQELBQAw
cmUuiAii9R0=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFgjCCA2qgAwIBAgIQdjNZd6uFf9hbNC5RdfmHrzANBgkqhkiG9w0BAQsFADBb
c8PH3PSoAaRwMMgOSA2ALJvbRz8mpg==
-----END CERTIFICATE-----"
`;

    const dummyPrivateKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
zp2mwJn2NYB7AZ7+imp0azDZb+8YG2aUCiyqb6PnnA==
-----END ENCRYPTED PRIVATE KEY-----`;

    const fn = new TestFunction(this, 'F');
    const rootCASecret = new secretsmanager.Secret(this, 'S', {
      secretObjectValue: {
        certificate: cdk.SecretValue.unsafePlainText(dummyCertString),
      },
    });
    const clientCertificatesSecret = new secretsmanager.Secret(this, 'SC', {
      secretObjectValue: {
        certificate: cdk.SecretValue.unsafePlainText(dummyCertString),
        privateKey: cdk.SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });
    rootCASecret.grantRead(fn);
    clientCertificatesSecret.grantRead(fn);

    const bootstrapServers = [
      'my-self-hosted-kafka-broker-1:9092',
      'my-self-hosted-kafka-broker-2:9092',
      'my-self-hosted-kafka-broker-3:9092',
    ];

    fn.addEventSource(
      new SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: 'my-test-topic',
        consumerGroupId: 'myTestConsumerGroup',
        secret: clientCertificatesSecret,
        authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
        rootCACertificate: rootCASecret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      }),
    );
  }
}

const app = new cdk.App();
const stack = new KafkaSelfManagedEventSourceTest(
  app,
  'lambda-event-source-kafka-self-managed',
);
new integ.IntegTest(app, 'LambdaEventSourceKafkaSelfManagedTest', {
  testCases: [stack],
});
app.synth();
