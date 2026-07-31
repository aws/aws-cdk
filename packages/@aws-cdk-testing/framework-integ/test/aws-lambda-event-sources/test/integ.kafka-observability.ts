import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Integration test for Kafka observability features (LoggingConfig and MetricsConfig)
 *
 * This test validates that LoggingConfig and MetricsConfig generate correct CloudFormation
 * templates with proper provisioned poller configuration.
 *
 * Test scenarios:
 * 1. Self-managed Kafka with LoggingConfig only
 * 2. Self-managed Kafka with MetricsConfig only
 */
class KafkaObservabilityTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create secret for authentication
    const secret = new secretsmanager.Secret(this, 'KafkaSecret', {
      secretObjectValue: {
        username: cdk.SecretValue.unsafePlainText('testuser'),
        password: cdk.SecretValue.unsafePlainText('testpass'),
      },
    });

    // Scenario 1: Self-managed Kafka with LoggingConfig only
    const smkLoggingFunction = new TestFunction(this, 'SMKLoggingFunction');
    smkLoggingFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: ['kafka-broker-1:9092', 'kafka-broker-2:9092'],
      topic: 'logging-topic',
      secret: secret,
      authenticationMethod: AuthenticationMethod.SASL_SCRAM_512_AUTH,
      startingPosition: lambda.StartingPosition.LATEST,
      consumerGroupId: 'logging-consumer-group',
      // Provisioned mode is required for observability features
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 5,
      },
      // Configure DEBUG level logging for detailed troubleshooting
      logLevel: lambda.EventSourceMappingLogLevel.DEBUG,
    }));

    // Scenario 2: Self-managed Kafka with MetricsConfig only
    const smkMetricsFunction = new TestFunction(this, 'SMKMetricsFunction');
    smkMetricsFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: ['kafka-broker-3:9092', 'kafka-broker-4:9092'],
      topic: 'metrics-topic',
      secret: secret,
      authenticationMethod: AuthenticationMethod.SASL_SCRAM_256_AUTH,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      consumerGroupId: 'metrics-consumer-group',
      batchSize: 100,
      // Provisioned mode is required for observability features
      provisionedPollerConfig: {
        minimumPollers: 3,
        maximumPollers: 15,
      },
      // Configure comprehensive metrics including Kafka-specific metrics
      metricsConfig: {
        metrics: [
          lambda.MetricType.EVENT_COUNT,
          lambda.MetricType.ERROR_COUNT,
          lambda.MetricType.KAFKA_METRICS,
        ],
      },
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new KafkaObservabilityTest(
  app,
  'KafkaObservabilityTest',
);

new integ.IntegTest(app, 'KafkaObservabilityIntegTest', {
  testCases: [stack],
});

app.synth();
