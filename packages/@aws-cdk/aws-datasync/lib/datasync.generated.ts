// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:37.477Z","fingerprint":"F3wLPvA54fH/peh6L9iup8KNa5xTfttAU9+B0GVIiac="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAgent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html
 */
export interface CfnAgentProps {

    /**
     * Your agent activation key. You can get the activation key either by sending an HTTP GET request with redirects that enable you to get the agent IP address (port 80). Alternatively, you can get it from the DataSync console.
     *
     * The redirect URL returned in the response provides you the activation key for your agent in the query string parameter `activationKey` . It might also include other activation-related parameters; however, these are merely defaults. The arguments you pass to this API call determine the actual configuration of your agent.
     *
     * For more information, see [Creating and activating an agent](https://docs.aws.amazon.com/datasync/latest/userguide/activating-agent.html) in the *AWS DataSync User Guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-activationkey
     */
    readonly activationKey: string;

    /**
     * The name you configured for your agent. This value is a text reference that is used to identify the agent in the console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-agentname
     */
    readonly agentName?: string;

    /**
     * The Amazon Resource Names (ARNs) of the security groups used to protect your data transfer task subnets. See [SecurityGroupArns](https://docs.aws.amazon.com/datasync/latest/userguide/API_Ec2Config.html#DataSync-Type-Ec2Config-SecurityGroupArns) .
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-securitygrouparns
     */
    readonly securityGroupArns?: string[];

    /**
     * The Amazon Resource Names (ARNs) of the subnets in which DataSync will create elastic network interfaces for each data transfer task. The agent that runs a task must be private. When you start a task that is associated with an agent created in a VPC, or one that has access to an IP address in a VPC, then the task is also private. In this case, DataSync creates four network interfaces for each task in your subnet. For a data transfer to work, the agent must be able to route to all these four network interfaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-subnetarns
     */
    readonly subnetArns?: string[];

    /**
     * The key-value pair that represents the tag that you want to associate with the agent. The value can be an empty string. This value helps you manage, filter, and search for your agents.
     *
     * > Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ID of the virtual private cloud (VPC) endpoint that the agent has access to. This is the client-side VPC endpoint, powered by AWS PrivateLink . If you don't have an AWS PrivateLink VPC endpoint, see [AWS PrivateLink and VPC endpoints](https://docs.aws.amazon.com//vpc/latest/userguide/endpoint-services-overview.html) in the *Amazon VPC User Guide* .
     *
     * For more information about activating your agent in a private network based on a VPC, see [Using AWS DataSync in a Virtual Private Cloud](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-in-vpc.html) in the *AWS DataSync User Guide.*
     *
     * A VPC endpoint ID looks like this: `vpce-01234d5aff67890e1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-vpcendpointid
     */
    readonly vpcEndpointId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAgentProps`
 *
 * @param properties - the TypeScript properties of a `CfnAgentProps`
 *
 * @returns the result of the validation.
 */
function CfnAgentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activationKey', cdk.requiredValidator)(properties.activationKey));
    errors.collect(cdk.propertyValidator('activationKey', cdk.validateString)(properties.activationKey));
    errors.collect(cdk.propertyValidator('agentName', cdk.validateString)(properties.agentName));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('subnetArns', cdk.listValidator(cdk.validateString))(properties.subnetArns));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcEndpointId', cdk.validateString)(properties.vpcEndpointId));
    return errors.wrap('supplied properties not correct for "CfnAgentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::Agent` resource
 *
 * @param properties - the TypeScript properties of a `CfnAgentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::Agent` resource.
 */
// @ts-ignore TS6133
function cfnAgentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAgentPropsValidator(properties).assertSuccess();
    return {
        ActivationKey: cdk.stringToCloudFormation(properties.activationKey),
        AgentName: cdk.stringToCloudFormation(properties.agentName),
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        SubnetArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetArns),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VpcEndpointId: cdk.stringToCloudFormation(properties.vpcEndpointId),
    };
}

// @ts-ignore TS6133
function CfnAgentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAgentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAgentProps>();
    ret.addPropertyResult('activationKey', 'ActivationKey', cfn_parse.FromCloudFormation.getString(properties.ActivationKey));
    ret.addPropertyResult('agentName', 'AgentName', properties.AgentName != null ? cfn_parse.FromCloudFormation.getString(properties.AgentName) : undefined);
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns) : undefined);
    ret.addPropertyResult('subnetArns', 'SubnetArns', properties.SubnetArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetArns) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpcEndpointId', 'VpcEndpointId', properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::Agent`
 *
 * The `AWS::DataSync::Agent` resource specifies an AWS DataSync agent to be deployed and activated on your host. The activation process associates your agent with your account. In the activation process, you specify information such as the AWS Region that you want to activate the agent in. You activate the agent in the AWS Region where your target locations (in Amazon S3, Amazon EFS, or Amazon FSx for Windows File Server) reside. Your tasks are created in this AWS Region .
 *
 * You can activate the agent in a virtual private cloud (VPC) or provide the agent access to a VPC endpoint so that you can run tasks without sending them over the public internet.
 *
 * You can specify an agent to be used for more than one location. If a task uses multiple agents, all of them must have a status of AVAILABLE for the task to run. If you use multiple agents for a source location, the status of all the agents must be AVAILABLE for the task to run.
 *
 * For more information, see [Activating an Agent](https://docs.aws.amazon.com/datasync/latest/userguide/activating-agent.html) in the *AWS DataSync User Guide* .
 *
 * Agents are automatically updated by AWS on a regular basis, using a mechanism that ensures minimal interruption to your tasks.
 *
 * @cloudformationResource AWS::DataSync::Agent
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html
 */
export class CfnAgent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::Agent";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAgent {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAgentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAgent(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the agent. Use the `ListAgents` operation to return a list of agents for your account and AWS Region .
     * @cloudformationAttribute AgentArn
     */
    public readonly attrAgentArn: string;

    /**
     * The type of endpoint that your agent is connected to. If the endpoint is a VPC endpoint, the agent is not accessible over the public internet.
     * @cloudformationAttribute EndpointType
     */
    public readonly attrEndpointType: string;

    /**
     * Your agent activation key. You can get the activation key either by sending an HTTP GET request with redirects that enable you to get the agent IP address (port 80). Alternatively, you can get it from the DataSync console.
     *
     * The redirect URL returned in the response provides you the activation key for your agent in the query string parameter `activationKey` . It might also include other activation-related parameters; however, these are merely defaults. The arguments you pass to this API call determine the actual configuration of your agent.
     *
     * For more information, see [Creating and activating an agent](https://docs.aws.amazon.com/datasync/latest/userguide/activating-agent.html) in the *AWS DataSync User Guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-activationkey
     */
    public activationKey: string;

    /**
     * The name you configured for your agent. This value is a text reference that is used to identify the agent in the console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-agentname
     */
    public agentName: string | undefined;

    /**
     * The Amazon Resource Names (ARNs) of the security groups used to protect your data transfer task subnets. See [SecurityGroupArns](https://docs.aws.amazon.com/datasync/latest/userguide/API_Ec2Config.html#DataSync-Type-Ec2Config-SecurityGroupArns) .
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-securitygrouparns
     */
    public securityGroupArns: string[] | undefined;

    /**
     * The Amazon Resource Names (ARNs) of the subnets in which DataSync will create elastic network interfaces for each data transfer task. The agent that runs a task must be private. When you start a task that is associated with an agent created in a VPC, or one that has access to an IP address in a VPC, then the task is also private. In this case, DataSync creates four network interfaces for each task in your subnet. For a data transfer to work, the agent must be able to route to all these four network interfaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-subnetarns
     */
    public subnetArns: string[] | undefined;

    /**
     * The key-value pair that represents the tag that you want to associate with the agent. The value can be an empty string. This value helps you manage, filter, and search for your agents.
     *
     * > Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ID of the virtual private cloud (VPC) endpoint that the agent has access to. This is the client-side VPC endpoint, powered by AWS PrivateLink . If you don't have an AWS PrivateLink VPC endpoint, see [AWS PrivateLink and VPC endpoints](https://docs.aws.amazon.com//vpc/latest/userguide/endpoint-services-overview.html) in the *Amazon VPC User Guide* .
     *
     * For more information about activating your agent in a private network based on a VPC, see [Using AWS DataSync in a Virtual Private Cloud](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-in-vpc.html) in the *AWS DataSync User Guide.*
     *
     * A VPC endpoint ID looks like this: `vpce-01234d5aff67890e1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-vpcendpointid
     */
    public vpcEndpointId: string | undefined;

    /**
     * Create a new `AWS::DataSync::Agent`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAgentProps) {
        super(scope, id, { type: CfnAgent.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'activationKey', this);
        this.attrAgentArn = cdk.Token.asString(this.getAtt('AgentArn', cdk.ResolutionTypeHint.STRING));
        this.attrEndpointType = cdk.Token.asString(this.getAtt('EndpointType', cdk.ResolutionTypeHint.STRING));

        this.activationKey = props.activationKey;
        this.agentName = props.agentName;
        this.securityGroupArns = props.securityGroupArns;
        this.subnetArns = props.subnetArns;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::Agent", props.tags, { tagPropertyName: 'tags' });
        this.vpcEndpointId = props.vpcEndpointId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAgent.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            activationKey: this.activationKey,
            agentName: this.agentName,
            securityGroupArns: this.securityGroupArns,
            subnetArns: this.subnetArns,
            tags: this.tags.renderTags(),
            vpcEndpointId: this.vpcEndpointId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAgentPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLocationEFS`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html
 */
export interface CfnLocationEFSProps {

    /**
     * Specifies the subnet and security groups DataSync uses to access your Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-ec2config
     */
    readonly ec2Config: CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable;

    /**
     * Specifies the Amazon Resource Name (ARN) of the access point that DataSync uses to access the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-accesspointarn
     */
    readonly accessPointArn?: string;

    /**
     * Specifies the ARN for the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-efsfilesystemarn
     */
    readonly efsFilesystemArn?: string;

    /**
     * Specifies an AWS Identity and Access Management (IAM) role that DataSync assumes when mounting the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-filesystemaccessrolearn
     */
    readonly fileSystemAccessRoleArn?: string;

    /**
     * Specifies whether you want DataSync to use Transport Layer Security (TLS) 1.2 encryption when it copies data to or from the Amazon EFS file system.
     *
     * If you specify an access point using `AccessPointArn` or an IAM role using `FileSystemAccessRoleArn` , you must set this parameter to `TLS1_2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-intransitencryption
     */
    readonly inTransitEncryption?: string;

    /**
     * Specifies a mount path for your Amazon EFS file system. This is where DataSync reads or writes data (depending on if this is a source or destination location). By default, DataSync uses the root directory, but you can also include subdirectories.
     *
     * > You must specify a value with forward slashes (for example, `/path/to/folder` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * Specifies the key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationEFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationEFSProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationEFSPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessPointArn', cdk.validateString)(properties.accessPointArn));
    errors.collect(cdk.propertyValidator('ec2Config', cdk.requiredValidator)(properties.ec2Config));
    errors.collect(cdk.propertyValidator('ec2Config', CfnLocationEFS_Ec2ConfigPropertyValidator)(properties.ec2Config));
    errors.collect(cdk.propertyValidator('efsFilesystemArn', cdk.validateString)(properties.efsFilesystemArn));
    errors.collect(cdk.propertyValidator('fileSystemAccessRoleArn', cdk.validateString)(properties.fileSystemAccessRoleArn));
    errors.collect(cdk.propertyValidator('inTransitEncryption', cdk.validateString)(properties.inTransitEncryption));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationEFSProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationEFS` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationEFSProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationEFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationEFSPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationEFSPropsValidator(properties).assertSuccess();
    return {
        Ec2Config: cfnLocationEFSEc2ConfigPropertyToCloudFormation(properties.ec2Config),
        AccessPointArn: cdk.stringToCloudFormation(properties.accessPointArn),
        EfsFilesystemArn: cdk.stringToCloudFormation(properties.efsFilesystemArn),
        FileSystemAccessRoleArn: cdk.stringToCloudFormation(properties.fileSystemAccessRoleArn),
        InTransitEncryption: cdk.stringToCloudFormation(properties.inTransitEncryption),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationEFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationEFSProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationEFSProps>();
    ret.addPropertyResult('ec2Config', 'Ec2Config', CfnLocationEFSEc2ConfigPropertyFromCloudFormation(properties.Ec2Config));
    ret.addPropertyResult('accessPointArn', 'AccessPointArn', properties.AccessPointArn != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointArn) : undefined);
    ret.addPropertyResult('efsFilesystemArn', 'EfsFilesystemArn', properties.EfsFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.EfsFilesystemArn) : undefined);
    ret.addPropertyResult('fileSystemAccessRoleArn', 'FileSystemAccessRoleArn', properties.FileSystemAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemAccessRoleArn) : undefined);
    ret.addPropertyResult('inTransitEncryption', 'InTransitEncryption', properties.InTransitEncryption != null ? cfn_parse.FromCloudFormation.getString(properties.InTransitEncryption) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationEFS`
 *
 * The `AWS::DataSync::LocationEFS` resource creates an endpoint for an Amazon EFS file system. AWS DataSync can access this endpoint as a source or destination location.
 *
 * @cloudformationResource AWS::DataSync::LocationEFS
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html
 */
export class CfnLocationEFS extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationEFS";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationEFS {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationEFSPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationEFS(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the Amazon EFS file system.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the Amazon EFS file system.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * Specifies the subnet and security groups DataSync uses to access your Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-ec2config
     */
    public ec2Config: CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable;

    /**
     * Specifies the Amazon Resource Name (ARN) of the access point that DataSync uses to access the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-accesspointarn
     */
    public accessPointArn: string | undefined;

    /**
     * Specifies the ARN for the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-efsfilesystemarn
     */
    public efsFilesystemArn: string | undefined;

    /**
     * Specifies an AWS Identity and Access Management (IAM) role that DataSync assumes when mounting the Amazon EFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-filesystemaccessrolearn
     */
    public fileSystemAccessRoleArn: string | undefined;

    /**
     * Specifies whether you want DataSync to use Transport Layer Security (TLS) 1.2 encryption when it copies data to or from the Amazon EFS file system.
     *
     * If you specify an access point using `AccessPointArn` or an IAM role using `FileSystemAccessRoleArn` , you must set this parameter to `TLS1_2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-intransitencryption
     */
    public inTransitEncryption: string | undefined;

    /**
     * Specifies a mount path for your Amazon EFS file system. This is where DataSync reads or writes data (depending on if this is a source or destination location). By default, DataSync uses the root directory, but you can also include subdirectories.
     *
     * > You must specify a value with forward slashes (for example, `/path/to/folder` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * Specifies the key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationEFS`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationEFSProps) {
        super(scope, id, { type: CfnLocationEFS.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'ec2Config', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.ec2Config = props.ec2Config;
        this.accessPointArn = props.accessPointArn;
        this.efsFilesystemArn = props.efsFilesystemArn;
        this.fileSystemAccessRoleArn = props.fileSystemAccessRoleArn;
        this.inTransitEncryption = props.inTransitEncryption;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationEFS", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationEFS.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ec2Config: this.ec2Config,
            accessPointArn: this.accessPointArn,
            efsFilesystemArn: this.efsFilesystemArn,
            fileSystemAccessRoleArn: this.fileSystemAccessRoleArn,
            inTransitEncryption: this.inTransitEncryption,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationEFSPropsToCloudFormation(props);
    }
}

export namespace CfnLocationEFS {
    /**
     * The subnet and security groups that AWS DataSync uses to access your Amazon EFS file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html
     */
    export interface Ec2ConfigProperty {
        /**
         * Specifies the Amazon Resource Names (ARNs) of the security groups associated with an Amazon EFS file system's mount target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html#cfn-datasync-locationefs-ec2config-securitygrouparns
         */
        readonly securityGroupArns: string[];
        /**
         * Specifies the ARN of a subnet where DataSync creates the [network interfaces](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-network.html#required-network-interfaces) for managing traffic during your transfer.
         *
         * The subnet must be located:
         *
         * - In the same virtual private cloud (VPC) as the Amazon EFS file system.
         * - In the same Availability Zone as at least one mount target for the Amazon EFS file system.
         *
         * > You don't need to specify a subnet that includes a file system mount target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html#cfn-datasync-locationefs-ec2config-subnetarn
         */
        readonly subnetArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `Ec2ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `Ec2ConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationEFS_Ec2ConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.requiredValidator)(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('subnetArn', cdk.requiredValidator)(properties.subnetArn));
    errors.collect(cdk.propertyValidator('subnetArn', cdk.validateString)(properties.subnetArn));
    return errors.wrap('supplied properties not correct for "Ec2ConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationEFS.Ec2Config` resource
 *
 * @param properties - the TypeScript properties of a `Ec2ConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationEFS.Ec2Config` resource.
 */
// @ts-ignore TS6133
function cfnLocationEFSEc2ConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationEFS_Ec2ConfigPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        SubnetArn: cdk.stringToCloudFormation(properties.subnetArn),
    };
}

// @ts-ignore TS6133
function CfnLocationEFSEc2ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationEFS.Ec2ConfigProperty>();
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns));
    ret.addPropertyResult('subnetArn', 'SubnetArn', cfn_parse.FromCloudFormation.getString(properties.SubnetArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationFSxLustre`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html
 */
export interface CfnLocationFSxLustreProps {

    /**
     * The ARNs of the security groups that are used to configure the FSx for Lustre file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-securitygrouparns
     */
    readonly securityGroupArns: string[];

    /**
     * The Amazon Resource Name (ARN) for the FSx for Lustre file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-fsxfilesystemarn
     */
    readonly fsxFilesystemArn?: string;

    /**
     * A subdirectory in the location's path. This subdirectory in the FSx for Lustre file system is used to read data from the FSx for Lustre source location or write data to the FSx for Lustre destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * The key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxLustreProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxLustreProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxLustrePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fsxFilesystemArn', cdk.validateString)(properties.fsxFilesystemArn));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.requiredValidator)(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationFSxLustreProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxLustre` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxLustreProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxLustre` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxLustrePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxLustrePropsValidator(properties).assertSuccess();
    return {
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        FsxFilesystemArn: cdk.stringToCloudFormation(properties.fsxFilesystemArn),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxLustrePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxLustreProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxLustreProps>();
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns));
    ret.addPropertyResult('fsxFilesystemArn', 'FsxFilesystemArn', properties.FsxFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationFSxLustre`
 *
 * The `AWS::DataSync::LocationFSxLustre` resource specifies an endpoint for an Amazon FSx for Lustre file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxLustre
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html
 */
export class CfnLocationFSxLustre extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationFSxLustre";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxLustre {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationFSxLustrePropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationFSxLustre(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the specified FSx for Lustre file system location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified FSx for Lustre file system location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The ARNs of the security groups that are used to configure the FSx for Lustre file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-securitygrouparns
     */
    public securityGroupArns: string[];

    /**
     * The Amazon Resource Name (ARN) for the FSx for Lustre file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-fsxfilesystemarn
     */
    public fsxFilesystemArn: string | undefined;

    /**
     * A subdirectory in the location's path. This subdirectory in the FSx for Lustre file system is used to read data from the FSx for Lustre source location or write data to the FSx for Lustre destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * The key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationFSxLustre`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxLustreProps) {
        super(scope, id, { type: CfnLocationFSxLustre.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'securityGroupArns', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.securityGroupArns = props.securityGroupArns;
        this.fsxFilesystemArn = props.fsxFilesystemArn;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxLustre", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxLustre.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            securityGroupArns: this.securityGroupArns,
            fsxFilesystemArn: this.fsxFilesystemArn,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationFSxLustrePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLocationFSxONTAP`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html
 */
export interface CfnLocationFSxONTAPProps {

    /**
     * Specifies the data transfer protocol that DataSync uses to access your Amazon FSx file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-protocol
     */
    readonly protocol: CfnLocationFSxONTAP.ProtocolProperty | cdk.IResolvable;

    /**
     * Specifies the Amazon Resource Names (ARNs) of the security groups that DataSync can use to access your FSx for ONTAP file system. You must configure the security groups to allow outbound traffic on the following ports (depending on the protocol that you're using):
     *
     * - *Network File System (NFS)* : TCP ports 111, 635, and 2049
     * - *Server Message Block (SMB)* : TCP port 445
     *
     * Your file system's security groups must also allow inbound traffic on the same port.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-securitygrouparns
     */
    readonly securityGroupArns: string[];

    /**
     * Specifies the ARN of the storage virtual machine (SVM) in your file system where you want to copy data to or from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-storagevirtualmachinearn
     */
    readonly storageVirtualMachineArn: string;

    /**
     * Specifies a path to the file share in the SVM where you'll copy your data.
     *
     * You can specify a junction path (also known as a mount point), qtree path (for NFS file shares), or share name (for SMB file shares). For example, your mount path might be `/vol1` , `/vol1/tree1` , or `/share1` .
     *
     * > Don't specify a junction path in the SVM's root volume. For more information, see [Managing FSx for ONTAP storage virtual machines](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) in the *Amazon FSx for NetApp ONTAP User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxONTAPProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxONTAPProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAPPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', CfnLocationFSxONTAP_ProtocolPropertyValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.requiredValidator)(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('storageVirtualMachineArn', cdk.requiredValidator)(properties.storageVirtualMachineArn));
    errors.collect(cdk.propertyValidator('storageVirtualMachineArn', cdk.validateString)(properties.storageVirtualMachineArn));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationFSxONTAPProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxONTAPProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAPPropsValidator(properties).assertSuccess();
    return {
        Protocol: cfnLocationFSxONTAPProtocolPropertyToCloudFormation(properties.protocol),
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        StorageVirtualMachineArn: cdk.stringToCloudFormation(properties.storageVirtualMachineArn),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAPProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAPProps>();
    ret.addPropertyResult('protocol', 'Protocol', CfnLocationFSxONTAPProtocolPropertyFromCloudFormation(properties.Protocol));
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns));
    ret.addPropertyResult('storageVirtualMachineArn', 'StorageVirtualMachineArn', cfn_parse.FromCloudFormation.getString(properties.StorageVirtualMachineArn));
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationFSxONTAP`
 *
 * The `AWS::DataSync::LocationFSxONTAP` resource creates an endpoint for an Amazon FSx for NetApp ONTAP file system. AWS DataSync can access this endpoint as a source or destination location.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxONTAP
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html
 */
export class CfnLocationFSxONTAP extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationFSxONTAP";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxONTAP {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationFSxONTAPPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationFSxONTAP(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the FSx for ONTAP file system in the specified location.
     * @cloudformationAttribute FsxFilesystemArn
     */
    public readonly attrFsxFilesystemArn: string;

    /**
     * The ARN of the specified location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * Specifies the data transfer protocol that DataSync uses to access your Amazon FSx file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-protocol
     */
    public protocol: CfnLocationFSxONTAP.ProtocolProperty | cdk.IResolvable;

    /**
     * Specifies the Amazon Resource Names (ARNs) of the security groups that DataSync can use to access your FSx for ONTAP file system. You must configure the security groups to allow outbound traffic on the following ports (depending on the protocol that you're using):
     *
     * - *Network File System (NFS)* : TCP ports 111, 635, and 2049
     * - *Server Message Block (SMB)* : TCP port 445
     *
     * Your file system's security groups must also allow inbound traffic on the same port.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-securitygrouparns
     */
    public securityGroupArns: string[];

    /**
     * Specifies the ARN of the storage virtual machine (SVM) in your file system where you want to copy data to or from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-storagevirtualmachinearn
     */
    public storageVirtualMachineArn: string;

    /**
     * Specifies a path to the file share in the SVM where you'll copy your data.
     *
     * You can specify a junction path (also known as a mount point), qtree path (for NFS file shares), or share name (for SMB file shares). For example, your mount path might be `/vol1` , `/vol1/tree1` , or `/share1` .
     *
     * > Don't specify a junction path in the SVM's root volume. For more information, see [Managing FSx for ONTAP storage virtual machines](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) in the *Amazon FSx for NetApp ONTAP User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationFSxONTAP`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxONTAPProps) {
        super(scope, id, { type: CfnLocationFSxONTAP.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'protocol', this);
        cdk.requireProperty(props, 'securityGroupArns', this);
        cdk.requireProperty(props, 'storageVirtualMachineArn', this);
        this.attrFsxFilesystemArn = cdk.Token.asString(this.getAtt('FsxFilesystemArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.protocol = props.protocol;
        this.securityGroupArns = props.securityGroupArns;
        this.storageVirtualMachineArn = props.storageVirtualMachineArn;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxONTAP", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxONTAP.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            protocol: this.protocol,
            securityGroupArns: this.securityGroupArns,
            storageVirtualMachineArn: this.storageVirtualMachineArn,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationFSxONTAPPropsToCloudFormation(props);
    }
}

export namespace CfnLocationFSxONTAP {
    /**
     * Specifies the Network File System (NFS) protocol configuration that AWS DataSync uses to access a storage virtual machine (SVM) on your Amazon FSx for NetApp ONTAP file system. For more information, see [Accessing FSx for ONTAP file systems](https://docs.aws.amazon.com/datasync/latest/userguide/create-ontap-location.html#create-ontap-location-access) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfs.html
     */
    export interface NFSProperty {
        /**
         * Specifies how DataSync can access a location using the NFS protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfs.html#cfn-datasync-locationfsxontap-nfs-mountoptions
         */
        readonly mountOptions: CfnLocationFSxONTAP.NfsMountOptionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NFSProperty`
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAP_NFSPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mountOptions', cdk.requiredValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('mountOptions', CfnLocationFSxONTAP_NfsMountOptionsPropertyValidator)(properties.mountOptions));
    return errors.wrap('supplied properties not correct for "NFSProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.NFS` resource
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.NFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPNFSPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAP_NFSPropertyValidator(properties).assertSuccess();
    return {
        MountOptions: cfnLocationFSxONTAPNfsMountOptionsPropertyToCloudFormation(properties.mountOptions),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPNFSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAP.NFSProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.NFSProperty>();
    ret.addPropertyResult('mountOptions', 'MountOptions', CfnLocationFSxONTAPNfsMountOptionsPropertyFromCloudFormation(properties.MountOptions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxONTAP {
    /**
     * Specifies how DataSync can access a location using the NFS protocol.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfsmountoptions.html
     */
    export interface NfsMountOptionsProperty {
        /**
         * Specifies the NFS version that you want DataSync to use when mounting your NFS share. If the server refuses to use the version specified, the task fails.
         *
         * You can specify the following options:
         *
         * - `AUTOMATIC` (default): DataSync chooses NFS version 4.1.
         * - `NFS3` : Stateless protocol version that allows for asynchronous writes on the server.
         * - `NFSv4_0` : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
         * - `NFSv4_1` : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. NFS version 4.1 also includes all features available in version 4.0.
         *
         * > DataSync currently only supports NFS version 3 with Amazon FSx for NetApp ONTAP locations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfsmountoptions.html#cfn-datasync-locationfsxontap-nfsmountoptions-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NfsMountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `NfsMountOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAP_NfsMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "NfsMountOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.NfsMountOptions` resource
 *
 * @param properties - the TypeScript properties of a `NfsMountOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.NfsMountOptions` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPNfsMountOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAP_NfsMountOptionsPropertyValidator(properties).assertSuccess();
    return {
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPNfsMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAP.NfsMountOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.NfsMountOptionsProperty>();
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxONTAP {
    /**
     * Specifies the data transfer protocol that AWS DataSync uses to access your Amazon FSx file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html
     */
    export interface ProtocolProperty {
        /**
         * Specifies the Network File System (NFS) protocol configuration that DataSync uses to access your FSx for ONTAP file system's storage virtual machine (SVM).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html#cfn-datasync-locationfsxontap-protocol-nfs
         */
        readonly nfs?: CfnLocationFSxONTAP.NFSProperty | cdk.IResolvable;
        /**
         * Specifies the Server Message Block (SMB) protocol configuration that DataSync uses to access your FSx for ONTAP file system's SVM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html#cfn-datasync-locationfsxontap-protocol-smb
         */
        readonly smb?: CfnLocationFSxONTAP.SMBProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ProtocolProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAP_ProtocolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nfs', CfnLocationFSxONTAP_NFSPropertyValidator)(properties.nfs));
    errors.collect(cdk.propertyValidator('smb', CfnLocationFSxONTAP_SMBPropertyValidator)(properties.smb));
    return errors.wrap('supplied properties not correct for "ProtocolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.Protocol` resource
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.Protocol` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPProtocolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAP_ProtocolPropertyValidator(properties).assertSuccess();
    return {
        NFS: cfnLocationFSxONTAPNFSPropertyToCloudFormation(properties.nfs),
        SMB: cfnLocationFSxONTAPSMBPropertyToCloudFormation(properties.smb),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPProtocolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAP.ProtocolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.ProtocolProperty>();
    ret.addPropertyResult('nfs', 'NFS', properties.NFS != null ? CfnLocationFSxONTAPNFSPropertyFromCloudFormation(properties.NFS) : undefined);
    ret.addPropertyResult('smb', 'SMB', properties.SMB != null ? CfnLocationFSxONTAPSMBPropertyFromCloudFormation(properties.SMB) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxONTAP {
    /**
     * Specifies the Server Message Block (SMB) protocol configuration that AWS DataSync uses to access a storage virtual machine (SVM) on your Amazon FSx for NetApp ONTAP file system. For more information, see [Accessing FSx for ONTAP file systems](https://docs.aws.amazon.com/datasync/latest/userguide/create-ontap-location.html#create-ontap-location-access) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html
     */
    export interface SMBProperty {
        /**
         * Specifies the fully qualified domain name (FQDN) of the Microsoft Active Directory that your storage virtual machine (SVM) belongs to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-domain
         */
        readonly domain?: string;
        /**
         * Specifies how DataSync can access a location using the SMB protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-mountoptions
         */
        readonly mountOptions: CfnLocationFSxONTAP.SmbMountOptionsProperty | cdk.IResolvable;
        /**
         * Specifies the password of a user who has permission to access your SVM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-password
         */
        readonly password: string;
        /**
         * Specifies a user name that can mount the location and access the files, folders, and metadata that you need in the SVM.
         *
         * If you provide a user in your Active Directory, note the following:
         *
         * - If you're using AWS Directory Service for Microsoft Active Directory , the user must be a member of the AWS Delegated FSx Administrators group.
         * - If you're using a self-managed Active Directory, the user must be a member of either the Domain Admins group or a custom group that you specified for file system administration when you created your file system.
         *
         * Make sure that the user has the permissions it needs to copy the data you want:
         *
         * - `SE_TCB_NAME` : Required to set object ownership and file metadata. With this privilege, you also can copy NTFS discretionary access lists (DACLs).
         * - `SE_SECURITY_NAME` : May be needed to copy NTFS system access control lists (SACLs). This operation specifically requires the Windows privilege, which is granted to members of the Domain Admins group. If you configure your task to copy SACLs, make sure that the user has the required privileges. For information about copying SACLs, see [Ownership and permissions-related options](https://docs.aws.amazon.com/datasync/latest/userguide/create-task.html#configure-ownership-and-permissions) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-user
         */
        readonly user: string;
    }
}

/**
 * Determine whether the given properties match those of a `SMBProperty`
 *
 * @param properties - the TypeScript properties of a `SMBProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAP_SMBPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('mountOptions', cdk.requiredValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('mountOptions', CfnLocationFSxONTAP_SmbMountOptionsPropertyValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('password', cdk.requiredValidator)(properties.password));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('user', cdk.requiredValidator)(properties.user));
    errors.collect(cdk.propertyValidator('user', cdk.validateString)(properties.user));
    return errors.wrap('supplied properties not correct for "SMBProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.SMB` resource
 *
 * @param properties - the TypeScript properties of a `SMBProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.SMB` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPSMBPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAP_SMBPropertyValidator(properties).assertSuccess();
    return {
        Domain: cdk.stringToCloudFormation(properties.domain),
        MountOptions: cfnLocationFSxONTAPSmbMountOptionsPropertyToCloudFormation(properties.mountOptions),
        Password: cdk.stringToCloudFormation(properties.password),
        User: cdk.stringToCloudFormation(properties.user),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPSMBPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAP.SMBProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.SMBProperty>();
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addPropertyResult('mountOptions', 'MountOptions', CfnLocationFSxONTAPSmbMountOptionsPropertyFromCloudFormation(properties.MountOptions));
    ret.addPropertyResult('password', 'Password', cfn_parse.FromCloudFormation.getString(properties.Password));
    ret.addPropertyResult('user', 'User', cfn_parse.FromCloudFormation.getString(properties.User));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxONTAP {
    /**
     * Specifies the version of the Server Message Block (SMB) protocol that AWS DataSync uses to access an SMB file server.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smbmountoptions.html
     */
    export interface SmbMountOptionsProperty {
        /**
         * By default, DataSync automatically chooses an SMB protocol version based on negotiation with your SMB file server. You also can configure DataSync to use a specific SMB version, but we recommend doing this only if DataSync has trouble negotiating with the SMB file server automatically.
         *
         * These are the following options for configuring the SMB version:
         *
         * - `AUTOMATIC` (default): DataSync and the SMB file server negotiate a protocol version that they mutually support. (DataSync supports SMB versions 2.1.0 and later.)
         *
         * This is the recommended option. If you instead choose a specific version that your file server doesn't support, you may get an `Operation Not Supported` error.
         * - `SMB3` : Restricts the protocol negotiation to only SMB version 3.0.2.
         * - `SMB2` : Restricts the protocol negotiation to only SMB version 2.1.0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smbmountoptions.html#cfn-datasync-locationfsxontap-smbmountoptions-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SmbMountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SmbMountOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxONTAP_SmbMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "SmbMountOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.SmbMountOptions` resource
 *
 * @param properties - the TypeScript properties of a `SmbMountOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxONTAP.SmbMountOptions` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxONTAPSmbMountOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxONTAP_SmbMountOptionsPropertyValidator(properties).assertSuccess();
    return {
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPSmbMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAP.SmbMountOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.SmbMountOptionsProperty>();
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationFSxOpenZFS`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html
 */
export interface CfnLocationFSxOpenZFSProps {

    /**
     * The Amazon Resource Name (ARN) of the FSx for OpenZFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-fsxfilesystemarn
     */
    readonly fsxFilesystemArn: string;

    /**
     * The type of protocol that AWS DataSync uses to access your file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-protocol
     */
    readonly protocol: CfnLocationFSxOpenZFS.ProtocolProperty | cdk.IResolvable;

    /**
     * The ARNs of the security groups that are used to configure the FSx for OpenZFS file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-securitygrouparns
     */
    readonly securityGroupArns: string[];

    /**
     * A subdirectory in the location's path that must begin with `/fsx` . DataSync uses this subdirectory to read or write data (depending on whether the file system is a source or destination location).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * The key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxOpenZFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxOpenZFSProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxOpenZFSPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fsxFilesystemArn', cdk.requiredValidator)(properties.fsxFilesystemArn));
    errors.collect(cdk.propertyValidator('fsxFilesystemArn', cdk.validateString)(properties.fsxFilesystemArn));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', CfnLocationFSxOpenZFS_ProtocolPropertyValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.requiredValidator)(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationFSxOpenZFSProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxOpenZFSProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxOpenZFSPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxOpenZFSPropsValidator(properties).assertSuccess();
    return {
        FsxFilesystemArn: cdk.stringToCloudFormation(properties.fsxFilesystemArn),
        Protocol: cfnLocationFSxOpenZFSProtocolPropertyToCloudFormation(properties.protocol),
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxOpenZFSProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFSProps>();
    ret.addPropertyResult('fsxFilesystemArn', 'FsxFilesystemArn', cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn));
    ret.addPropertyResult('protocol', 'Protocol', CfnLocationFSxOpenZFSProtocolPropertyFromCloudFormation(properties.Protocol));
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns));
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationFSxOpenZFS`
 *
 * The `AWS::DataSync::LocationFSxOpenZFS` resource specifies an endpoint for an Amazon FSx for OpenZFS file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxOpenZFS
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html
 */
export class CfnLocationFSxOpenZFS extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationFSxOpenZFS";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxOpenZFS {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationFSxOpenZFSPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationFSxOpenZFS(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the specified FSx for OpenZFS file system location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified FSx for OpenZFS file system location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The Amazon Resource Name (ARN) of the FSx for OpenZFS file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-fsxfilesystemarn
     */
    public fsxFilesystemArn: string;

    /**
     * The type of protocol that AWS DataSync uses to access your file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-protocol
     */
    public protocol: CfnLocationFSxOpenZFS.ProtocolProperty | cdk.IResolvable;

    /**
     * The ARNs of the security groups that are used to configure the FSx for OpenZFS file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-securitygrouparns
     */
    public securityGroupArns: string[];

    /**
     * A subdirectory in the location's path that must begin with `/fsx` . DataSync uses this subdirectory to read or write data (depending on whether the file system is a source or destination location).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * The key-value pair that represents a tag that you want to add to the resource. The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationFSxOpenZFS`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxOpenZFSProps) {
        super(scope, id, { type: CfnLocationFSxOpenZFS.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'fsxFilesystemArn', this);
        cdk.requireProperty(props, 'protocol', this);
        cdk.requireProperty(props, 'securityGroupArns', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.fsxFilesystemArn = props.fsxFilesystemArn;
        this.protocol = props.protocol;
        this.securityGroupArns = props.securityGroupArns;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxOpenZFS", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxOpenZFS.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            fsxFilesystemArn: this.fsxFilesystemArn,
            protocol: this.protocol,
            securityGroupArns: this.securityGroupArns,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationFSxOpenZFSPropsToCloudFormation(props);
    }
}

export namespace CfnLocationFSxOpenZFS {
    /**
     * Represents the mount options that are available for DataSync to access a Network File System (NFS) location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-mountoptions.html
     */
    export interface MountOptionsProperty {
        /**
         * The specific NFS version that you want DataSync to use to mount your NFS share. If the server refuses to use the version specified, the sync will fail. If you don't specify a version, DataSync defaults to `AUTOMATIC` . That is, DataSync automatically selects a version based on negotiation with the NFS server.
         *
         * You can specify the following NFS versions:
         *
         * - *[NFSv3](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc1813)* : Stateless protocol version that allows for asynchronous writes on the server.
         * - *[NFSv4.0](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3530)* : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
         * - *[NFSv4.1](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc5661)* : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. Version 4.1 also includes all features available in version 4.0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-mountoptions.html#cfn-datasync-locationfsxopenzfs-mountoptions-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxOpenZFS_MountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "MountOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.MountOptions` resource
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.MountOptions` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxOpenZFSMountOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxOpenZFS_MountOptionsPropertyValidator(properties).assertSuccess();
    return {
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxOpenZFS.MountOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.MountOptionsProperty>();
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxOpenZFS {
    /**
     * Represents the Network File System (NFS) protocol that AWS DataSync uses to access your Amazon FSx for OpenZFS file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-nfs.html
     */
    export interface NFSProperty {
        /**
         * Represents the mount options that are available for DataSync to access an NFS location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-nfs.html#cfn-datasync-locationfsxopenzfs-nfs-mountoptions
         */
        readonly mountOptions: CfnLocationFSxOpenZFS.MountOptionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NFSProperty`
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxOpenZFS_NFSPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mountOptions', cdk.requiredValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('mountOptions', CfnLocationFSxOpenZFS_MountOptionsPropertyValidator)(properties.mountOptions));
    return errors.wrap('supplied properties not correct for "NFSProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.NFS` resource
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.NFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxOpenZFSNFSPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxOpenZFS_NFSPropertyValidator(properties).assertSuccess();
    return {
        MountOptions: cfnLocationFSxOpenZFSMountOptionsPropertyToCloudFormation(properties.mountOptions),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSNFSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxOpenZFS.NFSProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.NFSProperty>();
    ret.addPropertyResult('mountOptions', 'MountOptions', CfnLocationFSxOpenZFSMountOptionsPropertyFromCloudFormation(properties.MountOptions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationFSxOpenZFS {
    /**
     * Represents the protocol that AWS DataSync uses to access your Amazon FSx for OpenZFS file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-protocol.html
     */
    export interface ProtocolProperty {
        /**
         * Represents the Network File System (NFS) protocol that DataSync uses to access your FSx for OpenZFS file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-protocol.html#cfn-datasync-locationfsxopenzfs-protocol-nfs
         */
        readonly nfs?: CfnLocationFSxOpenZFS.NFSProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ProtocolProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxOpenZFS_ProtocolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nfs', CfnLocationFSxOpenZFS_NFSPropertyValidator)(properties.nfs));
    return errors.wrap('supplied properties not correct for "ProtocolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.Protocol` resource
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxOpenZFS.Protocol` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxOpenZFSProtocolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxOpenZFS_ProtocolPropertyValidator(properties).assertSuccess();
    return {
        NFS: cfnLocationFSxOpenZFSNFSPropertyToCloudFormation(properties.nfs),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSProtocolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxOpenZFS.ProtocolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.ProtocolProperty>();
    ret.addPropertyResult('nfs', 'NFS', properties.NFS != null ? CfnLocationFSxOpenZFSNFSPropertyFromCloudFormation(properties.NFS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationFSxWindows`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html
 */
export interface CfnLocationFSxWindowsProps {

    /**
     * The Amazon Resource Names (ARNs) of the security groups that are used to configure the FSx for Windows File Server file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-securitygrouparns
     */
    readonly securityGroupArns: string[];

    /**
     * The user who has the permissions to access files and folders in the FSx for Windows File Server file system.
     *
     * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-fsx-location.html#FSxWuser) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-user
     */
    readonly user: string;

    /**
     * Specifies the name of the Windows domain that the FSx for Windows File Server belongs to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-domain
     */
    readonly domain?: string;

    /**
     * Specifies the Amazon Resource Name (ARN) for the FSx for Windows File Server file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-fsxfilesystemarn
     */
    readonly fsxFilesystemArn?: string;

    /**
     * Specifies the password of the user who has the permissions to access files and folders in the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-password
     */
    readonly password?: string;

    /**
     * Specifies a mount path for your file system using forward slashes. This is where DataSync reads or writes data (depending on if this is a source or destination location).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxWindowsProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxWindowsProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationFSxWindowsPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('fsxFilesystemArn', cdk.validateString)(properties.fsxFilesystemArn));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.requiredValidator)(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('securityGroupArns', cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('user', cdk.requiredValidator)(properties.user));
    errors.collect(cdk.propertyValidator('user', cdk.validateString)(properties.user));
    return errors.wrap('supplied properties not correct for "CfnLocationFSxWindowsProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxWindows` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxWindowsProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationFSxWindows` resource.
 */
// @ts-ignore TS6133
function cfnLocationFSxWindowsPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationFSxWindowsPropsValidator(properties).assertSuccess();
    return {
        SecurityGroupArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
        User: cdk.stringToCloudFormation(properties.user),
        Domain: cdk.stringToCloudFormation(properties.domain),
        FsxFilesystemArn: cdk.stringToCloudFormation(properties.fsxFilesystemArn),
        Password: cdk.stringToCloudFormation(properties.password),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationFSxWindowsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxWindowsProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxWindowsProps>();
    ret.addPropertyResult('securityGroupArns', 'SecurityGroupArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupArns));
    ret.addPropertyResult('user', 'User', cfn_parse.FromCloudFormation.getString(properties.User));
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addPropertyResult('fsxFilesystemArn', 'FsxFilesystemArn', properties.FsxFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationFSxWindows`
 *
 * The `AWS::DataSync::LocationFSxWindows` resource specifies an endpoint for an Amazon FSx for Windows Server file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxWindows
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html
 */
export class CfnLocationFSxWindows extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationFSxWindows";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxWindows {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationFSxWindowsPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationFSxWindows(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the specified FSx for Windows Server file system location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified FSx for Windows Server file system location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The Amazon Resource Names (ARNs) of the security groups that are used to configure the FSx for Windows File Server file system.
     *
     * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
     *
     * *Length constraints* : Maximum length of 128.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-securitygrouparns
     */
    public securityGroupArns: string[];

    /**
     * The user who has the permissions to access files and folders in the FSx for Windows File Server file system.
     *
     * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-fsx-location.html#FSxWuser) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-user
     */
    public user: string;

    /**
     * Specifies the name of the Windows domain that the FSx for Windows File Server belongs to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-domain
     */
    public domain: string | undefined;

    /**
     * Specifies the Amazon Resource Name (ARN) for the FSx for Windows File Server file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-fsxfilesystemarn
     */
    public fsxFilesystemArn: string | undefined;

    /**
     * Specifies the password of the user who has the permissions to access files and folders in the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-password
     */
    public password: string | undefined;

    /**
     * Specifies a mount path for your file system using forward slashes. This is where DataSync reads or writes data (depending on if this is a source or destination location).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationFSxWindows`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxWindowsProps) {
        super(scope, id, { type: CfnLocationFSxWindows.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'securityGroupArns', this);
        cdk.requireProperty(props, 'user', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.securityGroupArns = props.securityGroupArns;
        this.user = props.user;
        this.domain = props.domain;
        this.fsxFilesystemArn = props.fsxFilesystemArn;
        this.password = props.password;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxWindows", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxWindows.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            securityGroupArns: this.securityGroupArns,
            user: this.user,
            domain: this.domain,
            fsxFilesystemArn: this.fsxFilesystemArn,
            password: this.password,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationFSxWindowsPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLocationHDFS`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html
 */
export interface CfnLocationHDFSProps {

    /**
     * The Amazon Resource Names (ARNs) of the agents that are used to connect to the HDFS cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-agentarns
     */
    readonly agentArns: string[];

    /**
     * `AWS::DataSync::LocationHDFS.AuthenticationType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-authenticationtype
     */
    readonly authenticationType: string;

    /**
     * The NameNode that manages the HDFS namespace. The NameNode performs operations such as opening, closing, and renaming files and directories. The NameNode contains the information to map blocks of data to the DataNodes. You can use only one NameNode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-namenodes
     */
    readonly nameNodes: Array<CfnLocationHDFS.NameNodeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The size of data blocks to write into the HDFS cluster. The block size must be a multiple of 512 bytes. The default block size is 128 mebibytes (MiB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-blocksize
     */
    readonly blockSize?: number;

    /**
     * The Kerberos key table (keytab) that contains mappings between the defined Kerberos principal and the encrypted keys. Provide the base64-encoded file text. If `KERBEROS` is specified for `AuthType` , this value is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskeytab
     */
    readonly kerberosKeytab?: string;

    /**
     * The `krb5.conf` file that contains the Kerberos configuration information. You can load the `krb5.conf` by providing a string of the file's contents or an Amazon S3 presigned URL of the file. If `KERBEROS` is specified for `AuthType` , this value is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskrb5conf
     */
    readonly kerberosKrb5Conf?: string;

    /**
     * The Kerberos principal with access to the files and folders on the HDFS cluster.
     *
     * > If `KERBEROS` is specified for `AuthenticationType` , this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberosprincipal
     */
    readonly kerberosPrincipal?: string;

    /**
     * The URI of the HDFS cluster's Key Management Server (KMS).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kmskeyprovideruri
     */
    readonly kmsKeyProviderUri?: string;

    /**
     * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer protection settings configured on the Hadoop Distributed File System (HDFS) cluster. If `QopConfiguration` isn't specified, `RpcProtection` and `DataTransferProtection` default to `PRIVACY` . If you set `RpcProtection` or `DataTransferProtection` , the other parameter assumes the same value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-qopconfiguration
     */
    readonly qopConfiguration?: CfnLocationHDFS.QopConfigurationProperty | cdk.IResolvable;

    /**
     * The number of DataNodes to replicate the data to when writing to the HDFS cluster. By default, data is replicated to three DataNodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-replicationfactor
     */
    readonly replicationFactor?: number;

    /**
     * The user name used to identify the client on the host operating system.
     *
     * > If `SIMPLE` is specified for `AuthenticationType` , this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-simpleuser
     */
    readonly simpleUser?: string;

    /**
     * A subdirectory in the HDFS cluster. This subdirectory is used to read data from or write data to the HDFS cluster. If the subdirectory isn't specified, it will default to `/` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationHDFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationHDFSProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationHDFSPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentArns', cdk.requiredValidator)(properties.agentArns));
    errors.collect(cdk.propertyValidator('agentArns', cdk.listValidator(cdk.validateString))(properties.agentArns));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.requiredValidator)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.validateString)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('blockSize', cdk.validateNumber)(properties.blockSize));
    errors.collect(cdk.propertyValidator('kerberosKeytab', cdk.validateString)(properties.kerberosKeytab));
    errors.collect(cdk.propertyValidator('kerberosKrb5Conf', cdk.validateString)(properties.kerberosKrb5Conf));
    errors.collect(cdk.propertyValidator('kerberosPrincipal', cdk.validateString)(properties.kerberosPrincipal));
    errors.collect(cdk.propertyValidator('kmsKeyProviderUri', cdk.validateString)(properties.kmsKeyProviderUri));
    errors.collect(cdk.propertyValidator('nameNodes', cdk.requiredValidator)(properties.nameNodes));
    errors.collect(cdk.propertyValidator('nameNodes', cdk.listValidator(CfnLocationHDFS_NameNodePropertyValidator))(properties.nameNodes));
    errors.collect(cdk.propertyValidator('qopConfiguration', CfnLocationHDFS_QopConfigurationPropertyValidator)(properties.qopConfiguration));
    errors.collect(cdk.propertyValidator('replicationFactor', cdk.validateNumber)(properties.replicationFactor));
    errors.collect(cdk.propertyValidator('simpleUser', cdk.validateString)(properties.simpleUser));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationHDFSProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationHDFSProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationHDFSPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationHDFSPropsValidator(properties).assertSuccess();
    return {
        AgentArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
        AuthenticationType: cdk.stringToCloudFormation(properties.authenticationType),
        NameNodes: cdk.listMapper(cfnLocationHDFSNameNodePropertyToCloudFormation)(properties.nameNodes),
        BlockSize: cdk.numberToCloudFormation(properties.blockSize),
        KerberosKeytab: cdk.stringToCloudFormation(properties.kerberosKeytab),
        KerberosKrb5Conf: cdk.stringToCloudFormation(properties.kerberosKrb5Conf),
        KerberosPrincipal: cdk.stringToCloudFormation(properties.kerberosPrincipal),
        KmsKeyProviderUri: cdk.stringToCloudFormation(properties.kmsKeyProviderUri),
        QopConfiguration: cfnLocationHDFSQopConfigurationPropertyToCloudFormation(properties.qopConfiguration),
        ReplicationFactor: cdk.numberToCloudFormation(properties.replicationFactor),
        SimpleUser: cdk.stringToCloudFormation(properties.simpleUser),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationHDFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationHDFSProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFSProps>();
    ret.addPropertyResult('agentArns', 'AgentArns', cfn_parse.FromCloudFormation.getStringArray(properties.AgentArns));
    ret.addPropertyResult('authenticationType', 'AuthenticationType', cfn_parse.FromCloudFormation.getString(properties.AuthenticationType));
    ret.addPropertyResult('nameNodes', 'NameNodes', cfn_parse.FromCloudFormation.getArray(CfnLocationHDFSNameNodePropertyFromCloudFormation)(properties.NameNodes));
    ret.addPropertyResult('blockSize', 'BlockSize', properties.BlockSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockSize) : undefined);
    ret.addPropertyResult('kerberosKeytab', 'KerberosKeytab', properties.KerberosKeytab != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosKeytab) : undefined);
    ret.addPropertyResult('kerberosKrb5Conf', 'KerberosKrb5Conf', properties.KerberosKrb5Conf != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosKrb5Conf) : undefined);
    ret.addPropertyResult('kerberosPrincipal', 'KerberosPrincipal', properties.KerberosPrincipal != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosPrincipal) : undefined);
    ret.addPropertyResult('kmsKeyProviderUri', 'KmsKeyProviderUri', properties.KmsKeyProviderUri != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyProviderUri) : undefined);
    ret.addPropertyResult('qopConfiguration', 'QopConfiguration', properties.QopConfiguration != null ? CfnLocationHDFSQopConfigurationPropertyFromCloudFormation(properties.QopConfiguration) : undefined);
    ret.addPropertyResult('replicationFactor', 'ReplicationFactor', properties.ReplicationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicationFactor) : undefined);
    ret.addPropertyResult('simpleUser', 'SimpleUser', properties.SimpleUser != null ? cfn_parse.FromCloudFormation.getString(properties.SimpleUser) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationHDFS`
 *
 * The `AWS::DataSync::LocationHDFS` resource specifies an endpoint for a Hadoop Distributed File System (HDFS).
 *
 * @cloudformationResource AWS::DataSync::LocationHDFS
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html
 */
export class CfnLocationHDFS extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationHDFS";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationHDFS {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationHDFSPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationHDFS(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the HDFS cluster location to describe.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the HDFS cluster location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The Amazon Resource Names (ARNs) of the agents that are used to connect to the HDFS cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-agentarns
     */
    public agentArns: string[];

    /**
     * `AWS::DataSync::LocationHDFS.AuthenticationType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-authenticationtype
     */
    public authenticationType: string;

    /**
     * The NameNode that manages the HDFS namespace. The NameNode performs operations such as opening, closing, and renaming files and directories. The NameNode contains the information to map blocks of data to the DataNodes. You can use only one NameNode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-namenodes
     */
    public nameNodes: Array<CfnLocationHDFS.NameNodeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The size of data blocks to write into the HDFS cluster. The block size must be a multiple of 512 bytes. The default block size is 128 mebibytes (MiB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-blocksize
     */
    public blockSize: number | undefined;

    /**
     * The Kerberos key table (keytab) that contains mappings between the defined Kerberos principal and the encrypted keys. Provide the base64-encoded file text. If `KERBEROS` is specified for `AuthType` , this value is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskeytab
     */
    public kerberosKeytab: string | undefined;

    /**
     * The `krb5.conf` file that contains the Kerberos configuration information. You can load the `krb5.conf` by providing a string of the file's contents or an Amazon S3 presigned URL of the file. If `KERBEROS` is specified for `AuthType` , this value is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskrb5conf
     */
    public kerberosKrb5Conf: string | undefined;

    /**
     * The Kerberos principal with access to the files and folders on the HDFS cluster.
     *
     * > If `KERBEROS` is specified for `AuthenticationType` , this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberosprincipal
     */
    public kerberosPrincipal: string | undefined;

    /**
     * The URI of the HDFS cluster's Key Management Server (KMS).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kmskeyprovideruri
     */
    public kmsKeyProviderUri: string | undefined;

    /**
     * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer protection settings configured on the Hadoop Distributed File System (HDFS) cluster. If `QopConfiguration` isn't specified, `RpcProtection` and `DataTransferProtection` default to `PRIVACY` . If you set `RpcProtection` or `DataTransferProtection` , the other parameter assumes the same value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-qopconfiguration
     */
    public qopConfiguration: CfnLocationHDFS.QopConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The number of DataNodes to replicate the data to when writing to the HDFS cluster. By default, data is replicated to three DataNodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-replicationfactor
     */
    public replicationFactor: number | undefined;

    /**
     * The user name used to identify the client on the host operating system.
     *
     * > If `SIMPLE` is specified for `AuthenticationType` , this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-simpleuser
     */
    public simpleUser: string | undefined;

    /**
     * A subdirectory in the HDFS cluster. This subdirectory is used to read data from or write data to the HDFS cluster. If the subdirectory isn't specified, it will default to `/` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationHDFS`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationHDFSProps) {
        super(scope, id, { type: CfnLocationHDFS.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'agentArns', this);
        cdk.requireProperty(props, 'authenticationType', this);
        cdk.requireProperty(props, 'nameNodes', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.agentArns = props.agentArns;
        this.authenticationType = props.authenticationType;
        this.nameNodes = props.nameNodes;
        this.blockSize = props.blockSize;
        this.kerberosKeytab = props.kerberosKeytab;
        this.kerberosKrb5Conf = props.kerberosKrb5Conf;
        this.kerberosPrincipal = props.kerberosPrincipal;
        this.kmsKeyProviderUri = props.kmsKeyProviderUri;
        this.qopConfiguration = props.qopConfiguration;
        this.replicationFactor = props.replicationFactor;
        this.simpleUser = props.simpleUser;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationHDFS", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationHDFS.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            agentArns: this.agentArns,
            authenticationType: this.authenticationType,
            nameNodes: this.nameNodes,
            blockSize: this.blockSize,
            kerberosKeytab: this.kerberosKeytab,
            kerberosKrb5Conf: this.kerberosKrb5Conf,
            kerberosPrincipal: this.kerberosPrincipal,
            kmsKeyProviderUri: this.kmsKeyProviderUri,
            qopConfiguration: this.qopConfiguration,
            replicationFactor: this.replicationFactor,
            simpleUser: this.simpleUser,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationHDFSPropsToCloudFormation(props);
    }
}

export namespace CfnLocationHDFS {
    /**
     * The NameNode of the Hadoop Distributed File System (HDFS). The NameNode manages the file system's namespace and performs operations such as opening, closing, and renaming files and directories. The NameNode also contains the information to map blocks of data to the DataNodes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html
     */
    export interface NameNodeProperty {
        /**
         * The hostname of the NameNode in the HDFS cluster. This value is the IP address or Domain Name Service (DNS) name of the NameNode. An agent that's installed on-premises uses this hostname to communicate with the NameNode in the network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html#cfn-datasync-locationhdfs-namenode-hostname
         */
        readonly hostname: string;
        /**
         * The port that the NameNode uses to listen to client requests.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html#cfn-datasync-locationhdfs-namenode-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `NameNodeProperty`
 *
 * @param properties - the TypeScript properties of a `NameNodeProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationHDFS_NameNodePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostname', cdk.requiredValidator)(properties.hostname));
    errors.collect(cdk.propertyValidator('hostname', cdk.validateString)(properties.hostname));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "NameNodeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS.NameNode` resource
 *
 * @param properties - the TypeScript properties of a `NameNodeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS.NameNode` resource.
 */
// @ts-ignore TS6133
function cfnLocationHDFSNameNodePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationHDFS_NameNodePropertyValidator(properties).assertSuccess();
    return {
        Hostname: cdk.stringToCloudFormation(properties.hostname),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnLocationHDFSNameNodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationHDFS.NameNodeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFS.NameNodeProperty>();
    ret.addPropertyResult('hostname', 'Hostname', cfn_parse.FromCloudFormation.getString(properties.Hostname));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationHDFS {
    /**
     * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer privacy settings configured on the Hadoop Distributed File System (HDFS) cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html
     */
    export interface QopConfigurationProperty {
        /**
         * The data transfer protection setting configured on the HDFS cluster. This setting corresponds to your `dfs.data.transfer.protection` setting in the `hdfs-site.xml` file on your Hadoop cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html#cfn-datasync-locationhdfs-qopconfiguration-datatransferprotection
         */
        readonly dataTransferProtection?: string;
        /**
         * The Remote Procedure Call (RPC) protection setting configured on the HDFS cluster. This setting corresponds to your `hadoop.rpc.protection` setting in your `core-site.xml` file on your Hadoop cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html#cfn-datasync-locationhdfs-qopconfiguration-rpcprotection
         */
        readonly rpcProtection?: string;
    }
}

/**
 * Determine whether the given properties match those of a `QopConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `QopConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationHDFS_QopConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataTransferProtection', cdk.validateString)(properties.dataTransferProtection));
    errors.collect(cdk.propertyValidator('rpcProtection', cdk.validateString)(properties.rpcProtection));
    return errors.wrap('supplied properties not correct for "QopConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS.QopConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `QopConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationHDFS.QopConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLocationHDFSQopConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationHDFS_QopConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DataTransferProtection: cdk.stringToCloudFormation(properties.dataTransferProtection),
        RpcProtection: cdk.stringToCloudFormation(properties.rpcProtection),
    };
}

// @ts-ignore TS6133
function CfnLocationHDFSQopConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationHDFS.QopConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFS.QopConfigurationProperty>();
    ret.addPropertyResult('dataTransferProtection', 'DataTransferProtection', properties.DataTransferProtection != null ? cfn_parse.FromCloudFormation.getString(properties.DataTransferProtection) : undefined);
    ret.addPropertyResult('rpcProtection', 'RpcProtection', properties.RpcProtection != null ? cfn_parse.FromCloudFormation.getString(properties.RpcProtection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationNFS`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html
 */
export interface CfnLocationNFSProps {

    /**
     * Contains a list of Amazon Resource Names (ARNs) of agents that are used to connect to an NFS server.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-onpremconfig
     */
    readonly onPremConfig: CfnLocationNFS.OnPremConfigProperty | cdk.IResolvable;

    /**
     * The NFS mount options that DataSync can use to mount your NFS share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-mountoptions
     */
    readonly mountOptions?: CfnLocationNFS.MountOptionsProperty | cdk.IResolvable;

    /**
     * The name of the NFS server. This value is the IP address or Domain Name Service (DNS) name of the NFS server. An agent that is installed on-premises uses this hostname to mount the NFS server in a network.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * > This name must either be DNS-compliant or must be an IP version 4 (IPv4) address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-serverhostname
     */
    readonly serverHostname?: string;

    /**
     * The subdirectory in the NFS file system that is used to read data from the NFS source location or write data to the NFS destination. The NFS path should be a path that's exported by the NFS server, or a subdirectory of that path. The path should be such that it can be mounted by other NFS clients in your network.
     *
     * To see all the paths exported by your NFS server, run " `showmount -e nfs-server-name` " from an NFS client that has access to your server. You can specify any directory that appears in the results, and any subdirectory of that directory. Ensure that the NFS export is accessible without Kerberos authentication.
     *
     * To transfer all the data in the folder you specified, DataSync needs to have permissions to read all the data. To ensure this, either configure the NFS export with `no_root_squash,` or ensure that the permissions for all of the files that you want DataSync allow read access for all users. Doing either enables the agent to read the files. For the agent to access directories, you must additionally enable all execute access.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * For information about NFS export configuration, see [18.7. The /etc/exports Configuration File](https://docs.aws.amazon.com/http://web.mit.edu/rhel-doc/5/RHEL-5-manual/Deployment_Guide-en-US/s1-nfs-server-config-exports.html) in the Red Hat Enterprise Linux documentation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationNFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationNFSProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationNFSPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mountOptions', CfnLocationNFS_MountOptionsPropertyValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('onPremConfig', cdk.requiredValidator)(properties.onPremConfig));
    errors.collect(cdk.propertyValidator('onPremConfig', CfnLocationNFS_OnPremConfigPropertyValidator)(properties.onPremConfig));
    errors.collect(cdk.propertyValidator('serverHostname', cdk.validateString)(properties.serverHostname));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationNFSProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationNFSProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS` resource.
 */
// @ts-ignore TS6133
function cfnLocationNFSPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationNFSPropsValidator(properties).assertSuccess();
    return {
        OnPremConfig: cfnLocationNFSOnPremConfigPropertyToCloudFormation(properties.onPremConfig),
        MountOptions: cfnLocationNFSMountOptionsPropertyToCloudFormation(properties.mountOptions),
        ServerHostname: cdk.stringToCloudFormation(properties.serverHostname),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationNFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationNFSProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFSProps>();
    ret.addPropertyResult('onPremConfig', 'OnPremConfig', CfnLocationNFSOnPremConfigPropertyFromCloudFormation(properties.OnPremConfig));
    ret.addPropertyResult('mountOptions', 'MountOptions', properties.MountOptions != null ? CfnLocationNFSMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined);
    ret.addPropertyResult('serverHostname', 'ServerHostname', properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationNFS`
 *
 * The `AWS::DataSync::LocationNFS` resource specifies a file system on a Network File System (NFS) server that can be read from or written to.
 *
 * @cloudformationResource AWS::DataSync::LocationNFS
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html
 */
export class CfnLocationNFS extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationNFS";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationNFS {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationNFSPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationNFS(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the specified source NFS file system location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified source NFS location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * Contains a list of Amazon Resource Names (ARNs) of agents that are used to connect to an NFS server.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-onpremconfig
     */
    public onPremConfig: CfnLocationNFS.OnPremConfigProperty | cdk.IResolvable;

    /**
     * The NFS mount options that DataSync can use to mount your NFS share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-mountoptions
     */
    public mountOptions: CfnLocationNFS.MountOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The name of the NFS server. This value is the IP address or Domain Name Service (DNS) name of the NFS server. An agent that is installed on-premises uses this hostname to mount the NFS server in a network.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * > This name must either be DNS-compliant or must be an IP version 4 (IPv4) address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-serverhostname
     */
    public serverHostname: string | undefined;

    /**
     * The subdirectory in the NFS file system that is used to read data from the NFS source location or write data to the NFS destination. The NFS path should be a path that's exported by the NFS server, or a subdirectory of that path. The path should be such that it can be mounted by other NFS clients in your network.
     *
     * To see all the paths exported by your NFS server, run " `showmount -e nfs-server-name` " from an NFS client that has access to your server. You can specify any directory that appears in the results, and any subdirectory of that directory. Ensure that the NFS export is accessible without Kerberos authentication.
     *
     * To transfer all the data in the folder you specified, DataSync needs to have permissions to read all the data. To ensure this, either configure the NFS export with `no_root_squash,` or ensure that the permissions for all of the files that you want DataSync allow read access for all users. Doing either enables the agent to read the files. For the agent to access directories, you must additionally enable all execute access.
     *
     * If you are copying data to or from your AWS Snowcone device, see [NFS Server on AWS Snowcone](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#nfs-on-snowcone) for more information.
     *
     * For information about NFS export configuration, see [18.7. The /etc/exports Configuration File](https://docs.aws.amazon.com/http://web.mit.edu/rhel-doc/5/RHEL-5-manual/Deployment_Guide-en-US/s1-nfs-server-config-exports.html) in the Red Hat Enterprise Linux documentation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationNFS`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationNFSProps) {
        super(scope, id, { type: CfnLocationNFS.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'onPremConfig', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.onPremConfig = props.onPremConfig;
        this.mountOptions = props.mountOptions;
        this.serverHostname = props.serverHostname;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationNFS", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationNFS.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            onPremConfig: this.onPremConfig,
            mountOptions: this.mountOptions,
            serverHostname: this.serverHostname,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationNFSPropsToCloudFormation(props);
    }
}

export namespace CfnLocationNFS {
    /**
     * The NFS mount options that DataSync can use to mount your NFS share.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-mountoptions.html
     */
    export interface MountOptionsProperty {
        /**
         * Specifies the NFS version that you want DataSync to use when mounting your NFS share. If the server refuses to use the version specified, the task fails.
         *
         * You can specify the following options:
         *
         * - `AUTOMATIC` (default): DataSync chooses NFS version 4.1.
         * - `NFS3` : Stateless protocol version that allows for asynchronous writes on the server.
         * - `NFSv4_0` : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
         * - `NFSv4_1` : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. NFS version 4.1 also includes all features available in version 4.0.
         *
         * > DataSync currently only supports NFS version 3 with Amazon FSx for NetApp ONTAP locations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-mountoptions.html#cfn-datasync-locationnfs-mountoptions-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationNFS_MountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "MountOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS.MountOptions` resource
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS.MountOptions` resource.
 */
// @ts-ignore TS6133
function cfnLocationNFSMountOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationNFS_MountOptionsPropertyValidator(properties).assertSuccess();
    return {
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLocationNFSMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationNFS.MountOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFS.MountOptionsProperty>();
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLocationNFS {
    /**
     * A list of Amazon Resource Names (ARNs) of agents to use for a Network File System (NFS) location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-onpremconfig.html
     */
    export interface OnPremConfigProperty {
        /**
         * ARNs of the agents to use for an NFS location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-onpremconfig.html#cfn-datasync-locationnfs-onpremconfig-agentarns
         */
        readonly agentArns: string[];
    }
}

/**
 * Determine whether the given properties match those of a `OnPremConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OnPremConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationNFS_OnPremConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentArns', cdk.requiredValidator)(properties.agentArns));
    errors.collect(cdk.propertyValidator('agentArns', cdk.listValidator(cdk.validateString))(properties.agentArns));
    return errors.wrap('supplied properties not correct for "OnPremConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS.OnPremConfig` resource
 *
 * @param properties - the TypeScript properties of a `OnPremConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationNFS.OnPremConfig` resource.
 */
// @ts-ignore TS6133
function cfnLocationNFSOnPremConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationNFS_OnPremConfigPropertyValidator(properties).assertSuccess();
    return {
        AgentArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    };
}

// @ts-ignore TS6133
function CfnLocationNFSOnPremConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationNFS.OnPremConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFS.OnPremConfigProperty>();
    ret.addPropertyResult('agentArns', 'AgentArns', cfn_parse.FromCloudFormation.getStringArray(properties.AgentArns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationObjectStorage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html
 */
export interface CfnLocationObjectStorageProps {

    /**
     * Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can securely connect with your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-agentarns
     */
    readonly agentArns: string[];

    /**
     * Specifies the access key (for example, a user name) if credentials are required to authenticate with the object storage server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-accesskey
     */
    readonly accessKey?: string;

    /**
     * Specifies the name of the object storage bucket involved in the transfer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-bucketname
     */
    readonly bucketName?: string;

    /**
     * Specifies the secret key (for example, a password) if credentials are required to authenticate with the object storage server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-secretkey
     */
    readonly secretKey?: string;

    /**
     * Specifies the domain name or IP address of the object storage server. A DataSync agent uses this hostname to mount the object storage server in a network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverhostname
     */
    readonly serverHostname?: string;

    /**
     * Specifies the port that your object storage server accepts inbound network traffic on (for example, port 443).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverport
     */
    readonly serverPort?: number;

    /**
     * Specifies the protocol that your object storage server uses to communicate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverprotocol
     */
    readonly serverProtocol?: string;

    /**
     * Specifies the object prefix for your object storage server. If this is a source location, DataSync only copies objects with this prefix. If this is a destination location, DataSync writes all objects with this prefix.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * Specifies the key-value pair that represents a tag that you want to add to the resource. Tags can help you manage, filter, and search for your resources. We recommend creating a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationObjectStorageProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationObjectStorageProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationObjectStoragePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessKey', cdk.validateString)(properties.accessKey));
    errors.collect(cdk.propertyValidator('agentArns', cdk.requiredValidator)(properties.agentArns));
    errors.collect(cdk.propertyValidator('agentArns', cdk.listValidator(cdk.validateString))(properties.agentArns));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('secretKey', cdk.validateString)(properties.secretKey));
    errors.collect(cdk.propertyValidator('serverHostname', cdk.validateString)(properties.serverHostname));
    errors.collect(cdk.propertyValidator('serverPort', cdk.validateNumber)(properties.serverPort));
    errors.collect(cdk.propertyValidator('serverProtocol', cdk.validateString)(properties.serverProtocol));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationObjectStorageProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationObjectStorage` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationObjectStorageProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationObjectStorage` resource.
 */
// @ts-ignore TS6133
function cfnLocationObjectStoragePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationObjectStoragePropsValidator(properties).assertSuccess();
    return {
        AgentArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
        AccessKey: cdk.stringToCloudFormation(properties.accessKey),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        SecretKey: cdk.stringToCloudFormation(properties.secretKey),
        ServerHostname: cdk.stringToCloudFormation(properties.serverHostname),
        ServerPort: cdk.numberToCloudFormation(properties.serverPort),
        ServerProtocol: cdk.stringToCloudFormation(properties.serverProtocol),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationObjectStoragePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationObjectStorageProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationObjectStorageProps>();
    ret.addPropertyResult('agentArns', 'AgentArns', cfn_parse.FromCloudFormation.getStringArray(properties.AgentArns));
    ret.addPropertyResult('accessKey', 'AccessKey', properties.AccessKey != null ? cfn_parse.FromCloudFormation.getString(properties.AccessKey) : undefined);
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('secretKey', 'SecretKey', properties.SecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretKey) : undefined);
    ret.addPropertyResult('serverHostname', 'ServerHostname', properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined);
    ret.addPropertyResult('serverPort', 'ServerPort', properties.ServerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ServerPort) : undefined);
    ret.addPropertyResult('serverProtocol', 'ServerProtocol', properties.ServerProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.ServerProtocol) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationObjectStorage`
 *
 * The `AWS::DataSync::LocationObjectStorage` resource specifies an endpoint for a self-managed object storage bucket. For more information about self-managed object storage locations, see [Creating a Location for Object Storage](https://docs.aws.amazon.com/datasync/latest/userguide/create-object-location.html) .
 *
 * @cloudformationResource AWS::DataSync::LocationObjectStorage
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html
 */
export class CfnLocationObjectStorage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationObjectStorage";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationObjectStorage {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationObjectStoragePropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationObjectStorage(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the specified object storage location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified object storage location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can securely connect with your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-agentarns
     */
    public agentArns: string[];

    /**
     * Specifies the access key (for example, a user name) if credentials are required to authenticate with the object storage server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-accesskey
     */
    public accessKey: string | undefined;

    /**
     * Specifies the name of the object storage bucket involved in the transfer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-bucketname
     */
    public bucketName: string | undefined;

    /**
     * Specifies the secret key (for example, a password) if credentials are required to authenticate with the object storage server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-secretkey
     */
    public secretKey: string | undefined;

    /**
     * Specifies the domain name or IP address of the object storage server. A DataSync agent uses this hostname to mount the object storage server in a network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverhostname
     */
    public serverHostname: string | undefined;

    /**
     * Specifies the port that your object storage server accepts inbound network traffic on (for example, port 443).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverport
     */
    public serverPort: number | undefined;

    /**
     * Specifies the protocol that your object storage server uses to communicate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverprotocol
     */
    public serverProtocol: string | undefined;

    /**
     * Specifies the object prefix for your object storage server. If this is a source location, DataSync only copies objects with this prefix. If this is a destination location, DataSync writes all objects with this prefix.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * Specifies the key-value pair that represents a tag that you want to add to the resource. Tags can help you manage, filter, and search for your resources. We recommend creating a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationObjectStorage`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationObjectStorageProps) {
        super(scope, id, { type: CfnLocationObjectStorage.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'agentArns', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.agentArns = props.agentArns;
        this.accessKey = props.accessKey;
        this.bucketName = props.bucketName;
        this.secretKey = props.secretKey;
        this.serverHostname = props.serverHostname;
        this.serverPort = props.serverPort;
        this.serverProtocol = props.serverProtocol;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationObjectStorage", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationObjectStorage.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            agentArns: this.agentArns,
            accessKey: this.accessKey,
            bucketName: this.bucketName,
            secretKey: this.secretKey,
            serverHostname: this.serverHostname,
            serverPort: this.serverPort,
            serverProtocol: this.serverProtocol,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationObjectStoragePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLocationS3`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html
 */
export interface CfnLocationS3Props {

    /**
     * The ARN of the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3bucketarn
     */
    readonly s3BucketArn: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that is used to access an Amazon S3 bucket.
     *
     * For detailed information about using such a role, see [Creating a Location for Amazon S3](https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html#create-s3-location) in the *AWS DataSync User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3config
     */
    readonly s3Config: CfnLocationS3.S3ConfigProperty | cdk.IResolvable;

    /**
     * The Amazon S3 storage class that you want to store your files in when this location is used as a task destination. For buckets in AWS Regions , the storage class defaults to S3 Standard.
     *
     * For more information about S3 storage classes, see [Amazon S3 Storage Classes](https://docs.aws.amazon.com/s3/storage-classes/) . Some storage classes have behaviors that can affect your S3 storage costs. For detailed information, see [Considerations When Working with Amazon S3 Storage Classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3storageclass
     */
    readonly s3StorageClass?: string;

    /**
     * A subdirectory in the Amazon S3 bucket. This subdirectory in Amazon S3 is used to read data from the S3 source location or write data to the S3 destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationS3Props`
 *
 * @param properties - the TypeScript properties of a `CfnLocationS3Props`
 *
 * @returns the result of the validation.
 */
function CfnLocationS3PropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.requiredValidator)(properties.s3BucketArn));
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.validateString)(properties.s3BucketArn));
    errors.collect(cdk.propertyValidator('s3Config', cdk.requiredValidator)(properties.s3Config));
    errors.collect(cdk.propertyValidator('s3Config', CfnLocationS3_S3ConfigPropertyValidator)(properties.s3Config));
    errors.collect(cdk.propertyValidator('s3StorageClass', cdk.validateString)(properties.s3StorageClass));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLocationS3Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationS3` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationS3Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationS3` resource.
 */
// @ts-ignore TS6133
function cfnLocationS3PropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationS3PropsValidator(properties).assertSuccess();
    return {
        S3BucketArn: cdk.stringToCloudFormation(properties.s3BucketArn),
        S3Config: cfnLocationS3S3ConfigPropertyToCloudFormation(properties.s3Config),
        S3StorageClass: cdk.stringToCloudFormation(properties.s3StorageClass),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationS3PropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationS3Props> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationS3Props>();
    ret.addPropertyResult('s3BucketArn', 'S3BucketArn', cfn_parse.FromCloudFormation.getString(properties.S3BucketArn));
    ret.addPropertyResult('s3Config', 'S3Config', CfnLocationS3S3ConfigPropertyFromCloudFormation(properties.S3Config));
    ret.addPropertyResult('s3StorageClass', 'S3StorageClass', properties.S3StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.S3StorageClass) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationS3`
 *
 * The `AWS::DataSync::LocationS3` resource specifies an endpoint for an Amazon S3 bucket.
 *
 * For more information, see [Create an Amazon S3 location](https://docs.aws.amazon.com/datasync/latest/userguide/create-locations-cli.html#create-location-s3-cli) in the *AWS DataSync User Guide* .
 *
 * @cloudformationResource AWS::DataSync::LocationS3
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html
 */
export class CfnLocationS3 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationS3";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationS3 {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationS3PropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationS3(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the specified Amazon S3 location.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified Amazon S3 location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The ARN of the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3bucketarn
     */
    public s3BucketArn: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that is used to access an Amazon S3 bucket.
     *
     * For detailed information about using such a role, see [Creating a Location for Amazon S3](https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html#create-s3-location) in the *AWS DataSync User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3config
     */
    public s3Config: CfnLocationS3.S3ConfigProperty | cdk.IResolvable;

    /**
     * The Amazon S3 storage class that you want to store your files in when this location is used as a task destination. For buckets in AWS Regions , the storage class defaults to S3 Standard.
     *
     * For more information about S3 storage classes, see [Amazon S3 Storage Classes](https://docs.aws.amazon.com/s3/storage-classes/) . Some storage classes have behaviors that can affect your S3 storage costs. For detailed information, see [Considerations When Working with Amazon S3 Storage Classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3storageclass
     */
    public s3StorageClass: string | undefined;

    /**
     * A subdirectory in the Amazon S3 bucket. This subdirectory in Amazon S3 is used to read data from the S3 source location or write data to the S3 destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * The key-value pair that represents the tag that you want to add to the location. The value can be an empty string. We recommend using tags to name your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationS3`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationS3Props) {
        super(scope, id, { type: CfnLocationS3.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 's3BucketArn', this);
        cdk.requireProperty(props, 's3Config', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.s3BucketArn = props.s3BucketArn;
        this.s3Config = props.s3Config;
        this.s3StorageClass = props.s3StorageClass;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationS3", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationS3.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            s3BucketArn: this.s3BucketArn,
            s3Config: this.s3Config,
            s3StorageClass: this.s3StorageClass,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationS3PropsToCloudFormation(props);
    }
}

export namespace CfnLocationS3 {
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role used to access an Amazon S3 bucket.
     *
     * For detailed information about using such a role, see [Creating a Location for Amazon S3](https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html#create-s3-location) in the *AWS DataSync User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locations3-s3config.html
     */
    export interface S3ConfigProperty {
        /**
         * The ARN of the IAM role for accessing the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locations3-s3config.html#cfn-datasync-locations3-s3config-bucketaccessrolearn
         */
        readonly bucketAccessRoleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationS3_S3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketAccessRoleArn', cdk.requiredValidator)(properties.bucketAccessRoleArn));
    errors.collect(cdk.propertyValidator('bucketAccessRoleArn', cdk.validateString)(properties.bucketAccessRoleArn));
    return errors.wrap('supplied properties not correct for "S3ConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationS3.S3Config` resource
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationS3.S3Config` resource.
 */
// @ts-ignore TS6133
function cfnLocationS3S3ConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationS3_S3ConfigPropertyValidator(properties).assertSuccess();
    return {
        BucketAccessRoleArn: cdk.stringToCloudFormation(properties.bucketAccessRoleArn),
    };
}

// @ts-ignore TS6133
function CfnLocationS3S3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationS3.S3ConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationS3.S3ConfigProperty>();
    ret.addPropertyResult('bucketAccessRoleArn', 'BucketAccessRoleArn', cfn_parse.FromCloudFormation.getString(properties.BucketAccessRoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLocationSMB`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html
 */
export interface CfnLocationSMBProps {

    /**
     * The Amazon Resource Names (ARNs) of agents to use for a Server Message Block (SMB) location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-agentarns
     */
    readonly agentArns: string[];

    /**
     * The user who can mount the share and has the permissions to access files and folders in the SMB share.
     *
     * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#SMBuser) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-user
     */
    readonly user: string;

    /**
     * Specifies the Windows domain name that your SMB file server belongs to.
     *
     * For more information, see [required permissions](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#configuring-smb-permissions) for SMB locations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-domain
     */
    readonly domain?: string;

    /**
     * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-mountoptions
     */
    readonly mountOptions?: CfnLocationSMB.MountOptionsProperty | cdk.IResolvable;

    /**
     * The password of the user who can mount the share and has the permissions to access files and folders in the SMB share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-password
     */
    readonly password?: string;

    /**
     * Specifies the Domain Name Service (DNS) name or IP address of the SMB file server that your DataSync agent will mount.
     *
     * > You can't specify an IP version 6 (IPv6) address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-serverhostname
     */
    readonly serverHostname?: string;

    /**
     * The subdirectory in the SMB file system that is used to read data from the SMB source location or write data to the SMB destination. The SMB path should be a path that's exported by the SMB server, or a subdirectory of that path. The path should be such that it can be mounted by other SMB clients in your network.
     *
     * > `Subdirectory` must be specified with forward slashes. For example, `/path/to/folder` .
     *
     * To transfer all the data in the folder you specified, DataSync must have permissions to mount the SMB share, as well as to access all the data in that share. To ensure this, either make sure that the user name and password specified belongs to the user who can mount the share, and who has the appropriate permissions for all of the files and directories that you want DataSync to access, or use credentials of a member of the Backup Operators group to mount the share. Doing either one enables the agent to access the data. For the agent to access directories, you must additionally enable all execute access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-subdirectory
     */
    readonly subdirectory?: string;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLocationSMBProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationSMBProps`
 *
 * @returns the result of the validation.
 */
function CfnLocationSMBPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentArns', cdk.requiredValidator)(properties.agentArns));
    errors.collect(cdk.propertyValidator('agentArns', cdk.listValidator(cdk.validateString))(properties.agentArns));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('mountOptions', CfnLocationSMB_MountOptionsPropertyValidator)(properties.mountOptions));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('serverHostname', cdk.validateString)(properties.serverHostname));
    errors.collect(cdk.propertyValidator('subdirectory', cdk.validateString)(properties.subdirectory));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('user', cdk.requiredValidator)(properties.user));
    errors.collect(cdk.propertyValidator('user', cdk.validateString)(properties.user));
    return errors.wrap('supplied properties not correct for "CfnLocationSMBProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationSMB` resource
 *
 * @param properties - the TypeScript properties of a `CfnLocationSMBProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationSMB` resource.
 */
// @ts-ignore TS6133
function cfnLocationSMBPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationSMBPropsValidator(properties).assertSuccess();
    return {
        AgentArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
        User: cdk.stringToCloudFormation(properties.user),
        Domain: cdk.stringToCloudFormation(properties.domain),
        MountOptions: cfnLocationSMBMountOptionsPropertyToCloudFormation(properties.mountOptions),
        Password: cdk.stringToCloudFormation(properties.password),
        ServerHostname: cdk.stringToCloudFormation(properties.serverHostname),
        Subdirectory: cdk.stringToCloudFormation(properties.subdirectory),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLocationSMBPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationSMBProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationSMBProps>();
    ret.addPropertyResult('agentArns', 'AgentArns', cfn_parse.FromCloudFormation.getStringArray(properties.AgentArns));
    ret.addPropertyResult('user', 'User', cfn_parse.FromCloudFormation.getString(properties.User));
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addPropertyResult('mountOptions', 'MountOptions', properties.MountOptions != null ? CfnLocationSMBMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('serverHostname', 'ServerHostname', properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined);
    ret.addPropertyResult('subdirectory', 'Subdirectory', properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::LocationSMB`
 *
 * The `AWS::DataSync::LocationSMB` resource specifies a Server Message Block (SMB) location.
 *
 * @cloudformationResource AWS::DataSync::LocationSMB
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html
 */
export class CfnLocationSMB extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::LocationSMB";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationSMB {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLocationSMBPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLocationSMB(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the specified SMB file system.
     * @cloudformationAttribute LocationArn
     */
    public readonly attrLocationArn: string;

    /**
     * The URI of the specified SMB location.
     * @cloudformationAttribute LocationUri
     */
    public readonly attrLocationUri: string;

    /**
     * The Amazon Resource Names (ARNs) of agents to use for a Server Message Block (SMB) location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-agentarns
     */
    public agentArns: string[];

    /**
     * The user who can mount the share and has the permissions to access files and folders in the SMB share.
     *
     * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#SMBuser) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-user
     */
    public user: string;

    /**
     * Specifies the Windows domain name that your SMB file server belongs to.
     *
     * For more information, see [required permissions](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#configuring-smb-permissions) for SMB locations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-domain
     */
    public domain: string | undefined;

    /**
     * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-mountoptions
     */
    public mountOptions: CfnLocationSMB.MountOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The password of the user who can mount the share and has the permissions to access files and folders in the SMB share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-password
     */
    public password: string | undefined;

    /**
     * Specifies the Domain Name Service (DNS) name or IP address of the SMB file server that your DataSync agent will mount.
     *
     * > You can't specify an IP version 6 (IPv6) address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-serverhostname
     */
    public serverHostname: string | undefined;

    /**
     * The subdirectory in the SMB file system that is used to read data from the SMB source location or write data to the SMB destination. The SMB path should be a path that's exported by the SMB server, or a subdirectory of that path. The path should be such that it can be mounted by other SMB clients in your network.
     *
     * > `Subdirectory` must be specified with forward slashes. For example, `/path/to/folder` .
     *
     * To transfer all the data in the folder you specified, DataSync must have permissions to mount the SMB share, as well as to access all the data in that share. To ensure this, either make sure that the user name and password specified belongs to the user who can mount the share, and who has the appropriate permissions for all of the files and directories that you want DataSync to access, or use credentials of a member of the Backup Operators group to mount the share. Doing either one enables the agent to access the data. For the agent to access directories, you must additionally enable all execute access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-subdirectory
     */
    public subdirectory: string | undefined;

    /**
     * Specifies labels that help you categorize, filter, and search for your AWS resources. We recommend creating at least a name tag for your location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::LocationSMB`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLocationSMBProps) {
        super(scope, id, { type: CfnLocationSMB.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'agentArns', this);
        cdk.requireProperty(props, 'user', this);
        this.attrLocationArn = cdk.Token.asString(this.getAtt('LocationArn', cdk.ResolutionTypeHint.STRING));
        this.attrLocationUri = cdk.Token.asString(this.getAtt('LocationUri', cdk.ResolutionTypeHint.STRING));

        this.agentArns = props.agentArns;
        this.user = props.user;
        this.domain = props.domain;
        this.mountOptions = props.mountOptions;
        this.password = props.password;
        this.serverHostname = props.serverHostname;
        this.subdirectory = props.subdirectory;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationSMB", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationSMB.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            agentArns: this.agentArns,
            user: this.user,
            domain: this.domain,
            mountOptions: this.mountOptions,
            password: this.password,
            serverHostname: this.serverHostname,
            subdirectory: this.subdirectory,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLocationSMBPropsToCloudFormation(props);
    }
}

export namespace CfnLocationSMB {
    /**
     * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationsmb-mountoptions.html
     */
    export interface MountOptionsProperty {
        /**
         * By default, DataSync automatically chooses an SMB protocol version based on negotiation with your SMB file server. You also can configure DataSync to use a specific SMB version, but we recommend doing this only if DataSync has trouble negotiating with the SMB file server automatically.
         *
         * These are the following options for configuring the SMB version:
         *
         * - `AUTOMATIC` (default): DataSync and the SMB file server negotiate a protocol version that they mutually support. (DataSync supports SMB versions 2.1.0 and later.)
         *
         * This is the recommended option. If you instead choose a specific version that your file server doesn't support, you may get an `Operation Not Supported` error.
         * - `SMB3` : Restricts the protocol negotiation to only SMB version 3.0.2.
         * - `SMB2` : Restricts the protocol negotiation to only SMB version 2.1.0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationsmb-mountoptions.html#cfn-datasync-locationsmb-mountoptions-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLocationSMB_MountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "MountOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::LocationSMB.MountOptions` resource
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::LocationSMB.MountOptions` resource.
 */
// @ts-ignore TS6133
function cfnLocationSMBMountOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLocationSMB_MountOptionsPropertyValidator(properties).assertSuccess();
    return {
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLocationSMBMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationSMB.MountOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationSMB.MountOptionsProperty>();
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTask`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html
 */
export interface CfnTaskProps {

    /**
     * The Amazon Resource Name (ARN) of an AWS storage resource's location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-destinationlocationarn
     */
    readonly destinationLocationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the source location for the task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-sourcelocationarn
     */
    readonly sourceLocationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that is used to monitor and log events in the task.
     *
     * For more information about how to use CloudWatch Logs with DataSync, see [Monitoring Your Task](https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#cloudwatchlogs) in the *AWS DataSync User Guide.*
     *
     * For more information about these groups, see [Working with Log Groups and Log Streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) in the *Amazon CloudWatch Logs User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-cloudwatchloggrouparn
     */
    readonly cloudWatchLogGroupArn?: string;

    /**
     * Specifies a list of filter rules that exclude specific data during your transfer. For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-excludes
     */
    readonly excludes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies a list of filter rules that include specific data during your transfer. For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-includes
     */
    readonly includes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of a task. This value is a text reference that is used to identify the task in the console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-name
     */
    readonly name?: string;

    /**
     * Specifies the configuration options for a task. Some options include preserving file or object metadata and verifying data integrity.
     *
     * You can also override these options before starting an individual run of a task (also known as a *task execution* ). For more information, see [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-options
     */
    readonly options?: CfnTask.OptionsProperty | cdk.IResolvable;

    /**
     * Specifies a schedule used to periodically transfer files from a source to a destination location. The schedule should be specified in UTC time. For more information, see [Scheduling your task](https://docs.aws.amazon.com/datasync/latest/userguide/task-scheduling.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-schedule
     */
    readonly schedule?: CfnTask.TaskScheduleProperty | cdk.IResolvable;

    /**
     * Specifies the tags that you want to apply to the Amazon Resource Name (ARN) representing the task.
     *
     * *Tags* are key-value pairs that help you manage, filter, and search for your DataSync resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskProps`
 *
 * @returns the result of the validation.
 */
function CfnTaskPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupArn', cdk.validateString)(properties.cloudWatchLogGroupArn));
    errors.collect(cdk.propertyValidator('destinationLocationArn', cdk.requiredValidator)(properties.destinationLocationArn));
    errors.collect(cdk.propertyValidator('destinationLocationArn', cdk.validateString)(properties.destinationLocationArn));
    errors.collect(cdk.propertyValidator('excludes', cdk.listValidator(CfnTask_FilterRulePropertyValidator))(properties.excludes));
    errors.collect(cdk.propertyValidator('includes', cdk.listValidator(CfnTask_FilterRulePropertyValidator))(properties.includes));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('options', CfnTask_OptionsPropertyValidator)(properties.options));
    errors.collect(cdk.propertyValidator('schedule', CfnTask_TaskSchedulePropertyValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('sourceLocationArn', cdk.requiredValidator)(properties.sourceLocationArn));
    errors.collect(cdk.propertyValidator('sourceLocationArn', cdk.validateString)(properties.sourceLocationArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnTaskProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::Task` resource
 *
 * @param properties - the TypeScript properties of a `CfnTaskProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::Task` resource.
 */
// @ts-ignore TS6133
function cfnTaskPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskPropsValidator(properties).assertSuccess();
    return {
        DestinationLocationArn: cdk.stringToCloudFormation(properties.destinationLocationArn),
        SourceLocationArn: cdk.stringToCloudFormation(properties.sourceLocationArn),
        CloudWatchLogGroupArn: cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
        Excludes: cdk.listMapper(cfnTaskFilterRulePropertyToCloudFormation)(properties.excludes),
        Includes: cdk.listMapper(cfnTaskFilterRulePropertyToCloudFormation)(properties.includes),
        Name: cdk.stringToCloudFormation(properties.name),
        Options: cfnTaskOptionsPropertyToCloudFormation(properties.options),
        Schedule: cfnTaskTaskSchedulePropertyToCloudFormation(properties.schedule),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskProps>();
    ret.addPropertyResult('destinationLocationArn', 'DestinationLocationArn', cfn_parse.FromCloudFormation.getString(properties.DestinationLocationArn));
    ret.addPropertyResult('sourceLocationArn', 'SourceLocationArn', cfn_parse.FromCloudFormation.getString(properties.SourceLocationArn));
    ret.addPropertyResult('cloudWatchLogGroupArn', 'CloudWatchLogGroupArn', properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined);
    ret.addPropertyResult('excludes', 'Excludes', properties.Excludes != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskFilterRulePropertyFromCloudFormation)(properties.Excludes) : undefined);
    ret.addPropertyResult('includes', 'Includes', properties.Includes != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskFilterRulePropertyFromCloudFormation)(properties.Includes) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('options', 'Options', properties.Options != null ? CfnTaskOptionsPropertyFromCloudFormation(properties.Options) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', properties.Schedule != null ? CfnTaskTaskSchedulePropertyFromCloudFormation(properties.Schedule) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataSync::Task`
 *
 * The `AWS::DataSync::Task` resource specifies a task. A task is a set of two locations (source and destination) and a set of `Options` that you use to control the behavior of a task. If you don't specify `Options` when you create a task, AWS DataSync populates them with service defaults.
 *
 * @cloudformationResource AWS::DataSync::Task
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html
 */
export class CfnTask extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataSync::Task";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTask {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTaskPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTask(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARNs of the destination elastic network interfaces (ENIs) that were created for your subnet.
     * @cloudformationAttribute DestinationNetworkInterfaceArns
     */
    public readonly attrDestinationNetworkInterfaceArns: string[];

    /**
     * The ARNs of the source ENIs that were created for your subnet.
     * @cloudformationAttribute SourceNetworkInterfaceArns
     */
    public readonly attrSourceNetworkInterfaceArns: string[];

    /**
     * The status of the task that was described.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The ARN of the task.
     * @cloudformationAttribute TaskArn
     */
    public readonly attrTaskArn: string;

    /**
     * The Amazon Resource Name (ARN) of an AWS storage resource's location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-destinationlocationarn
     */
    public destinationLocationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the source location for the task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-sourcelocationarn
     */
    public sourceLocationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that is used to monitor and log events in the task.
     *
     * For more information about how to use CloudWatch Logs with DataSync, see [Monitoring Your Task](https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#cloudwatchlogs) in the *AWS DataSync User Guide.*
     *
     * For more information about these groups, see [Working with Log Groups and Log Streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) in the *Amazon CloudWatch Logs User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-cloudwatchloggrouparn
     */
    public cloudWatchLogGroupArn: string | undefined;

    /**
     * Specifies a list of filter rules that exclude specific data during your transfer. For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-excludes
     */
    public excludes: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies a list of filter rules that include specific data during your transfer. For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-includes
     */
    public includes: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of a task. This value is a text reference that is used to identify the task in the console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-name
     */
    public name: string | undefined;

    /**
     * Specifies the configuration options for a task. Some options include preserving file or object metadata and verifying data integrity.
     *
     * You can also override these options before starting an individual run of a task (also known as a *task execution* ). For more information, see [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-options
     */
    public options: CfnTask.OptionsProperty | cdk.IResolvable | undefined;

    /**
     * Specifies a schedule used to periodically transfer files from a source to a destination location. The schedule should be specified in UTC time. For more information, see [Scheduling your task](https://docs.aws.amazon.com/datasync/latest/userguide/task-scheduling.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-schedule
     */
    public schedule: CfnTask.TaskScheduleProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the tags that you want to apply to the Amazon Resource Name (ARN) representing the task.
     *
     * *Tags* are key-value pairs that help you manage, filter, and search for your DataSync resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DataSync::Task`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTaskProps) {
        super(scope, id, { type: CfnTask.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'destinationLocationArn', this);
        cdk.requireProperty(props, 'sourceLocationArn', this);
        this.attrDestinationNetworkInterfaceArns = cdk.Token.asList(this.getAtt('DestinationNetworkInterfaceArns', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrSourceNetworkInterfaceArns = cdk.Token.asList(this.getAtt('SourceNetworkInterfaceArns', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.attrTaskArn = cdk.Token.asString(this.getAtt('TaskArn', cdk.ResolutionTypeHint.STRING));

        this.destinationLocationArn = props.destinationLocationArn;
        this.sourceLocationArn = props.sourceLocationArn;
        this.cloudWatchLogGroupArn = props.cloudWatchLogGroupArn;
        this.excludes = props.excludes;
        this.includes = props.includes;
        this.name = props.name;
        this.options = props.options;
        this.schedule = props.schedule;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::Task", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTask.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            destinationLocationArn: this.destinationLocationArn,
            sourceLocationArn: this.sourceLocationArn,
            cloudWatchLogGroupArn: this.cloudWatchLogGroupArn,
            excludes: this.excludes,
            includes: this.includes,
            name: this.name,
            options: this.options,
            schedule: this.schedule,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTaskPropsToCloudFormation(props);
    }
}

export namespace CfnTask {
    /**
     * Specifies which files, folders, and objects to include or exclude when transferring files from source to destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html
     */
    export interface FilterRuleProperty {
        /**
         * The type of filter rule to apply. AWS DataSync only supports the SIMPLE_PATTERN rule type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html#cfn-datasync-task-filterrule-filtertype
         */
        readonly filterType?: string;
        /**
         * A single filter string that consists of the patterns to include or exclude. The patterns are delimited by "|" (that is, a pipe), for example: `/folder1|/folder2`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html#cfn-datasync-task-filterrule-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTask_FilterRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterType', cdk.validateString)(properties.filterType));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "FilterRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::Task.FilterRule` resource
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::Task.FilterRule` resource.
 */
// @ts-ignore TS6133
function cfnTaskFilterRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTask_FilterRulePropertyValidator(properties).assertSuccess();
    return {
        FilterType: cdk.stringToCloudFormation(properties.filterType),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnTaskFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.FilterRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.FilterRuleProperty>();
    ret.addPropertyResult('filterType', 'FilterType', properties.FilterType != null ? cfn_parse.FromCloudFormation.getString(properties.FilterType) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTask {
    /**
     * Represents the options that are available to control the behavior of a [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) operation. This behavior includes preserving metadata, such as user ID (UID), group ID (GID), and file permissions; overwriting files in the destination; data integrity verification; and so on.
     *
     * A task has a set of default options associated with it. If you don't specify an option in [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) , the default value is used. You can override the default options on each task execution by specifying an overriding `Options` value to [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html
     */
    export interface OptionsProperty {
        /**
         * A file metadata value that shows the last time that a file was accessed (that is, when the file was read or written to). If you set `Atime` to `BEST_EFFORT` , AWS DataSync attempts to preserve the original `Atime` attribute on all source files (that is, the version before the PREPARING phase). However, `Atime` 's behavior is not fully standard across platforms, so AWS DataSync can only do this on a best-effort basis.
         *
         * Default value: `BEST_EFFORT`
         *
         * `BEST_EFFORT` : Attempt to preserve the per-file `Atime` value (recommended).
         *
         * `NONE` : Ignore `Atime` .
         *
         * > If `Atime` is set to `BEST_EFFORT` , `Mtime` must be set to `PRESERVE` .
         * >
         * > If `Atime` is set to `NONE` , `Mtime` must also be `NONE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-atime
         */
        readonly atime?: string;
        /**
         * A value that limits the bandwidth used by AWS DataSync . For example, if you want AWS DataSync to use a maximum of 1 MB, set this value to `1048576` (=1024*1024).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-bytespersecond
         */
        readonly bytesPerSecond?: number;
        /**
         * The group ID (GID) of the file's owners.
         *
         * Default value: `INT_VALUE`
         *
         * `INT_VALUE` : Preserve the integer value of the user ID (UID) and group ID (GID) (recommended).
         *
         * `NAME` : Currently not supported.
         *
         * `NONE` : Ignore the UID and GID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-gid
         */
        readonly gid?: string;
        /**
         * Specifies the type of logs that DataSync publishes to a Amazon CloudWatch Logs log group. To specify the log group, see [CloudWatchLogGroupArn](https://docs.aws.amazon.com/datasync/latest/userguide/API_CreateTask.html#DataSync-CreateTask-request-CloudWatchLogGroupArn) .
         *
         * If you set `LogLevel` to `OFF` , no logs are published. `BASIC` publishes logs on errors for individual files transferred. `TRANSFER` publishes logs for every file or object that is transferred and integrity checked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-loglevel
         */
        readonly logLevel?: string;
        /**
         * A value that indicates the last time that a file was modified (that is, a file was written to) before the PREPARING phase. This option is required for cases when you need to run the same task more than one time.
         *
         * Default value: `PRESERVE`
         *
         * `PRESERVE` : Preserve original `Mtime` (recommended)
         *
         * `NONE` : Ignore `Mtime` .
         *
         * > If `Mtime` is set to `PRESERVE` , `Atime` must be set to `BEST_EFFORT` .
         * >
         * > If `Mtime` is set to `NONE` , `Atime` must also be set to `NONE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-mtime
         */
        readonly mtime?: string;
        /**
         * Specifies whether object tags are preserved when transferring between object storage systems. If you want your DataSync task to ignore object tags, specify the `NONE` value.
         *
         * Default Value: `PRESERVE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-objecttags
         */
        readonly objectTags?: string;
        /**
         * Specifies whether data at the destination location should be overwritten or preserved. If set to `NEVER` , a destination file for example will not be replaced by a source file (even if the destination file differs from the source file). If you modify files in the destination and you sync the files, you can use this value to protect against overwriting those changes.
         *
         * Some storage classes have specific behaviors that can affect your Amazon S3 storage cost. For detailed information, see [Considerations when working with Amazon S3 storage classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-overwritemode
         */
        readonly overwriteMode?: string;
        /**
         * A value that determines which users or groups can access a file for a specific purpose, such as reading, writing, or execution of the file. This option should be set only for Network File System (NFS), Amazon EFS, and Amazon S3 locations. For more information about what metadata is copied by DataSync, see [Metadata Copied by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/special-files.html#metadata-copied) .
         *
         * Default value: `PRESERVE`
         *
         * `PRESERVE` : Preserve POSIX-style permissions (recommended).
         *
         * `NONE` : Ignore permissions.
         *
         * > AWS DataSync can preserve extant permissions of a source location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-posixpermissions
         */
        readonly posixPermissions?: string;
        /**
         * A value that specifies whether files in the destination that don't exist in the source file system are preserved. This option can affect your storage costs. If your task deletes objects, you might incur minimum storage duration charges for certain storage classes. For detailed information, see [Considerations when working with Amazon S3 storage classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) in the *AWS DataSync User Guide* .
         *
         * Default value: `PRESERVE`
         *
         * `PRESERVE` : Ignore destination files that aren't present in the source (recommended).
         *
         * `REMOVE` : Delete destination files that aren't present in the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-preservedeletedfiles
         */
        readonly preserveDeletedFiles?: string;
        /**
         * A value that determines whether AWS DataSync should preserve the metadata of block and character devices in the source file system, and re-create the files with that device name and metadata on the destination. DataSync does not copy the contents of such devices, only the name and metadata.
         *
         * > AWS DataSync can't sync the actual contents of such devices, because they are nonterminal and don't return an end-of-file (EOF) marker.
         *
         * Default value: `NONE`
         *
         * `NONE` : Ignore special devices (recommended).
         *
         * `PRESERVE` : Preserve character and block device metadata. This option isn't currently supported for Amazon EFS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-preservedevices
         */
        readonly preserveDevices?: string;
        /**
         * A value that determines which components of the SMB security descriptor are copied from source to destination objects.
         *
         * This value is only used for transfers between SMB and Amazon FSx for Windows File Server locations, or between two Amazon FSx for Windows File Server locations. For more information about how DataSync handles metadata, see [How DataSync Handles Metadata and Special Files](https://docs.aws.amazon.com/datasync/latest/userguide/special-files.html) .
         *
         * Default value: `OWNER_DACL`
         *
         * `OWNER_DACL` : For each copied object, DataSync copies the following metadata:
         *
         * - Object owner.
         * - NTFS discretionary access control lists (DACLs), which determine whether to grant access to an object.
         *
         * When you use option, DataSync does NOT copy the NTFS system access control lists (SACLs), which are used by administrators to log attempts to access a secured object.
         *
         * `OWNER_DACL_SACL` : For each copied object, DataSync copies the following metadata:
         *
         * - Object owner.
         * - NTFS discretionary access control lists (DACLs), which determine whether to grant access to an object.
         * - NTFS system access control lists (SACLs), which are used by administrators to log attempts to access a secured object.
         *
         * Copying SACLs requires granting additional permissions to the Windows user that DataSync uses to access your SMB location. For information about choosing a user that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#SMBuser) .
         *
         * `NONE` : None of the SMB security descriptor components are copied. Destination objects are owned by the user that was provided for accessing the destination location. DACLs and SACLs are set based on the destination server’s configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-securitydescriptorcopyflags
         */
        readonly securityDescriptorCopyFlags?: string;
        /**
         * Specifies whether tasks should be queued before executing the tasks. The default is `ENABLED` , which means the tasks will be queued.
         *
         * If you use the same agent to run multiple tasks, you can enable the tasks to run in series. For more information, see [Queueing task executions](https://docs.aws.amazon.com/datasync/latest/userguide/run-task.html#queue-task-execution) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-taskqueueing
         */
        readonly taskQueueing?: string;
        /**
         * A value that determines whether DataSync transfers only the data and metadata that differ between the source and the destination location, or whether DataSync transfers all the content from the source, without comparing it to the destination location.
         *
         * `CHANGED` : DataSync copies only data or metadata that is new or different from the source location to the destination location.
         *
         * `ALL` : DataSync copies all source location content to the destination, without comparing it to existing content on the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-transfermode
         */
        readonly transferMode?: string;
        /**
         * The user ID (UID) of the file's owner.
         *
         * Default value: `INT_VALUE`
         *
         * `INT_VALUE` : Preserve the integer value of the UID and group ID (GID) (recommended).
         *
         * `NAME` : Currently not supported
         *
         * `NONE` : Ignore the UID and GID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-uid
         */
        readonly uid?: string;
        /**
         * A value that determines whether a data integrity verification is performed at the end of a task execution after all data and metadata have been transferred. For more information, see [Configure task settings](https://docs.aws.amazon.com/datasync/latest/userguide/create-task.html) .
         *
         * Default value: `POINT_IN_TIME_CONSISTENT`
         *
         * `ONLY_FILES_TRANSFERRED` (recommended): Perform verification only on files that were transferred.
         *
         * `POINT_IN_TIME_CONSISTENT` : Scan the entire source and entire destination at the end of the transfer to verify that the source and destination are fully synchronized. This option isn't supported when transferring to S3 Glacier or S3 Glacier Deep Archive storage classes.
         *
         * `NONE` : No additional verification is done at the end of the transfer, but all data transmissions are integrity-checked with checksum verification during the transfer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-verifymode
         */
        readonly verifyMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OptionsProperty`
 *
 * @param properties - the TypeScript properties of a `OptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnTask_OptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('atime', cdk.validateString)(properties.atime));
    errors.collect(cdk.propertyValidator('bytesPerSecond', cdk.validateNumber)(properties.bytesPerSecond));
    errors.collect(cdk.propertyValidator('gid', cdk.validateString)(properties.gid));
    errors.collect(cdk.propertyValidator('logLevel', cdk.validateString)(properties.logLevel));
    errors.collect(cdk.propertyValidator('mtime', cdk.validateString)(properties.mtime));
    errors.collect(cdk.propertyValidator('objectTags', cdk.validateString)(properties.objectTags));
    errors.collect(cdk.propertyValidator('overwriteMode', cdk.validateString)(properties.overwriteMode));
    errors.collect(cdk.propertyValidator('posixPermissions', cdk.validateString)(properties.posixPermissions));
    errors.collect(cdk.propertyValidator('preserveDeletedFiles', cdk.validateString)(properties.preserveDeletedFiles));
    errors.collect(cdk.propertyValidator('preserveDevices', cdk.validateString)(properties.preserveDevices));
    errors.collect(cdk.propertyValidator('securityDescriptorCopyFlags', cdk.validateString)(properties.securityDescriptorCopyFlags));
    errors.collect(cdk.propertyValidator('taskQueueing', cdk.validateString)(properties.taskQueueing));
    errors.collect(cdk.propertyValidator('transferMode', cdk.validateString)(properties.transferMode));
    errors.collect(cdk.propertyValidator('uid', cdk.validateString)(properties.uid));
    errors.collect(cdk.propertyValidator('verifyMode', cdk.validateString)(properties.verifyMode));
    return errors.wrap('supplied properties not correct for "OptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::Task.Options` resource
 *
 * @param properties - the TypeScript properties of a `OptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::Task.Options` resource.
 */
// @ts-ignore TS6133
function cfnTaskOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTask_OptionsPropertyValidator(properties).assertSuccess();
    return {
        Atime: cdk.stringToCloudFormation(properties.atime),
        BytesPerSecond: cdk.numberToCloudFormation(properties.bytesPerSecond),
        Gid: cdk.stringToCloudFormation(properties.gid),
        LogLevel: cdk.stringToCloudFormation(properties.logLevel),
        Mtime: cdk.stringToCloudFormation(properties.mtime),
        ObjectTags: cdk.stringToCloudFormation(properties.objectTags),
        OverwriteMode: cdk.stringToCloudFormation(properties.overwriteMode),
        PosixPermissions: cdk.stringToCloudFormation(properties.posixPermissions),
        PreserveDeletedFiles: cdk.stringToCloudFormation(properties.preserveDeletedFiles),
        PreserveDevices: cdk.stringToCloudFormation(properties.preserveDevices),
        SecurityDescriptorCopyFlags: cdk.stringToCloudFormation(properties.securityDescriptorCopyFlags),
        TaskQueueing: cdk.stringToCloudFormation(properties.taskQueueing),
        TransferMode: cdk.stringToCloudFormation(properties.transferMode),
        Uid: cdk.stringToCloudFormation(properties.uid),
        VerifyMode: cdk.stringToCloudFormation(properties.verifyMode),
    };
}

// @ts-ignore TS6133
function CfnTaskOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.OptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.OptionsProperty>();
    ret.addPropertyResult('atime', 'Atime', properties.Atime != null ? cfn_parse.FromCloudFormation.getString(properties.Atime) : undefined);
    ret.addPropertyResult('bytesPerSecond', 'BytesPerSecond', properties.BytesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesPerSecond) : undefined);
    ret.addPropertyResult('gid', 'Gid', properties.Gid != null ? cfn_parse.FromCloudFormation.getString(properties.Gid) : undefined);
    ret.addPropertyResult('logLevel', 'LogLevel', properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined);
    ret.addPropertyResult('mtime', 'Mtime', properties.Mtime != null ? cfn_parse.FromCloudFormation.getString(properties.Mtime) : undefined);
    ret.addPropertyResult('objectTags', 'ObjectTags', properties.ObjectTags != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTags) : undefined);
    ret.addPropertyResult('overwriteMode', 'OverwriteMode', properties.OverwriteMode != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteMode) : undefined);
    ret.addPropertyResult('posixPermissions', 'PosixPermissions', properties.PosixPermissions != null ? cfn_parse.FromCloudFormation.getString(properties.PosixPermissions) : undefined);
    ret.addPropertyResult('preserveDeletedFiles', 'PreserveDeletedFiles', properties.PreserveDeletedFiles != null ? cfn_parse.FromCloudFormation.getString(properties.PreserveDeletedFiles) : undefined);
    ret.addPropertyResult('preserveDevices', 'PreserveDevices', properties.PreserveDevices != null ? cfn_parse.FromCloudFormation.getString(properties.PreserveDevices) : undefined);
    ret.addPropertyResult('securityDescriptorCopyFlags', 'SecurityDescriptorCopyFlags', properties.SecurityDescriptorCopyFlags != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityDescriptorCopyFlags) : undefined);
    ret.addPropertyResult('taskQueueing', 'TaskQueueing', properties.TaskQueueing != null ? cfn_parse.FromCloudFormation.getString(properties.TaskQueueing) : undefined);
    ret.addPropertyResult('transferMode', 'TransferMode', properties.TransferMode != null ? cfn_parse.FromCloudFormation.getString(properties.TransferMode) : undefined);
    ret.addPropertyResult('uid', 'Uid', properties.Uid != null ? cfn_parse.FromCloudFormation.getString(properties.Uid) : undefined);
    ret.addPropertyResult('verifyMode', 'VerifyMode', properties.VerifyMode != null ? cfn_parse.FromCloudFormation.getString(properties.VerifyMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTask {
    /**
     * Specifies the schedule you want your task to use for repeated executions. For more information, see [Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskschedule.html
     */
    export interface TaskScheduleProperty {
        /**
         * A cron expression that specifies when AWS DataSync initiates a scheduled transfer from a source to a destination location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskschedule.html#cfn-datasync-task-taskschedule-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `TaskScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `TaskScheduleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTask_TaskSchedulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    return errors.wrap('supplied properties not correct for "TaskScheduleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataSync::Task.TaskSchedule` resource
 *
 * @param properties - the TypeScript properties of a `TaskScheduleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataSync::Task.TaskSchedule` resource.
 */
// @ts-ignore TS6133
function cfnTaskTaskSchedulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTask_TaskSchedulePropertyValidator(properties).assertSuccess();
    return {
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
    };
}

// @ts-ignore TS6133
function CfnTaskTaskSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.TaskScheduleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.TaskScheduleProperty>();
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
