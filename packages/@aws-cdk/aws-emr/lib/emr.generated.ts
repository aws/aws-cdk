// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:05.196Z","fingerprint":"P3tTUCvaegC17BZkt4LiHntc8cEcwNzuS2f170CVmxo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html
 */
export interface CfnClusterProps {

    /**
     * A specification of the number and type of Amazon EC2 instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-instances
     */
    readonly instances: CfnCluster.JobFlowInstancesConfigProperty | cdk.IResolvable;

    /**
     * Also called instance profile and EC2 role. An IAM role for an EMR cluster. The EC2 instances of the cluster assume this role. The default role is `EMR_EC2_DefaultRole` . In order to use the default role, you must have already created it using the CLI or console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-jobflowrole
     */
    readonly jobFlowRole: string;

    /**
     * The name of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-name
     */
    readonly name: string;

    /**
     * The IAM role that Amazon EMR assumes in order to access AWS resources on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-servicerole
     */
    readonly serviceRole: string;

    /**
     * A JSON string for selecting additional features.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-additionalinfo
     */
    readonly additionalInfo?: any | cdk.IResolvable;

    /**
     * The applications to install on this cluster, for example, Spark, Flink, Oozie, Zeppelin, and so on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-applications
     */
    readonly applications?: Array<CfnCluster.ApplicationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An IAM role for automatic scaling policies. The default role is `EMR_AutoScaling_DefaultRole` . The IAM role provides permissions that the automatic scaling feature requires to launch and terminate EC2 instances in an instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-autoscalingrole
     */
    readonly autoScalingRole?: string;

    /**
     * `AWS::EMR::Cluster.AutoTerminationPolicy`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-autoterminationpolicy
     */
    readonly autoTerminationPolicy?: CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable;

    /**
     * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-bootstrapactions
     */
    readonly bootstrapActions?: Array<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Applies only to Amazon EMR releases 4.x and later. The list of Configurations supplied to the EMR cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-configurations
     */
    readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Available only in Amazon EMR version 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI if the cluster uses a custom AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-customamiid
     */
    readonly customAmiId?: string;

    /**
     * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each EC2 instance. Available in Amazon EMR version 4.x and later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-ebsrootvolumesize
     */
    readonly ebsRootVolumeSize?: number;

    /**
     * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration. For more information see [Use Kerberos Authentication](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-kerberos.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-kerberosattributes
     */
    readonly kerberosAttributes?: CfnCluster.KerberosAttributesProperty | cdk.IResolvable;

    /**
     * The AWS KMS key used for encrypting log files. This attribute is only available with EMR version 5.30.0 and later, excluding EMR 6.0.0.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-logencryptionkmskeyid
     */
    readonly logEncryptionKmsKeyId?: string;

    /**
     * The path to the Amazon S3 location where logs for this cluster are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-loguri
     */
    readonly logUri?: string;

    /**
     * Creates or updates a managed scaling policy for an Amazon EMR cluster. The managed scaling policy defines the limits for resources, such as EC2 instances that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-managedscalingpolicy
     */
    readonly managedScalingPolicy?: CfnCluster.ManagedScalingPolicyProperty | cdk.IResolvable;

    /**
     * The Amazon Linux release specified in a cluster launch RunJobFlow request. If no Amazon Linux release was specified, the default Amazon Linux release is shown in the response.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-osreleaselabel
     */
    readonly osReleaseLabel?: string;

    /**
     * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster. Release labels are in the form `emr-x.x.x` , where x.x.x is an Amazon EMR release version such as `emr-5.14.0` . For more information about Amazon EMR release versions and included application versions and features, see [](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/) . The release label applies only to Amazon EMR releases version 4.0 and later. Earlier versions use `AmiVersion` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-releaselabel
     */
    readonly releaseLabel?: string;

    /**
     * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized. `TERMINATE_AT_INSTANCE_HOUR` indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. `TERMINATE_AT_TASK_COMPLETION` indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. `TERMINATE_AT_TASK_COMPLETION` is available only in Amazon EMR version 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-scaledownbehavior
     */
    readonly scaleDownBehavior?: string;

    /**
     * The name of the security configuration applied to the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-securityconfiguration
     */
    readonly securityConfiguration?: string;

    /**
     * Specifies the number of steps that can be executed concurrently. The default value is `1` . The maximum value is `256` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-stepconcurrencylevel
     */
    readonly stepConcurrencyLevel?: number;

    /**
     * A list of steps to run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-steps
     */
    readonly steps?: Array<CfnCluster.StepConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of tags associated with a cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Indicates whether the cluster is visible to all IAM users of the AWS account associated with the cluster. If this value is set to `true` , all IAM users of that AWS account can view and manage the cluster if they have the proper policy permissions set. If this value is `false` , only the IAM user that created the cluster can view and manage it. This value can be changed using the SetVisibleToAllUsers action.
     *
     * > When you create clusters directly through the EMR console or API, this value is set to `true` by default. However, for `AWS::EMR::Cluster` resources in CloudFormation, the default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-visibletoallusers
     */
    readonly visibleToAllUsers?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalInfo', cdk.validateObject)(properties.additionalInfo));
    errors.collect(cdk.propertyValidator('applications', cdk.listValidator(CfnCluster_ApplicationPropertyValidator))(properties.applications));
    errors.collect(cdk.propertyValidator('autoScalingRole', cdk.validateString)(properties.autoScalingRole));
    errors.collect(cdk.propertyValidator('autoTerminationPolicy', CfnCluster_AutoTerminationPolicyPropertyValidator)(properties.autoTerminationPolicy));
    errors.collect(cdk.propertyValidator('bootstrapActions', cdk.listValidator(CfnCluster_BootstrapActionConfigPropertyValidator))(properties.bootstrapActions));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnCluster_ConfigurationPropertyValidator))(properties.configurations));
    errors.collect(cdk.propertyValidator('customAmiId', cdk.validateString)(properties.customAmiId));
    errors.collect(cdk.propertyValidator('ebsRootVolumeSize', cdk.validateNumber)(properties.ebsRootVolumeSize));
    errors.collect(cdk.propertyValidator('instances', cdk.requiredValidator)(properties.instances));
    errors.collect(cdk.propertyValidator('instances', CfnCluster_JobFlowInstancesConfigPropertyValidator)(properties.instances));
    errors.collect(cdk.propertyValidator('jobFlowRole', cdk.requiredValidator)(properties.jobFlowRole));
    errors.collect(cdk.propertyValidator('jobFlowRole', cdk.validateString)(properties.jobFlowRole));
    errors.collect(cdk.propertyValidator('kerberosAttributes', CfnCluster_KerberosAttributesPropertyValidator)(properties.kerberosAttributes));
    errors.collect(cdk.propertyValidator('logEncryptionKmsKeyId', cdk.validateString)(properties.logEncryptionKmsKeyId));
    errors.collect(cdk.propertyValidator('logUri', cdk.validateString)(properties.logUri));
    errors.collect(cdk.propertyValidator('managedScalingPolicy', CfnCluster_ManagedScalingPolicyPropertyValidator)(properties.managedScalingPolicy));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('osReleaseLabel', cdk.validateString)(properties.osReleaseLabel));
    errors.collect(cdk.propertyValidator('releaseLabel', cdk.validateString)(properties.releaseLabel));
    errors.collect(cdk.propertyValidator('scaleDownBehavior', cdk.validateString)(properties.scaleDownBehavior));
    errors.collect(cdk.propertyValidator('securityConfiguration', cdk.validateString)(properties.securityConfiguration));
    errors.collect(cdk.propertyValidator('serviceRole', cdk.requiredValidator)(properties.serviceRole));
    errors.collect(cdk.propertyValidator('serviceRole', cdk.validateString)(properties.serviceRole));
    errors.collect(cdk.propertyValidator('stepConcurrencyLevel', cdk.validateNumber)(properties.stepConcurrencyLevel));
    errors.collect(cdk.propertyValidator('steps', cdk.listValidator(CfnCluster_StepConfigPropertyValidator))(properties.steps));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('visibleToAllUsers', cdk.validateBoolean)(properties.visibleToAllUsers));
    return errors.wrap('supplied properties not correct for "CfnClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster` resource.
 */
// @ts-ignore TS6133
function cfnClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnClusterPropsValidator(properties).assertSuccess();
    return {
        Instances: cfnClusterJobFlowInstancesConfigPropertyToCloudFormation(properties.instances),
        JobFlowRole: cdk.stringToCloudFormation(properties.jobFlowRole),
        Name: cdk.stringToCloudFormation(properties.name),
        ServiceRole: cdk.stringToCloudFormation(properties.serviceRole),
        AdditionalInfo: cdk.objectToCloudFormation(properties.additionalInfo),
        Applications: cdk.listMapper(cfnClusterApplicationPropertyToCloudFormation)(properties.applications),
        AutoScalingRole: cdk.stringToCloudFormation(properties.autoScalingRole),
        AutoTerminationPolicy: cfnClusterAutoTerminationPolicyPropertyToCloudFormation(properties.autoTerminationPolicy),
        BootstrapActions: cdk.listMapper(cfnClusterBootstrapActionConfigPropertyToCloudFormation)(properties.bootstrapActions),
        Configurations: cdk.listMapper(cfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
        CustomAmiId: cdk.stringToCloudFormation(properties.customAmiId),
        EbsRootVolumeSize: cdk.numberToCloudFormation(properties.ebsRootVolumeSize),
        KerberosAttributes: cfnClusterKerberosAttributesPropertyToCloudFormation(properties.kerberosAttributes),
        LogEncryptionKmsKeyId: cdk.stringToCloudFormation(properties.logEncryptionKmsKeyId),
        LogUri: cdk.stringToCloudFormation(properties.logUri),
        ManagedScalingPolicy: cfnClusterManagedScalingPolicyPropertyToCloudFormation(properties.managedScalingPolicy),
        OSReleaseLabel: cdk.stringToCloudFormation(properties.osReleaseLabel),
        ReleaseLabel: cdk.stringToCloudFormation(properties.releaseLabel),
        ScaleDownBehavior: cdk.stringToCloudFormation(properties.scaleDownBehavior),
        SecurityConfiguration: cdk.stringToCloudFormation(properties.securityConfiguration),
        StepConcurrencyLevel: cdk.numberToCloudFormation(properties.stepConcurrencyLevel),
        Steps: cdk.listMapper(cfnClusterStepConfigPropertyToCloudFormation)(properties.steps),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VisibleToAllUsers: cdk.booleanToCloudFormation(properties.visibleToAllUsers),
    };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
    ret.addPropertyResult('instances', 'Instances', CfnClusterJobFlowInstancesConfigPropertyFromCloudFormation(properties.Instances));
    ret.addPropertyResult('jobFlowRole', 'JobFlowRole', cfn_parse.FromCloudFormation.getString(properties.JobFlowRole));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('serviceRole', 'ServiceRole', cfn_parse.FromCloudFormation.getString(properties.ServiceRole));
    ret.addPropertyResult('additionalInfo', 'AdditionalInfo', properties.AdditionalInfo != null ? cfn_parse.FromCloudFormation.getAny(properties.AdditionalInfo) : undefined);
    ret.addPropertyResult('applications', 'Applications', properties.Applications != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterApplicationPropertyFromCloudFormation)(properties.Applications) : undefined);
    ret.addPropertyResult('autoScalingRole', 'AutoScalingRole', properties.AutoScalingRole != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingRole) : undefined);
    ret.addPropertyResult('autoTerminationPolicy', 'AutoTerminationPolicy', properties.AutoTerminationPolicy != null ? CfnClusterAutoTerminationPolicyPropertyFromCloudFormation(properties.AutoTerminationPolicy) : undefined);
    ret.addPropertyResult('bootstrapActions', 'BootstrapActions', properties.BootstrapActions != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterBootstrapActionConfigPropertyFromCloudFormation)(properties.BootstrapActions) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addPropertyResult('customAmiId', 'CustomAmiId', properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined);
    ret.addPropertyResult('ebsRootVolumeSize', 'EbsRootVolumeSize', properties.EbsRootVolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.EbsRootVolumeSize) : undefined);
    ret.addPropertyResult('kerberosAttributes', 'KerberosAttributes', properties.KerberosAttributes != null ? CfnClusterKerberosAttributesPropertyFromCloudFormation(properties.KerberosAttributes) : undefined);
    ret.addPropertyResult('logEncryptionKmsKeyId', 'LogEncryptionKmsKeyId', properties.LogEncryptionKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.LogEncryptionKmsKeyId) : undefined);
    ret.addPropertyResult('logUri', 'LogUri', properties.LogUri != null ? cfn_parse.FromCloudFormation.getString(properties.LogUri) : undefined);
    ret.addPropertyResult('managedScalingPolicy', 'ManagedScalingPolicy', properties.ManagedScalingPolicy != null ? CfnClusterManagedScalingPolicyPropertyFromCloudFormation(properties.ManagedScalingPolicy) : undefined);
    ret.addPropertyResult('osReleaseLabel', 'OSReleaseLabel', properties.OSReleaseLabel != null ? cfn_parse.FromCloudFormation.getString(properties.OSReleaseLabel) : undefined);
    ret.addPropertyResult('releaseLabel', 'ReleaseLabel', properties.ReleaseLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ReleaseLabel) : undefined);
    ret.addPropertyResult('scaleDownBehavior', 'ScaleDownBehavior', properties.ScaleDownBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.ScaleDownBehavior) : undefined);
    ret.addPropertyResult('securityConfiguration', 'SecurityConfiguration', properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityConfiguration) : undefined);
    ret.addPropertyResult('stepConcurrencyLevel', 'StepConcurrencyLevel', properties.StepConcurrencyLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.StepConcurrencyLevel) : undefined);
    ret.addPropertyResult('steps', 'Steps', properties.Steps != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterStepConfigPropertyFromCloudFormation)(properties.Steps) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('visibleToAllUsers', 'VisibleToAllUsers', properties.VisibleToAllUsers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.VisibleToAllUsers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::Cluster`
 *
 * The `AWS::EMR::Cluster` resource specifies an Amazon EMR cluster. This cluster is a collection of Amazon EC2 instances that run open source big data frameworks and applications to process and analyze vast amounts of data. For more information, see the [Amazon EMR Management Guide](https://docs.aws.amazon.com//emr/latest/ManagementGuide/) .
 *
 * Amazon EMR now supports launching task instance groups and task instance fleets as part of the `AWS::EMR::Cluster` resource. This can be done by using the `JobFlowInstancesConfig` property type's `TaskInstanceGroups` and `TaskInstanceFleets` subproperties. Using these subproperties reduces delays in provisioning task nodes compared to specifying task nodes with the `AWS::EMR::InstanceGroupConfig` and `AWS::EMR::InstanceFleetConfig` resources. Please refer to the examples at the bottom of this page to learn how to use these subproperties.
 *
 * @cloudformationResource AWS::EMR::Cluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::Cluster";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The public DNS name of the master node (instance), such as `ec2-12-123-123-123.us-west-2.compute.amazonaws.com` .
     * @cloudformationAttribute MasterPublicDNS
     */
    public readonly attrMasterPublicDns: string;

    /**
     * A specification of the number and type of Amazon EC2 instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-instances
     */
    public instances: CfnCluster.JobFlowInstancesConfigProperty | cdk.IResolvable;

    /**
     * Also called instance profile and EC2 role. An IAM role for an EMR cluster. The EC2 instances of the cluster assume this role. The default role is `EMR_EC2_DefaultRole` . In order to use the default role, you must have already created it using the CLI or console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-jobflowrole
     */
    public jobFlowRole: string;

    /**
     * The name of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-name
     */
    public name: string;

    /**
     * The IAM role that Amazon EMR assumes in order to access AWS resources on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-servicerole
     */
    public serviceRole: string;

    /**
     * A JSON string for selecting additional features.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-additionalinfo
     */
    public additionalInfo: any | cdk.IResolvable | undefined;

    /**
     * The applications to install on this cluster, for example, Spark, Flink, Oozie, Zeppelin, and so on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-applications
     */
    public applications: Array<CfnCluster.ApplicationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An IAM role for automatic scaling policies. The default role is `EMR_AutoScaling_DefaultRole` . The IAM role provides permissions that the automatic scaling feature requires to launch and terminate EC2 instances in an instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-autoscalingrole
     */
    public autoScalingRole: string | undefined;

    /**
     * `AWS::EMR::Cluster.AutoTerminationPolicy`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-autoterminationpolicy
     */
    public autoTerminationPolicy: CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable | undefined;

    /**
     * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-bootstrapactions
     */
    public bootstrapActions: Array<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Applies only to Amazon EMR releases 4.x and later. The list of Configurations supplied to the EMR cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-configurations
     */
    public configurations: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Available only in Amazon EMR version 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI if the cluster uses a custom AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-customamiid
     */
    public customAmiId: string | undefined;

    /**
     * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each EC2 instance. Available in Amazon EMR version 4.x and later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-ebsrootvolumesize
     */
    public ebsRootVolumeSize: number | undefined;

    /**
     * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration. For more information see [Use Kerberos Authentication](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-kerberos.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-kerberosattributes
     */
    public kerberosAttributes: CfnCluster.KerberosAttributesProperty | cdk.IResolvable | undefined;

    /**
     * The AWS KMS key used for encrypting log files. This attribute is only available with EMR version 5.30.0 and later, excluding EMR 6.0.0.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-logencryptionkmskeyid
     */
    public logEncryptionKmsKeyId: string | undefined;

    /**
     * The path to the Amazon S3 location where logs for this cluster are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-loguri
     */
    public logUri: string | undefined;

    /**
     * Creates or updates a managed scaling policy for an Amazon EMR cluster. The managed scaling policy defines the limits for resources, such as EC2 instances that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-managedscalingpolicy
     */
    public managedScalingPolicy: CfnCluster.ManagedScalingPolicyProperty | cdk.IResolvable | undefined;

    /**
     * The Amazon Linux release specified in a cluster launch RunJobFlow request. If no Amazon Linux release was specified, the default Amazon Linux release is shown in the response.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-osreleaselabel
     */
    public osReleaseLabel: string | undefined;

    /**
     * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster. Release labels are in the form `emr-x.x.x` , where x.x.x is an Amazon EMR release version such as `emr-5.14.0` . For more information about Amazon EMR release versions and included application versions and features, see [](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/) . The release label applies only to Amazon EMR releases version 4.0 and later. Earlier versions use `AmiVersion` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-releaselabel
     */
    public releaseLabel: string | undefined;

    /**
     * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized. `TERMINATE_AT_INSTANCE_HOUR` indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. `TERMINATE_AT_TASK_COMPLETION` indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. `TERMINATE_AT_TASK_COMPLETION` is available only in Amazon EMR version 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-scaledownbehavior
     */
    public scaleDownBehavior: string | undefined;

    /**
     * The name of the security configuration applied to the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-securityconfiguration
     */
    public securityConfiguration: string | undefined;

    /**
     * Specifies the number of steps that can be executed concurrently. The default value is `1` . The maximum value is `256` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-stepconcurrencylevel
     */
    public stepConcurrencyLevel: number | undefined;

    /**
     * A list of steps to run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-steps
     */
    public steps: Array<CfnCluster.StepConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of tags associated with a cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Indicates whether the cluster is visible to all IAM users of the AWS account associated with the cluster. If this value is set to `true` , all IAM users of that AWS account can view and manage the cluster if they have the proper policy permissions set. If this value is `false` , only the IAM user that created the cluster can view and manage it. This value can be changed using the SetVisibleToAllUsers action.
     *
     * > When you create clusters directly through the EMR console or API, this value is set to `true` by default. However, for `AWS::EMR::Cluster` resources in CloudFormation, the default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-visibletoallusers
     */
    public visibleToAllUsers: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::EMR::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
        super(scope, id, { type: CfnCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instances', this);
        cdk.requireProperty(props, 'jobFlowRole', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'serviceRole', this);
        this.attrMasterPublicDns = cdk.Token.asString(this.getAtt('MasterPublicDNS', cdk.ResolutionTypeHint.STRING));

        this.instances = props.instances;
        this.jobFlowRole = props.jobFlowRole;
        this.name = props.name;
        this.serviceRole = props.serviceRole;
        this.additionalInfo = props.additionalInfo;
        this.applications = props.applications;
        this.autoScalingRole = props.autoScalingRole;
        this.autoTerminationPolicy = props.autoTerminationPolicy;
        this.bootstrapActions = props.bootstrapActions;
        this.configurations = props.configurations;
        this.customAmiId = props.customAmiId;
        this.ebsRootVolumeSize = props.ebsRootVolumeSize;
        this.kerberosAttributes = props.kerberosAttributes;
        this.logEncryptionKmsKeyId = props.logEncryptionKmsKeyId;
        this.logUri = props.logUri;
        this.managedScalingPolicy = props.managedScalingPolicy;
        this.osReleaseLabel = props.osReleaseLabel;
        this.releaseLabel = props.releaseLabel;
        this.scaleDownBehavior = props.scaleDownBehavior;
        this.securityConfiguration = props.securityConfiguration;
        this.stepConcurrencyLevel = props.stepConcurrencyLevel;
        this.steps = props.steps;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMR::Cluster", props.tags, { tagPropertyName: 'tags' });
        this.visibleToAllUsers = props.visibleToAllUsers;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::EMR::Cluster\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instances: this.instances,
            jobFlowRole: this.jobFlowRole,
            name: this.name,
            serviceRole: this.serviceRole,
            additionalInfo: this.additionalInfo,
            applications: this.applications,
            autoScalingRole: this.autoScalingRole,
            autoTerminationPolicy: this.autoTerminationPolicy,
            bootstrapActions: this.bootstrapActions,
            configurations: this.configurations,
            customAmiId: this.customAmiId,
            ebsRootVolumeSize: this.ebsRootVolumeSize,
            kerberosAttributes: this.kerberosAttributes,
            logEncryptionKmsKeyId: this.logEncryptionKmsKeyId,
            logUri: this.logUri,
            managedScalingPolicy: this.managedScalingPolicy,
            osReleaseLabel: this.osReleaseLabel,
            releaseLabel: this.releaseLabel,
            scaleDownBehavior: this.scaleDownBehavior,
            securityConfiguration: this.securityConfiguration,
            stepConcurrencyLevel: this.stepConcurrencyLevel,
            steps: this.steps,
            tags: this.tags.renderTags(),
            visibleToAllUsers: this.visibleToAllUsers,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnClusterPropsToCloudFormation(props);
    }
}

export namespace CfnCluster {
    /**
     * `Application` is a property of `AWS::EMR::Cluster` . The `Application` property type defines the open-source big data applications for EMR to install and configure when a cluster is created.
     *
     * With Amazon EMR release version 4.0 and later, the only accepted parameter is the application `Name` . To pass arguments to these applications, you use configuration classifications specified using JSON objects in a `Configuration` property. For more information, see [Configuring Applications](https://docs.aws.amazon.com//emr/latest/ReleaseGuide/emr-configure-apps.html) .
     *
     * With earlier Amazon EMR releases, the application is any AWS or third-party software that you can add to the cluster. You can specify the version of the application and arguments to pass to it. Amazon EMR accepts and forwards the argument list to the corresponding installation script as a bootstrap action argument.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-application.html
     */
    export interface ApplicationProperty {
        /**
         * This option is for advanced users only. This is meta information about clusters and applications that are used for testing and troubleshooting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-application.html#cfn-elasticmapreduce-cluster-application-additionalinfo
         */
        readonly additionalInfo?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * Arguments for Amazon EMR to pass to the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-application.html#cfn-elasticmapreduce-cluster-application-args
         */
        readonly args?: string[];
        /**
         * The name of the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-application.html#cfn-elasticmapreduce-cluster-application-name
         */
        readonly name?: string;
        /**
         * The version of the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-application.html#cfn-elasticmapreduce-cluster-application-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ApplicationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalInfo', cdk.hashValidator(cdk.validateString))(properties.additionalInfo));
    errors.collect(cdk.propertyValidator('args', cdk.listValidator(cdk.validateString))(properties.args));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "ApplicationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.Application` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.Application` resource.
 */
// @ts-ignore TS6133
function cfnClusterApplicationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ApplicationPropertyValidator(properties).assertSuccess();
    return {
        AdditionalInfo: cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalInfo),
        Args: cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnClusterApplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ApplicationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ApplicationProperty>();
    ret.addPropertyResult('additionalInfo', 'AdditionalInfo', properties.AdditionalInfo != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalInfo) : undefined);
    ret.addPropertyResult('args', 'Args', properties.Args != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Args) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` . `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html
     */
    export interface AutoScalingPolicyProperty {
        /**
         * The upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activity will not cause an instance group to grow above or below these limits.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html#cfn-elasticmapreduce-cluster-autoscalingpolicy-constraints
         */
        readonly constraints: CfnCluster.ScalingConstraintsProperty | cdk.IResolvable;
        /**
         * The scale-in and scale-out rules that comprise the automatic scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html#cfn-elasticmapreduce-cluster-autoscalingpolicy-rules
         */
        readonly rules: Array<CfnCluster.ScalingRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AutoScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_AutoScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('constraints', cdk.requiredValidator)(properties.constraints));
    errors.collect(cdk.propertyValidator('constraints', CfnCluster_ScalingConstraintsPropertyValidator)(properties.constraints));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnCluster_ScalingRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "AutoScalingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.AutoScalingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.AutoScalingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnClusterAutoScalingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_AutoScalingPolicyPropertyValidator(properties).assertSuccess();
    return {
        Constraints: cfnClusterScalingConstraintsPropertyToCloudFormation(properties.constraints),
        Rules: cdk.listMapper(cfnClusterScalingRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnClusterAutoScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.AutoScalingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.AutoScalingPolicyProperty>();
    ret.addPropertyResult('constraints', 'Constraints', CfnClusterScalingConstraintsPropertyFromCloudFormation(properties.Constraints));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnClusterScalingRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * An auto-termination policy for an Amazon EMR cluster. An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates. For alternative cluster termination options, see [Control cluster termination](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-termination.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoterminationpolicy.html
     */
    export interface AutoTerminationPolicyProperty {
        /**
         * Specifies the amount of idle time in seconds after which the cluster automatically terminates. You can specify a minimum of 60 seconds and a maximum of 604800 seconds (seven days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoterminationpolicy.html#cfn-elasticmapreduce-cluster-autoterminationpolicy-idletimeout
         */
        readonly idleTimeout?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AutoTerminationPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoTerminationPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_AutoTerminationPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idleTimeout', cdk.validateNumber)(properties.idleTimeout));
    return errors.wrap('supplied properties not correct for "AutoTerminationPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.AutoTerminationPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AutoTerminationPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.AutoTerminationPolicy` resource.
 */
// @ts-ignore TS6133
function cfnClusterAutoTerminationPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_AutoTerminationPolicyPropertyValidator(properties).assertSuccess();
    return {
        IdleTimeout: cdk.numberToCloudFormation(properties.idleTimeout),
    };
}

// @ts-ignore TS6133
function CfnClusterAutoTerminationPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.AutoTerminationPolicyProperty>();
    ret.addPropertyResult('idleTimeout', 'IdleTimeout', properties.IdleTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `BootstrapActionConfig` is a property of `AWS::EMR::Cluster` that can be used to run bootstrap actions on EMR clusters. You can use a bootstrap action to install software and configure EC2 instances for all cluster nodes before EMR installs and configures open-source big data applications on cluster instances. For more information, see [Create Bootstrap Actions to Install Additional Software](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-plan-bootstrap.html) in the *Amazon EMR Management Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html
     */
    export interface BootstrapActionConfigProperty {
        /**
         * The name of the bootstrap action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-name
         */
        readonly name: string;
        /**
         * The script run by the bootstrap action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-scriptbootstrapaction
         */
        readonly scriptBootstrapAction: CfnCluster.ScriptBootstrapActionConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BootstrapActionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BootstrapActionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_BootstrapActionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scriptBootstrapAction', cdk.requiredValidator)(properties.scriptBootstrapAction));
    errors.collect(cdk.propertyValidator('scriptBootstrapAction', CfnCluster_ScriptBootstrapActionConfigPropertyValidator)(properties.scriptBootstrapAction));
    return errors.wrap('supplied properties not correct for "BootstrapActionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.BootstrapActionConfig` resource
 *
 * @param properties - the TypeScript properties of a `BootstrapActionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.BootstrapActionConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterBootstrapActionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_BootstrapActionConfigPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ScriptBootstrapAction: cfnClusterScriptBootstrapActionConfigPropertyToCloudFormation(properties.scriptBootstrapAction),
    };
}

// @ts-ignore TS6133
function CfnClusterBootstrapActionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.BootstrapActionConfigProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('scriptBootstrapAction', 'ScriptBootstrapAction', CfnClusterScriptBootstrapActionConfigPropertyFromCloudFormation(properties.ScriptBootstrapAction));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `CloudWatchAlarmDefinition` is a subproperty of the `ScalingTrigger` property, which determines when to trigger an automatic scaling activity. Scaling activity begins when you satisfy the defined alarm conditions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html
     */
    export interface CloudWatchAlarmDefinitionProperty {
        /**
         * Determines how the metric specified by `MetricName` is compared to the value specified by `Threshold` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * A CloudWatch metric dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-dimensions
         */
        readonly dimensions?: Array<CfnCluster.MetricDimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The number of periods, in five-minute increments, during which the alarm condition must exist before the alarm triggers automatic scaling activity. The default value is `1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-evaluationperiods
         */
        readonly evaluationPeriods?: number;
        /**
         * The name of the CloudWatch metric that is watched to determine an alarm condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-metricname
         */
        readonly metricName: string;
        /**
         * The namespace for the CloudWatch metric. The default is `AWS/ElasticMapReduce` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-namespace
         */
        readonly namespace?: string;
        /**
         * The period, in seconds, over which the statistic is applied. EMR CloudWatch metrics are emitted every five minutes (300 seconds), so if an EMR CloudWatch metric is specified, specify `300` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-period
         */
        readonly period: number;
        /**
         * The statistic to apply to the metric associated with the alarm. The default is `AVERAGE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-statistic
         */
        readonly statistic?: string;
        /**
         * The value against which the specified statistic is compared.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-threshold
         */
        readonly threshold: number;
        /**
         * The unit of measure associated with the CloudWatch metric being watched. The value specified for `Unit` must correspond to the units specified in the CloudWatch metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-cluster-cloudwatchalarmdefinition-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchAlarmDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_CloudWatchAlarmDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnCluster_MetricDimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.validateNumber)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('period', cdk.requiredValidator)(properties.period));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('statistic', cdk.validateString)(properties.statistic));
    errors.collect(cdk.propertyValidator('threshold', cdk.requiredValidator)(properties.threshold));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "CloudWatchAlarmDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.CloudWatchAlarmDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.CloudWatchAlarmDefinition` resource.
 */
// @ts-ignore TS6133
function cfnClusterCloudWatchAlarmDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_CloudWatchAlarmDefinitionPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        Dimensions: cdk.listMapper(cfnClusterMetricDimensionPropertyToCloudFormation)(properties.dimensions),
        EvaluationPeriods: cdk.numberToCloudFormation(properties.evaluationPeriods),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        Period: cdk.numberToCloudFormation(properties.period),
        Statistic: cdk.stringToCloudFormation(properties.statistic),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnClusterCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.CloudWatchAlarmDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.CloudWatchAlarmDefinitionProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('evaluationPeriods', 'EvaluationPeriods', properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('period', 'Period', cfn_parse.FromCloudFormation.getNumber(properties.Period));
    ret.addPropertyResult('statistic', 'Statistic', properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined);
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The EC2 unit limits for a managed scaling policy. The managed scaling activity of a cluster can not be above or below these limits. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html
     */
    export interface ComputeLimitsProperty {
        /**
         * The upper boundary of EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html#cfn-elasticmapreduce-cluster-computelimits-maximumcapacityunits
         */
        readonly maximumCapacityUnits: number;
        /**
         * The upper boundary of EC2 units for core node type in a cluster. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The core units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between core and task nodes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html#cfn-elasticmapreduce-cluster-computelimits-maximumcorecapacityunits
         */
        readonly maximumCoreCapacityUnits?: number;
        /**
         * The upper boundary of On-Demand EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The On-Demand units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between On-Demand and Spot Instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html#cfn-elasticmapreduce-cluster-computelimits-maximumondemandcapacityunits
         */
        readonly maximumOnDemandCapacityUnits?: number;
        /**
         * The lower boundary of EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html#cfn-elasticmapreduce-cluster-computelimits-minimumcapacityunits
         */
        readonly minimumCapacityUnits: number;
        /**
         * The unit type used for specifying a managed scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-computelimits.html#cfn-elasticmapreduce-cluster-computelimits-unittype
         */
        readonly unitType: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComputeLimitsProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeLimitsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ComputeLimitsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maximumCapacityUnits', cdk.requiredValidator)(properties.maximumCapacityUnits));
    errors.collect(cdk.propertyValidator('maximumCapacityUnits', cdk.validateNumber)(properties.maximumCapacityUnits));
    errors.collect(cdk.propertyValidator('maximumCoreCapacityUnits', cdk.validateNumber)(properties.maximumCoreCapacityUnits));
    errors.collect(cdk.propertyValidator('maximumOnDemandCapacityUnits', cdk.validateNumber)(properties.maximumOnDemandCapacityUnits));
    errors.collect(cdk.propertyValidator('minimumCapacityUnits', cdk.requiredValidator)(properties.minimumCapacityUnits));
    errors.collect(cdk.propertyValidator('minimumCapacityUnits', cdk.validateNumber)(properties.minimumCapacityUnits));
    errors.collect(cdk.propertyValidator('unitType', cdk.requiredValidator)(properties.unitType));
    errors.collect(cdk.propertyValidator('unitType', cdk.validateString)(properties.unitType));
    return errors.wrap('supplied properties not correct for "ComputeLimitsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ComputeLimits` resource
 *
 * @param properties - the TypeScript properties of a `ComputeLimitsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ComputeLimits` resource.
 */
// @ts-ignore TS6133
function cfnClusterComputeLimitsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ComputeLimitsPropertyValidator(properties).assertSuccess();
    return {
        MaximumCapacityUnits: cdk.numberToCloudFormation(properties.maximumCapacityUnits),
        MaximumCoreCapacityUnits: cdk.numberToCloudFormation(properties.maximumCoreCapacityUnits),
        MaximumOnDemandCapacityUnits: cdk.numberToCloudFormation(properties.maximumOnDemandCapacityUnits),
        MinimumCapacityUnits: cdk.numberToCloudFormation(properties.minimumCapacityUnits),
        UnitType: cdk.stringToCloudFormation(properties.unitType),
    };
}

// @ts-ignore TS6133
function CfnClusterComputeLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ComputeLimitsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ComputeLimitsProperty>();
    ret.addPropertyResult('maximumCapacityUnits', 'MaximumCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.MaximumCapacityUnits));
    ret.addPropertyResult('maximumCoreCapacityUnits', 'MaximumCoreCapacityUnits', properties.MaximumCoreCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumCoreCapacityUnits) : undefined);
    ret.addPropertyResult('maximumOnDemandCapacityUnits', 'MaximumOnDemandCapacityUnits', properties.MaximumOnDemandCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumOnDemandCapacityUnits) : undefined);
    ret.addPropertyResult('minimumCapacityUnits', 'MinimumCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.MinimumCapacityUnits));
    ret.addPropertyResult('unitType', 'UnitType', cfn_parse.FromCloudFormation.getString(properties.UnitType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * > Used only with Amazon EMR release 4.0 and later.
     *
     * `Configuration` is a subproperty of `InstanceFleetConfig` or `InstanceGroupConfig` . `Configuration` specifies optional configurations for customizing open-source big data applications and environment parameters. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) in the *Amazon EMR Release Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-configuration.html
     */
    export interface ConfigurationProperty {
        /**
         * The classification within a configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-configuration.html#cfn-elasticmapreduce-cluster-configuration-classification
         */
        readonly classification?: string;
        /**
         * A list of additional configurations to apply within a configuration object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-configuration.html#cfn-elasticmapreduce-cluster-configuration-configurationproperties
         */
        readonly configurationProperties?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * A list of additional configurations to apply within a configuration object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-configuration.html#cfn-elasticmapreduce-cluster-configuration-configurations
         */
        readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('classification', cdk.validateString)(properties.classification));
    errors.collect(cdk.propertyValidator('configurationProperties', cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnCluster_ConfigurationPropertyValidator))(properties.configurations));
    return errors.wrap('supplied properties not correct for "ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.Configuration` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.Configuration` resource.
 */
// @ts-ignore TS6133
function cfnClusterConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Classification: cdk.stringToCloudFormation(properties.classification),
        ConfigurationProperties: cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
        Configurations: cdk.listMapper(cfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
    };
}

// @ts-ignore TS6133
function CfnClusterConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ConfigurationProperty>();
    ret.addPropertyResult('classification', 'Classification', properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined);
    ret.addPropertyResult('configurationProperties', 'ConfigurationProperties', properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `EbsBlockDeviceConfig` is a subproperty of the `EbsConfiguration` property type. `EbsBlockDeviceConfig` defines the number and type of EBS volumes to associate with all EC2 instances in an EMR cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html
     */
    export interface EbsBlockDeviceConfigProperty {
        /**
         * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an EC2 instance in the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html#cfn-elasticmapreduce-cluster-ebsblockdeviceconfig-volumespecification
         */
        readonly volumeSpecification: CfnCluster.VolumeSpecificationProperty | cdk.IResolvable;
        /**
         * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html#cfn-elasticmapreduce-cluster-ebsblockdeviceconfig-volumesperinstance
         */
        readonly volumesPerInstance?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_EbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('volumeSpecification', cdk.requiredValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumeSpecification', CfnCluster_VolumeSpecificationPropertyValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumesPerInstance', cdk.validateNumber)(properties.volumesPerInstance));
    return errors.wrap('supplied properties not correct for "EbsBlockDeviceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.EbsBlockDeviceConfig` resource
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.EbsBlockDeviceConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_EbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
    return {
        VolumeSpecification: cfnClusterVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
        VolumesPerInstance: cdk.numberToCloudFormation(properties.volumesPerInstance),
    };
}

// @ts-ignore TS6133
function CfnClusterEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EbsBlockDeviceConfigProperty>();
    ret.addPropertyResult('volumeSpecification', 'VolumeSpecification', CfnClusterVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification));
    ret.addPropertyResult('volumesPerInstance', 'VolumesPerInstance', properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `EbsConfiguration` is a subproperty of `InstanceFleetConfig` or `InstanceGroupConfig` . `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html
     */
    export interface EbsConfigurationProperty {
        /**
         * An array of Amazon EBS volume specifications attached to a cluster instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html#cfn-elasticmapreduce-cluster-ebsconfiguration-ebsblockdeviceconfigs
         */
        readonly ebsBlockDeviceConfigs?: Array<CfnCluster.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Indicates whether an Amazon EBS volume is EBS-optimized.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html#cfn-elasticmapreduce-cluster-ebsconfiguration-ebsoptimized
         */
        readonly ebsOptimized?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_EbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ebsBlockDeviceConfigs', cdk.listValidator(CfnCluster_EbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
    errors.collect(cdk.propertyValidator('ebsOptimized', cdk.validateBoolean)(properties.ebsOptimized));
    return errors.wrap('supplied properties not correct for "EbsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.EbsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.EbsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnClusterEbsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_EbsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EbsBlockDeviceConfigs: cdk.listMapper(cfnClusterEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
        EbsOptimized: cdk.booleanToCloudFormation(properties.ebsOptimized),
    };
}

// @ts-ignore TS6133
function CfnClusterEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EbsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EbsConfigurationProperty>();
    ret.addPropertyResult('ebsBlockDeviceConfigs', 'EbsBlockDeviceConfigs', properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined);
    ret.addPropertyResult('ebsOptimized', 'EbsOptimized', properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed. The main function submits a job for the cluster to execute as a step on the master node, and then waits for the job to finish or fail before executing subsequent steps.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-hadoopjarstepconfig.html
     */
    export interface HadoopJarStepConfigProperty {
        /**
         * A list of command line arguments passed to the JAR file's main function when executed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-hadoopjarstepconfig.html#cfn-elasticmapreduce-cluster-hadoopjarstepconfig-args
         */
        readonly args?: string[];
        /**
         * A path to a JAR file run during the step.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-hadoopjarstepconfig.html#cfn-elasticmapreduce-cluster-hadoopjarstepconfig-jar
         */
        readonly jar: string;
        /**
         * The name of the main class in the specified Java file. If not specified, the JAR file should specify a Main-Class in its manifest file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-hadoopjarstepconfig.html#cfn-elasticmapreduce-cluster-hadoopjarstepconfig-mainclass
         */
        readonly mainClass?: string;
        /**
         * A list of Java properties that are set when the step runs. You can use these properties to pass key-value pairs to your main function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-hadoopjarstepconfig.html#cfn-elasticmapreduce-cluster-hadoopjarstepconfig-stepproperties
         */
        readonly stepProperties?: Array<CfnCluster.KeyValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HadoopJarStepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_HadoopJarStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('args', cdk.listValidator(cdk.validateString))(properties.args));
    errors.collect(cdk.propertyValidator('jar', cdk.requiredValidator)(properties.jar));
    errors.collect(cdk.propertyValidator('jar', cdk.validateString)(properties.jar));
    errors.collect(cdk.propertyValidator('mainClass', cdk.validateString)(properties.mainClass));
    errors.collect(cdk.propertyValidator('stepProperties', cdk.listValidator(CfnCluster_KeyValuePropertyValidator))(properties.stepProperties));
    return errors.wrap('supplied properties not correct for "HadoopJarStepConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.HadoopJarStepConfig` resource
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.HadoopJarStepConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterHadoopJarStepConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_HadoopJarStepConfigPropertyValidator(properties).assertSuccess();
    return {
        Args: cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
        Jar: cdk.stringToCloudFormation(properties.jar),
        MainClass: cdk.stringToCloudFormation(properties.mainClass),
        StepProperties: cdk.listMapper(cfnClusterKeyValuePropertyToCloudFormation)(properties.stepProperties),
    };
}

// @ts-ignore TS6133
function CfnClusterHadoopJarStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.HadoopJarStepConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.HadoopJarStepConfigProperty>();
    ret.addPropertyResult('args', 'Args', properties.Args != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Args) : undefined);
    ret.addPropertyResult('jar', 'Jar', cfn_parse.FromCloudFormation.getString(properties.Jar));
    ret.addPropertyResult('mainClass', 'MainClass', properties.MainClass != null ? cfn_parse.FromCloudFormation.getString(properties.MainClass) : undefined);
    ret.addPropertyResult('stepProperties', 'StepProperties', properties.StepProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterKeyValuePropertyFromCloudFormation)(properties.StepProperties) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * Use `InstanceFleetConfig` to define instance fleets for an EMR cluster. A cluster can not use both instance fleets and instance groups. For more information, see [Configure Instance Fleets](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html
     */
    export interface InstanceFleetConfigProperty {
        /**
         * The instance type configurations that define the EC2 instances in the instance fleet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html#cfn-elasticmapreduce-cluster-instancefleetconfig-instancetypeconfigs
         */
        readonly instanceTypeConfigs?: Array<CfnCluster.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The launch specification for the instance fleet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html#cfn-elasticmapreduce-cluster-instancefleetconfig-launchspecifications
         */
        readonly launchSpecifications?: CfnCluster.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable;
        /**
         * The friendly name of the instance fleet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html#cfn-elasticmapreduce-cluster-instancefleetconfig-name
         */
        readonly name?: string;
        /**
         * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision. When the instance fleet launches, Amazon EMR tries to provision On-Demand instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When an On-Demand instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
         *
         * > If not specified or set to 0, only Spot instances are provisioned for the instance fleet using `TargetSpotCapacity` . At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html#cfn-elasticmapreduce-cluster-instancefleetconfig-targetondemandcapacity
         */
        readonly targetOnDemandCapacity?: number;
        /**
         * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision. When the instance fleet launches, Amazon EMR tries to provision Spot instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When a Spot instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
         *
         * > If not specified or set to 0, only On-Demand instances are provisioned for the instance fleet. At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetconfig.html#cfn-elasticmapreduce-cluster-instancefleetconfig-targetspotcapacity
         */
        readonly targetSpotCapacity?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceFleetConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_InstanceFleetConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('instanceTypeConfigs', cdk.listValidator(CfnCluster_InstanceTypeConfigPropertyValidator))(properties.instanceTypeConfigs));
    errors.collect(cdk.propertyValidator('launchSpecifications', CfnCluster_InstanceFleetProvisioningSpecificationsPropertyValidator)(properties.launchSpecifications));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('targetOnDemandCapacity', cdk.validateNumber)(properties.targetOnDemandCapacity));
    errors.collect(cdk.propertyValidator('targetSpotCapacity', cdk.validateNumber)(properties.targetSpotCapacity));
    return errors.wrap('supplied properties not correct for "InstanceFleetConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceFleetConfig` resource
 *
 * @param properties - the TypeScript properties of a `InstanceFleetConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceFleetConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterInstanceFleetConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_InstanceFleetConfigPropertyValidator(properties).assertSuccess();
    return {
        InstanceTypeConfigs: cdk.listMapper(cfnClusterInstanceTypeConfigPropertyToCloudFormation)(properties.instanceTypeConfigs),
        LaunchSpecifications: cfnClusterInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties.launchSpecifications),
        Name: cdk.stringToCloudFormation(properties.name),
        TargetOnDemandCapacity: cdk.numberToCloudFormation(properties.targetOnDemandCapacity),
        TargetSpotCapacity: cdk.numberToCloudFormation(properties.targetSpotCapacity),
    };
}

// @ts-ignore TS6133
function CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceFleetConfigProperty>();
    ret.addPropertyResult('instanceTypeConfigs', 'InstanceTypeConfigs', properties.InstanceTypeConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceTypeConfigPropertyFromCloudFormation)(properties.InstanceTypeConfigs) : undefined);
    ret.addPropertyResult('launchSpecifications', 'LaunchSpecifications', properties.LaunchSpecifications != null ? CfnClusterInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties.LaunchSpecifications) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('targetOnDemandCapacity', 'TargetOnDemandCapacity', properties.TargetOnDemandCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetOnDemandCapacity) : undefined);
    ret.addPropertyResult('targetSpotCapacity', 'TargetSpotCapacity', properties.TargetSpotCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetSpotCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `InstanceFleetProvisioningSpecification` is a subproperty of `InstanceFleetConfig` . `InstanceFleetProvisioningSpecification` defines the launch specification for Spot instances in an instance fleet, which determines the defined duration and provisioning timeout behavior for Spot instances.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetprovisioningspecifications.html
     */
    export interface InstanceFleetProvisioningSpecificationsProperty {
        /**
         * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
         *
         * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR version 5.12.1 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetprovisioningspecifications.html#cfn-elasticmapreduce-cluster-instancefleetprovisioningspecifications-ondemandspecification
         */
        readonly onDemandSpecification?: CfnCluster.OnDemandProvisioningSpecificationProperty | cdk.IResolvable;
        /**
         * The launch specification for Spot Instances in the fleet, which determines the defined duration, provisioning timeout behavior, and allocation strategy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetprovisioningspecifications.html#cfn-elasticmapreduce-cluster-instancefleetprovisioningspecifications-spotspecification
         */
        readonly spotSpecification?: CfnCluster.SpotProvisioningSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_InstanceFleetProvisioningSpecificationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onDemandSpecification', CfnCluster_OnDemandProvisioningSpecificationPropertyValidator)(properties.onDemandSpecification));
    errors.collect(cdk.propertyValidator('spotSpecification', CfnCluster_SpotProvisioningSpecificationPropertyValidator)(properties.spotSpecification));
    return errors.wrap('supplied properties not correct for "InstanceFleetProvisioningSpecificationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceFleetProvisioningSpecifications` resource
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceFleetProvisioningSpecifications` resource.
 */
// @ts-ignore TS6133
function cfnClusterInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_InstanceFleetProvisioningSpecificationsPropertyValidator(properties).assertSuccess();
    return {
        OnDemandSpecification: cfnClusterOnDemandProvisioningSpecificationPropertyToCloudFormation(properties.onDemandSpecification),
        SpotSpecification: cfnClusterSpotProvisioningSpecificationPropertyToCloudFormation(properties.spotSpecification),
    };
}

// @ts-ignore TS6133
function CfnClusterInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceFleetProvisioningSpecificationsProperty>();
    ret.addPropertyResult('onDemandSpecification', 'OnDemandSpecification', properties.OnDemandSpecification != null ? CfnClusterOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties.OnDemandSpecification) : undefined);
    ret.addPropertyResult('spotSpecification', 'SpotSpecification', properties.SpotSpecification != null ? CfnClusterSpotProvisioningSpecificationPropertyFromCloudFormation(properties.SpotSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * Use `InstanceGroupConfig` to define instance groups for an EMR cluster. A cluster can not use both instance groups and instance fleets. For more information, see [Create a Cluster with Instance Fleets or Uniform Instance Groups](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html
     */
    export interface InstanceGroupConfigProperty {
        /**
         * `AutoScalingPolicy` is a subproperty of the [InstanceGroupConfig](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig-instancegroupconfig.html) property type that specifies the constraints and rules of an automatic scaling policy in Amazon EMR . The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. Only core and task instance groups can use automatic scaling policies. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-autoscalingpolicy
         */
        readonly autoScalingPolicy?: CfnCluster.AutoScalingPolicyProperty | cdk.IResolvable;
        /**
         * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify `OnDemandPrice` to set the amount equal to the On-Demand price, or specify an amount in USD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-bidprice
         */
        readonly bidPrice?: string;
        /**
         * > Amazon EMR releases 4.x or later.
         *
         * The list of configurations supplied for an EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-configurations
         */
        readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The custom AMI ID to use for the provisioned instance group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-customamiid
         */
        readonly customAmiId?: string;
        /**
         * EBS configurations that will be attached to each EC2 instance in the instance group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-ebsconfiguration
         */
        readonly ebsConfiguration?: CfnCluster.EbsConfigurationProperty | cdk.IResolvable;
        /**
         * Target number of instances for the instance group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-instancecount
         */
        readonly instanceCount: number;
        /**
         * The EC2 instance type for all instances in the instance group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-instancetype
         */
        readonly instanceType: string;
        /**
         * Market type of the EC2 instances used to create a cluster node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-market
         */
        readonly market?: string;
        /**
         * Friendly name given to the instance group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancegroupconfig.html#cfn-elasticmapreduce-cluster-instancegroupconfig-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_InstanceGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoScalingPolicy', CfnCluster_AutoScalingPolicyPropertyValidator)(properties.autoScalingPolicy));
    errors.collect(cdk.propertyValidator('bidPrice', cdk.validateString)(properties.bidPrice));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnCluster_ConfigurationPropertyValidator))(properties.configurations));
    errors.collect(cdk.propertyValidator('customAmiId', cdk.validateString)(properties.customAmiId));
    errors.collect(cdk.propertyValidator('ebsConfiguration', CfnCluster_EbsConfigurationPropertyValidator)(properties.ebsConfiguration));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.requiredValidator)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.validateNumber)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('market', cdk.validateString)(properties.market));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "InstanceGroupConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceGroupConfig` resource
 *
 * @param properties - the TypeScript properties of a `InstanceGroupConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceGroupConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterInstanceGroupConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_InstanceGroupConfigPropertyValidator(properties).assertSuccess();
    return {
        AutoScalingPolicy: cfnClusterAutoScalingPolicyPropertyToCloudFormation(properties.autoScalingPolicy),
        BidPrice: cdk.stringToCloudFormation(properties.bidPrice),
        Configurations: cdk.listMapper(cfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
        CustomAmiId: cdk.stringToCloudFormation(properties.customAmiId),
        EbsConfiguration: cfnClusterEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
        InstanceCount: cdk.numberToCloudFormation(properties.instanceCount),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        Market: cdk.stringToCloudFormation(properties.market),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceGroupConfigProperty>();
    ret.addPropertyResult('autoScalingPolicy', 'AutoScalingPolicy', properties.AutoScalingPolicy != null ? CfnClusterAutoScalingPolicyPropertyFromCloudFormation(properties.AutoScalingPolicy) : undefined);
    ret.addPropertyResult('bidPrice', 'BidPrice', properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addPropertyResult('customAmiId', 'CustomAmiId', properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined);
    ret.addPropertyResult('ebsConfiguration', 'EbsConfiguration', properties.EbsConfiguration != null ? CfnClusterEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined);
    ret.addPropertyResult('instanceCount', 'InstanceCount', cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount));
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('market', 'Market', properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * `InstanceTypeConfig` is a sub-property of `InstanceFleetConfig` . `InstanceTypeConfig` determines the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html
     */
    export interface InstanceTypeConfigProperty {
        /**
         * The bid price for each EC2 Spot Instance type as defined by `InstanceType` . Expressed in USD. If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-bidprice
         */
        readonly bidPrice?: string;
        /**
         * The bid price, as a percentage of On-Demand price, for each EC2 Spot Instance as defined by `InstanceType` . Expressed as a number (for example, 20 specifies 20%). If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-bidpriceaspercentageofondemandprice
         */
        readonly bidPriceAsPercentageOfOnDemandPrice?: number;
        /**
         * A configuration classification that applies when provisioning cluster instances, which can include configurations for applications and software that run on the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-configurations
         */
        readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The custom AMI ID to use for the instance type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-customamiid
         */
        readonly customAmiId?: string;
        /**
         * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by `InstanceType` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-ebsconfiguration
         */
        readonly ebsConfiguration?: CfnCluster.EbsConfigurationProperty | cdk.IResolvable;
        /**
         * An EC2 instance type, such as `m3.xlarge` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-instancetype
         */
        readonly instanceType: string;
        /**
         * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in `InstanceFleetConfig` . This value is 1 for a master instance fleet, and must be 1 or greater for core and task instance fleets. Defaults to 1 if not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancetypeconfig.html#cfn-elasticmapreduce-cluster-instancetypeconfig-weightedcapacity
         */
        readonly weightedCapacity?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_InstanceTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bidPrice', cdk.validateString)(properties.bidPrice));
    errors.collect(cdk.propertyValidator('bidPriceAsPercentageOfOnDemandPrice', cdk.validateNumber)(properties.bidPriceAsPercentageOfOnDemandPrice));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnCluster_ConfigurationPropertyValidator))(properties.configurations));
    errors.collect(cdk.propertyValidator('customAmiId', cdk.validateString)(properties.customAmiId));
    errors.collect(cdk.propertyValidator('ebsConfiguration', CfnCluster_EbsConfigurationPropertyValidator)(properties.ebsConfiguration));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('weightedCapacity', cdk.validateNumber)(properties.weightedCapacity));
    return errors.wrap('supplied properties not correct for "InstanceTypeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceTypeConfig` resource
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.InstanceTypeConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterInstanceTypeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_InstanceTypeConfigPropertyValidator(properties).assertSuccess();
    return {
        BidPrice: cdk.stringToCloudFormation(properties.bidPrice),
        BidPriceAsPercentageOfOnDemandPrice: cdk.numberToCloudFormation(properties.bidPriceAsPercentageOfOnDemandPrice),
        Configurations: cdk.listMapper(cfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
        CustomAmiId: cdk.stringToCloudFormation(properties.customAmiId),
        EbsConfiguration: cfnClusterEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        WeightedCapacity: cdk.numberToCloudFormation(properties.weightedCapacity),
    };
}

// @ts-ignore TS6133
function CfnClusterInstanceTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceTypeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceTypeConfigProperty>();
    ret.addPropertyResult('bidPrice', 'BidPrice', properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined);
    ret.addPropertyResult('bidPriceAsPercentageOfOnDemandPrice', 'BidPriceAsPercentageOfOnDemandPrice', properties.BidPriceAsPercentageOfOnDemandPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.BidPriceAsPercentageOfOnDemandPrice) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addPropertyResult('customAmiId', 'CustomAmiId', properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined);
    ret.addPropertyResult('ebsConfiguration', 'EbsConfiguration', properties.EbsConfiguration != null ? CfnClusterEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined);
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('weightedCapacity', 'WeightedCapacity', properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.WeightedCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `JobFlowInstancesConfig` is a property of the `AWS::EMR::Cluster` resource. `JobFlowInstancesConfig` defines the instance groups or instance fleets that comprise the cluster. `JobFlowInstancesConfig` must contain either `InstanceFleetConfig` or `InstanceGroupConfig` . They cannot be used together.
     *
     * You can now define task instance groups or task instance fleets using the `TaskInstanceGroups` and `TaskInstanceFleets` subproperties. Using these subproperties reduces delays in provisioning task nodes compared to specifying task nodes with the `InstanceFleetConfig` and `InstanceGroupConfig` resources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html
     */
    export interface JobFlowInstancesConfigProperty {
        /**
         * A list of additional Amazon EC2 security group IDs for the master node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-additionalmastersecuritygroups
         */
        readonly additionalMasterSecurityGroups?: string[];
        /**
         * A list of additional Amazon EC2 security group IDs for the core and task nodes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-additionalslavesecuritygroups
         */
        readonly additionalSlaveSecurityGroups?: string[];
        /**
         * Describes the EC2 instances and instance configurations for the core instance fleet when using clusters with the instance fleet configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-coreinstancefleet
         */
        readonly coreInstanceFleet?: CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable;
        /**
         * Describes the EC2 instances and instance configurations for core instance groups when using clusters with the uniform instance group configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-coreinstancegroup
         */
        readonly coreInstanceGroup?: CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable;
        /**
         * The name of the EC2 key pair that can be used to connect to the master node using SSH as the user called "hadoop."
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-ec2keyname
         */
        readonly ec2KeyName?: string;
        /**
         * Applies to clusters that use the uniform instance group configuration. To launch the cluster in Amazon Virtual Private Cloud (Amazon VPC), set this parameter to the identifier of the Amazon VPC subnet where you want the cluster to launch. If you do not specify this value and your account supports EC2-Classic, the cluster launches in EC2-Classic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-ec2subnetid
         */
        readonly ec2SubnetId?: string;
        /**
         * Applies to clusters that use the instance fleet configuration. When multiple EC2 subnet IDs are specified, Amazon EMR evaluates them and launches instances in the optimal subnet.
         *
         * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-ec2subnetids
         */
        readonly ec2SubnetIds?: string[];
        /**
         * The identifier of the Amazon EC2 security group for the master node. If you specify `EmrManagedMasterSecurityGroup` , you must also specify `EmrManagedSlaveSecurityGroup` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-emrmanagedmastersecuritygroup
         */
        readonly emrManagedMasterSecurityGroup?: string;
        /**
         * The identifier of the Amazon EC2 security group for the core and task nodes. If you specify `EmrManagedSlaveSecurityGroup` , you must also specify `EmrManagedMasterSecurityGroup` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-emrmanagedslavesecuritygroup
         */
        readonly emrManagedSlaveSecurityGroup?: string;
        /**
         * Applies only to Amazon EMR release versions earlier than 4.0. The Hadoop version for the cluster. Valid inputs are "0.18" (no longer maintained), "0.20" (no longer maintained), "0.20.205" (no longer maintained), "1.0.3", "2.2.0", or "2.4.0". If you do not set this value, the default of 0.18 is used, unless the `AmiVersion` parameter is set in the RunJobFlow call, in which case the default version of Hadoop for that AMI version is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-hadoopversion
         */
        readonly hadoopVersion?: string;
        /**
         * Specifies whether the cluster should remain available after completing all steps. Defaults to `true` . For more information about configuring cluster termination, see [Control Cluster Termination](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-termination.html) in the *EMR Management Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-keepjobflowalivewhennosteps
         */
        readonly keepJobFlowAliveWhenNoSteps?: boolean | cdk.IResolvable;
        /**
         * Describes the EC2 instances and instance configurations for the master instance fleet when using clusters with the instance fleet configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-masterinstancefleet
         */
        readonly masterInstanceFleet?: CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable;
        /**
         * Describes the EC2 instances and instance configurations for the master instance group when using clusters with the uniform instance group configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-masterinstancegroup
         */
        readonly masterInstanceGroup?: CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable;
        /**
         * The Availability Zone in which the cluster runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-placement
         */
        readonly placement?: CfnCluster.PlacementTypeProperty | cdk.IResolvable;
        /**
         * The identifier of the Amazon EC2 security group for the Amazon EMR service to access clusters in VPC private subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-serviceaccesssecuritygroup
         */
        readonly serviceAccessSecurityGroup?: string;
        /**
         * Describes the EC2 instances and instance configurations for the task instance fleets when using clusters with the instance fleet configuration. These task instance fleets are added to the cluster as part of the cluster launch. Each task instance fleet must have a unique name specified so that CloudFormation can differentiate between the task instance fleets.
         *
         * > You can currently specify only one task instance fleet for a cluster. After creating the cluster, you can only modify the mutable properties of `InstanceFleetConfig` , which are `TargetOnDemandCapacity` and `TargetSpotCapacity` . Modifying any other property results in cluster replacement. > To allow a maximum of 30 Amazon EC2 instance types per fleet, include `TaskInstanceFleets` when you create your cluster. If you create your cluster without `TaskInstanceFleets` , Amazon EMR uses its default allocation strategy, which allows for a maximum of five Amazon EC2 instance types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-taskinstancefleets
         */
        readonly taskInstanceFleets?: Array<CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Describes the EC2 instances and instance configurations for task instance groups when using clusters with the uniform instance group configuration. These task instance groups are added to the cluster as part of the cluster launch. Each task instance group must have a unique name specified so that CloudFormation can differentiate between the task instance groups.
         *
         * > After creating the cluster, you can only modify the mutable properties of `InstanceGroupConfig` , which are `AutoScalingPolicy` and `InstanceCount` . Modifying any other property results in cluster replacement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-taskinstancegroups
         */
        readonly taskInstanceGroups?: Array<CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies whether to lock the cluster to prevent the Amazon EC2 instances from being terminated by API call, user intervention, or in the event of a job-flow error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-terminationprotected
         */
        readonly terminationProtected?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `JobFlowInstancesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `JobFlowInstancesConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_JobFlowInstancesConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalMasterSecurityGroups', cdk.listValidator(cdk.validateString))(properties.additionalMasterSecurityGroups));
    errors.collect(cdk.propertyValidator('additionalSlaveSecurityGroups', cdk.listValidator(cdk.validateString))(properties.additionalSlaveSecurityGroups));
    errors.collect(cdk.propertyValidator('coreInstanceFleet', CfnCluster_InstanceFleetConfigPropertyValidator)(properties.coreInstanceFleet));
    errors.collect(cdk.propertyValidator('coreInstanceGroup', CfnCluster_InstanceGroupConfigPropertyValidator)(properties.coreInstanceGroup));
    errors.collect(cdk.propertyValidator('ec2KeyName', cdk.validateString)(properties.ec2KeyName));
    errors.collect(cdk.propertyValidator('ec2SubnetId', cdk.validateString)(properties.ec2SubnetId));
    errors.collect(cdk.propertyValidator('ec2SubnetIds', cdk.listValidator(cdk.validateString))(properties.ec2SubnetIds));
    errors.collect(cdk.propertyValidator('emrManagedMasterSecurityGroup', cdk.validateString)(properties.emrManagedMasterSecurityGroup));
    errors.collect(cdk.propertyValidator('emrManagedSlaveSecurityGroup', cdk.validateString)(properties.emrManagedSlaveSecurityGroup));
    errors.collect(cdk.propertyValidator('hadoopVersion', cdk.validateString)(properties.hadoopVersion));
    errors.collect(cdk.propertyValidator('keepJobFlowAliveWhenNoSteps', cdk.validateBoolean)(properties.keepJobFlowAliveWhenNoSteps));
    errors.collect(cdk.propertyValidator('masterInstanceFleet', CfnCluster_InstanceFleetConfigPropertyValidator)(properties.masterInstanceFleet));
    errors.collect(cdk.propertyValidator('masterInstanceGroup', CfnCluster_InstanceGroupConfigPropertyValidator)(properties.masterInstanceGroup));
    errors.collect(cdk.propertyValidator('placement', CfnCluster_PlacementTypePropertyValidator)(properties.placement));
    errors.collect(cdk.propertyValidator('serviceAccessSecurityGroup', cdk.validateString)(properties.serviceAccessSecurityGroup));
    errors.collect(cdk.propertyValidator('taskInstanceFleets', cdk.listValidator(CfnCluster_InstanceFleetConfigPropertyValidator))(properties.taskInstanceFleets));
    errors.collect(cdk.propertyValidator('taskInstanceGroups', cdk.listValidator(CfnCluster_InstanceGroupConfigPropertyValidator))(properties.taskInstanceGroups));
    errors.collect(cdk.propertyValidator('terminationProtected', cdk.validateBoolean)(properties.terminationProtected));
    return errors.wrap('supplied properties not correct for "JobFlowInstancesConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.JobFlowInstancesConfig` resource
 *
 * @param properties - the TypeScript properties of a `JobFlowInstancesConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.JobFlowInstancesConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterJobFlowInstancesConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_JobFlowInstancesConfigPropertyValidator(properties).assertSuccess();
    return {
        AdditionalMasterSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalMasterSecurityGroups),
        AdditionalSlaveSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalSlaveSecurityGroups),
        CoreInstanceFleet: cfnClusterInstanceFleetConfigPropertyToCloudFormation(properties.coreInstanceFleet),
        CoreInstanceGroup: cfnClusterInstanceGroupConfigPropertyToCloudFormation(properties.coreInstanceGroup),
        Ec2KeyName: cdk.stringToCloudFormation(properties.ec2KeyName),
        Ec2SubnetId: cdk.stringToCloudFormation(properties.ec2SubnetId),
        Ec2SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SubnetIds),
        EmrManagedMasterSecurityGroup: cdk.stringToCloudFormation(properties.emrManagedMasterSecurityGroup),
        EmrManagedSlaveSecurityGroup: cdk.stringToCloudFormation(properties.emrManagedSlaveSecurityGroup),
        HadoopVersion: cdk.stringToCloudFormation(properties.hadoopVersion),
        KeepJobFlowAliveWhenNoSteps: cdk.booleanToCloudFormation(properties.keepJobFlowAliveWhenNoSteps),
        MasterInstanceFleet: cfnClusterInstanceFleetConfigPropertyToCloudFormation(properties.masterInstanceFleet),
        MasterInstanceGroup: cfnClusterInstanceGroupConfigPropertyToCloudFormation(properties.masterInstanceGroup),
        Placement: cfnClusterPlacementTypePropertyToCloudFormation(properties.placement),
        ServiceAccessSecurityGroup: cdk.stringToCloudFormation(properties.serviceAccessSecurityGroup),
        TaskInstanceFleets: cdk.listMapper(cfnClusterInstanceFleetConfigPropertyToCloudFormation)(properties.taskInstanceFleets),
        TaskInstanceGroups: cdk.listMapper(cfnClusterInstanceGroupConfigPropertyToCloudFormation)(properties.taskInstanceGroups),
        TerminationProtected: cdk.booleanToCloudFormation(properties.terminationProtected),
    };
}

// @ts-ignore TS6133
function CfnClusterJobFlowInstancesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.JobFlowInstancesConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.JobFlowInstancesConfigProperty>();
    ret.addPropertyResult('additionalMasterSecurityGroups', 'AdditionalMasterSecurityGroups', properties.AdditionalMasterSecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalMasterSecurityGroups) : undefined);
    ret.addPropertyResult('additionalSlaveSecurityGroups', 'AdditionalSlaveSecurityGroups', properties.AdditionalSlaveSecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalSlaveSecurityGroups) : undefined);
    ret.addPropertyResult('coreInstanceFleet', 'CoreInstanceFleet', properties.CoreInstanceFleet != null ? CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties.CoreInstanceFleet) : undefined);
    ret.addPropertyResult('coreInstanceGroup', 'CoreInstanceGroup', properties.CoreInstanceGroup != null ? CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties.CoreInstanceGroup) : undefined);
    ret.addPropertyResult('ec2KeyName', 'Ec2KeyName', properties.Ec2KeyName != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2KeyName) : undefined);
    ret.addPropertyResult('ec2SubnetId', 'Ec2SubnetId', properties.Ec2SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2SubnetId) : undefined);
    ret.addPropertyResult('ec2SubnetIds', 'Ec2SubnetIds', properties.Ec2SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Ec2SubnetIds) : undefined);
    ret.addPropertyResult('emrManagedMasterSecurityGroup', 'EmrManagedMasterSecurityGroup', properties.EmrManagedMasterSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.EmrManagedMasterSecurityGroup) : undefined);
    ret.addPropertyResult('emrManagedSlaveSecurityGroup', 'EmrManagedSlaveSecurityGroup', properties.EmrManagedSlaveSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.EmrManagedSlaveSecurityGroup) : undefined);
    ret.addPropertyResult('hadoopVersion', 'HadoopVersion', properties.HadoopVersion != null ? cfn_parse.FromCloudFormation.getString(properties.HadoopVersion) : undefined);
    ret.addPropertyResult('keepJobFlowAliveWhenNoSteps', 'KeepJobFlowAliveWhenNoSteps', properties.KeepJobFlowAliveWhenNoSteps != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeepJobFlowAliveWhenNoSteps) : undefined);
    ret.addPropertyResult('masterInstanceFleet', 'MasterInstanceFleet', properties.MasterInstanceFleet != null ? CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties.MasterInstanceFleet) : undefined);
    ret.addPropertyResult('masterInstanceGroup', 'MasterInstanceGroup', properties.MasterInstanceGroup != null ? CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties.MasterInstanceGroup) : undefined);
    ret.addPropertyResult('placement', 'Placement', properties.Placement != null ? CfnClusterPlacementTypePropertyFromCloudFormation(properties.Placement) : undefined);
    ret.addPropertyResult('serviceAccessSecurityGroup', 'ServiceAccessSecurityGroup', properties.ServiceAccessSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessSecurityGroup) : undefined);
    ret.addPropertyResult('taskInstanceFleets', 'TaskInstanceFleets', properties.TaskInstanceFleets != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceFleetConfigPropertyFromCloudFormation)(properties.TaskInstanceFleets) : undefined);
    ret.addPropertyResult('taskInstanceGroups', 'TaskInstanceGroups', properties.TaskInstanceGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceGroupConfigPropertyFromCloudFormation)(properties.TaskInstanceGroups) : undefined);
    ret.addPropertyResult('terminationProtected', 'TerminationProtected', properties.TerminationProtected != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminationProtected) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `KerberosAttributes` is a property of the `AWS::EMR::Cluster` resource. `KerberosAttributes` define the cluster-specific Kerberos configuration when Kerberos authentication is enabled using a security configuration. The cluster-specific configuration must be compatible with the security configuration. For more information see [Use Kerberos Authentication](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-kerberos.html) in the *EMR Management Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html
     */
    export interface KerberosAttributesProperty {
        /**
         * The Active Directory password for `ADDomainJoinUser` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html#cfn-elasticmapreduce-cluster-kerberosattributes-addomainjoinpassword
         */
        readonly adDomainJoinPassword?: string;
        /**
         * Required only when establishing a cross-realm trust with an Active Directory domain. A user with sufficient privileges to join resources to the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html#cfn-elasticmapreduce-cluster-kerberosattributes-addomainjoinuser
         */
        readonly adDomainJoinUser?: string;
        /**
         * Required only when establishing a cross-realm trust with a KDC in a different realm. The cross-realm principal password, which must be identical across realms.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html#cfn-elasticmapreduce-cluster-kerberosattributes-crossrealmtrustprincipalpassword
         */
        readonly crossRealmTrustPrincipalPassword?: string;
        /**
         * The password used within the cluster for the kadmin service on the cluster-dedicated KDC, which maintains Kerberos principals, password policies, and keytabs for the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html#cfn-elasticmapreduce-cluster-kerberosattributes-kdcadminpassword
         */
        readonly kdcAdminPassword: string;
        /**
         * The name of the Kerberos realm to which all nodes in a cluster belong. For example, `EC2.INTERNAL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-kerberosattributes.html#cfn-elasticmapreduce-cluster-kerberosattributes-realm
         */
        readonly realm: string;
    }
}

/**
 * Determine whether the given properties match those of a `KerberosAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `KerberosAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_KerberosAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adDomainJoinPassword', cdk.validateString)(properties.adDomainJoinPassword));
    errors.collect(cdk.propertyValidator('adDomainJoinUser', cdk.validateString)(properties.adDomainJoinUser));
    errors.collect(cdk.propertyValidator('crossRealmTrustPrincipalPassword', cdk.validateString)(properties.crossRealmTrustPrincipalPassword));
    errors.collect(cdk.propertyValidator('kdcAdminPassword', cdk.requiredValidator)(properties.kdcAdminPassword));
    errors.collect(cdk.propertyValidator('kdcAdminPassword', cdk.validateString)(properties.kdcAdminPassword));
    errors.collect(cdk.propertyValidator('realm', cdk.requiredValidator)(properties.realm));
    errors.collect(cdk.propertyValidator('realm', cdk.validateString)(properties.realm));
    return errors.wrap('supplied properties not correct for "KerberosAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.KerberosAttributes` resource
 *
 * @param properties - the TypeScript properties of a `KerberosAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.KerberosAttributes` resource.
 */
// @ts-ignore TS6133
function cfnClusterKerberosAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_KerberosAttributesPropertyValidator(properties).assertSuccess();
    return {
        ADDomainJoinPassword: cdk.stringToCloudFormation(properties.adDomainJoinPassword),
        ADDomainJoinUser: cdk.stringToCloudFormation(properties.adDomainJoinUser),
        CrossRealmTrustPrincipalPassword: cdk.stringToCloudFormation(properties.crossRealmTrustPrincipalPassword),
        KdcAdminPassword: cdk.stringToCloudFormation(properties.kdcAdminPassword),
        Realm: cdk.stringToCloudFormation(properties.realm),
    };
}

// @ts-ignore TS6133
function CfnClusterKerberosAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.KerberosAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KerberosAttributesProperty>();
    ret.addPropertyResult('adDomainJoinPassword', 'ADDomainJoinPassword', properties.ADDomainJoinPassword != null ? cfn_parse.FromCloudFormation.getString(properties.ADDomainJoinPassword) : undefined);
    ret.addPropertyResult('adDomainJoinUser', 'ADDomainJoinUser', properties.ADDomainJoinUser != null ? cfn_parse.FromCloudFormation.getString(properties.ADDomainJoinUser) : undefined);
    ret.addPropertyResult('crossRealmTrustPrincipalPassword', 'CrossRealmTrustPrincipalPassword', properties.CrossRealmTrustPrincipalPassword != null ? cfn_parse.FromCloudFormation.getString(properties.CrossRealmTrustPrincipalPassword) : undefined);
    ret.addPropertyResult('kdcAdminPassword', 'KdcAdminPassword', cfn_parse.FromCloudFormation.getString(properties.KdcAdminPassword));
    ret.addPropertyResult('realm', 'Realm', cfn_parse.FromCloudFormation.getString(properties.Realm));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `KeyValue` is a subproperty of the `HadoopJarStepConfig` property type. `KeyValue` is used to pass parameters to a step.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-keyvalue.html
     */
    export interface KeyValueProperty {
        /**
         * The unique identifier of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-keyvalue.html#cfn-elasticmapreduce-cluster-keyvalue-key
         */
        readonly key?: string;
        /**
         * The value part of the identified key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-keyvalue.html#cfn-elasticmapreduce-cluster-keyvalue-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_KeyValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "KeyValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.KeyValue` resource
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.KeyValue` resource.
 */
// @ts-ignore TS6133
function cfnClusterKeyValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_KeyValuePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnClusterKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.KeyValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KeyValueProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * Managed scaling policy for an Amazon EMR cluster. The policy specifies the limits for resources that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-managedscalingpolicy.html
     */
    export interface ManagedScalingPolicyProperty {
        /**
         * The EC2 unit limits for a managed scaling policy. The managed scaling activity of a cluster is not allowed to go above or below these limits. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-managedscalingpolicy.html#cfn-elasticmapreduce-cluster-managedscalingpolicy-computelimits
         */
        readonly computeLimits?: CfnCluster.ComputeLimitsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ManagedScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ManagedScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('computeLimits', CfnCluster_ComputeLimitsPropertyValidator)(properties.computeLimits));
    return errors.wrap('supplied properties not correct for "ManagedScalingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ManagedScalingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ManagedScalingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ManagedScalingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnClusterManagedScalingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ManagedScalingPolicyPropertyValidator(properties).assertSuccess();
    return {
        ComputeLimits: cfnClusterComputeLimitsPropertyToCloudFormation(properties.computeLimits),
    };
}

// @ts-ignore TS6133
function CfnClusterManagedScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ManagedScalingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ManagedScalingPolicyProperty>();
    ret.addPropertyResult('computeLimits', 'ComputeLimits', properties.ComputeLimits != null ? CfnClusterComputeLimitsPropertyFromCloudFormation(properties.ComputeLimits) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `MetricDimension` is a subproperty of the `CloudWatchAlarmDefinition` property type. `MetricDimension` specifies a CloudWatch dimension, which is specified with a `Key` `Value` pair. The key is known as a `Name` in CloudWatch. By default, Amazon EMR uses one dimension whose `Key` is `JobFlowID` and `Value` is a variable representing the cluster ID, which is `${emr.clusterId}` . This enables the automatic scaling rule for EMR to bootstrap when the cluster ID becomes available during cluster creation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-metricdimension.html
     */
    export interface MetricDimensionProperty {
        /**
         * The dimension name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-metricdimension.html#cfn-elasticmapreduce-cluster-metricdimension-key
         */
        readonly key: string;
        /**
         * The dimension value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-metricdimension.html#cfn-elasticmapreduce-cluster-metricdimension-value
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
function CfnCluster_MetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "MetricDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.MetricDimension` resource
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.MetricDimension` resource.
 */
// @ts-ignore TS6133
function cfnClusterMetricDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_MetricDimensionPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnClusterMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.MetricDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.MetricDimensionProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR version 5.12.1 and later.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ondemandprovisioningspecification.html
     */
    export interface OnDemandProvisioningSpecificationProperty {
        /**
         * Specifies the strategy to use in launching On-Demand instance fleets. Currently, the only option is `lowest-price` (the default), which launches the lowest price first.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ondemandprovisioningspecification.html#cfn-elasticmapreduce-cluster-ondemandprovisioningspecification-allocationstrategy
         */
        readonly allocationStrategy: string;
    }
}

/**
 * Determine whether the given properties match those of a `OnDemandProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_OnDemandProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.requiredValidator)(properties.allocationStrategy));
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.validateString)(properties.allocationStrategy));
    return errors.wrap('supplied properties not correct for "OnDemandProvisioningSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.OnDemandProvisioningSpecification` resource
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.OnDemandProvisioningSpecification` resource.
 */
// @ts-ignore TS6133
function cfnClusterOnDemandProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_OnDemandProvisioningSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllocationStrategy: cdk.stringToCloudFormation(properties.allocationStrategy),
    };
}

// @ts-ignore TS6133
function CfnClusterOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.OnDemandProvisioningSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.OnDemandProvisioningSpecificationProperty>();
    ret.addPropertyResult('allocationStrategy', 'AllocationStrategy', cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `PlacementType` is a property of the `AWS::EMR::Cluster` resource. `PlacementType` determines the Amazon EC2 Availability Zone configuration of the cluster (job flow).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-placementtype.html
     */
    export interface PlacementTypeProperty {
        /**
         * The Amazon EC2 Availability Zone for the cluster. `AvailabilityZone` is used for uniform instance groups, while `AvailabilityZones` (plural) is used for instance fleets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-placementtype.html#cfn-elasticmapreduce-cluster-placementtype-availabilityzone
         */
        readonly availabilityZone: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementTypeProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_PlacementTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.requiredValidator)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    return errors.wrap('supplied properties not correct for "PlacementTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.PlacementType` resource
 *
 * @param properties - the TypeScript properties of a `PlacementTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.PlacementType` resource.
 */
// @ts-ignore TS6133
function cfnClusterPlacementTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_PlacementTypePropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
    };
}

// @ts-ignore TS6133
function CfnClusterPlacementTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.PlacementTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.PlacementTypeProperty>();
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `ScalingAction` is a subproperty of the `ScalingRule` property type. `ScalingAction` determines the type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingaction.html
     */
    export interface ScalingActionProperty {
        /**
         * Not available for instance groups. Instance groups use the market type specified for the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingaction.html#cfn-elasticmapreduce-cluster-scalingaction-market
         */
        readonly market?: string;
        /**
         * The type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingaction.html#cfn-elasticmapreduce-cluster-scalingaction-simplescalingpolicyconfiguration
         */
        readonly simpleScalingPolicyConfiguration: CfnCluster.SimpleScalingPolicyConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ScalingActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('market', cdk.validateString)(properties.market));
    errors.collect(cdk.propertyValidator('simpleScalingPolicyConfiguration', cdk.requiredValidator)(properties.simpleScalingPolicyConfiguration));
    errors.collect(cdk.propertyValidator('simpleScalingPolicyConfiguration', CfnCluster_SimpleScalingPolicyConfigurationPropertyValidator)(properties.simpleScalingPolicyConfiguration));
    return errors.wrap('supplied properties not correct for "ScalingActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingAction` resource
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingAction` resource.
 */
// @ts-ignore TS6133
function cfnClusterScalingActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ScalingActionPropertyValidator(properties).assertSuccess();
    return {
        Market: cdk.stringToCloudFormation(properties.market),
        SimpleScalingPolicyConfiguration: cfnClusterSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties.simpleScalingPolicyConfiguration),
    };
}

// @ts-ignore TS6133
function CfnClusterScalingActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ScalingActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingActionProperty>();
    ret.addPropertyResult('market', 'Market', properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined);
    ret.addPropertyResult('simpleScalingPolicyConfiguration', 'SimpleScalingPolicyConfiguration', CfnClusterSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties.SimpleScalingPolicyConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `ScalingConstraints` is a subproperty of the `AutoScalingPolicy` property type. `ScalingConstraints` defines the upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activities triggered by automatic scaling rules will not cause an instance group to grow above or shrink below these limits.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingconstraints.html
     */
    export interface ScalingConstraintsProperty {
        /**
         * The upper boundary of EC2 instances in an instance group beyond which scaling activities are not allowed to grow. Scale-out activities will not add instances beyond this boundary.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingconstraints.html#cfn-elasticmapreduce-cluster-scalingconstraints-maxcapacity
         */
        readonly maxCapacity: number;
        /**
         * The lower boundary of EC2 instances in an instance group below which scaling activities are not allowed to shrink. Scale-in activities will not terminate instances below this boundary.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingconstraints.html#cfn-elasticmapreduce-cluster-scalingconstraints-mincapacity
         */
        readonly minCapacity: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ScalingConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.requiredValidator)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.validateNumber)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.requiredValidator)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.validateNumber)(properties.minCapacity));
    return errors.wrap('supplied properties not correct for "ScalingConstraintsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingConstraints` resource.
 */
// @ts-ignore TS6133
function cfnClusterScalingConstraintsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ScalingConstraintsPropertyValidator(properties).assertSuccess();
    return {
        MaxCapacity: cdk.numberToCloudFormation(properties.maxCapacity),
        MinCapacity: cdk.numberToCloudFormation(properties.minCapacity),
    };
}

// @ts-ignore TS6133
function CfnClusterScalingConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ScalingConstraintsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingConstraintsProperty>();
    ret.addPropertyResult('maxCapacity', 'MaxCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity));
    ret.addPropertyResult('minCapacity', 'MinCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `ScalingRule` is a subproperty of the `AutoScalingPolicy` property type. `ScalingRule` defines the scale-in or scale-out rules for scaling activity, including the CloudWatch metric alarm that triggers activity, how EC2 instances are added or removed, and the periodicity of adjustments. The automatic scaling policy for an instance group can comprise one or more automatic scaling rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingrule.html
     */
    export interface ScalingRuleProperty {
        /**
         * The conditions that trigger an automatic scaling activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingrule.html#cfn-elasticmapreduce-cluster-scalingrule-action
         */
        readonly action: CfnCluster.ScalingActionProperty | cdk.IResolvable;
        /**
         * A friendly, more verbose description of the automatic scaling rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingrule.html#cfn-elasticmapreduce-cluster-scalingrule-description
         */
        readonly description?: string;
        /**
         * The name used to identify an automatic scaling rule. Rule names must be unique within a scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingrule.html#cfn-elasticmapreduce-cluster-scalingrule-name
         */
        readonly name: string;
        /**
         * The CloudWatch alarm definition that determines when automatic scaling activity is triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingrule.html#cfn-elasticmapreduce-cluster-scalingrule-trigger
         */
        readonly trigger: CfnCluster.ScalingTriggerProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ScalingRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnCluster_ScalingActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('trigger', cdk.requiredValidator)(properties.trigger));
    errors.collect(cdk.propertyValidator('trigger', CfnCluster_ScalingTriggerPropertyValidator)(properties.trigger));
    return errors.wrap('supplied properties not correct for "ScalingRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingRule` resource
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingRule` resource.
 */
// @ts-ignore TS6133
function cfnClusterScalingRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ScalingRulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnClusterScalingActionPropertyToCloudFormation(properties.action),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Trigger: cfnClusterScalingTriggerPropertyToCloudFormation(properties.trigger),
    };
}

// @ts-ignore TS6133
function CfnClusterScalingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ScalingRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingRuleProperty>();
    ret.addPropertyResult('action', 'Action', CfnClusterScalingActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('trigger', 'Trigger', CfnClusterScalingTriggerPropertyFromCloudFormation(properties.Trigger));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `ScalingTrigger` is a subproperty of the `ScalingRule` property type. `ScalingTrigger` determines the conditions that trigger an automatic scaling activity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingtrigger.html
     */
    export interface ScalingTriggerProperty {
        /**
         * The definition of a CloudWatch metric alarm. When the defined alarm conditions are met along with other trigger parameters, scaling activity begins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scalingtrigger.html#cfn-elasticmapreduce-cluster-scalingtrigger-cloudwatchalarmdefinition
         */
        readonly cloudWatchAlarmDefinition: CfnCluster.CloudWatchAlarmDefinitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ScalingTriggerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchAlarmDefinition', cdk.requiredValidator)(properties.cloudWatchAlarmDefinition));
    errors.collect(cdk.propertyValidator('cloudWatchAlarmDefinition', CfnCluster_CloudWatchAlarmDefinitionPropertyValidator)(properties.cloudWatchAlarmDefinition));
    return errors.wrap('supplied properties not correct for "ScalingTriggerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingTrigger` resource
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScalingTrigger` resource.
 */
// @ts-ignore TS6133
function cfnClusterScalingTriggerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ScalingTriggerPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchAlarmDefinition: cfnClusterCloudWatchAlarmDefinitionPropertyToCloudFormation(properties.cloudWatchAlarmDefinition),
    };
}

// @ts-ignore TS6133
function CfnClusterScalingTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ScalingTriggerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingTriggerProperty>();
    ret.addPropertyResult('cloudWatchAlarmDefinition', 'CloudWatchAlarmDefinition', CfnClusterCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties.CloudWatchAlarmDefinition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `ScriptBootstrapActionConfig` is a subproperty of the `BootstrapActionConfig` property type. `ScriptBootstrapActionConfig` specifies the arguments and location of the bootstrap script for EMR to run on all cluster nodes before it installs open-source big data applications on them.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html
     */
    export interface ScriptBootstrapActionConfigProperty {
        /**
         * A list of command line arguments to pass to the bootstrap action script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html#cfn-elasticmapreduce-cluster-scriptbootstrapactionconfig-args
         */
        readonly args?: string[];
        /**
         * Location in Amazon S3 of the script to run during a bootstrap action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html#cfn-elasticmapreduce-cluster-scriptbootstrapactionconfig-path
         */
        readonly path: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScriptBootstrapActionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptBootstrapActionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ScriptBootstrapActionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('args', cdk.listValidator(cdk.validateString))(properties.args));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "ScriptBootstrapActionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScriptBootstrapActionConfig` resource
 *
 * @param properties - the TypeScript properties of a `ScriptBootstrapActionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.ScriptBootstrapActionConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterScriptBootstrapActionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ScriptBootstrapActionConfigPropertyValidator(properties).assertSuccess();
    return {
        Args: cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnClusterScriptBootstrapActionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ScriptBootstrapActionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScriptBootstrapActionConfigProperty>();
    ret.addPropertyResult('args', 'Args', properties.Args != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Args) : undefined);
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `SimpleScalingPolicyConfiguration` is a subproperty of the `ScalingAction` property type. `SimpleScalingPolicyConfiguration` determines how an automatic scaling action adds or removes instances, the cooldown period, and the number of EC2 instances that are added each time the CloudWatch metric alarm condition is satisfied.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html
     */
    export interface SimpleScalingPolicyConfigurationProperty {
        /**
         * The way in which EC2 instances are added (if `ScalingAdjustment` is a positive number) or terminated (if `ScalingAdjustment` is a negative number) each time the scaling activity is triggered. `CHANGE_IN_CAPACITY` is the default. `CHANGE_IN_CAPACITY` indicates that the EC2 instance count increments or decrements by `ScalingAdjustment` , which should be expressed as an integer. `PERCENT_CHANGE_IN_CAPACITY` indicates the instance count increments or decrements by the percentage specified by `ScalingAdjustment` , which should be expressed as an integer. For example, 20 indicates an increase in 20% increments of cluster capacity. `EXACT_CAPACITY` indicates the scaling activity results in an instance group with the number of EC2 instances specified by `ScalingAdjustment` , which should be expressed as a positive integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-adjustmenttype
         */
        readonly adjustmentType?: string;
        /**
         * The amount of time, in seconds, after a scaling activity completes before any further trigger-related scaling activities can start. The default value is 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-cooldown
         */
        readonly coolDown?: number;
        /**
         * The amount by which to scale in or scale out, based on the specified `AdjustmentType` . A positive value adds to the instance group's EC2 instance count while a negative number removes instances. If `AdjustmentType` is set to `EXACT_CAPACITY` , the number should only be a positive integer. If `AdjustmentType` is set to `PERCENT_CHANGE_IN_CAPACITY` , the value should express the percentage as an integer. For example, -20 indicates a decrease in 20% increments of cluster capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-scalingadjustment
         */
        readonly scalingAdjustment: number;
    }
}

/**
 * Determine whether the given properties match those of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_SimpleScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adjustmentType', cdk.validateString)(properties.adjustmentType));
    errors.collect(cdk.propertyValidator('coolDown', cdk.validateNumber)(properties.coolDown));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.requiredValidator)(properties.scalingAdjustment));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.validateNumber)(properties.scalingAdjustment));
    return errors.wrap('supplied properties not correct for "SimpleScalingPolicyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.SimpleScalingPolicyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.SimpleScalingPolicyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnClusterSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_SimpleScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdjustmentType: cdk.stringToCloudFormation(properties.adjustmentType),
        CoolDown: cdk.numberToCloudFormation(properties.coolDown),
        ScalingAdjustment: cdk.numberToCloudFormation(properties.scalingAdjustment),
    };
}

// @ts-ignore TS6133
function CfnClusterSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.SimpleScalingPolicyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SimpleScalingPolicyConfigurationProperty>();
    ret.addPropertyResult('adjustmentType', 'AdjustmentType', properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined);
    ret.addPropertyResult('coolDown', 'CoolDown', properties.CoolDown != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoolDown) : undefined);
    ret.addPropertyResult('scalingAdjustment', 'ScalingAdjustment', cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `SpotProvisioningSpecification` is a subproperty of the `InstanceFleetProvisioningSpecifications` property type. `SpotProvisioningSpecification` determines the launch specification for Spot instances in the instance fleet, which includes the defined duration and provisioning timeout behavior.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html
     */
    export interface SpotProvisioningSpecificationProperty {
        /**
         * Specifies the strategy to use in launching Spot Instance fleets. Currently, the only option is capacity-optimized (the default), which launches instances from Spot Instance pools with optimal capacity for the number of instances that are launching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-allocationstrategy
         */
        readonly allocationStrategy?: string;
        /**
         * The defined duration for Spot Instances (also known as Spot blocks) in minutes. When specified, the Spot Instance does not terminate before the defined duration expires, and defined duration pricing for Spot Instances applies. Valid values are 60, 120, 180, 240, 300, or 360. The duration period starts as soon as a Spot Instance receives its instance ID. At the end of the duration, Amazon EC2 marks the Spot Instance for termination and provides a Spot Instance termination notice, which gives the instance a two-minute warning before it terminates.
         *
         * > Spot Instances with a defined duration (also known as Spot blocks) are no longer available to new customers from July 1, 2021. For customers who have previously used the feature, we will continue to support Spot Instances with a defined duration until December 31, 2022.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-blockdurationminutes
         */
        readonly blockDurationMinutes?: number;
        /**
         * The action to take when `TargetSpotCapacity` has not been fulfilled when the `TimeoutDurationMinutes` has expired; that is, when all Spot Instances could not be provisioned within the Spot provisioning timeout. Valid values are `TERMINATE_CLUSTER` and `SWITCH_TO_ON_DEMAND` . SWITCH_TO_ON_DEMAND specifies that if no Spot Instances are available, On-Demand Instances should be provisioned to fulfill any remaining Spot capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutaction
         */
        readonly timeoutAction: string;
        /**
         * The spot provisioning timeout period in minutes. If Spot Instances are not provisioned within this time period, the `TimeOutAction` is taken. Minimum value is 5 and maximum value is 1440. The timeout applies only during initial provisioning, when the cluster is first created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutdurationminutes
         */
        readonly timeoutDurationMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `SpotProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_SpotProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.validateString)(properties.allocationStrategy));
    errors.collect(cdk.propertyValidator('blockDurationMinutes', cdk.validateNumber)(properties.blockDurationMinutes));
    errors.collect(cdk.propertyValidator('timeoutAction', cdk.requiredValidator)(properties.timeoutAction));
    errors.collect(cdk.propertyValidator('timeoutAction', cdk.validateString)(properties.timeoutAction));
    errors.collect(cdk.propertyValidator('timeoutDurationMinutes', cdk.requiredValidator)(properties.timeoutDurationMinutes));
    errors.collect(cdk.propertyValidator('timeoutDurationMinutes', cdk.validateNumber)(properties.timeoutDurationMinutes));
    return errors.wrap('supplied properties not correct for "SpotProvisioningSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.SpotProvisioningSpecification` resource
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.SpotProvisioningSpecification` resource.
 */
// @ts-ignore TS6133
function cfnClusterSpotProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_SpotProvisioningSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllocationStrategy: cdk.stringToCloudFormation(properties.allocationStrategy),
        BlockDurationMinutes: cdk.numberToCloudFormation(properties.blockDurationMinutes),
        TimeoutAction: cdk.stringToCloudFormation(properties.timeoutAction),
        TimeoutDurationMinutes: cdk.numberToCloudFormation(properties.timeoutDurationMinutes),
    };
}

// @ts-ignore TS6133
function CfnClusterSpotProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.SpotProvisioningSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SpotProvisioningSpecificationProperty>();
    ret.addPropertyResult('allocationStrategy', 'AllocationStrategy', properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined);
    ret.addPropertyResult('blockDurationMinutes', 'BlockDurationMinutes', properties.BlockDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockDurationMinutes) : undefined);
    ret.addPropertyResult('timeoutAction', 'TimeoutAction', cfn_parse.FromCloudFormation.getString(properties.TimeoutAction));
    ret.addPropertyResult('timeoutDurationMinutes', 'TimeoutDurationMinutes', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutDurationMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `StepConfig` is a property of the `AWS::EMR::Cluster` resource. The `StepConfig` property type specifies a cluster (job flow) step, which runs only on the master node. Steps are used to submit data processing jobs to the cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-stepconfig.html
     */
    export interface StepConfigProperty {
        /**
         * The action to take when the cluster step fails. Possible values are `CANCEL_AND_WAIT` and `CONTINUE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-stepconfig.html#cfn-elasticmapreduce-cluster-stepconfig-actiononfailure
         */
        readonly actionOnFailure?: string;
        /**
         * The JAR file used for the step.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-stepconfig.html#cfn-elasticmapreduce-cluster-stepconfig-hadoopjarstep
         */
        readonly hadoopJarStep: CfnCluster.HadoopJarStepConfigProperty | cdk.IResolvable;
        /**
         * The name of the step.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-stepconfig.html#cfn-elasticmapreduce-cluster-stepconfig-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `StepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `StepConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_StepConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionOnFailure', cdk.validateString)(properties.actionOnFailure));
    errors.collect(cdk.propertyValidator('hadoopJarStep', cdk.requiredValidator)(properties.hadoopJarStep));
    errors.collect(cdk.propertyValidator('hadoopJarStep', CfnCluster_HadoopJarStepConfigPropertyValidator)(properties.hadoopJarStep));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "StepConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.StepConfig` resource
 *
 * @param properties - the TypeScript properties of a `StepConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.StepConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterStepConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_StepConfigPropertyValidator(properties).assertSuccess();
    return {
        ActionOnFailure: cdk.stringToCloudFormation(properties.actionOnFailure),
        HadoopJarStep: cfnClusterHadoopJarStepConfigPropertyToCloudFormation(properties.hadoopJarStep),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnClusterStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.StepConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.StepConfigProperty>();
    ret.addPropertyResult('actionOnFailure', 'ActionOnFailure', properties.ActionOnFailure != null ? cfn_parse.FromCloudFormation.getString(properties.ActionOnFailure) : undefined);
    ret.addPropertyResult('hadoopJarStep', 'HadoopJarStep', CfnClusterHadoopJarStepConfigPropertyFromCloudFormation(properties.HadoopJarStep));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type. `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-volumespecification.html
     */
    export interface VolumeSpecificationProperty {
        /**
         * The number of I/O operations per second (IOPS) that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-volumespecification.html#cfn-elasticmapreduce-cluster-volumespecification-iops
         */
        readonly iops?: number;
        /**
         * The volume size, in gibibytes (GiB). This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-volumespecification.html#cfn-elasticmapreduce-cluster-volumespecification-sizeingb
         */
        readonly sizeInGb: number;
        /**
         * The volume type. Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-volumespecification.html#cfn-elasticmapreduce-cluster-volumespecification-volumetype
         */
        readonly volumeType: string;
    }
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_VolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.requiredValidator)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.validateNumber)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('volumeType', cdk.requiredValidator)(properties.volumeType));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "VolumeSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Cluster.VolumeSpecification` resource
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Cluster.VolumeSpecification` resource.
 */
// @ts-ignore TS6133
function cfnClusterVolumeSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_VolumeSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Iops: cdk.numberToCloudFormation(properties.iops),
        SizeInGB: cdk.numberToCloudFormation(properties.sizeInGb),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnClusterVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.VolumeSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VolumeSpecificationProperty>();
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('sizeInGb', 'SizeInGB', cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB));
    ret.addPropertyResult('volumeType', 'VolumeType', cfn_parse.FromCloudFormation.getString(properties.VolumeType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInstanceFleetConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html
 */
export interface CfnInstanceFleetConfigProps {

    /**
     * The unique identifier of the EMR cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-clusterid
     */
    readonly clusterId: string;

    /**
     * The node type that the instance fleet hosts.
     *
     * *Allowed Values* : TASK
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancefleettype
     */
    readonly instanceFleetType: string;

    /**
     * `InstanceTypeConfigs` determine the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfigs
     */
    readonly instanceTypeConfigs?: Array<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The launch specification for the instance fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-launchspecifications
     */
    readonly launchSpecifications?: CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable;

    /**
     * The friendly name of the instance fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-name
     */
    readonly name?: string;

    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision. When the instance fleet launches, Amazon EMR tries to provision On-Demand instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When an On-Demand instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only Spot instances are provisioned for the instance fleet using `TargetSpotCapacity` . At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetondemandcapacity
     */
    readonly targetOnDemandCapacity?: number;

    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision. When the instance fleet launches, Amazon EMR tries to provision Spot instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When a Spot instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only On-Demand instances are provisioned for the instance fleet. At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetspotcapacity
     */
    readonly targetSpotCapacity?: number;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceFleetConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceFleetConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterId', cdk.requiredValidator)(properties.clusterId));
    errors.collect(cdk.propertyValidator('clusterId', cdk.validateString)(properties.clusterId));
    errors.collect(cdk.propertyValidator('instanceFleetType', cdk.requiredValidator)(properties.instanceFleetType));
    errors.collect(cdk.propertyValidator('instanceFleetType', cdk.validateString)(properties.instanceFleetType));
    errors.collect(cdk.propertyValidator('instanceTypeConfigs', cdk.listValidator(CfnInstanceFleetConfig_InstanceTypeConfigPropertyValidator))(properties.instanceTypeConfigs));
    errors.collect(cdk.propertyValidator('launchSpecifications', CfnInstanceFleetConfig_InstanceFleetProvisioningSpecificationsPropertyValidator)(properties.launchSpecifications));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('targetOnDemandCapacity', cdk.validateNumber)(properties.targetOnDemandCapacity));
    errors.collect(cdk.propertyValidator('targetSpotCapacity', cdk.validateNumber)(properties.targetSpotCapacity));
    return errors.wrap('supplied properties not correct for "CfnInstanceFleetConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceFleetConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfigPropsValidator(properties).assertSuccess();
    return {
        ClusterId: cdk.stringToCloudFormation(properties.clusterId),
        InstanceFleetType: cdk.stringToCloudFormation(properties.instanceFleetType),
        InstanceTypeConfigs: cdk.listMapper(cfnInstanceFleetConfigInstanceTypeConfigPropertyToCloudFormation)(properties.instanceTypeConfigs),
        LaunchSpecifications: cfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties.launchSpecifications),
        Name: cdk.stringToCloudFormation(properties.name),
        TargetOnDemandCapacity: cdk.numberToCloudFormation(properties.targetOnDemandCapacity),
        TargetSpotCapacity: cdk.numberToCloudFormation(properties.targetSpotCapacity),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfigProps>();
    ret.addPropertyResult('clusterId', 'ClusterId', cfn_parse.FromCloudFormation.getString(properties.ClusterId));
    ret.addPropertyResult('instanceFleetType', 'InstanceFleetType', cfn_parse.FromCloudFormation.getString(properties.InstanceFleetType));
    ret.addPropertyResult('instanceTypeConfigs', 'InstanceTypeConfigs', properties.InstanceTypeConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigInstanceTypeConfigPropertyFromCloudFormation)(properties.InstanceTypeConfigs) : undefined);
    ret.addPropertyResult('launchSpecifications', 'LaunchSpecifications', properties.LaunchSpecifications != null ? CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties.LaunchSpecifications) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('targetOnDemandCapacity', 'TargetOnDemandCapacity', properties.TargetOnDemandCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetOnDemandCapacity) : undefined);
    ret.addPropertyResult('targetSpotCapacity', 'TargetSpotCapacity', properties.TargetSpotCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetSpotCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::InstanceFleetConfig`
 *
 * Use `InstanceFleetConfig` to define instance fleets for an EMR cluster. A cluster can not use both instance fleets and instance groups. For more information, see [Configure Instance Fleets](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. > You can currently only add a task instance fleet to a cluster with this resource. If you use this resource, CloudFormation waits for the cluster launch to complete before adding the task instance fleet to the cluster. In order to add a task instance fleet to the cluster as part of the cluster launch and minimize delays in provisioning task nodes, use the `TaskInstanceFleets` subproperty for the [AWS::EMR::Cluster JobFlowInstancesConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html) property instead. To use this subproperty, see [AWS::EMR::Cluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html) for examples.
 *
 * @cloudformationResource AWS::EMR::InstanceFleetConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html
 */
export class CfnInstanceFleetConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::InstanceFleetConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceFleetConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstanceFleetConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstanceFleetConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the EMR cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-clusterid
     */
    public clusterId: string;

    /**
     * The node type that the instance fleet hosts.
     *
     * *Allowed Values* : TASK
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancefleettype
     */
    public instanceFleetType: string;

    /**
     * `InstanceTypeConfigs` determine the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfigs
     */
    public instanceTypeConfigs: Array<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The launch specification for the instance fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-launchspecifications
     */
    public launchSpecifications: CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable | undefined;

    /**
     * The friendly name of the instance fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-name
     */
    public name: string | undefined;

    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision. When the instance fleet launches, Amazon EMR tries to provision On-Demand instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When an On-Demand instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only Spot instances are provisioned for the instance fleet using `TargetSpotCapacity` . At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetondemandcapacity
     */
    public targetOnDemandCapacity: number | undefined;

    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision. When the instance fleet launches, Amazon EMR tries to provision Spot instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When a Spot instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only On-Demand instances are provisioned for the instance fleet. At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetspotcapacity
     */
    public targetSpotCapacity: number | undefined;

    /**
     * Create a new `AWS::EMR::InstanceFleetConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceFleetConfigProps) {
        super(scope, id, { type: CfnInstanceFleetConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'clusterId', this);
        cdk.requireProperty(props, 'instanceFleetType', this);

        this.clusterId = props.clusterId;
        this.instanceFleetType = props.instanceFleetType;
        this.instanceTypeConfigs = props.instanceTypeConfigs;
        this.launchSpecifications = props.launchSpecifications;
        this.name = props.name;
        this.targetOnDemandCapacity = props.targetOnDemandCapacity;
        this.targetSpotCapacity = props.targetSpotCapacity;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceFleetConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            clusterId: this.clusterId,
            instanceFleetType: this.instanceFleetType,
            instanceTypeConfigs: this.instanceTypeConfigs,
            launchSpecifications: this.launchSpecifications,
            name: this.name,
            targetOnDemandCapacity: this.targetOnDemandCapacity,
            targetSpotCapacity: this.targetSpotCapacity,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstanceFleetConfigPropsToCloudFormation(props);
    }
}

export namespace CfnInstanceFleetConfig {
    /**
     * > Used only with Amazon EMR release 4.0 and later.
     *
     * `Configuration` specifies optional configurations for customizing open-source big data applications and environment parameters. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) in the *Amazon EMR Release Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html
     */
    export interface ConfigurationProperty {
        /**
         * The classification within a configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-classification
         */
        readonly classification?: string;
        /**
         * Within a configuration classification, a set of properties that represent the settings that you want to change in the configuration file. Duplicates not allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-configurationproperties
         */
        readonly configurationProperties?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * A list of additional configurations to apply within a configuration object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-configurations
         */
        readonly configurations?: Array<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('classification', cdk.validateString)(properties.classification));
    errors.collect(cdk.propertyValidator('configurationProperties', cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnInstanceFleetConfig_ConfigurationPropertyValidator))(properties.configurations));
    return errors.wrap('supplied properties not correct for "ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.Configuration` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.Configuration` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Classification: cdk.stringToCloudFormation(properties.classification),
        ConfigurationProperties: cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
        Configurations: cdk.listMapper(cfnInstanceFleetConfigConfigurationPropertyToCloudFormation)(properties.configurations),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.ConfigurationProperty>();
    ret.addPropertyResult('classification', 'Classification', properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined);
    ret.addPropertyResult('configurationProperties', 'ConfigurationProperties', properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * `EbsBlockDeviceConfig` is a subproperty of the `EbsConfiguration` property type. `EbsBlockDeviceConfig` defines the number and type of EBS volumes to associate with all EC2 instances in an EMR cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html
     */
    export interface EbsBlockDeviceConfigProperty {
        /**
         * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an EC2 instance in the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html#cfn-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig-volumespecification
         */
        readonly volumeSpecification: CfnInstanceFleetConfig.VolumeSpecificationProperty | cdk.IResolvable;
        /**
         * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html#cfn-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig-volumesperinstance
         */
        readonly volumesPerInstance?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_EbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('volumeSpecification', cdk.requiredValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumeSpecification', CfnInstanceFleetConfig_VolumeSpecificationPropertyValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumesPerInstance', cdk.validateNumber)(properties.volumesPerInstance));
    return errors.wrap('supplied properties not correct for "EbsBlockDeviceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.EbsBlockDeviceConfig` resource
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.EbsBlockDeviceConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_EbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
    return {
        VolumeSpecification: cfnInstanceFleetConfigVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
        VolumesPerInstance: cdk.numberToCloudFormation(properties.volumesPerInstance),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty>();
    ret.addPropertyResult('volumeSpecification', 'VolumeSpecification', CfnInstanceFleetConfigVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification));
    ret.addPropertyResult('volumesPerInstance', 'VolumesPerInstance', properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html
     */
    export interface EbsConfigurationProperty {
        /**
         * An array of Amazon EBS volume specifications attached to a cluster instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html#cfn-elasticmapreduce-instancefleetconfig-ebsconfiguration-ebsblockdeviceconfigs
         */
        readonly ebsBlockDeviceConfigs?: Array<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Indicates whether an Amazon EBS volume is EBS-optimized.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html#cfn-elasticmapreduce-instancefleetconfig-ebsconfiguration-ebsoptimized
         */
        readonly ebsOptimized?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_EbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ebsBlockDeviceConfigs', cdk.listValidator(CfnInstanceFleetConfig_EbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
    errors.collect(cdk.propertyValidator('ebsOptimized', cdk.validateBoolean)(properties.ebsOptimized));
    return errors.wrap('supplied properties not correct for "EbsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.EbsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.EbsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigEbsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_EbsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EbsBlockDeviceConfigs: cdk.listMapper(cfnInstanceFleetConfigEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
        EbsOptimized: cdk.booleanToCloudFormation(properties.ebsOptimized),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.EbsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.EbsConfigurationProperty>();
    ret.addPropertyResult('ebsBlockDeviceConfigs', 'EbsBlockDeviceConfigs', properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined);
    ret.addPropertyResult('ebsOptimized', 'EbsOptimized', properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * `InstanceTypeConfig` is a sub-property of `InstanceFleetConfig` . `InstanceTypeConfig` determines the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancefleetprovisioningspecifications.html
     */
    export interface InstanceFleetProvisioningSpecificationsProperty {
        /**
         * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
         *
         * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR version 5.12.1 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancefleetprovisioningspecifications.html#cfn-elasticmapreduce-instancefleetconfig-instancefleetprovisioningspecifications-ondemandspecification
         */
        readonly onDemandSpecification?: CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty | cdk.IResolvable;
        /**
         * The launch specification for Spot Instances in the fleet, which determines the defined duration, provisioning timeout behavior, and allocation strategy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancefleetprovisioningspecifications.html#cfn-elasticmapreduce-instancefleetconfig-instancefleetprovisioningspecifications-spotspecification
         */
        readonly spotSpecification?: CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_InstanceFleetProvisioningSpecificationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onDemandSpecification', CfnInstanceFleetConfig_OnDemandProvisioningSpecificationPropertyValidator)(properties.onDemandSpecification));
    errors.collect(cdk.propertyValidator('spotSpecification', CfnInstanceFleetConfig_SpotProvisioningSpecificationPropertyValidator)(properties.spotSpecification));
    return errors.wrap('supplied properties not correct for "InstanceFleetProvisioningSpecificationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.InstanceFleetProvisioningSpecifications` resource
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.InstanceFleetProvisioningSpecifications` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_InstanceFleetProvisioningSpecificationsPropertyValidator(properties).assertSuccess();
    return {
        OnDemandSpecification: cfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyToCloudFormation(properties.onDemandSpecification),
        SpotSpecification: cfnInstanceFleetConfigSpotProvisioningSpecificationPropertyToCloudFormation(properties.spotSpecification),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty>();
    ret.addPropertyResult('onDemandSpecification', 'OnDemandSpecification', properties.OnDemandSpecification != null ? CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties.OnDemandSpecification) : undefined);
    ret.addPropertyResult('spotSpecification', 'SpotSpecification', properties.SpotSpecification != null ? CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyFromCloudFormation(properties.SpotSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * `InstanceType` config is a subproperty of `InstanceFleetConfig` . An instance type configuration specifies each instance type in an instance fleet. The configuration determines the EC2 instances Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html
     */
    export interface InstanceTypeConfigProperty {
        /**
         * The bid price for each EC2 Spot Instance type as defined by `InstanceType` . Expressed in USD. If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-bidprice
         */
        readonly bidPrice?: string;
        /**
         * The bid price, as a percentage of On-Demand price, for each EC2 Spot Instance as defined by `InstanceType` . Expressed as a number (for example, 20 specifies 20%). If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-bidpriceaspercentageofondemandprice
         */
        readonly bidPriceAsPercentageOfOnDemandPrice?: number;
        /**
         * > Amazon EMR releases 4.x or later.
         *
         * An optional configuration specification to be used when provisioning cluster instances, which can include configurations for applications and software bundled with Amazon EMR. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-configurations
         */
        readonly configurations?: Array<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The custom AMI ID to use for the instance type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-customamiid
         */
        readonly customAmiId?: string;
        /**
         * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by `InstanceType` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-ebsconfiguration
         */
        readonly ebsConfiguration?: CfnInstanceFleetConfig.EbsConfigurationProperty | cdk.IResolvable;
        /**
         * An EC2 instance type, such as `m3.xlarge` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-instancetype
         */
        readonly instanceType: string;
        /**
         * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in `InstanceFleetConfig` . This value is 1 for a master instance fleet, and must be 1 or greater for core and task instance fleets. Defaults to 1 if not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-instancetypeconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfig-weightedcapacity
         */
        readonly weightedCapacity?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_InstanceTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bidPrice', cdk.validateString)(properties.bidPrice));
    errors.collect(cdk.propertyValidator('bidPriceAsPercentageOfOnDemandPrice', cdk.validateNumber)(properties.bidPriceAsPercentageOfOnDemandPrice));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnInstanceFleetConfig_ConfigurationPropertyValidator))(properties.configurations));
    errors.collect(cdk.propertyValidator('customAmiId', cdk.validateString)(properties.customAmiId));
    errors.collect(cdk.propertyValidator('ebsConfiguration', CfnInstanceFleetConfig_EbsConfigurationPropertyValidator)(properties.ebsConfiguration));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('weightedCapacity', cdk.validateNumber)(properties.weightedCapacity));
    return errors.wrap('supplied properties not correct for "InstanceTypeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.InstanceTypeConfig` resource
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.InstanceTypeConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigInstanceTypeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_InstanceTypeConfigPropertyValidator(properties).assertSuccess();
    return {
        BidPrice: cdk.stringToCloudFormation(properties.bidPrice),
        BidPriceAsPercentageOfOnDemandPrice: cdk.numberToCloudFormation(properties.bidPriceAsPercentageOfOnDemandPrice),
        Configurations: cdk.listMapper(cfnInstanceFleetConfigConfigurationPropertyToCloudFormation)(properties.configurations),
        CustomAmiId: cdk.stringToCloudFormation(properties.customAmiId),
        EbsConfiguration: cfnInstanceFleetConfigEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        WeightedCapacity: cdk.numberToCloudFormation(properties.weightedCapacity),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.InstanceTypeConfigProperty>();
    ret.addPropertyResult('bidPrice', 'BidPrice', properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined);
    ret.addPropertyResult('bidPriceAsPercentageOfOnDemandPrice', 'BidPriceAsPercentageOfOnDemandPrice', properties.BidPriceAsPercentageOfOnDemandPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.BidPriceAsPercentageOfOnDemandPrice) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addPropertyResult('customAmiId', 'CustomAmiId', properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined);
    ret.addPropertyResult('ebsConfiguration', 'EbsConfiguration', properties.EbsConfiguration != null ? CfnInstanceFleetConfigEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined);
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('weightedCapacity', 'WeightedCapacity', properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.WeightedCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR version 5.12.1 and later.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ondemandprovisioningspecification.html
     */
    export interface OnDemandProvisioningSpecificationProperty {
        /**
         * Specifies the strategy to use in launching On-Demand instance fleets. Currently, the only option is `lowest-price` (the default), which launches the lowest price first.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ondemandprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-ondemandprovisioningspecification-allocationstrategy
         */
        readonly allocationStrategy: string;
    }
}

/**
 * Determine whether the given properties match those of a `OnDemandProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_OnDemandProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.requiredValidator)(properties.allocationStrategy));
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.validateString)(properties.allocationStrategy));
    return errors.wrap('supplied properties not correct for "OnDemandProvisioningSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.OnDemandProvisioningSpecification` resource
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.OnDemandProvisioningSpecification` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_OnDemandProvisioningSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllocationStrategy: cdk.stringToCloudFormation(properties.allocationStrategy),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty>();
    ret.addPropertyResult('allocationStrategy', 'AllocationStrategy', cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * `SpotProvisioningSpecification` is a subproperty of the `InstanceFleetProvisioningSpecifications` property type. `SpotProvisioningSpecification` determines the launch specification for Spot instances in the instance fleet, which includes the defined duration and provisioning timeout behavior.
     *
     * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html
     */
    export interface SpotProvisioningSpecificationProperty {
        /**
         * Specifies the strategy to use in launching Spot Instance fleets. Currently, the only option is capacity-optimized (the default), which launches instances from Spot Instance pools with optimal capacity for the number of instances that are launching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-allocationstrategy
         */
        readonly allocationStrategy?: string;
        /**
         * The defined duration for Spot Instances (also known as Spot blocks) in minutes. When specified, the Spot Instance does not terminate before the defined duration expires, and defined duration pricing for Spot Instances applies. Valid values are 60, 120, 180, 240, 300, or 360. The duration period starts as soon as a Spot Instance receives its instance ID. At the end of the duration, Amazon EC2 marks the Spot Instance for termination and provides a Spot Instance termination notice, which gives the instance a two-minute warning before it terminates.
         *
         * > Spot Instances with a defined duration (also known as Spot blocks) are no longer available to new customers from July 1, 2021. For customers who have previously used the feature, we will continue to support Spot Instances with a defined duration until December 31, 2022.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-blockdurationminutes
         */
        readonly blockDurationMinutes?: number;
        /**
         * The action to take when `TargetSpotCapacity` has not been fulfilled when the `TimeoutDurationMinutes` has expired; that is, when all Spot Instances could not be provisioned within the Spot provisioning timeout. Valid values are `TERMINATE_CLUSTER` and `SWITCH_TO_ON_DEMAND` . SWITCH_TO_ON_DEMAND specifies that if no Spot Instances are available, On-Demand Instances should be provisioned to fulfill any remaining Spot capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutaction
         */
        readonly timeoutAction: string;
        /**
         * The spot provisioning timeout period in minutes. If Spot Instances are not provisioned within this time period, the `TimeOutAction` is taken. Minimum value is 5 and maximum value is 1440. The timeout applies only during initial provisioning, when the cluster is first created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutdurationminutes
         */
        readonly timeoutDurationMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `SpotProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_SpotProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocationStrategy', cdk.validateString)(properties.allocationStrategy));
    errors.collect(cdk.propertyValidator('blockDurationMinutes', cdk.validateNumber)(properties.blockDurationMinutes));
    errors.collect(cdk.propertyValidator('timeoutAction', cdk.requiredValidator)(properties.timeoutAction));
    errors.collect(cdk.propertyValidator('timeoutAction', cdk.validateString)(properties.timeoutAction));
    errors.collect(cdk.propertyValidator('timeoutDurationMinutes', cdk.requiredValidator)(properties.timeoutDurationMinutes));
    errors.collect(cdk.propertyValidator('timeoutDurationMinutes', cdk.validateNumber)(properties.timeoutDurationMinutes));
    return errors.wrap('supplied properties not correct for "SpotProvisioningSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.SpotProvisioningSpecification` resource
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.SpotProvisioningSpecification` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigSpotProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_SpotProvisioningSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllocationStrategy: cdk.stringToCloudFormation(properties.allocationStrategy),
        BlockDurationMinutes: cdk.numberToCloudFormation(properties.blockDurationMinutes),
        TimeoutAction: cdk.stringToCloudFormation(properties.timeoutAction),
        TimeoutDurationMinutes: cdk.numberToCloudFormation(properties.timeoutDurationMinutes),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty>();
    ret.addPropertyResult('allocationStrategy', 'AllocationStrategy', properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined);
    ret.addPropertyResult('blockDurationMinutes', 'BlockDurationMinutes', properties.BlockDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockDurationMinutes) : undefined);
    ret.addPropertyResult('timeoutAction', 'TimeoutAction', cfn_parse.FromCloudFormation.getString(properties.TimeoutAction));
    ret.addPropertyResult('timeoutDurationMinutes', 'TimeoutDurationMinutes', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutDurationMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceFleetConfig {
    /**
     * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type. `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-volumespecification.html
     */
    export interface VolumeSpecificationProperty {
        /**
         * The number of I/O operations per second (IOPS) that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-volumespecification.html#cfn-elasticmapreduce-instancefleetconfig-volumespecification-iops
         */
        readonly iops?: number;
        /**
         * The volume size, in gibibytes (GiB). This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-volumespecification.html#cfn-elasticmapreduce-instancefleetconfig-volumespecification-sizeingb
         */
        readonly sizeInGb: number;
        /**
         * The volume type. Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-volumespecification.html#cfn-elasticmapreduce-instancefleetconfig-volumespecification-volumetype
         */
        readonly volumeType: string;
    }
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceFleetConfig_VolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.requiredValidator)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.validateNumber)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('volumeType', cdk.requiredValidator)(properties.volumeType));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "VolumeSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.VolumeSpecification` resource
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceFleetConfig.VolumeSpecification` resource.
 */
// @ts-ignore TS6133
function cfnInstanceFleetConfigVolumeSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceFleetConfig_VolumeSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Iops: cdk.numberToCloudFormation(properties.iops),
        SizeInGB: cdk.numberToCloudFormation(properties.sizeInGb),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.VolumeSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.VolumeSpecificationProperty>();
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('sizeInGb', 'SizeInGB', cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB));
    ret.addPropertyResult('volumeType', 'VolumeType', cfn_parse.FromCloudFormation.getString(properties.VolumeType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInstanceGroupConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html
 */
export interface CfnInstanceGroupConfigProps {

    /**
     * Target number of instances for the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfiginstancecount-
     */
    readonly instanceCount: number;

    /**
     * The role of the instance group in the cluster.
     *
     * *Allowed Values* : TASK
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancerole
     */
    readonly instanceRole: string;

    /**
     * The EC2 instance type for all instances in the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancetype
     */
    readonly instanceType: string;

    /**
     * The ID of an Amazon EMR cluster that you want to associate this instance group with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-jobflowid
     */
    readonly jobFlowId: string;

    /**
     * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` . `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy
     */
    readonly autoScalingPolicy?: CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable;

    /**
     * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify `OnDemandPrice` to set the amount equal to the On-Demand price, or specify an amount in USD.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-bidprice
     */
    readonly bidPrice?: string;

    /**
     * > Amazon EMR releases 4.x or later.
     *
     * The list of configurations supplied for an EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-configurations
     */
    readonly configurations?: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The custom AMI ID to use for the provisioned instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-customamiid
     */
    readonly customAmiId?: string;

    /**
     * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-ebsconfiguration
     */
    readonly ebsConfiguration?: CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable;

    /**
     * Market type of the EC2 instances used to create a cluster node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-market
     */
    readonly market?: string;

    /**
     * Friendly name given to the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-name
     */
    readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceGroupConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceGroupConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoScalingPolicy', CfnInstanceGroupConfig_AutoScalingPolicyPropertyValidator)(properties.autoScalingPolicy));
    errors.collect(cdk.propertyValidator('bidPrice', cdk.validateString)(properties.bidPrice));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnInstanceGroupConfig_ConfigurationPropertyValidator))(properties.configurations));
    errors.collect(cdk.propertyValidator('customAmiId', cdk.validateString)(properties.customAmiId));
    errors.collect(cdk.propertyValidator('ebsConfiguration', CfnInstanceGroupConfig_EbsConfigurationPropertyValidator)(properties.ebsConfiguration));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.requiredValidator)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.validateNumber)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('instanceRole', cdk.requiredValidator)(properties.instanceRole));
    errors.collect(cdk.propertyValidator('instanceRole', cdk.validateString)(properties.instanceRole));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('jobFlowId', cdk.requiredValidator)(properties.jobFlowId));
    errors.collect(cdk.propertyValidator('jobFlowId', cdk.validateString)(properties.jobFlowId));
    errors.collect(cdk.propertyValidator('market', cdk.validateString)(properties.market));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnInstanceGroupConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceGroupConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfigPropsValidator(properties).assertSuccess();
    return {
        InstanceCount: cdk.numberToCloudFormation(properties.instanceCount),
        InstanceRole: cdk.stringToCloudFormation(properties.instanceRole),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        JobFlowId: cdk.stringToCloudFormation(properties.jobFlowId),
        AutoScalingPolicy: cfnInstanceGroupConfigAutoScalingPolicyPropertyToCloudFormation(properties.autoScalingPolicy),
        BidPrice: cdk.stringToCloudFormation(properties.bidPrice),
        Configurations: cdk.listMapper(cfnInstanceGroupConfigConfigurationPropertyToCloudFormation)(properties.configurations),
        CustomAmiId: cdk.stringToCloudFormation(properties.customAmiId),
        EbsConfiguration: cfnInstanceGroupConfigEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
        Market: cdk.stringToCloudFormation(properties.market),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfigProps>();
    ret.addPropertyResult('instanceCount', 'InstanceCount', cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount));
    ret.addPropertyResult('instanceRole', 'InstanceRole', cfn_parse.FromCloudFormation.getString(properties.InstanceRole));
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('jobFlowId', 'JobFlowId', cfn_parse.FromCloudFormation.getString(properties.JobFlowId));
    ret.addPropertyResult('autoScalingPolicy', 'AutoScalingPolicy', properties.AutoScalingPolicy != null ? CfnInstanceGroupConfigAutoScalingPolicyPropertyFromCloudFormation(properties.AutoScalingPolicy) : undefined);
    ret.addPropertyResult('bidPrice', 'BidPrice', properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addPropertyResult('customAmiId', 'CustomAmiId', properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined);
    ret.addPropertyResult('ebsConfiguration', 'EbsConfiguration', properties.EbsConfiguration != null ? CfnInstanceGroupConfigEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined);
    ret.addPropertyResult('market', 'Market', properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::InstanceGroupConfig`
 *
 * Use `InstanceGroupConfig` to define instance groups for an EMR cluster. A cluster can not use both instance groups and instance fleets. For more information, see [Create a Cluster with Instance Fleets or Uniform Instance Groups](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * > You can currently only add task instance groups to a cluster with this resource. If you use this resource, CloudFormation waits for the cluster launch to complete before adding the task instance group to the cluster. In order to add task instance groups to the cluster as part of the cluster launch and minimize delays in provisioning task nodes, use the `TaskInstanceGroups` subproperty for the [AWS::EMR::Cluster JobFlowInstancesConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html) property instead. To use this subproperty, see [AWS::EMR::Cluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html) for examples.
 *
 * @cloudformationResource AWS::EMR::InstanceGroupConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html
 */
export class CfnInstanceGroupConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::InstanceGroupConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceGroupConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstanceGroupConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstanceGroupConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Target number of instances for the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfiginstancecount-
     */
    public instanceCount: number;

    /**
     * The role of the instance group in the cluster.
     *
     * *Allowed Values* : TASK
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancerole
     */
    public instanceRole: string;

    /**
     * The EC2 instance type for all instances in the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancetype
     */
    public instanceType: string;

    /**
     * The ID of an Amazon EMR cluster that you want to associate this instance group with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-jobflowid
     */
    public jobFlowId: string;

    /**
     * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` . `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy
     */
    public autoScalingPolicy: CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable | undefined;

    /**
     * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify `OnDemandPrice` to set the amount equal to the On-Demand price, or specify an amount in USD.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-bidprice
     */
    public bidPrice: string | undefined;

    /**
     * > Amazon EMR releases 4.x or later.
     *
     * The list of configurations supplied for an EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-configurations
     */
    public configurations: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The custom AMI ID to use for the provisioned instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-customamiid
     */
    public customAmiId: string | undefined;

    /**
     * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-ebsconfiguration
     */
    public ebsConfiguration: CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Market type of the EC2 instances used to create a cluster node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-market
     */
    public market: string | undefined;

    /**
     * Friendly name given to the instance group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-name
     */
    public name: string | undefined;

    /**
     * Create a new `AWS::EMR::InstanceGroupConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceGroupConfigProps) {
        super(scope, id, { type: CfnInstanceGroupConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceCount', this);
        cdk.requireProperty(props, 'instanceRole', this);
        cdk.requireProperty(props, 'instanceType', this);
        cdk.requireProperty(props, 'jobFlowId', this);

        this.instanceCount = props.instanceCount;
        this.instanceRole = props.instanceRole;
        this.instanceType = props.instanceType;
        this.jobFlowId = props.jobFlowId;
        this.autoScalingPolicy = props.autoScalingPolicy;
        this.bidPrice = props.bidPrice;
        this.configurations = props.configurations;
        this.customAmiId = props.customAmiId;
        this.ebsConfiguration = props.ebsConfiguration;
        this.market = props.market;
        this.name = props.name;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceGroupConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceCount: this.instanceCount,
            instanceRole: this.instanceRole,
            instanceType: this.instanceType,
            jobFlowId: this.jobFlowId,
            autoScalingPolicy: this.autoScalingPolicy,
            bidPrice: this.bidPrice,
            configurations: this.configurations,
            customAmiId: this.customAmiId,
            ebsConfiguration: this.ebsConfiguration,
            market: this.market,
            name: this.name,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstanceGroupConfigPropsToCloudFormation(props);
    }
}

export namespace CfnInstanceGroupConfig {
    /**
     * `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html
     */
    export interface AutoScalingPolicyProperty {
        /**
         * The upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activity will not cause an instance group to grow above or below these limits.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-constraints
         */
        readonly constraints: CfnInstanceGroupConfig.ScalingConstraintsProperty | cdk.IResolvable;
        /**
         * The scale-in and scale-out rules that comprise the automatic scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-rules
         */
        readonly rules: Array<CfnInstanceGroupConfig.ScalingRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AutoScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_AutoScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('constraints', cdk.requiredValidator)(properties.constraints));
    errors.collect(cdk.propertyValidator('constraints', CfnInstanceGroupConfig_ScalingConstraintsPropertyValidator)(properties.constraints));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnInstanceGroupConfig_ScalingRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "AutoScalingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.AutoScalingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.AutoScalingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigAutoScalingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_AutoScalingPolicyPropertyValidator(properties).assertSuccess();
    return {
        Constraints: cfnInstanceGroupConfigScalingConstraintsPropertyToCloudFormation(properties.constraints),
        Rules: cdk.listMapper(cfnInstanceGroupConfigScalingRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigAutoScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.AutoScalingPolicyProperty>();
    ret.addPropertyResult('constraints', 'Constraints', CfnInstanceGroupConfigScalingConstraintsPropertyFromCloudFormation(properties.Constraints));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigScalingRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `CloudWatchAlarmDefinition` is a subproperty of the `ScalingTrigger` property, which determines when to trigger an automatic scaling activity. Scaling activity begins when you satisfy the defined alarm conditions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html
     */
    export interface CloudWatchAlarmDefinitionProperty {
        /**
         * Determines how the metric specified by `MetricName` is compared to the value specified by `Threshold` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * A CloudWatch metric dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-dimensions
         */
        readonly dimensions?: Array<CfnInstanceGroupConfig.MetricDimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The number of periods, in five-minute increments, during which the alarm condition must exist before the alarm triggers automatic scaling activity. The default value is `1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-evaluationperiods
         */
        readonly evaluationPeriods?: number;
        /**
         * The name of the CloudWatch metric that is watched to determine an alarm condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-metricname
         */
        readonly metricName: string;
        /**
         * The namespace for the CloudWatch metric. The default is `AWS/ElasticMapReduce` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-namespace
         */
        readonly namespace?: string;
        /**
         * The period, in seconds, over which the statistic is applied. EMR CloudWatch metrics are emitted every five minutes (300 seconds), so if an EMR CloudWatch metric is specified, specify `300` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-period
         */
        readonly period: number;
        /**
         * The statistic to apply to the metric associated with the alarm. The default is `AVERAGE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-statistic
         */
        readonly statistic?: string;
        /**
         * The value against which the specified statistic is compared.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-threshold
         */
        readonly threshold: number;
        /**
         * The unit of measure associated with the CloudWatch metric being watched. The value specified for `Unit` must correspond to the units specified in the CloudWatch metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-elasticmapreduce-instancegroupconfig-cloudwatchalarmdefinition-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchAlarmDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_CloudWatchAlarmDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnInstanceGroupConfig_MetricDimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.validateNumber)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('period', cdk.requiredValidator)(properties.period));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('statistic', cdk.validateString)(properties.statistic));
    errors.collect(cdk.propertyValidator('threshold', cdk.requiredValidator)(properties.threshold));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "CloudWatchAlarmDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.CloudWatchAlarmDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.CloudWatchAlarmDefinition` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_CloudWatchAlarmDefinitionPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        Dimensions: cdk.listMapper(cfnInstanceGroupConfigMetricDimensionPropertyToCloudFormation)(properties.dimensions),
        EvaluationPeriods: cdk.numberToCloudFormation(properties.evaluationPeriods),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        Period: cdk.numberToCloudFormation(properties.period),
        Statistic: cdk.stringToCloudFormation(properties.statistic),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('evaluationPeriods', 'EvaluationPeriods', properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('period', 'Period', cfn_parse.FromCloudFormation.getNumber(properties.Period));
    ret.addPropertyResult('statistic', 'Statistic', properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined);
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `Configurations` is a property of the `AWS::EMR::Cluster` resource that specifies the configuration of applications on an Amazon EMR cluster.
     *
     * Configurations are optional. You can use them to have EMR customize applications and software bundled with Amazon EMR when a cluster is created. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) .
     *
     * > Applies only to Amazon EMR releases 4.0 and later.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html
     */
    export interface ConfigurationProperty {
        /**
         * The classification within a configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-classification
         */
        readonly classification?: string;
        /**
         * Within a configuration classification, a set of properties that represent the settings that you want to change in the configuration file. Duplicates not allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-configurationproperties
         */
        readonly configurationProperties?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * A list of additional configurations to apply within a configuration object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-configurations
         */
        readonly configurations?: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('classification', cdk.validateString)(properties.classification));
    errors.collect(cdk.propertyValidator('configurationProperties', cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
    errors.collect(cdk.propertyValidator('configurations', cdk.listValidator(CfnInstanceGroupConfig_ConfigurationPropertyValidator))(properties.configurations));
    return errors.wrap('supplied properties not correct for "ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.Configuration` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.Configuration` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Classification: cdk.stringToCloudFormation(properties.classification),
        ConfigurationProperties: cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
        Configurations: cdk.listMapper(cfnInstanceGroupConfigConfigurationPropertyToCloudFormation)(properties.configurations),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ConfigurationProperty>();
    ret.addPropertyResult('classification', 'Classification', properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined);
    ret.addPropertyResult('configurationProperties', 'ConfigurationProperties', properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined);
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * Configuration of requested EBS block device associated with the instance group with count of volumes that are associated to every instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html
     */
    export interface EbsBlockDeviceConfigProperty {
        /**
         * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an EC2 instance in the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification
         */
        readonly volumeSpecification: CfnInstanceGroupConfig.VolumeSpecificationProperty | cdk.IResolvable;
        /**
         * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumesperinstance
         */
        readonly volumesPerInstance?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_EbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('volumeSpecification', cdk.requiredValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumeSpecification', CfnInstanceGroupConfig_VolumeSpecificationPropertyValidator)(properties.volumeSpecification));
    errors.collect(cdk.propertyValidator('volumesPerInstance', cdk.validateNumber)(properties.volumesPerInstance));
    return errors.wrap('supplied properties not correct for "EbsBlockDeviceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.EbsBlockDeviceConfig` resource
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.EbsBlockDeviceConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_EbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
    return {
        VolumeSpecification: cfnInstanceGroupConfigVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
        VolumesPerInstance: cdk.numberToCloudFormation(properties.volumesPerInstance),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty>();
    ret.addPropertyResult('volumeSpecification', 'VolumeSpecification', CfnInstanceGroupConfigVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification));
    ret.addPropertyResult('volumesPerInstance', 'VolumesPerInstance', properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * The Amazon EBS configuration of a cluster instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration.html
     */
    export interface EbsConfigurationProperty {
        /**
         * An array of Amazon EBS volume specifications attached to a cluster instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfigs
         */
        readonly ebsBlockDeviceConfigs?: Array<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Indicates whether an Amazon EBS volume is EBS-optimized.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration.html#cfn-emr-ebsconfiguration-ebsoptimized
         */
        readonly ebsOptimized?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_EbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ebsBlockDeviceConfigs', cdk.listValidator(CfnInstanceGroupConfig_EbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
    errors.collect(cdk.propertyValidator('ebsOptimized', cdk.validateBoolean)(properties.ebsOptimized));
    return errors.wrap('supplied properties not correct for "EbsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.EbsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.EbsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigEbsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_EbsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EbsBlockDeviceConfigs: cdk.listMapper(cfnInstanceGroupConfigEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
        EbsOptimized: cdk.booleanToCloudFormation(properties.ebsOptimized),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.EbsConfigurationProperty>();
    ret.addPropertyResult('ebsBlockDeviceConfigs', 'EbsBlockDeviceConfigs', properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined);
    ret.addPropertyResult('ebsOptimized', 'EbsOptimized', properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `MetricDimension` is a subproperty of the `CloudWatchAlarmDefinition` property type. `MetricDimension` specifies a CloudWatch dimension, which is specified with a `Key` `Value` pair. The key is known as a `Name` in CloudWatch. By default, Amazon EMR uses one dimension whose `Key` is `JobFlowID` and `Value` is a variable representing the cluster ID, which is `${emr.clusterId}` . This enables the automatic scaling rule for EMR to bootstrap when the cluster ID becomes available during cluster creation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-metricdimension.html
     */
    export interface MetricDimensionProperty {
        /**
         * The dimension name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-metricdimension.html#cfn-elasticmapreduce-instancegroupconfig-metricdimension-key
         */
        readonly key: string;
        /**
         * The dimension value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-metricdimension.html#cfn-elasticmapreduce-instancegroupconfig-metricdimension-value
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
function CfnInstanceGroupConfig_MetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "MetricDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.MetricDimension` resource
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.MetricDimension` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigMetricDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_MetricDimensionPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.MetricDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.MetricDimensionProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `ScalingAction` is a subproperty of the `ScalingRule` property type. `ScalingAction` determines the type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html
     */
    export interface ScalingActionProperty {
        /**
         * Not available for instance groups. Instance groups use the market type specified for the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html#cfn-elasticmapreduce-instancegroupconfig-scalingaction-market
         */
        readonly market?: string;
        /**
         * The type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html#cfn-elasticmapreduce-instancegroupconfig-scalingaction-simplescalingpolicyconfiguration
         */
        readonly simpleScalingPolicyConfiguration: CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_ScalingActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('market', cdk.validateString)(properties.market));
    errors.collect(cdk.propertyValidator('simpleScalingPolicyConfiguration', cdk.requiredValidator)(properties.simpleScalingPolicyConfiguration));
    errors.collect(cdk.propertyValidator('simpleScalingPolicyConfiguration', CfnInstanceGroupConfig_SimpleScalingPolicyConfigurationPropertyValidator)(properties.simpleScalingPolicyConfiguration));
    return errors.wrap('supplied properties not correct for "ScalingActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingAction` resource
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingAction` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigScalingActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_ScalingActionPropertyValidator(properties).assertSuccess();
    return {
        Market: cdk.stringToCloudFormation(properties.market),
        SimpleScalingPolicyConfiguration: cfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties.simpleScalingPolicyConfiguration),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ScalingActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingActionProperty>();
    ret.addPropertyResult('market', 'Market', properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined);
    ret.addPropertyResult('simpleScalingPolicyConfiguration', 'SimpleScalingPolicyConfiguration', CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties.SimpleScalingPolicyConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `ScalingConstraints` is a subproperty of the `AutoScalingPolicy` property type. `ScalingConstraints` defines the upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activities triggered by automatic scaling rules will not cause an instance group to grow above or shrink below these limits.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html
     */
    export interface ScalingConstraintsProperty {
        /**
         * The upper boundary of EC2 instances in an instance group beyond which scaling activities are not allowed to grow. Scale-out activities will not add instances beyond this boundary.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html#cfn-elasticmapreduce-instancegroupconfig-scalingconstraints-maxcapacity
         */
        readonly maxCapacity: number;
        /**
         * The lower boundary of EC2 instances in an instance group below which scaling activities are not allowed to shrink. Scale-in activities will not terminate instances below this boundary.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html#cfn-elasticmapreduce-instancegroupconfig-scalingconstraints-mincapacity
         */
        readonly minCapacity: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_ScalingConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.requiredValidator)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.validateNumber)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.requiredValidator)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.validateNumber)(properties.minCapacity));
    return errors.wrap('supplied properties not correct for "ScalingConstraintsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingConstraints` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigScalingConstraintsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_ScalingConstraintsPropertyValidator(properties).assertSuccess();
    return {
        MaxCapacity: cdk.numberToCloudFormation(properties.maxCapacity),
        MinCapacity: cdk.numberToCloudFormation(properties.minCapacity),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ScalingConstraintsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingConstraintsProperty>();
    ret.addPropertyResult('maxCapacity', 'MaxCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity));
    ret.addPropertyResult('minCapacity', 'MinCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `ScalingRule` is a subproperty of the `AutoScalingPolicy` property type. `ScalingRule` defines the scale-in or scale-out rules for scaling activity, including the CloudWatch metric alarm that triggers activity, how EC2 instances are added or removed, and the periodicity of adjustments. The automatic scaling policy for an instance group can comprise one or more automatic scaling rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingrule.html
     */
    export interface ScalingRuleProperty {
        /**
         * The conditions that trigger an automatic scaling activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingrule.html#cfn-elasticmapreduce-instancegroupconfig-scalingrule-action
         */
        readonly action: CfnInstanceGroupConfig.ScalingActionProperty | cdk.IResolvable;
        /**
         * A friendly, more verbose description of the automatic scaling rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingrule.html#cfn-elasticmapreduce-instancegroupconfig-scalingrule-description
         */
        readonly description?: string;
        /**
         * The name used to identify an automatic scaling rule. Rule names must be unique within a scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingrule.html#cfn-elasticmapreduce-instancegroupconfig-scalingrule-name
         */
        readonly name: string;
        /**
         * The CloudWatch alarm definition that determines when automatic scaling activity is triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingrule.html#cfn-elasticmapreduce-instancegroupconfig-scalingrule-trigger
         */
        readonly trigger: CfnInstanceGroupConfig.ScalingTriggerProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_ScalingRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnInstanceGroupConfig_ScalingActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('trigger', cdk.requiredValidator)(properties.trigger));
    errors.collect(cdk.propertyValidator('trigger', CfnInstanceGroupConfig_ScalingTriggerPropertyValidator)(properties.trigger));
    return errors.wrap('supplied properties not correct for "ScalingRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingRule` resource
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingRule` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigScalingRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_ScalingRulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnInstanceGroupConfigScalingActionPropertyToCloudFormation(properties.action),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Trigger: cfnInstanceGroupConfigScalingTriggerPropertyToCloudFormation(properties.trigger),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ScalingRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingRuleProperty>();
    ret.addPropertyResult('action', 'Action', CfnInstanceGroupConfigScalingActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('trigger', 'Trigger', CfnInstanceGroupConfigScalingTriggerPropertyFromCloudFormation(properties.Trigger));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `ScalingTrigger` is a subproperty of the `ScalingRule` property type. `ScalingTrigger` determines the conditions that trigger an automatic scaling activity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html
     */
    export interface ScalingTriggerProperty {
        /**
         * The definition of a CloudWatch metric alarm. When the defined alarm conditions are met along with other trigger parameters, scaling activity begins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html#cfn-elasticmapreduce-instancegroupconfig-scalingtrigger-cloudwatchalarmdefinition
         */
        readonly cloudWatchAlarmDefinition: CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_ScalingTriggerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchAlarmDefinition', cdk.requiredValidator)(properties.cloudWatchAlarmDefinition));
    errors.collect(cdk.propertyValidator('cloudWatchAlarmDefinition', CfnInstanceGroupConfig_CloudWatchAlarmDefinitionPropertyValidator)(properties.cloudWatchAlarmDefinition));
    return errors.wrap('supplied properties not correct for "ScalingTriggerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingTrigger` resource
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.ScalingTrigger` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigScalingTriggerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_ScalingTriggerPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchAlarmDefinition: cfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyToCloudFormation(properties.cloudWatchAlarmDefinition),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ScalingTriggerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingTriggerProperty>();
    ret.addPropertyResult('cloudWatchAlarmDefinition', 'CloudWatchAlarmDefinition', CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties.CloudWatchAlarmDefinition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `SimpleScalingPolicyConfiguration` is a subproperty of the `ScalingAction` property type. `SimpleScalingPolicyConfiguration` determines how an automatic scaling action adds or removes instances, the cooldown period, and the number of EC2 instances that are added each time the CloudWatch metric alarm condition is satisfied.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html
     */
    export interface SimpleScalingPolicyConfigurationProperty {
        /**
         * The way in which EC2 instances are added (if `ScalingAdjustment` is a positive number) or terminated (if `ScalingAdjustment` is a negative number) each time the scaling activity is triggered. `CHANGE_IN_CAPACITY` is the default. `CHANGE_IN_CAPACITY` indicates that the EC2 instance count increments or decrements by `ScalingAdjustment` , which should be expressed as an integer. `PERCENT_CHANGE_IN_CAPACITY` indicates the instance count increments or decrements by the percentage specified by `ScalingAdjustment` , which should be expressed as an integer. For example, 20 indicates an increase in 20% increments of cluster capacity. `EXACT_CAPACITY` indicates the scaling activity results in an instance group with the number of EC2 instances specified by `ScalingAdjustment` , which should be expressed as a positive integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-adjustmenttype
         */
        readonly adjustmentType?: string;
        /**
         * The amount of time, in seconds, after a scaling activity completes before any further trigger-related scaling activities can start. The default value is 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-cooldown
         */
        readonly coolDown?: number;
        /**
         * The amount by which to scale in or scale out, based on the specified `AdjustmentType` . A positive value adds to the instance group's EC2 instance count while a negative number removes instances. If `AdjustmentType` is set to `EXACT_CAPACITY` , the number should only be a positive integer. If `AdjustmentType` is set to `PERCENT_CHANGE_IN_CAPACITY` , the value should express the percentage as an integer. For example, -20 indicates a decrease in 20% increments of cluster capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-scalingadjustment
         */
        readonly scalingAdjustment: number;
    }
}

/**
 * Determine whether the given properties match those of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_SimpleScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adjustmentType', cdk.validateString)(properties.adjustmentType));
    errors.collect(cdk.propertyValidator('coolDown', cdk.validateNumber)(properties.coolDown));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.requiredValidator)(properties.scalingAdjustment));
    errors.collect(cdk.propertyValidator('scalingAdjustment', cdk.validateNumber)(properties.scalingAdjustment));
    return errors.wrap('supplied properties not correct for "SimpleScalingPolicyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.SimpleScalingPolicyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.SimpleScalingPolicyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_SimpleScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdjustmentType: cdk.stringToCloudFormation(properties.adjustmentType),
        CoolDown: cdk.numberToCloudFormation(properties.coolDown),
        ScalingAdjustment: cdk.numberToCloudFormation(properties.scalingAdjustment),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty>();
    ret.addPropertyResult('adjustmentType', 'AdjustmentType', properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined);
    ret.addPropertyResult('coolDown', 'CoolDown', properties.CoolDown != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoolDown) : undefined);
    ret.addPropertyResult('scalingAdjustment', 'ScalingAdjustment', cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceGroupConfig {
    /**
     * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type. `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification.html
     */
    export interface VolumeSpecificationProperty {
        /**
         * The number of I/O operations per second (IOPS) that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification-iops
         */
        readonly iops?: number;
        /**
         * The volume size, in gibibytes (GiB). This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification-sizeingb
         */
        readonly sizeInGb: number;
        /**
         * The volume type. Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification-volumetype
         */
        readonly volumeType: string;
    }
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceGroupConfig_VolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.requiredValidator)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.validateNumber)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('volumeType', cdk.requiredValidator)(properties.volumeType));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "VolumeSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.VolumeSpecification` resource
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::InstanceGroupConfig.VolumeSpecification` resource.
 */
// @ts-ignore TS6133
function cfnInstanceGroupConfigVolumeSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceGroupConfig_VolumeSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Iops: cdk.numberToCloudFormation(properties.iops),
        SizeInGB: cdk.numberToCloudFormation(properties.sizeInGb),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.VolumeSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.VolumeSpecificationProperty>();
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('sizeInGb', 'SizeInGB', cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB));
    ret.addPropertyResult('volumeType', 'VolumeType', cfn_parse.FromCloudFormation.getString(properties.VolumeType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSecurityConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html
 */
export interface CfnSecurityConfigurationProps {

    /**
     * The security configuration details in JSON format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-securityconfiguration
     */
    readonly securityConfiguration: any | cdk.IResolvable;

    /**
     * The name of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-name
     */
    readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnSecurityConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('securityConfiguration', cdk.requiredValidator)(properties.securityConfiguration));
    errors.collect(cdk.propertyValidator('securityConfiguration', cdk.validateObject)(properties.securityConfiguration));
    return errors.wrap('supplied properties not correct for "CfnSecurityConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::SecurityConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::SecurityConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSecurityConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityConfigurationPropsValidator(properties).assertSuccess();
    return {
        SecurityConfiguration: cdk.objectToCloudFormation(properties.securityConfiguration),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfigurationProps>();
    ret.addPropertyResult('securityConfiguration', 'SecurityConfiguration', cfn_parse.FromCloudFormation.getAny(properties.SecurityConfiguration));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::SecurityConfiguration`
 *
 * Use a `SecurityConfiguration` resource to configure data encryption, Kerberos authentication (available in Amazon EMR release version 5.10.0 and later), and Amazon S3 authorization for EMRFS (available in EMR 5.10.0 and later). You can re-use a security configuration for any number of clusters in your account. For more information and example security configuration JSON objects, see [Create a Security Configuration](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-create-security-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * @cloudformationResource AWS::EMR::SecurityConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html
 */
export class CfnSecurityConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::SecurityConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSecurityConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSecurityConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The security configuration details in JSON format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-securityconfiguration
     */
    public securityConfiguration: any | cdk.IResolvable;

    /**
     * The name of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-name
     */
    public name: string | undefined;

    /**
     * Create a new `AWS::EMR::SecurityConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSecurityConfigurationProps) {
        super(scope, id, { type: CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'securityConfiguration', this);

        this.securityConfiguration = props.securityConfiguration;
        this.name = props.name;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            securityConfiguration: this.securityConfiguration,
            name: this.name,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSecurityConfigurationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStep`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html
 */
export interface CfnStepProps {

    /**
     * This specifies what action to take when the cluster step fails. Possible values are `CANCEL_AND_WAIT` and `CONTINUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-actiononfailure
     */
    readonly actionOnFailure: string;

    /**
     * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed. The main function submits a job for the cluster to execute as a step on the master node, and then waits for the job to finish or fail before executing subsequent steps.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-hadoopjarstep
     */
    readonly hadoopJarStep: CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable;

    /**
     * A string that uniquely identifies the cluster (job flow).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-jobflowid
     */
    readonly jobFlowId: string;

    /**
     * The name of the cluster step.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-name
     */
    readonly name: string;
}

/**
 * Determine whether the given properties match those of a `CfnStepProps`
 *
 * @param properties - the TypeScript properties of a `CfnStepProps`
 *
 * @returns the result of the validation.
 */
function CfnStepPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionOnFailure', cdk.requiredValidator)(properties.actionOnFailure));
    errors.collect(cdk.propertyValidator('actionOnFailure', cdk.validateString)(properties.actionOnFailure));
    errors.collect(cdk.propertyValidator('hadoopJarStep', cdk.requiredValidator)(properties.hadoopJarStep));
    errors.collect(cdk.propertyValidator('hadoopJarStep', CfnStep_HadoopJarStepConfigPropertyValidator)(properties.hadoopJarStep));
    errors.collect(cdk.propertyValidator('jobFlowId', cdk.requiredValidator)(properties.jobFlowId));
    errors.collect(cdk.propertyValidator('jobFlowId', cdk.validateString)(properties.jobFlowId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnStepProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Step` resource
 *
 * @param properties - the TypeScript properties of a `CfnStepProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Step` resource.
 */
// @ts-ignore TS6133
function cfnStepPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStepPropsValidator(properties).assertSuccess();
    return {
        ActionOnFailure: cdk.stringToCloudFormation(properties.actionOnFailure),
        HadoopJarStep: cfnStepHadoopJarStepConfigPropertyToCloudFormation(properties.hadoopJarStep),
        JobFlowId: cdk.stringToCloudFormation(properties.jobFlowId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnStepPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStepProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStepProps>();
    ret.addPropertyResult('actionOnFailure', 'ActionOnFailure', cfn_parse.FromCloudFormation.getString(properties.ActionOnFailure));
    ret.addPropertyResult('hadoopJarStep', 'HadoopJarStep', CfnStepHadoopJarStepConfigPropertyFromCloudFormation(properties.HadoopJarStep));
    ret.addPropertyResult('jobFlowId', 'JobFlowId', cfn_parse.FromCloudFormation.getString(properties.JobFlowId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::Step`
 *
 * Use `Step` to specify a cluster (job flow) step, which runs only on the master node. Steps are used to submit data processing jobs to a cluster.
 *
 * @cloudformationResource AWS::EMR::Step
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html
 */
export class CfnStep extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::Step";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStep {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStepPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStep(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * This specifies what action to take when the cluster step fails. Possible values are `CANCEL_AND_WAIT` and `CONTINUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-actiononfailure
     */
    public actionOnFailure: string;

    /**
     * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed. The main function submits a job for the cluster to execute as a step on the master node, and then waits for the job to finish or fail before executing subsequent steps.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-hadoopjarstep
     */
    public hadoopJarStep: CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable;

    /**
     * A string that uniquely identifies the cluster (job flow).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-jobflowid
     */
    public jobFlowId: string;

    /**
     * The name of the cluster step.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-elasticmapreduce-step-name
     */
    public name: string;

    /**
     * Create a new `AWS::EMR::Step`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStepProps) {
        super(scope, id, { type: CfnStep.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actionOnFailure', this);
        cdk.requireProperty(props, 'hadoopJarStep', this);
        cdk.requireProperty(props, 'jobFlowId', this);
        cdk.requireProperty(props, 'name', this);

        this.actionOnFailure = props.actionOnFailure;
        this.hadoopJarStep = props.hadoopJarStep;
        this.jobFlowId = props.jobFlowId;
        this.name = props.name;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStep.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actionOnFailure: this.actionOnFailure,
            hadoopJarStep: this.hadoopJarStep,
            jobFlowId: this.jobFlowId,
            name: this.name,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStepPropsToCloudFormation(props);
    }
}

export namespace CfnStep {
    /**
     * A job flow step consisting of a JAR file whose main function will be executed. The main function submits a job for Hadoop to execute and waits for the job to finish or fail.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-hadoopjarstepconfig.html
     */
    export interface HadoopJarStepConfigProperty {
        /**
         * A list of command line arguments passed to the JAR file's main function when executed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-hadoopjarstepconfig.html#cfn-elasticmapreduce-step-hadoopjarstepconfig-args
         */
        readonly args?: string[];
        /**
         * A path to a JAR file run during the step.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-hadoopjarstepconfig.html#cfn-elasticmapreduce-step-hadoopjarstepconfig-jar
         */
        readonly jar: string;
        /**
         * The name of the main class in the specified Java file. If not specified, the JAR file should specify a Main-Class in its manifest file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-hadoopjarstepconfig.html#cfn-elasticmapreduce-step-hadoopjarstepconfig-mainclass
         */
        readonly mainClass?: string;
        /**
         * A list of Java properties that are set when the step runs. You can use these properties to pass key value pairs to your main function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-hadoopjarstepconfig.html#cfn-elasticmapreduce-step-hadoopjarstepconfig-stepproperties
         */
        readonly stepProperties?: Array<CfnStep.KeyValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HadoopJarStepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnStep_HadoopJarStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('args', cdk.listValidator(cdk.validateString))(properties.args));
    errors.collect(cdk.propertyValidator('jar', cdk.requiredValidator)(properties.jar));
    errors.collect(cdk.propertyValidator('jar', cdk.validateString)(properties.jar));
    errors.collect(cdk.propertyValidator('mainClass', cdk.validateString)(properties.mainClass));
    errors.collect(cdk.propertyValidator('stepProperties', cdk.listValidator(CfnStep_KeyValuePropertyValidator))(properties.stepProperties));
    return errors.wrap('supplied properties not correct for "HadoopJarStepConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Step.HadoopJarStepConfig` resource
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Step.HadoopJarStepConfig` resource.
 */
// @ts-ignore TS6133
function cfnStepHadoopJarStepConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStep_HadoopJarStepConfigPropertyValidator(properties).assertSuccess();
    return {
        Args: cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
        Jar: cdk.stringToCloudFormation(properties.jar),
        MainClass: cdk.stringToCloudFormation(properties.mainClass),
        StepProperties: cdk.listMapper(cfnStepKeyValuePropertyToCloudFormation)(properties.stepProperties),
    };
}

// @ts-ignore TS6133
function CfnStepHadoopJarStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStep.HadoopJarStepConfigProperty>();
    ret.addPropertyResult('args', 'Args', properties.Args != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Args) : undefined);
    ret.addPropertyResult('jar', 'Jar', cfn_parse.FromCloudFormation.getString(properties.Jar));
    ret.addPropertyResult('mainClass', 'MainClass', properties.MainClass != null ? cfn_parse.FromCloudFormation.getString(properties.MainClass) : undefined);
    ret.addPropertyResult('stepProperties', 'StepProperties', properties.StepProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnStepKeyValuePropertyFromCloudFormation)(properties.StepProperties) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStep {
    /**
     * `KeyValue` is a subproperty of the `HadoopJarStepConfig` property type. `KeyValue` is used to pass parameters to a step.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-keyvalue.html
     */
    export interface KeyValueProperty {
        /**
         * The unique identifier of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-keyvalue.html#cfn-elasticmapreduce-step-keyvalue-key
         */
        readonly key?: string;
        /**
         * The value part of the identified key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-step-keyvalue.html#cfn-elasticmapreduce-step-keyvalue-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnStep_KeyValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "KeyValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Step.KeyValue` resource
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Step.KeyValue` resource.
 */
// @ts-ignore TS6133
function cfnStepKeyValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStep_KeyValuePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnStepKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStep.KeyValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStep.KeyValueProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStudio`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html
 */
export interface CfnStudioProps {

    /**
     * Specifies whether the Studio authenticates users using IAM Identity Center or IAM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-authmode
     */
    readonly authMode: string;

    /**
     * The Amazon S3 location to back up EMR Studio Workspaces and notebook files.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-defaults3location
     */
    readonly defaultS3Location: string;

    /**
     * The ID of the Amazon EMR Studio Engine security group. The Engine security group allows inbound network traffic from the Workspace security group, and it must be in the same VPC specified by `VpcId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-enginesecuritygroupid
     */
    readonly engineSecurityGroupId: string;

    /**
     * A descriptive name for the Amazon EMR Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that will be assumed by the Amazon EMR Studio. The service role provides a way for Amazon EMR Studio to interoperate with other AWS services.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-servicerole
     */
    readonly serviceRole: string;

    /**
     * A list of subnet IDs to associate with the Amazon EMR Studio. A Studio can have a maximum of 5 subnets. The subnets must belong to the VPC specified by `VpcId` . Studio users can create a Workspace in any of the specified subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The ID of the Amazon Virtual Private Cloud (Amazon VPC) to associate with the Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-vpcid
     */
    readonly vpcId: string;

    /**
     * The ID of the Workspace security group associated with the Amazon EMR Studio. The Workspace security group allows outbound network traffic to resources in the Engine security group and to the internet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-workspacesecuritygroupid
     */
    readonly workspaceSecurityGroupId: string;

    /**
     * A detailed description of the Amazon EMR Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-description
     */
    readonly description?: string;

    /**
     * Your identity provider's authentication endpoint. Amazon EMR Studio redirects federated users to this endpoint for authentication when logging in to a Studio with the Studio URL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idpauthurl
     */
    readonly idpAuthUrl?: string;

    /**
     * The name of your identity provider's `RelayState` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idprelaystateparametername
     */
    readonly idpRelayStateParameterName?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The Amazon Resource Name (ARN) of the IAM user role that will be assumed by users and groups logged in to a Studio. The permissions attached to this IAM role can be scoped down for each user or group using session policies. You only need to specify `UserRole` when you set `AuthMode` to `SSO` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-userrole
     */
    readonly userRole?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStudioProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the result of the validation.
 */
function CfnStudioPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authMode', cdk.requiredValidator)(properties.authMode));
    errors.collect(cdk.propertyValidator('authMode', cdk.validateString)(properties.authMode));
    errors.collect(cdk.propertyValidator('defaultS3Location', cdk.requiredValidator)(properties.defaultS3Location));
    errors.collect(cdk.propertyValidator('defaultS3Location', cdk.validateString)(properties.defaultS3Location));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('engineSecurityGroupId', cdk.requiredValidator)(properties.engineSecurityGroupId));
    errors.collect(cdk.propertyValidator('engineSecurityGroupId', cdk.validateString)(properties.engineSecurityGroupId));
    errors.collect(cdk.propertyValidator('idpAuthUrl', cdk.validateString)(properties.idpAuthUrl));
    errors.collect(cdk.propertyValidator('idpRelayStateParameterName', cdk.validateString)(properties.idpRelayStateParameterName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('serviceRole', cdk.requiredValidator)(properties.serviceRole));
    errors.collect(cdk.propertyValidator('serviceRole', cdk.validateString)(properties.serviceRole));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('userRole', cdk.validateString)(properties.userRole));
    errors.collect(cdk.propertyValidator('vpcId', cdk.requiredValidator)(properties.vpcId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    errors.collect(cdk.propertyValidator('workspaceSecurityGroupId', cdk.requiredValidator)(properties.workspaceSecurityGroupId));
    errors.collect(cdk.propertyValidator('workspaceSecurityGroupId', cdk.validateString)(properties.workspaceSecurityGroupId));
    return errors.wrap('supplied properties not correct for "CfnStudioProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::Studio` resource
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::Studio` resource.
 */
// @ts-ignore TS6133
function cfnStudioPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioPropsValidator(properties).assertSuccess();
    return {
        AuthMode: cdk.stringToCloudFormation(properties.authMode),
        DefaultS3Location: cdk.stringToCloudFormation(properties.defaultS3Location),
        EngineSecurityGroupId: cdk.stringToCloudFormation(properties.engineSecurityGroupId),
        Name: cdk.stringToCloudFormation(properties.name),
        ServiceRole: cdk.stringToCloudFormation(properties.serviceRole),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
        WorkspaceSecurityGroupId: cdk.stringToCloudFormation(properties.workspaceSecurityGroupId),
        Description: cdk.stringToCloudFormation(properties.description),
        IdpAuthUrl: cdk.stringToCloudFormation(properties.idpAuthUrl),
        IdpRelayStateParameterName: cdk.stringToCloudFormation(properties.idpRelayStateParameterName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UserRole: cdk.stringToCloudFormation(properties.userRole),
    };
}

// @ts-ignore TS6133
function CfnStudioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioProps>();
    ret.addPropertyResult('authMode', 'AuthMode', cfn_parse.FromCloudFormation.getString(properties.AuthMode));
    ret.addPropertyResult('defaultS3Location', 'DefaultS3Location', cfn_parse.FromCloudFormation.getString(properties.DefaultS3Location));
    ret.addPropertyResult('engineSecurityGroupId', 'EngineSecurityGroupId', cfn_parse.FromCloudFormation.getString(properties.EngineSecurityGroupId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('serviceRole', 'ServiceRole', cfn_parse.FromCloudFormation.getString(properties.ServiceRole));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('vpcId', 'VpcId', cfn_parse.FromCloudFormation.getString(properties.VpcId));
    ret.addPropertyResult('workspaceSecurityGroupId', 'WorkspaceSecurityGroupId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceSecurityGroupId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('idpAuthUrl', 'IdpAuthUrl', properties.IdpAuthUrl != null ? cfn_parse.FromCloudFormation.getString(properties.IdpAuthUrl) : undefined);
    ret.addPropertyResult('idpRelayStateParameterName', 'IdpRelayStateParameterName', properties.IdpRelayStateParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.IdpRelayStateParameterName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('userRole', 'UserRole', properties.UserRole != null ? cfn_parse.FromCloudFormation.getString(properties.UserRole) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::Studio`
 *
 * The `AWS::EMR::Studio` resource specifies an Amazon EMR Studio. An EMR Studio is a web-based, integrated development environment for fully managed Jupyter notebooks that run on Amazon EMR clusters. For more information, see the [*Amazon EMR Management Guide*](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-studio.html) .
 *
 * @cloudformationResource AWS::EMR::Studio
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html
 */
export class CfnStudio extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::Studio";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudio {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStudioPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStudio(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the Amazon EMR Studio. For example: `arn:aws:elasticmapreduce:us-east-1:653XXXXXXXXX:studio/es-EXAMPLE12345678XXXXXXXXXXX` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the Amazon EMR Studio. For example: `es-EXAMPLE12345678XXXXXXXXXXX` .
     * @cloudformationAttribute StudioId
     */
    public readonly attrStudioId: string;

    /**
     * The unique access URL of the Amazon EMR Studio. For example: `https://es-EXAMPLE12345678XXXXXXXXXXX.emrstudio-prod.us-east-1.amazonaws.com` .
     * @cloudformationAttribute Url
     */
    public readonly attrUrl: string;

    /**
     * Specifies whether the Studio authenticates users using IAM Identity Center or IAM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-authmode
     */
    public authMode: string;

    /**
     * The Amazon S3 location to back up EMR Studio Workspaces and notebook files.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-defaults3location
     */
    public defaultS3Location: string;

    /**
     * The ID of the Amazon EMR Studio Engine security group. The Engine security group allows inbound network traffic from the Workspace security group, and it must be in the same VPC specified by `VpcId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-enginesecuritygroupid
     */
    public engineSecurityGroupId: string;

    /**
     * A descriptive name for the Amazon EMR Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that will be assumed by the Amazon EMR Studio. The service role provides a way for Amazon EMR Studio to interoperate with other AWS services.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-servicerole
     */
    public serviceRole: string;

    /**
     * A list of subnet IDs to associate with the Amazon EMR Studio. A Studio can have a maximum of 5 subnets. The subnets must belong to the VPC specified by `VpcId` . Studio users can create a Workspace in any of the specified subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-subnetids
     */
    public subnetIds: string[];

    /**
     * The ID of the Amazon Virtual Private Cloud (Amazon VPC) to associate with the Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-vpcid
     */
    public vpcId: string;

    /**
     * The ID of the Workspace security group associated with the Amazon EMR Studio. The Workspace security group allows outbound network traffic to resources in the Engine security group and to the internet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-workspacesecuritygroupid
     */
    public workspaceSecurityGroupId: string;

    /**
     * A detailed description of the Amazon EMR Studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-description
     */
    public description: string | undefined;

    /**
     * Your identity provider's authentication endpoint. Amazon EMR Studio redirects federated users to this endpoint for authentication when logging in to a Studio with the Studio URL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idpauthurl
     */
    public idpAuthUrl: string | undefined;

    /**
     * The name of your identity provider's `RelayState` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idprelaystateparametername
     */
    public idpRelayStateParameterName: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The Amazon Resource Name (ARN) of the IAM user role that will be assumed by users and groups logged in to a Studio. The permissions attached to this IAM role can be scoped down for each user or group using session policies. You only need to specify `UserRole` when you set `AuthMode` to `SSO` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-userrole
     */
    public userRole: string | undefined;

    /**
     * Create a new `AWS::EMR::Studio`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioProps) {
        super(scope, id, { type: CfnStudio.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authMode', this);
        cdk.requireProperty(props, 'defaultS3Location', this);
        cdk.requireProperty(props, 'engineSecurityGroupId', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'serviceRole', this);
        cdk.requireProperty(props, 'subnetIds', this);
        cdk.requireProperty(props, 'vpcId', this);
        cdk.requireProperty(props, 'workspaceSecurityGroupId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStudioId = cdk.Token.asString(this.getAtt('StudioId', cdk.ResolutionTypeHint.STRING));
        this.attrUrl = cdk.Token.asString(this.getAtt('Url', cdk.ResolutionTypeHint.STRING));

        this.authMode = props.authMode;
        this.defaultS3Location = props.defaultS3Location;
        this.engineSecurityGroupId = props.engineSecurityGroupId;
        this.name = props.name;
        this.serviceRole = props.serviceRole;
        this.subnetIds = props.subnetIds;
        this.vpcId = props.vpcId;
        this.workspaceSecurityGroupId = props.workspaceSecurityGroupId;
        this.description = props.description;
        this.idpAuthUrl = props.idpAuthUrl;
        this.idpRelayStateParameterName = props.idpRelayStateParameterName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMR::Studio", props.tags, { tagPropertyName: 'tags' });
        this.userRole = props.userRole;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudio.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authMode: this.authMode,
            defaultS3Location: this.defaultS3Location,
            engineSecurityGroupId: this.engineSecurityGroupId,
            name: this.name,
            serviceRole: this.serviceRole,
            subnetIds: this.subnetIds,
            vpcId: this.vpcId,
            workspaceSecurityGroupId: this.workspaceSecurityGroupId,
            description: this.description,
            idpAuthUrl: this.idpAuthUrl,
            idpRelayStateParameterName: this.idpRelayStateParameterName,
            tags: this.tags.renderTags(),
            userRole: this.userRole,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStudioPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStudioSessionMapping`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html
 */
export interface CfnStudioSessionMappingProps {

    /**
     * The name of the user or group. For more information, see [UserName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_User.html#singlesignon-Type-User-UserName) and [DisplayName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_Group.html#singlesignon-Type-Group-DisplayName) in the *IAM Identity Center Identity Store API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identityname
     */
    readonly identityName: string;

    /**
     * Specifies whether the identity to map to the Amazon EMR Studio is a user or a group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identitytype
     */
    readonly identityType: string;

    /**
     * The Amazon Resource Name (ARN) for the session policy that will be applied to the user or group. Session policies refine Studio user permissions without the need to use multiple IAM user roles. For more information, see [Create an EMR Studio user role with session policies](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-studio-user-role.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-sessionpolicyarn
     */
    readonly sessionPolicyArn: string;

    /**
     * The ID of the Amazon EMR Studio to which the user or group will be mapped.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-studioid
     */
    readonly studioId: string;
}

/**
 * Determine whether the given properties match those of a `CfnStudioSessionMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioSessionMappingProps`
 *
 * @returns the result of the validation.
 */
function CfnStudioSessionMappingPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('identityName', cdk.requiredValidator)(properties.identityName));
    errors.collect(cdk.propertyValidator('identityName', cdk.validateString)(properties.identityName));
    errors.collect(cdk.propertyValidator('identityType', cdk.requiredValidator)(properties.identityType));
    errors.collect(cdk.propertyValidator('identityType', cdk.validateString)(properties.identityType));
    errors.collect(cdk.propertyValidator('sessionPolicyArn', cdk.requiredValidator)(properties.sessionPolicyArn));
    errors.collect(cdk.propertyValidator('sessionPolicyArn', cdk.validateString)(properties.sessionPolicyArn));
    errors.collect(cdk.propertyValidator('studioId', cdk.requiredValidator)(properties.studioId));
    errors.collect(cdk.propertyValidator('studioId', cdk.validateString)(properties.studioId));
    return errors.wrap('supplied properties not correct for "CfnStudioSessionMappingProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMR::StudioSessionMapping` resource
 *
 * @param properties - the TypeScript properties of a `CfnStudioSessionMappingProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMR::StudioSessionMapping` resource.
 */
// @ts-ignore TS6133
function cfnStudioSessionMappingPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioSessionMappingPropsValidator(properties).assertSuccess();
    return {
        IdentityName: cdk.stringToCloudFormation(properties.identityName),
        IdentityType: cdk.stringToCloudFormation(properties.identityType),
        SessionPolicyArn: cdk.stringToCloudFormation(properties.sessionPolicyArn),
        StudioId: cdk.stringToCloudFormation(properties.studioId),
    };
}

// @ts-ignore TS6133
function CfnStudioSessionMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioSessionMappingProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioSessionMappingProps>();
    ret.addPropertyResult('identityName', 'IdentityName', cfn_parse.FromCloudFormation.getString(properties.IdentityName));
    ret.addPropertyResult('identityType', 'IdentityType', cfn_parse.FromCloudFormation.getString(properties.IdentityType));
    ret.addPropertyResult('sessionPolicyArn', 'SessionPolicyArn', cfn_parse.FromCloudFormation.getString(properties.SessionPolicyArn));
    ret.addPropertyResult('studioId', 'StudioId', cfn_parse.FromCloudFormation.getString(properties.StudioId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMR::StudioSessionMapping`
 *
 * The `AWS::EMR::StudioSessionMapping` resource is an Amazon EMR resource type that maps a user or group to the Amazon EMR Studio specified by `StudioId` , and applies a session policy that defines Studio permissions for that user or group.
 *
 * @cloudformationResource AWS::EMR::StudioSessionMapping
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html
 */
export class CfnStudioSessionMapping extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMR::StudioSessionMapping";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudioSessionMapping {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStudioSessionMappingPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStudioSessionMapping(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the user or group. For more information, see [UserName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_User.html#singlesignon-Type-User-UserName) and [DisplayName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_Group.html#singlesignon-Type-Group-DisplayName) in the *IAM Identity Center Identity Store API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identityname
     */
    public identityName: string;

    /**
     * Specifies whether the identity to map to the Amazon EMR Studio is a user or a group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identitytype
     */
    public identityType: string;

    /**
     * The Amazon Resource Name (ARN) for the session policy that will be applied to the user or group. Session policies refine Studio user permissions without the need to use multiple IAM user roles. For more information, see [Create an EMR Studio user role with session policies](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-studio-user-role.html) in the *Amazon EMR Management Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-sessionpolicyarn
     */
    public sessionPolicyArn: string;

    /**
     * The ID of the Amazon EMR Studio to which the user or group will be mapped.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-studioid
     */
    public studioId: string;

    /**
     * Create a new `AWS::EMR::StudioSessionMapping`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioSessionMappingProps) {
        super(scope, id, { type: CfnStudioSessionMapping.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'identityName', this);
        cdk.requireProperty(props, 'identityType', this);
        cdk.requireProperty(props, 'sessionPolicyArn', this);
        cdk.requireProperty(props, 'studioId', this);

        this.identityName = props.identityName;
        this.identityType = props.identityType;
        this.sessionPolicyArn = props.sessionPolicyArn;
        this.studioId = props.studioId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudioSessionMapping.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            identityName: this.identityName,
            identityType: this.identityType,
            sessionPolicyArn: this.sessionPolicyArn,
            studioId: this.studioId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStudioSessionMappingPropsToCloudFormation(props);
    }
}
