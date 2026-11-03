import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Queue consumption mode needs a self-managed Apache Kafka 4.2+ cluster with share groups
 * enabled. The brokers below are placeholders, so the event source mappings are created
 * but cannot read records. This test checks the synthesized properties.
 */
class KafkaSelfManagedQueueModeStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bootstrapServers = [
      'my-self-hosted-kafka-broker-1:9092',
      'my-self-hosted-kafka-broker-2:9092',
    ];

    const secret = new secretsmanager.Secret(this, 'KafkaSecret');

    // Queue mode through the event source construct
    const queueFunction = new TestFunction(this, 'QueueModeFunction');
    queueFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: 'queue-mode-topic',
      consumerGroupId: 'queue-mode-share-group',
      secret,
      authenticationMethod: AuthenticationMethod.BASIC_AUTH,
      consumptionMode: lambda.KafkaConsumptionMode.QUEUE,
      batchSize: 50,
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 2,
      },
    }));

    // Stream mode set explicitly through the L2 event source mapping
    const streamFunction = new TestFunction(this, 'StreamModeFunction');
    secret.grantRead(streamFunction);
    streamFunction.addEventSourceMapping('StreamModeMapping', {
      kafkaBootstrapServers: bootstrapServers,
      kafkaTopic: 'stream-mode-topic',
      kafkaConsumerGroupId: 'stream-mode-consumer-group',
      kafkaConsumptionMode: lambda.KafkaConsumptionMode.STREAM,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      sourceAccessConfigurations: [{
        type: lambda.SourceAccessConfigurationType.BASIC_AUTH,
        uri: secret.secretArn,
      }],
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new KafkaSelfManagedQueueModeStack(app, 'lambda-event-source-kafka-self-managed-queue-mode');
new integ.IntegTest(app, 'LambdaEventSourceKafkaSelfManagedQueueModeTest', {
  testCases: [stack],
});
