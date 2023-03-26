// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:01.193Z","fingerprint":"iRXh06Vx2uQBiPWs1Q3u3iPZ1ujJUWGhcEJfPw/osQI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnBroker`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html
 */
export interface CfnBrokerProps {

    /**
     * Enables automatic upgrades to new minor versions for brokers, as new broker engine versions are released and supported by Amazon MQ. Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-autominorversionupgrade
     */
    readonly autoMinorVersionUpgrade: boolean | cdk.IResolvable;

    /**
     * The name of the broker. This value must be unique in your AWS account , 1-50 characters long, must contain only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
     *
     * > Do not add personally identifiable information (PII) or other confidential or sensitive information in broker names. Broker names are accessible to other AWS services, including C CloudWatch Logs . Broker names are not intended to be used for private or sensitive data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-brokername
     */
    readonly brokerName: string;

    /**
     * The deployment mode of the broker. Available values:
     *
     * - `SINGLE_INSTANCE`
     * - `ACTIVE_STANDBY_MULTI_AZ`
     * - `CLUSTER_MULTI_AZ`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-deploymentmode
     */
    readonly deploymentMode: string;

    /**
     * The type of broker engine. Currently, Amazon MQ supports `ACTIVEMQ` and `RABBITMQ` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-enginetype
     */
    readonly engineType: string;

    /**
     * The version of the broker engine. For a list of supported engine versions, see [Engine](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html) in the *Amazon MQ Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-engineversion
     */
    readonly engineVersion: string;

    /**
     * The broker's instance type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-hostinstancetype
     */
    readonly hostInstanceType: string;

    /**
     * Enables connections from applications outside of the VPC that hosts the broker's subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-publiclyaccessible
     */
    readonly publiclyAccessible: boolean | cdk.IResolvable;

    /**
     * The list of broker users (persons or applications) who can access queues and topics. For Amazon MQ for RabbitMQ brokers, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent RabbitMQ users are created by via the RabbitMQ web console or by using the RabbitMQ management API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-users
     */
    readonly users: Array<CfnBroker.UserProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional. The authentication strategy used to secure the broker. The default is `SIMPLE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-authenticationstrategy
     */
    readonly authenticationStrategy?: string;

    /**
     * A list of information about the configuration. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-configuration
     */
    readonly configuration?: CfnBroker.ConfigurationIdProperty | cdk.IResolvable;

    /**
     * Encryption options for the broker. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-encryptionoptions
     */
    readonly encryptionOptions?: CfnBroker.EncryptionOptionsProperty | cdk.IResolvable;

    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-ldapservermetadata
     */
    readonly ldapServerMetadata?: CfnBroker.LdapServerMetadataProperty | cdk.IResolvable;

    /**
     * Enables Amazon CloudWatch logging for brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-logs
     */
    readonly logs?: CfnBroker.LogListProperty | cdk.IResolvable;

    /**
     * The scheduled time period relative to UTC during which Amazon MQ begins to apply pending updates or patches to the broker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-maintenancewindowstarttime
     */
    readonly maintenanceWindowStartTime?: CfnBroker.MaintenanceWindowProperty | cdk.IResolvable;

    /**
     * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-securitygroups
     */
    readonly securityGroups?: string[];

    /**
     * The broker's storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-storagetype
     */
    readonly storageType?: string;

    /**
     * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones. If you specify more than one subnet, the subnets must be in different Availability Zones. Amazon MQ will not be able to create VPC endpoints for your broker with multiple subnets in the same Availability Zone. A SINGLE_INSTANCE deployment requires one subnet (for example, the default subnet). An ACTIVE_STANDBY_MULTI_AZ deployment (ACTIVEMQ) requires two subnets. A CLUSTER_MULTI_AZ deployment (RABBITMQ) has no subnet requirements when deployed with public accessibility, deployment without public accessibility requires at least one subnet.
     *
     * > If you specify subnets in a shared VPC for a RabbitMQ broker, the associated VPC to which the specified subnets belong must be owned by your AWS account . Amazon MQ will not be able to create VPC enpoints in VPCs that are not owned by your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-subnetids
     */
    readonly subnetIds?: string[];

    /**
     * An array of key-value pairs. For more information, see [Using Cost Allocation Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) in the *Billing and Cost Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-tags
     */
    readonly tags?: CfnBroker.TagsEntryProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnBrokerProps`
 *
 * @param properties - the TypeScript properties of a `CfnBrokerProps`
 *
 * @returns the result of the validation.
 */
function CfnBrokerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationStrategy', cdk.validateString)(properties.authenticationStrategy));
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.requiredValidator)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('brokerName', cdk.requiredValidator)(properties.brokerName));
    errors.collect(cdk.propertyValidator('brokerName', cdk.validateString)(properties.brokerName));
    errors.collect(cdk.propertyValidator('configuration', CfnBroker_ConfigurationIdPropertyValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('deploymentMode', cdk.requiredValidator)(properties.deploymentMode));
    errors.collect(cdk.propertyValidator('deploymentMode', cdk.validateString)(properties.deploymentMode));
    errors.collect(cdk.propertyValidator('encryptionOptions', CfnBroker_EncryptionOptionsPropertyValidator)(properties.encryptionOptions));
    errors.collect(cdk.propertyValidator('engineType', cdk.requiredValidator)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineType', cdk.validateString)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.requiredValidator)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('hostInstanceType', cdk.requiredValidator)(properties.hostInstanceType));
    errors.collect(cdk.propertyValidator('hostInstanceType', cdk.validateString)(properties.hostInstanceType));
    errors.collect(cdk.propertyValidator('ldapServerMetadata', CfnBroker_LdapServerMetadataPropertyValidator)(properties.ldapServerMetadata));
    errors.collect(cdk.propertyValidator('logs', CfnBroker_LogListPropertyValidator)(properties.logs));
    errors.collect(cdk.propertyValidator('maintenanceWindowStartTime', CfnBroker_MaintenanceWindowPropertyValidator)(properties.maintenanceWindowStartTime));
    errors.collect(cdk.propertyValidator('publiclyAccessible', cdk.requiredValidator)(properties.publiclyAccessible));
    errors.collect(cdk.propertyValidator('publiclyAccessible', cdk.validateBoolean)(properties.publiclyAccessible));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('storageType', cdk.validateString)(properties.storageType));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnBroker_TagsEntryPropertyValidator))(properties.tags));
    errors.collect(cdk.propertyValidator('users', cdk.requiredValidator)(properties.users));
    errors.collect(cdk.propertyValidator('users', cdk.listValidator(CfnBroker_UserPropertyValidator))(properties.users));
    return errors.wrap('supplied properties not correct for "CfnBrokerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker` resource
 *
 * @param properties - the TypeScript properties of a `CfnBrokerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker` resource.
 */
// @ts-ignore TS6133
function cfnBrokerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBrokerPropsValidator(properties).assertSuccess();
    return {
        AutoMinorVersionUpgrade: cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
        BrokerName: cdk.stringToCloudFormation(properties.brokerName),
        DeploymentMode: cdk.stringToCloudFormation(properties.deploymentMode),
        EngineType: cdk.stringToCloudFormation(properties.engineType),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        HostInstanceType: cdk.stringToCloudFormation(properties.hostInstanceType),
        PubliclyAccessible: cdk.booleanToCloudFormation(properties.publiclyAccessible),
        Users: cdk.listMapper(cfnBrokerUserPropertyToCloudFormation)(properties.users),
        AuthenticationStrategy: cdk.stringToCloudFormation(properties.authenticationStrategy),
        Configuration: cfnBrokerConfigurationIdPropertyToCloudFormation(properties.configuration),
        EncryptionOptions: cfnBrokerEncryptionOptionsPropertyToCloudFormation(properties.encryptionOptions),
        LdapServerMetadata: cfnBrokerLdapServerMetadataPropertyToCloudFormation(properties.ldapServerMetadata),
        Logs: cfnBrokerLogListPropertyToCloudFormation(properties.logs),
        MaintenanceWindowStartTime: cfnBrokerMaintenanceWindowPropertyToCloudFormation(properties.maintenanceWindowStartTime),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        StorageType: cdk.stringToCloudFormation(properties.storageType),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        Tags: cdk.listMapper(cfnBrokerTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnBrokerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBrokerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBrokerProps>();
    ret.addPropertyResult('autoMinorVersionUpgrade', 'AutoMinorVersionUpgrade', cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade));
    ret.addPropertyResult('brokerName', 'BrokerName', cfn_parse.FromCloudFormation.getString(properties.BrokerName));
    ret.addPropertyResult('deploymentMode', 'DeploymentMode', cfn_parse.FromCloudFormation.getString(properties.DeploymentMode));
    ret.addPropertyResult('engineType', 'EngineType', cfn_parse.FromCloudFormation.getString(properties.EngineType));
    ret.addPropertyResult('engineVersion', 'EngineVersion', cfn_parse.FromCloudFormation.getString(properties.EngineVersion));
    ret.addPropertyResult('hostInstanceType', 'HostInstanceType', cfn_parse.FromCloudFormation.getString(properties.HostInstanceType));
    ret.addPropertyResult('publiclyAccessible', 'PubliclyAccessible', cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible));
    ret.addPropertyResult('users', 'Users', cfn_parse.FromCloudFormation.getArray(CfnBrokerUserPropertyFromCloudFormation)(properties.Users));
    ret.addPropertyResult('authenticationStrategy', 'AuthenticationStrategy', properties.AuthenticationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationStrategy) : undefined);
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? CfnBrokerConfigurationIdPropertyFromCloudFormation(properties.Configuration) : undefined);
    ret.addPropertyResult('encryptionOptions', 'EncryptionOptions', properties.EncryptionOptions != null ? CfnBrokerEncryptionOptionsPropertyFromCloudFormation(properties.EncryptionOptions) : undefined);
    ret.addPropertyResult('ldapServerMetadata', 'LdapServerMetadata', properties.LdapServerMetadata != null ? CfnBrokerLdapServerMetadataPropertyFromCloudFormation(properties.LdapServerMetadata) : undefined);
    ret.addPropertyResult('logs', 'Logs', properties.Logs != null ? CfnBrokerLogListPropertyFromCloudFormation(properties.Logs) : undefined);
    ret.addPropertyResult('maintenanceWindowStartTime', 'MaintenanceWindowStartTime', properties.MaintenanceWindowStartTime != null ? CfnBrokerMaintenanceWindowPropertyFromCloudFormation(properties.MaintenanceWindowStartTime) : undefined);
    ret.addPropertyResult('securityGroups', 'SecurityGroups', properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups) : undefined);
    ret.addPropertyResult('storageType', 'StorageType', properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnBrokerTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmazonMQ::Broker`
 *
 * A *broker* is a message broker environment running on Amazon MQ . It is the basic building block of Amazon MQ .
 *
 * The `AWS::AmazonMQ::Broker` resource lets you create Amazon MQ for ActiveMQ and Amazon MQ for RabbitMQ brokers, add configuration changes or modify users for a speified ActiveMQ broker, return information about the specified broker, and delete the broker. For more information, see [How Amazon MQ works](https://docs.aws.amazon.com//amazon-mq/latest/developer-guide/amazon-mq-how-it-works.html) in the *Amazon MQ Developer Guide* .
 *
 * - `ec2:CreateNetworkInterface`
 *
 * This permission is required to allow Amazon MQ to create an elastic network interface (ENI) on behalf of your account.
 * - `ec2:CreateNetworkInterfacePermission`
 *
 * This permission is required to attach the ENI to the broker instance.
 * - `ec2:DeleteNetworkInterface`
 * - `ec2:DeleteNetworkInterfacePermission`
 * - `ec2:DetachNetworkInterface`
 * - `ec2:DescribeInternetGateways`
 * - `ec2:DescribeNetworkInterfaces`
 * - `ec2:DescribeNetworkInterfacePermissions`
 * - `ec2:DescribeRouteTables`
 * - `ec2:DescribeSecurityGroups`
 * - `ec2:DescribeSubnets`
 * - `ec2:DescribeVpcs`
 *
 * @cloudformationResource AWS::AmazonMQ::Broker
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html
 */
export class CfnBroker extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmazonMQ::Broker";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBroker {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBrokerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBroker(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AMQP endpoints of each broker instance as a list of strings.
     *
     * `amqp+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:5671`
     * @cloudformationAttribute AmqpEndpoints
     */
    public readonly attrAmqpEndpoints: string[];

    /**
     * The Amazon Resource Name (ARN) of the Amazon MQ broker.
     *
     * `arn:aws:mq:us-east-2:123456789012:broker:MyBroker:b-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique ID that Amazon MQ generates for the configuration.
     *
     * `c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
     * @cloudformationAttribute ConfigurationId
     */
    public readonly attrConfigurationId: string;

    /**
     * The revision number of the configuration.
     *
     * `1`
     * @cloudformationAttribute ConfigurationRevision
     */
    public readonly attrConfigurationRevision: number;

    /**
     * The IP addresses of each broker instance as a list of strings. Does not apply to RabbitMQ brokers.
     *
     * `['198.51.100.2', '203.0.113.9']`
     * @cloudformationAttribute IpAddresses
     */
    public readonly attrIpAddresses: string[];

    /**
     * The MQTT endpoints of each broker instance as a list of strings.
     *
     * `mqtt+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:8883`
     * @cloudformationAttribute MqttEndpoints
     */
    public readonly attrMqttEndpoints: string[];

    /**
     * The OpenWire endpoints of each broker instance as a list of strings.
     *
     * `ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61617`
     * @cloudformationAttribute OpenWireEndpoints
     */
    public readonly attrOpenWireEndpoints: string[];

    /**
     * The STOMP endpoints of each broker instance as a list of strings.
     *
     * `stomp+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61614`
     * @cloudformationAttribute StompEndpoints
     */
    public readonly attrStompEndpoints: string[];

    /**
     * The WSS endpoints of each broker instance as a list of strings.
     *
     * `wss://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61619`
     * @cloudformationAttribute WssEndpoints
     */
    public readonly attrWssEndpoints: string[];

    /**
     * Enables automatic upgrades to new minor versions for brokers, as new broker engine versions are released and supported by Amazon MQ. Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-autominorversionupgrade
     */
    public autoMinorVersionUpgrade: boolean | cdk.IResolvable;

    /**
     * The name of the broker. This value must be unique in your AWS account , 1-50 characters long, must contain only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
     *
     * > Do not add personally identifiable information (PII) or other confidential or sensitive information in broker names. Broker names are accessible to other AWS services, including C CloudWatch Logs . Broker names are not intended to be used for private or sensitive data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-brokername
     */
    public brokerName: string;

    /**
     * The deployment mode of the broker. Available values:
     *
     * - `SINGLE_INSTANCE`
     * - `ACTIVE_STANDBY_MULTI_AZ`
     * - `CLUSTER_MULTI_AZ`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-deploymentmode
     */
    public deploymentMode: string;

    /**
     * The type of broker engine. Currently, Amazon MQ supports `ACTIVEMQ` and `RABBITMQ` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-enginetype
     */
    public engineType: string;

    /**
     * The version of the broker engine. For a list of supported engine versions, see [Engine](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html) in the *Amazon MQ Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-engineversion
     */
    public engineVersion: string;

    /**
     * The broker's instance type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-hostinstancetype
     */
    public hostInstanceType: string;

    /**
     * Enables connections from applications outside of the VPC that hosts the broker's subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-publiclyaccessible
     */
    public publiclyAccessible: boolean | cdk.IResolvable;

    /**
     * The list of broker users (persons or applications) who can access queues and topics. For Amazon MQ for RabbitMQ brokers, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent RabbitMQ users are created by via the RabbitMQ web console or by using the RabbitMQ management API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-users
     */
    public users: Array<CfnBroker.UserProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional. The authentication strategy used to secure the broker. The default is `SIMPLE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-authenticationstrategy
     */
    public authenticationStrategy: string | undefined;

    /**
     * A list of information about the configuration. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-configuration
     */
    public configuration: CfnBroker.ConfigurationIdProperty | cdk.IResolvable | undefined;

    /**
     * Encryption options for the broker. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-encryptionoptions
     */
    public encryptionOptions: CfnBroker.EncryptionOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-ldapservermetadata
     */
    public ldapServerMetadata: CfnBroker.LdapServerMetadataProperty | cdk.IResolvable | undefined;

    /**
     * Enables Amazon CloudWatch logging for brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-logs
     */
    public logs: CfnBroker.LogListProperty | cdk.IResolvable | undefined;

    /**
     * The scheduled time period relative to UTC during which Amazon MQ begins to apply pending updates or patches to the broker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-maintenancewindowstarttime
     */
    public maintenanceWindowStartTime: CfnBroker.MaintenanceWindowProperty | cdk.IResolvable | undefined;

    /**
     * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-securitygroups
     */
    public securityGroups: string[] | undefined;

    /**
     * The broker's storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-storagetype
     */
    public storageType: string | undefined;

    /**
     * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones. If you specify more than one subnet, the subnets must be in different Availability Zones. Amazon MQ will not be able to create VPC endpoints for your broker with multiple subnets in the same Availability Zone. A SINGLE_INSTANCE deployment requires one subnet (for example, the default subnet). An ACTIVE_STANDBY_MULTI_AZ deployment (ACTIVEMQ) requires two subnets. A CLUSTER_MULTI_AZ deployment (RABBITMQ) has no subnet requirements when deployed with public accessibility, deployment without public accessibility requires at least one subnet.
     *
     * > If you specify subnets in a shared VPC for a RabbitMQ broker, the associated VPC to which the specified subnets belong must be owned by your AWS account . Amazon MQ will not be able to create VPC enpoints in VPCs that are not owned by your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-subnetids
     */
    public subnetIds: string[] | undefined;

    /**
     * An array of key-value pairs. For more information, see [Using Cost Allocation Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) in the *Billing and Cost Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AmazonMQ::Broker`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBrokerProps) {
        super(scope, id, { type: CfnBroker.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'autoMinorVersionUpgrade', this);
        cdk.requireProperty(props, 'brokerName', this);
        cdk.requireProperty(props, 'deploymentMode', this);
        cdk.requireProperty(props, 'engineType', this);
        cdk.requireProperty(props, 'engineVersion', this);
        cdk.requireProperty(props, 'hostInstanceType', this);
        cdk.requireProperty(props, 'publiclyAccessible', this);
        cdk.requireProperty(props, 'users', this);
        this.attrAmqpEndpoints = cdk.Token.asList(this.getAtt('AmqpEndpoints', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationId = cdk.Token.asString(this.getAtt('ConfigurationId', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationRevision = cdk.Token.asNumber(this.getAtt('ConfigurationRevision', cdk.ResolutionTypeHint.NUMBER));
        this.attrIpAddresses = cdk.Token.asList(this.getAtt('IpAddresses', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrMqttEndpoints = cdk.Token.asList(this.getAtt('MqttEndpoints', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrOpenWireEndpoints = cdk.Token.asList(this.getAtt('OpenWireEndpoints', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrStompEndpoints = cdk.Token.asList(this.getAtt('StompEndpoints', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrWssEndpoints = cdk.Token.asList(this.getAtt('WssEndpoints', cdk.ResolutionTypeHint.STRING_LIST));

        this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
        this.brokerName = props.brokerName;
        this.deploymentMode = props.deploymentMode;
        this.engineType = props.engineType;
        this.engineVersion = props.engineVersion;
        this.hostInstanceType = props.hostInstanceType;
        this.publiclyAccessible = props.publiclyAccessible;
        this.users = props.users;
        this.authenticationStrategy = props.authenticationStrategy;
        this.configuration = props.configuration;
        this.encryptionOptions = props.encryptionOptions;
        this.ldapServerMetadata = props.ldapServerMetadata;
        this.logs = props.logs;
        this.maintenanceWindowStartTime = props.maintenanceWindowStartTime;
        this.securityGroups = props.securityGroups;
        this.storageType = props.storageType;
        this.subnetIds = props.subnetIds;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AmazonMQ::Broker", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBroker.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            autoMinorVersionUpgrade: this.autoMinorVersionUpgrade,
            brokerName: this.brokerName,
            deploymentMode: this.deploymentMode,
            engineType: this.engineType,
            engineVersion: this.engineVersion,
            hostInstanceType: this.hostInstanceType,
            publiclyAccessible: this.publiclyAccessible,
            users: this.users,
            authenticationStrategy: this.authenticationStrategy,
            configuration: this.configuration,
            encryptionOptions: this.encryptionOptions,
            ldapServerMetadata: this.ldapServerMetadata,
            logs: this.logs,
            maintenanceWindowStartTime: this.maintenanceWindowStartTime,
            securityGroups: this.securityGroups,
            storageType: this.storageType,
            subnetIds: this.subnetIds,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBrokerPropsToCloudFormation(props);
    }
}

export namespace CfnBroker {
    /**
     * A list of information about the configuration.
     *
     * > Does not apply to RabbitMQ brokers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html
     */
    export interface ConfigurationIdProperty {
        /**
         * The unique ID that Amazon MQ generates for the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html#cfn-amazonmq-broker-configurationid-id
         */
        readonly id: string;
        /**
         * The revision number of the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html#cfn-amazonmq-broker-configurationid-revision
         */
        readonly revision: number;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationIdProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_ConfigurationIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('revision', cdk.requiredValidator)(properties.revision));
    errors.collect(cdk.propertyValidator('revision', cdk.validateNumber)(properties.revision));
    return errors.wrap('supplied properties not correct for "ConfigurationIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.ConfigurationId` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.ConfigurationId` resource.
 */
// @ts-ignore TS6133
function cfnBrokerConfigurationIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_ConfigurationIdPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Revision: cdk.numberToCloudFormation(properties.revision),
    };
}

// @ts-ignore TS6133
function CfnBrokerConfigurationIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.ConfigurationIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.ConfigurationIdProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('revision', 'Revision', cfn_parse.FromCloudFormation.getNumber(properties.Revision));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * Encryption options for the broker.
     *
     * > Does not apply to RabbitMQ brokers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html
     */
    export interface EncryptionOptionsProperty {
        /**
         * The customer master key (CMK) to use for the A AWS KMS (KMS). This key is used to encrypt your data at rest. If not provided, Amazon MQ will use a default CMK to encrypt your data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html#cfn-amazonmq-broker-encryptionoptions-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * Enables the use of an AWS owned CMK using AWS KMS (KMS). Set to `true` by default, if no value is provided, for example, for RabbitMQ brokers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html#cfn-amazonmq-broker-encryptionoptions-useawsownedkey
         */
        readonly useAwsOwnedKey: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_EncryptionOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('useAwsOwnedKey', cdk.requiredValidator)(properties.useAwsOwnedKey));
    errors.collect(cdk.propertyValidator('useAwsOwnedKey', cdk.validateBoolean)(properties.useAwsOwnedKey));
    return errors.wrap('supplied properties not correct for "EncryptionOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.EncryptionOptions` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.EncryptionOptions` resource.
 */
// @ts-ignore TS6133
function cfnBrokerEncryptionOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_EncryptionOptionsPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        UseAwsOwnedKey: cdk.booleanToCloudFormation(properties.useAwsOwnedKey),
    };
}

// @ts-ignore TS6133
function CfnBrokerEncryptionOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.EncryptionOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.EncryptionOptionsProperty>();
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('useAwsOwnedKey', 'UseAwsOwnedKey', cfn_parse.FromCloudFormation.getBoolean(properties.UseAwsOwnedKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker.
     *
     * > Does not apply to RabbitMQ brokers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html
     */
    export interface LdapServerMetadataProperty {
        /**
         * Specifies the location of the LDAP server such as AWS Directory Service for Microsoft Active Directory . Optional failover server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-hosts
         */
        readonly hosts: string[];
        /**
         * The distinguished name of the node in the directory information tree (DIT) to search for roles or groups. For example, `ou=group` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolebase
         */
        readonly roleBase: string;
        /**
         * The group name attribute in a role entry whose value is the name of that role. For example, you can specify `cn` for a group entry's common name. If authentication succeeds, then the user is assigned the the value of the `cn` attribute for each role entry that they are a member of.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolename
         */
        readonly roleName?: string;
        /**
         * The LDAP search filter used to find roles within the roleBase. The distinguished name of the user matched by userSearchMatching is substituted into the `{0}` placeholder in the search filter. The client's username is substituted into the `{1}` placeholder. For example, if you set this option to `(member=uid={1})` for the user janedoe, the search filter becomes `(member=uid=janedoe)` after string substitution. It matches all role entries that have a member attribute equal to `uid=janedoe` under the subtree selected by the `RoleBases` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolesearchmatching
         */
        readonly roleSearchMatching: string;
        /**
         * The directory search scope for the role. If set to true, scope is to search the entire subtree.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolesearchsubtree
         */
        readonly roleSearchSubtree?: boolean | cdk.IResolvable;
        /**
         * Service account password. A service account is an account in your LDAP server that has access to initiate a connection. For example, `cn=admin` , `dc=corp` , `dc=example` , `dc=com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-serviceaccountpassword
         */
        readonly serviceAccountPassword: string;
        /**
         * Service account username. A service account is an account in your LDAP server that has access to initiate a connection. For example, `cn=admin` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-serviceaccountusername
         */
        readonly serviceAccountUsername: string;
        /**
         * Select a particular subtree of the directory information tree (DIT) to search for user entries. The subtree is specified by a DN, which specifies the base node of the subtree. For example, by setting this option to `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` , the search for user entries is restricted to the subtree beneath `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-userbase
         */
        readonly userBase: string;
        /**
         * The name of the LDAP attribute in the user's directory entry for the user's group membership. In some cases, user roles may be identified by the value of an attribute in the user's directory entry. The `UserRoleName` option allows you to provide the name of this attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-userrolename
         */
        readonly userRoleName?: string;
        /**
         * The LDAP search filter used to find users within the `userBase` . The client's username is substituted into the `{0}` placeholder in the search filter. For example, if this option is set to `(uid={0})` and the received username is `janedoe` , the search filter becomes `(uid=janedoe)` after string substitution. It will result in matching an entry like `uid=janedoe` , `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-usersearchmatching
         */
        readonly userSearchMatching: string;
        /**
         * The directory search scope for the user. If set to true, scope is to search the entire subtree.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-usersearchsubtree
         */
        readonly userSearchSubtree?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LdapServerMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `LdapServerMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_LdapServerMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hosts', cdk.requiredValidator)(properties.hosts));
    errors.collect(cdk.propertyValidator('hosts', cdk.listValidator(cdk.validateString))(properties.hosts));
    errors.collect(cdk.propertyValidator('roleBase', cdk.requiredValidator)(properties.roleBase));
    errors.collect(cdk.propertyValidator('roleBase', cdk.validateString)(properties.roleBase));
    errors.collect(cdk.propertyValidator('roleName', cdk.validateString)(properties.roleName));
    errors.collect(cdk.propertyValidator('roleSearchMatching', cdk.requiredValidator)(properties.roleSearchMatching));
    errors.collect(cdk.propertyValidator('roleSearchMatching', cdk.validateString)(properties.roleSearchMatching));
    errors.collect(cdk.propertyValidator('roleSearchSubtree', cdk.validateBoolean)(properties.roleSearchSubtree));
    errors.collect(cdk.propertyValidator('serviceAccountPassword', cdk.requiredValidator)(properties.serviceAccountPassword));
    errors.collect(cdk.propertyValidator('serviceAccountPassword', cdk.validateString)(properties.serviceAccountPassword));
    errors.collect(cdk.propertyValidator('serviceAccountUsername', cdk.requiredValidator)(properties.serviceAccountUsername));
    errors.collect(cdk.propertyValidator('serviceAccountUsername', cdk.validateString)(properties.serviceAccountUsername));
    errors.collect(cdk.propertyValidator('userBase', cdk.requiredValidator)(properties.userBase));
    errors.collect(cdk.propertyValidator('userBase', cdk.validateString)(properties.userBase));
    errors.collect(cdk.propertyValidator('userRoleName', cdk.validateString)(properties.userRoleName));
    errors.collect(cdk.propertyValidator('userSearchMatching', cdk.requiredValidator)(properties.userSearchMatching));
    errors.collect(cdk.propertyValidator('userSearchMatching', cdk.validateString)(properties.userSearchMatching));
    errors.collect(cdk.propertyValidator('userSearchSubtree', cdk.validateBoolean)(properties.userSearchSubtree));
    return errors.wrap('supplied properties not correct for "LdapServerMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.LdapServerMetadata` resource
 *
 * @param properties - the TypeScript properties of a `LdapServerMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.LdapServerMetadata` resource.
 */
// @ts-ignore TS6133
function cfnBrokerLdapServerMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_LdapServerMetadataPropertyValidator(properties).assertSuccess();
    return {
        Hosts: cdk.listMapper(cdk.stringToCloudFormation)(properties.hosts),
        RoleBase: cdk.stringToCloudFormation(properties.roleBase),
        RoleName: cdk.stringToCloudFormation(properties.roleName),
        RoleSearchMatching: cdk.stringToCloudFormation(properties.roleSearchMatching),
        RoleSearchSubtree: cdk.booleanToCloudFormation(properties.roleSearchSubtree),
        ServiceAccountPassword: cdk.stringToCloudFormation(properties.serviceAccountPassword),
        ServiceAccountUsername: cdk.stringToCloudFormation(properties.serviceAccountUsername),
        UserBase: cdk.stringToCloudFormation(properties.userBase),
        UserRoleName: cdk.stringToCloudFormation(properties.userRoleName),
        UserSearchMatching: cdk.stringToCloudFormation(properties.userSearchMatching),
        UserSearchSubtree: cdk.booleanToCloudFormation(properties.userSearchSubtree),
    };
}

// @ts-ignore TS6133
function CfnBrokerLdapServerMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.LdapServerMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.LdapServerMetadataProperty>();
    ret.addPropertyResult('hosts', 'Hosts', cfn_parse.FromCloudFormation.getStringArray(properties.Hosts));
    ret.addPropertyResult('roleBase', 'RoleBase', cfn_parse.FromCloudFormation.getString(properties.RoleBase));
    ret.addPropertyResult('roleName', 'RoleName', properties.RoleName != null ? cfn_parse.FromCloudFormation.getString(properties.RoleName) : undefined);
    ret.addPropertyResult('roleSearchMatching', 'RoleSearchMatching', cfn_parse.FromCloudFormation.getString(properties.RoleSearchMatching));
    ret.addPropertyResult('roleSearchSubtree', 'RoleSearchSubtree', properties.RoleSearchSubtree != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RoleSearchSubtree) : undefined);
    ret.addPropertyResult('serviceAccountPassword', 'ServiceAccountPassword', cfn_parse.FromCloudFormation.getString(properties.ServiceAccountPassword));
    ret.addPropertyResult('serviceAccountUsername', 'ServiceAccountUsername', cfn_parse.FromCloudFormation.getString(properties.ServiceAccountUsername));
    ret.addPropertyResult('userBase', 'UserBase', cfn_parse.FromCloudFormation.getString(properties.UserBase));
    ret.addPropertyResult('userRoleName', 'UserRoleName', properties.UserRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.UserRoleName) : undefined);
    ret.addPropertyResult('userSearchMatching', 'UserSearchMatching', cfn_parse.FromCloudFormation.getString(properties.UserSearchMatching));
    ret.addPropertyResult('userSearchSubtree', 'UserSearchSubtree', properties.UserSearchSubtree != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserSearchSubtree) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * The list of information about logs to be enabled for the specified broker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html
     */
    export interface LogListProperty {
        /**
         * Enables audit logging. Every user management action made using JMX or the ActiveMQ Web Console is logged. Does not apply to RabbitMQ brokers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html#cfn-amazonmq-broker-loglist-audit
         */
        readonly audit?: boolean | cdk.IResolvable;
        /**
         * Enables general logging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html#cfn-amazonmq-broker-loglist-general
         */
        readonly general?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LogListProperty`
 *
 * @param properties - the TypeScript properties of a `LogListProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_LogListPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audit', cdk.validateBoolean)(properties.audit));
    errors.collect(cdk.propertyValidator('general', cdk.validateBoolean)(properties.general));
    return errors.wrap('supplied properties not correct for "LogListProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.LogList` resource
 *
 * @param properties - the TypeScript properties of a `LogListProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.LogList` resource.
 */
// @ts-ignore TS6133
function cfnBrokerLogListPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_LogListPropertyValidator(properties).assertSuccess();
    return {
        Audit: cdk.booleanToCloudFormation(properties.audit),
        General: cdk.booleanToCloudFormation(properties.general),
    };
}

// @ts-ignore TS6133
function CfnBrokerLogListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.LogListProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.LogListProperty>();
    ret.addPropertyResult('audit', 'Audit', properties.Audit != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Audit) : undefined);
    ret.addPropertyResult('general', 'General', properties.General != null ? cfn_parse.FromCloudFormation.getBoolean(properties.General) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * The parameters that determine the `WeeklyStartTime` to apply pending updates or patches to the broker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html
     */
    export interface MaintenanceWindowProperty {
        /**
         * The day of the week.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-dayofweek
         */
        readonly dayOfWeek: string;
        /**
         * The time, in 24-hour format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-timeofday
         */
        readonly timeOfDay: string;
        /**
         * The time zone, UTC by default, in either the Country/City format, or the UTC offset format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-timezone
         */
        readonly timeZone: string;
    }
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_MaintenanceWindowPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dayOfWeek', cdk.requiredValidator)(properties.dayOfWeek));
    errors.collect(cdk.propertyValidator('dayOfWeek', cdk.validateString)(properties.dayOfWeek));
    errors.collect(cdk.propertyValidator('timeOfDay', cdk.requiredValidator)(properties.timeOfDay));
    errors.collect(cdk.propertyValidator('timeOfDay', cdk.validateString)(properties.timeOfDay));
    errors.collect(cdk.propertyValidator('timeZone', cdk.requiredValidator)(properties.timeZone));
    errors.collect(cdk.propertyValidator('timeZone', cdk.validateString)(properties.timeZone));
    return errors.wrap('supplied properties not correct for "MaintenanceWindowProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.MaintenanceWindow` resource
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.MaintenanceWindow` resource.
 */
// @ts-ignore TS6133
function cfnBrokerMaintenanceWindowPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_MaintenanceWindowPropertyValidator(properties).assertSuccess();
    return {
        DayOfWeek: cdk.stringToCloudFormation(properties.dayOfWeek),
        TimeOfDay: cdk.stringToCloudFormation(properties.timeOfDay),
        TimeZone: cdk.stringToCloudFormation(properties.timeZone),
    };
}

// @ts-ignore TS6133
function CfnBrokerMaintenanceWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.MaintenanceWindowProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.MaintenanceWindowProperty>();
    ret.addPropertyResult('dayOfWeek', 'DayOfWeek', cfn_parse.FromCloudFormation.getString(properties.DayOfWeek));
    ret.addPropertyResult('timeOfDay', 'TimeOfDay', cfn_parse.FromCloudFormation.getString(properties.TimeOfDay));
    ret.addPropertyResult('timeZone', 'TimeZone', cfn_parse.FromCloudFormation.getString(properties.TimeZone));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * A key-value pair to associate with the broker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html
     */
    export interface TagsEntryProperty {
        /**
         * The key in a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html#cfn-amazonmq-broker-tagsentry-key
         */
        readonly key: string;
        /**
         * The value in a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html#cfn-amazonmq-broker-tagsentry-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnBrokerTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBrokerTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBroker {
    /**
     * The list of broker users (persons or applications) who can access queues and topics. For Amazon MQ for RabbitMQ brokers, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent broker users are created via the RabbitMQ web console or by using the RabbitMQ management API.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html
     */
    export interface UserProperty {
        /**
         * Enables access to the ActiveMQ web console for the ActiveMQ user. Does not apply to RabbitMQ brokers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-consoleaccess
         */
        readonly consoleAccess?: boolean | cdk.IResolvable;
        /**
         * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long. Does not apply to RabbitMQ brokers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-groups
         */
        readonly groups?: string[];
        /**
         * The password of the user. This value must be at least 12 characters long, must contain at least 4 unique characters, and must not contain commas, colons, or equal signs (,:=).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-password
         */
        readonly password: string;
        /**
         * The username of the broker user. For Amazon MQ for ActiveMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). For Amazon MQ for RabbitMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores (- . _). This value must not contain a tilde (~) character. Amazon MQ prohibts using guest as a valid usename. This value must be 2-100 characters long.
         *
         * > Do not add personally identifiable information (PII) or other confidential or sensitive information in broker usernames. Broker usernames are accessible to other AWS services, including CloudWatch Logs . Broker usernames are not intended to be used for private or sensitive data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-username
         */
        readonly username: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserProperty`
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the result of the validation.
 */
function CfnBroker_UserPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('consoleAccess', cdk.validateBoolean)(properties.consoleAccess));
    errors.collect(cdk.propertyValidator('groups', cdk.listValidator(cdk.validateString))(properties.groups));
    errors.collect(cdk.propertyValidator('password', cdk.requiredValidator)(properties.password));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('username', cdk.requiredValidator)(properties.username));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "UserProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.User` resource
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Broker.User` resource.
 */
// @ts-ignore TS6133
function cfnBrokerUserPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBroker_UserPropertyValidator(properties).assertSuccess();
    return {
        ConsoleAccess: cdk.booleanToCloudFormation(properties.consoleAccess),
        Groups: cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
        Password: cdk.stringToCloudFormation(properties.password),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnBrokerUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.UserProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.UserProperty>();
    ret.addPropertyResult('consoleAccess', 'ConsoleAccess', properties.ConsoleAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ConsoleAccess) : undefined);
    ret.addPropertyResult('groups', 'Groups', properties.Groups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Groups) : undefined);
    ret.addPropertyResult('password', 'Password', cfn_parse.FromCloudFormation.getString(properties.Password));
    ret.addPropertyResult('username', 'Username', cfn_parse.FromCloudFormation.getString(properties.Username));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html
 */
export interface CfnConfigurationProps {

    /**
     * The base64-encoded XML configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-data
     */
    readonly data: string;

    /**
     * The type of broker engine. Note: Currently, Amazon MQ only supports ACTIVEMQ for creating and editing broker configurations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-enginetype
     */
    readonly engineType: string;

    /**
     * The version of the broker engine. For a list of supported engine versions, see [](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-engineversion
     */
    readonly engineVersion: string;

    /**
     * The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-name
     */
    readonly name: string;

    /**
     * Optional. The authentication strategy associated with the configuration. The default is `SIMPLE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-authenticationstrategy
     */
    readonly authenticationStrategy?: string;

    /**
     * The description of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-description
     */
    readonly description?: string;

    /**
     * Create tags when creating the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-tags
     */
    readonly tags?: CfnConfiguration.TagsEntryProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationStrategy', cdk.validateString)(properties.authenticationStrategy));
    errors.collect(cdk.propertyValidator('data', cdk.requiredValidator)(properties.data));
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('engineType', cdk.requiredValidator)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineType', cdk.validateString)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.requiredValidator)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnConfiguration_TagsEntryPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Configuration` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Configuration` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationPropsValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        EngineType: cdk.stringToCloudFormation(properties.engineType),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        Name: cdk.stringToCloudFormation(properties.name),
        AuthenticationStrategy: cdk.stringToCloudFormation(properties.authenticationStrategy),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cfnConfigurationTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProps>();
    ret.addPropertyResult('data', 'Data', cfn_parse.FromCloudFormation.getString(properties.Data));
    ret.addPropertyResult('engineType', 'EngineType', cfn_parse.FromCloudFormation.getString(properties.EngineType));
    ret.addPropertyResult('engineVersion', 'EngineVersion', cfn_parse.FromCloudFormation.getString(properties.EngineVersion));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('authenticationStrategy', 'AuthenticationStrategy', properties.AuthenticationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationStrategy) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmazonMQ::Configuration`
 *
 * Creates a new configuration for the specified configuration name. Amazon MQ uses the default configuration (the engine type and version).
 *
 * > Does not apply to RabbitMQ brokers.
 *
 * @cloudformationResource AWS::AmazonMQ::Configuration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html
 */
export class CfnConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmazonMQ::Configuration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the Amazon MQ configuration.
     *
     * `arn:aws:mq:us-east-2:123456789012:configuration:MyConfigurationDevelopment:c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the Amazon MQ configuration.
     *
     * `c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The revision number of the configuration.
     *
     * `1`
     * @cloudformationAttribute Revision
     */
    public readonly attrRevision: number;

    /**
     * The base64-encoded XML configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-data
     */
    public data: string;

    /**
     * The type of broker engine. Note: Currently, Amazon MQ only supports ACTIVEMQ for creating and editing broker configurations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-enginetype
     */
    public engineType: string;

    /**
     * The version of the broker engine. For a list of supported engine versions, see [](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-engineversion
     */
    public engineVersion: string;

    /**
     * The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-name
     */
    public name: string;

    /**
     * Optional. The authentication strategy associated with the configuration. The default is `SIMPLE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-authenticationstrategy
     */
    public authenticationStrategy: string | undefined;

    /**
     * The description of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-description
     */
    public description: string | undefined;

    /**
     * Create tags when creating the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AmazonMQ::Configuration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationProps) {
        super(scope, id, { type: CfnConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'data', this);
        cdk.requireProperty(props, 'engineType', this);
        cdk.requireProperty(props, 'engineVersion', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrRevision = cdk.Token.asNumber(this.getAtt('Revision', cdk.ResolutionTypeHint.NUMBER));

        this.data = props.data;
        this.engineType = props.engineType;
        this.engineVersion = props.engineVersion;
        this.name = props.name;
        this.authenticationStrategy = props.authenticationStrategy;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AmazonMQ::Configuration", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            data: this.data,
            engineType: this.engineType,
            engineVersion: this.engineVersion,
            name: this.name,
            authenticationStrategy: this.authenticationStrategy,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnConfiguration {
    /**
     * A key-value pair to associate with the configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html
     */
    export interface TagsEntryProperty {
        /**
         * The key in a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-key
         */
        readonly key: string;
        /**
         * The value in a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfiguration_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::Configuration.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::Configuration.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfiguration_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigurationTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguration.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguration.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html
 */
export interface CfnConfigurationAssociationProps {

    /**
     * The broker to associate with a configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-broker
     */
    readonly broker: string;

    /**
     * The configuration to associate with a broker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-configuration
     */
    readonly configuration: CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('broker', cdk.requiredValidator)(properties.broker));
    errors.collect(cdk.propertyValidator('broker', cdk.validateString)(properties.broker));
    errors.collect(cdk.propertyValidator('configuration', cdk.requiredValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('configuration', CfnConfigurationAssociation_ConfigurationIdPropertyValidator)(properties.configuration));
    return errors.wrap('supplied properties not correct for "CfnConfigurationAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::ConfigurationAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::ConfigurationAssociation` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationAssociationPropsValidator(properties).assertSuccess();
    return {
        Broker: cdk.stringToCloudFormation(properties.broker),
        Configuration: cfnConfigurationAssociationConfigurationIdPropertyToCloudFormation(properties.configuration),
    };
}

// @ts-ignore TS6133
function CfnConfigurationAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAssociationProps>();
    ret.addPropertyResult('broker', 'Broker', cfn_parse.FromCloudFormation.getString(properties.Broker));
    ret.addPropertyResult('configuration', 'Configuration', CfnConfigurationAssociationConfigurationIdPropertyFromCloudFormation(properties.Configuration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmazonMQ::ConfigurationAssociation`
 *
 * Use the AWS CloudFormation `AWS::AmazonMQ::ConfigurationAssociation` resource to associate a configuration with a broker, or return information about the specified ConfigurationAssociation. Only use one per broker, and don't use a configuration on the broker resource if you have associated a configuration with that broker.
 *
 * > Does not apply to RabbitMQ brokers.
 *
 * @cloudformationResource AWS::AmazonMQ::ConfigurationAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html
 */
export class CfnConfigurationAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmazonMQ::ConfigurationAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The broker to associate with a configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-broker
     */
    public broker: string;

    /**
     * The configuration to associate with a broker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-configuration
     */
    public configuration: CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::AmazonMQ::ConfigurationAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationAssociationProps) {
        super(scope, id, { type: CfnConfigurationAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'broker', this);
        cdk.requireProperty(props, 'configuration', this);

        this.broker = props.broker;
        this.configuration = props.configuration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            broker: this.broker,
            configuration: this.configuration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationAssociationPropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationAssociation {
    /**
     * The `ConfigurationId` property type specifies a configuration Id and the revision of a configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html
     */
    export interface ConfigurationIdProperty {
        /**
         * The unique ID that Amazon MQ generates for the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html#cfn-amazonmq-configurationassociation-configurationid-id
         */
        readonly id: string;
        /**
         * The revision number of the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html#cfn-amazonmq-configurationassociation-configurationid-revision
         */
        readonly revision: number;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationIdProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationAssociation_ConfigurationIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('revision', cdk.requiredValidator)(properties.revision));
    errors.collect(cdk.propertyValidator('revision', cdk.validateNumber)(properties.revision));
    return errors.wrap('supplied properties not correct for "ConfigurationIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmazonMQ::ConfigurationAssociation.ConfigurationId` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmazonMQ::ConfigurationAssociation.ConfigurationId` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationAssociationConfigurationIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationAssociation_ConfigurationIdPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Revision: cdk.numberToCloudFormation(properties.revision),
    };
}

// @ts-ignore TS6133
function CfnConfigurationAssociationConfigurationIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAssociation.ConfigurationIdProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('revision', 'Revision', cfn_parse.FromCloudFormation.getNumber(properties.Revision));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
