import * as crypto from 'crypto';
import { ISecurityGroup, IVpc, SubnetSelection } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Stack, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StreamEventSource, BaseStreamEventSourceProps } from './stream';

/**
 * Properties for a Kafka event source
 */
export interface KafkaEventSourceProps extends BaseStreamEventSourceProps {
  /**
   * The Kafka topic to subscribe to
   */
  readonly topic: string,
  /**
   * The secret with the Kafka credentials, see https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html for details
   * This field is required if your Kafka brokers are accessed over the Internet
   *
   * @default none
   */
  readonly secret?: secretsmanager.ISecret
  /**
   * The identifier for the Kafka consumer group to join. The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value.  The value must have a lenght between 1 and 200 and full the pattern '[a-zA-Z0-9-\/*:_+=.@-]*'.
   * @see https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-consumer-group-id
   *
   * @default - none
   */
  readonly consumerGroupId?: string;
}

/**
 * Properties for a MSK event source
 */
export interface ManagedKafkaEventSourceProps extends KafkaEventSourceProps {
  /**
   * An MSK cluster construct
   */
  readonly clusterArn: string;
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
  /**
   * BASIC_AUTH (SASL/PLAIN) authentication method for your Kafka cluster
   */
  BASIC_AUTH = 'BASIC_AUTH',
  /**
   * CLIENT_CERTIFICATE_TLS_AUTH (mTLS) authentication method for your Kafka cluster
   */
  CLIENT_CERTIFICATE_TLS_AUTH = 'CLIENT_CERTIFICATE_TLS_AUTH',
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

  /**
   * The secret with the root CA certificate used by your Kafka brokers for TLS encryption
   * This field is required if your Kafka brokers use certificates signed by a private CA
   *
   * @default - none
   */
  readonly rootCACertificate?: secretsmanager.ISecret;
}

/**
 * Use a MSK cluster as a streaming source for AWS Lambda
 */
export class ManagedKafkaEventSource extends StreamEventSource {
  // This is to work around JSII inheritance problems
  private innerProps: ManagedKafkaEventSourceProps;
  private _eventSourceMappingId?: string = undefined;

  constructor(props: ManagedKafkaEventSourceProps) {
    super(props);
    this.innerProps = props;
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(
      `KafkaEventSource:${Names.nodeUniqueId(target.node)}${this.innerProps.topic}`,
      this.enrichMappingOptions({
        eventSourceArn: this.innerProps.clusterArn,
        startingPosition: this.innerProps.startingPosition,
        sourceAccessConfigurations: this.sourceAccessConfigurations(),
        kafkaTopic: this.innerProps.topic,
        kafkaConsumerGroupId: this.innerProps.consumerGroupId,
      }),
    );

    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    if (this.innerProps.secret !== undefined) {
      this.innerProps.secret.grantRead(target);
    }

    target.addToRolePolicy(new iam.PolicyStatement(
      {
        actions: ['kafka:DescribeCluster', 'kafka:GetBootstrapBrokers', 'kafka:ListScramSecrets'],
        resources: [this.innerProps.clusterArn],
      },
    ));

    target.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaMSKExecutionRole'));
  }

  private sourceAccessConfigurations() {
    const sourceAccessConfigurations = [];
    if (this.innerProps.secret !== undefined) {
      // "Amazon MSK only supports SCRAM-SHA-512 authentication." from https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html#msk-password-limitations
      sourceAccessConfigurations.push({
        type: lambda.SourceAccessConfigurationType.SASL_SCRAM_512_AUTH,
        uri: this.innerProps.secret.secretArn,
      });
    }

    return sourceAccessConfigurations.length === 0
      ? undefined
      : sourceAccessConfigurations;
  }

  /**
  * The identifier for this EventSourceMapping
  */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new Error('KafkaEventSource is not yet bound to an event source mapping');
    }
    return this._eventSourceMappingId;
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
    } else if (!props.secret) {
      throw new Error('secret must be set if Kafka brokers accessed over Internet');
    }
    this.innerProps = props;
  }

  public bind(target: lambda.IFunction) {
    if (!(target instanceof Construct)) { throw new Error('Function is not a construct. Unexpected error.'); }
    target.addEventSourceMapping(
      this.mappingId(target),
      this.enrichMappingOptions({
        kafkaBootstrapServers: this.innerProps.bootstrapServers,
        kafkaTopic: this.innerProps.topic,
        kafkaConsumerGroupId: this.innerProps.consumerGroupId,
        startingPosition: this.innerProps.startingPosition,
        sourceAccessConfigurations: this.sourceAccessConfigurations(),
      }),
    );

    if (this.innerProps.secret !== undefined) {
      this.innerProps.secret.grantRead(target);
    }
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
      case AuthenticationMethod.BASIC_AUTH:
        authType = lambda.SourceAccessConfigurationType.BASIC_AUTH;
        break;
      case AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH:
        authType = lambda.SourceAccessConfigurationType.CLIENT_CERTIFICATE_TLS_AUTH;
        break;
      case AuthenticationMethod.SASL_SCRAM_256_AUTH:
        authType = lambda.SourceAccessConfigurationType.SASL_SCRAM_256_AUTH;
        break;
      case AuthenticationMethod.SASL_SCRAM_512_AUTH:
      default:
        authType = lambda.SourceAccessConfigurationType.SASL_SCRAM_512_AUTH;
        break;
    }

    const sourceAccessConfigurations = [];
    if (this.innerProps.secret !== undefined) {
      sourceAccessConfigurations.push({ type: authType, uri: this.innerProps.secret.secretArn });
    }

    if (this.innerProps.rootCACertificate !== undefined) {
      sourceAccessConfigurations.push({
        type: lambda.SourceAccessConfigurationType.SERVER_ROOT_CA_CERTIFICATE,
        uri: this.innerProps.rootCACertificate.secretArn,
      });
    }

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

    return sourceAccessConfigurations.length === 0
      ? undefined
      : sourceAccessConfigurations;
  }
}
