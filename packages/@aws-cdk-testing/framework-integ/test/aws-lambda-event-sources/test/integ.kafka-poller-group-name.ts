import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

class KafkaPollerGroupNameTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const dummyCertString = `-----BEGIN CERTIFICATE-----
MIIE5DCCAsygAwIBAgIRAPJdwaFaNRrytHBto0j5BA0wDQYJKoZIhvcNAQELBQAw
cmUuaAii9R0=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFgjCCA2qgAwIBAgIQdjNZd6uFf9hbNC5RdfmHrzANBgkqhkiG9w0BAQsFADBb
c8PH3PSoAaRwMMgOSA2ALJvbRz8mpg==
-----END CERTIFICATE-----"
`;

    const dummyPrivateKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
zp2mwJn2NYB7AZ7+imp0azDZb+8YG2aUCiyqb6PnnA==
-----END ENCRYPTED PRIVATE KEY-----`;

    const fn1 = new TestFunction(this, 'SelfManagedFunction');
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
    rootCASecret.grantRead(fn1);
    clientCertificatesSecret.grantRead(fn1);

    const bootstrapServers = [
      'my-self-hosted-kafka-broker-1:9092',
      'my-self-hosted-kafka-broker-2:9092',
      'my-self-hosted-kafka-broker-3:9092',
    ];

    fn1.addEventSource(
      new SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: 'my-test-topic-with-poller-group',
        consumerGroupId: 'myTestConsumerGroupWithPollerGroup',
        secret: clientCertificatesSecret,
        authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
        rootCACertificate: rootCASecret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        provisionedPollerConfig: {
          minimumPollers: 1,
          maximumPollers: 3,
          pollerGroupName: 'test-poller-group-self-managed',
        },
      }),
    );
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new KafkaPollerGroupNameTest(
  app,
  'lambda-event-source-kafka-poller-group-name',
);
new integ.IntegTest(app, 'LambdaEventSourceKafkaPollerGroupNameTest', {
  testCases: [stack],
});
app.synth();
