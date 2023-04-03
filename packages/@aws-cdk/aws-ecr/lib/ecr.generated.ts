// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:51:55.282Z","fingerprint":"Qy2Wo/Yjec6rlHRf03wUw7xA+iITFRbYUVD7J2/m5Ys="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnPublicRepository`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html
 */
export interface CfnPublicRepositoryProps {

    /**
     * The details about the repository that are publicly visible in the Amazon ECR Public Gallery. For more information, see [Amazon ECR Public repository catalog data](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-catalog-data.html) in the *Amazon ECR Public User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorycatalogdata
     */
    readonly repositoryCatalogData?: any | cdk.IResolvable;

    /**
     * The name to use for the public repository. The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositoryname
     */
    readonly repositoryName?: string;

    /**
     * The JSON repository policy text to apply to the public repository. For more information, see [Amazon ECR Public repository policies](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-policies.html) in the *Amazon ECR Public User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorypolicytext
     */
    readonly repositoryPolicyText?: any | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPublicRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicRepositoryProps`
 *
 * @returns the result of the validation.
 */
function CfnPublicRepositoryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('repositoryCatalogData', cdk.validateObject)(properties.repositoryCatalogData));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('repositoryPolicyText', cdk.validateObject)(properties.repositoryPolicyText));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPublicRepositoryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::PublicRepository` resource
 *
 * @param properties - the TypeScript properties of a `CfnPublicRepositoryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::PublicRepository` resource.
 */
// @ts-ignore TS6133
function cfnPublicRepositoryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPublicRepositoryPropsValidator(properties).assertSuccess();
    return {
        RepositoryCatalogData: cdk.objectToCloudFormation(properties.repositoryCatalogData),
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        RepositoryPolicyText: cdk.objectToCloudFormation(properties.repositoryPolicyText),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPublicRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicRepositoryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicRepositoryProps>();
    ret.addPropertyResult('repositoryCatalogData', 'RepositoryCatalogData', properties.RepositoryCatalogData != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryCatalogData) : undefined);
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('repositoryPolicyText', 'RepositoryPolicyText', properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ECR::PublicRepository`
 *
 * The `AWS::ECR::PublicRepository` resource specifies an Amazon Elastic Container Registry Public (Amazon ECR Public) repository, where users can push and pull Docker images, Open Container Initiative (OCI) images, and OCI compatible artifacts. For more information, see [Amazon ECR public repositories](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repositories.html) in the *Amazon ECR Public User Guide* .
 *
 * @cloudformationResource AWS::ECR::PublicRepository
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html
 */
export class CfnPublicRepository extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ECR::PublicRepository";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicRepository {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPublicRepositoryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPublicRepository(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) for the specified `AWS::ECR::PublicRepository` resource. For example, `arn:aws:ecr-public:: *123456789012* :repository/ *test-repository*` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The details about the repository that are publicly visible in the Amazon ECR Public Gallery. For more information, see [Amazon ECR Public repository catalog data](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-catalog-data.html) in the *Amazon ECR Public User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorycatalogdata
     */
    public repositoryCatalogData: any | cdk.IResolvable | undefined;

    /**
     * The name to use for the public repository. The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositoryname
     */
    public repositoryName: string | undefined;

    /**
     * The JSON repository policy text to apply to the public repository. For more information, see [Amazon ECR Public repository policies](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-policies.html) in the *Amazon ECR Public User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorypolicytext
     */
    public repositoryPolicyText: any | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ECR::PublicRepository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPublicRepositoryProps = {}) {
        super(scope, id, { type: CfnPublicRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.repositoryCatalogData = props.repositoryCatalogData;
        this.repositoryName = props.repositoryName;
        this.repositoryPolicyText = props.repositoryPolicyText;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECR::PublicRepository", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicRepository.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            repositoryCatalogData: this.repositoryCatalogData,
            repositoryName: this.repositoryName,
            repositoryPolicyText: this.repositoryPolicyText,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPublicRepositoryPropsToCloudFormation(props);
    }
}

export namespace CfnPublicRepository {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html
     */
    export interface RepositoryCatalogDataProperty {
        /**
         * `CfnPublicRepository.RepositoryCatalogDataProperty.AboutText`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-abouttext
         */
        readonly aboutText?: string;
        /**
         * `CfnPublicRepository.RepositoryCatalogDataProperty.Architectures`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-architectures
         */
        readonly architectures?: string[];
        /**
         * `CfnPublicRepository.RepositoryCatalogDataProperty.OperatingSystems`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-operatingsystems
         */
        readonly operatingSystems?: string[];
        /**
         * `CfnPublicRepository.RepositoryCatalogDataProperty.RepositoryDescription`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-repositorydescription
         */
        readonly repositoryDescription?: string;
        /**
         * `CfnPublicRepository.RepositoryCatalogDataProperty.UsageText`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-usagetext
         */
        readonly usageText?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RepositoryCatalogDataProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryCatalogDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnPublicRepository_RepositoryCatalogDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aboutText', cdk.validateString)(properties.aboutText));
    errors.collect(cdk.propertyValidator('architectures', cdk.listValidator(cdk.validateString))(properties.architectures));
    errors.collect(cdk.propertyValidator('operatingSystems', cdk.listValidator(cdk.validateString))(properties.operatingSystems));
    errors.collect(cdk.propertyValidator('repositoryDescription', cdk.validateString)(properties.repositoryDescription));
    errors.collect(cdk.propertyValidator('usageText', cdk.validateString)(properties.usageText));
    return errors.wrap('supplied properties not correct for "RepositoryCatalogDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::PublicRepository.RepositoryCatalogData` resource
 *
 * @param properties - the TypeScript properties of a `RepositoryCatalogDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::PublicRepository.RepositoryCatalogData` resource.
 */
// @ts-ignore TS6133
function cfnPublicRepositoryRepositoryCatalogDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPublicRepository_RepositoryCatalogDataPropertyValidator(properties).assertSuccess();
    return {
        AboutText: cdk.stringToCloudFormation(properties.aboutText),
        Architectures: cdk.listMapper(cdk.stringToCloudFormation)(properties.architectures),
        OperatingSystems: cdk.listMapper(cdk.stringToCloudFormation)(properties.operatingSystems),
        RepositoryDescription: cdk.stringToCloudFormation(properties.repositoryDescription),
        UsageText: cdk.stringToCloudFormation(properties.usageText),
    };
}

// @ts-ignore TS6133
function CfnPublicRepositoryRepositoryCatalogDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicRepository.RepositoryCatalogDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicRepository.RepositoryCatalogDataProperty>();
    ret.addPropertyResult('aboutText', 'AboutText', properties.AboutText != null ? cfn_parse.FromCloudFormation.getString(properties.AboutText) : undefined);
    ret.addPropertyResult('architectures', 'Architectures', properties.Architectures != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Architectures) : undefined);
    ret.addPropertyResult('operatingSystems', 'OperatingSystems', properties.OperatingSystems != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OperatingSystems) : undefined);
    ret.addPropertyResult('repositoryDescription', 'RepositoryDescription', properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined);
    ret.addPropertyResult('usageText', 'UsageText', properties.UsageText != null ? cfn_parse.FromCloudFormation.getString(properties.UsageText) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPullThroughCacheRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html
 */
export interface CfnPullThroughCacheRuleProps {

    /**
     * The Amazon ECR repository prefix associated with the pull through cache rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-ecrrepositoryprefix
     */
    readonly ecrRepositoryPrefix?: string;

    /**
     * The upstream registry URL associated with the pull through cache rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-upstreamregistryurl
     */
    readonly upstreamRegistryUrl?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPullThroughCacheRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnPullThroughCacheRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnPullThroughCacheRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ecrRepositoryPrefix', cdk.validateString)(properties.ecrRepositoryPrefix));
    errors.collect(cdk.propertyValidator('upstreamRegistryUrl', cdk.validateString)(properties.upstreamRegistryUrl));
    return errors.wrap('supplied properties not correct for "CfnPullThroughCacheRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::PullThroughCacheRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnPullThroughCacheRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::PullThroughCacheRule` resource.
 */
// @ts-ignore TS6133
function cfnPullThroughCacheRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPullThroughCacheRulePropsValidator(properties).assertSuccess();
    return {
        EcrRepositoryPrefix: cdk.stringToCloudFormation(properties.ecrRepositoryPrefix),
        UpstreamRegistryUrl: cdk.stringToCloudFormation(properties.upstreamRegistryUrl),
    };
}

// @ts-ignore TS6133
function CfnPullThroughCacheRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPullThroughCacheRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPullThroughCacheRuleProps>();
    ret.addPropertyResult('ecrRepositoryPrefix', 'EcrRepositoryPrefix', properties.EcrRepositoryPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.EcrRepositoryPrefix) : undefined);
    ret.addPropertyResult('upstreamRegistryUrl', 'UpstreamRegistryUrl', properties.UpstreamRegistryUrl != null ? cfn_parse.FromCloudFormation.getString(properties.UpstreamRegistryUrl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ECR::PullThroughCacheRule`
 *
 * Creates a pull through cache rule. A pull through cache rule provides a way to cache images from an external public registry in your Amazon ECR private registry.
 *
 * @cloudformationResource AWS::ECR::PullThroughCacheRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html
 */
export class CfnPullThroughCacheRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ECR::PullThroughCacheRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPullThroughCacheRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPullThroughCacheRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPullThroughCacheRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon ECR repository prefix associated with the pull through cache rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-ecrrepositoryprefix
     */
    public ecrRepositoryPrefix: string | undefined;

    /**
     * The upstream registry URL associated with the pull through cache rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-upstreamregistryurl
     */
    public upstreamRegistryUrl: string | undefined;

    /**
     * Create a new `AWS::ECR::PullThroughCacheRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPullThroughCacheRuleProps = {}) {
        super(scope, id, { type: CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.ecrRepositoryPrefix = props.ecrRepositoryPrefix;
        this.upstreamRegistryUrl = props.upstreamRegistryUrl;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ecrRepositoryPrefix: this.ecrRepositoryPrefix,
            upstreamRegistryUrl: this.upstreamRegistryUrl,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPullThroughCacheRulePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRegistryPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html
 */
export interface CfnRegistryPolicyProps {

    /**
     * The JSON policy text for your registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html#cfn-ecr-registrypolicy-policytext
     */
    readonly policyText: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnRegistryPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyText', cdk.requiredValidator)(properties.policyText));
    errors.collect(cdk.propertyValidator('policyText', cdk.validateObject)(properties.policyText));
    return errors.wrap('supplied properties not correct for "CfnRegistryPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::RegistryPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::RegistryPolicy` resource.
 */
// @ts-ignore TS6133
function cfnRegistryPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegistryPolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyText: cdk.objectToCloudFormation(properties.policyText),
    };
}

// @ts-ignore TS6133
function CfnRegistryPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryPolicyProps>();
    ret.addPropertyResult('policyText', 'PolicyText', cfn_parse.FromCloudFormation.getAny(properties.PolicyText));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ECR::RegistryPolicy`
 *
 * The `AWS::ECR::RegistryPolicy` resource creates or updates the permissions policy for a private registry.
 *
 * A private registry policy is used to specify permissions for another AWS account and is used when configuring cross-account replication. For more information, see [Registry permissions](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry-permissions.html) in the *Amazon Elastic Container Registry User Guide* .
 *
 * @cloudformationResource AWS::ECR::RegistryPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html
 */
export class CfnRegistryPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ECR::RegistryPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistryPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRegistryPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRegistryPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The account ID of the private registry the policy is associated with.
     * @cloudformationAttribute RegistryId
     */
    public readonly attrRegistryId: string;

    /**
     * The JSON policy text for your registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html#cfn-ecr-registrypolicy-policytext
     */
    public policyText: any | cdk.IResolvable;

    /**
     * Create a new `AWS::ECR::RegistryPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRegistryPolicyProps) {
        super(scope, id, { type: CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policyText', this);
        this.attrRegistryId = cdk.Token.asString(this.getAtt('RegistryId', cdk.ResolutionTypeHint.STRING));

        this.policyText = props.policyText;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policyText: this.policyText,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRegistryPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReplicationConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html
 */
export interface CfnReplicationConfigurationProps {

    /**
     * The replication configuration for a registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html#cfn-ecr-replicationconfiguration-replicationconfiguration
     */
    readonly replicationConfiguration: CfnReplicationConfiguration.ReplicationConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnReplicationConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicationConfiguration', cdk.requiredValidator)(properties.replicationConfiguration));
    errors.collect(cdk.propertyValidator('replicationConfiguration', CfnReplicationConfiguration_ReplicationConfigurationPropertyValidator)(properties.replicationConfiguration));
    return errors.wrap('supplied properties not correct for "CfnReplicationConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnReplicationConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationConfigurationPropsValidator(properties).assertSuccess();
    return {
        ReplicationConfiguration: cfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration),
    };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfigurationProps>();
    ret.addPropertyResult('replicationConfiguration', 'ReplicationConfiguration', CfnReplicationConfigurationReplicationConfigurationPropertyFromCloudFormation(properties.ReplicationConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ECR::ReplicationConfiguration`
 *
 * The `AWS::ECR::ReplicationConfiguration` resource creates or updates the replication configuration for a private registry. The first time a replication configuration is applied to a private registry, a service-linked IAM role is created in your account for the replication process. For more information, see [Using Service-Linked Roles for Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/using-service-linked-roles.html) in the *Amazon Elastic Container Registry User Guide* .
 *
 * > When configuring cross-account replication, the destination account must grant the source account permission to replicate. This permission is controlled using a private registry permissions policy. For more information, see `AWS::ECR::RegistryPolicy` .
 *
 * @cloudformationResource AWS::ECR::ReplicationConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html
 */
export class CfnReplicationConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ECR::ReplicationConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The account ID of the destination registry.
     * @cloudformationAttribute RegistryId
     */
    public readonly attrRegistryId: string;

    /**
     * The replication configuration for a registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html#cfn-ecr-replicationconfiguration-replicationconfiguration
     */
    public replicationConfiguration: CfnReplicationConfiguration.ReplicationConfigurationProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::ECR::ReplicationConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationConfigurationProps) {
        super(scope, id, { type: CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'replicationConfiguration', this);
        this.attrRegistryId = cdk.Token.asString(this.getAtt('RegistryId', cdk.ResolutionTypeHint.STRING));

        this.replicationConfiguration = props.replicationConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            replicationConfiguration: this.replicationConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnReplicationConfiguration {
    /**
     * The replication configuration for a registry.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationconfiguration.html
     */
    export interface ReplicationConfigurationProperty {
        /**
         * An array of objects representing the replication destinations and repository filters for a replication configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationconfiguration.html#cfn-ecr-replicationconfiguration-replicationconfiguration-rules
         */
        readonly rules: Array<CfnReplicationConfiguration.ReplicationRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnReplicationConfiguration_ReplicationRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "ReplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationConfiguration_ReplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnReplicationConfigurationReplicationRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfiguration.ReplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationConfigurationProperty>();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationConfiguration {
    /**
     * An array of objects representing the destination for a replication rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html
     */
    export interface ReplicationDestinationProperty {
        /**
         * The Region to replicate to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html#cfn-ecr-replicationconfiguration-replicationdestination-region
         */
        readonly region: string;
        /**
         * The AWS account ID of the Amazon ECR private registry to replicate to. When configuring cross-Region replication within your own registry, specify your own account ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html#cfn-ecr-replicationconfiguration-replicationdestination-registryid
         */
        readonly registryId: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('registryId', cdk.requiredValidator)(properties.registryId));
    errors.collect(cdk.propertyValidator('registryId', cdk.validateString)(properties.registryId));
    return errors.wrap('supplied properties not correct for "ReplicationDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationDestination` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationDestination` resource.
 */
// @ts-ignore TS6133
function cfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationConfiguration_ReplicationDestinationPropertyValidator(properties).assertSuccess();
    return {
        Region: cdk.stringToCloudFormation(properties.region),
        RegistryId: cdk.stringToCloudFormation(properties.registryId),
    };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfiguration.ReplicationDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationDestinationProperty>();
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addPropertyResult('registryId', 'RegistryId', cfn_parse.FromCloudFormation.getString(properties.RegistryId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationConfiguration {
    /**
     * An array of objects representing the replication destinations and repository filters for a replication configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html
     */
    export interface ReplicationRuleProperty {
        /**
         * An array of objects representing the destination for a replication rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html#cfn-ecr-replicationconfiguration-replicationrule-destinations
         */
        readonly destinations: Array<CfnReplicationConfiguration.ReplicationDestinationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An array of objects representing the filters for a replication rule. Specifying a repository filter for a replication rule provides a method for controlling which repositories in a private registry are replicated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html#cfn-ecr-replicationconfiguration-replicationrule-repositoryfilters
         */
        readonly repositoryFilters?: Array<CfnReplicationConfiguration.RepositoryFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinations', cdk.requiredValidator)(properties.destinations));
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnReplicationConfiguration_ReplicationDestinationPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('repositoryFilters', cdk.listValidator(CfnReplicationConfiguration_RepositoryFilterPropertyValidator))(properties.repositoryFilters));
    return errors.wrap('supplied properties not correct for "ReplicationRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationRule` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.ReplicationRule` resource.
 */
// @ts-ignore TS6133
function cfnReplicationConfigurationReplicationRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationConfiguration_ReplicationRulePropertyValidator(properties).assertSuccess();
    return {
        Destinations: cdk.listMapper(cfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation)(properties.destinations),
        RepositoryFilters: cdk.listMapper(cfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation)(properties.repositoryFilters),
    };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfiguration.ReplicationRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationRuleProperty>();
    ret.addPropertyResult('destinations', 'Destinations', cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation)(properties.Destinations));
    ret.addPropertyResult('repositoryFilters', 'RepositoryFilters', properties.RepositoryFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation)(properties.RepositoryFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationConfiguration {
    /**
     * The filter settings used with image replication. Specifying a repository filter to a replication rule provides a method for controlling which repositories in a private registry are replicated. If no repository filter is specified, all images in the repository are replicated.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html
     */
    export interface RepositoryFilterProperty {
        /**
         * The repository filter details. When the `PREFIX_MATCH` filter type is specified, this value is required and should be the repository name prefix to configure replication for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html#cfn-ecr-replicationconfiguration-repositoryfilter-filter
         */
        readonly filter: string;
        /**
         * The repository filter type. The only supported value is `PREFIX_MATCH` , which is a repository name prefix specified with the `filter` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html#cfn-ecr-replicationconfiguration-repositoryfilter-filtertype
         */
        readonly filterType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RepositoryFilterProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_RepositoryFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filter', cdk.requiredValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('filter', cdk.validateString)(properties.filter));
    errors.collect(cdk.propertyValidator('filterType', cdk.requiredValidator)(properties.filterType));
    errors.collect(cdk.propertyValidator('filterType', cdk.validateString)(properties.filterType));
    return errors.wrap('supplied properties not correct for "RepositoryFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.RepositoryFilter` resource
 *
 * @param properties - the TypeScript properties of a `RepositoryFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::ReplicationConfiguration.RepositoryFilter` resource.
 */
// @ts-ignore TS6133
function cfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationConfiguration_RepositoryFilterPropertyValidator(properties).assertSuccess();
    return {
        Filter: cdk.stringToCloudFormation(properties.filter),
        FilterType: cdk.stringToCloudFormation(properties.filterType),
    };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfiguration.RepositoryFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.RepositoryFilterProperty>();
    ret.addPropertyResult('filter', 'Filter', cfn_parse.FromCloudFormation.getString(properties.Filter));
    ret.addPropertyResult('filterType', 'FilterType', cfn_parse.FromCloudFormation.getString(properties.FilterType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html
 */
export interface CfnRepositoryProps {

    /**
     * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * The image scanning configuration for the repository. This determines whether images are scanned for known vulnerabilities after being pushed to the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagescanningconfiguration
     */
    readonly imageScanningConfiguration?: CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable;

    /**
     * The tag mutability setting for the repository. If this parameter is omitted, the default setting of `MUTABLE` will be used which will allow image tags to be overwritten. If `IMMUTABLE` is specified, all image tags within the repository will be immutable which will prevent them from being overwritten.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagetagmutability
     */
    readonly imageTagMutability?: string;

    /**
     * Creates or updates a lifecycle policy. For information about lifecycle policy syntax, see [Lifecycle policy template](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-lifecyclepolicy
     */
    readonly lifecyclePolicy?: CfnRepository.LifecyclePolicyProperty | cdk.IResolvable;

    /**
     * The name to use for the repository. The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositoryname
     */
    readonly repositoryName?: string;

    /**
     * The JSON repository policy text to apply to the repository. For more information, see [Amazon ECR repository policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html) in the *Amazon Elastic Container Registry User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositorypolicytext
     */
    readonly repositoryPolicyText?: any | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the result of the validation.
 */
function CfnRepositoryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionConfiguration', CfnRepository_EncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
    errors.collect(cdk.propertyValidator('imageScanningConfiguration', CfnRepository_ImageScanningConfigurationPropertyValidator)(properties.imageScanningConfiguration));
    errors.collect(cdk.propertyValidator('imageTagMutability', cdk.validateString)(properties.imageTagMutability));
    errors.collect(cdk.propertyValidator('lifecyclePolicy', CfnRepository_LifecyclePolicyPropertyValidator)(properties.lifecyclePolicy));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('repositoryPolicyText', cdk.validateObject)(properties.repositoryPolicyText));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRepositoryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::Repository` resource
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::Repository` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepositoryPropsValidator(properties).assertSuccess();
    return {
        EncryptionConfiguration: cfnRepositoryEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
        ImageScanningConfiguration: cfnRepositoryImageScanningConfigurationPropertyToCloudFormation(properties.imageScanningConfiguration),
        ImageTagMutability: cdk.stringToCloudFormation(properties.imageTagMutability),
        LifecyclePolicy: cfnRepositoryLifecyclePolicyPropertyToCloudFormation(properties.lifecyclePolicy),
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        RepositoryPolicyText: cdk.objectToCloudFormation(properties.repositoryPolicyText),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryProps>();
    ret.addPropertyResult('encryptionConfiguration', 'EncryptionConfiguration', properties.EncryptionConfiguration != null ? CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined);
    ret.addPropertyResult('imageScanningConfiguration', 'ImageScanningConfiguration', properties.ImageScanningConfiguration != null ? CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties.ImageScanningConfiguration) : undefined);
    ret.addPropertyResult('imageTagMutability', 'ImageTagMutability', properties.ImageTagMutability != null ? cfn_parse.FromCloudFormation.getString(properties.ImageTagMutability) : undefined);
    ret.addPropertyResult('lifecyclePolicy', 'LifecyclePolicy', properties.LifecyclePolicy != null ? CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties.LifecyclePolicy) : undefined);
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('repositoryPolicyText', 'RepositoryPolicyText', properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ECR::Repository`
 *
 * The `AWS::ECR::Repository` resource specifies an Amazon Elastic Container Registry (Amazon ECR) repository, where users can push and pull Docker images, Open Container Initiative (OCI) images, and OCI compatible artifacts. For more information, see [Amazon ECR private repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html) in the *Amazon ECR User Guide* .
 *
 * @cloudformationResource AWS::ECR::Repository
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ECR::Repository";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRepository {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRepositoryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRepository(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) for the specified `AWS::ECR::Repository` resource. For example, `arn:aws:ecr: *eu-west-1* : *123456789012* :repository/ *test-repository*` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the URI for the specified `AWS::ECR::Repository` resource. For example, `*123456789012* .dkr.ecr. *us-west-2* .amazonaws.com/repository` .
     * @cloudformationAttribute RepositoryUri
     */
    public readonly attrRepositoryUri: string;

    /**
     * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-encryptionconfiguration
     */
    public encryptionConfiguration: CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The image scanning configuration for the repository. This determines whether images are scanned for known vulnerabilities after being pushed to the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagescanningconfiguration
     */
    public imageScanningConfiguration: CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tag mutability setting for the repository. If this parameter is omitted, the default setting of `MUTABLE` will be used which will allow image tags to be overwritten. If `IMMUTABLE` is specified, all image tags within the repository will be immutable which will prevent them from being overwritten.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagetagmutability
     */
    public imageTagMutability: string | undefined;

    /**
     * Creates or updates a lifecycle policy. For information about lifecycle policy syntax, see [Lifecycle policy template](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-lifecyclepolicy
     */
    public lifecyclePolicy: CfnRepository.LifecyclePolicyProperty | cdk.IResolvable | undefined;

    /**
     * The name to use for the repository. The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositoryname
     */
    public repositoryName: string | undefined;

    /**
     * The JSON repository policy text to apply to the repository. For more information, see [Amazon ECR repository policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html) in the *Amazon Elastic Container Registry User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositorypolicytext
     */
    public repositoryPolicyText: any | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ECR::Repository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRepositoryProps = {}) {
        super(scope, id, { type: CfnRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrRepositoryUri = cdk.Token.asString(this.getAtt('RepositoryUri', cdk.ResolutionTypeHint.STRING));

        this.encryptionConfiguration = props.encryptionConfiguration;
        this.imageScanningConfiguration = props.imageScanningConfiguration;
        this.imageTagMutability = props.imageTagMutability;
        this.lifecyclePolicy = props.lifecyclePolicy;
        this.repositoryName = props.repositoryName;
        this.repositoryPolicyText = props.repositoryPolicyText;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECR::Repository", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepository.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            encryptionConfiguration: this.encryptionConfiguration,
            imageScanningConfiguration: this.imageScanningConfiguration,
            imageTagMutability: this.imageTagMutability,
            lifecyclePolicy: this.lifecyclePolicy,
            repositoryName: this.repositoryName,
            repositoryPolicyText: this.repositoryPolicyText,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRepositoryPropsToCloudFormation(props);
    }
}

export namespace CfnRepository {
    /**
     * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
     *
     * By default, when no encryption configuration is set or the `AES256` encryption type is used, Amazon ECR uses server-side encryption with Amazon S3-managed encryption keys which encrypts your data at rest using an AES-256 encryption algorithm. This does not require any action on your part.
     *
     * For more control over the encryption of the contents of your repository, you can use server-side encryption with AWS Key Management Service key stored in AWS Key Management Service ( AWS KMS ) to encrypt your images. For more information, see [Amazon ECR encryption at rest](https://docs.aws.amazon.com/AmazonECR/latest/userguide/encryption-at-rest.html) in the *Amazon Elastic Container Registry User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html
     */
    export interface EncryptionConfigurationProperty {
        /**
         * The encryption type to use.
         *
         * If you use the `KMS` encryption type, the contents of the repository will be encrypted using server-side encryption with AWS Key Management Service key stored in AWS KMS . When you use AWS KMS to encrypt your data, you can either use the default AWS managed AWS KMS key for Amazon ECR, or specify your own AWS KMS key, which you already created. For more information, see [Protecting data using server-side encryption with an AWS KMS key stored in AWS Key Management Service (SSE-KMS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) in the *Amazon Simple Storage Service Console Developer Guide* .
         *
         * If you use the `AES256` encryption type, Amazon ECR uses server-side encryption with Amazon S3-managed encryption keys which encrypts the images in the repository using an AES-256 encryption algorithm. For more information, see [Protecting data using server-side encryption with Amazon S3-managed encryption keys (SSE-S3)](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) in the *Amazon Simple Storage Service Console Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html#cfn-ecr-repository-encryptionconfiguration-encryptiontype
         */
        readonly encryptionType: string;
        /**
         * If you use the `KMS` encryption type, specify the AWS KMS key to use for encryption. The alias, key ID, or full ARN of the AWS KMS key can be specified. The key must exist in the same Region as the repository. If no key is specified, the default AWS managed AWS KMS key for Amazon ECR will be used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html#cfn-ecr-repository-encryptionconfiguration-kmskey
         */
        readonly kmsKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_EncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionType', cdk.requiredValidator)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('kmsKey', cdk.validateString)(properties.kmsKey));
    return errors.wrap('supplied properties not correct for "EncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::Repository.EncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::Repository.EncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_EncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        KmsKey: cdk.stringToCloudFormation(properties.kmsKey),
    };
}

// @ts-ignore TS6133
function CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.EncryptionConfigurationProperty>();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addPropertyResult('kmsKey', 'KmsKey', properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRepository {
    /**
     * The image scanning configuration for a repository.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-imagescanningconfiguration.html
     */
    export interface ImageScanningConfigurationProperty {
        /**
         * The setting that determines whether images are scanned after being pushed to a repository. If set to `true` , images will be scanned after being pushed. If this parameter is not specified, it will default to `false` and images will not be scanned unless a scan is manually started.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-imagescanningconfiguration.html#cfn-ecr-repository-imagescanningconfiguration-scanonpush
         */
        readonly scanOnPush?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ImageScanningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_ImageScanningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scanOnPush', cdk.validateBoolean)(properties.scanOnPush));
    return errors.wrap('supplied properties not correct for "ImageScanningConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::Repository.ImageScanningConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::Repository.ImageScanningConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryImageScanningConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_ImageScanningConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ScanOnPush: cdk.booleanToCloudFormation(properties.scanOnPush),
    };
}

// @ts-ignore TS6133
function CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.ImageScanningConfigurationProperty>();
    ret.addPropertyResult('scanOnPush', 'ScanOnPush', properties.ScanOnPush != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScanOnPush) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRepository {
    /**
     * The `LifecyclePolicy` property type specifies a lifecycle policy. For information about lifecycle policy syntax, see [Lifecycle policy template](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) in the *Amazon ECR User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html
     */
    export interface LifecyclePolicyProperty {
        /**
         * The JSON repository policy text to apply to the repository.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-lifecyclepolicytext
         */
        readonly lifecyclePolicyText?: string;
        /**
         * The AWS account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-registryid
         */
        readonly registryId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LifecyclePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_LifecyclePolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lifecyclePolicyText', cdk.validateString)(properties.lifecyclePolicyText));
    errors.collect(cdk.propertyValidator('registryId', cdk.validateString)(properties.registryId));
    return errors.wrap('supplied properties not correct for "LifecyclePolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ECR::Repository.LifecyclePolicy` resource
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ECR::Repository.LifecyclePolicy` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryLifecyclePolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_LifecyclePolicyPropertyValidator(properties).assertSuccess();
    return {
        LifecyclePolicyText: cdk.stringToCloudFormation(properties.lifecyclePolicyText),
        RegistryId: cdk.stringToCloudFormation(properties.registryId),
    };
}

// @ts-ignore TS6133
function CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.LifecyclePolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.LifecyclePolicyProperty>();
    ret.addPropertyResult('lifecyclePolicyText', 'LifecyclePolicyText', properties.LifecyclePolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.LifecyclePolicyText) : undefined);
    ret.addPropertyResult('registryId', 'RegistryId', properties.RegistryId != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
