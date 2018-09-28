import { cloudformation as applicationautoscaling } from '@aws-cdk/aws-applicationautoscaling';
import { Role } from '@aws-cdk/aws-iam';
import { Construct, PolicyStatement, PolicyStatementEffect, ServicePrincipal } from '@aws-cdk/cdk';
import { cloudformation as dynamodb } from './dynamodb.generated';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';

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

  private readScalingPolicyResource?: applicationautoscaling.ScalingPolicyResource;
  private writeScalingPolicyResource?: applicationautoscaling.ScalingPolicyResource;

  constructor(parent: Construct, name: string, props: TableProps = {}) {
    super(parent, name);

    const readCapacityUnits = props.readCapacity || 5;
    const writeCapacityUnits = props.writeCapacity || 5;

    this.table = new dynamodb.TableResource(this, 'Resource', {
      tableName: props.tableName,
      keySchema: this.keySchema,
      attributeDefinitions: this.attributeDefinitions,
      pointInTimeRecoverySpecification: props.pitrEnabled ? { pointInTimeRecoveryEnabled: props.pitrEnabled } : undefined,
      provisionedThroughput: { readCapacityUnits, writeCapacityUnits },
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

  public addPartitionKey(attribute: Attribute): this {
    this.addKey(attribute.name, attribute.type, HASH_KEY_TYPE);
    return this;
  }

  public addSortKey(attribute: Attribute): this {
    this.addKey(attribute.name, attribute.type, RANGE_KEY_TYPE);
    return this;
  }

  public addReadAutoScaling(props: AutoScalingProps) {
    this.readScalingPolicyResource = this.buildAutoScaling(this.readScalingPolicyResource, 'Read', props);
  }

  public addWriteAutoScaling(props: AutoScalingProps) {
    this.writeScalingPolicyResource = this.buildAutoScaling(this.writeScalingPolicyResource, 'Write', props);
  }

  public validate(): string[] {
    const errors = new Array<string>();
    if (!this.findKey(HASH_KEY_TYPE)) {
      errors.push('a partition key must be specified');
    }
    return errors;
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

  private addKey(name: string, type: AttributeType, keyType: string) {
    const existingProp = this.findKey(keyType);
    if (existingProp) {
      throw new Error(`Unable to set ${name} as a ${keyType} key, because ${existingProp.attributeName} is a ${keyType} key`);
    }
    this.registerAttribute(name, type);
    this.keySchema.push({
      attributeName: name,
      keyType
    });
    return this;
  }

  private registerAttribute(name: string, type: AttributeType) {
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
