// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:22.993Z","fingerprint":"ipeG1GCDlATG8+W2nvA/UilFEEZ7wBNhXJrFSJ0bCAc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnRepositoryAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html
 */
export interface CfnRepositoryAssociationProps {

    /**
     * The name of the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-name
     */
    readonly name: string;

    /**
     * The type of repository that contains the source code to be reviewed. The valid values are:
     *
     * - `CodeCommit`
     * - `Bitbucket`
     * - `GitHubEnterpriseServer`
     * - `S3Bucket`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-type
     */
    readonly type: string;

    /**
     * The name of the bucket. This is required for your S3Bucket repositoryThe name must start with the prefix, `codeguru-reviewer-*` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-bucketname
     */
    readonly bucketName?: string;

    /**
     * The Amazon Resource Name (ARN) of an AWS CodeStar Connections connection. Its format is `arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id` . For more information, see [Connection](https://docs.aws.amazon.com/codestar-connections/latest/APIReference/API_Connection.html) in the *AWS CodeStar Connections API Reference* .
     *
     * `ConnectionArn` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-connectionarn
     */
    readonly connectionArn?: string;

    /**
     * The owner of the repository. For a GitHub Enterprise Server or Bitbucket repository, this is the username for the account that owns the repository.
     *
     * `Owner` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-owner
     */
    readonly owner?: string;

    /**
     * An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:
     *
     * - A *tag key* (for example, `CostCenter` , `Environment` , `Project` , or `Secret` ). Tag keys are case sensitive.
     * - An optional field known as a *tag value* (for example, `111122223333` , `Production` , or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRepositoryAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnRepositoryAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('connectionArn', cdk.validateString)(properties.connectionArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('owner', cdk.validateString)(properties.owner));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnRepositoryAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeGuruReviewer::RepositoryAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeGuruReviewer::RepositoryAssociation` resource.
 */
// @ts-ignore TS6133
function cfnRepositoryAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRepositoryAssociationPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        ConnectionArn: cdk.stringToCloudFormation(properties.connectionArn),
        Owner: cdk.stringToCloudFormation(properties.owner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRepositoryAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryAssociationProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('connectionArn', 'ConnectionArn', properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined);
    ret.addPropertyResult('owner', 'Owner', properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeGuruReviewer::RepositoryAssociation`
 *
 * This resource configures how Amazon CodeGuru Reviewer retrieves the source code to be reviewed. You can use an AWS CloudFormation template to create an association with the following repository types:
 *
 * - AWS CodeCommit - For more information, see [Create an AWS CodeCommit repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-codecommit-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - Bitbucket - For more information, see [Create a Bitbucket repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-bitbucket-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - GitHub Enterprise Server - For more information, see [Create a GitHub Enterprise Server repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-github-enterprise-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - S3Bucket - For more information, see [Create code reviews with GitHub Actions](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/working-with-cicd.html) in the *Amazon CodeGuru Reviewer User Guide* .
 *
 * > You cannot use a CloudFormation template to create an association with a GitHub repository.
 *
 * @cloudformationResource AWS::CodeGuruReviewer::RepositoryAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html
 */
export class CfnRepositoryAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeGuruReviewer::RepositoryAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRepositoryAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRepositoryAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRepositoryAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the [`RepositoryAssociation`](https://docs.aws.amazon.com/codeguru/latest/reviewer-api/API_RepositoryAssociation.html) object. You can retrieve this ARN by calling `ListRepositories` .
     * @cloudformationAttribute AssociationArn
     */
    public readonly attrAssociationArn: string;

    /**
     * The name of the repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-name
     */
    public name: string;

    /**
     * The type of repository that contains the source code to be reviewed. The valid values are:
     *
     * - `CodeCommit`
     * - `Bitbucket`
     * - `GitHubEnterpriseServer`
     * - `S3Bucket`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-type
     */
    public type: string;

    /**
     * The name of the bucket. This is required for your S3Bucket repositoryThe name must start with the prefix, `codeguru-reviewer-*` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-bucketname
     */
    public bucketName: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of an AWS CodeStar Connections connection. Its format is `arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id` . For more information, see [Connection](https://docs.aws.amazon.com/codestar-connections/latest/APIReference/API_Connection.html) in the *AWS CodeStar Connections API Reference* .
     *
     * `ConnectionArn` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-connectionarn
     */
    public connectionArn: string | undefined;

    /**
     * The owner of the repository. For a GitHub Enterprise Server or Bitbucket repository, this is the username for the account that owns the repository.
     *
     * `Owner` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-owner
     */
    public owner: string | undefined;

    /**
     * An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:
     *
     * - A *tag key* (for example, `CostCenter` , `Environment` , `Project` , or `Secret` ). Tag keys are case sensitive.
     * - An optional field known as a *tag value* (for example, `111122223333` , `Production` , or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodeGuruReviewer::RepositoryAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRepositoryAssociationProps) {
        super(scope, id, { type: CfnRepositoryAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'type', this);
        this.attrAssociationArn = cdk.Token.asString(this.getAtt('AssociationArn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.type = props.type;
        this.bucketName = props.bucketName;
        this.connectionArn = props.connectionArn;
        this.owner = props.owner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeGuruReviewer::RepositoryAssociation", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepositoryAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            type: this.type,
            bucketName: this.bucketName,
            connectionArn: this.connectionArn,
            owner: this.owner,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRepositoryAssociationPropsToCloudFormation(props);
    }
}
