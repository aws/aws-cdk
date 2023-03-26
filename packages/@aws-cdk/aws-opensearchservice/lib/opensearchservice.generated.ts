// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:40:00.209Z","fingerprint":"oJhKqhCkhTKwiK0JLSM87CYfIaYDS1ZAyL53+IQC6S4="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html
 */
export interface CfnDomainProps {

    /**
     * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions. For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-accesspolicies
     */
    readonly accessPolicies?: any | cdk.IResolvable;

    /**
     * Additional options to specify for the OpenSearch Service domain. For more information, see [AdvancedOptions](https://docs.aws.amazon.com/opensearch-service/latest/APIReference/API_CreateDomain.html#API_CreateDomain_RequestBody) in the OpenSearch Service API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedoptions
     */
    readonly advancedOptions?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * Specifies options for fine-grained access control. If you specify advanced security options, you must also enable node-to-node encryption ( [NodeToNodeEncryptionOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html) ) and encryption at rest ( [EncryptionAtRestOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html) ). You must also enable `EnforceHTTPS` within [DomainEndpointOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html) , which requires HTTPS for all traffic to the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedsecurityoptions
     */
    readonly advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

    /**
     * Container for the cluster configuration of a domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-clusterconfig
     */
    readonly clusterConfig?: CfnDomain.ClusterConfigProperty | cdk.IResolvable;

    /**
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-cognitooptions
     */
    readonly cognitoOptions?: CfnDomain.CognitoOptionsProperty | cdk.IResolvable;

    /**
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainendpointoptions
     */
    readonly domainEndpointOptions?: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable;

    /**
     * A name for the OpenSearch Service domain. For valid values, see the [DomainName](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname) data type in the *Amazon OpenSearch Service Developer Guide* . If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * Required when creating a new domain.
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainname
     */
    readonly domainName?: string;

    /**
     * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-ebsoptions
     */
    readonly ebsOptions?: CfnDomain.EBSOptionsProperty | cdk.IResolvable;

    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS KMS key to use. See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-encryptionatrestoptions
     */
    readonly encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

    /**
     * The version of OpenSearch to use. The value must be in the format `OpenSearch_X.Y` or `Elasticsearch_X.Y` . If not specified, the latest version of OpenSearch is used. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `EngineVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `EngineVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-engineversion
     */
    readonly engineVersion?: string;

    /**
     * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish. Each key needs a valid `LogPublishingOption` value. For the full syntax, see the [examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--examples) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-logpublishingoptions
     */
    readonly logPublishingOptions?: { [key: string]: (CfnDomain.LogPublishingOptionProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Specifies whether node-to-node encryption is enabled. See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-nodetonodeencryptionoptions
     */
    readonly nodeToNodeEncryptionOptions?: CfnDomain.NodeToNodeEncryptionOptionsProperty | cdk.IResolvable;

    /**
     * *DEPRECATED* . The automated snapshot configuration for the OpenSearch Service domain indexes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-snapshotoptions
     */
    readonly snapshotOptions?: CfnDomain.SnapshotOptionsProperty | cdk.IResolvable;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The virtual private cloud (VPC) configuration for the OpenSearch Service domain. For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you remove this entity altogether, along with its associated properties, it causes a replacement. You might encounter this scenario if you're updating your security configuration from a VPC to a public endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-vpcoptions
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
    errors.collect(cdk.propertyValidator('clusterConfig', CfnDomain_ClusterConfigPropertyValidator)(properties.clusterConfig));
    errors.collect(cdk.propertyValidator('cognitoOptions', CfnDomain_CognitoOptionsPropertyValidator)(properties.cognitoOptions));
    errors.collect(cdk.propertyValidator('domainEndpointOptions', CfnDomain_DomainEndpointOptionsPropertyValidator)(properties.domainEndpointOptions));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('ebsOptions', CfnDomain_EBSOptionsPropertyValidator)(properties.ebsOptions));
    errors.collect(cdk.propertyValidator('encryptionAtRestOptions', CfnDomain_EncryptionAtRestOptionsPropertyValidator)(properties.encryptionAtRestOptions));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('logPublishingOptions', cdk.hashValidator(CfnDomain_LogPublishingOptionPropertyValidator))(properties.logPublishingOptions));
    errors.collect(cdk.propertyValidator('nodeToNodeEncryptionOptions', CfnDomain_NodeToNodeEncryptionOptionsPropertyValidator)(properties.nodeToNodeEncryptionOptions));
    errors.collect(cdk.propertyValidator('snapshotOptions', CfnDomain_SnapshotOptionsPropertyValidator)(properties.snapshotOptions));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcOptions', CfnDomain_VPCOptionsPropertyValidator)(properties.vpcOptions));
    return errors.wrap('supplied properties not correct for "CfnDomainProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain` resource.
 */
// @ts-ignore TS6133
function cfnDomainPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainPropsValidator(properties).assertSuccess();
    return {
        AccessPolicies: cdk.objectToCloudFormation(properties.accessPolicies),
        AdvancedOptions: cdk.hashMapper(cdk.stringToCloudFormation)(properties.advancedOptions),
        AdvancedSecurityOptions: cfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties.advancedSecurityOptions),
        ClusterConfig: cfnDomainClusterConfigPropertyToCloudFormation(properties.clusterConfig),
        CognitoOptions: cfnDomainCognitoOptionsPropertyToCloudFormation(properties.cognitoOptions),
        DomainEndpointOptions: cfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties.domainEndpointOptions),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        EBSOptions: cfnDomainEBSOptionsPropertyToCloudFormation(properties.ebsOptions),
        EncryptionAtRestOptions: cfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties.encryptionAtRestOptions),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
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
    ret.addPropertyResult('clusterConfig', 'ClusterConfig', properties.ClusterConfig != null ? CfnDomainClusterConfigPropertyFromCloudFormation(properties.ClusterConfig) : undefined);
    ret.addPropertyResult('cognitoOptions', 'CognitoOptions', properties.CognitoOptions != null ? CfnDomainCognitoOptionsPropertyFromCloudFormation(properties.CognitoOptions) : undefined);
    ret.addPropertyResult('domainEndpointOptions', 'DomainEndpointOptions', properties.DomainEndpointOptions != null ? CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties.DomainEndpointOptions) : undefined);
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('ebsOptions', 'EBSOptions', properties.EBSOptions != null ? CfnDomainEBSOptionsPropertyFromCloudFormation(properties.EBSOptions) : undefined);
    ret.addPropertyResult('encryptionAtRestOptions', 'EncryptionAtRestOptions', properties.EncryptionAtRestOptions != null ? CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties.EncryptionAtRestOptions) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('logPublishingOptions', 'LogPublishingOptions', properties.LogPublishingOptions != null ? cfn_parse.FromCloudFormation.getMap(CfnDomainLogPublishingOptionPropertyFromCloudFormation)(properties.LogPublishingOptions) : undefined);
    ret.addPropertyResult('nodeToNodeEncryptionOptions', 'NodeToNodeEncryptionOptions', properties.NodeToNodeEncryptionOptions != null ? CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties.NodeToNodeEncryptionOptions) : undefined);
    ret.addPropertyResult('snapshotOptions', 'SnapshotOptions', properties.SnapshotOptions != null ? CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties.SnapshotOptions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpcOptions', 'VPCOptions', properties.VPCOptions != null ? CfnDomainVPCOptionsPropertyFromCloudFormation(properties.VPCOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchService::Domain`
 *
 * The AWS::OpenSearchService::Domain resource creates an Amazon OpenSearch Service domain.
 *
 * @cloudformationResource AWS::OpenSearchService::Domain
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchService::Domain";

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
     * The Amazon Resource Name (ARN) of the domain, such as `arn:aws:es:us-west-2:123456789012:domain/mystack-1ab2cdefghij` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The domain-specific endpoint used for requests to the OpenSearch APIs, such as `search-mystack-1ab2cdefghij-ab1c2deckoyb3hofw7wpqa3cm.us-west-1.es.amazonaws.com` .
     * @cloudformationAttribute DomainEndpoint
     */
    public readonly attrDomainEndpoint: string;

    /**
     *
     * @cloudformationAttribute DomainEndpoints
     */
    public readonly attrDomainEndpoints: cdk.IResolvable;

    /**
     * The resource ID. For example, `123456789012/my-domain` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The timestamp, in Epoch time, until which you can manually request a service software update. After this date, we automatically update your service software.
     * @cloudformationAttribute ServiceSoftwareOptions.AutomatedUpdateDate
     */
    public readonly attrServiceSoftwareOptionsAutomatedUpdateDate: string;

    /**
     * True if you're able to cancel your service software version update. False if you can't cancel your service software update.
     * @cloudformationAttribute ServiceSoftwareOptions.Cancellable
     */
    public readonly attrServiceSoftwareOptionsCancellable: cdk.IResolvable;

    /**
     * The current service software version present on the domain.
     * @cloudformationAttribute ServiceSoftwareOptions.CurrentVersion
     */
    public readonly attrServiceSoftwareOptionsCurrentVersion: string;

    /**
     * A description of the service software update status.
     * @cloudformationAttribute ServiceSoftwareOptions.Description
     */
    public readonly attrServiceSoftwareOptionsDescription: string;

    /**
     * The new service software version, if one is available.
     * @cloudformationAttribute ServiceSoftwareOptions.NewVersion
     */
    public readonly attrServiceSoftwareOptionsNewVersion: string;

    /**
     * True if a service software is never automatically updated. False if a service software is automatically updated after the automated update date.
     * @cloudformationAttribute ServiceSoftwareOptions.OptionalDeployment
     */
    public readonly attrServiceSoftwareOptionsOptionalDeployment: cdk.IResolvable;

    /**
     * True if you're able to update your service software version. False if you can't update your service software version.
     * @cloudformationAttribute ServiceSoftwareOptions.UpdateAvailable
     */
    public readonly attrServiceSoftwareOptionsUpdateAvailable: cdk.IResolvable;

    /**
     * The status of your service software update.
     * @cloudformationAttribute ServiceSoftwareOptions.UpdateStatus
     */
    public readonly attrServiceSoftwareOptionsUpdateStatus: string;

    /**
     * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions. For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-accesspolicies
     */
    public accessPolicies: any | cdk.IResolvable | undefined;

    /**
     * Additional options to specify for the OpenSearch Service domain. For more information, see [AdvancedOptions](https://docs.aws.amazon.com/opensearch-service/latest/APIReference/API_CreateDomain.html#API_CreateDomain_RequestBody) in the OpenSearch Service API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedoptions
     */
    public advancedOptions: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Specifies options for fine-grained access control. If you specify advanced security options, you must also enable node-to-node encryption ( [NodeToNodeEncryptionOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html) ) and encryption at rest ( [EncryptionAtRestOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html) ). You must also enable `EnforceHTTPS` within [DomainEndpointOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html) , which requires HTTPS for all traffic to the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedsecurityoptions
     */
    public advancedSecurityOptions: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable | undefined;

    /**
     * Container for the cluster configuration of a domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-clusterconfig
     */
    public clusterConfig: CfnDomain.ClusterConfigProperty | cdk.IResolvable | undefined;

    /**
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-cognitooptions
     */
    public cognitoOptions: CfnDomain.CognitoOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainendpointoptions
     */
    public domainEndpointOptions: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable | undefined;

    /**
     * A name for the OpenSearch Service domain. For valid values, see the [DomainName](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname) data type in the *Amazon OpenSearch Service Developer Guide* . If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * Required when creating a new domain.
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainname
     */
    public domainName: string | undefined;

    /**
     * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-ebsoptions
     */
    public ebsOptions: CfnDomain.EBSOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS KMS key to use. See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-encryptionatrestoptions
     */
    public encryptionAtRestOptions: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The version of OpenSearch to use. The value must be in the format `OpenSearch_X.Y` or `Elasticsearch_X.Y` . If not specified, the latest version of OpenSearch is used. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `EngineVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `EngineVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish. Each key needs a valid `LogPublishingOption` value. For the full syntax, see the [examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--examples) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-logpublishingoptions
     */
    public logPublishingOptions: { [key: string]: (CfnDomain.LogPublishingOptionProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * Specifies whether node-to-node encryption is enabled. See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-nodetonodeencryptionoptions
     */
    public nodeToNodeEncryptionOptions: CfnDomain.NodeToNodeEncryptionOptionsProperty | cdk.IResolvable | undefined;

    /**
     * *DEPRECATED* . The automated snapshot configuration for the OpenSearch Service domain indexes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-snapshotoptions
     */
    public snapshotOptions: CfnDomain.SnapshotOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The virtual private cloud (VPC) configuration for the OpenSearch Service domain. For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * If you remove this entity altogether, along with its associated properties, it causes a replacement. You might encounter this scenario if you're updating your security configuration from a VPC to a public endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-vpcoptions
     */
    public vpcOptions: CfnDomain.VPCOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::OpenSearchService::Domain`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainProps = {}) {
        super(scope, id, { type: CfnDomain.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDomainEndpoint = cdk.Token.asString(this.getAtt('DomainEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrDomainEndpoints = this.getAtt('DomainEndpoints', cdk.ResolutionTypeHint.STRING);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrServiceSoftwareOptionsAutomatedUpdateDate = cdk.Token.asString(this.getAtt('ServiceSoftwareOptions.AutomatedUpdateDate', cdk.ResolutionTypeHint.STRING));
        this.attrServiceSoftwareOptionsCancellable = this.getAtt('ServiceSoftwareOptions.Cancellable', cdk.ResolutionTypeHint.STRING);
        this.attrServiceSoftwareOptionsCurrentVersion = cdk.Token.asString(this.getAtt('ServiceSoftwareOptions.CurrentVersion', cdk.ResolutionTypeHint.STRING));
        this.attrServiceSoftwareOptionsDescription = cdk.Token.asString(this.getAtt('ServiceSoftwareOptions.Description', cdk.ResolutionTypeHint.STRING));
        this.attrServiceSoftwareOptionsNewVersion = cdk.Token.asString(this.getAtt('ServiceSoftwareOptions.NewVersion', cdk.ResolutionTypeHint.STRING));
        this.attrServiceSoftwareOptionsOptionalDeployment = this.getAtt('ServiceSoftwareOptions.OptionalDeployment', cdk.ResolutionTypeHint.STRING);
        this.attrServiceSoftwareOptionsUpdateAvailable = this.getAtt('ServiceSoftwareOptions.UpdateAvailable', cdk.ResolutionTypeHint.STRING);
        this.attrServiceSoftwareOptionsUpdateStatus = cdk.Token.asString(this.getAtt('ServiceSoftwareOptions.UpdateStatus', cdk.ResolutionTypeHint.STRING));

        this.accessPolicies = props.accessPolicies;
        this.advancedOptions = props.advancedOptions;
        this.advancedSecurityOptions = props.advancedSecurityOptions;
        this.clusterConfig = props.clusterConfig;
        this.cognitoOptions = props.cognitoOptions;
        this.domainEndpointOptions = props.domainEndpointOptions;
        this.domainName = props.domainName;
        this.ebsOptions = props.ebsOptions;
        this.encryptionAtRestOptions = props.encryptionAtRestOptions;
        this.engineVersion = props.engineVersion;
        this.logPublishingOptions = props.logPublishingOptions;
        this.nodeToNodeEncryptionOptions = props.nodeToNodeEncryptionOptions;
        this.snapshotOptions = props.snapshotOptions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpenSearchService::Domain", props.tags, { tagPropertyName: 'tags' });
        this.vpcOptions = props.vpcOptions;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::OpenSearchService::Domain\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
            clusterConfig: this.clusterConfig,
            cognitoOptions: this.cognitoOptions,
            domainEndpointOptions: this.domainEndpointOptions,
            domainName: this.domainName,
            ebsOptions: this.ebsOptions,
            encryptionAtRestOptions: this.encryptionAtRestOptions,
            engineVersion: this.engineVersion,
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
     * Specifies options for fine-grained access control. If you specify advanced security options, you must also enable node-to-node encryption ( [NodeToNodeEncryptionOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html) ) and encryption at rest ( [EncryptionAtRestOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html) ). You must also enable `EnforceHTTPS` within [DomainEndpointOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html) , which requires HTTPS for all traffic to the domain.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html
     */
    export interface AdvancedSecurityOptionsInputProperty {
        /**
         * True to enable fine-grained access control. You must also enable encryption of data at rest and node-to-node encryption. See [Fine-grained access control in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * True to enable the internal user database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-internaluserdatabaseenabled
         */
        readonly internalUserDatabaseEnabled?: boolean | cdk.IResolvable;
        /**
         * Specifies information about the master user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-masteruseroptions
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
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('internalUserDatabaseEnabled', cdk.validateBoolean)(properties.internalUserDatabaseEnabled));
    errors.collect(cdk.propertyValidator('masterUserOptions', CfnDomain_MasterUserOptionsPropertyValidator)(properties.masterUserOptions));
    return errors.wrap('supplied properties not correct for "AdvancedSecurityOptionsInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.AdvancedSecurityOptionsInput` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedSecurityOptionsInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.AdvancedSecurityOptionsInput` resource.
 */
// @ts-ignore TS6133
function cfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_AdvancedSecurityOptionsInputPropertyValidator(properties).assertSuccess();
    return {
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
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('internalUserDatabaseEnabled', 'InternalUserDatabaseEnabled', properties.InternalUserDatabaseEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InternalUserDatabaseEnabled) : undefined);
    ret.addPropertyResult('masterUserOptions', 'MasterUserOptions', properties.MasterUserOptions != null ? CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties.MasterUserOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * The cluster configuration for the OpenSearch Service domain. You can specify options such as the instance type and the number of instances. For more information, see [Creating and managing Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html
     */
    export interface ClusterConfigProperty {
        /**
         * The number of instances to use for the master node. If you specify this property, you must specify `true` for the `DedicatedMasterEnabled` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmastercount
         */
        readonly dedicatedMasterCount?: number;
        /**
         * Indicates whether to use a dedicated master node for the OpenSearch Service domain. A dedicated master node is a cluster node that performs cluster management tasks, but doesn't hold data or respond to data upload requests. Dedicated master nodes offload cluster management tasks to increase the stability of your search clusters. See [Dedicated master nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmasterenabled
         */
        readonly dedicatedMasterEnabled?: boolean | cdk.IResolvable;
        /**
         * The hardware configuration of the computer that hosts the dedicated master node, such as `m3.medium.search` . If you specify this property, you must specify `true` for the `DedicatedMasterEnabled` property. For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmastertype
         */
        readonly dedicatedMasterType?: string;
        /**
         * The number of data nodes (instances) to use in the OpenSearch Service domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-instancecount
         */
        readonly instanceCount?: number;
        /**
         * The instance type for your data nodes, such as `m3.medium.search` . For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-instancetype
         */
        readonly instanceType?: string;
        /**
         * The number of warm nodes in the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmcount
         */
        readonly warmCount?: number;
        /**
         * Whether to enable UltraWarm storage for the cluster. See [UltraWarm storage for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmenabled
         */
        readonly warmEnabled?: boolean | cdk.IResolvable;
        /**
         * The instance type for the cluster's warm nodes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmtype
         */
        readonly warmType?: string;
        /**
         * Specifies zone awareness configuration options. Only use if `ZoneAwarenessEnabled` is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-zoneawarenessconfig
         */
        readonly zoneAwarenessConfig?: CfnDomain.ZoneAwarenessConfigProperty | cdk.IResolvable;
        /**
         * Indicates whether to enable zone awareness for the OpenSearch Service domain. When you enable zone awareness, OpenSearch Service allocates the nodes and replica index shards that belong to a cluster across two Availability Zones (AZs) in the same region to prevent data loss and minimize downtime in the event of node or data center failure. Don't enable zone awareness if your cluster has no replica index shards or is a single-node cluster. For more information, see [Configuring a multi-AZ domain in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-zoneawarenessenabled
         */
        readonly zoneAwarenessEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ClusterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_ClusterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
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
    return errors.wrap('supplied properties not correct for "ClusterConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ClusterConfig` resource
 *
 * @param properties - the TypeScript properties of a `ClusterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ClusterConfig` resource.
 */
// @ts-ignore TS6133
function cfnDomainClusterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_ClusterConfigPropertyValidator(properties).assertSuccess();
    return {
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
function CfnDomainClusterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ClusterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ClusterConfigProperty>();
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
     * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html
     */
    export interface CognitoOptionsProperty {
        /**
         * Whether to enable or disable Amazon Cognito authentication for OpenSearch Dashboards. See [Amazon Cognito authentication for OpenSearch Dashboards](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The Amazon Cognito identity pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
         *
         * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-identitypoolid
         */
        readonly identityPoolId?: string;
        /**
         * The `AmazonOpenSearchServiceCognitoAccess` role that allows OpenSearch Service to configure your user pool and identity pool.
         *
         * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-rolearn
         */
        readonly roleArn?: string;
        /**
         * The Amazon Cognito user pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
         *
         * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-userpoolid
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.CognitoOptions` resource
 *
 * @param properties - the TypeScript properties of a `CognitoOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.CognitoOptions` resource.
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
     * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html
     */
    export interface DomainEndpointOptionsProperty {
        /**
         * The fully qualified URL for your custom endpoint. Required if you enabled a custom endpoint for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpoint
         */
        readonly customEndpoint?: string;
        /**
         * The AWS Certificate Manager ARN for your domain's SSL/TLS certificate. Required if you enabled a custom endpoint for the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpointcertificatearn
         */
        readonly customEndpointCertificateArn?: string;
        /**
         * True to enable a custom endpoint for the domain. If enabled, you must also provide values for `CustomEndpoint` and `CustomEndpointCertificateArn` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpointenabled
         */
        readonly customEndpointEnabled?: boolean | cdk.IResolvable;
        /**
         * True to require that all traffic to the domain arrive over HTTPS. Required if you enable fine-grained access control in [AdvancedSecurityOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-enforcehttps
         */
        readonly enforceHttps?: boolean | cdk.IResolvable;
        /**
         * The minimum TLS version required for traffic to the domain. Valid values are TLS 1.0 (default) or 1.2:
         *
         * - `Policy-Min-TLS-1-0-2019-07`
         * - `Policy-Min-TLS-1-2-2019-07`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-tlssecuritypolicy
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.DomainEndpointOptions` resource
 *
 * @param properties - the TypeScript properties of a `DomainEndpointOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.DomainEndpointOptions` resource.
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
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html
     */
    export interface EBSOptionsProperty {
        /**
         * Specifies whether Amazon EBS volumes are attached to data nodes in the OpenSearch Service domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-ebsenabled
         */
        readonly ebsEnabled?: boolean | cdk.IResolvable;
        /**
         * The number of I/O operations per second (IOPS) that the volume supports. This property applies only to the `gp3` and provisioned IOPS EBS volume types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-iops
         */
        readonly iops?: number;
        /**
         * The throughput (in MiB/s) of the EBS volumes attached to data nodes. Applies only to the `gp3` volume type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-throughput
         */
        readonly throughput?: number;
        /**
         * The size (in GiB) of the EBS volume for each data node. The minimum and maximum size of an EBS volume depends on the EBS volume type and the instance type to which it is attached. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-volumesize
         */
        readonly volumeSize?: number;
        /**
         * The EBS volume type to use with the OpenSearch Service domain. If you choose `gp3` , you must also specify values for `Iops` and `Throughput` . For more information about each type, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-volumetype
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
    errors.collect(cdk.propertyValidator('throughput', cdk.validateNumber)(properties.throughput));
    errors.collect(cdk.propertyValidator('volumeSize', cdk.validateNumber)(properties.volumeSize));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "EBSOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.EBSOptions` resource
 *
 * @param properties - the TypeScript properties of a `EBSOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.EBSOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainEBSOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_EBSOptionsPropertyValidator(properties).assertSuccess();
    return {
        EBSEnabled: cdk.booleanToCloudFormation(properties.ebsEnabled),
        Iops: cdk.numberToCloudFormation(properties.iops),
        Throughput: cdk.numberToCloudFormation(properties.throughput),
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
    ret.addPropertyResult('throughput', 'Throughput', properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined);
    ret.addPropertyResult('volumeSize', 'VolumeSize', properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html
     */
    export interface EncryptionAtRestOptionsProperty {
        /**
         * Specify `true` to enable encryption at rest. Required if you enable fine-grained access control in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html#cfn-opensearchservice-domain-encryptionatrestoptions-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The KMS key ID. Takes the form `1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a` . Required if you enable encryption at rest.
         *
         * You can also use `keyAlias` as a value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html#cfn-opensearchservice-domain-encryptionatrestoptions-kmskeyid
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.EncryptionAtRestOptions` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.EncryptionAtRestOptions` resource.
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
     * Specifies whether the OpenSearch Service domain publishes application, search slow logs, or index slow logs to Amazon CloudWatch. Each option must be an object of name `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , or `AUDIT_LOGS` depending on the type of logs you want to publish. For the full syntax, see the [examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--examples) .
     *
     * Before you enable log publishing, you need to create a CloudWatch log group and provide OpenSearch Service the correct permissions to write to it. To learn more, see [Enabling log publishing ( AWS CloudFormation)](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createdomain-configure-slow-logs.html#createdomain-configure-slow-logs-cfn) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html
     */
    export interface LogPublishingOptionProperty {
        /**
         * Specifies the CloudWatch log group to publish to. Required if you enable log publishing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html#cfn-opensearchservice-domain-logpublishingoption-cloudwatchlogsloggrouparn
         */
        readonly cloudWatchLogsLogGroupArn?: string;
        /**
         * If `true` , enables the publishing of logs to CloudWatch.
         *
         * Default: `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html#cfn-opensearchservice-domain-logpublishingoption-enabled
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.LogPublishingOption` resource
 *
 * @param properties - the TypeScript properties of a `LogPublishingOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.LogPublishingOption` resource.
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
     * Specifies information about the master user.
     *
     * Required if if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html
     */
    export interface MasterUserOptionsProperty {
        /**
         * Amazon Resource Name (ARN) for the master user. The ARN can point to an IAM user or role. This property is required for Amazon Cognito to work, and it must match the role configured for Cognito. Only specify if `InternalUserDatabaseEnabled` is false in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masteruserarn
         */
        readonly masterUserArn?: string;
        /**
         * Username for the master user. Only specify if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * If you don't want to specify this value directly within the template, you can use a [dynamic reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html) instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masterusername
         */
        readonly masterUserName?: string;
        /**
         * Password for the master user. Only specify if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * If you don't want to specify this value directly within the template, you can use a [dynamic reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html) instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masteruserpassword
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.MasterUserOptions` resource
 *
 * @param properties - the TypeScript properties of a `MasterUserOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.MasterUserOptions` resource.
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
     * Specifies options for node-to-node encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html
     */
    export interface NodeToNodeEncryptionOptionsProperty {
        /**
         * Specifies to enable or disable node-to-node encryption on the domain. Required if you enable fine-grained access control in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html#cfn-opensearchservice-domain-nodetonodeencryptionoptions-enabled
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.NodeToNodeEncryptionOptions` resource
 *
 * @param properties - the TypeScript properties of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.NodeToNodeEncryptionOptions` resource.
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
     * The current status of the service software for an Amazon OpenSearch Service domain. For more information, see [Service software updates in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/service-software.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html
     */
    export interface ServiceSoftwareOptionsProperty {
        /**
         * The timestamp, in Epoch time, until which you can manually request a service software update. After this date, we automatically update your service software.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-automatedupdatedate
         */
        readonly automatedUpdateDate?: string;
        /**
         * True if you're able to cancel your service software version update. False if you can't cancel your service software update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-cancellable
         */
        readonly cancellable?: boolean | cdk.IResolvable;
        /**
         * The current service software version present on the domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-currentversion
         */
        readonly currentVersion?: string;
        /**
         * A description of the service software update status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-description
         */
        readonly description?: string;
        /**
         * The new service software version, if one is available.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-newversion
         */
        readonly newVersion?: string;
        /**
         * True if a service software is never automatically updated. False if a service software is automatically updated after the automated update date.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-optionaldeployment
         */
        readonly optionalDeployment?: boolean | cdk.IResolvable;
        /**
         * True if you're able to update your service software version. False if you can't update your service software version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-updateavailable
         */
        readonly updateAvailable?: boolean | cdk.IResolvable;
        /**
         * The status of your service software update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-updatestatus
         */
        readonly updateStatus?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ServiceSoftwareOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceSoftwareOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomain_ServiceSoftwareOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automatedUpdateDate', cdk.validateString)(properties.automatedUpdateDate));
    errors.collect(cdk.propertyValidator('cancellable', cdk.validateBoolean)(properties.cancellable));
    errors.collect(cdk.propertyValidator('currentVersion', cdk.validateString)(properties.currentVersion));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('newVersion', cdk.validateString)(properties.newVersion));
    errors.collect(cdk.propertyValidator('optionalDeployment', cdk.validateBoolean)(properties.optionalDeployment));
    errors.collect(cdk.propertyValidator('updateAvailable', cdk.validateBoolean)(properties.updateAvailable));
    errors.collect(cdk.propertyValidator('updateStatus', cdk.validateString)(properties.updateStatus));
    return errors.wrap('supplied properties not correct for "ServiceSoftwareOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ServiceSoftwareOptions` resource
 *
 * @param properties - the TypeScript properties of a `ServiceSoftwareOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ServiceSoftwareOptions` resource.
 */
// @ts-ignore TS6133
function cfnDomainServiceSoftwareOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomain_ServiceSoftwareOptionsPropertyValidator(properties).assertSuccess();
    return {
        AutomatedUpdateDate: cdk.stringToCloudFormation(properties.automatedUpdateDate),
        Cancellable: cdk.booleanToCloudFormation(properties.cancellable),
        CurrentVersion: cdk.stringToCloudFormation(properties.currentVersion),
        Description: cdk.stringToCloudFormation(properties.description),
        NewVersion: cdk.stringToCloudFormation(properties.newVersion),
        OptionalDeployment: cdk.booleanToCloudFormation(properties.optionalDeployment),
        UpdateAvailable: cdk.booleanToCloudFormation(properties.updateAvailable),
        UpdateStatus: cdk.stringToCloudFormation(properties.updateStatus),
    };
}

// @ts-ignore TS6133
function CfnDomainServiceSoftwareOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ServiceSoftwareOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ServiceSoftwareOptionsProperty>();
    ret.addPropertyResult('automatedUpdateDate', 'AutomatedUpdateDate', properties.AutomatedUpdateDate != null ? cfn_parse.FromCloudFormation.getString(properties.AutomatedUpdateDate) : undefined);
    ret.addPropertyResult('cancellable', 'Cancellable', properties.Cancellable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Cancellable) : undefined);
    ret.addPropertyResult('currentVersion', 'CurrentVersion', properties.CurrentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentVersion) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('newVersion', 'NewVersion', properties.NewVersion != null ? cfn_parse.FromCloudFormation.getString(properties.NewVersion) : undefined);
    ret.addPropertyResult('optionalDeployment', 'OptionalDeployment', properties.OptionalDeployment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OptionalDeployment) : undefined);
    ret.addPropertyResult('updateAvailable', 'UpdateAvailable', properties.UpdateAvailable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UpdateAvailable) : undefined);
    ret.addPropertyResult('updateStatus', 'UpdateStatus', properties.UpdateStatus != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateStatus) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDomain {
    /**
     * *DEPRECATED* . This setting is only relevant to domains running legacy Elasticsearch OSS versions earlier than 5.3. It does not apply to OpenSearch domains.
     *
     * The automated snapshot configuration for the OpenSearch Service domain indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-snapshotoptions.html
     */
    export interface SnapshotOptionsProperty {
        /**
         * The hour in UTC during which the service takes an automated daily snapshot of the indexes in the OpenSearch Service domain. For example, if you specify 0, OpenSearch Service takes an automated snapshot everyday between midnight and 1 am. You can specify a value between 0 and 23.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-snapshotoptions.html#cfn-opensearchservice-domain-snapshotoptions-automatedsnapshotstarthour
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.SnapshotOptions` resource
 *
 * @param properties - the TypeScript properties of a `SnapshotOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.SnapshotOptions` resource.
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
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html
     */
    export interface VPCOptionsProperty {
        /**
         * The list of security group IDs that are associated with the VPC endpoints for the domain. If you don't provide a security group ID, OpenSearch Service uses the default security group for the VPC. To learn more, see [Security groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon VPC User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html#cfn-opensearchservice-domain-vpcoptions-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * Provide one subnet ID for each Availability Zone that your domain uses. For example, you must specify three subnet IDs for a three-AZ domain. To learn more, see [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon VPC User Guide* .
         *
         * If you specify more than one subnet, you must also configure `ZoneAwarenessEnabled` and `ZoneAwarenessConfig` within [ClusterConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html) , otherwise you'll see the error "You must specify exactly one subnet" during template creation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html#cfn-opensearchservice-domain-vpcoptions-subnetids
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.VPCOptions` resource
 *
 * @param properties - the TypeScript properties of a `VPCOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.VPCOptions` resource.
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
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-zoneawarenessconfig.html
     */
    export interface ZoneAwarenessConfigProperty {
        /**
         * If you enabled multiple Availability Zones (AZs), the number of AZs that you want the domain to use.
         *
         * Valid values are `2` and `3` . Default is 2.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-zoneawarenessconfig.html#cfn-opensearchservice-domain-zoneawarenessconfig-availabilityzonecount
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
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ZoneAwarenessConfig` resource
 *
 * @param properties - the TypeScript properties of a `ZoneAwarenessConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchService::Domain.ZoneAwarenessConfig` resource.
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
