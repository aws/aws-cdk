// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-11T07:33:37.897Z","fingerprint":"iwhAS+zMu7wJe9wneVjtPgStXrpVF/GAaJIbcyVEr08="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnScalableTarget`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html
 */
export interface CfnScalableTargetProps {

    /**
     * The maximum value that you plan to scale out to. When a scaling policy is in effect, Application Auto Scaling can scale out (expand) as needed to the maximum capacity limit in response to changing demand.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-maxcapacity
     */
    readonly maxCapacity: number;

    /**
     * The minimum value that you plan to scale in to. When a scaling policy is in effect, Application Auto Scaling can scale in (contract) as needed to the minimum capacity limit in response to changing demand.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-mincapacity
     */
    readonly minCapacity: number;

    /**
     * The identifier of the resource associated with the scalable target. This string consists of the resource type and unique identifier.
     *
     * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
     * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
     * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
     * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
     * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
     * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
     * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
     * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
     * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
     * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
     * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
     * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
     * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
     * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
     * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
     * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-resourceid
     */
    readonly resourceId: string;

    /**
     * Specify the Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that allows Application Auto Scaling to modify the scalable target on your behalf. This can be either an IAM service role that Application Auto Scaling can assume to make calls to other AWS resources on your behalf, or a service-linked role for the specified service. For more information, see [How Application Auto Scaling works with IAM](https://docs.aws.amazon.com/autoscaling/application/userguide/security_iam_service-with-iam.html) in the *Application Auto Scaling User Guide* .
     *
     * To automatically create a service-linked role (recommended), specify the full ARN of the service-linked role in your stack template. To find the exact ARN of the service-linked role for your AWS or custom resource, see the [Service-linked roles](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html) topic in the *Application Auto Scaling User Guide* . Look for the ARN in the table at the bottom of the page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-rolearn
     */
    readonly roleArn: string;

    /**
     * The scalable dimension associated with the scalable target. This string consists of the service namespace, resource type, and scaling property.
     *
     * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
     * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
     * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
     * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
     * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
     * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
     * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
     * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
     * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
     * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
     * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
     * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
     * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
     * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
     * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
     * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
     * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
     * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
     * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
     * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scalabledimension
     */
    readonly scalableDimension: string;

    /**
     * The namespace of the AWS service that provides the resource, or a `custom-resource` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-servicenamespace
     */
    readonly serviceNamespace: string;

    /**
     * The scheduled actions for the scalable target. Duplicates aren't allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scheduledactions
     */
    readonly scheduledActions?: Array<CfnScalableTarget.ScheduledActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An embedded object that contains attributes and attribute values that are used to suspend and resume automatic scaling. Setting the value of an attribute to `true` suspends the specified scaling activities. Setting it to `false` (default) resumes the specified scaling activities.
     *
     * *Suspension Outcomes*
     *
     * - For `DynamicScalingInSuspended` , while a suspension is in effect, all scale-in activities that are triggered by a scaling policy are suspended.
     * - For `DynamicScalingOutSuspended` , while a suspension is in effect, all scale-out activities that are triggered by a scaling policy are suspended.
     * - For `ScheduledScalingSuspended` , while a suspension is in effect, all scaling activities that involve scheduled actions are suspended.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-suspendedstate
     */
    readonly suspendedState?: CfnScalableTarget.SuspendedStateProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnScalableTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnScalableTargetProps`
 *
 * @returns the result of the validation.
 */
function CfnScalableTargetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.requiredValidator)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.validateNumber)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.requiredValidator)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.validateNumber)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('resourceId', cdk.requiredValidator)(properties.resourceId));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('scalableDimension', cdk.requiredValidator)(properties.scalableDimension));
    errors.collect(cdk.propertyValidator('scalableDimension', cdk.validateString)(properties.scalableDimension));
    errors.collect(cdk.propertyValidator('scheduledActions', cdk.listValidator(CfnScalableTarget_ScheduledActionPropertyValidator))(properties.scheduledActions));
    errors.collect(cdk.propertyValidator('serviceNamespace', cdk.requiredValidator)(properties.serviceNamespace));
    errors.collect(cdk.propertyValidator('serviceNamespace', cdk.validateString)(properties.serviceNamespace));
    errors.collect(cdk.propertyValidator('suspendedState', CfnScalableTarget_SuspendedStatePropertyValidator)(properties.suspendedState));
    return errors.wrap('supplied properties not correct for "CfnScalableTargetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget` resource
 *
 * @param properties - the TypeScript properties of a `CfnScalableTargetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget` resource.
 */
// @ts-ignore TS6133
function cfnScalableTargetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalableTargetPropsValidator(properties).assertSuccess();
    return {
        MaxCapacity: cdk.numberToCloudFormation(properties.maxCapacity),
        MinCapacity: cdk.numberToCloudFormation(properties.minCapacity),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
        ScalableDimension: cdk.stringToCloudFormation(properties.scalableDimension),
        ServiceNamespace: cdk.stringToCloudFormation(properties.serviceNamespace),
        ScheduledActions: cdk.listMapper(cfnScalableTargetScheduledActionPropertyToCloudFormation)(properties.scheduledActions),
        SuspendedState: cfnScalableTargetSuspendedStatePropertyToCloudFormation(properties.suspendedState),
    };
}

// @ts-ignore TS6133
function CfnScalableTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalableTargetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTargetProps>();
    ret.addPropertyResult('maxCapacity', 'MaxCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity));
    ret.addPropertyResult('minCapacity', 'MinCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity));
    ret.addPropertyResult('resourceId', 'ResourceId', cfn_parse.FromCloudFormation.getString(properties.ResourceId));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addPropertyResult('scalableDimension', 'ScalableDimension', cfn_parse.FromCloudFormation.getString(properties.ScalableDimension));
    ret.addPropertyResult('serviceNamespace', 'ServiceNamespace', cfn_parse.FromCloudFormation.getString(properties.ServiceNamespace));
    ret.addPropertyResult('scheduledActions', 'ScheduledActions', properties.ScheduledActions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalableTargetScheduledActionPropertyFromCloudFormation)(properties.ScheduledActions) : undefined);
    ret.addPropertyResult('suspendedState', 'SuspendedState', properties.SuspendedState != null ? CfnScalableTargetSuspendedStatePropertyFromCloudFormation(properties.SuspendedState) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ApplicationAutoScaling::ScalableTarget`
 *
 * The `AWS::ApplicationAutoScaling::ScalableTarget` resource specifies a resource that Application Auto Scaling can scale, such as an AWS::DynamoDB::Table or AWS::ECS::Service resource.
 *
 * For more information, see [Getting started](https://docs.aws.amazon.com/autoscaling/application/userguide/getting-started.html) in the *Application Auto Scaling User Guide* .
 *
 * > If the resource that you want Application Auto Scaling to scale is not yet created in your account, add a dependency on the resource when registering it as a scalable target using the [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) attribute.
 *
 * @cloudformationResource AWS::ApplicationAutoScaling::ScalableTarget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html
 */
export class CfnScalableTarget extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApplicationAutoScaling::ScalableTarget";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalableTarget {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnScalableTargetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnScalableTarget(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The maximum value that you plan to scale out to. When a scaling policy is in effect, Application Auto Scaling can scale out (expand) as needed to the maximum capacity limit in response to changing demand.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-maxcapacity
     */
    public maxCapacity: number;

    /**
     * The minimum value that you plan to scale in to. When a scaling policy is in effect, Application Auto Scaling can scale in (contract) as needed to the minimum capacity limit in response to changing demand.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-mincapacity
     */
    public minCapacity: number;

    /**
     * The identifier of the resource associated with the scalable target. This string consists of the resource type and unique identifier.
     *
     * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
     * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
     * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
     * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
     * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
     * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
     * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
     * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
     * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
     * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
     * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
     * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
     * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
     * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
     * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
     * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-resourceid
     */
    public resourceId: string;

    /**
     * Specify the Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that allows Application Auto Scaling to modify the scalable target on your behalf. This can be either an IAM service role that Application Auto Scaling can assume to make calls to other AWS resources on your behalf, or a service-linked role for the specified service. For more information, see [How Application Auto Scaling works with IAM](https://docs.aws.amazon.com/autoscaling/application/userguide/security_iam_service-with-iam.html) in the *Application Auto Scaling User Guide* .
     *
     * To automatically create a service-linked role (recommended), specify the full ARN of the service-linked role in your stack template. To find the exact ARN of the service-linked role for your AWS or custom resource, see the [Service-linked roles](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html) topic in the *Application Auto Scaling User Guide* . Look for the ARN in the table at the bottom of the page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-rolearn
     */
    public roleArn: string;

    /**
     * The scalable dimension associated with the scalable target. This string consists of the service namespace, resource type, and scaling property.
     *
     * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
     * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
     * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
     * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
     * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
     * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
     * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
     * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
     * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
     * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
     * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
     * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
     * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
     * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
     * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
     * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
     * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
     * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
     * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
     * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scalabledimension
     */
    public scalableDimension: string;

    /**
     * The namespace of the AWS service that provides the resource, or a `custom-resource` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-servicenamespace
     */
    public serviceNamespace: string;

    /**
     * The scheduled actions for the scalable target. Duplicates aren't allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scheduledactions
     */
    public scheduledActions: Array<CfnScalableTarget.ScheduledActionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An embedded object that contains attributes and attribute values that are used to suspend and resume automatic scaling. Setting the value of an attribute to `true` suspends the specified scaling activities. Setting it to `false` (default) resumes the specified scaling activities.
     *
     * *Suspension Outcomes*
     *
     * - For `DynamicScalingInSuspended` , while a suspension is in effect, all scale-in activities that are triggered by a scaling policy are suspended.
     * - For `DynamicScalingOutSuspended` , while a suspension is in effect, all scale-out activities that are triggered by a scaling policy are suspended.
     * - For `ScheduledScalingSuspended` , while a suspension is in effect, all scaling activities that involve scheduled actions are suspended.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-suspendedstate
     */
    public suspendedState: CfnScalableTarget.SuspendedStateProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ApplicationAutoScaling::ScalableTarget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScalableTargetProps) {
        super(scope, id, { type: CfnScalableTarget.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'maxCapacity', this);
        cdk.requireProperty(props, 'minCapacity', this);
        cdk.requireProperty(props, 'resourceId', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'scalableDimension', this);
        cdk.requireProperty(props, 'serviceNamespace', this);

        this.maxCapacity = props.maxCapacity;
        this.minCapacity = props.minCapacity;
        this.resourceId = props.resourceId;
        this.roleArn = props.roleArn;
        this.scalableDimension = props.scalableDimension;
        this.serviceNamespace = props.serviceNamespace;
        this.scheduledActions = props.scheduledActions;
        this.suspendedState = props.suspendedState;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnScalableTarget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            maxCapacity: this.maxCapacity,
            minCapacity: this.minCapacity,
            resourceId: this.resourceId,
            roleArn: this.roleArn,
            scalableDimension: this.scalableDimension,
            serviceNamespace: this.serviceNamespace,
            scheduledActions: this.scheduledActions,
            suspendedState: this.suspendedState,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnScalableTargetPropsToCloudFormation(props);
    }
}

export namespace CfnScalableTarget {
    /**
     * `ScalableTargetAction` specifies the minimum and maximum capacity for the `ScalableTargetAction` property of the [AWS::ApplicationAutoScaling::ScalableTarget ScheduledAction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html
     */
    export interface ScalableTargetActionProperty {
        /**
         * The maximum capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-maxcapacity
         */
        readonly maxCapacity?: number;
        /**
         * The minimum capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-mincapacity
         */
        readonly minCapacity?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScalableTargetActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalableTargetActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalableTarget_ScalableTargetActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.validateNumber)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.validateNumber)(properties.minCapacity));
    return errors.wrap('supplied properties not correct for "ScalableTargetActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.ScalableTargetAction` resource
 *
 * @param properties - the TypeScript properties of a `ScalableTargetActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.ScalableTargetAction` resource.
 */
// @ts-ignore TS6133
function cfnScalableTargetScalableTargetActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalableTarget_ScalableTargetActionPropertyValidator(properties).assertSuccess();
    return {
        MaxCapacity: cdk.numberToCloudFormation(properties.maxCapacity),
        MinCapacity: cdk.numberToCloudFormation(properties.minCapacity),
    };
}

// @ts-ignore TS6133
function CfnScalableTargetScalableTargetActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalableTarget.ScalableTargetActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.ScalableTargetActionProperty>();
    ret.addPropertyResult('maxCapacity', 'MaxCapacity', properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined);
    ret.addPropertyResult('minCapacity', 'MinCapacity', properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalableTarget {
    /**
     * `ScheduledAction` is a property of the [AWS::ApplicationAutoScaling::ScalableTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html) resource that specifies a scheduled action for a scalable target.
     *
     * For more information, see [Scheduled scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-scheduled-scaling.html) in the *Application Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html
     */
    export interface ScheduledActionProperty {
        /**
         * The date and time that the action is scheduled to end, in UTC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-endtime
         */
        readonly endTime?: Date | cdk.IResolvable;
        /**
         * The new minimum and maximum capacity. You can set both values or just one. At the scheduled time, if the current capacity is below the minimum capacity, Application Auto Scaling scales out to the minimum capacity. If the current capacity is above the maximum capacity, Application Auto Scaling scales in to the maximum capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scalabletargetaction
         */
        readonly scalableTargetAction?: CfnScalableTarget.ScalableTargetActionProperty | cdk.IResolvable;
        /**
         * The schedule for this action. The following formats are supported:
         *
         * - At expressions - " `at( *yyyy* - *mm* - *dd* T *hh* : *mm* : *ss* )` "
         * - Rate expressions - " `rate( *value* *unit* )` "
         * - Cron expressions - " `cron( *fields* )` "
         *
         * At expressions are useful for one-time schedules. Cron expressions are useful for scheduled actions that run periodically at a specified date and time, and rate expressions are useful for scheduled actions that run at a regular interval.
         *
         * At and cron expressions use Universal Coordinated Time (UTC) by default.
         *
         * The cron format consists of six fields separated by white spaces: [Minutes] [Hours] [Day_of_Month] [Month] [Day_of_Week] [Year].
         *
         * For rate expressions, *value* is a positive integer and *unit* is `minute` | `minutes` | `hour` | `hours` | `day` | `days` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-schedule
         */
        readonly schedule: string;
        /**
         * The name of the scheduled action. This name must be unique among all other scheduled actions on the specified scalable target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scheduledactionname
         */
        readonly scheduledActionName: string;
        /**
         * The date and time that the action is scheduled to begin, in UTC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-starttime
         */
        readonly startTime?: Date | cdk.IResolvable;
        /**
         * The time zone used when referring to the date and time of a scheduled action, when the scheduled action uses an at or cron expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-timezone
         */
        readonly timezone?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduledActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalableTarget_ScheduledActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endTime', cdk.validateDate)(properties.endTime));
    errors.collect(cdk.propertyValidator('scalableTargetAction', CfnScalableTarget_ScalableTargetActionPropertyValidator)(properties.scalableTargetAction));
    errors.collect(cdk.propertyValidator('schedule', cdk.requiredValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('schedule', cdk.validateString)(properties.schedule));
    errors.collect(cdk.propertyValidator('scheduledActionName', cdk.requiredValidator)(properties.scheduledActionName));
    errors.collect(cdk.propertyValidator('scheduledActionName', cdk.validateString)(properties.scheduledActionName));
    errors.collect(cdk.propertyValidator('startTime', cdk.validateDate)(properties.startTime));
    errors.collect(cdk.propertyValidator('timezone', cdk.validateString)(properties.timezone));
    return errors.wrap('supplied properties not correct for "ScheduledActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.ScheduledAction` resource
 *
 * @param properties - the TypeScript properties of a `ScheduledActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.ScheduledAction` resource.
 */
// @ts-ignore TS6133
function cfnScalableTargetScheduledActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalableTarget_ScheduledActionPropertyValidator(properties).assertSuccess();
    return {
        EndTime: cdk.dateToCloudFormation(properties.endTime),
        ScalableTargetAction: cfnScalableTargetScalableTargetActionPropertyToCloudFormation(properties.scalableTargetAction),
        Schedule: cdk.stringToCloudFormation(properties.schedule),
        ScheduledActionName: cdk.stringToCloudFormation(properties.scheduledActionName),
        StartTime: cdk.dateToCloudFormation(properties.startTime),
        Timezone: cdk.stringToCloudFormation(properties.timezone),
    };
}

// @ts-ignore TS6133
function CfnScalableTargetScheduledActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalableTarget.ScheduledActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.ScheduledActionProperty>();
    ret.addPropertyResult('endTime', 'EndTime', properties.EndTime != null ? cfn_parse.FromCloudFormation.getDate(properties.EndTime) : undefined);
    ret.addPropertyResult('scalableTargetAction', 'ScalableTargetAction', properties.ScalableTargetAction != null ? CfnScalableTargetScalableTargetActionPropertyFromCloudFormation(properties.ScalableTargetAction) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', cfn_parse.FromCloudFormation.getString(properties.Schedule));
    ret.addPropertyResult('scheduledActionName', 'ScheduledActionName', cfn_parse.FromCloudFormation.getString(properties.ScheduledActionName));
    ret.addPropertyResult('startTime', 'StartTime', properties.StartTime != null ? cfn_parse.FromCloudFormation.getDate(properties.StartTime) : undefined);
    ret.addPropertyResult('timezone', 'Timezone', properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalableTarget {
    /**
     * `SuspendedState` is a property of the [AWS::ApplicationAutoScaling::ScalableTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html) resource that specifies whether the scaling activities for a scalable target are in a suspended state.
     *
     * For more information, see [Suspending and resuming scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-suspend-resume-scaling.html) in the *Application Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html
     */
    export interface SuspendedStateProperty {
        /**
         * Whether scale in by a target tracking scaling policy or a step scaling policy is suspended. Set the value to `true` if you don't want Application Auto Scaling to remove capacity when a scaling policy is triggered. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-dynamicscalinginsuspended
         */
        readonly dynamicScalingInSuspended?: boolean | cdk.IResolvable;
        /**
         * Whether scale out by a target tracking scaling policy or a step scaling policy is suspended. Set the value to `true` if you don't want Application Auto Scaling to add capacity when a scaling policy is triggered. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-dynamicscalingoutsuspended
         */
        readonly dynamicScalingOutSuspended?: boolean | cdk.IResolvable;
        /**
         * Whether scheduled scaling is suspended. Set the value to `true` if you don't want Application Auto Scaling to add or remove capacity by initiating scheduled actions. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-scheduledscalingsuspended
         */
        readonly scheduledScalingSuspended?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SuspendedStateProperty`
 *
 * @param properties - the TypeScript properties of a `SuspendedStateProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalableTarget_SuspendedStatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dynamicScalingInSuspended', cdk.validateBoolean)(properties.dynamicScalingInSuspended));
    errors.collect(cdk.propertyValidator('dynamicScalingOutSuspended', cdk.validateBoolean)(properties.dynamicScalingOutSuspended));
    errors.collect(cdk.propertyValidator('scheduledScalingSuspended', cdk.validateBoolean)(properties.scheduledScalingSuspended));
    return errors.wrap('supplied properties not correct for "SuspendedStateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.SuspendedState` resource
 *
 * @param properties - the TypeScript properties of a `SuspendedStateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalableTarget.SuspendedState` resource.
 */
// @ts-ignore TS6133
function cfnScalableTargetSuspendedStatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalableTarget_SuspendedStatePropertyValidator(properties).assertSuccess();
    return {
        DynamicScalingInSuspended: cdk.booleanToCloudFormation(properties.dynamicScalingInSuspended),
        DynamicScalingOutSuspended: cdk.booleanToCloudFormation(properties.dynamicScalingOutSuspended),
        ScheduledScalingSuspended: cdk.booleanToCloudFormation(properties.scheduledScalingSuspended),
    };
}

// @ts-ignore TS6133
function CfnScalableTargetSuspendedStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalableTarget.SuspendedStateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.SuspendedStateProperty>();
    ret.addPropertyResult('dynamicScalingInSuspended', 'DynamicScalingInSuspended', properties.DynamicScalingInSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DynamicScalingInSuspended) : undefined);
    ret.addPropertyResult('dynamicScalingOutSuspended', 'DynamicScalingOutSuspended', properties.DynamicScalingOutSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DynamicScalingOutSuspended) : undefined);
    ret.addPropertyResult('scheduledScalingSuspended', 'ScheduledScalingSuspended', properties.ScheduledScalingSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScheduledScalingSuspended) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnScalingPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html
 */
export interface CfnScalingPolicyProps {

    /**
     * The name of the scaling policy.
     *
     * Updates to the name of a target tracking scaling policy are not supported, unless you also update the metric used for scaling. To change only a target tracking scaling policy's name, first delete the policy by removing the existing `AWS::ApplicationAutoScaling::ScalingPolicy` resource from the template and updating the stack. Then, recreate the resource with the same settings and a different name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policyname
     */
    readonly policyName: string;

    /**
     * The scaling policy type.
     *
     * The following policy types are supported:
     *
     * `TargetTrackingScaling` —Not supported for Amazon EMR
     *
     * `StepScaling` —Not supported for DynamoDB, Amazon Comprehend, Lambda, Amazon Keyspaces, Amazon MSK, Amazon ElastiCache, or Neptune.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policytype
     */
    readonly policyType: string;

    /**
     * The identifier of the resource associated with the scaling policy. This string consists of the resource type and unique identifier.
     *
     * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
     * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
     * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
     * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
     * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
     * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
     * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
     * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
     * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
     * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
     * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
     * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
     * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
     * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
     * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
     * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-resourceid
     */
    readonly resourceId?: string;

    /**
     * The scalable dimension. This string consists of the service namespace, resource type, and scaling property.
     *
     * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
     * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
     * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
     * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
     * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
     * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
     * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
     * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
     * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
     * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
     * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
     * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
     * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
     * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
     * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
     * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
     * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
     * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
     * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
     * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalabledimension
     */
    readonly scalableDimension?: string;

    /**
     * The CloudFormation-generated ID of an Application Auto Scaling scalable target. For more information about the ID, see the Return Value section of the `AWS::ApplicationAutoScaling::ScalableTarget` resource.
     *
     * > You must specify either the `ScalingTargetId` property, or the `ResourceId` , `ScalableDimension` , and `ServiceNamespace` properties, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalingtargetid
     */
    readonly scalingTargetId?: string;

    /**
     * The namespace of the AWS service that provides the resource, or a `custom-resource` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-servicenamespace
     */
    readonly serviceNamespace?: string;

    /**
     * A step scaling policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration
     */
    readonly stepScalingPolicyConfiguration?: CfnScalingPolicy.StepScalingPolicyConfigurationProperty | cdk.IResolvable;

    /**
     * A target tracking scaling policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration
     */
    readonly targetTrackingScalingPolicyConfiguration?: CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnScalingPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnScalingPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyType', cdk.requiredValidator)(properties.policyType));
    errors.collect(cdk.propertyValidator('policyType', cdk.validateString)(properties.policyType));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('scalableDimension', cdk.validateString)(properties.scalableDimension));
    errors.collect(cdk.propertyValidator('scalingTargetId', cdk.validateString)(properties.scalingTargetId));
    errors.collect(cdk.propertyValidator('serviceNamespace', cdk.validateString)(properties.serviceNamespace));
    errors.collect(cdk.propertyValidator('stepScalingPolicyConfiguration', CfnScalingPolicy_StepScalingPolicyConfigurationPropertyValidator)(properties.stepScalingPolicyConfiguration));
    errors.collect(cdk.propertyValidator('targetTrackingScalingPolicyConfiguration', CfnScalingPolicy_TargetTrackingScalingPolicyConfigurationPropertyValidator)(properties.targetTrackingScalingPolicyConfiguration));
    return errors.wrap('supplied properties not correct for "CfnScalingPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnScalingPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
        PolicyType: cdk.stringToCloudFormation(properties.policyType),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        ScalableDimension: cdk.stringToCloudFormation(properties.scalableDimension),
        ScalingTargetId: cdk.stringToCloudFormation(properties.scalingTargetId),
        ServiceNamespace: cdk.stringToCloudFormation(properties.serviceNamespace),
        StepScalingPolicyConfiguration: cfnScalingPolicyStepScalingPolicyConfigurationPropertyToCloudFormation(properties.stepScalingPolicyConfiguration),
        TargetTrackingScalingPolicyConfiguration: cfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties.targetTrackingScalingPolicyConfiguration),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicyProps>();
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addPropertyResult('policyType', 'PolicyType', cfn_parse.FromCloudFormation.getString(properties.PolicyType));
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addPropertyResult('scalableDimension', 'ScalableDimension', properties.ScalableDimension != null ? cfn_parse.FromCloudFormation.getString(properties.ScalableDimension) : undefined);
    ret.addPropertyResult('scalingTargetId', 'ScalingTargetId', properties.ScalingTargetId != null ? cfn_parse.FromCloudFormation.getString(properties.ScalingTargetId) : undefined);
    ret.addPropertyResult('serviceNamespace', 'ServiceNamespace', properties.ServiceNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNamespace) : undefined);
    ret.addPropertyResult('stepScalingPolicyConfiguration', 'StepScalingPolicyConfiguration', properties.StepScalingPolicyConfiguration != null ? CfnScalingPolicyStepScalingPolicyConfigurationPropertyFromCloudFormation(properties.StepScalingPolicyConfiguration) : undefined);
    ret.addPropertyResult('targetTrackingScalingPolicyConfiguration', 'TargetTrackingScalingPolicyConfiguration', properties.TargetTrackingScalingPolicyConfiguration != null ? CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties.TargetTrackingScalingPolicyConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ApplicationAutoScaling::ScalingPolicy`
 *
 * The `AWS::ApplicationAutoScaling::ScalingPolicy` resource defines a scaling policy that Application Auto Scaling uses to adjust the capacity of a scalable target.
 *
 * For more information, see [Target tracking scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-target-tracking.html) and [Step scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html) in the *Application Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::ApplicationAutoScaling::ScalingPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html
 */
export class CfnScalingPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApplicationAutoScaling::ScalingPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalingPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnScalingPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnScalingPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the scaling policy.
     *
     * Updates to the name of a target tracking scaling policy are not supported, unless you also update the metric used for scaling. To change only a target tracking scaling policy's name, first delete the policy by removing the existing `AWS::ApplicationAutoScaling::ScalingPolicy` resource from the template and updating the stack. Then, recreate the resource with the same settings and a different name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policyname
     */
    public policyName: string;

    /**
     * The scaling policy type.
     *
     * The following policy types are supported:
     *
     * `TargetTrackingScaling` —Not supported for Amazon EMR
     *
     * `StepScaling` —Not supported for DynamoDB, Amazon Comprehend, Lambda, Amazon Keyspaces, Amazon MSK, Amazon ElastiCache, or Neptune.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policytype
     */
    public policyType: string;

    /**
     * The identifier of the resource associated with the scaling policy. This string consists of the resource type and unique identifier.
     *
     * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
     * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
     * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
     * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
     * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
     * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
     * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
     * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
     * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
     * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
     * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
     * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
     * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
     * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
     * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
     * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-resourceid
     */
    public resourceId: string | undefined;

    /**
     * The scalable dimension. This string consists of the service namespace, resource type, and scaling property.
     *
     * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
     * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
     * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
     * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
     * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
     * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
     * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
     * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
     * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
     * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
     * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
     * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
     * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
     * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
     * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
     * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
     * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
     * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
     * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
     * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalabledimension
     */
    public scalableDimension: string | undefined;

    /**
     * The CloudFormation-generated ID of an Application Auto Scaling scalable target. For more information about the ID, see the Return Value section of the `AWS::ApplicationAutoScaling::ScalableTarget` resource.
     *
     * > You must specify either the `ScalingTargetId` property, or the `ResourceId` , `ScalableDimension` , and `ServiceNamespace` properties, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalingtargetid
     */
    public scalingTargetId: string | undefined;

    /**
     * The namespace of the AWS service that provides the resource, or a `custom-resource` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-servicenamespace
     */
    public serviceNamespace: string | undefined;

    /**
     * A step scaling policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration
     */
    public stepScalingPolicyConfiguration: CfnScalingPolicy.StepScalingPolicyConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A target tracking scaling policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration
     */
    public targetTrackingScalingPolicyConfiguration: CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ApplicationAutoScaling::ScalingPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScalingPolicyProps) {
        super(scope, id, { type: CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policyName', this);
        cdk.requireProperty(props, 'policyType', this);

        this.policyName = props.policyName;
        this.policyType = props.policyType;
        this.resourceId = props.resourceId;
        this.scalableDimension = props.scalableDimension;
        this.scalingTargetId = props.scalingTargetId;
        this.serviceNamespace = props.serviceNamespace;
        this.stepScalingPolicyConfiguration = props.stepScalingPolicyConfiguration;
        this.targetTrackingScalingPolicyConfiguration = props.targetTrackingScalingPolicyConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policyName: this.policyName,
            policyType: this.policyType,
            resourceId: this.resourceId,
            scalableDimension: this.scalableDimension,
            scalingTargetId: this.scalingTargetId,
            serviceNamespace: this.serviceNamespace,
            stepScalingPolicyConfiguration: this.stepScalingPolicyConfiguration,
            targetTrackingScalingPolicyConfiguration: this.targetTrackingScalingPolicyConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnScalingPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnScalingPolicy {
    /**
     * Contains customized metric specification information for a target tracking scaling policy for Application Auto Scaling.
     *
     * For information about the available metrics for a service, see [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
     *
     * To create your customized metric specification:
     *
     * - Add values for each required parameter from CloudWatch. You can use an existing metric, or a new metric that you create. To use your own metric, you must first publish the metric to CloudWatch. For more information, see [Publish custom metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) in the *Amazon CloudWatch User Guide* .
     * - Choose a metric that changes proportionally with capacity. The value of the metric should increase or decrease in inverse proportion to the number of capacity units. That is, the value of the metric should decrease when capacity increases, and increase when capacity decreases.
     *
     * For an example of how creating new metrics can be useful, see [Scaling based on Amazon SQS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html) in the *Amazon EC2 Auto Scaling User Guide* . This topic mentions Auto Scaling groups, but the same scenario for Amazon SQS can apply to the target tracking scaling policies that you create for a Spot Fleet by using Application Auto Scaling.
     *
     * For more information about the CloudWatch terminology below, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) .
     *
     * `CustomizedMetricSpecification` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html
     */
    export interface CustomizedMetricSpecificationProperty {
        /**
         * The dimensions of the metric.
         *
         * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-dimensions
         */
        readonly dimensions?: Array<CfnScalingPolicy.MetricDimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric. To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-metricname
         */
        readonly metricName: string;
        /**
         * The namespace of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-namespace
         */
        readonly namespace: string;
        /**
         * The statistic of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-statistic
         */
        readonly statistic: string;
        /**
         * The unit of the metric. For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomizedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomizedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_CustomizedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnScalingPolicy_MetricDimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('statistic', cdk.requiredValidator)(properties.statistic));
    errors.collect(cdk.propertyValidator('statistic', cdk.validateString)(properties.statistic));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "CustomizedMetricSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.CustomizedMetricSpecification` resource
 *
 * @param properties - the TypeScript properties of a `CustomizedMetricSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.CustomizedMetricSpecification` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_CustomizedMetricSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnScalingPolicyMetricDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        Statistic: cdk.stringToCloudFormation(properties.statistic),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.CustomizedMetricSpecificationProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addPropertyResult('statistic', 'Statistic', cfn_parse.FromCloudFormation.getString(properties.Statistic));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalingPolicy {
    /**
     * `MetricDimension` specifies a name/value pair that is part of the identity of a CloudWatch metric for the `Dimensions` property of the [AWS::ApplicationAutoScaling::ScalingPolicy CustomizedMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html) property type. Duplicate dimensions are not allowed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html
     */
    export interface MetricDimensionProperty {
        /**
         * The name of the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html#cfn-applicationautoscaling-scalingpolicy-metricdimension-name
         */
        readonly name: string;
        /**
         * The value of the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html#cfn-applicationautoscaling-scalingpolicy-metricdimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_MetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "MetricDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.MetricDimension` resource
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.MetricDimension` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyMetricDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_MetricDimensionPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.MetricDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricDimensionProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalingPolicy {
    /**
     * Contains predefined metric specification information for a target tracking scaling policy for Application Auto Scaling.
     *
     * `PredefinedMetricSpecification` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html
     */
    export interface PredefinedMetricSpecificationProperty {
        /**
         * The metric type. The `ALBRequestCountPerTarget` metric type applies only to Spot fleet requests and ECS services.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype
         */
        readonly predefinedMetricType: string;
        /**
         * Identifies the resource associated with the metric type. You can't specify a resource label unless the metric type is `ALBRequestCountPerTarget` and there is a target group attached to the Spot Fleet or ECS service.
         *
         * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
         *
         * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
         *
         * Where:
         *
         * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
         * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
         *
         * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel
         */
        readonly resourceLabel?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PredefinedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PredefinedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_PredefinedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('predefinedMetricType', cdk.requiredValidator)(properties.predefinedMetricType));
    errors.collect(cdk.propertyValidator('predefinedMetricType', cdk.validateString)(properties.predefinedMetricType));
    errors.collect(cdk.propertyValidator('resourceLabel', cdk.validateString)(properties.resourceLabel));
    return errors.wrap('supplied properties not correct for "PredefinedMetricSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.PredefinedMetricSpecification` resource
 *
 * @param properties - the TypeScript properties of a `PredefinedMetricSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.PredefinedMetricSpecification` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_PredefinedMetricSpecificationPropertyValidator(properties).assertSuccess();
    return {
        PredefinedMetricType: cdk.stringToCloudFormation(properties.predefinedMetricType),
        ResourceLabel: cdk.stringToCloudFormation(properties.resourceLabel),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.PredefinedMetricSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredefinedMetricSpecificationProperty>();
    ret.addPropertyResult('predefinedMetricType', 'PredefinedMetricType', cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType));
    ret.addPropertyResult('resourceLabel', 'ResourceLabel', properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalingPolicy {
    /**
     * `StepAdjustment` specifies a step adjustment for the `StepAdjustments` property of the [AWS::ApplicationAutoScaling::ScalingPolicy StepScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html) property type.
     *
     * For the following examples, suppose that you have an alarm with a breach threshold of 50:
     *
     * - To trigger a step adjustment when the metric is greater than or equal to 50 and less than 60, specify a lower bound of 0 and an upper bound of 10.
     * - To trigger a step adjustment when the metric is greater than 40 and less than or equal to 50, specify a lower bound of -10 and an upper bound of 0.
     *
     * For more information, see [Step adjustments](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html#as-scaling-steps) in the *Application Auto Scaling User Guide* .
     *
     * You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#aws-resource-applicationautoscaling-scalingpolicy--examples) section of the `AWS::ApplicationAutoScaling::ScalingPolicy` documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment.html
     */
    export interface StepAdjustmentProperty {
        /**
         * The lower bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound). Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound). A null value indicates negative infinity.
         *
         * You must specify at least one upper or lower bound.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment-metricintervallowerbound
         */
        readonly metricIntervalLowerBound?: number;
        /**
         * The upper bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound). A null value indicates positive infinity.
         *
         * You must specify at least one upper or lower bound.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment-metricintervalupperbound
         */
        readonly metricIntervalUpperBound?: number;
        /**
         * The amount by which to scale. The adjustment is based on the value that you specified in the `AdjustmentType` property (either an absolute number or a percentage). A positive value adds to the current capacity and a negative number subtracts from the current capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustment-scalingadjustment
         */
        readonly scalingAdjustment: number;
    }
}

/**
 * Determine whether the given properties match those of a `StepAdjustmentProperty`
 *
 * @param properties - the TypeScript properties of a `StepAdjustmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_StepAdjustmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricIntervalLowerBound', cdk.validateNumber)(properties.metricIntervalLowerBound));
    errors.collect(cdk.propertyValidator('metricIntervalUpperBound', cdk.validateNumber)(properties.metricIntervalUpperBound));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.requiredValidator)(properties.scalingAdjustment));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.validateNumber)(properties.scalingAdjustment));
    return errors.wrap('supplied properties not correct for "StepAdjustmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.StepAdjustment` resource
 *
 * @param properties - the TypeScript properties of a `StepAdjustmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.StepAdjustment` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyStepAdjustmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_StepAdjustmentPropertyValidator(properties).assertSuccess();
    return {
        MetricIntervalLowerBound: cdk.numberToCloudFormation(properties.metricIntervalLowerBound),
        MetricIntervalUpperBound: cdk.numberToCloudFormation(properties.metricIntervalUpperBound),
        ScalingAdjustment: cdk.numberToCloudFormation(properties.scalingAdjustment),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.StepAdjustmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.StepAdjustmentProperty>();
    ret.addPropertyResult('metricIntervalLowerBound', 'MetricIntervalLowerBound', properties.MetricIntervalLowerBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalLowerBound) : undefined);
    ret.addPropertyResult('metricIntervalUpperBound', 'MetricIntervalUpperBound', properties.MetricIntervalUpperBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalUpperBound) : undefined);
    ret.addPropertyResult('scalingAdjustment', 'ScalingAdjustment', cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalingPolicy {
    /**
     * `StepScalingPolicyConfiguration` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html) resource that specifies a step scaling policy configuration for Application Auto Scaling.
     *
     * For more information, see [Step scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html) in the *Application Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html
     */
    export interface StepScalingPolicyConfigurationProperty {
        /**
         * Specifies whether the `ScalingAdjustment` value in the `StepAdjustment` property is an absolute number or a percentage of the current capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-adjustmenttype
         */
        readonly adjustmentType?: string;
        /**
         * The amount of time, in seconds, to wait for a previous scaling activity to take effect.
         *
         * With scale-out policies, the intention is to continuously (but not excessively) scale out. After Application Auto Scaling successfully scales out using a step scaling policy, it starts to calculate the cooldown time. The scaling policy won't increase the desired capacity again unless either a larger scale out is triggered or the cooldown period ends. While the cooldown period is in effect, capacity added by the initiating scale-out activity is calculated as part of the desired capacity for the next scale-out activity. For example, when an alarm triggers a step scaling policy to increase the capacity by 2, the scaling activity completes successfully, and a cooldown period starts. If the alarm triggers again during the cooldown period but at a more aggressive step adjustment of 3, the previous increase of 2 is considered part of the current capacity. Therefore, only 1 is added to the capacity.
         *
         * With scale-in policies, the intention is to scale in conservatively to protect your application’s availability, so scale-in activities are blocked until the cooldown period has expired. However, if another alarm triggers a scale-out activity during the cooldown period after a scale-in activity, Application Auto Scaling scales out the target immediately. In this case, the cooldown period for the scale-in activity stops and doesn't complete.
         *
         * Application Auto Scaling provides a default value of 600 for Amazon ElastiCache replication groups and a default value of 300 for the following scalable targets:
         *
         * - AppStream 2.0 fleets
         * - Aurora DB clusters
         * - ECS services
         * - EMR clusters
         * - Neptune clusters
         * - SageMaker endpoint variants
         * - Spot Fleets
         * - Custom resources
         *
         * For all other scalable targets, the default value is 0:
         *
         * - Amazon Comprehend document classification and entity recognizer endpoints
         * - DynamoDB tables and global secondary indexes
         * - Amazon Keyspaces tables
         * - Lambda provisioned concurrency
         * - Amazon MSK broker storage
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-cooldown
         */
        readonly cooldown?: number;
        /**
         * The aggregation type for the CloudWatch metrics. Valid values are `Minimum` , `Maximum` , and `Average` . If the aggregation type is null, the value is treated as `Average` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-metricaggregationtype
         */
        readonly metricAggregationType?: string;
        /**
         * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` . For example, suppose that you create a step scaling policy to scale out an Amazon ECS service by 25 percent and you specify a `MinAdjustmentMagnitude` of 2. If the service has 4 tasks and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a `MinAdjustmentMagnitude` of 2, Application Auto Scaling scales out the service by 2 tasks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-minadjustmentmagnitude
         */
        readonly minAdjustmentMagnitude?: number;
        /**
         * A set of adjustments that enable you to scale based on the size of the alarm breach.
         *
         * At least one step adjustment is required if you are adding a new step scaling policy configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustments
         */
        readonly stepAdjustments?: Array<CfnScalingPolicy.StepAdjustmentProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StepScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StepScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_StepScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adjustmentType', cdk.validateString)(properties.adjustmentType));
    errors.collect(cdk.propertyValidator('cooldown', cdk.validateNumber)(properties.cooldown));
    errors.collect(cdk.propertyValidator('metricAggregationType', cdk.validateString)(properties.metricAggregationType));
    errors.collect(cdk.propertyValidator('minAdjustmentMagnitude', cdk.validateNumber)(properties.minAdjustmentMagnitude));
    errors.collect(cdk.propertyValidator('stepAdjustments', cdk.listValidator(CfnScalingPolicy_StepAdjustmentPropertyValidator))(properties.stepAdjustments));
    return errors.wrap('supplied properties not correct for "StepScalingPolicyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.StepScalingPolicyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StepScalingPolicyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.StepScalingPolicyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyStepScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_StepScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdjustmentType: cdk.stringToCloudFormation(properties.adjustmentType),
        Cooldown: cdk.numberToCloudFormation(properties.cooldown),
        MetricAggregationType: cdk.stringToCloudFormation(properties.metricAggregationType),
        MinAdjustmentMagnitude: cdk.numberToCloudFormation(properties.minAdjustmentMagnitude),
        StepAdjustments: cdk.listMapper(cfnScalingPolicyStepAdjustmentPropertyToCloudFormation)(properties.stepAdjustments),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyStepScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.StepScalingPolicyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.StepScalingPolicyConfigurationProperty>();
    ret.addPropertyResult('adjustmentType', 'AdjustmentType', properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined);
    ret.addPropertyResult('cooldown', 'Cooldown', properties.Cooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cooldown) : undefined);
    ret.addPropertyResult('metricAggregationType', 'MetricAggregationType', properties.MetricAggregationType != null ? cfn_parse.FromCloudFormation.getString(properties.MetricAggregationType) : undefined);
    ret.addPropertyResult('minAdjustmentMagnitude', 'MinAdjustmentMagnitude', properties.MinAdjustmentMagnitude != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinAdjustmentMagnitude) : undefined);
    ret.addPropertyResult('stepAdjustments', 'StepAdjustments', properties.StepAdjustments != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation)(properties.StepAdjustments) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScalingPolicy {
    /**
     * `TargetTrackingScalingPolicyConfiguration` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html) resource that specifies a target tracking scaling policy configuration for Application Auto Scaling. Use a target tracking scaling policy to adjust the capacity of the specified scalable target in response to actual workloads, so that resource utilization remains at or near the target utilization value.
     *
     * For more information, see [Target tracking scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-target-tracking.html) in the *Application Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html
     */
    export interface TargetTrackingScalingPolicyConfigurationProperty {
        /**
         * A customized metric. You can specify either a predefined metric or a customized metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-customizedmetricspecification
         */
        readonly customizedMetricSpecification?: CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable;
        /**
         * Indicates whether scale in by the target tracking scaling policy is disabled. If the value is `true` , scale in is disabled and the target tracking scaling policy won't remove capacity from the scalable target. Otherwise, scale in is enabled and the target tracking scaling policy can remove capacity from the scalable target. The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-disablescalein
         */
        readonly disableScaleIn?: boolean | cdk.IResolvable;
        /**
         * A predefined metric. You can specify either a predefined metric or a customized metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-predefinedmetricspecification
         */
        readonly predefinedMetricSpecification?: CfnScalingPolicy.PredefinedMetricSpecificationProperty | cdk.IResolvable;
        /**
         * The amount of time, in seconds, after a scale-in activity completes before another scale-in activity can start.
         *
         * With the *scale-in cooldown period* , the intention is to scale in conservatively to protect your application’s availability, so scale-in activities are blocked until the cooldown period has expired. However, if another alarm triggers a scale-out activity during the scale-in cooldown period, Application Auto Scaling scales out the target immediately. In this case, the scale-in cooldown period stops and doesn't complete.
         *
         * Application Auto Scaling provides a default value of 600 for Amazon ElastiCache replication groups and a default value of 300 for the following scalable targets:
         *
         * - AppStream 2.0 fleets
         * - Aurora DB clusters
         * - ECS services
         * - EMR clusters
         * - Neptune clusters
         * - SageMaker endpoint variants
         * - Spot Fleets
         * - Custom resources
         *
         * For all other scalable targets, the default value is 0:
         *
         * - Amazon Comprehend document classification and entity recognizer endpoints
         * - DynamoDB tables and global secondary indexes
         * - Amazon Keyspaces tables
         * - Lambda provisioned concurrency
         * - Amazon MSK broker storage
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleincooldown
         */
        readonly scaleInCooldown?: number;
        /**
         * The amount of time, in seconds, to wait for a previous scale-out activity to take effect.
         *
         * With the *scale-out cooldown period* , the intention is to continuously (but not excessively) scale out. After Application Auto Scaling successfully scales out using a target tracking scaling policy, it starts to calculate the cooldown time. The scaling policy won't increase the desired capacity again unless either a larger scale out is triggered or the cooldown period ends. While the cooldown period is in effect, the capacity added by the initiating scale-out activity is calculated as part of the desired capacity for the next scale-out activity.
         *
         * Application Auto Scaling provides a default value of 600 for Amazon ElastiCache replication groups and a default value of 300 for the following scalable targets:
         *
         * - AppStream 2.0 fleets
         * - Aurora DB clusters
         * - ECS services
         * - EMR clusters
         * - Neptune clusters
         * - SageMaker endpoint variants
         * - Spot Fleets
         * - Custom resources
         *
         * For all other scalable targets, the default value is 0:
         *
         * - Amazon Comprehend document classification and entity recognizer endpoints
         * - DynamoDB tables and global secondary indexes
         * - Amazon Keyspaces tables
         * - Lambda provisioned concurrency
         * - Amazon MSK broker storage
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleoutcooldown
         */
        readonly scaleOutCooldown?: number;
        /**
         * The target value for the metric. Although this property accepts numbers of type Double, it won't accept values that are either too small or too large. Values must be in the range of -2^360 to 2^360. The value must be a valid number based on the choice of metric. For example, if the metric is CPU utilization, then the target value is a percent value that represents how much of the CPU can be used before scaling out.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-targetvalue
         */
        readonly targetValue: number;
    }
}

/**
 * Determine whether the given properties match those of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScalingPolicy_TargetTrackingScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customizedMetricSpecification', CfnScalingPolicy_CustomizedMetricSpecificationPropertyValidator)(properties.customizedMetricSpecification));
    errors.collect(cdk.propertyValidator('disableScaleIn', cdk.validateBoolean)(properties.disableScaleIn));
    errors.collect(cdk.propertyValidator('predefinedMetricSpecification', CfnScalingPolicy_PredefinedMetricSpecificationPropertyValidator)(properties.predefinedMetricSpecification));
    errors.collect(cdk.propertyValidator('scaleInCooldown', cdk.validateNumber)(properties.scaleInCooldown));
    errors.collect(cdk.propertyValidator('scaleOutCooldown', cdk.validateNumber)(properties.scaleOutCooldown));
    errors.collect(cdk.propertyValidator('targetValue', cdk.requiredValidator)(properties.targetValue));
    errors.collect(cdk.propertyValidator('targetValue', cdk.validateNumber)(properties.targetValue));
    return errors.wrap('supplied properties not correct for "TargetTrackingScalingPolicyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.TargetTrackingScalingPolicyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationAutoScaling::ScalingPolicy.TargetTrackingScalingPolicyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScalingPolicy_TargetTrackingScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CustomizedMetricSpecification: cfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties.customizedMetricSpecification),
        DisableScaleIn: cdk.booleanToCloudFormation(properties.disableScaleIn),
        PredefinedMetricSpecification: cfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties.predefinedMetricSpecification),
        ScaleInCooldown: cdk.numberToCloudFormation(properties.scaleInCooldown),
        ScaleOutCooldown: cdk.numberToCloudFormation(properties.scaleOutCooldown),
        TargetValue: cdk.numberToCloudFormation(properties.targetValue),
    };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty>();
    ret.addPropertyResult('customizedMetricSpecification', 'CustomizedMetricSpecification', properties.CustomizedMetricSpecification != null ? CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties.CustomizedMetricSpecification) : undefined);
    ret.addPropertyResult('disableScaleIn', 'DisableScaleIn', properties.DisableScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableScaleIn) : undefined);
    ret.addPropertyResult('predefinedMetricSpecification', 'PredefinedMetricSpecification', properties.PredefinedMetricSpecification != null ? CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties.PredefinedMetricSpecification) : undefined);
    ret.addPropertyResult('scaleInCooldown', 'ScaleInCooldown', properties.ScaleInCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleInCooldown) : undefined);
    ret.addPropertyResult('scaleOutCooldown', 'ScaleOutCooldown', properties.ScaleOutCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleOutCooldown) : undefined);
    ret.addPropertyResult('targetValue', 'TargetValue', cfn_parse.FromCloudFormation.getNumber(properties.TargetValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
