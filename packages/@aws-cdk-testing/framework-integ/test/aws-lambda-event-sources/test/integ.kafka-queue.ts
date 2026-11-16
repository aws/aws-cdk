import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Self-managed Kafka event source in queue consumption mode (Kafka share groups).
 *
 * The brokers are placeholders; Lambda creates the event source mapping without connecting to them.
 */
class KafkaQueueEventSourceTest extends cdk.Stack {
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

    const clientCertificatesSecret = new secretsmanager.Secret(this, 'ClientCertSecret', {
      secretObjectValue: {
        certificate: cdk.SecretValue.unsafePlainText(dummyCertString),
        privateKey: cdk.SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });

    const fn = new TestFunction(this, 'F');

    fn.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: [
        'my-self-hosted-kafka-broker-1:9092',
        'my-self-hosted-kafka-broker-2:9092',
      ],
      topic: 'my-queue-topic',
      consumerGroupId: 'myQueueShareGroup',
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      consumptionMode: lambda.KafkaConsumptionMode.QUEUE,
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new KafkaQueueEventSourceTest(app, 'lambda-event-source-kafka-queue');
new integ.IntegTest(app, 'LambdaEventSourceKafkaQueueTest', {
  testCases: [stack],
});
