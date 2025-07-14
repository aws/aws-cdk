import { IEventSourceMapping, IFunction } from '../../aws-lambda/lib';
import { ISchemaRegistry, KafkaSchemaRegistryAccessConfigType, KafkaSchemaRegistryConfig, SchemaRegistryProps } from '../../aws-lambda/lib/schema-registry';
import { ISecret } from '../../aws-secretsmanager';

/**
 * Properties for confluent schema registry configuration.
 */
export interface ConfluentSchemaRegistryProps extends SchemaRegistryProps {
  /**
   * The URI for your schema registry.
   *
   * @default - none
   */
  readonly schemaRegistryUri: string;

  /**
   * The type of authentication for schema registry credentials.
   * @default none
   */
  readonly authenticationType: KafkaSchemaRegistryAccessConfigType;

  /**
   * The secret with the schema registry credentials.
   * @default none
   */
  readonly secret: ISecret;
}

/**
 * Confluent schema registry configuration for a Lambda event source.
 */
export class ConfluentSchemaRegistry implements ISchemaRegistry {
  constructor(private readonly props: ConfluentSchemaRegistryProps) {
  }

  /**
   * Returns a schema registry configuration.
   */
  public bind(_target: IEventSourceMapping, targetHandler: IFunction): KafkaSchemaRegistryConfig {
    this.props.secret.grantRead(targetHandler);

    return {
      schemaRegistryUri: this.props.schemaRegistryUri,
      eventRecordFormat: this.props.eventRecordFormat,
      accessConfigs: [{
        type: this.props.authenticationType,
        uri: this.props.secret.secretArn,
      }],
      schemaValidationConfigs: this.props.schemaValidationConfigs,
    };
  }
}
