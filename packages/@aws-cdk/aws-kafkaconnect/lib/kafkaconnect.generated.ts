// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:46.340Z","fingerprint":"TvkJg3O5/b/XIlPossdKbX5doimNxd68E9nnLyNoHBc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export interface CfnConnectorProps {

    /**
     * The connector's compute capacity settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-capacity
     */
    readonly capacity: CfnConnector.CapacityProperty | cdk.IResolvable;

    /**
     * The configuration of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorconfiguration
     */
    readonly connectorConfiguration: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The name of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorname
     */
    readonly connectorName: string;

    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkacluster
     */
    readonly kafkaCluster: CfnConnector.KafkaClusterProperty | cdk.IResolvable;

    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication
     */
    readonly kafkaClusterClientAuthentication: CfnConnector.KafkaClusterClientAuthenticationProperty | cdk.IResolvable;

    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit
     */
    readonly kafkaClusterEncryptionInTransit: CfnConnector.KafkaClusterEncryptionInTransitProperty | cdk.IResolvable;

    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaconnectversion
     */
    readonly kafkaConnectVersion: string;

    /**
     * Specifies which plugin to use for the connector. You must specify a single-element list. Amazon MSK Connect does not currently support specifying multiple plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-plugins
     */
    readonly plugins: Array<CfnConnector.PluginProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-serviceexecutionrolearn
     */
    readonly serviceExecutionRoleArn: string;

    /**
     * The description of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectordescription
     */
    readonly connectorDescription?: string;

    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-logdelivery
     */
    readonly logDelivery?: CfnConnector.LogDeliveryProperty | cdk.IResolvable;

    /**
     * The worker configurations that are in use with the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-workerconfiguration
     */
    readonly workerConfiguration?: CfnConnector.WorkerConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capacity', cdk.requiredValidator)(properties.capacity));
    errors.collect(cdk.propertyValidator('capacity', CfnConnector_CapacityPropertyValidator)(properties.capacity));
    errors.collect(cdk.propertyValidator('connectorConfiguration', cdk.requiredValidator)(properties.connectorConfiguration));
    errors.collect(cdk.propertyValidator('connectorConfiguration', cdk.hashValidator(cdk.validateString))(properties.connectorConfiguration));
    errors.collect(cdk.propertyValidator('connectorDescription', cdk.validateString)(properties.connectorDescription));
    errors.collect(cdk.propertyValidator('connectorName', cdk.requiredValidator)(properties.connectorName));
    errors.collect(cdk.propertyValidator('connectorName', cdk.validateString)(properties.connectorName));
    errors.collect(cdk.propertyValidator('kafkaCluster', cdk.requiredValidator)(properties.kafkaCluster));
    errors.collect(cdk.propertyValidator('kafkaCluster', CfnConnector_KafkaClusterPropertyValidator)(properties.kafkaCluster));
    errors.collect(cdk.propertyValidator('kafkaClusterClientAuthentication', cdk.requiredValidator)(properties.kafkaClusterClientAuthentication));
    errors.collect(cdk.propertyValidator('kafkaClusterClientAuthentication', CfnConnector_KafkaClusterClientAuthenticationPropertyValidator)(properties.kafkaClusterClientAuthentication));
    errors.collect(cdk.propertyValidator('kafkaClusterEncryptionInTransit', cdk.requiredValidator)(properties.kafkaClusterEncryptionInTransit));
    errors.collect(cdk.propertyValidator('kafkaClusterEncryptionInTransit', CfnConnector_KafkaClusterEncryptionInTransitPropertyValidator)(properties.kafkaClusterEncryptionInTransit));
    errors.collect(cdk.propertyValidator('kafkaConnectVersion', cdk.requiredValidator)(properties.kafkaConnectVersion));
    errors.collect(cdk.propertyValidator('kafkaConnectVersion', cdk.validateString)(properties.kafkaConnectVersion));
    errors.collect(cdk.propertyValidator('logDelivery', CfnConnector_LogDeliveryPropertyValidator)(properties.logDelivery));
    errors.collect(cdk.propertyValidator('plugins', cdk.requiredValidator)(properties.plugins));
    errors.collect(cdk.propertyValidator('plugins', cdk.listValidator(CfnConnector_PluginPropertyValidator))(properties.plugins));
    errors.collect(cdk.propertyValidator('serviceExecutionRoleArn', cdk.requiredValidator)(properties.serviceExecutionRoleArn));
    errors.collect(cdk.propertyValidator('serviceExecutionRoleArn', cdk.validateString)(properties.serviceExecutionRoleArn));
    errors.collect(cdk.propertyValidator('workerConfiguration', CfnConnector_WorkerConfigurationPropertyValidator)(properties.workerConfiguration));
    return errors.wrap('supplied properties not correct for "CfnConnectorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector` resource.
 */
// @ts-ignore TS6133
function cfnConnectorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectorPropsValidator(properties).assertSuccess();
    return {
        Capacity: cfnConnectorCapacityPropertyToCloudFormation(properties.capacity),
        ConnectorConfiguration: cdk.hashMapper(cdk.stringToCloudFormation)(properties.connectorConfiguration),
        ConnectorName: cdk.stringToCloudFormation(properties.connectorName),
        KafkaCluster: cfnConnectorKafkaClusterPropertyToCloudFormation(properties.kafkaCluster),
        KafkaClusterClientAuthentication: cfnConnectorKafkaClusterClientAuthenticationPropertyToCloudFormation(properties.kafkaClusterClientAuthentication),
        KafkaClusterEncryptionInTransit: cfnConnectorKafkaClusterEncryptionInTransitPropertyToCloudFormation(properties.kafkaClusterEncryptionInTransit),
        KafkaConnectVersion: cdk.stringToCloudFormation(properties.kafkaConnectVersion),
        Plugins: cdk.listMapper(cfnConnectorPluginPropertyToCloudFormation)(properties.plugins),
        ServiceExecutionRoleArn: cdk.stringToCloudFormation(properties.serviceExecutionRoleArn),
        ConnectorDescription: cdk.stringToCloudFormation(properties.connectorDescription),
        LogDelivery: cfnConnectorLogDeliveryPropertyToCloudFormation(properties.logDelivery),
        WorkerConfiguration: cfnConnectorWorkerConfigurationPropertyToCloudFormation(properties.workerConfiguration),
    };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
    ret.addPropertyResult('capacity', 'Capacity', CfnConnectorCapacityPropertyFromCloudFormation(properties.Capacity));
    ret.addPropertyResult('connectorConfiguration', 'ConnectorConfiguration', cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConnectorConfiguration));
    ret.addPropertyResult('connectorName', 'ConnectorName', cfn_parse.FromCloudFormation.getString(properties.ConnectorName));
    ret.addPropertyResult('kafkaCluster', 'KafkaCluster', CfnConnectorKafkaClusterPropertyFromCloudFormation(properties.KafkaCluster));
    ret.addPropertyResult('kafkaClusterClientAuthentication', 'KafkaClusterClientAuthentication', CfnConnectorKafkaClusterClientAuthenticationPropertyFromCloudFormation(properties.KafkaClusterClientAuthentication));
    ret.addPropertyResult('kafkaClusterEncryptionInTransit', 'KafkaClusterEncryptionInTransit', CfnConnectorKafkaClusterEncryptionInTransitPropertyFromCloudFormation(properties.KafkaClusterEncryptionInTransit));
    ret.addPropertyResult('kafkaConnectVersion', 'KafkaConnectVersion', cfn_parse.FromCloudFormation.getString(properties.KafkaConnectVersion));
    ret.addPropertyResult('plugins', 'Plugins', cfn_parse.FromCloudFormation.getArray(CfnConnectorPluginPropertyFromCloudFormation)(properties.Plugins));
    ret.addPropertyResult('serviceExecutionRoleArn', 'ServiceExecutionRoleArn', cfn_parse.FromCloudFormation.getString(properties.ServiceExecutionRoleArn));
    ret.addPropertyResult('connectorDescription', 'ConnectorDescription', properties.ConnectorDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorDescription) : undefined);
    ret.addPropertyResult('logDelivery', 'LogDelivery', properties.LogDelivery != null ? CfnConnectorLogDeliveryPropertyFromCloudFormation(properties.LogDelivery) : undefined);
    ret.addPropertyResult('workerConfiguration', 'WorkerConfiguration', properties.WorkerConfiguration != null ? CfnConnectorWorkerConfigurationPropertyFromCloudFormation(properties.WorkerConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KafkaConnect::Connector`
 *
 * Creates a connector using the specified properties.
 *
 * @cloudformationResource AWS::KafkaConnect::Connector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KafkaConnect::Connector";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConnectorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConnector(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the newly created connector.
     * @cloudformationAttribute ConnectorArn
     */
    public readonly attrConnectorArn: string;

    /**
     * The connector's compute capacity settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-capacity
     */
    public capacity: CfnConnector.CapacityProperty | cdk.IResolvable;

    /**
     * The configuration of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorconfiguration
     */
    public connectorConfiguration: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The name of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorname
     */
    public connectorName: string;

    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkacluster
     */
    public kafkaCluster: CfnConnector.KafkaClusterProperty | cdk.IResolvable;

    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication
     */
    public kafkaClusterClientAuthentication: CfnConnector.KafkaClusterClientAuthenticationProperty | cdk.IResolvable;

    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit
     */
    public kafkaClusterEncryptionInTransit: CfnConnector.KafkaClusterEncryptionInTransitProperty | cdk.IResolvable;

    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaconnectversion
     */
    public kafkaConnectVersion: string;

    /**
     * Specifies which plugin to use for the connector. You must specify a single-element list. Amazon MSK Connect does not currently support specifying multiple plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-plugins
     */
    public plugins: Array<CfnConnector.PluginProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-serviceexecutionrolearn
     */
    public serviceExecutionRoleArn: string;

    /**
     * The description of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectordescription
     */
    public connectorDescription: string | undefined;

    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-logdelivery
     */
    public logDelivery: CfnConnector.LogDeliveryProperty | cdk.IResolvable | undefined;

    /**
     * The worker configurations that are in use with the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-workerconfiguration
     */
    public workerConfiguration: CfnConnector.WorkerConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::KafkaConnect::Connector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
        super(scope, id, { type: CfnConnector.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'capacity', this);
        cdk.requireProperty(props, 'connectorConfiguration', this);
        cdk.requireProperty(props, 'connectorName', this);
        cdk.requireProperty(props, 'kafkaCluster', this);
        cdk.requireProperty(props, 'kafkaClusterClientAuthentication', this);
        cdk.requireProperty(props, 'kafkaClusterEncryptionInTransit', this);
        cdk.requireProperty(props, 'kafkaConnectVersion', this);
        cdk.requireProperty(props, 'plugins', this);
        cdk.requireProperty(props, 'serviceExecutionRoleArn', this);
        this.attrConnectorArn = cdk.Token.asString(this.getAtt('ConnectorArn', cdk.ResolutionTypeHint.STRING));

        this.capacity = props.capacity;
        this.connectorConfiguration = props.connectorConfiguration;
        this.connectorName = props.connectorName;
        this.kafkaCluster = props.kafkaCluster;
        this.kafkaClusterClientAuthentication = props.kafkaClusterClientAuthentication;
        this.kafkaClusterEncryptionInTransit = props.kafkaClusterEncryptionInTransit;
        this.kafkaConnectVersion = props.kafkaConnectVersion;
        this.plugins = props.plugins;
        this.serviceExecutionRoleArn = props.serviceExecutionRoleArn;
        this.connectorDescription = props.connectorDescription;
        this.logDelivery = props.logDelivery;
        this.workerConfiguration = props.workerConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            capacity: this.capacity,
            connectorConfiguration: this.connectorConfiguration,
            connectorName: this.connectorName,
            kafkaCluster: this.kafkaCluster,
            kafkaClusterClientAuthentication: this.kafkaClusterClientAuthentication,
            kafkaClusterEncryptionInTransit: this.kafkaClusterEncryptionInTransit,
            kafkaConnectVersion: this.kafkaConnectVersion,
            plugins: this.plugins,
            serviceExecutionRoleArn: this.serviceExecutionRoleArn,
            connectorDescription: this.connectorDescription,
            logDelivery: this.logDelivery,
            workerConfiguration: this.workerConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectorPropsToCloudFormation(props);
    }
}

export namespace CfnConnector {
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html
     */
    export interface ApacheKafkaClusterProperty {
        /**
         * The bootstrap servers of the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-bootstrapservers
         */
        readonly bootstrapServers: string;
        /**
         * Details of an Amazon VPC which has network connectivity to the Apache Kafka cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-vpc
         */
        readonly vpc: CfnConnector.VpcProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApacheKafkaClusterProperty`
 *
 * @param properties - the TypeScript properties of a `ApacheKafkaClusterProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_ApacheKafkaClusterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bootstrapServers', cdk.requiredValidator)(properties.bootstrapServers));
    errors.collect(cdk.propertyValidator('bootstrapServers', cdk.validateString)(properties.bootstrapServers));
    errors.collect(cdk.propertyValidator('vpc', cdk.requiredValidator)(properties.vpc));
    errors.collect(cdk.propertyValidator('vpc', CfnConnector_VpcPropertyValidator)(properties.vpc));
    return errors.wrap('supplied properties not correct for "ApacheKafkaClusterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ApacheKafkaCluster` resource
 *
 * @param properties - the TypeScript properties of a `ApacheKafkaClusterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ApacheKafkaCluster` resource.
 */
// @ts-ignore TS6133
function cfnConnectorApacheKafkaClusterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_ApacheKafkaClusterPropertyValidator(properties).assertSuccess();
    return {
        BootstrapServers: cdk.stringToCloudFormation(properties.bootstrapServers),
        Vpc: cfnConnectorVpcPropertyToCloudFormation(properties.vpc),
    };
}

// @ts-ignore TS6133
function CfnConnectorApacheKafkaClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ApacheKafkaClusterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ApacheKafkaClusterProperty>();
    ret.addPropertyResult('bootstrapServers', 'BootstrapServers', cfn_parse.FromCloudFormation.getString(properties.BootstrapServers));
    ret.addPropertyResult('vpc', 'Vpc', CfnConnectorVpcPropertyFromCloudFormation(properties.Vpc));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Specifies how the connector scales.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html
     */
    export interface AutoScalingProperty {
        /**
         * The maximum number of workers allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-maxworkercount
         */
        readonly maxWorkerCount: number;
        /**
         * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-mcucount
         */
        readonly mcuCount: number;
        /**
         * The minimum number of workers allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-minworkercount
         */
        readonly minWorkerCount: number;
        /**
         * The sacle-in policy for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleinpolicy
         */
        readonly scaleInPolicy: CfnConnector.ScaleInPolicyProperty | cdk.IResolvable;
        /**
         * The sacle-out policy for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleoutpolicy
         */
        readonly scaleOutPolicy: CfnConnector.ScaleOutPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_AutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxWorkerCount', cdk.requiredValidator)(properties.maxWorkerCount));
    errors.collect(cdk.propertyValidator('maxWorkerCount', cdk.validateNumber)(properties.maxWorkerCount));
    errors.collect(cdk.propertyValidator('mcuCount', cdk.requiredValidator)(properties.mcuCount));
    errors.collect(cdk.propertyValidator('mcuCount', cdk.validateNumber)(properties.mcuCount));
    errors.collect(cdk.propertyValidator('minWorkerCount', cdk.requiredValidator)(properties.minWorkerCount));
    errors.collect(cdk.propertyValidator('minWorkerCount', cdk.validateNumber)(properties.minWorkerCount));
    errors.collect(cdk.propertyValidator('scaleInPolicy', cdk.requiredValidator)(properties.scaleInPolicy));
    errors.collect(cdk.propertyValidator('scaleInPolicy', CfnConnector_ScaleInPolicyPropertyValidator)(properties.scaleInPolicy));
    errors.collect(cdk.propertyValidator('scaleOutPolicy', cdk.requiredValidator)(properties.scaleOutPolicy));
    errors.collect(cdk.propertyValidator('scaleOutPolicy', CfnConnector_ScaleOutPolicyPropertyValidator)(properties.scaleOutPolicy));
    return errors.wrap('supplied properties not correct for "AutoScalingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.AutoScaling` resource
 *
 * @param properties - the TypeScript properties of a `AutoScalingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.AutoScaling` resource.
 */
// @ts-ignore TS6133
function cfnConnectorAutoScalingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_AutoScalingPropertyValidator(properties).assertSuccess();
    return {
        MaxWorkerCount: cdk.numberToCloudFormation(properties.maxWorkerCount),
        McuCount: cdk.numberToCloudFormation(properties.mcuCount),
        MinWorkerCount: cdk.numberToCloudFormation(properties.minWorkerCount),
        ScaleInPolicy: cfnConnectorScaleInPolicyPropertyToCloudFormation(properties.scaleInPolicy),
        ScaleOutPolicy: cfnConnectorScaleOutPolicyPropertyToCloudFormation(properties.scaleOutPolicy),
    };
}

// @ts-ignore TS6133
function CfnConnectorAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.AutoScalingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.AutoScalingProperty>();
    ret.addPropertyResult('maxWorkerCount', 'MaxWorkerCount', cfn_parse.FromCloudFormation.getNumber(properties.MaxWorkerCount));
    ret.addPropertyResult('mcuCount', 'McuCount', cfn_parse.FromCloudFormation.getNumber(properties.McuCount));
    ret.addPropertyResult('minWorkerCount', 'MinWorkerCount', cfn_parse.FromCloudFormation.getNumber(properties.MinWorkerCount));
    ret.addPropertyResult('scaleInPolicy', 'ScaleInPolicy', CfnConnectorScaleInPolicyPropertyFromCloudFormation(properties.ScaleInPolicy));
    ret.addPropertyResult('scaleOutPolicy', 'ScaleOutPolicy', CfnConnectorScaleOutPolicyPropertyFromCloudFormation(properties.ScaleOutPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Information about the capacity of the connector, whether it is auto scaled or provisioned.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html
     */
    export interface CapacityProperty {
        /**
         * Information about the auto scaling parameters for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-autoscaling
         */
        readonly autoScaling?: CfnConnector.AutoScalingProperty | cdk.IResolvable;
        /**
         * Details about a fixed capacity allocated to a connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-provisionedcapacity
         */
        readonly provisionedCapacity?: CfnConnector.ProvisionedCapacityProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CapacityProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_CapacityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoScaling', CfnConnector_AutoScalingPropertyValidator)(properties.autoScaling));
    errors.collect(cdk.propertyValidator('provisionedCapacity', CfnConnector_ProvisionedCapacityPropertyValidator)(properties.provisionedCapacity));
    return errors.wrap('supplied properties not correct for "CapacityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Capacity` resource
 *
 * @param properties - the TypeScript properties of a `CapacityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Capacity` resource.
 */
// @ts-ignore TS6133
function cfnConnectorCapacityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_CapacityPropertyValidator(properties).assertSuccess();
    return {
        AutoScaling: cfnConnectorAutoScalingPropertyToCloudFormation(properties.autoScaling),
        ProvisionedCapacity: cfnConnectorProvisionedCapacityPropertyToCloudFormation(properties.provisionedCapacity),
    };
}

// @ts-ignore TS6133
function CfnConnectorCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CapacityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CapacityProperty>();
    ret.addPropertyResult('autoScaling', 'AutoScaling', properties.AutoScaling != null ? CfnConnectorAutoScalingPropertyFromCloudFormation(properties.AutoScaling) : undefined);
    ret.addPropertyResult('provisionedCapacity', 'ProvisionedCapacity', properties.ProvisionedCapacity != null ? CfnConnectorProvisionedCapacityPropertyFromCloudFormation(properties.ProvisionedCapacity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html
     */
    export interface CloudWatchLogsLogDeliveryProperty {
        /**
         * Whether log delivery to Amazon CloudWatch Logs is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The name of the CloudWatch log group that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-loggroup
         */
        readonly logGroup?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_CloudWatchLogsLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('logGroup', cdk.validateString)(properties.logGroup));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsLogDeliveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.CloudWatchLogsLogDelivery` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogDeliveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.CloudWatchLogsLogDelivery` resource.
 */
// @ts-ignore TS6133
function cfnConnectorCloudWatchLogsLogDeliveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_CloudWatchLogsLogDeliveryPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        LogGroup: cdk.stringToCloudFormation(properties.logGroup),
    };
}

// @ts-ignore TS6133
function CfnConnectorCloudWatchLogsLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CloudWatchLogsLogDeliveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CloudWatchLogsLogDeliveryProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('logGroup', 'LogGroup', properties.LogGroup != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * A plugin is an AWS resource that contains the code that defines a connector's logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html
     */
    export interface CustomPluginProperty {
        /**
         * The Amazon Resource Name (ARN) of the custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-custompluginarn
         */
        readonly customPluginArn: string;
        /**
         * The revision of the custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-revision
         */
        readonly revision: number;
    }
}

/**
 * Determine whether the given properties match those of a `CustomPluginProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPluginProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_CustomPluginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customPluginArn', cdk.requiredValidator)(properties.customPluginArn));
    errors.collect(cdk.propertyValidator('customPluginArn', cdk.validateString)(properties.customPluginArn));
    errors.collect(cdk.propertyValidator('revision', cdk.requiredValidator)(properties.revision));
    errors.collect(cdk.propertyValidator('revision', cdk.validateNumber)(properties.revision));
    return errors.wrap('supplied properties not correct for "CustomPluginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.CustomPlugin` resource
 *
 * @param properties - the TypeScript properties of a `CustomPluginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.CustomPlugin` resource.
 */
// @ts-ignore TS6133
function cfnConnectorCustomPluginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_CustomPluginPropertyValidator(properties).assertSuccess();
    return {
        CustomPluginArn: cdk.stringToCloudFormation(properties.customPluginArn),
        Revision: cdk.numberToCloudFormation(properties.revision),
    };
}

// @ts-ignore TS6133
function CfnConnectorCustomPluginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CustomPluginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CustomPluginProperty>();
    ret.addPropertyResult('customPluginArn', 'CustomPluginArn', cfn_parse.FromCloudFormation.getString(properties.CustomPluginArn));
    ret.addPropertyResult('revision', 'Revision', cfn_parse.FromCloudFormation.getNumber(properties.Revision));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The settings for delivering logs to Amazon Kinesis Data Firehose.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html
     */
    export interface FirehoseLogDeliveryProperty {
        /**
         * The name of the Kinesis Data Firehose delivery stream that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-deliverystream
         */
        readonly deliveryStream?: string;
        /**
         * Specifies whether connector logs get delivered to Amazon Kinesis Data Firehose.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FirehoseLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_FirehoseLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryStream', cdk.validateString)(properties.deliveryStream));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "FirehoseLogDeliveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.FirehoseLogDelivery` resource
 *
 * @param properties - the TypeScript properties of a `FirehoseLogDeliveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.FirehoseLogDelivery` resource.
 */
// @ts-ignore TS6133
function cfnConnectorFirehoseLogDeliveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_FirehoseLogDeliveryPropertyValidator(properties).assertSuccess();
    return {
        DeliveryStream: cdk.stringToCloudFormation(properties.deliveryStream),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnConnectorFirehoseLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.FirehoseLogDeliveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.FirehoseLogDeliveryProperty>();
    ret.addPropertyResult('deliveryStream', 'DeliveryStream', properties.DeliveryStream != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStream) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html
     */
    export interface KafkaClusterProperty {
        /**
         * The Apache Kafka cluster to which the connector is connected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html#cfn-kafkaconnect-connector-kafkacluster-apachekafkacluster
         */
        readonly apacheKafkaCluster: CfnConnector.ApacheKafkaClusterProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KafkaClusterProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_KafkaClusterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apacheKafkaCluster', cdk.requiredValidator)(properties.apacheKafkaCluster));
    errors.collect(cdk.propertyValidator('apacheKafkaCluster', CfnConnector_ApacheKafkaClusterPropertyValidator)(properties.apacheKafkaCluster));
    return errors.wrap('supplied properties not correct for "KafkaClusterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaCluster` resource
 *
 * @param properties - the TypeScript properties of a `KafkaClusterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaCluster` resource.
 */
// @ts-ignore TS6133
function cfnConnectorKafkaClusterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_KafkaClusterPropertyValidator(properties).assertSuccess();
    return {
        ApacheKafkaCluster: cfnConnectorApacheKafkaClusterPropertyToCloudFormation(properties.apacheKafkaCluster),
    };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.KafkaClusterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterProperty>();
    ret.addPropertyResult('apacheKafkaCluster', 'ApacheKafkaCluster', CfnConnectorApacheKafkaClusterPropertyFromCloudFormation(properties.ApacheKafkaCluster));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The client authentication information used in order to authenticate with the Apache Kafka cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html
     */
    export interface KafkaClusterClientAuthenticationProperty {
        /**
         * The type of client authentication used to connect to the Apache Kafka cluster. Value NONE means that no client authentication is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication-authenticationtype
         */
        readonly authenticationType: string;
    }
}

/**
 * Determine whether the given properties match those of a `KafkaClusterClientAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterClientAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_KafkaClusterClientAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationType', cdk.requiredValidator)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.validateString)(properties.authenticationType));
    return errors.wrap('supplied properties not correct for "KafkaClusterClientAuthenticationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaClusterClientAuthentication` resource
 *
 * @param properties - the TypeScript properties of a `KafkaClusterClientAuthenticationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaClusterClientAuthentication` resource.
 */
// @ts-ignore TS6133
function cfnConnectorKafkaClusterClientAuthenticationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_KafkaClusterClientAuthenticationPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationType: cdk.stringToCloudFormation(properties.authenticationType),
    };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterClientAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.KafkaClusterClientAuthenticationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterClientAuthenticationProperty>();
    ret.addPropertyResult('authenticationType', 'AuthenticationType', cfn_parse.FromCloudFormation.getString(properties.AuthenticationType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html
     */
    export interface KafkaClusterEncryptionInTransitProperty {
        /**
         * The type of encryption in transit to the Apache Kafka cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit-encryptiontype
         */
        readonly encryptionType: string;
    }
}

/**
 * Determine whether the given properties match those of a `KafkaClusterEncryptionInTransitProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterEncryptionInTransitProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_KafkaClusterEncryptionInTransitPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionType', cdk.requiredValidator)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    return errors.wrap('supplied properties not correct for "KafkaClusterEncryptionInTransitProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaClusterEncryptionInTransit` resource
 *
 * @param properties - the TypeScript properties of a `KafkaClusterEncryptionInTransitProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.KafkaClusterEncryptionInTransit` resource.
 */
// @ts-ignore TS6133
function cfnConnectorKafkaClusterEncryptionInTransitPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_KafkaClusterEncryptionInTransitPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
    };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterEncryptionInTransitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.KafkaClusterEncryptionInTransitProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterEncryptionInTransitProperty>();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Details about log delivery.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html
     */
    export interface LogDeliveryProperty {
        /**
         * The workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html#cfn-kafkaconnect-connector-logdelivery-workerlogdelivery
         */
        readonly workerLogDelivery: CfnConnector.WorkerLogDeliveryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `LogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_LogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('workerLogDelivery', cdk.requiredValidator)(properties.workerLogDelivery));
    errors.collect(cdk.propertyValidator('workerLogDelivery', CfnConnector_WorkerLogDeliveryPropertyValidator)(properties.workerLogDelivery));
    return errors.wrap('supplied properties not correct for "LogDeliveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.LogDelivery` resource
 *
 * @param properties - the TypeScript properties of a `LogDeliveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.LogDelivery` resource.
 */
// @ts-ignore TS6133
function cfnConnectorLogDeliveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_LogDeliveryPropertyValidator(properties).assertSuccess();
    return {
        WorkerLogDelivery: cfnConnectorWorkerLogDeliveryPropertyToCloudFormation(properties.workerLogDelivery),
    };
}

// @ts-ignore TS6133
function CfnConnectorLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.LogDeliveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.LogDeliveryProperty>();
    ret.addPropertyResult('workerLogDelivery', 'WorkerLogDelivery', CfnConnectorWorkerLogDeliveryPropertyFromCloudFormation(properties.WorkerLogDelivery));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * A plugin is an AWS resource that contains the code that defines your connector logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html
     */
    export interface PluginProperty {
        /**
         * Details about a custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html#cfn-kafkaconnect-connector-plugin-customplugin
         */
        readonly customPlugin: CfnConnector.CustomPluginProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PluginProperty`
 *
 * @param properties - the TypeScript properties of a `PluginProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_PluginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customPlugin', cdk.requiredValidator)(properties.customPlugin));
    errors.collect(cdk.propertyValidator('customPlugin', CfnConnector_CustomPluginPropertyValidator)(properties.customPlugin));
    return errors.wrap('supplied properties not correct for "PluginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Plugin` resource
 *
 * @param properties - the TypeScript properties of a `PluginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Plugin` resource.
 */
// @ts-ignore TS6133
function cfnConnectorPluginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_PluginPropertyValidator(properties).assertSuccess();
    return {
        CustomPlugin: cfnConnectorCustomPluginPropertyToCloudFormation(properties.customPlugin),
    };
}

// @ts-ignore TS6133
function CfnConnectorPluginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.PluginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.PluginProperty>();
    ret.addPropertyResult('customPlugin', 'CustomPlugin', CfnConnectorCustomPluginPropertyFromCloudFormation(properties.CustomPlugin));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Details about a connector's provisioned capacity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html
     */
    export interface ProvisionedCapacityProperty {
        /**
         * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-mcucount
         */
        readonly mcuCount?: number;
        /**
         * The number of workers that are allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-workercount
         */
        readonly workerCount: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedCapacityProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedCapacityProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_ProvisionedCapacityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mcuCount', cdk.validateNumber)(properties.mcuCount));
    errors.collect(cdk.propertyValidator('workerCount', cdk.requiredValidator)(properties.workerCount));
    errors.collect(cdk.propertyValidator('workerCount', cdk.validateNumber)(properties.workerCount));
    return errors.wrap('supplied properties not correct for "ProvisionedCapacityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ProvisionedCapacity` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedCapacityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ProvisionedCapacity` resource.
 */
// @ts-ignore TS6133
function cfnConnectorProvisionedCapacityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_ProvisionedCapacityPropertyValidator(properties).assertSuccess();
    return {
        McuCount: cdk.numberToCloudFormation(properties.mcuCount),
        WorkerCount: cdk.numberToCloudFormation(properties.workerCount),
    };
}

// @ts-ignore TS6133
function CfnConnectorProvisionedCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ProvisionedCapacityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ProvisionedCapacityProperty>();
    ret.addPropertyResult('mcuCount', 'McuCount', properties.McuCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.McuCount) : undefined);
    ret.addPropertyResult('workerCount', 'WorkerCount', cfn_parse.FromCloudFormation.getNumber(properties.WorkerCount));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Details about delivering logs to Amazon S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html
     */
    export interface S3LogDeliveryProperty {
        /**
         * The name of the S3 bucket that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-bucket
         */
        readonly bucket?: string;
        /**
         * Specifies whether connector logs get sent to the specified Amazon S3 destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The S3 prefix that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-prefix
         */
        readonly prefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3LogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `S3LogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_S3LogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "S3LogDeliveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.S3LogDelivery` resource
 *
 * @param properties - the TypeScript properties of a `S3LogDeliveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.S3LogDelivery` resource.
 */
// @ts-ignore TS6133
function cfnConnectorS3LogDeliveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_S3LogDeliveryPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnConnectorS3LogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.S3LogDeliveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.S3LogDeliveryProperty>();
    ret.addPropertyResult('bucket', 'Bucket', properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The scale-in policy for the connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html
     */
    export interface ScaleInPolicyProperty {
        /**
         * Specifies the CPU utilization percentage threshold at which you want connector scale in to be triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html#cfn-kafkaconnect-connector-scaleinpolicy-cpuutilizationpercentage
         */
        readonly cpuUtilizationPercentage: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScaleInPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ScaleInPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_ScaleInPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpuUtilizationPercentage', cdk.requiredValidator)(properties.cpuUtilizationPercentage));
    errors.collect(cdk.propertyValidator('cpuUtilizationPercentage', cdk.validateNumber)(properties.cpuUtilizationPercentage));
    return errors.wrap('supplied properties not correct for "ScaleInPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ScaleInPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ScaleInPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ScaleInPolicy` resource.
 */
// @ts-ignore TS6133
function cfnConnectorScaleInPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_ScaleInPolicyPropertyValidator(properties).assertSuccess();
    return {
        CpuUtilizationPercentage: cdk.numberToCloudFormation(properties.cpuUtilizationPercentage),
    };
}

// @ts-ignore TS6133
function CfnConnectorScaleInPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ScaleInPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ScaleInPolicyProperty>();
    ret.addPropertyResult('cpuUtilizationPercentage', 'CpuUtilizationPercentage', cfn_parse.FromCloudFormation.getNumber(properties.CpuUtilizationPercentage));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The scale-out policy for the connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html
     */
    export interface ScaleOutPolicyProperty {
        /**
         * The CPU utilization percentage threshold at which you want connector scale out to be triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html#cfn-kafkaconnect-connector-scaleoutpolicy-cpuutilizationpercentage
         */
        readonly cpuUtilizationPercentage: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScaleOutPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ScaleOutPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_ScaleOutPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpuUtilizationPercentage', cdk.requiredValidator)(properties.cpuUtilizationPercentage));
    errors.collect(cdk.propertyValidator('cpuUtilizationPercentage', cdk.validateNumber)(properties.cpuUtilizationPercentage));
    return errors.wrap('supplied properties not correct for "ScaleOutPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ScaleOutPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ScaleOutPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.ScaleOutPolicy` resource.
 */
// @ts-ignore TS6133
function cfnConnectorScaleOutPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_ScaleOutPolicyPropertyValidator(properties).assertSuccess();
    return {
        CpuUtilizationPercentage: cdk.numberToCloudFormation(properties.cpuUtilizationPercentage),
    };
}

// @ts-ignore TS6133
function CfnConnectorScaleOutPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ScaleOutPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ScaleOutPolicyProperty>();
    ret.addPropertyResult('cpuUtilizationPercentage', 'CpuUtilizationPercentage', cfn_parse.FromCloudFormation.getNumber(properties.CpuUtilizationPercentage));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Information about the VPC in which the connector resides.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html
     */
    export interface VpcProperty {
        /**
         * The security groups for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-securitygroups
         */
        readonly securityGroups: string[];
        /**
         * The subnets for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-subnets
         */
        readonly subnets: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcProperty`
 *
 * @param properties - the TypeScript properties of a `VpcProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_VpcPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroups', cdk.requiredValidator)(properties.securityGroups));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnets', cdk.requiredValidator)(properties.subnets));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    return errors.wrap('supplied properties not correct for "VpcProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Vpc` resource
 *
 * @param properties - the TypeScript properties of a `VpcProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.Vpc` resource.
 */
// @ts-ignore TS6133
function cfnConnectorVpcPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_VpcPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    };
}

// @ts-ignore TS6133
function CfnConnectorVpcPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.VpcProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.VpcProperty>();
    ret.addPropertyResult('securityGroups', 'SecurityGroups', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups));
    ret.addPropertyResult('subnets', 'Subnets', cfn_parse.FromCloudFormation.getStringArray(properties.Subnets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * The configuration of the workers, which are the processes that run the connector logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html
     */
    export interface WorkerConfigurationProperty {
        /**
         * The revision of the worker configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-revision
         */
        readonly revision: number;
        /**
         * The Amazon Resource Name (ARN) of the worker configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-workerconfigurationarn
         */
        readonly workerConfigurationArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `WorkerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_WorkerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('revision', cdk.requiredValidator)(properties.revision));
    errors.collect(cdk.propertyValidator('revision', cdk.validateNumber)(properties.revision));
    errors.collect(cdk.propertyValidator('workerConfigurationArn', cdk.requiredValidator)(properties.workerConfigurationArn));
    errors.collect(cdk.propertyValidator('workerConfigurationArn', cdk.validateString)(properties.workerConfigurationArn));
    return errors.wrap('supplied properties not correct for "WorkerConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.WorkerConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.WorkerConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnConnectorWorkerConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_WorkerConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Revision: cdk.numberToCloudFormation(properties.revision),
        WorkerConfigurationArn: cdk.stringToCloudFormation(properties.workerConfigurationArn),
    };
}

// @ts-ignore TS6133
function CfnConnectorWorkerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.WorkerConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.WorkerConfigurationProperty>();
    ret.addPropertyResult('revision', 'Revision', cfn_parse.FromCloudFormation.getNumber(properties.Revision));
    ret.addPropertyResult('workerConfigurationArn', 'WorkerConfigurationArn', cfn_parse.FromCloudFormation.getString(properties.WorkerConfigurationArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnector {
    /**
     * Workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html
     */
    export interface WorkerLogDeliveryProperty {
        /**
         * Details about delivering logs to Amazon CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-cloudwatchlogs
         */
        readonly cloudWatchLogs?: CfnConnector.CloudWatchLogsLogDeliveryProperty | cdk.IResolvable;
        /**
         * Details about delivering logs to Amazon Kinesis Data Firehose.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-firehose
         */
        readonly firehose?: CfnConnector.FirehoseLogDeliveryProperty | cdk.IResolvable;
        /**
         * Details about delivering logs to Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-s3
         */
        readonly s3?: CfnConnector.S3LogDeliveryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WorkerLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_WorkerLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogs', CfnConnector_CloudWatchLogsLogDeliveryPropertyValidator)(properties.cloudWatchLogs));
    errors.collect(cdk.propertyValidator('firehose', CfnConnector_FirehoseLogDeliveryPropertyValidator)(properties.firehose));
    errors.collect(cdk.propertyValidator('s3', CfnConnector_S3LogDeliveryPropertyValidator)(properties.s3));
    return errors.wrap('supplied properties not correct for "WorkerLogDeliveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.WorkerLogDelivery` resource
 *
 * @param properties - the TypeScript properties of a `WorkerLogDeliveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KafkaConnect::Connector.WorkerLogDelivery` resource.
 */
// @ts-ignore TS6133
function cfnConnectorWorkerLogDeliveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_WorkerLogDeliveryPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogs: cfnConnectorCloudWatchLogsLogDeliveryPropertyToCloudFormation(properties.cloudWatchLogs),
        Firehose: cfnConnectorFirehoseLogDeliveryPropertyToCloudFormation(properties.firehose),
        S3: cfnConnectorS3LogDeliveryPropertyToCloudFormation(properties.s3),
    };
}

// @ts-ignore TS6133
function CfnConnectorWorkerLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.WorkerLogDeliveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.WorkerLogDeliveryProperty>();
    ret.addPropertyResult('cloudWatchLogs', 'CloudWatchLogs', properties.CloudWatchLogs != null ? CfnConnectorCloudWatchLogsLogDeliveryPropertyFromCloudFormation(properties.CloudWatchLogs) : undefined);
    ret.addPropertyResult('firehose', 'Firehose', properties.Firehose != null ? CfnConnectorFirehoseLogDeliveryPropertyFromCloudFormation(properties.Firehose) : undefined);
    ret.addPropertyResult('s3', 'S3', properties.S3 != null ? CfnConnectorS3LogDeliveryPropertyFromCloudFormation(properties.S3) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
