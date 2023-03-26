// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:44.314Z","fingerprint":"4uN1mpRoM11/slhOLpRjdYMLg49BKcyKwoAw9lCvDz4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnPipe`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html
 */
export interface CfnPipeProps {

    /**
     * The ARN of the role that allows the pipe to send data to the target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the source resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-source
     */
    readonly source: string;

    /**
     * The ARN of the target resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-target
     */
    readonly target: string;

    /**
     * A description of the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-description
     */
    readonly description?: string;

    /**
     * The state the pipe should be in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-desiredstate
     */
    readonly desiredState?: string;

    /**
     * The ARN of the enrichment resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichment
     */
    readonly enrichment?: string;

    /**
     * The parameters required to set up enrichment on your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichmentparameters
     */
    readonly enrichmentParameters?: CfnPipe.PipeEnrichmentParametersProperty | cdk.IResolvable;

    /**
     * The name of the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
     */
    readonly name?: string;

    /**
     * The parameters required to set up a source for your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-sourceparameters
     */
    readonly sourceParameters?: CfnPipe.PipeSourceParametersProperty | cdk.IResolvable;

    /**
     * The list of key-value pairs to associate with the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-tags
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * The parameters required to set up a target for your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-targetparameters
     */
    readonly targetParameters?: CfnPipe.PipeTargetParametersProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnPipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipeProps`
 *
 * @returns the result of the validation.
 */
function CfnPipePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('desiredState', cdk.validateString)(properties.desiredState));
    errors.collect(cdk.propertyValidator('enrichment', cdk.validateString)(properties.enrichment));
    errors.collect(cdk.propertyValidator('enrichmentParameters', CfnPipe_PipeEnrichmentParametersPropertyValidator)(properties.enrichmentParameters));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('sourceParameters', CfnPipe_PipeSourceParametersPropertyValidator)(properties.sourceParameters));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    errors.collect(cdk.propertyValidator('targetParameters', CfnPipe_PipeTargetParametersPropertyValidator)(properties.targetParameters));
    return errors.wrap('supplied properties not correct for "CfnPipeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe` resource
 *
 * @param properties - the TypeScript properties of a `CfnPipeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe` resource.
 */
// @ts-ignore TS6133
function cfnPipePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipePropsValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Source: cdk.stringToCloudFormation(properties.source),
        Target: cdk.stringToCloudFormation(properties.target),
        Description: cdk.stringToCloudFormation(properties.description),
        DesiredState: cdk.stringToCloudFormation(properties.desiredState),
        Enrichment: cdk.stringToCloudFormation(properties.enrichment),
        EnrichmentParameters: cfnPipePipeEnrichmentParametersPropertyToCloudFormation(properties.enrichmentParameters),
        Name: cdk.stringToCloudFormation(properties.name),
        SourceParameters: cfnPipePipeSourceParametersPropertyToCloudFormation(properties.sourceParameters),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        TargetParameters: cfnPipePipeTargetParametersPropertyToCloudFormation(properties.targetParameters),
    };
}

// @ts-ignore TS6133
function CfnPipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeProps>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('source', 'Source', cfn_parse.FromCloudFormation.getString(properties.Source));
    ret.addPropertyResult('target', 'Target', cfn_parse.FromCloudFormation.getString(properties.Target));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('desiredState', 'DesiredState', properties.DesiredState != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredState) : undefined);
    ret.addPropertyResult('enrichment', 'Enrichment', properties.Enrichment != null ? cfn_parse.FromCloudFormation.getString(properties.Enrichment) : undefined);
    ret.addPropertyResult('enrichmentParameters', 'EnrichmentParameters', properties.EnrichmentParameters != null ? CfnPipePipeEnrichmentParametersPropertyFromCloudFormation(properties.EnrichmentParameters) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sourceParameters', 'SourceParameters', properties.SourceParameters != null ? CfnPipePipeSourceParametersPropertyFromCloudFormation(properties.SourceParameters) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('targetParameters', 'TargetParameters', properties.TargetParameters != null ? CfnPipePipeTargetParametersPropertyFromCloudFormation(properties.TargetParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pipes::Pipe`
 *
 * Create a pipe. Amazon EventBridge Pipes connect event sources to targets and reduces the need for specialized knowledge and integration code.
 *
 * @cloudformationResource AWS::Pipes::Pipe
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html
 */
export class CfnPipe extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pipes::Pipe";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipe {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPipePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPipe(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the pipe.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time the pipe was created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     * The state the pipe is in.
     * @cloudformationAttribute CurrentState
     */
    public readonly attrCurrentState: string;

    /**
     * When the pipe was last updated, in [ISO-8601 format](https://docs.aws.amazon.com/https://www.w3.org/TR/NOTE-datetime) (YYYY-MM-DDThh:mm:ss.sTZD).
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * The reason the pipe is in its current state.
     * @cloudformationAttribute StateReason
     */
    public readonly attrStateReason: string;

    /**
     * The ARN of the role that allows the pipe to send data to the target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-rolearn
     */
    public roleArn: string;

    /**
     * The ARN of the source resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-source
     */
    public source: string;

    /**
     * The ARN of the target resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-target
     */
    public target: string;

    /**
     * A description of the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-description
     */
    public description: string | undefined;

    /**
     * The state the pipe should be in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-desiredstate
     */
    public desiredState: string | undefined;

    /**
     * The ARN of the enrichment resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichment
     */
    public enrichment: string | undefined;

    /**
     * The parameters required to set up enrichment on your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichmentparameters
     */
    public enrichmentParameters: CfnPipe.PipeEnrichmentParametersProperty | cdk.IResolvable | undefined;

    /**
     * The name of the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
     */
    public name: string | undefined;

    /**
     * The parameters required to set up a source for your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-sourceparameters
     */
    public sourceParameters: CfnPipe.PipeSourceParametersProperty | cdk.IResolvable | undefined;

    /**
     * The list of key-value pairs to associate with the pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The parameters required to set up a target for your pipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-targetparameters
     */
    public targetParameters: CfnPipe.PipeTargetParametersProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pipes::Pipe`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipeProps) {
        super(scope, id, { type: CfnPipe.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'source', this);
        cdk.requireProperty(props, 'target', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrCurrentState = cdk.Token.asString(this.getAtt('CurrentState', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));
        this.attrStateReason = cdk.Token.asString(this.getAtt('StateReason', cdk.ResolutionTypeHint.STRING));

        this.roleArn = props.roleArn;
        this.source = props.source;
        this.target = props.target;
        this.description = props.description;
        this.desiredState = props.desiredState;
        this.enrichment = props.enrichment;
        this.enrichmentParameters = props.enrichmentParameters;
        this.name = props.name;
        this.sourceParameters = props.sourceParameters;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pipes::Pipe", props.tags, { tagPropertyName: 'tags' });
        this.targetParameters = props.targetParameters;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipe.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            roleArn: this.roleArn,
            source: this.source,
            target: this.target,
            description: this.description,
            desiredState: this.desiredState,
            enrichment: this.enrichment,
            enrichmentParameters: this.enrichmentParameters,
            name: this.name,
            sourceParameters: this.sourceParameters,
            tags: this.tags.renderTags(),
            targetParameters: this.targetParameters,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPipePropsToCloudFormation(props);
    }
}

export namespace CfnPipe {
    /**
     * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html
     */
    export interface AwsVpcConfigurationProperty {
        /**
         * Specifies whether the task's elastic network interface receives a public IP address. You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-assignpublicip
         */
        readonly assignPublicIp?: string;
        /**
         * Specifies the security groups associated with the task. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-securitygroups
         */
        readonly securityGroups?: string[];
        /**
         * Specifies the subnets associated with the task. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-subnets
         */
        readonly subnets: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_AwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assignPublicIp', cdk.validateString)(properties.assignPublicIp));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnets', cdk.requiredValidator)(properties.subnets));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    return errors.wrap('supplied properties not correct for "AwsVpcConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.AwsVpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.AwsVpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPipeAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_AwsVpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AssignPublicIp: cdk.stringToCloudFormation(properties.assignPublicIp),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    };
}

// @ts-ignore TS6133
function CfnPipeAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.AwsVpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.AwsVpcConfigurationProperty>();
    ret.addPropertyResult('assignPublicIp', 'AssignPublicIp', properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined);
    ret.addPropertyResult('securityGroups', 'SecurityGroups', properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', cfn_parse.FromCloudFormation.getStringArray(properties.Subnets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html
     */
    export interface BatchArrayPropertiesProperty {
        /**
         * The size of the array, if this is an array batch job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html#cfn-pipes-pipe-batcharrayproperties-size
         */
        readonly size?: number;
    }
}

/**
 * Determine whether the given properties match those of a `BatchArrayPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `BatchArrayPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchArrayPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    return errors.wrap('supplied properties not correct for "BatchArrayPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchArrayProperties` resource
 *
 * @param properties - the TypeScript properties of a `BatchArrayPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchArrayProperties` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchArrayPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchArrayPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Size: cdk.numberToCloudFormation(properties.size),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchArrayPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchArrayPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchArrayPropertiesProperty>();
    ret.addPropertyResult('size', 'Size', properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The overrides that are sent to a container.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html
     */
    export interface BatchContainerOverridesProperty {
        /**
         * The command to send to the container that overrides the default command from the Docker image or the task definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-command
         */
        readonly command?: string[];
        /**
         * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.
         *
         * > Environment variables cannot start with " `AWS Batch` ". This naming convention is reserved for variables that AWS Batch sets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-environment
         */
        readonly environment?: Array<CfnPipe.BatchEnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The instance type to use for a multi-node parallel job.
         *
         * > This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-instancetype
         */
        readonly instanceType?: string;
        /**
         * The type and amount of resources to assign to a container. This overrides the settings in the job definition. The supported resources include `GPU` , `MEMORY` , and `VCPU` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-resourcerequirements
         */
        readonly resourceRequirements?: Array<CfnPipe.BatchResourceRequirementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BatchContainerOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `BatchContainerOverridesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchContainerOverridesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('command', cdk.listValidator(cdk.validateString))(properties.command));
    errors.collect(cdk.propertyValidator('environment', cdk.listValidator(CfnPipe_BatchEnvironmentVariablePropertyValidator))(properties.environment));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('resourceRequirements', cdk.listValidator(CfnPipe_BatchResourceRequirementPropertyValidator))(properties.resourceRequirements));
    return errors.wrap('supplied properties not correct for "BatchContainerOverridesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchContainerOverrides` resource
 *
 * @param properties - the TypeScript properties of a `BatchContainerOverridesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchContainerOverrides` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchContainerOverridesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchContainerOverridesPropertyValidator(properties).assertSuccess();
    return {
        Command: cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
        Environment: cdk.listMapper(cfnPipeBatchEnvironmentVariablePropertyToCloudFormation)(properties.environment),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        ResourceRequirements: cdk.listMapper(cfnPipeBatchResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchContainerOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchContainerOverridesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchContainerOverridesProperty>();
    ret.addPropertyResult('command', 'Command', properties.Command != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Command) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined);
    ret.addPropertyResult('instanceType', 'InstanceType', properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined);
    ret.addPropertyResult('resourceRequirements', 'ResourceRequirements', properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.
     *
     * > Environment variables cannot start with " `AWS Batch` ". This naming convention is reserved for variables that AWS Batch sets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html
     */
    export interface BatchEnvironmentVariableProperty {
        /**
         * The name of the key-value pair. For environment variables, this is the name of the environment variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-name
         */
        readonly name?: string;
        /**
         * The value of the key-value pair. For environment variables, this is the value of the environment variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BatchEnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `BatchEnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "BatchEnvironmentVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchEnvironmentVariable` resource
 *
 * @param properties - the TypeScript properties of a `BatchEnvironmentVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchEnvironmentVariable` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchEnvironmentVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchEnvironmentVariablePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchEnvironmentVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchEnvironmentVariableProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * An object that represents an AWS Batch job dependency.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html
     */
    export interface BatchJobDependencyProperty {
        /**
         * The job ID of the AWS Batch job that's associated with this dependency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-jobid
         */
        readonly jobId?: string;
        /**
         * The type of the job dependency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BatchJobDependencyProperty`
 *
 * @param properties - the TypeScript properties of a `BatchJobDependencyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchJobDependencyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('jobId', cdk.validateString)(properties.jobId));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "BatchJobDependencyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchJobDependency` resource
 *
 * @param properties - the TypeScript properties of a `BatchJobDependencyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchJobDependency` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchJobDependencyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchJobDependencyPropertyValidator(properties).assertSuccess();
    return {
        JobId: cdk.stringToCloudFormation(properties.jobId),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchJobDependencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchJobDependencyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchJobDependencyProperty>();
    ret.addPropertyResult('jobId', 'JobId', properties.JobId != null ? cfn_parse.FromCloudFormation.getString(properties.JobId) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The type and amount of a resource to assign to a container. The supported resources include `GPU` , `MEMORY` , and `VCPU` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html
     */
    export interface BatchResourceRequirementProperty {
        /**
         * The type of resource to assign to a container. The supported resources include `GPU` , `MEMORY` , and `VCPU` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html#cfn-pipes-pipe-batchresourcerequirement-type
         */
        readonly type: string;
        /**
         * The quantity of the specified resource to reserve for the container. The values vary based on the `type` specified.
         *
         * - **type="GPU"** - The number of physical GPUs to reserve for the container. Make sure that the number of GPUs reserved for all containers in a job doesn't exceed the number of available GPUs on the compute resource that the job is launched on.
         *
         * > GPUs aren't available for jobs that are running on Fargate resources.
         * - **type="MEMORY"** - The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
         *
         * > If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see [Memory management](https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html) in the *AWS Batch User Guide* .
         *
         * For jobs that are running on Fargate resources, then `value` is the hard limit (in MiB), and must match one of the supported values and the `VCPU` values must be one of the values supported for that memory value.
         *
         * - **value = 512** - `VCPU` = 0.25
         * - **value = 1024** - `VCPU` = 0.25 or 0.5
         * - **value = 2048** - `VCPU` = 0.25, 0.5, or 1
         * - **value = 3072** - `VCPU` = 0.5, or 1
         * - **value = 4096** - `VCPU` = 0.5, 1, or 2
         * - **value = 5120, 6144, or 7168** - `VCPU` = 1 or 2
         * - **value = 8192** - `VCPU` = 1, 2, 4, or 8
         * - **value = 9216, 10240, 11264, 12288, 13312, 14336, or 15360** - `VCPU` = 2 or 4
         * - **value = 16384** - `VCPU` = 2, 4, or 8
         * - **value = 17408, 18432, 19456, 21504, 22528, 23552, 25600, 26624, 27648, 29696, or 30720** - `VCPU` = 4
         * - **value = 20480, 24576, or 28672** - `VCPU` = 4 or 8
         * - **value = 36864, 45056, 53248, or 61440** - `VCPU` = 8
         * - **value = 32768, 40960, 49152, or 57344** - `VCPU` = 8 or 16
         * - **value = 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880** - `VCPU` = 16
         * - **type="VCPU"** - The number of vCPUs reserved for the container. This parameter maps to `CpuShares` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--cpu-shares` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once.
         *
         * The default for the Fargate On-Demand vCPU resource count quota is 6 vCPUs. For more information about Fargate quotas, see [AWS Fargate quotas](https://docs.aws.amazon.com/general/latest/gr/ecs-service.html#service-quotas-fargate) in the *AWS General Reference* .
         *
         * For jobs that are running on Fargate resources, then `value` must match one of the supported values and the `MEMORY` values must be one of the values supported for that `VCPU` value. The supported values are 0.25, 0.5, 1, 2, 4, 8, and 16
         *
         * - **value = 0.25** - `MEMORY` = 512, 1024, or 2048
         * - **value = 0.5** - `MEMORY` = 1024, 2048, 3072, or 4096
         * - **value = 1** - `MEMORY` = 2048, 3072, 4096, 5120, 6144, 7168, or 8192
         * - **value = 2** - `MEMORY` = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384
         * - **value = 4** - `MEMORY` = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720
         * - **value = 8** - `MEMORY` = 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, or 61440
         * - **value = 16** - `MEMORY` = 32768, 40960, 49152, 57344, 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html#cfn-pipes-pipe-batchresourcerequirement-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `BatchResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `BatchResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "BatchResourceRequirementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchResourceRequirement` resource
 *
 * @param properties - the TypeScript properties of a `BatchResourceRequirementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchResourceRequirement` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchResourceRequirementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchResourceRequirementPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchResourceRequirementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchResourceRequirementProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The retry strategy that's associated with a job. For more information, see [Automated job retries](https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html) in the *AWS Batch User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html
     */
    export interface BatchRetryStrategyProperty {
        /**
         * The number of times to move a job to the `RUNNABLE` status. If the value of `attempts` is greater than one, the job is retried on failure the same number of attempts as the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html#cfn-pipes-pipe-batchretrystrategy-attempts
         */
        readonly attempts?: number;
    }
}

/**
 * Determine whether the given properties match those of a `BatchRetryStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `BatchRetryStrategyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_BatchRetryStrategyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attempts', cdk.validateNumber)(properties.attempts));
    return errors.wrap('supplied properties not correct for "BatchRetryStrategyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchRetryStrategy` resource
 *
 * @param properties - the TypeScript properties of a `BatchRetryStrategyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.BatchRetryStrategy` resource.
 */
// @ts-ignore TS6133
function cfnPipeBatchRetryStrategyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_BatchRetryStrategyPropertyValidator(properties).assertSuccess();
    return {
        Attempts: cdk.numberToCloudFormation(properties.attempts),
    };
}

// @ts-ignore TS6133
function CfnPipeBatchRetryStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchRetryStrategyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchRetryStrategyProperty>();
    ret.addPropertyResult('attempts', 'Attempts', properties.Attempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.Attempts) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The details of a capacity provider strategy. To learn more, see [CapacityProviderStrategyItem](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CapacityProviderStrategyItem.html) in the Amazon ECS API Reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html
     */
    export interface CapacityProviderStrategyItemProperty {
        /**
         * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-base
         */
        readonly base?: number;
        /**
         * The short name of the capacity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-capacityprovider
         */
        readonly capacityProvider: string;
        /**
         * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-weight
         */
        readonly weight?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_CapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('base', cdk.validateNumber)(properties.base));
    errors.collect(cdk.propertyValidator('capacityProvider', cdk.requiredValidator)(properties.capacityProvider));
    errors.collect(cdk.propertyValidator('capacityProvider', cdk.validateString)(properties.capacityProvider));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "CapacityProviderStrategyItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.CapacityProviderStrategyItem` resource
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.CapacityProviderStrategyItem` resource.
 */
// @ts-ignore TS6133
function cfnPipeCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_CapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
    return {
        Base: cdk.numberToCloudFormation(properties.base),
        CapacityProvider: cdk.stringToCloudFormation(properties.capacityProvider),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnPipeCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.CapacityProviderStrategyItemProperty>();
    ret.addPropertyResult('base', 'Base', properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined);
    ret.addPropertyResult('capacityProvider', 'CapacityProvider', cfn_parse.FromCloudFormation.getString(properties.CapacityProvider));
    ret.addPropertyResult('weight', 'Weight', properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * A `DeadLetterConfig` object that contains information about a dead-letter queue configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html
     */
    export interface DeadLetterConfigProperty {
        /**
         * The ARN of the Amazon SQS queue specified as the target for the dead-letter queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html#cfn-pipes-pipe-deadletterconfig-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_DeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "DeadLetterConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.DeadLetterConfig` resource
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.DeadLetterConfig` resource.
 */
// @ts-ignore TS6133
function cfnPipeDeadLetterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_DeadLetterConfigPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.DeadLetterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.DeadLetterConfigProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The overrides that are sent to a container. An empty container override can be passed in. An example of an empty container override is `{"containerOverrides": [ ] }` . If a non-empty container override is specified, the `name` parameter must be included.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html
     */
    export interface EcsContainerOverrideProperty {
        /**
         * The command to send to the container that overrides the default command from the Docker image or the task definition. You must also specify a container name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-command
         */
        readonly command?: string[];
        /**
         * The number of `cpu` units reserved for the container, instead of the default value from the task definition. You must also specify a container name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-cpu
         */
        readonly cpu?: number;
        /**
         * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environment
         */
        readonly environment?: Array<CfnPipe.EcsEnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of files containing the environment variables to pass to a container, instead of the value from the container definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environmentfiles
         */
        readonly environmentFiles?: Array<CfnPipe.EcsEnvironmentFileProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The hard limit (in MiB) of memory to present to the container, instead of the default value from the task definition. If your container attempts to exceed the memory specified here, the container is killed. You must also specify a container name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memory
         */
        readonly memory?: number;
        /**
         * The soft limit (in MiB) of memory to reserve for the container, instead of the default value from the task definition. You must also specify a container name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memoryreservation
         */
        readonly memoryReservation?: number;
        /**
         * The name of the container that receives the override. This parameter is required if any override is specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-name
         */
        readonly name?: string;
        /**
         * The type and amount of a resource to assign to a container, instead of the default value from the task definition. The only supported resource is a GPU.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-resourcerequirements
         */
        readonly resourceRequirements?: Array<CfnPipe.EcsResourceRequirementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EcsContainerOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsContainerOverrideProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsContainerOverridePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('command', cdk.listValidator(cdk.validateString))(properties.command));
    errors.collect(cdk.propertyValidator('cpu', cdk.validateNumber)(properties.cpu));
    errors.collect(cdk.propertyValidator('environment', cdk.listValidator(CfnPipe_EcsEnvironmentVariablePropertyValidator))(properties.environment));
    errors.collect(cdk.propertyValidator('environmentFiles', cdk.listValidator(CfnPipe_EcsEnvironmentFilePropertyValidator))(properties.environmentFiles));
    errors.collect(cdk.propertyValidator('memory', cdk.validateNumber)(properties.memory));
    errors.collect(cdk.propertyValidator('memoryReservation', cdk.validateNumber)(properties.memoryReservation));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('resourceRequirements', cdk.listValidator(CfnPipe_EcsResourceRequirementPropertyValidator))(properties.resourceRequirements));
    return errors.wrap('supplied properties not correct for "EcsContainerOverrideProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsContainerOverride` resource
 *
 * @param properties - the TypeScript properties of a `EcsContainerOverrideProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsContainerOverride` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsContainerOverridePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsContainerOverridePropertyValidator(properties).assertSuccess();
    return {
        Command: cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
        Cpu: cdk.numberToCloudFormation(properties.cpu),
        Environment: cdk.listMapper(cfnPipeEcsEnvironmentVariablePropertyToCloudFormation)(properties.environment),
        EnvironmentFiles: cdk.listMapper(cfnPipeEcsEnvironmentFilePropertyToCloudFormation)(properties.environmentFiles),
        Memory: cdk.numberToCloudFormation(properties.memory),
        MemoryReservation: cdk.numberToCloudFormation(properties.memoryReservation),
        Name: cdk.stringToCloudFormation(properties.name),
        ResourceRequirements: cdk.listMapper(cfnPipeEcsResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsContainerOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsContainerOverrideProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsContainerOverrideProperty>();
    ret.addPropertyResult('command', 'Command', properties.Command != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Command) : undefined);
    ret.addPropertyResult('cpu', 'Cpu', properties.Cpu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cpu) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined);
    ret.addPropertyResult('environmentFiles', 'EnvironmentFiles', properties.EnvironmentFiles != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsEnvironmentFilePropertyFromCloudFormation)(properties.EnvironmentFiles) : undefined);
    ret.addPropertyResult('memory', 'Memory', properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined);
    ret.addPropertyResult('memoryReservation', 'MemoryReservation', properties.MemoryReservation != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryReservation) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('resourceRequirements', 'ResourceRequirements', properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * A list of files containing the environment variables to pass to a container. You can specify up to ten environment files. The file must have a `.env` file extension. Each line in an environment file should contain an environment variable in `VARIABLE=VALUE` format. Lines beginning with `#` are treated as comments and are ignored. For more information about the environment variable file syntax, see [Declare default environment variables in file](https://docs.aws.amazon.com/https://docs.docker.com/compose/env-file/) .
     *
     * If there are environment variables specified using the `environment` parameter in a container definition, they take precedence over the variables contained within an environment file. If multiple environment files are specified that contain the same variable, they're processed from the top down. We recommend that you use unique variable names. For more information, see [Specifying environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * This parameter is only supported for tasks hosted on Fargate using the following platform versions:
     *
     * - Linux platform version `1.4.0` or later.
     * - Windows platform version `1.0.0` or later.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html
     */
    export interface EcsEnvironmentFileProperty {
        /**
         * The file type to use. The only supported value is `s3` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html#cfn-pipes-pipe-ecsenvironmentfile-type
         */
        readonly type: string;
        /**
         * The Amazon Resource Name (ARN) of the Amazon S3 object containing the environment variable file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html#cfn-pipes-pipe-ecsenvironmentfile-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsEnvironmentFileProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentFileProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsEnvironmentFilePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "EcsEnvironmentFileProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEnvironmentFile` resource
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentFileProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEnvironmentFile` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsEnvironmentFilePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsEnvironmentFilePropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsEnvironmentFilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEnvironmentFileProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEnvironmentFileProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html
     */
    export interface EcsEnvironmentVariableProperty {
        /**
         * The name of the key-value pair. For environment variables, this is the name of the environment variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-name
         */
        readonly name?: string;
        /**
         * The value of the key-value pair. For environment variables, this is the value of the environment variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsEnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "EcsEnvironmentVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEnvironmentVariable` resource
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEnvironmentVariable` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsEnvironmentVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsEnvironmentVariablePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEnvironmentVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEnvironmentVariableProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The amount of ephemeral storage to allocate for the task. This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on Fargate . For more information, see [Fargate task storage](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) in the *Amazon ECS User Guide for Fargate* .
     *
     * > This parameter is only supported for tasks hosted on Fargate using Linux platform version `1.4.0` or later. This parameter is not supported for Windows containers on Fargate .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html
     */
    export interface EcsEphemeralStorageProperty {
        /**
         * The total amount, in GiB, of ephemeral storage to set for the task. The minimum supported value is `21` GiB and the maximum supported value is `200` GiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html#cfn-pipes-pipe-ecsephemeralstorage-sizeingib
         */
        readonly sizeInGiB: number;
    }
}

/**
 * Determine whether the given properties match those of a `EcsEphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sizeInGiB', cdk.requiredValidator)(properties.sizeInGiB));
    errors.collect(cdk.propertyValidator('sizeInGiB', cdk.validateNumber)(properties.sizeInGiB));
    return errors.wrap('supplied properties not correct for "EcsEphemeralStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEphemeralStorage` resource
 *
 * @param properties - the TypeScript properties of a `EcsEphemeralStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsEphemeralStorage` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsEphemeralStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsEphemeralStoragePropertyValidator(properties).assertSuccess();
    return {
        SizeInGiB: cdk.numberToCloudFormation(properties.sizeInGiB),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEphemeralStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEphemeralStorageProperty>();
    ret.addPropertyResult('sizeInGiB', 'SizeInGiB', cfn_parse.FromCloudFormation.getNumber(properties.SizeInGiB));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * Details on an Elastic Inference accelerator task override. This parameter is used to override the Elastic Inference accelerator specified in the task definition. For more information, see [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html
     */
    export interface EcsInferenceAcceleratorOverrideProperty {
        /**
         * The Elastic Inference accelerator device name to override for the task. This parameter must match a `deviceName` specified in the task definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicename
         */
        readonly deviceName?: string;
        /**
         * The Elastic Inference accelerator type to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicetype
         */
        readonly deviceType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsInferenceAcceleratorOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsInferenceAcceleratorOverrideProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsInferenceAcceleratorOverridePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceName', cdk.validateString)(properties.deviceName));
    errors.collect(cdk.propertyValidator('deviceType', cdk.validateString)(properties.deviceType));
    return errors.wrap('supplied properties not correct for "EcsInferenceAcceleratorOverrideProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsInferenceAcceleratorOverride` resource
 *
 * @param properties - the TypeScript properties of a `EcsInferenceAcceleratorOverrideProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsInferenceAcceleratorOverride` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsInferenceAcceleratorOverridePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsInferenceAcceleratorOverridePropertyValidator(properties).assertSuccess();
    return {
        DeviceName: cdk.stringToCloudFormation(properties.deviceName),
        DeviceType: cdk.stringToCloudFormation(properties.deviceType),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsInferenceAcceleratorOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsInferenceAcceleratorOverrideProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsInferenceAcceleratorOverrideProperty>();
    ret.addPropertyResult('deviceName', 'DeviceName', properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined);
    ret.addPropertyResult('deviceType', 'DeviceType', properties.DeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The type and amount of a resource to assign to a container. The supported resource types are GPUs and Elastic Inference accelerators. For more information, see [Working with GPUs on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html) or [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html
     */
    export interface EcsResourceRequirementProperty {
        /**
         * The type of resource to assign to a container. The supported values are `GPU` or `InferenceAccelerator` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html#cfn-pipes-pipe-ecsresourcerequirement-type
         */
        readonly type: string;
        /**
         * The value for the specified resource type.
         *
         * If the `GPU` type is used, the value is the number of physical `GPUs` the Amazon ECS container agent reserves for the container. The number of GPUs that's reserved for all containers in a task can't exceed the number of available GPUs on the container instance that the task is launched on.
         *
         * If the `InferenceAccelerator` type is used, the `value` matches the `deviceName` for an InferenceAccelerator specified in a task definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html#cfn-pipes-pipe-ecsresourcerequirement-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `EcsResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "EcsResourceRequirementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsResourceRequirement` resource
 *
 * @param properties - the TypeScript properties of a `EcsResourceRequirementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsResourceRequirement` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsResourceRequirementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsResourceRequirementPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsResourceRequirementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsResourceRequirementProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The overrides that are associated with a task.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html
     */
    export interface EcsTaskOverrideProperty {
        /**
         * One or more container overrides that are sent to a task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-containeroverrides
         */
        readonly containerOverrides?: Array<CfnPipe.EcsContainerOverrideProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The cpu override for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-cpu
         */
        readonly cpu?: string;
        /**
         * The ephemeral storage setting override for the task.
         *
         * > This parameter is only supported for tasks hosted on Fargate that use the following platform versions:
         * >
         * > - Linux platform version `1.4.0` or later.
         * > - Windows platform version `1.0.0` or later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-ephemeralstorage
         */
        readonly ephemeralStorage?: CfnPipe.EcsEphemeralStorageProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the task execution IAM role override for the task. For more information, see [Amazon ECS task execution IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) in the *Amazon Elastic Container Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-executionrolearn
         */
        readonly executionRoleArn?: string;
        /**
         * The Elastic Inference accelerator override for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-inferenceacceleratoroverrides
         */
        readonly inferenceAcceleratorOverrides?: Array<CfnPipe.EcsInferenceAcceleratorOverrideProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The memory override for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-memory
         */
        readonly memory?: string;
        /**
         * The Amazon Resource Name (ARN) of the IAM role that containers in this task can assume. All containers in this task are granted the permissions that are specified in this role. For more information, see [IAM Role for Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-taskrolearn
         */
        readonly taskRoleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsTaskOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsTaskOverrideProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_EcsTaskOverridePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerOverrides', cdk.listValidator(CfnPipe_EcsContainerOverridePropertyValidator))(properties.containerOverrides));
    errors.collect(cdk.propertyValidator('cpu', cdk.validateString)(properties.cpu));
    errors.collect(cdk.propertyValidator('ephemeralStorage', CfnPipe_EcsEphemeralStoragePropertyValidator)(properties.ephemeralStorage));
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.validateString)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('inferenceAcceleratorOverrides', cdk.listValidator(CfnPipe_EcsInferenceAcceleratorOverridePropertyValidator))(properties.inferenceAcceleratorOverrides));
    errors.collect(cdk.propertyValidator('memory', cdk.validateString)(properties.memory));
    errors.collect(cdk.propertyValidator('taskRoleArn', cdk.validateString)(properties.taskRoleArn));
    return errors.wrap('supplied properties not correct for "EcsTaskOverrideProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsTaskOverride` resource
 *
 * @param properties - the TypeScript properties of a `EcsTaskOverrideProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.EcsTaskOverride` resource.
 */
// @ts-ignore TS6133
function cfnPipeEcsTaskOverridePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_EcsTaskOverridePropertyValidator(properties).assertSuccess();
    return {
        ContainerOverrides: cdk.listMapper(cfnPipeEcsContainerOverridePropertyToCloudFormation)(properties.containerOverrides),
        Cpu: cdk.stringToCloudFormation(properties.cpu),
        EphemeralStorage: cfnPipeEcsEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
        ExecutionRoleArn: cdk.stringToCloudFormation(properties.executionRoleArn),
        InferenceAcceleratorOverrides: cdk.listMapper(cfnPipeEcsInferenceAcceleratorOverridePropertyToCloudFormation)(properties.inferenceAcceleratorOverrides),
        Memory: cdk.stringToCloudFormation(properties.memory),
        TaskRoleArn: cdk.stringToCloudFormation(properties.taskRoleArn),
    };
}

// @ts-ignore TS6133
function CfnPipeEcsTaskOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsTaskOverrideProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsTaskOverrideProperty>();
    ret.addPropertyResult('containerOverrides', 'ContainerOverrides', properties.ContainerOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsContainerOverridePropertyFromCloudFormation)(properties.ContainerOverrides) : undefined);
    ret.addPropertyResult('cpu', 'Cpu', properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined);
    ret.addPropertyResult('ephemeralStorage', 'EphemeralStorage', properties.EphemeralStorage != null ? CfnPipeEcsEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined);
    ret.addPropertyResult('executionRoleArn', 'ExecutionRoleArn', properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined);
    ret.addPropertyResult('inferenceAcceleratorOverrides', 'InferenceAcceleratorOverrides', properties.InferenceAcceleratorOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsInferenceAcceleratorOverridePropertyFromCloudFormation)(properties.InferenceAcceleratorOverrides) : undefined);
    ret.addPropertyResult('memory', 'Memory', properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined);
    ret.addPropertyResult('taskRoleArn', 'TaskRoleArn', properties.TaskRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * Filter events using an event pattern. For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filter.html
     */
    export interface FilterProperty {
        /**
         * The event pattern.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filter.html#cfn-pipes-pipe-filter-pattern
         */
        readonly pattern?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pattern', cdk.validateString)(properties.pattern));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.Filter` resource.
 */
// @ts-ignore TS6133
function cfnPipeFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_FilterPropertyValidator(properties).assertSuccess();
    return {
        Pattern: cdk.stringToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnPipeFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.FilterProperty>();
    ret.addPropertyResult('pattern', 'Pattern', properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The collection of event patterns used to filter events. For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filtercriteria.html
     */
    export interface FilterCriteriaProperty {
        /**
         * The event patterns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filtercriteria.html#cfn-pipes-pipe-filtercriteria-filters
         */
        readonly filters?: Array<CfnPipe.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_FilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnPipe_FilterPropertyValidator))(properties.filters));
    return errors.wrap('supplied properties not correct for "FilterCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.FilterCriteria` resource
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.FilterCriteria` resource.
 */
// @ts-ignore TS6133
function cfnPipeFilterCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_FilterCriteriaPropertyValidator(properties).assertSuccess();
    return {
        Filters: cdk.listMapper(cfnPipeFilterPropertyToCloudFormation)(properties.filters),
    };
}

// @ts-ignore TS6133
function CfnPipeFilterCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.FilterCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.FilterCriteriaProperty>();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeFilterPropertyFromCloudFormation)(properties.Filters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The AWS Secrets Manager secret that stores your broker credentials.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html
     */
    export interface MQBrokerAccessCredentialsProperty {
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html#cfn-pipes-pipe-mqbrokeraccesscredentials-basicauth
         */
        readonly basicAuth: string;
    }
}

/**
 * Determine whether the given properties match those of a `MQBrokerAccessCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `MQBrokerAccessCredentialsProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_MQBrokerAccessCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('basicAuth', cdk.requiredValidator)(properties.basicAuth));
    errors.collect(cdk.propertyValidator('basicAuth', cdk.validateString)(properties.basicAuth));
    return errors.wrap('supplied properties not correct for "MQBrokerAccessCredentialsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.MQBrokerAccessCredentials` resource
 *
 * @param properties - the TypeScript properties of a `MQBrokerAccessCredentialsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.MQBrokerAccessCredentials` resource.
 */
// @ts-ignore TS6133
function cfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_MQBrokerAccessCredentialsPropertyValidator(properties).assertSuccess();
    return {
        BasicAuth: cdk.stringToCloudFormation(properties.basicAuth),
    };
}

// @ts-ignore TS6133
function CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.MQBrokerAccessCredentialsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.MQBrokerAccessCredentialsProperty>();
    ret.addPropertyResult('basicAuth', 'BasicAuth', cfn_parse.FromCloudFormation.getString(properties.BasicAuth));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The AWS Secrets Manager secret that stores your stream credentials.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html
     */
    export interface MSKAccessCredentialsProperty {
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-clientcertificatetlsauth
         */
        readonly clientCertificateTlsAuth?: string;
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-saslscram512auth
         */
        readonly saslScram512Auth?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MSKAccessCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `MSKAccessCredentialsProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_MSKAccessCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientCertificateTlsAuth', cdk.validateString)(properties.clientCertificateTlsAuth));
    errors.collect(cdk.propertyValidator('saslScram512Auth', cdk.validateString)(properties.saslScram512Auth));
    return errors.wrap('supplied properties not correct for "MSKAccessCredentialsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.MSKAccessCredentials` resource
 *
 * @param properties - the TypeScript properties of a `MSKAccessCredentialsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.MSKAccessCredentials` resource.
 */
// @ts-ignore TS6133
function cfnPipeMSKAccessCredentialsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_MSKAccessCredentialsPropertyValidator(properties).assertSuccess();
    return {
        ClientCertificateTlsAuth: cdk.stringToCloudFormation(properties.clientCertificateTlsAuth),
        SaslScram512Auth: cdk.stringToCloudFormation(properties.saslScram512Auth),
    };
}

// @ts-ignore TS6133
function CfnPipeMSKAccessCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.MSKAccessCredentialsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.MSKAccessCredentialsProperty>();
    ret.addPropertyResult('clientCertificateTlsAuth', 'ClientCertificateTlsAuth', properties.ClientCertificateTlsAuth != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateTlsAuth) : undefined);
    ret.addPropertyResult('saslScram512Auth', 'SaslScram512Auth', properties.SaslScram512Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram512Auth) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * This structure specifies the network configuration for an Amazon ECS task.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html
     */
    export interface NetworkConfigurationProperty {
        /**
         * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html#cfn-pipes-pipe-networkconfiguration-awsvpcconfiguration
         */
        readonly awsvpcConfiguration?: CfnPipe.AwsVpcConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_NetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsvpcConfiguration', CfnPipe_AwsVpcConfigurationPropertyValidator)(properties.awsvpcConfiguration));
    return errors.wrap('supplied properties not correct for "NetworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.NetworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.NetworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPipeNetworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_NetworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AwsvpcConfiguration: cfnPipeAwsVpcConfigurationPropertyToCloudFormation(properties.awsvpcConfiguration),
    };
}

// @ts-ignore TS6133
function CfnPipeNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.NetworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.NetworkConfigurationProperty>();
    ret.addPropertyResult('awsvpcConfiguration', 'AwsvpcConfiguration', properties.AwsvpcConfiguration != null ? CfnPipeAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsvpcConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations. In the latter case, these are merged with any InvocationParameters specified on the Connection, with any values from the Connection taking precedence.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html
     */
    export interface PipeEnrichmentHttpParametersProperty {
        /**
         * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-headerparameters
         */
        readonly headerParameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-pathparametervalues
         */
        readonly pathParameterValues?: string[];
        /**
         * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-querystringparameters
         */
        readonly queryStringParameters?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeEnrichmentHttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentHttpParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeEnrichmentHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headerParameters', cdk.hashValidator(cdk.validateString))(properties.headerParameters));
    errors.collect(cdk.propertyValidator('pathParameterValues', cdk.listValidator(cdk.validateString))(properties.pathParameterValues));
    errors.collect(cdk.propertyValidator('queryStringParameters', cdk.hashValidator(cdk.validateString))(properties.queryStringParameters));
    return errors.wrap('supplied properties not correct for "PipeEnrichmentHttpParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeEnrichmentHttpParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentHttpParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeEnrichmentHttpParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeEnrichmentHttpParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeEnrichmentHttpParametersPropertyValidator(properties).assertSuccess();
    return {
        HeaderParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.headerParameters),
        PathParameterValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.pathParameterValues),
        QueryStringParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.queryStringParameters),
    };
}

// @ts-ignore TS6133
function CfnPipePipeEnrichmentHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeEnrichmentHttpParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeEnrichmentHttpParametersProperty>();
    ret.addPropertyResult('headerParameters', 'HeaderParameters', properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.HeaderParameters) : undefined);
    ret.addPropertyResult('pathParameterValues', 'PathParameterValues', properties.PathParameterValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PathParameterValues) : undefined);
    ret.addPropertyResult('queryStringParameters', 'QueryStringParameters', properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.QueryStringParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters required to set up enrichment on your pipe.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html
     */
    export interface PipeEnrichmentParametersProperty {
        /**
         * Contains the HTTP parameters to use when the target is a API Gateway REST endpoint or EventBridge ApiDestination.
         *
         * If you specify an API Gateway REST API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-httpparameters
         */
        readonly httpParameters?: CfnPipe.PipeEnrichmentHttpParametersProperty | cdk.IResolvable;
        /**
         * Valid JSON text passed to the enrichment. In this case, nothing from the event itself is passed to the enrichment. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-inputtemplate
         */
        readonly inputTemplate?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeEnrichmentParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeEnrichmentParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpParameters', CfnPipe_PipeEnrichmentHttpParametersPropertyValidator)(properties.httpParameters));
    errors.collect(cdk.propertyValidator('inputTemplate', cdk.validateString)(properties.inputTemplate));
    return errors.wrap('supplied properties not correct for "PipeEnrichmentParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeEnrichmentParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeEnrichmentParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeEnrichmentParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeEnrichmentParametersPropertyValidator(properties).assertSuccess();
    return {
        HttpParameters: cfnPipePipeEnrichmentHttpParametersPropertyToCloudFormation(properties.httpParameters),
        InputTemplate: cdk.stringToCloudFormation(properties.inputTemplate),
    };
}

// @ts-ignore TS6133
function CfnPipePipeEnrichmentParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeEnrichmentParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeEnrichmentParametersProperty>();
    ret.addPropertyResult('httpParameters', 'HttpParameters', properties.HttpParameters != null ? CfnPipePipeEnrichmentHttpParametersPropertyFromCloudFormation(properties.HttpParameters) : undefined);
    ret.addPropertyResult('inputTemplate', 'InputTemplate', properties.InputTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.InputTemplate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an Active MQ broker as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html
     */
    export interface PipeSourceActiveMQBrokerParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * The credentials needed to access the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-credentials
         */
        readonly credentials: CfnPipe.MQBrokerAccessCredentialsProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * The name of the destination queue to consume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-queuename
         */
        readonly queueName: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceActiveMQBrokerParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceActiveMQBrokerParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceActiveMQBrokerParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('credentials', cdk.requiredValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('credentials', CfnPipe_MQBrokerAccessCredentialsPropertyValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('queueName', cdk.requiredValidator)(properties.queueName));
    errors.collect(cdk.propertyValidator('queueName', cdk.validateString)(properties.queueName));
    return errors.wrap('supplied properties not correct for "PipeSourceActiveMQBrokerParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceActiveMQBrokerParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceActiveMQBrokerParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceActiveMQBrokerParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceActiveMQBrokerParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceActiveMQBrokerParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        Credentials: cfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties.credentials),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        QueueName: cdk.stringToCloudFormation(properties.queueName),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceActiveMQBrokerParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceActiveMQBrokerParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceActiveMQBrokerParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('credentials', 'Credentials', CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties.Credentials));
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('queueName', 'QueueName', cfn_parse.FromCloudFormation.getString(properties.QueueName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a DynamoDB stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html
     */
    export interface PipeSourceDynamoDBStreamParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * Define the target queue to send dead-letter queue events to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-deadletterconfig
         */
        readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumrecordageinseconds
         */
        readonly maximumRecordAgeInSeconds?: number;
        /**
         * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumretryattempts
         */
        readonly maximumRetryAttempts?: number;
        /**
         * (Streams only) Define how to handle item process failures. `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-onpartialbatchitemfailure
         */
        readonly onPartialBatchItemFailure?: string;
        /**
         * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-parallelizationfactor
         */
        readonly parallelizationFactor?: number;
        /**
         * (Streams only) The position in a stream from which to start reading.
         *
         * *Valid values* : `TRIM_HORIZON | LATEST`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
         */
        readonly startingPosition: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceDynamoDBStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceDynamoDBStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceDynamoDBStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('deadLetterConfig', CfnPipe_DeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('maximumRecordAgeInSeconds', cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    errors.collect(cdk.propertyValidator('onPartialBatchItemFailure', cdk.validateString)(properties.onPartialBatchItemFailure));
    errors.collect(cdk.propertyValidator('parallelizationFactor', cdk.validateNumber)(properties.parallelizationFactor));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.requiredValidator)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    return errors.wrap('supplied properties not correct for "PipeSourceDynamoDBStreamParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceDynamoDBStreamParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceDynamoDBStreamParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceDynamoDBStreamParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceDynamoDBStreamParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceDynamoDBStreamParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        DeadLetterConfig: cfnPipeDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        MaximumRecordAgeInSeconds: cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
        OnPartialBatchItemFailure: cdk.stringToCloudFormation(properties.onPartialBatchItemFailure),
        ParallelizationFactor: cdk.numberToCloudFormation(properties.parallelizationFactor),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceDynamoDBStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceDynamoDBStreamParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceDynamoDBStreamParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('deadLetterConfig', 'DeadLetterConfig', properties.DeadLetterConfig != null ? CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('maximumRecordAgeInSeconds', 'MaximumRecordAgeInSeconds', properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addPropertyResult('onPartialBatchItemFailure', 'OnPartialBatchItemFailure', properties.OnPartialBatchItemFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnPartialBatchItemFailure) : undefined);
    ret.addPropertyResult('parallelizationFactor', 'ParallelizationFactor', properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', cfn_parse.FromCloudFormation.getString(properties.StartingPosition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Kinesis stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html
     */
    export interface PipeSourceKinesisStreamParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * Define the target queue to send dead-letter queue events to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
         */
        readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
         */
        readonly maximumRecordAgeInSeconds?: number;
        /**
         * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
         */
        readonly maximumRetryAttempts?: number;
        /**
         * (Streams only) Define how to handle item process failures. `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
         */
        readonly onPartialBatchItemFailure?: string;
        /**
         * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
         */
        readonly parallelizationFactor?: number;
        /**
         * (Streams only) The position in a stream from which to start reading.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
         */
        readonly startingPosition: string;
        /**
         * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
         */
        readonly startingPositionTimestamp?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceKinesisStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceKinesisStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceKinesisStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('deadLetterConfig', CfnPipe_DeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('maximumRecordAgeInSeconds', cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    errors.collect(cdk.propertyValidator('onPartialBatchItemFailure', cdk.validateString)(properties.onPartialBatchItemFailure));
    errors.collect(cdk.propertyValidator('parallelizationFactor', cdk.validateNumber)(properties.parallelizationFactor));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.requiredValidator)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPositionTimestamp', cdk.validateString)(properties.startingPositionTimestamp));
    return errors.wrap('supplied properties not correct for "PipeSourceKinesisStreamParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceKinesisStreamParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceKinesisStreamParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceKinesisStreamParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceKinesisStreamParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceKinesisStreamParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        DeadLetterConfig: cfnPipeDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        MaximumRecordAgeInSeconds: cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
        OnPartialBatchItemFailure: cdk.stringToCloudFormation(properties.onPartialBatchItemFailure),
        ParallelizationFactor: cdk.numberToCloudFormation(properties.parallelizationFactor),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        StartingPositionTimestamp: cdk.stringToCloudFormation(properties.startingPositionTimestamp),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceKinesisStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceKinesisStreamParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceKinesisStreamParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('deadLetterConfig', 'DeadLetterConfig', properties.DeadLetterConfig != null ? CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('maximumRecordAgeInSeconds', 'MaximumRecordAgeInSeconds', properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addPropertyResult('onPartialBatchItemFailure', 'OnPartialBatchItemFailure', properties.OnPartialBatchItemFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnPartialBatchItemFailure) : undefined);
    ret.addPropertyResult('parallelizationFactor', 'ParallelizationFactor', properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', cfn_parse.FromCloudFormation.getString(properties.StartingPosition));
    ret.addPropertyResult('startingPositionTimestamp', 'StartingPositionTimestamp', properties.StartingPositionTimestamp != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPositionTimestamp) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an MSK stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html
     */
    export interface PipeSourceManagedStreamingKafkaParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * The name of the destination queue to consume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-consumergroupid
         */
        readonly consumerGroupId?: string;
        /**
         * The credentials needed to access the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-credentials
         */
        readonly credentials?: CfnPipe.MSKAccessCredentialsProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * (Streams only) The position in a stream from which to start reading.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-startingposition
         */
        readonly startingPosition?: string;
        /**
         * The name of the topic that the pipe will read from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-topicname
         */
        readonly topicName: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceManagedStreamingKafkaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceManagedStreamingKafkaParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceManagedStreamingKafkaParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('consumerGroupId', cdk.validateString)(properties.consumerGroupId));
    errors.collect(cdk.propertyValidator('credentials', CfnPipe_MSKAccessCredentialsPropertyValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('topicName', cdk.requiredValidator)(properties.topicName));
    errors.collect(cdk.propertyValidator('topicName', cdk.validateString)(properties.topicName));
    return errors.wrap('supplied properties not correct for "PipeSourceManagedStreamingKafkaParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceManagedStreamingKafkaParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceManagedStreamingKafkaParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceManagedStreamingKafkaParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceManagedStreamingKafkaParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceManagedStreamingKafkaParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        ConsumerGroupID: cdk.stringToCloudFormation(properties.consumerGroupId),
        Credentials: cfnPipeMSKAccessCredentialsPropertyToCloudFormation(properties.credentials),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        TopicName: cdk.stringToCloudFormation(properties.topicName),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceManagedStreamingKafkaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('consumerGroupId', 'ConsumerGroupID', properties.ConsumerGroupID != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupID) : undefined);
    ret.addPropertyResult('credentials', 'Credentials', properties.Credentials != null ? CfnPipeMSKAccessCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined);
    ret.addPropertyResult('topicName', 'TopicName', cfn_parse.FromCloudFormation.getString(properties.TopicName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters required to set up a source for your pipe.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html
     */
    export interface PipeSourceParametersProperty {
        /**
         * The parameters for using an Active MQ broker as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-activemqbrokerparameters
         */
        readonly activeMqBrokerParameters?: CfnPipe.PipeSourceActiveMQBrokerParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a DynamoDB stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-dynamodbstreamparameters
         */
        readonly dynamoDbStreamParameters?: CfnPipe.PipeSourceDynamoDBStreamParametersProperty | cdk.IResolvable;
        /**
         * The collection of event patterns used to filter events. For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-filtercriteria
         */
        readonly filterCriteria?: CfnPipe.FilterCriteriaProperty | cdk.IResolvable;
        /**
         * The parameters for using a Kinesis stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-kinesisstreamparameters
         */
        readonly kinesisStreamParameters?: CfnPipe.PipeSourceKinesisStreamParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using an MSK stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-managedstreamingkafkaparameters
         */
        readonly managedStreamingKafkaParameters?: CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a Rabbit MQ broker as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-rabbitmqbrokerparameters
         */
        readonly rabbitMqBrokerParameters?: CfnPipe.PipeSourceRabbitMQBrokerParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a self-managed Apache Kafka stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-selfmanagedkafkaparameters
         */
        readonly selfManagedKafkaParameters?: CfnPipe.PipeSourceSelfManagedKafkaParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a Amazon SQS stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-sqsqueueparameters
         */
        readonly sqsQueueParameters?: CfnPipe.PipeSourceSqsQueueParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activeMqBrokerParameters', CfnPipe_PipeSourceActiveMQBrokerParametersPropertyValidator)(properties.activeMqBrokerParameters));
    errors.collect(cdk.propertyValidator('dynamoDbStreamParameters', CfnPipe_PipeSourceDynamoDBStreamParametersPropertyValidator)(properties.dynamoDbStreamParameters));
    errors.collect(cdk.propertyValidator('filterCriteria', CfnPipe_FilterCriteriaPropertyValidator)(properties.filterCriteria));
    errors.collect(cdk.propertyValidator('kinesisStreamParameters', CfnPipe_PipeSourceKinesisStreamParametersPropertyValidator)(properties.kinesisStreamParameters));
    errors.collect(cdk.propertyValidator('managedStreamingKafkaParameters', CfnPipe_PipeSourceManagedStreamingKafkaParametersPropertyValidator)(properties.managedStreamingKafkaParameters));
    errors.collect(cdk.propertyValidator('rabbitMqBrokerParameters', CfnPipe_PipeSourceRabbitMQBrokerParametersPropertyValidator)(properties.rabbitMqBrokerParameters));
    errors.collect(cdk.propertyValidator('selfManagedKafkaParameters', CfnPipe_PipeSourceSelfManagedKafkaParametersPropertyValidator)(properties.selfManagedKafkaParameters));
    errors.collect(cdk.propertyValidator('sqsQueueParameters', CfnPipe_PipeSourceSqsQueueParametersPropertyValidator)(properties.sqsQueueParameters));
    return errors.wrap('supplied properties not correct for "PipeSourceParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceParametersPropertyValidator(properties).assertSuccess();
    return {
        ActiveMQBrokerParameters: cfnPipePipeSourceActiveMQBrokerParametersPropertyToCloudFormation(properties.activeMqBrokerParameters),
        DynamoDBStreamParameters: cfnPipePipeSourceDynamoDBStreamParametersPropertyToCloudFormation(properties.dynamoDbStreamParameters),
        FilterCriteria: cfnPipeFilterCriteriaPropertyToCloudFormation(properties.filterCriteria),
        KinesisStreamParameters: cfnPipePipeSourceKinesisStreamParametersPropertyToCloudFormation(properties.kinesisStreamParameters),
        ManagedStreamingKafkaParameters: cfnPipePipeSourceManagedStreamingKafkaParametersPropertyToCloudFormation(properties.managedStreamingKafkaParameters),
        RabbitMQBrokerParameters: cfnPipePipeSourceRabbitMQBrokerParametersPropertyToCloudFormation(properties.rabbitMqBrokerParameters),
        SelfManagedKafkaParameters: cfnPipePipeSourceSelfManagedKafkaParametersPropertyToCloudFormation(properties.selfManagedKafkaParameters),
        SqsQueueParameters: cfnPipePipeSourceSqsQueueParametersPropertyToCloudFormation(properties.sqsQueueParameters),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceParametersProperty>();
    ret.addPropertyResult('activeMqBrokerParameters', 'ActiveMQBrokerParameters', properties.ActiveMQBrokerParameters != null ? CfnPipePipeSourceActiveMQBrokerParametersPropertyFromCloudFormation(properties.ActiveMQBrokerParameters) : undefined);
    ret.addPropertyResult('dynamoDbStreamParameters', 'DynamoDBStreamParameters', properties.DynamoDBStreamParameters != null ? CfnPipePipeSourceDynamoDBStreamParametersPropertyFromCloudFormation(properties.DynamoDBStreamParameters) : undefined);
    ret.addPropertyResult('filterCriteria', 'FilterCriteria', properties.FilterCriteria != null ? CfnPipeFilterCriteriaPropertyFromCloudFormation(properties.FilterCriteria) : undefined);
    ret.addPropertyResult('kinesisStreamParameters', 'KinesisStreamParameters', properties.KinesisStreamParameters != null ? CfnPipePipeSourceKinesisStreamParametersPropertyFromCloudFormation(properties.KinesisStreamParameters) : undefined);
    ret.addPropertyResult('managedStreamingKafkaParameters', 'ManagedStreamingKafkaParameters', properties.ManagedStreamingKafkaParameters != null ? CfnPipePipeSourceManagedStreamingKafkaParametersPropertyFromCloudFormation(properties.ManagedStreamingKafkaParameters) : undefined);
    ret.addPropertyResult('rabbitMqBrokerParameters', 'RabbitMQBrokerParameters', properties.RabbitMQBrokerParameters != null ? CfnPipePipeSourceRabbitMQBrokerParametersPropertyFromCloudFormation(properties.RabbitMQBrokerParameters) : undefined);
    ret.addPropertyResult('selfManagedKafkaParameters', 'SelfManagedKafkaParameters', properties.SelfManagedKafkaParameters != null ? CfnPipePipeSourceSelfManagedKafkaParametersPropertyFromCloudFormation(properties.SelfManagedKafkaParameters) : undefined);
    ret.addPropertyResult('sqsQueueParameters', 'SqsQueueParameters', properties.SqsQueueParameters != null ? CfnPipePipeSourceSqsQueueParametersPropertyFromCloudFormation(properties.SqsQueueParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Rabbit MQ broker as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html
     */
    export interface PipeSourceRabbitMQBrokerParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * The credentials needed to access the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-credentials
         */
        readonly credentials: CfnPipe.MQBrokerAccessCredentialsProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * The name of the destination queue to consume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-queuename
         */
        readonly queueName: string;
        /**
         * The name of the virtual host associated with the source broker.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-virtualhost
         */
        readonly virtualHost?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceRabbitMQBrokerParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceRabbitMQBrokerParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceRabbitMQBrokerParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('credentials', cdk.requiredValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('credentials', CfnPipe_MQBrokerAccessCredentialsPropertyValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('queueName', cdk.requiredValidator)(properties.queueName));
    errors.collect(cdk.propertyValidator('queueName', cdk.validateString)(properties.queueName));
    errors.collect(cdk.propertyValidator('virtualHost', cdk.validateString)(properties.virtualHost));
    return errors.wrap('supplied properties not correct for "PipeSourceRabbitMQBrokerParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceRabbitMQBrokerParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceRabbitMQBrokerParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceRabbitMQBrokerParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceRabbitMQBrokerParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceRabbitMQBrokerParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        Credentials: cfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties.credentials),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        QueueName: cdk.stringToCloudFormation(properties.queueName),
        VirtualHost: cdk.stringToCloudFormation(properties.virtualHost),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceRabbitMQBrokerParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceRabbitMQBrokerParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceRabbitMQBrokerParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('credentials', 'Credentials', CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties.Credentials));
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('queueName', 'QueueName', cfn_parse.FromCloudFormation.getString(properties.QueueName));
    ret.addPropertyResult('virtualHost', 'VirtualHost', properties.VirtualHost != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualHost) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a self-managed Apache Kafka stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html
     */
    export interface PipeSourceSelfManagedKafkaParametersProperty {
        /**
         * An array of server URLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-additionalbootstrapservers
         */
        readonly additionalBootstrapServers?: string[];
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * The name of the destination queue to consume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-consumergroupid
         */
        readonly consumerGroupId?: string;
        /**
         * The credentials needed to access the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-credentials
         */
        readonly credentials?: CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty | cdk.IResolvable;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * The ARN of the Secrets Manager secret used for certification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-serverrootcacertificate
         */
        readonly serverRootCaCertificate?: string;
        /**
         * (Streams only) The position in a stream from which to start reading.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-startingposition
         */
        readonly startingPosition?: string;
        /**
         * The name of the topic that the pipe will read from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-topicname
         */
        readonly topicName: string;
        /**
         * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-vpc
         */
        readonly vpc?: CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceSelfManagedKafkaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceSelfManagedKafkaParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceSelfManagedKafkaParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalBootstrapServers', cdk.listValidator(cdk.validateString))(properties.additionalBootstrapServers));
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('consumerGroupId', cdk.validateString)(properties.consumerGroupId));
    errors.collect(cdk.propertyValidator('credentials', CfnPipe_SelfManagedKafkaAccessConfigurationCredentialsPropertyValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('serverRootCaCertificate', cdk.validateString)(properties.serverRootCaCertificate));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('topicName', cdk.requiredValidator)(properties.topicName));
    errors.collect(cdk.propertyValidator('topicName', cdk.validateString)(properties.topicName));
    errors.collect(cdk.propertyValidator('vpc', CfnPipe_SelfManagedKafkaAccessConfigurationVpcPropertyValidator)(properties.vpc));
    return errors.wrap('supplied properties not correct for "PipeSourceSelfManagedKafkaParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceSelfManagedKafkaParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceSelfManagedKafkaParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceSelfManagedKafkaParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceSelfManagedKafkaParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceSelfManagedKafkaParametersPropertyValidator(properties).assertSuccess();
    return {
        AdditionalBootstrapServers: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalBootstrapServers),
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        ConsumerGroupID: cdk.stringToCloudFormation(properties.consumerGroupId),
        Credentials: cfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyToCloudFormation(properties.credentials),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        ServerRootCaCertificate: cdk.stringToCloudFormation(properties.serverRootCaCertificate),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        TopicName: cdk.stringToCloudFormation(properties.topicName),
        Vpc: cfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyToCloudFormation(properties.vpc),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceSelfManagedKafkaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceSelfManagedKafkaParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceSelfManagedKafkaParametersProperty>();
    ret.addPropertyResult('additionalBootstrapServers', 'AdditionalBootstrapServers', properties.AdditionalBootstrapServers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalBootstrapServers) : undefined);
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('consumerGroupId', 'ConsumerGroupID', properties.ConsumerGroupID != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupID) : undefined);
    ret.addPropertyResult('credentials', 'Credentials', properties.Credentials != null ? CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('serverRootCaCertificate', 'ServerRootCaCertificate', properties.ServerRootCaCertificate != null ? cfn_parse.FromCloudFormation.getString(properties.ServerRootCaCertificate) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined);
    ret.addPropertyResult('topicName', 'TopicName', cfn_parse.FromCloudFormation.getString(properties.TopicName));
    ret.addPropertyResult('vpc', 'Vpc', properties.Vpc != null ? CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyFromCloudFormation(properties.Vpc) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Amazon SQS stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html
     */
    export interface PipeSourceSqsQueueParametersProperty {
        /**
         * The maximum number of records to include in each batch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-batchsize
         */
        readonly batchSize?: number;
        /**
         * The maximum length of a time to wait for events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-maximumbatchingwindowinseconds
         */
        readonly maximumBatchingWindowInSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `PipeSourceSqsQueueParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceSqsQueueParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeSourceSqsQueueParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    return errors.wrap('supplied properties not correct for "PipeSourceSqsQueueParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceSqsQueueParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeSourceSqsQueueParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeSourceSqsQueueParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeSourceSqsQueueParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeSourceSqsQueueParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    };
}

// @ts-ignore TS6133
function CfnPipePipeSourceSqsQueueParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeSourceSqsQueueParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceSqsQueueParametersProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an AWS Batch job as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html
     */
    export interface PipeTargetBatchJobParametersProperty {
        /**
         * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-arrayproperties
         */
        readonly arrayProperties?: CfnPipe.BatchArrayPropertiesProperty | cdk.IResolvable;
        /**
         * The overrides that are sent to a container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-containeroverrides
         */
        readonly containerOverrides?: CfnPipe.BatchContainerOverridesProperty | cdk.IResolvable;
        /**
         * A list of dependencies for the job. A job can depend upon a maximum of 20 jobs. You can specify a `SEQUENTIAL` type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an `N_TO_N` type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-dependson
         */
        readonly dependsOn?: Array<CfnPipe.BatchJobDependencyProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The job definition used by this job. This value can be one of `name` , `name:revision` , or the Amazon Resource Name (ARN) for the job definition. If name is specified without a revision then the latest active revision is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-jobdefinition
         */
        readonly jobDefinition: string;
        /**
         * The name of the job. It can be up to 128 letters long. The first character must be alphanumeric, can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-jobname
         */
        readonly jobName: string;
        /**
         * Additional parameters passed to the job that replace parameter substitution placeholders that are set in the job definition. Parameters are specified as a key and value pair mapping. Parameters included here override any corresponding parameter defaults from the job definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-parameters
         */
        readonly parameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The retry strategy to use for failed jobs. When a retry strategy is specified here, it overrides the retry strategy defined in the job definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-retrystrategy
         */
        readonly retryStrategy?: CfnPipe.BatchRetryStrategyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetBatchJobParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetBatchJobParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetBatchJobParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arrayProperties', CfnPipe_BatchArrayPropertiesPropertyValidator)(properties.arrayProperties));
    errors.collect(cdk.propertyValidator('containerOverrides', CfnPipe_BatchContainerOverridesPropertyValidator)(properties.containerOverrides));
    errors.collect(cdk.propertyValidator('dependsOn', cdk.listValidator(CfnPipe_BatchJobDependencyPropertyValidator))(properties.dependsOn));
    errors.collect(cdk.propertyValidator('jobDefinition', cdk.requiredValidator)(properties.jobDefinition));
    errors.collect(cdk.propertyValidator('jobDefinition', cdk.validateString)(properties.jobDefinition));
    errors.collect(cdk.propertyValidator('jobName', cdk.requiredValidator)(properties.jobName));
    errors.collect(cdk.propertyValidator('jobName', cdk.validateString)(properties.jobName));
    errors.collect(cdk.propertyValidator('parameters', cdk.hashValidator(cdk.validateString))(properties.parameters));
    errors.collect(cdk.propertyValidator('retryStrategy', CfnPipe_BatchRetryStrategyPropertyValidator)(properties.retryStrategy));
    return errors.wrap('supplied properties not correct for "PipeTargetBatchJobParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetBatchJobParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetBatchJobParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetBatchJobParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetBatchJobParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetBatchJobParametersPropertyValidator(properties).assertSuccess();
    return {
        ArrayProperties: cfnPipeBatchArrayPropertiesPropertyToCloudFormation(properties.arrayProperties),
        ContainerOverrides: cfnPipeBatchContainerOverridesPropertyToCloudFormation(properties.containerOverrides),
        DependsOn: cdk.listMapper(cfnPipeBatchJobDependencyPropertyToCloudFormation)(properties.dependsOn),
        JobDefinition: cdk.stringToCloudFormation(properties.jobDefinition),
        JobName: cdk.stringToCloudFormation(properties.jobName),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        RetryStrategy: cfnPipeBatchRetryStrategyPropertyToCloudFormation(properties.retryStrategy),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetBatchJobParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetBatchJobParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetBatchJobParametersProperty>();
    ret.addPropertyResult('arrayProperties', 'ArrayProperties', properties.ArrayProperties != null ? CfnPipeBatchArrayPropertiesPropertyFromCloudFormation(properties.ArrayProperties) : undefined);
    ret.addPropertyResult('containerOverrides', 'ContainerOverrides', properties.ContainerOverrides != null ? CfnPipeBatchContainerOverridesPropertyFromCloudFormation(properties.ContainerOverrides) : undefined);
    ret.addPropertyResult('dependsOn', 'DependsOn', properties.DependsOn != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchJobDependencyPropertyFromCloudFormation)(properties.DependsOn) : undefined);
    ret.addPropertyResult('jobDefinition', 'JobDefinition', cfn_parse.FromCloudFormation.getString(properties.JobDefinition));
    ret.addPropertyResult('jobName', 'JobName', cfn_parse.FromCloudFormation.getString(properties.JobName));
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined);
    ret.addPropertyResult('retryStrategy', 'RetryStrategy', properties.RetryStrategy != null ? CfnPipeBatchRetryStrategyPropertyFromCloudFormation(properties.RetryStrategy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an CloudWatch Logs log stream as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html
     */
    export interface PipeTargetCloudWatchLogsParametersProperty {
        /**
         * The name of the log stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-logstreamname
         */
        readonly logStreamName?: string;
        /**
         * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-timestamp
         */
        readonly timestamp?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetCloudWatchLogsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetCloudWatchLogsParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetCloudWatchLogsParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logStreamName', cdk.validateString)(properties.logStreamName));
    errors.collect(cdk.propertyValidator('timestamp', cdk.validateString)(properties.timestamp));
    return errors.wrap('supplied properties not correct for "PipeTargetCloudWatchLogsParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetCloudWatchLogsParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetCloudWatchLogsParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetCloudWatchLogsParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetCloudWatchLogsParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetCloudWatchLogsParametersPropertyValidator(properties).assertSuccess();
    return {
        LogStreamName: cdk.stringToCloudFormation(properties.logStreamName),
        Timestamp: cdk.stringToCloudFormation(properties.timestamp),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetCloudWatchLogsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetCloudWatchLogsParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetCloudWatchLogsParametersProperty>();
    ret.addPropertyResult('logStreamName', 'LogStreamName', properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined);
    ret.addPropertyResult('timestamp', 'Timestamp', properties.Timestamp != null ? cfn_parse.FromCloudFormation.getString(properties.Timestamp) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an Amazon ECS task as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html
     */
    export interface PipeTargetEcsTaskParametersProperty {
        /**
         * The capacity provider strategy to use for the task.
         *
         * If a `capacityProviderStrategy` is specified, the `launchType` parameter must be omitted. If no `capacityProviderStrategy` or launchType is specified, the `defaultCapacityProviderStrategy` for the cluster is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-capacityproviderstrategy
         */
        readonly capacityProviderStrategy?: Array<CfnPipe.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies whether to enable Amazon ECS managed tags for the task. For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the Amazon Elastic Container Service Developer Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableecsmanagedtags
         */
        readonly enableEcsManagedTags?: boolean | cdk.IResolvable;
        /**
         * Whether or not to enable the execute command functionality for the containers in this task. If true, this enables execute command functionality on all containers in the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableexecutecommand
         */
        readonly enableExecuteCommand?: boolean | cdk.IResolvable;
        /**
         * Specifies an Amazon ECS task group for the task. The maximum length is 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-group
         */
        readonly group?: string;
        /**
         * Specifies the launch type on which your task is running. The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where AWS Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS-Fargate.html) in the *Amazon Elastic Container Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-launchtype
         */
        readonly launchType?: string;
        /**
         * Use this structure if the Amazon ECS task uses the `awsvpc` network mode. This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if `LaunchType` is `FARGATE` because the `awsvpc` mode is required for Fargate tasks.
         *
         * If you specify `NetworkConfiguration` when the target ECS task does not use the `awsvpc` network mode, the task fails.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-networkconfiguration
         */
        readonly networkConfiguration?: CfnPipe.NetworkConfigurationProperty | cdk.IResolvable;
        /**
         * The overrides that are associated with a task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-overrides
         */
        readonly overrides?: CfnPipe.EcsTaskOverrideProperty | cdk.IResolvable;
        /**
         * An array of placement constraint objects to use for the task. You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementconstraints
         */
        readonly placementConstraints?: Array<CfnPipe.PlacementConstraintProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The placement strategy objects to use for the task. You can specify a maximum of five strategy rules per task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementstrategy
         */
        readonly placementStrategy?: Array<CfnPipe.PlacementStrategyProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the platform version for the task. Specify only the numeric portion of the platform version, such as `1.1.0` .
         *
         * This structure is used only if `LaunchType` is `FARGATE` . For more information about valid platform versions, see [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-platformversion
         */
        readonly platformVersion?: string;
        /**
         * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the `TagResource` API action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-propagatetags
         */
        readonly propagateTags?: string;
        /**
         * The reference ID to use for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-referenceid
         */
        readonly referenceId?: string;
        /**
         * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. To learn more, see [RunTask](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-tags) in the Amazon ECS API Reference.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-tags
         */
        readonly tags?: cdk.CfnTag[];
        /**
         * The number of tasks to create based on `TaskDefinition` . The default is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-taskcount
         */
        readonly taskCount?: number;
        /**
         * The ARN of the task definition to use if the event target is an Amazon ECS task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-taskdefinitionarn
         */
        readonly taskDefinitionArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetEcsTaskParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetEcsTaskParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetEcsTaskParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capacityProviderStrategy', cdk.listValidator(CfnPipe_CapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
    errors.collect(cdk.propertyValidator('enableEcsManagedTags', cdk.validateBoolean)(properties.enableEcsManagedTags));
    errors.collect(cdk.propertyValidator('enableExecuteCommand', cdk.validateBoolean)(properties.enableExecuteCommand));
    errors.collect(cdk.propertyValidator('group', cdk.validateString)(properties.group));
    errors.collect(cdk.propertyValidator('launchType', cdk.validateString)(properties.launchType));
    errors.collect(cdk.propertyValidator('networkConfiguration', CfnPipe_NetworkConfigurationPropertyValidator)(properties.networkConfiguration));
    errors.collect(cdk.propertyValidator('overrides', CfnPipe_EcsTaskOverridePropertyValidator)(properties.overrides));
    errors.collect(cdk.propertyValidator('placementConstraints', cdk.listValidator(CfnPipe_PlacementConstraintPropertyValidator))(properties.placementConstraints));
    errors.collect(cdk.propertyValidator('placementStrategy', cdk.listValidator(CfnPipe_PlacementStrategyPropertyValidator))(properties.placementStrategy));
    errors.collect(cdk.propertyValidator('platformVersion', cdk.validateString)(properties.platformVersion));
    errors.collect(cdk.propertyValidator('propagateTags', cdk.validateString)(properties.propagateTags));
    errors.collect(cdk.propertyValidator('referenceId', cdk.validateString)(properties.referenceId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('taskCount', cdk.validateNumber)(properties.taskCount));
    errors.collect(cdk.propertyValidator('taskDefinitionArn', cdk.requiredValidator)(properties.taskDefinitionArn));
    errors.collect(cdk.propertyValidator('taskDefinitionArn', cdk.validateString)(properties.taskDefinitionArn));
    return errors.wrap('supplied properties not correct for "PipeTargetEcsTaskParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetEcsTaskParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetEcsTaskParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetEcsTaskParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetEcsTaskParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetEcsTaskParametersPropertyValidator(properties).assertSuccess();
    return {
        CapacityProviderStrategy: cdk.listMapper(cfnPipeCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
        EnableECSManagedTags: cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
        EnableExecuteCommand: cdk.booleanToCloudFormation(properties.enableExecuteCommand),
        Group: cdk.stringToCloudFormation(properties.group),
        LaunchType: cdk.stringToCloudFormation(properties.launchType),
        NetworkConfiguration: cfnPipeNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
        Overrides: cfnPipeEcsTaskOverridePropertyToCloudFormation(properties.overrides),
        PlacementConstraints: cdk.listMapper(cfnPipePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
        PlacementStrategy: cdk.listMapper(cfnPipePlacementStrategyPropertyToCloudFormation)(properties.placementStrategy),
        PlatformVersion: cdk.stringToCloudFormation(properties.platformVersion),
        PropagateTags: cdk.stringToCloudFormation(properties.propagateTags),
        ReferenceId: cdk.stringToCloudFormation(properties.referenceId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TaskCount: cdk.numberToCloudFormation(properties.taskCount),
        TaskDefinitionArn: cdk.stringToCloudFormation(properties.taskDefinitionArn),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetEcsTaskParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetEcsTaskParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetEcsTaskParametersProperty>();
    ret.addPropertyResult('capacityProviderStrategy', 'CapacityProviderStrategy', properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined);
    ret.addPropertyResult('enableEcsManagedTags', 'EnableECSManagedTags', properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined);
    ret.addPropertyResult('enableExecuteCommand', 'EnableExecuteCommand', properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined);
    ret.addPropertyResult('group', 'Group', properties.Group != null ? cfn_parse.FromCloudFormation.getString(properties.Group) : undefined);
    ret.addPropertyResult('launchType', 'LaunchType', properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined);
    ret.addPropertyResult('networkConfiguration', 'NetworkConfiguration', properties.NetworkConfiguration != null ? CfnPipeNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined);
    ret.addPropertyResult('overrides', 'Overrides', properties.Overrides != null ? CfnPipeEcsTaskOverridePropertyFromCloudFormation(properties.Overrides) : undefined);
    ret.addPropertyResult('placementConstraints', 'PlacementConstraints', properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnPipePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined);
    ret.addPropertyResult('placementStrategy', 'PlacementStrategy', properties.PlacementStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnPipePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategy) : undefined);
    ret.addPropertyResult('platformVersion', 'PlatformVersion', properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined);
    ret.addPropertyResult('propagateTags', 'PropagateTags', properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined);
    ret.addPropertyResult('referenceId', 'ReferenceId', properties.ReferenceId != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('taskCount', 'TaskCount', properties.TaskCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TaskCount) : undefined);
    ret.addPropertyResult('taskDefinitionArn', 'TaskDefinitionArn', cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using an EventBridge event bus as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html
     */
    export interface PipeTargetEventBridgeEventBusParametersProperty {
        /**
         * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
         */
        readonly detailType?: string;
        /**
         * The URL subdomain of the endpoint. For example, if the URL for Endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then the EndpointId is `abcde.veo` .
         *
         * > When using Java, you must include `auth-crt` on the class path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
         */
        readonly endpointId?: string;
        /**
         * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number, including zero, may be present.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
         */
        readonly resources?: string[];
        /**
         * The source of the event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
         */
        readonly source?: string;
        /**
         * The time stamp of the event, per [RFC3339](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339.txt) . If no time stamp is provided, the time stamp of the [PutEvents](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) call is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
         */
        readonly time?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetEventBridgeEventBusParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetEventBridgeEventBusParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetEventBridgeEventBusParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('detailType', cdk.validateString)(properties.detailType));
    errors.collect(cdk.propertyValidator('endpointId', cdk.validateString)(properties.endpointId));
    errors.collect(cdk.propertyValidator('resources', cdk.listValidator(cdk.validateString))(properties.resources));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('time', cdk.validateString)(properties.time));
    return errors.wrap('supplied properties not correct for "PipeTargetEventBridgeEventBusParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetEventBridgeEventBusParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetEventBridgeEventBusParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetEventBridgeEventBusParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetEventBridgeEventBusParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetEventBridgeEventBusParametersPropertyValidator(properties).assertSuccess();
    return {
        DetailType: cdk.stringToCloudFormation(properties.detailType),
        EndpointId: cdk.stringToCloudFormation(properties.endpointId),
        Resources: cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
        Source: cdk.stringToCloudFormation(properties.source),
        Time: cdk.stringToCloudFormation(properties.time),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetEventBridgeEventBusParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetEventBridgeEventBusParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetEventBridgeEventBusParametersProperty>();
    ret.addPropertyResult('detailType', 'DetailType', properties.DetailType != null ? cfn_parse.FromCloudFormation.getString(properties.DetailType) : undefined);
    ret.addPropertyResult('endpointId', 'EndpointId', properties.EndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointId) : undefined);
    ret.addPropertyResult('resources', 'Resources', properties.Resources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Resources) : undefined);
    ret.addPropertyResult('source', 'Source', properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined);
    ret.addPropertyResult('time', 'Time', properties.Time != null ? cfn_parse.FromCloudFormation.getString(properties.Time) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html
     */
    export interface PipeTargetHttpParametersProperty {
        /**
         * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
         */
        readonly headerParameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
         */
        readonly pathParameterValues?: string[];
        /**
         * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
         */
        readonly queryStringParameters?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetHttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetHttpParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headerParameters', cdk.hashValidator(cdk.validateString))(properties.headerParameters));
    errors.collect(cdk.propertyValidator('pathParameterValues', cdk.listValidator(cdk.validateString))(properties.pathParameterValues));
    errors.collect(cdk.propertyValidator('queryStringParameters', cdk.hashValidator(cdk.validateString))(properties.queryStringParameters));
    return errors.wrap('supplied properties not correct for "PipeTargetHttpParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetHttpParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetHttpParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetHttpParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetHttpParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetHttpParametersPropertyValidator(properties).assertSuccess();
    return {
        HeaderParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.headerParameters),
        PathParameterValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.pathParameterValues),
        QueryStringParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.queryStringParameters),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetHttpParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetHttpParametersProperty>();
    ret.addPropertyResult('headerParameters', 'HeaderParameters', properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.HeaderParameters) : undefined);
    ret.addPropertyResult('pathParameterValues', 'PathParameterValues', properties.PathParameterValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PathParameterValues) : undefined);
    ret.addPropertyResult('queryStringParameters', 'QueryStringParameters', properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.QueryStringParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Kinesis stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html
     */
    export interface PipeTargetKinesisStreamParametersProperty {
        /**
         * Determines which shard in the stream the data record is assigned to. Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html#cfn-pipes-pipe-pipetargetkinesisstreamparameters-partitionkey
         */
        readonly partitionKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetKinesisStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetKinesisStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetKinesisStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('partitionKey', cdk.requiredValidator)(properties.partitionKey));
    errors.collect(cdk.propertyValidator('partitionKey', cdk.validateString)(properties.partitionKey));
    return errors.wrap('supplied properties not correct for "PipeTargetKinesisStreamParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetKinesisStreamParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetKinesisStreamParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetKinesisStreamParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetKinesisStreamParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetKinesisStreamParametersPropertyValidator(properties).assertSuccess();
    return {
        PartitionKey: cdk.stringToCloudFormation(properties.partitionKey),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetKinesisStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetKinesisStreamParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetKinesisStreamParametersProperty>();
    ret.addPropertyResult('partitionKey', 'PartitionKey', cfn_parse.FromCloudFormation.getString(properties.PartitionKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Lambda function as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html
     */
    export interface PipeTargetLambdaFunctionParametersProperty {
        /**
         * Specify whether to invoke the function synchronously or asynchronously.
         *
         * - `REQUEST_RESPONSE` (default) - Invoke synchronously. This corresponds to the `RequestResponse` option in the `InvocationType` parameter for the Lambda [Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_RequestSyntax) API.
         * - `FIRE_AND_FORGET` - Invoke asynchronously. This corresponds to the `Event` option in the `InvocationType` parameter for the Lambda [Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_RequestSyntax) API.
         *
         * For more information, see [Invocation types](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html#pipes-invocation) in the *Amazon EventBridge User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html#cfn-pipes-pipe-pipetargetlambdafunctionparameters-invocationtype
         */
        readonly invocationType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetLambdaFunctionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetLambdaFunctionParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetLambdaFunctionParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invocationType', cdk.validateString)(properties.invocationType));
    return errors.wrap('supplied properties not correct for "PipeTargetLambdaFunctionParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetLambdaFunctionParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetLambdaFunctionParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetLambdaFunctionParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetLambdaFunctionParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetLambdaFunctionParametersPropertyValidator(properties).assertSuccess();
    return {
        InvocationType: cdk.stringToCloudFormation(properties.invocationType),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetLambdaFunctionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetLambdaFunctionParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetLambdaFunctionParametersProperty>();
    ret.addPropertyResult('invocationType', 'InvocationType', properties.InvocationType != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters required to set up a target for your pipe.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html
     */
    export interface PipeTargetParametersProperty {
        /**
         * The parameters for using an AWS Batch job as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-batchjobparameters
         */
        readonly batchJobParameters?: CfnPipe.PipeTargetBatchJobParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using an CloudWatch Logs log stream as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-cloudwatchlogsparameters
         */
        readonly cloudWatchLogsParameters?: CfnPipe.PipeTargetCloudWatchLogsParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using an Amazon ECS task as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-ecstaskparameters
         */
        readonly ecsTaskParameters?: CfnPipe.PipeTargetEcsTaskParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using an EventBridge event bus as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-eventbridgeeventbusparameters
         */
        readonly eventBridgeEventBusParameters?: CfnPipe.PipeTargetEventBridgeEventBusParametersProperty | cdk.IResolvable;
        /**
         * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-httpparameters
         */
        readonly httpParameters?: CfnPipe.PipeTargetHttpParametersProperty | cdk.IResolvable;
        /**
         * Valid JSON text passed to the target. In this case, nothing from the event itself is passed to the target. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
         */
        readonly inputTemplate?: string;
        /**
         * The parameters for using a Kinesis stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-kinesisstreamparameters
         */
        readonly kinesisStreamParameters?: CfnPipe.PipeTargetKinesisStreamParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a Lambda function as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-lambdafunctionparameters
         */
        readonly lambdaFunctionParameters?: CfnPipe.PipeTargetLambdaFunctionParametersProperty | cdk.IResolvable;
        /**
         * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API BatchExecuteStatement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-redshiftdataparameters
         */
        readonly redshiftDataParameters?: CfnPipe.PipeTargetRedshiftDataParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a SageMaker pipeline as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sagemakerpipelineparameters
         */
        readonly sageMakerPipelineParameters?: CfnPipe.PipeTargetSageMakerPipelineParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a Amazon SQS stream as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sqsqueueparameters
         */
        readonly sqsQueueParameters?: CfnPipe.PipeTargetSqsQueueParametersProperty | cdk.IResolvable;
        /**
         * The parameters for using a Step Functions state machine as a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-stepfunctionstatemachineparameters
         */
        readonly stepFunctionStateMachineParameters?: CfnPipe.PipeTargetStateMachineParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchJobParameters', CfnPipe_PipeTargetBatchJobParametersPropertyValidator)(properties.batchJobParameters));
    errors.collect(cdk.propertyValidator('cloudWatchLogsParameters', CfnPipe_PipeTargetCloudWatchLogsParametersPropertyValidator)(properties.cloudWatchLogsParameters));
    errors.collect(cdk.propertyValidator('ecsTaskParameters', CfnPipe_PipeTargetEcsTaskParametersPropertyValidator)(properties.ecsTaskParameters));
    errors.collect(cdk.propertyValidator('eventBridgeEventBusParameters', CfnPipe_PipeTargetEventBridgeEventBusParametersPropertyValidator)(properties.eventBridgeEventBusParameters));
    errors.collect(cdk.propertyValidator('httpParameters', CfnPipe_PipeTargetHttpParametersPropertyValidator)(properties.httpParameters));
    errors.collect(cdk.propertyValidator('inputTemplate', cdk.validateString)(properties.inputTemplate));
    errors.collect(cdk.propertyValidator('kinesisStreamParameters', CfnPipe_PipeTargetKinesisStreamParametersPropertyValidator)(properties.kinesisStreamParameters));
    errors.collect(cdk.propertyValidator('lambdaFunctionParameters', CfnPipe_PipeTargetLambdaFunctionParametersPropertyValidator)(properties.lambdaFunctionParameters));
    errors.collect(cdk.propertyValidator('redshiftDataParameters', CfnPipe_PipeTargetRedshiftDataParametersPropertyValidator)(properties.redshiftDataParameters));
    errors.collect(cdk.propertyValidator('sageMakerPipelineParameters', CfnPipe_PipeTargetSageMakerPipelineParametersPropertyValidator)(properties.sageMakerPipelineParameters));
    errors.collect(cdk.propertyValidator('sqsQueueParameters', CfnPipe_PipeTargetSqsQueueParametersPropertyValidator)(properties.sqsQueueParameters));
    errors.collect(cdk.propertyValidator('stepFunctionStateMachineParameters', CfnPipe_PipeTargetStateMachineParametersPropertyValidator)(properties.stepFunctionStateMachineParameters));
    return errors.wrap('supplied properties not correct for "PipeTargetParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetParametersPropertyValidator(properties).assertSuccess();
    return {
        BatchJobParameters: cfnPipePipeTargetBatchJobParametersPropertyToCloudFormation(properties.batchJobParameters),
        CloudWatchLogsParameters: cfnPipePipeTargetCloudWatchLogsParametersPropertyToCloudFormation(properties.cloudWatchLogsParameters),
        EcsTaskParameters: cfnPipePipeTargetEcsTaskParametersPropertyToCloudFormation(properties.ecsTaskParameters),
        EventBridgeEventBusParameters: cfnPipePipeTargetEventBridgeEventBusParametersPropertyToCloudFormation(properties.eventBridgeEventBusParameters),
        HttpParameters: cfnPipePipeTargetHttpParametersPropertyToCloudFormation(properties.httpParameters),
        InputTemplate: cdk.stringToCloudFormation(properties.inputTemplate),
        KinesisStreamParameters: cfnPipePipeTargetKinesisStreamParametersPropertyToCloudFormation(properties.kinesisStreamParameters),
        LambdaFunctionParameters: cfnPipePipeTargetLambdaFunctionParametersPropertyToCloudFormation(properties.lambdaFunctionParameters),
        RedshiftDataParameters: cfnPipePipeTargetRedshiftDataParametersPropertyToCloudFormation(properties.redshiftDataParameters),
        SageMakerPipelineParameters: cfnPipePipeTargetSageMakerPipelineParametersPropertyToCloudFormation(properties.sageMakerPipelineParameters),
        SqsQueueParameters: cfnPipePipeTargetSqsQueueParametersPropertyToCloudFormation(properties.sqsQueueParameters),
        StepFunctionStateMachineParameters: cfnPipePipeTargetStateMachineParametersPropertyToCloudFormation(properties.stepFunctionStateMachineParameters),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetParametersProperty>();
    ret.addPropertyResult('batchJobParameters', 'BatchJobParameters', properties.BatchJobParameters != null ? CfnPipePipeTargetBatchJobParametersPropertyFromCloudFormation(properties.BatchJobParameters) : undefined);
    ret.addPropertyResult('cloudWatchLogsParameters', 'CloudWatchLogsParameters', properties.CloudWatchLogsParameters != null ? CfnPipePipeTargetCloudWatchLogsParametersPropertyFromCloudFormation(properties.CloudWatchLogsParameters) : undefined);
    ret.addPropertyResult('ecsTaskParameters', 'EcsTaskParameters', properties.EcsTaskParameters != null ? CfnPipePipeTargetEcsTaskParametersPropertyFromCloudFormation(properties.EcsTaskParameters) : undefined);
    ret.addPropertyResult('eventBridgeEventBusParameters', 'EventBridgeEventBusParameters', properties.EventBridgeEventBusParameters != null ? CfnPipePipeTargetEventBridgeEventBusParametersPropertyFromCloudFormation(properties.EventBridgeEventBusParameters) : undefined);
    ret.addPropertyResult('httpParameters', 'HttpParameters', properties.HttpParameters != null ? CfnPipePipeTargetHttpParametersPropertyFromCloudFormation(properties.HttpParameters) : undefined);
    ret.addPropertyResult('inputTemplate', 'InputTemplate', properties.InputTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.InputTemplate) : undefined);
    ret.addPropertyResult('kinesisStreamParameters', 'KinesisStreamParameters', properties.KinesisStreamParameters != null ? CfnPipePipeTargetKinesisStreamParametersPropertyFromCloudFormation(properties.KinesisStreamParameters) : undefined);
    ret.addPropertyResult('lambdaFunctionParameters', 'LambdaFunctionParameters', properties.LambdaFunctionParameters != null ? CfnPipePipeTargetLambdaFunctionParametersPropertyFromCloudFormation(properties.LambdaFunctionParameters) : undefined);
    ret.addPropertyResult('redshiftDataParameters', 'RedshiftDataParameters', properties.RedshiftDataParameters != null ? CfnPipePipeTargetRedshiftDataParametersPropertyFromCloudFormation(properties.RedshiftDataParameters) : undefined);
    ret.addPropertyResult('sageMakerPipelineParameters', 'SageMakerPipelineParameters', properties.SageMakerPipelineParameters != null ? CfnPipePipeTargetSageMakerPipelineParametersPropertyFromCloudFormation(properties.SageMakerPipelineParameters) : undefined);
    ret.addPropertyResult('sqsQueueParameters', 'SqsQueueParameters', properties.SqsQueueParameters != null ? CfnPipePipeTargetSqsQueueParametersPropertyFromCloudFormation(properties.SqsQueueParameters) : undefined);
    ret.addPropertyResult('stepFunctionStateMachineParameters', 'StepFunctionStateMachineParameters', properties.StepFunctionStateMachineParameters != null ? CfnPipePipeTargetStateMachineParametersPropertyFromCloudFormation(properties.StepFunctionStateMachineParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API BatchExecuteStatement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html
     */
    export interface PipeTargetRedshiftDataParametersProperty {
        /**
         * The name of the database. Required when authenticating using temporary credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-database
         */
        readonly database: string;
        /**
         * The database user name. Required when authenticating using temporary credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-dbuser
         */
        readonly dbUser?: string;
        /**
         * The name or ARN of the secret that enables access to the database. Required when authenticating using Secrets Manager .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-secretmanagerarn
         */
        readonly secretManagerArn?: string;
        /**
         * The SQL statement text to run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-sqls
         */
        readonly sqls: string[];
        /**
         * The name of the SQL statement. You can name the SQL statement when you create it to identify the query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-statementname
         */
        readonly statementName?: string;
        /**
         * Indicates whether to send an event back to EventBridge after the SQL statement runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-withevent
         */
        readonly withEvent?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetRedshiftDataParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetRedshiftDataParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetRedshiftDataParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('dbUser', cdk.validateString)(properties.dbUser));
    errors.collect(cdk.propertyValidator('secretManagerArn', cdk.validateString)(properties.secretManagerArn));
    errors.collect(cdk.propertyValidator('sqls', cdk.requiredValidator)(properties.sqls));
    errors.collect(cdk.propertyValidator('sqls', cdk.listValidator(cdk.validateString))(properties.sqls));
    errors.collect(cdk.propertyValidator('statementName', cdk.validateString)(properties.statementName));
    errors.collect(cdk.propertyValidator('withEvent', cdk.validateBoolean)(properties.withEvent));
    return errors.wrap('supplied properties not correct for "PipeTargetRedshiftDataParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetRedshiftDataParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetRedshiftDataParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetRedshiftDataParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetRedshiftDataParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetRedshiftDataParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        DbUser: cdk.stringToCloudFormation(properties.dbUser),
        SecretManagerArn: cdk.stringToCloudFormation(properties.secretManagerArn),
        Sqls: cdk.listMapper(cdk.stringToCloudFormation)(properties.sqls),
        StatementName: cdk.stringToCloudFormation(properties.statementName),
        WithEvent: cdk.booleanToCloudFormation(properties.withEvent),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetRedshiftDataParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetRedshiftDataParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetRedshiftDataParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('dbUser', 'DbUser', properties.DbUser != null ? cfn_parse.FromCloudFormation.getString(properties.DbUser) : undefined);
    ret.addPropertyResult('secretManagerArn', 'SecretManagerArn', properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined);
    ret.addPropertyResult('sqls', 'Sqls', cfn_parse.FromCloudFormation.getStringArray(properties.Sqls));
    ret.addPropertyResult('statementName', 'StatementName', properties.StatementName != null ? cfn_parse.FromCloudFormation.getString(properties.StatementName) : undefined);
    ret.addPropertyResult('withEvent', 'WithEvent', properties.WithEvent != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WithEvent) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a SageMaker pipeline as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html
     */
    export interface PipeTargetSageMakerPipelineParametersProperty {
        /**
         * List of Parameter names and values for SageMaker Model Building Pipeline execution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html#cfn-pipes-pipe-pipetargetsagemakerpipelineparameters-pipelineparameterlist
         */
        readonly pipelineParameterList?: Array<CfnPipe.SageMakerPipelineParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetSageMakerPipelineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetSageMakerPipelineParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetSageMakerPipelineParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pipelineParameterList', cdk.listValidator(CfnPipe_SageMakerPipelineParameterPropertyValidator))(properties.pipelineParameterList));
    return errors.wrap('supplied properties not correct for "PipeTargetSageMakerPipelineParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetSageMakerPipelineParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetSageMakerPipelineParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetSageMakerPipelineParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetSageMakerPipelineParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetSageMakerPipelineParametersPropertyValidator(properties).assertSuccess();
    return {
        PipelineParameterList: cdk.listMapper(cfnPipeSageMakerPipelineParameterPropertyToCloudFormation)(properties.pipelineParameterList),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetSageMakerPipelineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetSageMakerPipelineParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetSageMakerPipelineParametersProperty>();
    ret.addPropertyResult('pipelineParameterList', 'PipelineParameterList', properties.PipelineParameterList != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeSageMakerPipelineParameterPropertyFromCloudFormation)(properties.PipelineParameterList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Amazon SQS stream as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html
     */
    export interface PipeTargetSqsQueueParametersProperty {
        /**
         * This parameter applies only to FIFO (first-in-first-out) queues.
         *
         * The token used for deduplication of sent messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagededuplicationid
         */
        readonly messageDeduplicationId?: string;
        /**
         * The FIFO message group ID to use as the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagegroupid
         */
        readonly messageGroupId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetSqsQueueParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetSqsQueueParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetSqsQueueParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('messageDeduplicationId', cdk.validateString)(properties.messageDeduplicationId));
    errors.collect(cdk.propertyValidator('messageGroupId', cdk.validateString)(properties.messageGroupId));
    return errors.wrap('supplied properties not correct for "PipeTargetSqsQueueParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetSqsQueueParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetSqsQueueParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetSqsQueueParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetSqsQueueParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetSqsQueueParametersPropertyValidator(properties).assertSuccess();
    return {
        MessageDeduplicationId: cdk.stringToCloudFormation(properties.messageDeduplicationId),
        MessageGroupId: cdk.stringToCloudFormation(properties.messageGroupId),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetSqsQueueParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetSqsQueueParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetSqsQueueParametersProperty>();
    ret.addPropertyResult('messageDeduplicationId', 'MessageDeduplicationId', properties.MessageDeduplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageDeduplicationId) : undefined);
    ret.addPropertyResult('messageGroupId', 'MessageGroupId', properties.MessageGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageGroupId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The parameters for using a Step Functions state machine as a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetstatemachineparameters.html
     */
    export interface PipeTargetStateMachineParametersProperty {
        /**
         * Specify whether to invoke the Step Functions state machine synchronously or asynchronously.
         *
         * - `REQUEST_RESPONSE` (default) - Invoke synchronously. For more information, see [StartSyncExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartSyncExecution.html) in the *AWS Step Functions API Reference* .
         *
         * > `REQUEST_RESPONSE` is not supported for `STANDARD` state machine workflows.
         * - `FIRE_AND_FORGET` - Invoke asynchronously. For more information, see [StartExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) in the *AWS Step Functions API Reference* .
         *
         * For more information, see [Invocation types](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html#pipes-invocation) in the *Amazon EventBridge User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetstatemachineparameters.html#cfn-pipes-pipe-pipetargetstatemachineparameters-invocationtype
         */
        readonly invocationType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipeTargetStateMachineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetStateMachineParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PipeTargetStateMachineParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invocationType', cdk.validateString)(properties.invocationType));
    return errors.wrap('supplied properties not correct for "PipeTargetStateMachineParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetStateMachineParameters` resource
 *
 * @param properties - the TypeScript properties of a `PipeTargetStateMachineParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PipeTargetStateMachineParameters` resource.
 */
// @ts-ignore TS6133
function cfnPipePipeTargetStateMachineParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PipeTargetStateMachineParametersPropertyValidator(properties).assertSuccess();
    return {
        InvocationType: cdk.stringToCloudFormation(properties.invocationType),
    };
}

// @ts-ignore TS6133
function CfnPipePipeTargetStateMachineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PipeTargetStateMachineParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetStateMachineParametersProperty>();
    ret.addPropertyResult('invocationType', 'InvocationType', properties.InvocationType != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * An object representing a constraint on task placement. To learn more, see [Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the Amazon Elastic Container Service Developer Guide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html
     */
    export interface PlacementConstraintProperty {
        /**
         * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is `distinctInstance` . To learn more, see [Cluster Query Language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the Amazon Elastic Container Service Developer Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-expression
         */
        readonly expression?: string;
        /**
         * The type of constraint. Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PlacementConstraintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PlacementConstraint` resource
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PlacementConstraint` resource.
 */
// @ts-ignore TS6133
function cfnPipePlacementConstraintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PlacementConstraintPropertyValidator(properties).assertSuccess();
    return {
        Expression: cdk.stringToCloudFormation(properties.expression),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PlacementConstraintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PlacementConstraintProperty>();
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The task placement strategy for a task or service. To learn more, see [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html) in the Amazon Elastic Container Service Service Developer Guide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html
     */
    export interface PlacementStrategyProperty {
        /**
         * The field to apply the placement strategy against. For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-field
         */
        readonly field?: string;
        /**
         * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_PlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PlacementStrategyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PlacementStrategy` resource
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.PlacementStrategy` resource.
 */
// @ts-ignore TS6133
function cfnPipePlacementStrategyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_PlacementStrategyPropertyValidator(properties).assertSuccess();
    return {
        Field: cdk.stringToCloudFormation(properties.field),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.PlacementStrategyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PlacementStrategyProperty>();
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * Name/Value pair of a parameter to start execution of a SageMaker Model Building Pipeline.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html
     */
    export interface SageMakerPipelineParameterProperty {
        /**
         * Name of parameter to start execution of a SageMaker Model Building Pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-name
         */
        readonly name: string;
        /**
         * Value of parameter to start execution of a SageMaker Model Building Pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_SageMakerPipelineParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "SageMakerPipelineParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SageMakerPipelineParameter` resource
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SageMakerPipelineParameter` resource.
 */
// @ts-ignore TS6133
function cfnPipeSageMakerPipelineParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_SageMakerPipelineParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipeSageMakerPipelineParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.SageMakerPipelineParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SageMakerPipelineParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * The AWS Secrets Manager secret that stores your stream credentials.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html
     */
    export interface SelfManagedKafkaAccessConfigurationCredentialsProperty {
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-basicauth
         */
        readonly basicAuth?: string;
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-clientcertificatetlsauth
         */
        readonly clientCertificateTlsAuth?: string;
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram256auth
         */
        readonly saslScram256Auth?: string;
        /**
         * The ARN of the Secrets Manager secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram512auth
         */
        readonly saslScram512Auth?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaAccessConfigurationCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationCredentialsProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_SelfManagedKafkaAccessConfigurationCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('basicAuth', cdk.validateString)(properties.basicAuth));
    errors.collect(cdk.propertyValidator('clientCertificateTlsAuth', cdk.validateString)(properties.clientCertificateTlsAuth));
    errors.collect(cdk.propertyValidator('saslScram256Auth', cdk.validateString)(properties.saslScram256Auth));
    errors.collect(cdk.propertyValidator('saslScram512Auth', cdk.validateString)(properties.saslScram512Auth));
    return errors.wrap('supplied properties not correct for "SelfManagedKafkaAccessConfigurationCredentialsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SelfManagedKafkaAccessConfigurationCredentials` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationCredentialsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SelfManagedKafkaAccessConfigurationCredentials` resource.
 */
// @ts-ignore TS6133
function cfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_SelfManagedKafkaAccessConfigurationCredentialsPropertyValidator(properties).assertSuccess();
    return {
        BasicAuth: cdk.stringToCloudFormation(properties.basicAuth),
        ClientCertificateTlsAuth: cdk.stringToCloudFormation(properties.clientCertificateTlsAuth),
        SaslScram256Auth: cdk.stringToCloudFormation(properties.saslScram256Auth),
        SaslScram512Auth: cdk.stringToCloudFormation(properties.saslScram512Auth),
    };
}

// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty>();
    ret.addPropertyResult('basicAuth', 'BasicAuth', properties.BasicAuth != null ? cfn_parse.FromCloudFormation.getString(properties.BasicAuth) : undefined);
    ret.addPropertyResult('clientCertificateTlsAuth', 'ClientCertificateTlsAuth', properties.ClientCertificateTlsAuth != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateTlsAuth) : undefined);
    ret.addPropertyResult('saslScram256Auth', 'SaslScram256Auth', properties.SaslScram256Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram256Auth) : undefined);
    ret.addPropertyResult('saslScram512Auth', 'SaslScram512Auth', properties.SaslScram512Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram512Auth) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipe {
    /**
     * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html
     */
    export interface SelfManagedKafkaAccessConfigurationVpcProperty {
        /**
         * Specifies the security groups associated with the stream. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-securitygroup
         */
        readonly securityGroup?: string[];
        /**
         * Specifies the subnets associated with the stream. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-subnets
         */
        readonly subnets?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaAccessConfigurationVpcProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationVpcProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipe_SelfManagedKafkaAccessConfigurationVpcPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroup', cdk.listValidator(cdk.validateString))(properties.securityGroup));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    return errors.wrap('supplied properties not correct for "SelfManagedKafkaAccessConfigurationVpcProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SelfManagedKafkaAccessConfigurationVpc` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationVpcProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pipes::Pipe.SelfManagedKafkaAccessConfigurationVpc` resource.
 */
// @ts-ignore TS6133
function cfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipe_SelfManagedKafkaAccessConfigurationVpcPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroup: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroup),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    };
}

// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty>();
    ret.addPropertyResult('securityGroup', 'SecurityGroup', properties.SecurityGroup != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroup) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', properties.Subnets != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Subnets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
