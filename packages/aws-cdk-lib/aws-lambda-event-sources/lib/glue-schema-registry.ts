import { CfnRegistry } from '../../aws-glue';
import * as iam from '../../aws-iam';
import { IEventSourceMapping, IFunction } from '../../aws-lambda/lib';
import { ISchemaRegistry, KafkaSchemaRegistryConfig, SchemaRegistryProps } from '../../aws-lambda/lib/schema-registry';
import { Fn, ValidationError } from '../../core';

const GLUE_SCHEMA_REGISTRY_ARN_REGEX = /^arn:[^:]+:glue:[^:]+:[^:]+:registry\/([^\/]+)$/;

/**
 * Properties for glue schema registry configuration.
 */
export interface GlueSchemaRegistryProps extends SchemaRegistryProps {
  /**
   * The CfnRegistry reference of your glue schema registry. If used, schemaRegistryArn will be ignored.
   *
   * @default - none
   */
  readonly schemaRegistry?: CfnRegistry;
  /**
   * The Arn of your glue schema registry.
   *
   * @default - none
   */
  readonly schemaRegistryArn?: string;
}

/**
 * Glue schema registry configuration for a Lambda event source.
 */
export class GlueSchemaRegistry implements ISchemaRegistry {
  constructor(private readonly props: GlueSchemaRegistryProps) {
  }

  /**
   * Returns a schema registry configuration.
   */
  public bind(_target: IEventSourceMapping, targetHandler: IFunction): KafkaSchemaRegistryConfig {
    const registryProps = this.getRegistryProps(this.props, _target);
    this.getSchemaRegistryPolicies(
      registryProps.arn,
      registryProps.name,
    ).forEach(i => targetHandler.addToRolePolicy(i));

    return {
      schemaRegistryUri: registryProps.arn,
      eventRecordFormat: this.props.eventRecordFormat,
      schemaValidationConfigs: this.props.schemaValidationConfigs,
    };
  }

  private getRegistryProps(props: GlueSchemaRegistryProps, _target: IEventSourceMapping) {
    if (props.schemaRegistry) {
      return {
        arn: props.schemaRegistry.attrArn,
        name: props.schemaRegistry.name,
      };
    }
    if (props.schemaRegistryArn) {
      const glueRegistryMatch = props.schemaRegistryArn?.match(GLUE_SCHEMA_REGISTRY_ARN_REGEX);
      if (!glueRegistryMatch) {
        throw new ValidationError(`schemaRegistryArn ${this.props.schemaRegistryArn} must match ${GLUE_SCHEMA_REGISTRY_ARN_REGEX}`, _target);
      }
      return {
        arn: props.schemaRegistryArn,
        name: glueRegistryMatch[1],
      };
    }
    throw new ValidationError('one of schemaRegistryArn or schemaRegistry must be passed', _target);
  }

  private getSchemaRegistryPolicies(glueRegistryArn: string, glueRegistryName: string) {
    return [
      new iam.PolicyStatement(
        {
          actions: ['glue:GetRegistry'],
          resources: [glueRegistryArn],
        },
      ),
      new iam.PolicyStatement(
        {
          actions: ['glue:GetSchemaVersion'],
          resources: [
            glueRegistryArn,
            Fn.sub('arn:${AWS::Partition}:glue:${AWS::Region}:${AWS::AccountId}:schema/${registryName}/*', {
              registryName: glueRegistryName,
            }),
          ],
        },
      ),
    ];
  }
}
