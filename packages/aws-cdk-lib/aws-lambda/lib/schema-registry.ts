import { IEventSourceMapping } from './event-source-mapping';
import { IFunction } from './function-base';

/**
 * The format target function should recieve record in.
 */
export class EventRecordFormat {
  /**
   * The target function will recieve records as json objects.
   */
  public static readonly JSON = new EventRecordFormat('JSON');

  /**
   * The target function will recieve records in same format as the schema source.
   */
  public static readonly SOURCE = new EventRecordFormat('SOURCE');

  /** A custom event record format */
  public static of(name: string): EventRecordFormat {
    return new EventRecordFormat(name);
  }

  /**
   * The enum to use in `SchemaRegistryConfig.EventRecordFormat` property in CloudFormation
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

/**
 * The type of authentication protocol for your schema registry.
 */
export class KafkaSchemaRegistryAccessConfigType {
  /**
   * The Secrets Manager secret that stores your broker credentials.
   */
  public static readonly BASIC_AUTH = new KafkaSchemaRegistryAccessConfigType('BASIC_AUTH');

  /**
   * The Secrets Manager ARN of your secret key containing the certificate chain (X.509 PEM), private key (PKCS#8 PEM),
   * and private key password (optional) used for mutual TLS authentication of your schema registry.
   */
  public static readonly CLIENT_CERTIFICATE_TLS_AUTH = new KafkaSchemaRegistryAccessConfigType('CLIENT_CERTIFICATE_TLS_AUTH');

  /**
   * The Secrets Manager ARN of your secret key containing the root CA certificate (X.509 PEM) used for TLS encryption of your schema registry.
   */
  public static readonly SERVER_ROOT_CA_CERTIFICATE = new KafkaSchemaRegistryAccessConfigType('SERVER_ROOT_CA_CERTIFICATE');

  /** A custom source access configuration property for schema registry */
  public static of(name: string): KafkaSchemaRegistryAccessConfigType {
    return new KafkaSchemaRegistryAccessConfigType(name);
  }

  /**
   * The key to use in `SchemaRegistryConfig.AccessConfig.Type` property in CloudFormation
   */
  public readonly type: string;

  private constructor(type: string) {
    this.type = type;
  }
}

/**
 * Specific access configuration settings that tell Lambda how to authenticate with your schema registry.
 *
 * If you're working with an AWS Glue schema registry, don't provide authentication details in this object. Instead, ensure that your execution role has the required permissions for Lambda to access your cluster.
 *
 * If you're working with a Confluent schema registry, choose the authentication method in the Type field, and provide the AWS Secrets Manager secret ARN in the URI field.
 */
export interface KafkaSchemaRegistryAccessConfig {
  /**
   * The type of authentication Lambda uses to access your schema registry.
   */
  readonly type: KafkaSchemaRegistryAccessConfigType;
  /**
   * The URI of the secret (Secrets Manager secret ARN) to authenticate with your schema registry.
   * @see KafkaSchemaRegistryAccessConfigType
   */
  readonly uri: string;
}

/**
 * Specific schema validation configuration settings that tell Lambda the message attributes you want to validate and filter using your schema registry.
 */
export class KafkaSchemaValidationAttribute {
  /**
   * De-serialize the key field of the parload to target function.
   */
  public static readonly KEY = new KafkaSchemaValidationAttribute('KEY');

  /**
   * De-serialize the value field of the parload to target function.
   */
  public static readonly VALUE = new KafkaSchemaValidationAttribute('VALUE');

  /** A custom schema validation attribute property */
  public static of(name: string): KafkaSchemaValidationAttribute {
    return new KafkaSchemaValidationAttribute(name);
  }

  /**
   * The enum to use in `SchemaRegistryConfig.SchemaValidationConfigs.Attribute` property in CloudFormation
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

/**
 * Specific schema validation configuration settings that tell Lambda the message attributes you want to validate and filter using your schema registry.
 */
export interface KafkaSchemaValidationConfig {
  /**
   * The attributes you want your schema registry to validate and filter for. If you selected JSON as the EventRecordFormat, Lambda also deserializes the selected message attributes.
   */
  readonly attribute: KafkaSchemaValidationAttribute;
}

/**
 * (Amazon MSK and self-managed Apache Kafka only) Specific configuration settings for a Kafka schema registry.
 */
export interface KafkaSchemaRegistryConfig {
  /**
   * The URI for your schema registry. The correct URI format depends on the type of schema registry you're using.
   *
   * @default - none
   */
  readonly schemaRegistryUri: string;
  /**
   * The record format that Lambda delivers to your function after schema validation.
   *  - Choose JSON to have Lambda deliver the record to your function as a standard JSON object.
   *  - Choose SOURCE to have Lambda deliver the record to your function in its original source format. Lambda removes all schema metadata, such as the schema ID, before sending the record to your function.
   *
   * @default - none
   */
  readonly eventRecordFormat: EventRecordFormat;
  /**
   * An array of access configuration objects that tell Lambda how to authenticate with your schema registry.
   *
   * @default - none
   */
  readonly accessConfigs?: KafkaSchemaRegistryAccessConfig[];
  /**
   * An array of schema validation configuration objects, which tell Lambda the message attributes you want to validate and filter using your schema registry.
   *
   * @default - none
   */
  readonly schemaValidationConfigs: KafkaSchemaValidationConfig[];
}

/**
 * Properties for schema registry configuration.
 */
export interface SchemaRegistryProps {
  /**
   * The record format that Lambda delivers to your function after schema validation.
   *  - Choose JSON to have Lambda deliver the record to your function as a standard JSON object.
   *  - Choose SOURCE to have Lambda deliver the record to your function in its original source format. Lambda removes all schema metadata, such as the schema ID, before sending the record to your function.
   *
   * @default - none
   */
  readonly eventRecordFormat: EventRecordFormat;

  /**
   * An array of schema validation configuration objects, which tell Lambda the message attributes you want to validate and filter using your schema registry.
   *
   * @default - none
   */
  readonly schemaValidationConfigs: KafkaSchemaValidationConfig[];
}

/**
 * A schema registry for an event source
 */
export interface ISchemaRegistry {
  /**
   * Returns the schema registry config of the event source
   */
  bind(target: IEventSourceMapping, targetHandler: IFunction): KafkaSchemaRegistryConfig;
}
