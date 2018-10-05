import { cloudformation as applicationautoscaling } from '@aws-cdk/aws-applicationautoscaling';
import { Role } from '@aws-cdk/aws-iam';
import { Construct, PolicyStatement, PolicyStatementEffect, ServicePrincipal } from '@aws-cdk/cdk';
import { cloudformation as dynamodb } from './dynamodb.generated';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';

export interface Attribute {
  /**
   * The name of an attribute.
   */
  name: string;

  /**
   * The data type of an attribute.
   */
  type: AttributeType;
}

export interface TableProps {
  /**
   * The read capacity for the table. Careful if you add Global Secondary Indexes, as
   * those will share the table's provisioned throughput.
   * @default 5
   */
  readCapacity?: number;
  /**
   * The write capacity for the table. Careful if you add Global Secondary Indexes, as
   * those will share the table's provisioned throughput.
   * @default 5
   */
  writeCapacity?: number;

  /**
   * Enforces a particular physical table name.
   * @default <generated>
   */
  tableName?: string;

  /**
   * Whether point-in-time recovery is enabled.
   * @default undefined, point-in-time recovery is disabled
   */
  pitrEnabled?: boolean;

  /**
   * Whether server-side encryption is enabled.
   * @default undefined, server-side encryption is disabled
   */
  sseEnabled?: boolean;

  /**
   * When an item in the table is modified, StreamViewType determines what information
   * is written to the stream for this table. Valid values for StreamViewType are:
   * @default undefined, streams are disabled
   */
  streamSpecification?: StreamViewType;

  /**
   * The name of TTL attribute.
   * @default undefined, TTL is disabled
   */
  ttlAttributeName?: string;

  /**
   * AutoScalingProps configuration to configure Read AutoScaling for the DynamoDB table.
   * This field is optional and this can be achieved via addReadAutoScaling.
   * @default undefined, read auto scaling is disabled
   */
  readAutoScaling?: AutoScalingProps;

  /**
   * AutoScalingProps configuration to configure Write AutoScaling for the DynamoDB table.
   * This field is optional and this can be achieved via addWriteAutoScaling.
   * @default undefined, write auto scaling is disabled
   */
  writeAutoScaling?: AutoScalingProps;
}

export interface SecondaryIndexProps {
  /**
   * The name of the secondary index.
   */
  indexName: string;

  /**
   * The set of attributes that are projected into the secondary index.
   * @default ALL
   */
  projectionType?: ProjectionType;

  /**
   * The non-key attributes that are projected into the secondary index.
   * @default undefined
   */
  nonKeyAttributes?: string[];
}

export interface GlobalSecondaryIndexProps extends SecondaryIndexProps {
  /**
   * The attribute of a partition key for the global secondary index.
   */
  partitionKey: Attribute;

  /**
   * The attribute of a sort key for the global secondary index.
   * @default undefined
   */
  sortKey?: Attribute;

  /**
   * The read capacity for the global secondary index.
   * @default 5
   */
  readCapacity?: number;

  /**
   * The write capacity for the global secondary index.
   * @default 5
   */
  writeCapacity?: number;
}

export interface LocalSecondaryIndexProps extends SecondaryIndexProps {
  /**
   * The attribute of a sort key for the local secondary index.
   */
  sortKey: Attribute;
}

/* tslint:disable:max-line-length */
export interface AutoScalingProps {
  /**
   * The minimum value that Application Auto Scaling can use to scale a target during a scaling activity.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-mincapacity
   */
  minCapacity: number;
  /**
   * The maximum value that Application Auto Scaling can use to scale a target during a scaling activity.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-maxcapacity
   */
  maxCapacity: number;
  /**
   * Application Auto Scaling ensures that the ratio of consumed capacity to provisioned capacity stays at or near this value. You define TargetValue as a percentage.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-targetvalue
   */
  targetValue: number;
  /**
   * The amount of time, in seconds, after a scale in activity completes before another scale in activity can start.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleincooldown
   */
  scaleInCooldown: number;
  /**
   * The amount of time, in seconds, after a scale out activity completes before another scale out activity can start.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleoutcooldown
   */
  scaleOutCooldown: number;
  /**
   * A name for the scaling policy.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policyname
   * @default {TableName}[ReadCapacity|WriteCapacity]ScalingPolicy
   */
  scalingPolicyName?: string;
}
/* tslint:enable:max-line-length */

/**
 * Provides a DynamoDB table.
 */
export class Table extends Construct {
  public readonly tableArn: string;
  public readonly tableName: string;
  public readonly tableStreamArn: string;

  private readonly table: dynamodb.TableResource;

  private readonly keySchema = new Array<dynamodb.TableResource.KeySchemaProperty>();
  private readonly attributeDefinitions = new Array<dynamodb.TableResource.AttributeDefinitionProperty>();
  private readonly globalSecondaryIndexes = new Array<dynamodb.TableResource.GlobalSecondaryIndexProperty>();
  private readonly localSecondaryIndexes = new Array<dynamodb.TableResource.LocalSecondaryIndexProperty>();

  private readonly secondaryIndexNames: string[] = [];
  private readonly nonKeyAttributes: string[] = [];

  private tablePartitionKey: Attribute | undefined = undefined;
  private tableSortKey: Attribute | undefined = undefined;

  private readScalingPolicyResource?: applicationautoscaling.ScalingPolicyResource;
  private writeScalingPolicyResource?: applicationautoscaling.ScalingPolicyResource;

  constructor(parent: Construct, name: string, props: TableProps = {}) {
    super(parent, name);

    this.table = new dynamodb.TableResource(this, 'Resource', {
      tableName: props.tableName,
      keySchema: this.keySchema,
      attributeDefinitions: this.attributeDefinitions,
      globalSecondaryIndexes: this.globalSecondaryIndexes,
      localSecondaryIndexes: this.localSecondaryIndexes,
      pointInTimeRecoverySpecification: props.pitrEnabled ? { pointInTimeRecoveryEnabled: props.pitrEnabled } : undefined,
      provisionedThroughput: { readCapacityUnits: props.readCapacity || 5, writeCapacityUnits: props.writeCapacity || 5 },
      sseSpecification: props.sseEnabled ? { sseEnabled: props.sseEnabled } : undefined,
      streamSpecification: props.streamSpecification ? { streamViewType: props.streamSpecification } : undefined,
      timeToLiveSpecification: props.ttlAttributeName ? { attributeName: props.ttlAttributeName, enabled: true } : undefined
    });

    if (props.tableName) { this.addMetadata('aws:cdk:hasPhysicalName', props.tableName); }

    this.tableArn = this.table.tableArn;
    this.tableName = this.table.tableName;
    this.tableStreamArn = this.table.tableStreamArn;

    if (props.readAutoScaling) {
      this.addReadAutoScaling(props.readAutoScaling);
    }

    if (props.writeAutoScaling) {
      this.addWriteAutoScaling(props.writeAutoScaling);
    }
  }

  /**
   * Add a partition key of table.
   *
   * @param attribute the partition key attribute of table
   * @returns a reference to this object so that method calls can be chained together
   */
  public addPartitionKey(attribute: Attribute): this {
    this.addKey(attribute, HASH_KEY_TYPE);
    this.tablePartitionKey = attribute;
    return this;
  }

  /**
   * Add a sort key of table.
   *
   * @param attribute the sort key of table
   * @returns a reference to this object so that method calls can be chained together
   */
  public addSortKey(attribute: Attribute): this {
    this.addKey(attribute, RANGE_KEY_TYPE);
    this.tableSortKey = attribute;
    return this;
  }

  /**
   * Add a global secondary index of table.
   *
   * @param props the property of global secondary index
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexProps) {
    if (this.globalSecondaryIndexes.length === 5) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of global secondary index per table is 5');
    }

    this.validateIndexName(props.indexName);

    // build key schema and projection for index
    const gsiKeySchema = this.buildIndexKeySchema(props.partitionKey, props.sortKey);
    const gsiProjection = this.buildIndexProjection(props);

    this.secondaryIndexNames.push(props.indexName);
    this.globalSecondaryIndexes.push({
      indexName: props.indexName,
      keySchema: gsiKeySchema,
      projection: gsiProjection,
      provisionedThroughput: { readCapacityUnits: props.readCapacity || 5, writeCapacityUnits: props.writeCapacity || 5 }
    });
  }

  /**
   * Add a local secondary index of table.
   *
   * @param props the property of local secondary index
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexProps) {
    if (this.localSecondaryIndexes.length === 5) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of local secondary index per table is 5');
    }

    if (!this.tablePartitionKey) {
      throw new Error('a partition key of the table must be specified first through addPartitionKey()');
    }

    this.validateIndexName(props.indexName);

    // build key schema and projection for index
    const lsiKeySchema = this.buildIndexKeySchema(this.tablePartitionKey, props.sortKey);
    const lsiProjection = this.buildIndexProjection(props);

    this.secondaryIndexNames.push(props.indexName);
    this.localSecondaryIndexes.push({
      indexName: props.indexName,
      keySchema: lsiKeySchema,
      projection: lsiProjection
    });
  }

  public addReadAutoScaling(props: AutoScalingProps) {
    this.readScalingPolicyResource = this.buildAutoScaling(this.readScalingPolicyResource, 'Read', props);
  }

  public addWriteAutoScaling(props: AutoScalingProps) {
    this.writeScalingPolicyResource = this.buildAutoScaling(this.writeScalingPolicyResource, 'Write', props);
  }

  /**
   * Validate the table construct.
   *
   * @returns an array of validation error message
   */
  public validate(): string[] {
    const errors = new Array<string>();

    if (!this.tablePartitionKey) {
      errors.push('a partition key must be specified');
    }
    if (this.localSecondaryIndexes.length > 0 && !this.tableSortKey) {
      errors.push('a sort key of the table must be specified to add local secondary indexes');
    }

    return errors;
  }

  /**
   * Validate index name to check if a duplicate name already exists.
   *
   * @param indexName a name of global or local secondary index
   */
  private validateIndexName(indexName: string) {
    if (this.secondaryIndexNames.includes(indexName)) {
      // a duplicate index name causes validation exception, status code 400, while trying to create CFN stack
      throw new Error(`a duplicate index name, ${indexName}, is not allowed`);
    }
    this.secondaryIndexNames.push(indexName);
  }

  /**
   * Validate non-key attributes by checking limits within secondary index, which may vary in future.
   *
   * @param nonKeyAttributes a list of non-key attribute names
   */
  private validateNonKeyAttributes(nonKeyAttributes: string[]) {
    if (this.nonKeyAttributes.length + nonKeyAttributes.length > 20) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of nonKeyAttributes across all of secondary indexes is 20');
    }

    // store all non-key attributes
    this.nonKeyAttributes.push(...nonKeyAttributes);

    // throw error if key attribute is part of non-key attributes
    this.attributeDefinitions.forEach(keyAttribute => {
      if (typeof keyAttribute.attributeName === 'string' && this.nonKeyAttributes.includes(keyAttribute.attributeName)) {
        throw new Error(`a key attribute, ${keyAttribute.attributeName}, is part of a list of non-key attributes, ${this.nonKeyAttributes}` +
          ', which is not allowed since all key attributes are added automatically and this configuration causes stack creation failure');
      }
    });
  }

  private validateAutoScalingProps(props: AutoScalingProps) {
    if (props.targetValue < 10 || props.targetValue > 90) {
      throw new RangeError("scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization/"
        + "DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: " + props.targetValue);
    }
    if (props.scaleInCooldown < 0) {
      throw new RangeError("scaleInCooldown must be greater than or equal to 0; Provided value is: " + props.scaleInCooldown);
    }
    if (props.scaleOutCooldown < 0) {
      throw new RangeError("scaleOutCooldown must be greater than or equal to 0; Provided value is: " + props.scaleOutCooldown);
    }
    if (props.maxCapacity < 0) {
      throw new RangeError("maximumCapacity must be greater than or equal to 0; Provided value is: " + props.maxCapacity);
    }
    if (props.minCapacity < 0) {
      throw new RangeError("minimumCapacity must be greater than or equal to 0; Provided value is: " + props.minCapacity);
    }
  }

  private buildIndexKeySchema(partitionKey: Attribute, sortKey?: Attribute): dynamodb.TableResource.KeySchemaProperty[] {
    this.registerAttribute(partitionKey);
    const indexKeySchema: dynamodb.TableResource.KeySchemaProperty[] = [
      { attributeName: partitionKey.name, keyType: HASH_KEY_TYPE }
    ];

    if (sortKey) {
      this.registerAttribute(sortKey);
      indexKeySchema.push({ attributeName: sortKey.name, keyType: RANGE_KEY_TYPE });
    }

    return indexKeySchema;
  }

  private buildIndexProjection(props: SecondaryIndexProps): dynamodb.TableResource.ProjectionProperty {
    if (props.projectionType === ProjectionType.Include && !props.nonKeyAttributes) {
      // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html
      throw new Error(`non-key attributes should be specified when using ${ProjectionType.Include} projection type`);
    }

    if (props.projectionType !== ProjectionType.Include && props.nonKeyAttributes) {
      // this combination causes validation exception, status code 400, while trying to create CFN stack
      throw new Error(`non-key attributes should not be specified when not using ${ProjectionType.Include} projection type`);
    }

    if (props.nonKeyAttributes) {
      this.validateNonKeyAttributes(props.nonKeyAttributes);
    }

    return {
      projectionType: props.projectionType ? props.projectionType : ProjectionType.All,
      nonKeyAttributes: props.nonKeyAttributes ? props.nonKeyAttributes : undefined
    };
  }

  private buildAutoScaling(scalingPolicyResource: applicationautoscaling.ScalingPolicyResource | undefined,
                           scalingType: string,
                           props: AutoScalingProps) {
    if (scalingPolicyResource) {
      throw new Error(`${scalingType} Auto Scaling already defined for Table`);
    }

    this.validateAutoScalingProps(props);
    const autoScalingRole = this.buildAutoScalingRole(`${scalingType}AutoScalingRole`);

    const scalableTargetResource = new applicationautoscaling.ScalableTargetResource(
      this, `${scalingType}CapacityScalableTarget`, this.buildScalableTargetResourceProps(
        `dynamodb:table:${scalingType}CapacityUnits`, autoScalingRole, props));

    return new applicationautoscaling.ScalingPolicyResource(
      this, `${scalingType}CapacityScalingPolicy`,
      this.buildScalingPolicyResourceProps(`DynamoDB${scalingType}CapacityUtilization`, `${scalingType}Capacity`,
      scalableTargetResource, props));
  }

  private buildAutoScalingRole(roleResourceName: string) {
    const autoScalingRole = new Role(this, roleResourceName, {
      assumedBy: new ServicePrincipal('application-autoscaling.amazonaws.com')
    });
    autoScalingRole.addToPolicy(new PolicyStatement(PolicyStatementEffect.Allow)
      .addActions("dynamodb:DescribeTable", "dynamodb:UpdateTable")
      .addResource(this.tableArn));
    autoScalingRole.addToPolicy(new PolicyStatement(PolicyStatementEffect.Allow)
      .addActions("cloudwatch:PutMetricAlarm", "cloudwatch:DescribeAlarms", "cloudwatch:GetMetricStatistics",
        "cloudwatch:SetAlarmState", "cloudwatch:DeleteAlarms")
      .addAllResources());
    return autoScalingRole;
  }

  private buildScalableTargetResourceProps(scalableDimension: string,
                                           scalingRole: Role,
                                           props: AutoScalingProps) {
    return {
      maxCapacity: props.maxCapacity,
      minCapacity: props.minCapacity,
      resourceId: `table/${this.tableName}`,
      roleArn: scalingRole.roleArn,
      scalableDimension,
      serviceNamespace: 'dynamodb'
    };
  }

  private buildScalingPolicyResourceProps(predefinedMetricType: string,
                                          scalingParameter: string,
                                          scalableTargetResource: applicationautoscaling.ScalableTargetResource,
                                          props: AutoScalingProps) {
    const scalingPolicyName = props.scalingPolicyName || `${this.tableName}${scalingParameter}ScalingPolicy`;
    return {
      policyName: scalingPolicyName,
      policyType: 'TargetTrackingScaling',
      scalingTargetId: scalableTargetResource.ref,
      targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
          predefinedMetricType
        },
        scaleInCooldown: props.scaleInCooldown,
        scaleOutCooldown: props.scaleOutCooldown,
        targetValue: props.targetValue
      }
    };
  }

  private findKey(keyType: string) {
    return this.keySchema.find(prop => prop.keyType === keyType);
  }

  private addKey(attribute: Attribute, keyType: string) {
    const existingProp = this.findKey(keyType);
    if (existingProp) {
      throw new Error(`Unable to set ${attribute.name} as a ${keyType} key, because ${existingProp.attributeName} is a ${keyType} key`);
    }
    this.registerAttribute(attribute);
    this.keySchema.push({
      attributeName: attribute.name,
      keyType
    });
    return this;
  }

  /**
   * Register the key attribute of table or secondary index to assemble attribute definitions of TableResourceProps.
   *
   * @param attribute the key attribute of table or secondary index
   */
  private registerAttribute(attribute: Attribute) {
    const name = attribute.name;
    const type = attribute.type;
    const existingDef = this.attributeDefinitions.find(def => def.attributeName === name);
    if (existingDef && existingDef.attributeType !== type) {
      throw new Error(`Unable to specify ${name} as ${type} because it was already defined as ${existingDef.attributeType}`);
    }
    if (!existingDef) {
      this.attributeDefinitions.push({
        attributeName: name,
        attributeType: type
      });
    }
  }
}

export enum AttributeType {
  Binary = 'B',
  Number = 'N',
  String = 'S',
}

export enum ProjectionType {
  KeysOnly = 'KEYS_ONLY',
  Include = 'INCLUDE',
  All = 'ALL'
}

/**
 * When an item in the table is modified, StreamViewType determines what information
 * is written to the stream for this table. Valid values for StreamViewType are:
 * @link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html
 * @enum {string}
 */
export enum StreamViewType {
  /** The entire item, as it appears after it was modified, is written to the stream. */
  NewImage = 'NEW_IMAGE',
  /** The entire item, as it appeared before it was modified, is written to the stream. */
  OldImage = 'OLD_IMAGE',
  /** Both the new and the old item images of the item are written to the stream. */
  NewAndOldImages = 'NEW_AND_OLD_IMAGES',
  /** Only the key attributes of the modified item are written to the stream. */
  KeysOnly = 'KEYS_ONLY'
}
