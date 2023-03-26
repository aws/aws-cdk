// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:22.980Z","fingerprint":"1wrpESX7GaiQv4WrCf62XH736OHL7UTbIlUA7sAbYf0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html
 */
export interface CfnDomainProps {

    /**
     * A string that specifies the name of the requested domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-domainname
     */
    readonly domainName: string;

    /**
     * The key used to encrypt the domain.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-encryptionkey
     */
    readonly encryptionKey?: string;

    /**
     * The document that defines the resource policy that is set on a domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-permissionspolicydocument
     */
    readonly permissionsPolicyDocument?: any | cdk.IResolvable;

    /**
     * A list of tags to be applied to the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('encryptionKey', cdk.validateString)(properties.encryptionKey));
    errors.collect(cdk.propertyValidator('permissionsPolicyDocument', cdk.validateObject)(properties.permissionsPolicyDocument));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDomainProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeArtifact::Domain` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeArtifact::Domain` resource.
 */
// @ts-ignore TS6133
function cfnDomainPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainPropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        EncryptionKey: cdk.stringToCloudFormation(properties.encryptionKey),
        PermissionsPolicyDocument: cdk.objectToCloudFormation(properties.permissionsPolicyDocument),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('encryptionKey', 'EncryptionKey', properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined);
    ret.addPropertyResult('permissionsPolicyDocument', 'PermissionsPolicyDocument', properties.PermissionsPolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PermissionsPolicyDocument) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeArtifact::Domain`
 *
 * The `AWS::CodeArtifact::Domain` resource creates an AWS CodeArtifact domain. CodeArtifact *domains* make it easier to manage multiple repositories across an organization. You can use a domain to apply permissions across many repositories owned by different AWS accounts. For more information about domains, see the [Domain concepts information](https://docs.aws.amazon.com/codeartifact/latest/ug/codeartifact-concepts.html#welcome-concepts-domain) in the *CodeArtifact User Guide* . For more information about the `CreateDomain` API, see [CreateDomain](https://docs.aws.amazon.com/codeartifact/latest/APIReference/API_CreateDomain.html) in the *CodeArtifact API Reference* .
 *
 * @cloudformationResource AWS::CodeArtifact::Domain
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeArtifact::Domain";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDomain(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * When you pass the logical ID of this resource, the function returns the Amazon Resource Name (ARN) of the domain.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * When you pass the logical ID of this resource, the function returns the key used to encrypt the domain.
     * @cloudformationAttribute EncryptionKey
     */
    public readonly attrEncryptionKey: string;

    /**
     * When you pass the logical ID of this resource, the function returns the name of the domain.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * When you pass the logical ID of this resource, the function returns the 12-digit account number of the AWS account that owns the domain.
     * @cloudformationAttribute Owner
     */
    public readonly attrOwner: string;

    /**
     * A string that specifies the name of the requested domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-domainname
     */
    public domainName: string;

    /**
     * The key used to encrypt the domain.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-encryptionkey
     */
    public encryptionKey: string | undefined;

    /**
     * The document that defines the resource policy that is set on a domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-permissionspolicydocument
     */
    public permissionsPolicyDocument: any | cdk.IResolvable | undefined;

    /**
     * A list of tags to be applied to the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodeArtifact::Domain`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainProps) {
        super(scope, id, { type: CfnDomain.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrEncryptionKey = cdk.Token.asString(this.getAtt('EncryptionKey', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));
        this.attrOwner = cdk.Token.asString(this.getAtt('Owner', cdk.ResolutionTypeHint.STRING));

        this.domainName = props.domainName;
        this.encryptionKey = props.encryptionKey;
        this.permissionsPolicyDocument = props.permissionsPolicyDocument;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeArtifact::Domain", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domainName: this.domainName,
            encryptionKey: this.encryptionKey,
            permissionsPolicyDocument: this.permissionsPolicyDocument,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDomainPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html
 */
export interface CfnRepositoryProps {

    /**
     * The name of the domain that contains the repository.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainname
     */
    readonly domainName: string;

    /**
     * The name of an upstream repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname
     */
    readonly repositoryName: string;

    /**
     * A text description of the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-description
     */
    readonly description?: string;

    /**
     * The 12-digit account number of the AWS account that owns the domain that contains the repository. It does not include dashes or spaces.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainowner
     */
    readonly domainOwner?: string;

    /**
     * An array of external connections associated with the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-externalconnections
     */
    readonly externalConnections?: string[];

    /**
     * The document that defines the resource policy that is set on a repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-permissionspolicydocument
     */
    readonly permissionsPolicyDocument?: any | cdk.IResolvable;

    /**
     * A list of tags to be applied to the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see [Working with upstream repositories](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-upstreams
     */
    readonly upstreams?: string[];
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
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainOwner', cdk.validateString)(properties.domainOwner));
    errors.collect(cdk.propertyValidator('externalConnections', cdk.listValidator(cdk.validateString))(properties.externalConnections));
    errors.collect(cdk.propertyValidator('permissionsPolicyDocument', cdk.validateObject)(properties.permissionsPolicyDocument));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.requiredValidator)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('upstreams', cdk.listValidator(cdk.validateString))(properties.upstreams));
    return errors.wrap('supplied properties not correct for "CfnRepositoryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeArtifact::Repository` resource
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeArtifact::Repository` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepositoryPropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        Description: cdk.stringToCloudFormation(properties.description),
        DomainOwner: cdk.stringToCloudFormation(properties.domainOwner),
        ExternalConnections: cdk.listMapper(cdk.stringToCloudFormation)(properties.externalConnections),
        PermissionsPolicyDocument: cdk.objectToCloudFormation(properties.permissionsPolicyDocument),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Upstreams: cdk.listMapper(cdk.stringToCloudFormation)(properties.upstreams),
    };
}

// @ts-ignore TS6133
function CfnRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('repositoryName', 'RepositoryName', cfn_parse.FromCloudFormation.getString(properties.RepositoryName));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('domainOwner', 'DomainOwner', properties.DomainOwner != null ? cfn_parse.FromCloudFormation.getString(properties.DomainOwner) : undefined);
    ret.addPropertyResult('externalConnections', 'ExternalConnections', properties.ExternalConnections != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExternalConnections) : undefined);
    ret.addPropertyResult('permissionsPolicyDocument', 'PermissionsPolicyDocument', properties.PermissionsPolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PermissionsPolicyDocument) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('upstreams', 'Upstreams', properties.Upstreams != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Upstreams) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeArtifact::Repository`
 *
 * The `AWS::CodeArtifact::Repository` resource creates an AWS CodeArtifact repository. CodeArtifact *repositories* contain a set of package versions. For more information about repositories, see the [Repository concepts information](https://docs.aws.amazon.com/codeartifact/latest/ug/codeartifact-concepts.html#welcome-concepts-repository) in the *CodeArtifact User Guide* . For more information about the `CreateRepository` API, see [CreateRepository](https://docs.aws.amazon.com/codeartifact/latest/APIReference/API_CreateRepository.html) in the *CodeArtifact API Reference* .
 *
 * @cloudformationResource AWS::CodeArtifact::Repository
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeArtifact::Repository";

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
     * When you pass the logical ID of this resource, the function returns the Amazon Resource Name (ARN) of the repository.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * When you pass the logical ID of this resource, the function returns the domain name that contains the repository.
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * When you pass the logical ID of this resource, the function returns the 12-digit account number of the AWS account that owns the domain that contains the repository.
     * @cloudformationAttribute DomainOwner
     */
    public readonly attrDomainOwner: string;

    /**
     * When you pass the logical ID of this resource, the function returns the name of the repository.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The name of the domain that contains the repository.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainname
     */
    public domainName: string;

    /**
     * The name of an upstream repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname
     */
    public repositoryName: string;

    /**
     * A text description of the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-description
     */
    public description: string | undefined;

    /**
     * The 12-digit account number of the AWS account that owns the domain that contains the repository. It does not include dashes or spaces.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainowner
     */
    public domainOwner: string | undefined;

    /**
     * An array of external connections associated with the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-externalconnections
     */
    public externalConnections: string[] | undefined;

    /**
     * The document that defines the resource policy that is set on a repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-permissionspolicydocument
     */
    public permissionsPolicyDocument: any | cdk.IResolvable | undefined;

    /**
     * A list of tags to be applied to the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see [Working with upstream repositories](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-upstreams
     */
    public upstreams: string[] | undefined;

    /**
     * Create a new `AWS::CodeArtifact::Repository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRepositoryProps) {
        super(scope, id, { type: CfnRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);
        cdk.requireProperty(props, 'repositoryName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));
        this.attrDomainOwner = cdk.Token.asString(this.getAtt('DomainOwner', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.domainName = props.domainName;
        this.repositoryName = props.repositoryName;
        this.description = props.description;
        this.domainOwner = props.domainOwner;
        this.externalConnections = props.externalConnections;
        this.permissionsPolicyDocument = props.permissionsPolicyDocument;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeArtifact::Repository", props.tags, { tagPropertyName: 'tags' });
        this.upstreams = props.upstreams;
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
            domainName: this.domainName,
            repositoryName: this.repositoryName,
            description: this.description,
            domainOwner: this.domainOwner,
            externalConnections: this.externalConnections,
            permissionsPolicyDocument: this.permissionsPolicyDocument,
            tags: this.tags.renderTags(),
            upstreams: this.upstreams,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRepositoryPropsToCloudFormation(props);
    }
}
