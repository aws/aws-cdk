import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface KafkaEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use a MSK cluster as a streaming source for AWS Lambda
 */
export class ManagedKafkaEventSource extends StreamEventSource {
  /**
   * Create an event source for MSK
   * @param clusterArn - the ARN of the MSK cluster
   * @param topic - the Kafka topic to subscribe to
   * @param secret - the secret with the Kafka credentials, see https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html for details
   * @param props
   */
  constructor(
    readonly clusterArn: string,
    readonly topic: string,
    readonly secret: secretsmanager.ISecret,
    props: KafkaEventSourceProps) {
    super(props);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.topic}`,
      this.enrichMappingOptions({
        eventSourceArn: this.clusterArn,
        startingPosition: this.props.startingPosition,
        kafkaSecret: this.secret,
        kafkaTopic: this.topic,
      }),
    );

    this.secret.grantRead(target);

    target.addToRolePolicy(new iam.PolicyStatement(
      {
        actions: ['kafka:DescribeCluster', 'kafka:GetBootstrapBrokers', 'kafka:ListScramSecrets'],
        resources: [this.clusterArn],
      },
    ));

    target.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaMSKExecutionRole'));
  }
}

/**
 * Use a self hosted Kafka installation as a streaming source for AWS Lambda.
 */
export class SelfManagedKafkaEventSource extends StreamEventSource {
  /**
   * Create an event source for a self managed Kafka cluster
   * @param bootstrapServers - list of Kafka brokers
   * @param topic - the Kafka topic to subscribe to
   * @param secret - the secret with the Kafka credentials, see https://docs.aws.amazon.com/lambda/latest/dg/smaa-permissions.html#smaa-permissions-add-secret
   * @param props
   */
  constructor(
    readonly bootstrapServers: string[],
    readonly topic: string,
    readonly secret: secretsmanager.ISecret,
    props: KafkaEventSourceProps) {
    super(props);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.topic}`,
      this.enrichMappingOptions({
        kafkaBootstrapServers: this.bootstrapServers,
        kafkaTopic: this.topic,
        startingPosition: this.props.startingPosition,
        kafkaSecret: this.secret,
      }),
    );
    this.secret.grantRead(target);
  }
}
