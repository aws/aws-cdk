import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Key } from 'aws-cdk-lib/aws-kms';

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
        filters: [
          lambda.FilterCriteria.filter({
            numericEquals: lambda.FilterRule.isEqual(1),
          }),
        ],
      }),
    );

    const myKey = new Key(this, 'fc-test-key-name', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pendingWindow: cdk.Duration.days(7),
      description: 'KMS key for test fc encryption',
    });

    const fn2 = new TestFunction(this, 'F2');
    rootCASecret.grantRead(fn2);
    clientCertificatesSecret.grantRead(fn2);

    fn2.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'my-test-topic2',
      consumerGroupId: 'myTestConsumerGroup2',
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      filters: [
        lambda.FilterCriteria.filter({
          numericEquals: lambda.FilterRule.isEqual(2),
        }),
      ],
      filterEncryption: myKey,
    }));

    const fn3 = new TestFunction(this, 'F3');
    rootCASecret.grantRead(fn3);
    clientCertificatesSecret.grantRead(fn3);

    fn3.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'my-test-topic3',
      consumerGroupId: 'myTestConsumerGroup3',
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      filters: [
        lambda.FilterCriteria.filter({
          numericEquals: lambda.FilterRule.isEqual(1),
        }),
      ],
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 3,
      },
    }));

    const fn4 = new TestFunction(this, 'F4');
    rootCASecret.grantRead(fn4);
    clientCertificatesSecret.grantRead(fn4);

    fn4.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'my-test-topic4',
      consumerGroupId: 'myTestConsumerGroup4',
      secret: clientCertificatesSecret,
      authenticationMethod:
        AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
      startingPositionTimestamp: 1730270400,
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new KafkaSelfManagedEventSourceTest(
  app,
  'lambda-event-source-kafka-self-managed',
);
new integ.IntegTest(app, 'LambdaEventSourceKafkaSelfManagedTest', {
  testCases: [stack],
});
app.synth();
