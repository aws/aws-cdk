import * as crypto from 'crypto';
import { ISecurityGroup, IVpc, SubnetSelection } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as msk from '@aws-cdk/aws-msk';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Stack } from '@aws-cdk/core';
import { StreamEventSource, StreamEventSourceProps } from './stream';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
   * an MSK cluster construct
   */
  readonly cluster: msk.ICluster
}

/**
 * The authentication method to use with SelfManagedKafkaEventSource
 */
export enum AuthenticationMethod {
  /**
   * SASL_SCRAM_512_AUTH authentication method for your Kafka cluster
   */
  SASL_SCRAM_512_AUTH = 'SASL_SCRAM_512_AUTH',
  /**
   * SASL_SCRAM_256_AUTH authentication method for your Kafka cluster
   */
  SASL_SCRAM_256_AUTH = 'SASL_SCRAM_256_AUTH',
}

/**
 * Properties for a self managed Kafka cluster event source.
 * If your Kafka cluster is only reachable via VPC make sure to configure it.
 */
export interface SelfManagedKafkaEventSourceProps extends KafkaEventSourceProps {
  /**
   * The list of host and port pairs that are the addresses of the Kafka brokers in a "bootstrap" Kafka cluster that
   * a Kafka client connects to initially to bootstrap itself. They are in the format `abc.xyz.com:xxxx`.
   */
  readonly bootstrapServers: string[]

  /**
   * If your Kafka brokers are only reachable via VPC provide the VPC here
   *
   * @default none
   */
  readonly vpc?: IVpc;

  /**
   * If your Kafka brokers are only reachable via VPC, provide the subnets selection here
   *
   * @default - none, required if setting vpc
   */
  readonly vpcSubnets?: SubnetSelection,

  /**
   * If your Kafka brokers are only reachable via VPC, provide the security group here
   *
   * @default - none, required if setting vpc
   */
  readonly securityGroup?: ISecurityGroup

  /**
   * The authentication method for your Kafka cluster
   *
   * @default AuthenticationMethod.SASL_SCRAM_512_AUTH
   */
  readonly authenticationMethod?: AuthenticationMethod
}

/**
 * Use a MSK cluster as a streaming source for AWS Lambda
 */
export class ManagedKafkaEventSource extends StreamEventSource {
  // This is to work around JSII inheritance problems
  private innerProps: ManagedKafkaEventSourceProps;

  constructor(props: ManagedKafkaEventSourceProps) {
    super(props);
    this.innerProps = props;
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(
      `KafkaEventSource:${this.innerProps.cluster.clusterArn}${this.innerProps.topic}`,
      this.enrichMappingOptions({
        eventSourceArn: this.innerProps.cluster.clusterArn,
        startingPosition: this.innerProps.startingPosition,
        // From https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html#msk-password-limitations, "Amazon MSK only supports SCRAM-SHA-512 authentication."
        sourceAccessConfigurations: [{ type: lambda.SourceAccessConfigurationType.SASL_SCRAM_512_AUTH, uri: this.innerProps.secret.secretArn }],
        kafkaTopic: this.innerProps.topic,
      }),
    );

    this.innerProps.secret.grantRead(target);

    target.addToRolePolicy(new iam.PolicyStatement(
      {
        actions: ['kafka:DescribeCluster', 'kafka:GetBootstrapBrokers', 'kafka:ListScramSecrets'],
        resources: [this.innerProps.cluster.clusterArn],
      },
    ));

    target.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaMSKExecutionRole'));
  }
}

/**
 * Use a self hosted Kafka installation as a streaming source for AWS Lambda.
 */
export class SelfManagedKafkaEventSource extends StreamEventSource {
  // This is to work around JSII inheritance problems
  private innerProps: SelfManagedKafkaEventSourceProps;

  constructor(props: SelfManagedKafkaEventSourceProps) {
    super(props);
    if (props.vpc) {
      if (!props.securityGroup) {
        throw new Error('securityGroup must be set when providing vpc');
      }
      if (!props.vpcSubnets) {
        throw new Error('vpcSubnets must be set when providing vpc');
      }
    }
    this.innerProps = props;
  }

  public bind(target: lambda.IFunction) {
    if (!Construct.isConstruct(target)) { throw new Error('Function is not a construct. Unexpected error.'); }
    target.addEventSourceMapping(
      this.mappingId(target),
      this.enrichMappingOptions({
        kafkaBootstrapServers: this.innerProps.bootstrapServers,
        kafkaTopic: this.innerProps.topic,
        startingPosition: this.innerProps.startingPosition,
        sourceAccessConfigurations: this.sourceAccessConfigurations(),
      }),
    );
    this.innerProps.secret.grantRead(target);
  }

  private mappingId(target: lambda.IFunction) {
    let hash = crypto.createHash('md5');
    hash.update(JSON.stringify(Stack.of(target).resolve(this.innerProps.bootstrapServers)));
    const idHash = hash.digest('hex');
    return `KafkaEventSource:${idHash}:${this.innerProps.topic}`;
  }

  private sourceAccessConfigurations() {
    let authType;
    switch (this.innerProps.authenticationMethod) {
      case AuthenticationMethod.SASL_SCRAM_256_AUTH:
        authType = lambda.SourceAccessConfigurationType.SASL_SCRAM_256_AUTH;
        break;
      case AuthenticationMethod.SASL_SCRAM_512_AUTH:
      default:
        authType = lambda.SourceAccessConfigurationType.SASL_SCRAM_512_AUTH;
        break;
    }
    let sourceAccessConfigurations = [{ type: authType, uri: this.innerProps.secret.secretArn }];
    if (this.innerProps.vpcSubnets !== undefined && this.innerProps.securityGroup !== undefined) {
      sourceAccessConfigurations.push({
        type: lambda.SourceAccessConfigurationType.VPC_SECURITY_GROUP,
        uri: this.innerProps.securityGroup.securityGroupId,
      },
      );
      this.innerProps.vpc?.selectSubnets(this.innerProps.vpcSubnets).subnetIds.forEach((id) => {
        sourceAccessConfigurations.push({ type: lambda.SourceAccessConfigurationType.VPC_SUBNET, uri: id });
      });
    }
    return sourceAccessConfigurations;
  }
}
