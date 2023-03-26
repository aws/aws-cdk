// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:57:00.385Z","fingerprint":"QANdQPnoOlMGDtYTBKMi4TbpR5kN8N2f8/NTTBdgopc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html
 */
export interface CfnRepositoryProps {

    /**
     * The name of the new repository to be created.
     *
     * > The repository name must be unique across the calling AWS account . Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. For more information about the limits on repository names, see [Quotas](https://docs.aws.amazon.com/codecommit/latest/userguide/limits.html) in the *AWS CodeCommit User Guide* . The suffix .git is prohibited.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositoryname
     */
    readonly repositoryName: string;

    /**
     * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack. Information about code is only used in resource creation. Updates to a stack will not reflect changes made to code properties after initial resource creation.
     *
     * > You can only use this property to add code when creating a repository with a AWS CloudFormation template at creation time. This property cannot be used for updating code to an existing repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-code
     */
    readonly code?: CfnRepository.CodeProperty | cdk.IResolvable;

    /**
     * A comment or description about the new repository.
     *
     * > The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositorydescription
     */
    readonly repositoryDescription?: string;

    /**
     * One or more tag key-value pairs to use when tagging this repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The JSON block of configuration information for each trigger.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-triggers
     */
    readonly triggers?: Array<CfnRepository.RepositoryTriggerProperty | cdk.IResolvable> | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('code', CfnRepository_CodePropertyValidator)(properties.code));
    errors.collect(cdk.propertyValidator('repositoryDescription', cdk.validateString)(properties.repositoryDescription));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.requiredValidator)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('triggers', cdk.listValidator(CfnRepository_RepositoryTriggerPropertyValidator))(properties.triggers));
    return errors.wrap('supplied properties not correct for "CfnRepositoryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeCommit::Repository` resource
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeCommit::Repository` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepositoryPropsValidator(properties).assertSuccess();
    return {
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        Code: cfnRepositoryCodePropertyToCloudFormation(properties.code),
        RepositoryDescription: cdk.stringToCloudFormation(properties.repositoryDescription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Triggers: cdk.listMapper(cfnRepositoryRepositoryTriggerPropertyToCloudFormation)(properties.triggers),
    };
}

// @ts-ignore TS6133
function CfnRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryProps>();
    ret.addPropertyResult('repositoryName', 'RepositoryName', cfn_parse.FromCloudFormation.getString(properties.RepositoryName));
    ret.addPropertyResult('code', 'Code', properties.Code != null ? CfnRepositoryCodePropertyFromCloudFormation(properties.Code) : undefined);
    ret.addPropertyResult('repositoryDescription', 'RepositoryDescription', properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('triggers', 'Triggers', properties.Triggers != null ? cfn_parse.FromCloudFormation.getArray(CfnRepositoryRepositoryTriggerPropertyFromCloudFormation)(properties.Triggers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeCommit::Repository`
 *
 * Creates a new, empty repository.
 *
 * @cloudformationResource AWS::CodeCommit::Repository
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeCommit::Repository";

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
     * When you pass the logical ID of this resource, the function returns the URL to use for cloning the repository over HTTPS.
     * @cloudformationAttribute CloneUrlHttp
     */
    public readonly attrCloneUrlHttp: string;

    /**
     * When you pass the logical ID of this resource, the function returns the URL to use for cloning the repository over SSH.
     * @cloudformationAttribute CloneUrlSsh
     */
    public readonly attrCloneUrlSsh: string;

    /**
     * When you pass the logical ID of this resource, the function returns the repository's name.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The name of the new repository to be created.
     *
     * > The repository name must be unique across the calling AWS account . Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. For more information about the limits on repository names, see [Quotas](https://docs.aws.amazon.com/codecommit/latest/userguide/limits.html) in the *AWS CodeCommit User Guide* . The suffix .git is prohibited.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositoryname
     */
    public repositoryName: string;

    /**
     * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack. Information about code is only used in resource creation. Updates to a stack will not reflect changes made to code properties after initial resource creation.
     *
     * > You can only use this property to add code when creating a repository with a AWS CloudFormation template at creation time. This property cannot be used for updating code to an existing repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-code
     */
    public code: CfnRepository.CodeProperty | cdk.IResolvable | undefined;

    /**
     * A comment or description about the new repository.
     *
     * > The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositorydescription
     */
    public repositoryDescription: string | undefined;

    /**
     * One or more tag key-value pairs to use when tagging this repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The JSON block of configuration information for each trigger.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-triggers
     */
    public triggers: Array<CfnRepository.RepositoryTriggerProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::CodeCommit::Repository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRepositoryProps) {
        super(scope, id, { type: CfnRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'repositoryName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCloneUrlHttp = cdk.Token.asString(this.getAtt('CloneUrlHttp', cdk.ResolutionTypeHint.STRING));
        this.attrCloneUrlSsh = cdk.Token.asString(this.getAtt('CloneUrlSsh', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.repositoryName = props.repositoryName;
        this.code = props.code;
        this.repositoryDescription = props.repositoryDescription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeCommit::Repository", props.tags, { tagPropertyName: 'tags' });
        this.triggers = props.triggers;
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
            repositoryName: this.repositoryName,
            code: this.code,
            repositoryDescription: this.repositoryDescription,
            tags: this.tags.renderTags(),
            triggers: this.triggers,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRepositoryPropsToCloudFormation(props);
    }
}

export namespace CfnRepository {
    /**
     * Information about code to be committed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html
     */
    export interface CodeProperty {
        /**
         * Optional. Specifies a branch name to be used as the default branch when importing code into a repository on initial creation. If this property is not set, the name *main* will be used for the default branch for the repository. Changes to this property are ignored after initial resource creation. We recommend using this parameter to set the name to *main* to align with the default behavior of CodeCommit unless another name is needed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html#cfn-codecommit-repository-code-branchname
         */
        readonly branchName?: string;
        /**
         * Information about the Amazon S3 bucket that contains a ZIP file of code to be committed to the repository. Changes to this property are ignored after initial resource creation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html#cfn-codecommit-repository-code-s3
         */
        readonly s3: CfnRepository.S3Property | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CodeProperty`
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_CodePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('branchName', cdk.validateString)(properties.branchName));
    errors.collect(cdk.propertyValidator('s3', cdk.requiredValidator)(properties.s3));
    errors.collect(cdk.propertyValidator('s3', CfnRepository_S3PropertyValidator)(properties.s3));
    return errors.wrap('supplied properties not correct for "CodeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.Code` resource
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.Code` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryCodePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_CodePropertyValidator(properties).assertSuccess();
    return {
        BranchName: cdk.stringToCloudFormation(properties.branchName),
        S3: cfnRepositoryS3PropertyToCloudFormation(properties.s3),
    };
}

// @ts-ignore TS6133
function CfnRepositoryCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.CodeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.CodeProperty>();
    ret.addPropertyResult('branchName', 'BranchName', properties.BranchName != null ? cfn_parse.FromCloudFormation.getString(properties.BranchName) : undefined);
    ret.addPropertyResult('s3', 'S3', CfnRepositoryS3PropertyFromCloudFormation(properties.S3));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRepository {
    /**
     * Information about a trigger for a repository.
     *
     * > If you want to receive notifications about repository events, consider using notifications instead of triggers. For more information, see [Configuring notifications for repository events](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-repository-email.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html
     */
    export interface RepositoryTriggerProperty {
        /**
         * The branches to be included in the trigger configuration. If you specify an empty array, the trigger applies to all branches.
         *
         * > Although no content is required in the array, you must include the array itself.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-branches
         */
        readonly branches?: string[];
        /**
         * Any custom data associated with the trigger to be included in the information sent to the target of the trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-customdata
         */
        readonly customData?: string;
        /**
         * The ARN of the resource that is the target for a trigger (for example, the ARN of a topic in Amazon SNS).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-destinationarn
         */
        readonly destinationArn: string;
        /**
         * The repository events that cause the trigger to run actions in another service, such as sending a notification through Amazon SNS.
         *
         * > The valid value "all" cannot be used with any other values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-events
         */
        readonly events: string[];
        /**
         * The name of the trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `RepositoryTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryTriggerProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_RepositoryTriggerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('branches', cdk.listValidator(cdk.validateString))(properties.branches));
    errors.collect(cdk.propertyValidator('customData', cdk.validateString)(properties.customData));
    errors.collect(cdk.propertyValidator('destinationArn', cdk.requiredValidator)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('events', cdk.requiredValidator)(properties.events));
    errors.collect(cdk.propertyValidator('events', cdk.listValidator(cdk.validateString))(properties.events));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "RepositoryTriggerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.RepositoryTrigger` resource
 *
 * @param properties - the TypeScript properties of a `RepositoryTriggerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.RepositoryTrigger` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryRepositoryTriggerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_RepositoryTriggerPropertyValidator(properties).assertSuccess();
    return {
        Branches: cdk.listMapper(cdk.stringToCloudFormation)(properties.branches),
        CustomData: cdk.stringToCloudFormation(properties.customData),
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        Events: cdk.listMapper(cdk.stringToCloudFormation)(properties.events),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRepositoryRepositoryTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.RepositoryTriggerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.RepositoryTriggerProperty>();
    ret.addPropertyResult('branches', 'Branches', properties.Branches != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Branches) : undefined);
    ret.addPropertyResult('customData', 'CustomData', properties.CustomData != null ? cfn_parse.FromCloudFormation.getString(properties.CustomData) : undefined);
    ret.addPropertyResult('destinationArn', 'DestinationArn', cfn_parse.FromCloudFormation.getString(properties.DestinationArn));
    ret.addPropertyResult('events', 'Events', cfn_parse.FromCloudFormation.getStringArray(properties.Events));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRepository {
    /**
     * Information about the Amazon S3 bucket that contains the code that will be committed to the new repository. Changes to this property are ignored after initial resource creation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html
     */
    export interface S3Property {
        /**
         * The name of the Amazon S3 bucket that contains the ZIP file with the content that will be committed to the new repository. This can be specified using the name of the bucket in the AWS account . Changes to this property are ignored after initial resource creation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-bucket
         */
        readonly bucket: string;
        /**
         * The key to use for accessing the Amazon S3 bucket. Changes to this property are ignored after initial resource creation. For more information, see [Creating object key names](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html) and [Uploading objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) in the Amazon S3 User Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-key
         */
        readonly key: string;
        /**
         * The object version of the ZIP file, if versioning is enabled for the Amazon S3 bucket. Changes to this property are ignored after initial resource creation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-objectversion
         */
        readonly objectVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
function CfnRepository_S3PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('objectVersion', cdk.validateString)(properties.objectVersion));
    return errors.wrap('supplied properties not correct for "S3Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.S3` resource
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeCommit::Repository.S3` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryS3PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepository_S3PropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        ObjectVersion: cdk.stringToCloudFormation(properties.objectVersion),
    };
}

// @ts-ignore TS6133
function CfnRepositoryS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.S3Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.S3Property>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('objectVersion', 'ObjectVersion', properties.ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
