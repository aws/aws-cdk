// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:59.942Z","fingerprint":"0LT7LvlnWpA8c9e5lefrIU0jbPrVplU38teLfIk4nAA="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html
 */
export interface CfnDomainProps {

    /**
     * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions. For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guid* e.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-accesspolicies
     */
    readonly accessPolicies?: any | cdk.IResolvable;

    /**
     * Additional options to specify for the OpenSearch Service domain. For more information, see [Advanced cluster parameters](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html#createdomain-configure-advanced-options) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedoptions
     */
    readonly advancedOptions?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * Specifies options for fine-grained access control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedsecurityoptions
     */
    readonly advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

    /**
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-cognitooptions
     */
    readonly cognitoOptions?: CfnDomain.CognitoOptionsProperty | cdk.IResolvable;

    /**
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainendpointoptions
     */
    readonly domainEndpointOptions?: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable;

    /**
     * A name for the OpenSearch Service domain. For valid values, see the [DomainName](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname) data type in the *Amazon OpenSearch Service Developer Guide* . If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainname
     */
    readonly domainName?: string;

    /**
     * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-ebsoptions
     */
    readonly ebsOptions?: CfnDomain.EBSOptionsProperty | cdk.IResolvable;

    /**
     * ElasticsearchClusterConfig is a property of the AWS::Elasticsearch::Domain resource that configures the cluster of an Amazon OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchclusterconfig
     */
    readonly elasticsearchClusterConfig?: CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable;

    /**
     * The version of Elasticsearch to use, such as 2.3. If not specified, 1.5 is used as the default. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `ElasticsearchVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `ElasticsearchVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchversion
     */
    readonly elasticsearchVersion?: string;

    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use. See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-encryptionatrestoptions
     */
    readonly encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

    /**
     * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish. Each key needs a valid `LogPublishingOption` value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-logpublishingoptions
     */
    readonly logPublishingOptions?: { [key: string]: (CfnDomain.LogPublishingOptionProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Specifies whether node-to-node encryption is enabled. See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-nodetonodeencryptionoptions
     */
    readonly nodeToNodeEncryptionOptions?: CfnDomain.NodeToNodeEncryptionOptionsProperty | cdk.IResolvable;

    /**
     * *DEPRECATED* . The automated snapshot configuration for the OpenSearch Service domain indices.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-snapshotoptions
     */
    readonly snapshotOptions?: CfnDomain.SnapshotOptionsProperty | cdk.IResolvable;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The virtual private cloud (VPC) configuration for the OpenSearch Service domain. For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-vpcoptions
     */
    readonly vpcOptions?: CfnDomain.VPCOptionsProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('accessPolicies', cdk.validateObject)(properties.accessPolicies));
    errors.collect(cdk.propertyValidator('advancedOptions', cdk.hashValidator(cdk.validateString))(properties.advancedOptions));
    errors.collect(cdk.propertyValidator('advancedSecurityOptions', CfnDomain_AdvancedSecurityOptionsInputPropertyValidator)(properties.advancedSecurityOptions));
    errors.collect(cdk.propertyValidator('cognitoOptions', CfnDomain_CognitoOptionsPropertyValidator)(properties.cognitoOptions));
    errors.collect(cdk.propertyValidator('domainEndpointOptions', CfnDomain_DomainEndpointOptionsPropertyValidator)(properties.domainEndpointOptions));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('ebsOptions', CfnDomain_EBSOptionsPropertyValidator)(properties.ebsOptions));
    errors.collect(cdk.propertyValidator('elasticsearchClusterConfig', CfnDomain_ElasticsearchClusterConfigPropertyValidator)(properties.elasticsearchClusterConfig));
    errors.collect(cdk.propertyValidator('elasticsearchVersion', cdk.validateString)(properties.elasticsearchVersion));
    errors.collect(cdk.propertyValidator('encryptionAtRestOptions', CfnDomain_EncryptionAtRestOptionsPropertyValidator)(properties.encryptionAtRestOptions));
    errors.collect(cdk.propertyValidator('logPublishingOptions', cdk.hashValidator(CfnDomain_LogPublishingOptionPropertyValidator))(properties.logPublishingOptions));
    errors.collect(cdk.propertyValidator('nodeToNodeEncryptionOptions', CfnDomain_NodeToNodeEncryptionOptionsPropertyValidator)(properties.nodeToNodeEncryptionOptions));
    errors.collect(cdk.propertyValidator('snapshotOptions', CfnDomain_SnapshotOptionsPropertyValidator)(properties.snapshotOptions));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcOptions', CfnDomain_VPCOptionsPropertyValidator)(properties.vpcOptions));
    return errors.wrap('supplied properties not correct for "CfnDomainProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain` resource.
 */
// @ts-ignore TS6133
function cfnDomainPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainPropsValidator(properties).assertSuccess();
    return {
        AccessPolicies: cdk.objectToCloudFormation(properties.accessPolicies),
        AdvancedOptions: cdk.hashMapper(cdk.stringToCloudFormation)(properties.advancedOptions),
        AdvancedSecurityOptions: cfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties.advancedSecurityOptions),
        CognitoOptions: cfnDomainCognitoOptionsPropertyToCloudFormation(properties.cognitoOptions),
        DomainEndpointOptions: cfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties.domainEndpointOptions),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        EBSOptions: cfnDomainEBSOptionsPropertyToCloudFormation(properties.ebsOptions),
        ElasticsearchClusterConfig: cfnDomainElasticsearchClusterConfigPropertyToCloudFormation(properties.elasticsearchClusterConfig),
        ElasticsearchVersion: cdk.stringToCloudFormation(properties.elasticsearchVersion),
        EncryptionAtRestOptions: cfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties.encryptionAtRestOptions),
        LogPublishingOptions: cdk.hashMapper(cfnDomainLogPublishingOptionPropertyToCloudFormation)(properties.logPublishingOptions),
        NodeToNodeEncryptionOptions: cfnDomainNodeToNodeEncryptionOptionsPropertyToCloudFormation(properties.nodeToNodeEncryptionOptions),
        SnapshotOptions: cfnDomainSnapshotOptionsPropertyToCloudFormation(properties.snapshotOptions),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VPCOptions: cfnDomainVPCOptionsPropertyToCloudFormation(properties.vpcOptions),
    };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
    ret.addPropertyResult('accessPolicies', 'AccessPolicies', properties.AccessPolicies != null ? cfn_parse.FromCloudFormation.getAny(properties.AccessPolicies) : undefined);
    ret.addPropertyResult('advancedOptions', 'AdvancedOptions', properties.AdvancedOptions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdvancedOptions) : undefined);
    ret.addPropertyResult('advancedSecurityOptions', 'AdvancedSecurityOptions', properties.AdvancedSecurityOptions != null ? CfnDomainAdvancedSecurityOptionsInputPropertyFromCloudFormation(properties.AdvancedSecurityOptions) : undefined);
    ret.addPropertyResult('cognitoOptions', 'CognitoOptions', properties.CognitoOptions != null ? CfnDomainCognitoOptionsPropertyFromCloudFormation(properties.CognitoOptions) : undefined);
    ret.addPropertyResult('domainEndpointOptions', 'DomainEndpointOptions', properties.DomainEndpointOptions != null ? CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties.DomainEndpointOptions) : undefined);
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('ebsOptions', 'EBSOptions', properties.EBSOptions != null ? CfnDomainEBSOptionsPropertyFromCloudFormation(properties.EBSOptions) : undefined);
    ret.addPropertyResult('elasticsearchClusterConfig', 'ElasticsearchClusterConfig', properties.ElasticsearchClusterConfig != null ? CfnDomainElasticsearchClusterConfigPropertyFromCloudFormation(properties.ElasticsearchClusterConfig) : undefined);
    ret.addPropertyResult('elasticsearchVersion', 'ElasticsearchVersion', properties.ElasticsearchVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ElasticsearchVersion) : undefined);
    ret.addPropertyResult('encryptionAtRestOptions', 'EncryptionAtRestOptions', properties.EncryptionAtRestOptions != null ? CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties.EncryptionAtRestOptions) : undefined);
    ret.addPropertyResult('logPublishingOptions', 'LogPublishingOptions', properties.LogPublishingOptions != null ? cfn_parse.FromCloudFormation.getMap(CfnDomainLogPublishingOptionPropertyFromCloudFormation)(properties.LogPublishingOptions) : undefined);
    ret.addPropertyResult('nodeToNodeEncryptionOptions', 'NodeToNodeEncryptionOptions', properties.NodeToNodeEncryptionOptions != null ? CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties.NodeToNodeEncryptionOptions) : undefined);
    ret.addPropertyResult('snapshotOptions', 'SnapshotOptions', properties.SnapshotOptions != null ? CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties.SnapshotOptions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpcOptions', 'VPCOptions', properties.VPCOptions != null ? CfnDomainVPCOptionsPropertyFromCloudFormation(properties.VPCOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Elasticsearch::Domain`
 *
 * The AWS::Elasticsearch::Domain resource creates an Amazon OpenSearch Service domain.
 *
 * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and legacy Elasticsearch. For instructions to upgrade domains defined within CloudFormation from Elasticsearch to OpenSearch, see [Remarks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--remarks) .
 *
 * @cloudformationResource AWS::Elasticsearch::Domain
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Elasticsearch::Domain";

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
     * The Amazon Resource Name (ARN) of the domain, such as `arn:aws:es:us-west-2:123456789012:domain/mystack-elasti-1ab2cdefghij` . This returned value is the same as the one returned by `AWS::Elasticsearch::Domain.DomainArn` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The domain-specific endpoint that's used for requests to the OpenSearch APIs, such as `search-mystack-elasti-1ab2cdefghij-ab1c2deckoyb3hofw7wpqa3cm.us-west-1.es.amazonaws.com` .
     * @cloudformationAttribute DomainEndpoint
     */
    public readonly attrDomainEndpoint: string;

    /**
     * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions. For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guid* e.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-accesspolicies
     */
    public accessPolicies: any | cdk.IResolvable | undefined;

    /**
     * Additional options to specify for the OpenSearch Service domain. For more information, see [Advanced cluster parameters](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html#createdomain-configure-advanced-options) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedoptions
     */
    public advancedOptions: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Specifies options for fine-grained access control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedsecurityoptions
     */
    public advancedSecurityOptions: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable | undefined;

    /**
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-cognitooptions
     */
    public cognitoOptions: CfnDomain.CognitoOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainendpointoptions
     */
    public domainEndpointOptions: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable | undefined;

    /**
     * A name for the OpenSearch Service domain. For valid values, see the [DomainName](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname) data type in the *Amazon OpenSearch Service Developer Guide* . If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainname
     */
    public domainName: string | undefined;

    /**
     * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-ebsoptions
     */
    public ebsOptions: CfnDomain.EBSOptionsProperty | cdk.IResolvable | undefined;

    /**
     * ElasticsearchClusterConfig is a property of the AWS::Elasticsearch::Domain resource that configures the cluster of an Amazon OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchclusterconfig
     */
    public elasticsearchClusterConfig: CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable | undefined;

    /**
     * The version of Elasticsearch to use, such as 2.3. If not specified, 1.5 is used as the default. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `ElasticsearchVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `ElasticsearchVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchversion
     */
    public elasticsearchVersion: string | undefined;

    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use. See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-encryptionatrestoptions
     */
    public encryptionAtRestOptions: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish. Each key needs a valid `LogPublishingOption` value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-logpublishingoptions
     */
    public logPublishingOptions: { [key: string]: (CfnDomain.LogPublishingOptionProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * Specifies whether node-to-node encryption is enabled. See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-nodetonodeencryptionoptions
     */
    public nodeToNodeEncryptionOptions: CfnDomain.NodeToNodeEncryptionOptionsProperty | cdk.IResolvable | undefined;

    /**
     * *DEPRECATED* . The automated snapshot configuration for the OpenSearch Service domain indices.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-snapshotoptions
     */
    public snapshotOptions: CfnDomain.SnapshotOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The virtual private cloud (VPC) configuration for the OpenSearch Service domain. For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-vpcoptions
     */
    public vpcOptions: CfnDomain.VPCOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Elasticsearch::Domain`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainProps = {}) {
        super(scope, id, { type: CfnDomain.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDomainEndpoint = cdk.Token.asString(this.getAtt('DomainEndpoint', cdk.ResolutionTypeHint.STRING));

        this.accessPolicies = props.accessPolicies;
        this.advancedOptions = props.advancedOptions;
        this.advancedSecurityOptions = props.advancedSecurityOptions;
        this.cognitoOptions = props.cognitoOptions;
        this.domainEndpointOptions = props.domainEndpointOptions;
        this.domainName = props.domainName;
        this.ebsOptions = props.ebsOptions;
        this.elasticsearchClusterConfig = props.elasticsearchClusterConfig;
        this.elasticsearchVersion = props.elasticsearchVersion;
        this.encryptionAtRestOptions = props.encryptionAtRestOptions;
        this.logPublishingOptions = props.logPublishingOptions;
        this.nodeToNodeEncryptionOptions = props.nodeToNodeEncryptionOptions;
        this.snapshotOptions = props.snapshotOptions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Elasticsearch::Domain", props.tags, { tagPropertyName: 'tags' });
        this.vpcOptions = props.vpcOptions;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::Elasticsearch::Domain\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accessPolicies: this.accessPolicies,
            advancedOptions: this.advancedOptions,
            advancedSecurityOptions: this.advancedSecurityOptions,
            cognitoOptions: this.cognitoOptions,
            domainEndpointOptions: this.domainEndpointOptions,
            domainName: this.domainName,
            ebsOptions: this.ebsOptions,
            elasticsearchClusterConfig: this.elasticsearchClusterConfig,
            elasticsearchVersion: this.elasticsearchVersion,
            encryptionAtRestOptions: this.encryptionAtRestOptions,
            logPublishingOptions: this.logPublishingOptions,
            nodeToNodeEncryptionOptions: this.nodeToNodeEncryptionOptions,
            snapshotOptions: this.snapshotOptions,
            tags: this.tags.renderTags(),
            vpcOptions: this.vpcOptions,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDomainPropsToCloudFormation(props);
    }
}

export namespace CfnDomain {
    /**
     * Specifies options for fine-grained access control.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html
     */
    export interface AdvancedSecurityOptionsInputProperty {
        /**
         * `CfnDomain.AdvancedSecurityOptionsInputProperty.AnonymousAuthEnabled`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-anonymousauthenabled
         */
        readonly anonymousAuthEnabled?: boolean | cdk.IResolvable;
        /**
         * True to enable fine-grained access control. You must also enable encryption of data at rest and node-to-node encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * True to enable the internal user database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-internaluserdatabaseenabled
         */
        readonly internalUserDatabaseEnabled?: boolean | cdk.IResolvable;
        /**
         * Specifies information about the master user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-masteruseroptions
         */
        readonly masterUserOptions?: CfnDomain.MasterUserOptionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AdvancedSecurityOptionsInputProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedSecurityOptionsInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_AdvancedSecurityOptionsInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('anonymousAuthEnabled', cdk.validateBoolean)(properties.anonymousAuthEnabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('internalUserDatabaseEnabled', cdk.validateBoolean)(properties.internalUserDatabaseEnabled));
    errors.collect(cdk.propertyValidator('masterUserOptions', CfnDomain_MasterUserOptionsPropertyValidator)(properties.masterUserOptions));
    return errors.wrap('supplied properties not correct for "AdvancedSecurityOptionsInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.AdvancedSecurityOptionsInput` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedSecurityOptionsInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.AdvancedSecurityOptionsInput` resource.
 */
// @ts-ignore TS6133
function cfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_AdvancedSecurityOptionsInputPropertyValidator(properties).assertSuccess();
    return {
        AnonymousAuthEnabled: cdk.booleanToCloudFormation(properties.anonymousAuthEnabled),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        InternalUserDatabaseEnabled: cdk.booleanToCloudFormation(properties.internalUserDatabaseEnabled),
        MasterUserOptions: cfnDomainMasterUserOptionsPropertyToCloudFormation(properties.masterUserOptions),
    };
}

// @ts-ignore TS6133
function CfnDomainAdvancedSecurityOptionsInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.AdvancedSecurityOptionsInputProperty>();
    ret.addPropertyResult('anonymousAuthEnabled', 'AnonymousAuthEnabled', properties.AnonymousAuthEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AnonymousAuthEnabled) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('internalUserDatabaseEnabled', 'InternalUserDatabaseEnabled', properties.InternalUserDatabaseEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InternalUserDatabaseEnabled) : undefined);
    ret.addPropertyResult('masterUserOptions', 'MasterUserOptions', properties.MasterUserOptions != null ? CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties.MasterUserOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html
     */
    export interface CognitoOptionsProperty {
        /**
         * Whether to enable or disable Amazon Cognito authentication for OpenSearch Dashboards. See [Amazon Cognito authentication for OpenSearch Dashboards](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The Amazon Cognito identity pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication. Required if you enable Cognito authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-identitypoolid
         */
        readonly identityPoolId?: string;
        /**
         * The `AmazonESCognitoAccess` role that allows OpenSearch Service to configure your user pool and identity pool. Required if you enable Cognito authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-rolearn
         */
        readonly roleArn?: string;
        /**
         * The Amazon Cognito user pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication. Required if you enable Cognito authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-userpoolid
         */
        readonly userPoolId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CognitoOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_CognitoOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('identityPoolId', cdk.validateString)(properties.identityPoolId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('userPoolId', cdk.validateString)(properties.userPoolId));
    return errors.wrap('supplied properties not correct for "CognitoOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.CognitoOptions` resource
 *
 * @param properties - the TypeScript properties of a `CognitoOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.CognitoOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainCognitoOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_CognitoOptionsPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        IdentityPoolId: cdk.stringToCloudFormation(properties.identityPoolId),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        UserPoolId: cdk.stringToCloudFormation(properties.userPoolId),
    };
}

// @ts-ignore TS6133
function CfnDomainCognitoOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.CognitoOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.CognitoOptionsProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('identityPoolId', 'IdentityPoolId', properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('userPoolId', 'UserPoolId', properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Specifies options for cold storage. For more information, see [Cold storage for Amazon Elasticsearch Service](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/cold-storage.html) .
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-coldstorageoptions.html
     */
    export interface ColdStorageOptionsProperty {
        /**
         * Whether to enable or disable cold storage on the domain. You must enable UltraWarm storage in order to enable cold storage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-coldstorageoptions.html#cfn-elasticsearch-domain-coldstorageoptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ColdStorageOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ColdStorageOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_ColdStorageOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "ColdStorageOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ColdStorageOptions` resource
 *
 * @param properties - the TypeScript properties of a `ColdStorageOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ColdStorageOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainColdStorageOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_ColdStorageOptionsPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnDomainColdStorageOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ColdStorageOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ColdStorageOptionsProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html
     */
    export interface DomainEndpointOptionsProperty {
        /**
         * The fully qualified URL for your custom endpoint. Required if you enabled a custom endpoint for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpoint
         */
        readonly customEndpoint?: string;
        /**
         * The AWS Certificate Manager ARN for your domain's SSL/TLS certificate. Required if you enabled a custom endpoint for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpointcertificatearn
         */
        readonly customEndpointCertificateArn?: string;
        /**
         * True to enable a custom endpoint for the domain. If enabled, you must also provide values for `CustomEndpoint` and `CustomEndpointCertificateArn` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpointenabled
         */
        readonly customEndpointEnabled?: boolean | cdk.IResolvable;
        /**
         * True to require that all traffic to the domain arrive over HTTPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-enforcehttps
         */
        readonly enforceHttps?: boolean | cdk.IResolvable;
        /**
         * The minimum TLS version required for traffic to the domain. Valid values are TLS 1.0 (default) or 1.2:
         *
         * - `Policy-Min-TLS-1-0-2019-07`
         * - `Policy-Min-TLS-1-2-2019-07`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-tlssecuritypolicy
         */
        readonly tlsSecurityPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DomainEndpointOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DomainEndpointOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_DomainEndpointOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customEndpoint', cdk.validateString)(properties.customEndpoint));
    errors.collect(cdk.propertyValidator('customEndpointCertificateArn', cdk.validateString)(properties.customEndpointCertificateArn));
    errors.collect(cdk.propertyValidator('customEndpointEnabled', cdk.validateBoolean)(properties.customEndpointEnabled));
    errors.collect(cdk.propertyValidator('enforceHttps', cdk.validateBoolean)(properties.enforceHttps));
    errors.collect(cdk.propertyValidator('tlsSecurityPolicy', cdk.validateString)(properties.tlsSecurityPolicy));
    return errors.wrap('supplied properties not correct for "DomainEndpointOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.DomainEndpointOptions` resource
 *
 * @param properties - the TypeScript properties of a `DomainEndpointOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.DomainEndpointOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_DomainEndpointOptionsPropertyValidator(properties).assertSuccess();
    return {
        CustomEndpoint: cdk.stringToCloudFormation(properties.customEndpoint),
        CustomEndpointCertificateArn: cdk.stringToCloudFormation(properties.customEndpointCertificateArn),
        CustomEndpointEnabled: cdk.booleanToCloudFormation(properties.customEndpointEnabled),
        EnforceHTTPS: cdk.booleanToCloudFormation(properties.enforceHttps),
        TLSSecurityPolicy: cdk.stringToCloudFormation(properties.tlsSecurityPolicy),
    };
}

// @ts-ignore TS6133
function CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.DomainEndpointOptionsProperty>();
    ret.addPropertyResult('customEndpoint', 'CustomEndpoint', properties.CustomEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEndpoint) : undefined);
    ret.addPropertyResult('customEndpointCertificateArn', 'CustomEndpointCertificateArn', properties.CustomEndpointCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEndpointCertificateArn) : undefined);
    ret.addPropertyResult('customEndpointEnabled', 'CustomEndpointEnabled', properties.CustomEndpointEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CustomEndpointEnabled) : undefined);
    ret.addPropertyResult('enforceHttps', 'EnforceHTTPS', properties.EnforceHTTPS != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceHTTPS) : undefined);
    ret.addPropertyResult('tlsSecurityPolicy', 'TLSSecurityPolicy', properties.TLSSecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.TLSSecurityPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html
     */
    export interface EBSOptionsProperty {
        /**
         * Specifies whether Amazon EBS volumes are attached to data nodes in the OpenSearch Service domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-ebsenabled
         */
        readonly ebsEnabled?: boolean | cdk.IResolvable;
        /**
         * The number of I/O operations per second (IOPS) that the volume supports. This property applies only to provisioned IOPS EBS volume types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-iops
         */
        readonly iops?: number;
        /**
         * The size (in GiB) of the EBS volume for each data node. The minimum and maximum size of an EBS volume depends on the EBS volume type and the instance type to which it is attached. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-volumesize
         */
        readonly volumeSize?: number;
        /**
         * The EBS volume type to use with the OpenSearch Service domain, such as standard, gp2, or io1. For more information about each type, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-volumetype
         */
        readonly volumeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EBSOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EBSOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_EBSOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ebsEnabled', cdk.validateBoolean)(properties.ebsEnabled));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('volumeSize', cdk.validateNumber)(properties.volumeSize));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "EBSOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.EBSOptions` resource
 *
 * @param properties - the TypeScript properties of a `EBSOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.EBSOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainEBSOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_EBSOptionsPropertyValidator(properties).assertSuccess();
    return {
        EBSEnabled: cdk.booleanToCloudFormation(properties.ebsEnabled),
        Iops: cdk.numberToCloudFormation(properties.iops),
        VolumeSize: cdk.numberToCloudFormation(properties.volumeSize),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnDomainEBSOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.EBSOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.EBSOptionsProperty>();
    ret.addPropertyResult('ebsEnabled', 'EBSEnabled', properties.EBSEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EBSEnabled) : undefined);
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('volumeSize', 'VolumeSize', properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * The cluster configuration for the OpenSearch Service domain. You can specify options such as the instance type and the number of instances. For more information, see [Creating and managing Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html
     */
    export interface ElasticsearchClusterConfigProperty {
        /**
         * Specifies cold storage options for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-coldstorageoptions
         */
        readonly coldStorageOptions?: CfnDomain.ColdStorageOptionsProperty | cdk.IResolvable;
        /**
         * The number of instances to use for the master node. If you specify this property, you must specify true for the DedicatedMasterEnabled property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastercount
         */
        readonly dedicatedMasterCount?: number;
        /**
         * Indicates whether to use a dedicated master node for the OpenSearch Service domain. A dedicated master node is a cluster node that performs cluster management tasks, but doesn't hold data or respond to data upload requests. Dedicated master nodes offload cluster management tasks to increase the stability of your search clusters. See [Dedicated master nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmasterenabled
         */
        readonly dedicatedMasterEnabled?: boolean | cdk.IResolvable;
        /**
         * The hardware configuration of the computer that hosts the dedicated master node, such as `m3.medium.elasticsearch` . If you specify this property, you must specify true for the `DedicatedMasterEnabled` property. For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastertype
         */
        readonly dedicatedMasterType?: string;
        /**
         * The number of data nodes (instances) to use in the OpenSearch Service domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instancecount
         */
        readonly instanceCount?: number;
        /**
         * The instance type for your data nodes, such as `m3.medium.elasticsearch` . For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instnacetype
         */
        readonly instanceType?: string;
        /**
         * The number of warm nodes in the cluster. Required if you enable warm storage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmcount
         */
        readonly warmCount?: number;
        /**
         * Whether to enable warm storage for the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmenabled
         */
        readonly warmEnabled?: boolean | cdk.IResolvable;
        /**
         * The instance type for the cluster's warm nodes. Required if you enable warm storage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmtype
         */
        readonly warmType?: string;
        /**
         * Specifies zone awareness configuration options. Only use if `ZoneAwarenessEnabled` is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-zoneawarenessconfig
         */
        readonly zoneAwarenessConfig?: CfnDomain.ZoneAwarenessConfigProperty | cdk.IResolvable;
        /**
         * Indicates whether to enable zone awareness for the OpenSearch Service domain. When you enable zone awareness, OpenSearch Service allocates the nodes and replica index shards that belong to a cluster across two Availability Zones (AZs) in the same region to prevent data loss and minimize downtime in the event of node or data center failure. Don't enable zone awareness if your cluster has no replica index shards or is a single-node cluster. For more information, see [Configuring a multi-AZ domain in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-zoneawarenessenabled
         */
        readonly zoneAwarenessEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ElasticsearchClusterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchClusterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_ElasticsearchClusterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coldStorageOptions', CfnDomain_ColdStorageOptionsPropertyValidator)(properties.coldStorageOptions));
    errors.collect(cdk.propertyValidator('dedicatedMasterCount', cdk.validateNumber)(properties.dedicatedMasterCount));
    errors.collect(cdk.propertyValidator('dedicatedMasterEnabled', cdk.validateBoolean)(properties.dedicatedMasterEnabled));
    errors.collect(cdk.propertyValidator('dedicatedMasterType', cdk.validateString)(properties.dedicatedMasterType));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.validateNumber)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('warmCount', cdk.validateNumber)(properties.warmCount));
    errors.collect(cdk.propertyValidator('warmEnabled', cdk.validateBoolean)(properties.warmEnabled));
    errors.collect(cdk.propertyValidator('warmType', cdk.validateString)(properties.warmType));
    errors.collect(cdk.propertyValidator('zoneAwarenessConfig', CfnDomain_ZoneAwarenessConfigPropertyValidator)(properties.zoneAwarenessConfig));
    errors.collect(cdk.propertyValidator('zoneAwarenessEnabled', cdk.validateBoolean)(properties.zoneAwarenessEnabled));
    return errors.wrap('supplied properties not correct for "ElasticsearchClusterConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ElasticsearchClusterConfig` resource
 *
 * @param properties - the TypeScript properties of a `ElasticsearchClusterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ElasticsearchClusterConfig` resource.
 */
// @ts-ignore TS6133
function cfnDomainElasticsearchClusterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_ElasticsearchClusterConfigPropertyValidator(properties).assertSuccess();
    return {
        ColdStorageOptions: cfnDomainColdStorageOptionsPropertyToCloudFormation(properties.coldStorageOptions),
        DedicatedMasterCount: cdk.numberToCloudFormation(properties.dedicatedMasterCount),
        DedicatedMasterEnabled: cdk.booleanToCloudFormation(properties.dedicatedMasterEnabled),
        DedicatedMasterType: cdk.stringToCloudFormation(properties.dedicatedMasterType),
        InstanceCount: cdk.numberToCloudFormation(properties.instanceCount),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        WarmCount: cdk.numberToCloudFormation(properties.warmCount),
        WarmEnabled: cdk.booleanToCloudFormation(properties.warmEnabled),
        WarmType: cdk.stringToCloudFormation(properties.warmType),
        ZoneAwarenessConfig: cfnDomainZoneAwarenessConfigPropertyToCloudFormation(properties.zoneAwarenessConfig),
        ZoneAwarenessEnabled: cdk.booleanToCloudFormation(properties.zoneAwarenessEnabled),
    };
}

// @ts-ignore TS6133
function CfnDomainElasticsearchClusterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ElasticsearchClusterConfigProperty>();
    ret.addPropertyResult('coldStorageOptions', 'ColdStorageOptions', properties.ColdStorageOptions != null ? CfnDomainColdStorageOptionsPropertyFromCloudFormation(properties.ColdStorageOptions) : undefined);
    ret.addPropertyResult('dedicatedMasterCount', 'DedicatedMasterCount', properties.DedicatedMasterCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.DedicatedMasterCount) : undefined);
    ret.addPropertyResult('dedicatedMasterEnabled', 'DedicatedMasterEnabled', properties.DedicatedMasterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DedicatedMasterEnabled) : undefined);
    ret.addPropertyResult('dedicatedMasterType', 'DedicatedMasterType', properties.DedicatedMasterType != null ? cfn_parse.FromCloudFormation.getString(properties.DedicatedMasterType) : undefined);
    ret.addPropertyResult('instanceCount', 'InstanceCount', properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined);
    ret.addPropertyResult('instanceType', 'InstanceType', properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined);
    ret.addPropertyResult('warmCount', 'WarmCount', properties.WarmCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.WarmCount) : undefined);
    ret.addPropertyResult('warmEnabled', 'WarmEnabled', properties.WarmEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WarmEnabled) : undefined);
    ret.addPropertyResult('warmType', 'WarmType', properties.WarmType != null ? cfn_parse.FromCloudFormation.getString(properties.WarmType) : undefined);
    ret.addPropertyResult('zoneAwarenessConfig', 'ZoneAwarenessConfig', properties.ZoneAwarenessConfig != null ? CfnDomainZoneAwarenessConfigPropertyFromCloudFormation(properties.ZoneAwarenessConfig) : undefined);
    ret.addPropertyResult('zoneAwarenessEnabled', 'ZoneAwarenessEnabled', properties.ZoneAwarenessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ZoneAwarenessEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html
     */
    export interface EncryptionAtRestOptionsProperty {
        /**
         * Specify `true` to enable encryption at rest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html#cfn-elasticsearch-domain-encryptionatrestoptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The KMS key ID. Takes the form `1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a` . Required if you enable encryption at rest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html#cfn-elasticsearch-domain-encryptionatrestoptions-kmskeyid
         */
        readonly kmsKeyId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionAtRestOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_EncryptionAtRestOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    return errors.wrap('supplied properties not correct for "EncryptionAtRestOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.EncryptionAtRestOptions` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.EncryptionAtRestOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_EncryptionAtRestOptionsPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.EncryptionAtRestOptionsProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * Specifies whether the OpenSearch Service domain publishes the Elasticsearch application, search slow logs, or index slow logs to Amazon CloudWatch. Each option must be an object of name `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , or `AUDIT_LOGS` depending on the type of logs you want to publish.
     *
     * If you enable a slow log, you still have to enable the *collection* of slow logs using the Configuration API. To learn more, see [Enabling log publishing ( AWS CLI)](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createdomain-configure-slow-logs.html#createdomain-configure-slow-logs-cli) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html
     */
    export interface LogPublishingOptionProperty {
        /**
         * Specifies the CloudWatch log group to publish to. Required if you enable log publishing for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html#cfn-elasticsearch-domain-logpublishingoption-cloudwatchlogsloggrouparn
         */
        readonly cloudWatchLogsLogGroupArn?: string;
        /**
         * If `true` , enables the publishing of logs to CloudWatch.
         *
         * Default: `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html#cfn-elasticsearch-domain-logpublishingoption-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LogPublishingOptionProperty`
 *
 * @param properties - the TypeScript properties of a `LogPublishingOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_LogPublishingOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsLogGroupArn', cdk.validateString)(properties.cloudWatchLogsLogGroupArn));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "LogPublishingOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.LogPublishingOption` resource
 *
 * @param properties - the TypeScript properties of a `LogPublishingOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.LogPublishingOption` resource.
 */
// @ts-ignore TS6133
function cfnDomainLogPublishingOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_LogPublishingOptionPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsLogGroupArn: cdk.stringToCloudFormation(properties.cloudWatchLogsLogGroupArn),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnDomainLogPublishingOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.LogPublishingOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.LogPublishingOptionProperty>();
    ret.addPropertyResult('cloudWatchLogsLogGroupArn', 'CloudWatchLogsLogGroupArn', properties.CloudWatchLogsLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogsLogGroupArn) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Specifies information about the master user. Required if you enabled the internal user database.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html
     */
    export interface MasterUserOptionsProperty {
        /**
         * ARN for the master user. Only specify if `InternalUserDatabaseEnabled` is false in `AdvancedSecurityOptions` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masteruserarn
         */
        readonly masterUserArn?: string;
        /**
         * Username for the master user. Only specify if `InternalUserDatabaseEnabled` is true in `AdvancedSecurityOptions` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masterusername
         */
        readonly masterUserName?: string;
        /**
         * Password for the master user. Only specify if `InternalUserDatabaseEnabled` is true in `AdvancedSecurityOptions` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masteruserpassword
         */
        readonly masterUserPassword?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MasterUserOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MasterUserOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_MasterUserOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('masterUserArn', cdk.validateString)(properties.masterUserArn));
    errors.collect(cdk.propertyValidator('masterUserName', cdk.validateString)(properties.masterUserName));
    errors.collect(cdk.propertyValidator('masterUserPassword', cdk.validateString)(properties.masterUserPassword));
    return errors.wrap('supplied properties not correct for "MasterUserOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.MasterUserOptions` resource
 *
 * @param properties - the TypeScript properties of a `MasterUserOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.MasterUserOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainMasterUserOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_MasterUserOptionsPropertyValidator(properties).assertSuccess();
    return {
        MasterUserARN: cdk.stringToCloudFormation(properties.masterUserArn),
        MasterUserName: cdk.stringToCloudFormation(properties.masterUserName),
        MasterUserPassword: cdk.stringToCloudFormation(properties.masterUserPassword),
    };
}

// @ts-ignore TS6133
function CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.MasterUserOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.MasterUserOptionsProperty>();
    ret.addPropertyResult('masterUserArn', 'MasterUserARN', properties.MasterUserARN != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserARN) : undefined);
    ret.addPropertyResult('masterUserName', 'MasterUserName', properties.MasterUserName != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserName) : undefined);
    ret.addPropertyResult('masterUserPassword', 'MasterUserPassword', properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Specifies whether node-to-node encryption is enabled.
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-nodetonodeencryptionoptions.html
     */
    export interface NodeToNodeEncryptionOptionsProperty {
        /**
         * Specifies whether node-to-node encryption is enabled, as a Boolean.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-nodetonodeencryptionoptions.html#cfn-elasticsearch-domain-nodetonodeencryptionoptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_NodeToNodeEncryptionOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "NodeToNodeEncryptionOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.NodeToNodeEncryptionOptions` resource
 *
 * @param properties - the TypeScript properties of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.NodeToNodeEncryptionOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainNodeToNodeEncryptionOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_NodeToNodeEncryptionOptionsPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.NodeToNodeEncryptionOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.NodeToNodeEncryptionOptionsProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * *DEPRECATED* . For domains running Elasticsearch 5.3 and later, OpenSearch Service takes hourly automated snapshots, making this setting irrelevant. For domains running earlier versions of Elasticsearch, OpenSearch Service takes daily automated snapshots.
     *
     * The automated snapshot configuration for the OpenSearch Service domain indices.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html
     */
    export interface SnapshotOptionsProperty {
        /**
         * The hour in UTC during which the service takes an automated daily snapshot of the indices in the OpenSearch Service domain. For example, if you specify 0, OpenSearch Service takes an automated snapshot everyday between midnight and 1 am. You can specify a value between 0 and 23.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html#cfn-elasticsearch-domain-snapshotoptions-automatedsnapshotstarthour
         */
        readonly automatedSnapshotStartHour?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SnapshotOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SnapshotOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_SnapshotOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automatedSnapshotStartHour', cdk.validateNumber)(properties.automatedSnapshotStartHour));
    return errors.wrap('supplied properties not correct for "SnapshotOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.SnapshotOptions` resource
 *
 * @param properties - the TypeScript properties of a `SnapshotOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.SnapshotOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainSnapshotOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_SnapshotOptionsPropertyValidator(properties).assertSuccess();
    return {
        AutomatedSnapshotStartHour: cdk.numberToCloudFormation(properties.automatedSnapshotStartHour),
    };
}

// @ts-ignore TS6133
function CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.SnapshotOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.SnapshotOptionsProperty>();
    ret.addPropertyResult('automatedSnapshotStartHour', 'AutomatedSnapshotStartHour', properties.AutomatedSnapshotStartHour != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomatedSnapshotStartHour) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * The virtual private cloud (VPC) configuration for the OpenSearch Service domain. For more information, see [Launching your Amazon OpenSearch Service domains using a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html
     */
    export interface VPCOptionsProperty {
        /**
         * The list of security group IDs that are associated with the VPC endpoints for the domain. If you don't provide a security group ID, OpenSearch Service uses the default security group for the VPC. To learn more, see [Security groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon VPC User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html#cfn-elasticsearch-domain-vpcoptions-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * Provide one subnet ID for each Availability Zone that your domain uses. For example, you must specify three subnet IDs for a three Availability Zone domain. To learn more, see [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon VPC User Guide* .
         *
         * Required if you're creating your domain inside a VPC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html#cfn-elasticsearch-domain-vpcoptions-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VPCOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VPCOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_VPCOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VPCOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.VPCOptions` resource
 *
 * @param properties - the TypeScript properties of a `VPCOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.VPCOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainVPCOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_VPCOptionsPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnDomainVPCOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.VPCOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.VPCOptionsProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Specifies zone awareness configuration options. Only use if `ZoneAwarenessEnabled` is `true` .
     *
     * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-zoneawarenessconfig.html
     */
    export interface ZoneAwarenessConfigProperty {
        /**
         * If you enabled multiple Availability Zones (AZs), the number of AZs that you want the domain to use.
         *
         * Valid values are `2` and `3` . Default is 2.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-zoneawarenessconfig.html#cfn-elasticsearch-domain-zoneawarenessconfig-availabilityzonecount
         */
        readonly availabilityZoneCount?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ZoneAwarenessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ZoneAwarenessConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_ZoneAwarenessConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZoneCount', cdk.validateNumber)(properties.availabilityZoneCount));
    return errors.wrap('supplied properties not correct for "ZoneAwarenessConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ZoneAwarenessConfig` resource
 *
 * @param properties - the TypeScript properties of a `ZoneAwarenessConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Elasticsearch::Domain.ZoneAwarenessConfig` resource.
 */
// @ts-ignore TS6133
function cfnDomainZoneAwarenessConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_ZoneAwarenessConfigPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZoneCount: cdk.numberToCloudFormation(properties.availabilityZoneCount),
    };
}

// @ts-ignore TS6133
function CfnDomainZoneAwarenessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ZoneAwarenessConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ZoneAwarenessConfigProperty>();
    ret.addPropertyResult('availabilityZoneCount', 'AvailabilityZoneCount', properties.AvailabilityZoneCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.AvailabilityZoneCount) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
