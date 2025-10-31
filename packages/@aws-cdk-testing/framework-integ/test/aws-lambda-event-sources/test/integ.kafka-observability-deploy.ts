import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { AuthenticationMethod, SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Integration test for Kafka observability features - DEPLOYMENT VERSION
 *
 * This version is designed for actual deployment testing and focuses on
 * self-managed Kafka scenarios that can be deployed without requiring
 * actual Kafka infrastructure.
 *
 * Test scenarios:
 * 1. Self-managed Kafka with LoggingConfig only
 * 2. Self-managed Kafka with MetricsConfig only
 * 3. Self-managed Kafka with both LoggingConfig and MetricsConfig
 */
class KafkaObservabilityDeployTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create secret for authentication
    const secret = new secretsmanager.Secret(this, 'KafkaSecret', {
      description: 'Kafka authentication credentials for observability test',
      secretObjectValue: {
        username: cdk.SecretValue.unsafePlainText('testuser'),
        password: cdk.SecretValue.unsafePlainText('testpass'),
      },
    });

    // Scenario 1: Self-managed Kafka with LoggingConfig only
    const smkLoggingFunction = new TestFunction(this, 'SMKLoggingFunction');
    smkLoggingFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: ['kafka-broker-1.example.com:9092', 'kafka-broker-2.example.com:9092'],
      topic: 'logging-topic',
      secret: secret,
      authenticationMethod: AuthenticationMethod.SASL_SCRAM_512_AUTH,
      startingPosition: lambda.StartingPosition.LATEST,
      consumerGroupId: 'logging-consumer-group',
      batchSize: 50,
      maxBatchingWindow: cdk.Duration.seconds(5),
      // Provisioned mode is required for observability features
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 5,
      },
      // Configure DEBUG level logging for detailed troubleshooting
      loggingConfig: {
        systemLogLevel: lambda.EventSourceMappingLogLevel.DEBUG,
      },
    }));

    // Scenario 2: Self-managed Kafka with MetricsConfig only
    const smkMetricsFunction = new TestFunction(this, 'SMKMetricsFunction');
    smkMetricsFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: ['kafka-broker-3.example.com:9092', 'kafka-broker-4.example.com:9092'],
      topic: 'metrics-topic',
      secret: secret,
      authenticationMethod: AuthenticationMethod.SASL_SCRAM_256_AUTH,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      consumerGroupId: 'metrics-consumer-group',
      batchSize: 100,
      maxBatchingWindow: cdk.Duration.seconds(10),
      // Provisioned mode is required for observability features
      provisionedPollerConfig: {
        minimumPollers: 2,
        maximumPollers: 8,
      },
      // Configure single metric type (AWS API limitation: max 1 metric type)
      metricsConfig: {
        metrics: [
          lambda.MetricType.EVENT_COUNT,
        ],
      },
    }));

    // Scenario 3: Self-managed Kafka with both LoggingConfig and MetricsConfig
    const smkCombinedFunction = new TestFunction(this, 'SMKCombinedFunction');
    smkCombinedFunction.addEventSource(new SelfManagedKafkaEventSource({
      bootstrapServers: ['kafka-broker-5.example.com:9092', 'kafka-broker-6.example.com:9092'],
      topic: 'combined-observability-topic',
      secret: secret,
      authenticationMethod: AuthenticationMethod.SASL_SCRAM_512_AUTH,
      startingPosition: lambda.StartingPosition.LATEST,
      consumerGroupId: 'combined-consumer-group',
      batchSize: 75,
      maxBatchingWindow: cdk.Duration.seconds(8),
      // Provisioned mode is required for observability features
      provisionedPollerConfig: {
        minimumPollers: 3,
        maximumPollers: 12,
      },
      // Configure single metric type (AWS API limitation: max 1 metric type)
      metricsConfig: {
        metrics: [
          lambda.MetricType.KAFKA_METRICS,
        ],
      },
    }));

    // Output the function names for easy reference
    new cdk.CfnOutput(this, 'LoggingFunctionName', {
      value: smkLoggingFunction.functionName,
      description: 'Lambda function with Kafka logging configuration',
    });

    new cdk.CfnOutput(this, 'MetricsFunctionName', {
      value: smkMetricsFunction.functionName,
      description: 'Lambda function with Kafka metrics configuration',
    });

    new cdk.CfnOutput(this, 'CombinedFunctionName', {
      value: smkCombinedFunction.functionName,
      description: 'Lambda function with both Kafka logging and metrics configuration',
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: secret.secretArn,
      description: 'ARN of the Kafka authentication secret',
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new KafkaObservabilityDeployTest(
  app,
  'KafkaObservabilityDeployTest',
);

new integ.IntegTest(app, 'KafkaObservabilityDeployIntegTest', {
  testCases: [stack],
});

app.synth();
