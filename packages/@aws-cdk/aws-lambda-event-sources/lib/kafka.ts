import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface KafkaEventSourceProps extends StreamEventSourceProps {
}

export class ManagedKafkaEventSource extends StreamEventSource {
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
        kafkaSecretArn: this.secret.secretArn,
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

export class SelfManagedKafkaEventSource extends StreamEventSource {
  constructor(
    readonly bootstrapServers: string[],
    readonly kafkaTopic: string,
    readonly secret: secretsmanager.ISecret,
    props: KafkaEventSourceProps) {
    super(props);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.kafkaTopic}`,
      this.enrichMappingOptions({
        kafkaBootstrapServers: this.bootstrapServers,
        kafkaTopic: this.kafkaTopic,
        startingPosition: this.props.startingPosition,
        kafkaSecretArn: this.secret.secretArn,
      }),
    );
    this.secret.grantRead(target);
  }
}
