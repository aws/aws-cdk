import { TestFunction } from './test-function';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AuthenticationMethod, SelfManagedKafkaEventSource, S3OnFailureDestination, KinesisEventSource, DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, StackProps, Stack, RemovalPolicy, SecretValue, CfnOutput, Duration } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

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
async function handler(event: any) {
  // eslint-disable-next-line no-console
  console.log('event:', JSON.stringify(event, undefined, 2));
  throw new Error();
}

class KinesisWithS3OnFailureDestinationStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'F', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });
    new CfnOutput(this, 'FunctionArn', { value: fn.functionArn });

    const stream = new kinesis.Stream(this, 'S');
    new CfnOutput(this, 'InputKinesisStreamName', { value: stream.streamName });

    const bucket = new Bucket(this, 'B', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    fn.addEventSource(new KinesisEventSource(stream, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      onFailure: new S3OnFailureDestination(bucket),
      retryAttempts: 0,
    }));
  }
}

class DynamoWithS3OnFailureDestinationStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new dynamodb.Table(this, 'T', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_IMAGE,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const eventSource = new DynamoEventSource(queue, {
      batchSize: 5,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      tumblingWindow: Duration.seconds(60),
      onFailure: new S3OnFailureDestination(new Bucket(this, 'B')),
      retryAttempts: 0,
    });

    fn.addEventSource(eventSource);

    new CfnOutput(this, 'OutputEventSourceMappingArn', { value: eventSource.eventSourceMappingArn });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new S3OnFailureDestinationStack(app, 'lambda-event-source-s3ofd');
const stack2 = new KinesisWithS3OnFailureDestinationStack(app, 'kinesis-with-s3ofd');
const stack3 = new DynamoWithS3OnFailureDestinationStack(app, 'dynamo-with-s3ofd');
new IntegTest(app, 'LambdaEventSourceS3OnFailureDestinationInteg', {
  testCases: [stack, stack2, stack3],
});
app.synth();
