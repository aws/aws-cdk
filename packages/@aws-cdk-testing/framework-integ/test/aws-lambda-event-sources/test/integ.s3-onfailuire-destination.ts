import { TestFunction } from './test-function';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AuthenticationMethod, SelfManagedKafkaEventSource, S3OnFailureDestination } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, StackProps, Stack, RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class S3OnFailureDestinationStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testLambdaFunction = new TestFunction(this, 'F');
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

    const rootCASecret = new secretsmanager.Secret(this, 'S', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
      },
    });
    const clientCertificatesSecret = new secretsmanager.Secret(this, 'SC', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
        privateKey: SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });
    rootCASecret.grantRead(testLambdaFunction);
    clientCertificatesSecret.grantRead(testLambdaFunction);

    const bootstrapServers = [
      'my-self-hosted-kafka-broker-1:9092',
      'my-self-hosted-kafka-broker-2:9092',
      'my-self-hosted-kafka-broker-3:9092',
    ];
    const bucket = new Bucket(this, 'B', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const s3ofd = new S3OnFailureDestination(bucket);
    testLambdaFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'my-test-topic',
      consumerGroupId: 'myTestConsumerGroup',
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      onFailure: s3ofd,
    }));
  }
}

const app = new App();
const stack = new S3OnFailureDestinationStack(app, 'lambda-event-source-s3ofd');
new IntegTest(app, 'LambdaEventSourceS3OnFailureDestinationInteg', {
  testCases: [stack],
});
app.synth();
