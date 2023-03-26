// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:05.621Z","fingerprint":"gPEOETOzKtAbkNIjIQlQuf8iVw/fnUmKwLN1DD4n5tg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnVirtualCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html
 */
export interface CfnVirtualClusterProps {

    /**
     * The container provider of the virtual cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-containerprovider
     */
    readonly containerProvider: CfnVirtualCluster.ContainerProviderProperty | cdk.IResolvable;

    /**
     * The name of the virtual cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-name
     */
    readonly name: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnVirtualClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnVirtualClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerProvider', cdk.requiredValidator)(properties.containerProvider));
    errors.collect(cdk.propertyValidator('containerProvider', CfnVirtualCluster_ContainerProviderPropertyValidator)(properties.containerProvider));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnVirtualClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnVirtualClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster` resource.
 */
// @ts-ignore TS6133
function cfnVirtualClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualClusterPropsValidator(properties).assertSuccess();
    return {
        ContainerProvider: cfnVirtualClusterContainerProviderPropertyToCloudFormation(properties.containerProvider),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnVirtualClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualClusterProps>();
    ret.addPropertyResult('containerProvider', 'ContainerProvider', CfnVirtualClusterContainerProviderPropertyFromCloudFormation(properties.ContainerProvider));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMRContainers::VirtualCluster`
 *
 * The `AWS::EMRContainers::VirtualCluster` resource specifies a virtual cluster. A virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list, and delete virtual clusters. They do not consume any additional resources in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
 *
 * @cloudformationResource AWS::EMRContainers::VirtualCluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html
 */
export class CfnVirtualCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMRContainers::VirtualCluster";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualCluster {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVirtualClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVirtualCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the project, such as `arn:aws:emr-containers:us-east-1:123456789012:/virtualclusters/ab4rp1abcs8xz47n3x0example` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the virtual cluster, such as `ab4rp1abcs8xz47n3x0example` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The container provider of the virtual cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-containerprovider
     */
    public containerProvider: CfnVirtualCluster.ContainerProviderProperty | cdk.IResolvable;

    /**
     * The name of the virtual cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-name
     */
    public name: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrcontainers-virtualcluster.html#cfn-emrcontainers-virtualcluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EMRContainers::VirtualCluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVirtualClusterProps) {
        super(scope, id, { type: CfnVirtualCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'containerProvider', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.containerProvider = props.containerProvider;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMRContainers::VirtualCluster", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            containerProvider: this.containerProvider,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVirtualClusterPropsToCloudFormation(props);
    }
}

export namespace CfnVirtualCluster {
    /**
     * The information about the container used for a job run or a managed endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerinfo.html
     */
    export interface ContainerInfoProperty {
        /**
         * The information about the Amazon EKS cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerinfo.html#cfn-emrcontainers-virtualcluster-containerinfo-eksinfo
         */
        readonly eksInfo: CfnVirtualCluster.EksInfoProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualCluster_ContainerInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eksInfo', cdk.requiredValidator)(properties.eksInfo));
    errors.collect(cdk.propertyValidator('eksInfo', CfnVirtualCluster_EksInfoPropertyValidator)(properties.eksInfo));
    return errors.wrap('supplied properties not correct for "ContainerInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.ContainerInfo` resource
 *
 * @param properties - the TypeScript properties of a `ContainerInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.ContainerInfo` resource.
 */
// @ts-ignore TS6133
function cfnVirtualClusterContainerInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualCluster_ContainerInfoPropertyValidator(properties).assertSuccess();
    return {
        EksInfo: cfnVirtualClusterEksInfoPropertyToCloudFormation(properties.eksInfo),
    };
}

// @ts-ignore TS6133
function CfnVirtualClusterContainerInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualCluster.ContainerInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualCluster.ContainerInfoProperty>();
    ret.addPropertyResult('eksInfo', 'EksInfo', CfnVirtualClusterEksInfoPropertyFromCloudFormation(properties.EksInfo));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualCluster {
    /**
     * The information about the container provider.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerprovider.html
     */
    export interface ContainerProviderProperty {
        /**
         * The ID of the container cluster.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 100
         *
         * *Pattern* : `^[0-9A-Za-z][A-Za-z0-9\-_]*`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerprovider.html#cfn-emrcontainers-virtualcluster-containerprovider-id
         */
        readonly id: string;
        /**
         * The information about the container cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerprovider.html#cfn-emrcontainers-virtualcluster-containerprovider-info
         */
        readonly info: CfnVirtualCluster.ContainerInfoProperty | cdk.IResolvable;
        /**
         * The type of the container provider. Amazon EKS is the only supported type as of now.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-containerprovider.html#cfn-emrcontainers-virtualcluster-containerprovider-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerProviderProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualCluster_ContainerProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('info', cdk.requiredValidator)(properties.info));
    errors.collect(cdk.propertyValidator('info', CfnVirtualCluster_ContainerInfoPropertyValidator)(properties.info));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ContainerProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.ContainerProvider` resource
 *
 * @param properties - the TypeScript properties of a `ContainerProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.ContainerProvider` resource.
 */
// @ts-ignore TS6133
function cfnVirtualClusterContainerProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualCluster_ContainerProviderPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Info: cfnVirtualClusterContainerInfoPropertyToCloudFormation(properties.info),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnVirtualClusterContainerProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualCluster.ContainerProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualCluster.ContainerProviderProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('info', 'Info', CfnVirtualClusterContainerInfoPropertyFromCloudFormation(properties.Info));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualCluster {
    /**
     * The information about the Amazon EKS cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-eksinfo.html
     */
    export interface EksInfoProperty {
        /**
         * The namespaces of the EKS cluster.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 63
         *
         * *Pattern* : `[a-z0-9]([-a-z0-9]*[a-z0-9])?`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrcontainers-virtualcluster-eksinfo.html#cfn-emrcontainers-virtualcluster-eksinfo-namespace
         */
        readonly namespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `EksInfoProperty`
 *
 * @param properties - the TypeScript properties of a `EksInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualCluster_EksInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "EksInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.EksInfo` resource
 *
 * @param properties - the TypeScript properties of a `EksInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRContainers::VirtualCluster.EksInfo` resource.
 */
// @ts-ignore TS6133
function cfnVirtualClusterEksInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualCluster_EksInfoPropertyValidator(properties).assertSuccess();
    return {
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnVirtualClusterEksInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualCluster.EksInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualCluster.EksInfoProperty>();
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
