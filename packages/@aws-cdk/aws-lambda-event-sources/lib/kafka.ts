import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { StreamEventSource, StreamEventSourceProps } from './stream';

/**
 * Properties for a Kafka event source
 */
export interface KafkaEventSourceProps extends StreamEventSourceProps {
  /**
   * the Kafka topic to subscribe to
   */
  readonly topic: string,
  /**
   * the secret with the Kafka credentials, see https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html for details
   */
  readonly secret: secretsmanager.ISecret
}

/**
 * Properties for a MSK event source
 */
export interface ManagedKafkaEventSourceProps extends KafkaEventSourceProps {
  /**
   * the ARN of the MSK cluster
   */
  readonly clusterArn: string
}

/**
 * Properties for a self managed Kafka cluster event source
 */
export interface SelfManagedKafkaEventSourceProps extends KafkaEventSourceProps {
  /**
   * list of Kafka brokers
   */
  readonly bootstrapServers: string[]
}

/**
 * Use a MSK cluster as a streaming source for AWS Lambda
 */
export class ManagedKafkaEventSource extends StreamEventSource<ManagedKafkaEventSourceProps> {

  constructor(props: ManagedKafkaEventSourceProps) {
    super(props);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.props.topic}`,
      this.enrichMappingOptions({
        eventSourceArn: this.props.clusterArn,
        startingPosition: this.props.startingPosition,
        sourceAccessConfigurations: [{ type: 'SASL_SCRAM_512_AUTH', uri: this.props.secret.secretArn }],
        kafkaTopic: this.props.topic,
      }),
    );

    this.props.secret.grantRead(target);

    target.addToRolePolicy(new iam.PolicyStatement(
      {
        actions: ['kafka:DescribeCluster', 'kafka:GetBootstrapBrokers', 'kafka:ListScramSecrets'],
        resources: [this.props.clusterArn],
      },
    ));

    target.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaMSKExecutionRole'));
  }
}

/**
 * Use a self hosted Kafka installation as a streaming source for AWS Lambda.
 */
export class SelfManagedKafkaEventSource extends StreamEventSource<SelfManagedKafkaEventSourceProps> {

  constructor(props: SelfManagedKafkaEventSourceProps) {
    super(props);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.props.topic}`,
      this.enrichMappingOptions({
        selfManagedEventSource: { endpoints: { kafkaBootstrapServers: this.props.bootstrapServers } },
        kafkaTopic: this.props.topic,
        startingPosition: this.props.startingPosition,
        // TODO: make auth type configurable, add vpc config
        sourceAccessConfigurations: [{ type: 'SASL_SCRAM_512_AUTH', uri: this.props.secret.secretArn }],
      }),
    );
    this.props.secret.grantRead(target);
  }
}
