"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnRepository = exports.CfnReplicationConfiguration = exports.CfnRegistryPolicy = exports.CfnPullThroughCacheRule = exports.CfnPublicRepository = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnPublicRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicRepositoryProps`
 *
 * @returns the result of the validation.
 */
function CfnPublicRepositoryPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnPublicRepositoryPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnPublicRepositoryPropsValidator(properties).assertSuccess();
    return {
        RepositoryCatalogData: cdk.objectToCloudFormation(properties.repositoryCatalogData),
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        RepositoryPolicyText: cdk.objectToCloudFormation(properties.repositoryPolicyText),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnPublicRepositoryPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('repositoryCatalogData', 'RepositoryCatalogData', properties.RepositoryCatalogData != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryCatalogData) : undefined);
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('repositoryPolicyText', 'RepositoryPolicyText', properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnPublicRepository extends cdk.CfnResource {
    /**
     * Create a new `AWS::ECR::PublicRepository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnPublicRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_CfnPublicRepositoryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnPublicRepository);
            }
            throw error;
        }
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.repositoryCatalogData = props.repositoryCatalogData;
        this.repositoryName = props.repositoryName;
        this.repositoryPolicyText = props.repositoryPolicyText;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECR::PublicRepository", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPublicRepositoryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPublicRepository(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicRepository.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            repositoryCatalogData: this.repositoryCatalogData,
            repositoryName: this.repositoryName,
            repositoryPolicyText: this.repositoryPolicyText,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnPublicRepositoryPropsToCloudFormation(props);
    }
}
exports.CfnPublicRepository = CfnPublicRepository;
_a = JSII_RTTI_SYMBOL_1;
CfnPublicRepository[_a] = { fqn: "@aws-cdk/aws-ecr.CfnPublicRepository", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnPublicRepository.CFN_RESOURCE_TYPE_NAME = "AWS::ECR::PublicRepository";
/**
 * Determine whether the given properties match those of a `RepositoryCatalogDataProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryCatalogDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnPublicRepository_RepositoryCatalogDataPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnPublicRepositoryRepositoryCatalogDataPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnPublicRepositoryRepositoryCatalogDataPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('aboutText', 'AboutText', properties.AboutText != null ? cfn_parse.FromCloudFormation.getString(properties.AboutText) : undefined);
    ret.addPropertyResult('architectures', 'Architectures', properties.Architectures != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Architectures) : undefined);
    ret.addPropertyResult('operatingSystems', 'OperatingSystems', properties.OperatingSystems != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OperatingSystems) : undefined);
    ret.addPropertyResult('repositoryDescription', 'RepositoryDescription', properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined);
    ret.addPropertyResult('usageText', 'UsageText', properties.UsageText != null ? cfn_parse.FromCloudFormation.getString(properties.UsageText) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnPullThroughCacheRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnPullThroughCacheRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnPullThroughCacheRulePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnPullThroughCacheRulePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnPullThroughCacheRulePropsValidator(properties).assertSuccess();
    return {
        EcrRepositoryPrefix: cdk.stringToCloudFormation(properties.ecrRepositoryPrefix),
        UpstreamRegistryUrl: cdk.stringToCloudFormation(properties.upstreamRegistryUrl),
    };
}
// @ts-ignore TS6133
function CfnPullThroughCacheRulePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnPullThroughCacheRule extends cdk.CfnResource {
    /**
     * Create a new `AWS::ECR::PullThroughCacheRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_CfnPullThroughCacheRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnPullThroughCacheRule);
            }
            throw error;
        }
        this.ecrRepositoryPrefix = props.ecrRepositoryPrefix;
        this.upstreamRegistryUrl = props.upstreamRegistryUrl;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPullThroughCacheRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPullThroughCacheRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            ecrRepositoryPrefix: this.ecrRepositoryPrefix,
            upstreamRegistryUrl: this.upstreamRegistryUrl,
        };
    }
    renderProperties(props) {
        return cfnPullThroughCacheRulePropsToCloudFormation(props);
    }
}
exports.CfnPullThroughCacheRule = CfnPullThroughCacheRule;
_b = JSII_RTTI_SYMBOL_1;
CfnPullThroughCacheRule[_b] = { fqn: "@aws-cdk/aws-ecr.CfnPullThroughCacheRule", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME = "AWS::ECR::PullThroughCacheRule";
/**
 * Determine whether the given properties match those of a `CfnRegistryPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnRegistryPolicyPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRegistryPolicyPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRegistryPolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyText: cdk.objectToCloudFormation(properties.policyText),
    };
}
// @ts-ignore TS6133
function CfnRegistryPolicyPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnRegistryPolicy extends cdk.CfnResource {
    /**
     * Create a new `AWS::ECR::RegistryPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_CfnRegistryPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRegistryPolicy);
            }
            throw error;
        }
        cdk.requireProperty(props, 'policyText', this);
        this.attrRegistryId = cdk.Token.asString(this.getAtt('RegistryId', cdk.ResolutionTypeHint.STRING));
        this.policyText = props.policyText;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRegistryPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRegistryPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            policyText: this.policyText,
        };
    }
    renderProperties(props) {
        return cfnRegistryPolicyPropsToCloudFormation(props);
    }
}
exports.CfnRegistryPolicy = CfnRegistryPolicy;
_c = JSII_RTTI_SYMBOL_1;
CfnRegistryPolicy[_c] = { fqn: "@aws-cdk/aws-ecr.CfnRegistryPolicy", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME = "AWS::ECR::RegistryPolicy";
/**
 * Determine whether the given properties match those of a `CfnReplicationConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfigurationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnReplicationConfigurationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReplicationConfigurationPropsValidator(properties).assertSuccess();
    return {
        ReplicationConfiguration: cfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration),
    };
}
// @ts-ignore TS6133
function CfnReplicationConfigurationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnReplicationConfiguration extends cdk.CfnResource {
    /**
     * Create a new `AWS::ECR::ReplicationConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_CfnReplicationConfigurationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnReplicationConfiguration);
            }
            throw error;
        }
        cdk.requireProperty(props, 'replicationConfiguration', this);
        this.attrRegistryId = cdk.Token.asString(this.getAtt('RegistryId', cdk.ResolutionTypeHint.STRING));
        this.replicationConfiguration = props.replicationConfiguration;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            replicationConfiguration: this.replicationConfiguration,
        };
    }
    renderProperties(props) {
        return cfnReplicationConfigurationPropsToCloudFormation(props);
    }
}
exports.CfnReplicationConfiguration = CfnReplicationConfiguration;
_d = JSII_RTTI_SYMBOL_1;
CfnReplicationConfiguration[_d] = { fqn: "@aws-cdk/aws-ecr.CfnReplicationConfiguration", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME = "AWS::ECR::ReplicationConfiguration";
/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReplicationConfiguration_ReplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnReplicationConfigurationReplicationRulePropertyToCloudFormation)(properties.rules),
    };
}
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationDestinationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReplicationConfiguration_ReplicationDestinationPropertyValidator(properties).assertSuccess();
    return {
        Region: cdk.stringToCloudFormation(properties.region),
        RegistryId: cdk.stringToCloudFormation(properties.registryId),
    };
}
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addPropertyResult('registryId', 'RegistryId', cfn_parse.FromCloudFormation.getString(properties.RegistryId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ReplicationRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_ReplicationRulePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnReplicationConfigurationReplicationRulePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReplicationConfiguration_ReplicationRulePropertyValidator(properties).assertSuccess();
    return {
        Destinations: cdk.listMapper(cfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation)(properties.destinations),
        RepositoryFilters: cdk.listMapper(cfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation)(properties.repositoryFilters),
    };
}
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('destinations', 'Destinations', cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation)(properties.Destinations));
    ret.addPropertyResult('repositoryFilters', 'RepositoryFilters', properties.RepositoryFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation)(properties.RepositoryFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `RepositoryFilterProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationConfiguration_RepositoryFilterPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReplicationConfiguration_RepositoryFilterPropertyValidator(properties).assertSuccess();
    return {
        Filter: cdk.stringToCloudFormation(properties.filter),
        FilterType: cdk.stringToCloudFormation(properties.filterType),
    };
}
// @ts-ignore TS6133
function CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('filter', 'Filter', cfn_parse.FromCloudFormation.getString(properties.Filter));
    ret.addPropertyResult('filterType', 'FilterType', cfn_parse.FromCloudFormation.getString(properties.FilterType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the result of the validation.
 */
function CfnRepositoryPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRepositoryPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnRepositoryPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('encryptionConfiguration', 'EncryptionConfiguration', properties.EncryptionConfiguration != null ? CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined);
    ret.addPropertyResult('imageScanningConfiguration', 'ImageScanningConfiguration', properties.ImageScanningConfiguration != null ? CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties.ImageScanningConfiguration) : undefined);
    ret.addPropertyResult('imageTagMutability', 'ImageTagMutability', properties.ImageTagMutability != null ? cfn_parse.FromCloudFormation.getString(properties.ImageTagMutability) : undefined);
    ret.addPropertyResult('lifecyclePolicy', 'LifecyclePolicy', properties.LifecyclePolicy != null ? CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties.LifecyclePolicy) : undefined);
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('repositoryPolicyText', 'RepositoryPolicyText', properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnRepository extends cdk.CfnResource {
    /**
     * Create a new `AWS::ECR::Repository`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnRepository.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_CfnRepositoryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRepository);
            }
            throw error;
        }
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
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRepositoryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRepository(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepository.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
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
    renderProperties(props) {
        return cfnRepositoryPropsToCloudFormation(props);
    }
}
exports.CfnRepository = CfnRepository;
_e = JSII_RTTI_SYMBOL_1;
CfnRepository[_e] = { fqn: "@aws-cdk/aws-ecr.CfnRepository", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRepository.CFN_RESOURCE_TYPE_NAME = "AWS::ECR::Repository";
/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_EncryptionConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRepositoryEncryptionConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRepository_EncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        KmsKey: cdk.stringToCloudFormation(properties.kmsKey),
    };
}
// @ts-ignore TS6133
function CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addPropertyResult('kmsKey', 'KmsKey', properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ImageScanningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_ImageScanningConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRepositoryImageScanningConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRepository_ImageScanningConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ScanOnPush: cdk.booleanToCloudFormation(properties.scanOnPush),
    };
}
// @ts-ignore TS6133
function CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('scanOnPush', 'ScanOnPush', properties.ScanOnPush != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScanOnPush) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `LifecyclePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRepository_LifecyclePolicyPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRepositoryLifecyclePolicyPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRepository_LifecyclePolicyPropertyValidator(properties).assertSuccess();
    return {
        LifecyclePolicyText: cdk.stringToCloudFormation(properties.lifecyclePolicyText),
        RegistryId: cdk.stringToCloudFormation(properties.registryId),
    };
}
// @ts-ignore TS6133
function CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('lifecyclePolicyText', 'LifecyclePolicyText', properties.LifecyclePolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.LifecyclePolicyText) : undefined);
    ret.addPropertyResult('registryId', 'RegistryId', properties.RegistryId != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNyLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjci5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEscUNBQXFDO0FBQ3JDLGdFQUFnRTtBQTJDaEU7Ozs7OztHQU1HO0FBQ0gsU0FBUyxpQ0FBaUMsQ0FBQyxVQUFlO0lBQ3RELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztJQUNySCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7SUFDbkgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEcsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLGdFQUFnRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLHdDQUF3QyxDQUFDLFVBQWU7SUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELGlDQUFpQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzlELE9BQU87UUFDSCxxQkFBcUIsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO1FBQ25GLGNBQWMsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNyRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1FBQ2pGLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7S0FDcEUsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUywwQ0FBMEMsQ0FBQyxVQUFlO0lBQy9ELFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQTRCLENBQUM7SUFDdkYsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixFQUFFLFVBQVUsQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RNLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdLLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsTSxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFnQixDQUFDLENBQUM7SUFDbkwsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsR0FBRyxDQUFDLFdBQVc7SUE2RHBEOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsUUFBa0MsRUFBRTtRQUNyRixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXJFckYsbUJBQW1COzs7O1FBc0V4QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXJGLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUM7UUFDekQsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUM7UUFDdkQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQy9IO0lBdEVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUEyQixFQUFFLEVBQVUsRUFBRSxrQkFBdUIsRUFBRSxPQUE0QztRQUM1SSxrQkFBa0IsR0FBRyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRixNQUFNLFdBQVcsR0FBRywwQ0FBMEMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sR0FBRyxHQUFHLElBQUksbUJBQW1CLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBdUREOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRyxTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtZQUNqRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDL0IsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyx3Q0FBd0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxRDs7QUFwR0wsa0RBcUdDOzs7QUFwR0c7O0dBRUc7QUFDb0IsMENBQXNCLEdBQUcsNEJBQTRCLENBQUM7QUE4SWpGOzs7Ozs7R0FNRztBQUNILFNBQVMsMERBQTBELENBQUMsVUFBZTtJQUMvRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM3RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN4SCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDOUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDckgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM3RixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMscUVBQXFFLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsZ0VBQWdFLENBQUMsVUFBZTtJQUNyRixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsMERBQTBELENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkYsT0FBTztRQUNILFNBQVMsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUMzRCxhQUFhLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ25GLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQ3pGLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7UUFDbkYsU0FBUyxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0tBQzlELENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsa0VBQWtFLENBQUMsVUFBZTtJQUN2RixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBcUQsQ0FBQztJQUNoSCxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pKLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUssR0FBRyxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFMLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBRSxVQUFVLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6TSxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pKLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUEyQkQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxxQ0FBcUMsQ0FBQyxVQUFlO0lBQzFELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNqSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNqSCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0VBQW9FLENBQUMsQ0FBQztBQUM3RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsNENBQTRDLENBQUMsVUFBZTtJQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQscUNBQXFDLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbEUsT0FBTztRQUNILG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7UUFDL0UsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztLQUNsRixDQUFDO0FBQ04sQ0FBQztBQUVELG9CQUFvQjtBQUNwQixTQUFTLDhDQUE4QyxDQUFDLFVBQWU7SUFDbkUsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBZ0MsQ0FBQztJQUMzRixHQUFHLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDak0sR0FBRyxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pNLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxXQUFXO0lBdUN4RDs7Ozs7O09BTUc7SUFDSCxZQUFZLEtBQTJCLEVBQUUsRUFBVSxFQUFFLFFBQXNDLEVBQUU7UUFDekYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0EvQ3pGLHVCQUF1Qjs7OztRQWlENUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO0tBQ3hEO0lBN0NEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUEyQixFQUFFLEVBQVUsRUFBRSxrQkFBdUIsRUFBRSxPQUE0QztRQUM1SSxrQkFBa0IsR0FBRyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRixNQUFNLFdBQVcsR0FBRyw4Q0FBOEMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEUsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBOEJEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsdUJBQXVCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN0RyxTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtZQUM3QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CO1NBQ2hELENBQUM7S0FDTDtJQUVTLGdCQUFnQixDQUFDLEtBQTJCO1FBQ2xELE9BQU8sNENBQTRDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDOUQ7O0FBekVMLDBEQTBFQzs7O0FBekVHOztHQUVHO0FBQ29CLDhDQUFzQixHQUFHLGdDQUFnQyxDQUFDO0FBMEZyRjs7Ozs7O0dBTUc7QUFDSCxTQUFTLCtCQUErQixDQUFDLFVBQWU7SUFDcEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNsRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxzQ0FBc0MsQ0FBQyxVQUFlO0lBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCwrQkFBK0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM1RCxPQUFPO1FBQ0gsVUFBVSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0tBQ2hFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsd0NBQXdDLENBQUMsVUFBZTtJQUM3RCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUEwQixDQUFDO0lBQ3JGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDOUcsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxHQUFHLENBQUMsV0FBVztJQXNDbEQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUM5RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQTlDbkYsaUJBQWlCOzs7O1FBK0N0QixHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVuRyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDdEM7SUE3Q0Q7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLHdDQUF3QyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakYsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUE4QkQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBYyxhQUFhO1FBQ3ZCLE9BQU87WUFDSCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDOUIsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxzQ0FBc0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4RDs7QUF4RUwsOENBeUVDOzs7QUF4RUc7O0dBRUc7QUFDb0Isd0NBQXNCLEdBQUcsMEJBQTBCLENBQUM7QUF5Ri9FOzs7Ozs7R0FNRztBQUNILFNBQVMseUNBQXlDLENBQUMsVUFBZTtJQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztJQUM5SCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQywwQkFBMEIsRUFBRSxxRUFBcUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDOUssT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHdFQUF3RSxDQUFDLENBQUM7QUFDakcsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLGdEQUFnRCxDQUFDLFVBQWU7SUFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELHlDQUF5QyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RFLE9BQU87UUFDSCx3QkFBd0IsRUFBRSwyRUFBMkUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUM7S0FDN0ksQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyxrREFBa0QsQ0FBQyxVQUFlO0lBQ3ZFLFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQW9DLENBQUM7SUFDL0YsR0FBRyxDQUFDLGlCQUFpQixDQUFDLDBCQUEwQixFQUFFLDBCQUEwQixFQUFFLDZFQUE2RSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDbE0sR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSwyQkFBNEIsU0FBUSxHQUFHLENBQUMsV0FBVztJQXNDNUQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUF1QztRQUN4RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSwyQkFBMkIsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQTlDN0YsMkJBQTJCOzs7O1FBK0NoQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRW5HLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUM7S0FDbEU7SUE3Q0Q7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLGtEQUFrRCxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDM0YsTUFBTSxHQUFHLEdBQUcsSUFBSSwyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUE4QkQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSwyQkFBMkIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBYyxhQUFhO1FBQ3ZCLE9BQU87WUFDSCx3QkFBd0IsRUFBRSxJQUFJLENBQUMsd0JBQXdCO1NBQzFELENBQUM7S0FDTDtJQUVTLGdCQUFnQixDQUFDLEtBQTJCO1FBQ2xELE9BQU8sZ0RBQWdELENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEU7O0FBeEVMLGtFQXlFQzs7O0FBeEVHOztHQUVHO0FBQ29CLGtEQUFzQixHQUFHLG9DQUFvQyxDQUFDO0FBMEZ6Rjs7Ozs7O0dBTUc7QUFDSCxTQUFTLHFFQUFxRSxDQUFDLFVBQWU7SUFDMUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEosT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHdFQUF3RSxDQUFDLENBQUM7QUFDakcsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLDJFQUEyRSxDQUFDLFVBQWU7SUFDaEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELHFFQUFxRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2xHLE9BQU87UUFDSCxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7S0FDOUcsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyw2RUFBNkUsQ0FBQyxVQUFlO0lBQ2xHLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUFnRSxDQUFDO0lBQzNILEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsb0VBQW9FLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2SyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBMkJEOzs7Ozs7R0FNRztBQUNILFNBQVMsbUVBQW1FLENBQUMsVUFBZTtJQUN4RixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHNFQUFzRSxDQUFDLENBQUM7QUFDL0YsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLHlFQUF5RSxDQUFDLFVBQWU7SUFDOUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELG1FQUFtRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2hHLE9BQU87UUFDSCxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDckQsVUFBVSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0tBQ2hFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsMkVBQTJFLENBQUMsVUFBZTtJQUNoRyxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBOEQsQ0FBQztJQUN6SCxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDakgsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQTJCRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLDREQUE0RCxDQUFDLFVBQWU7SUFDakYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN0RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdkssTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUMzSyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsa0VBQWtFLENBQUMsVUFBZTtJQUN2RixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsNERBQTRELENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekYsT0FBTztRQUNILFlBQVksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLHlFQUF5RSxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztRQUNoSSxpQkFBaUIsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLG1FQUFtRSxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO0tBQ3ZJLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsb0VBQW9FLENBQUMsVUFBZTtJQUN6RixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBdUQsQ0FBQztJQUNsSCxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLDJFQUEyRSxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbk0sR0FBRyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMscUVBQXFFLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL1AsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQTJCRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLDZEQUE2RCxDQUFDLFVBQWU7SUFDbEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNsRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxtRUFBbUUsQ0FBQyxVQUFlO0lBQ3hGLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCw2REFBNkQsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMxRixPQUFPO1FBQ0gsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ3JELFVBQVUsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztLQUNoRSxDQUFDO0FBQ04sQ0FBQztBQUVELG9CQUFvQjtBQUNwQixTQUFTLHFFQUFxRSxDQUFDLFVBQWU7SUFDMUYsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDcEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQXdELENBQUM7SUFDbkgsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2pILEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFnRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUywyQkFBMkIsQ0FBQyxVQUFlO0lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyx5QkFBeUIsRUFBRSxzREFBc0QsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7SUFDN0osTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsNEJBQTRCLEVBQUUseURBQXlELENBQUMsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0lBQ3RLLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQy9HLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLDhDQUE4QyxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDckksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3ZHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBQ25ILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxrQ0FBa0MsQ0FBQyxVQUFlO0lBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCwyQkFBMkIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN4RCxPQUFPO1FBQ0gsdUJBQXVCLEVBQUUsNERBQTRELENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pILDBCQUEwQixFQUFFLCtEQUErRCxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQztRQUNsSSxrQkFBa0IsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO1FBQzdFLGVBQWUsRUFBRSxvREFBb0QsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ2pHLGNBQWMsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNyRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1FBQ2pGLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7S0FDcEUsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyxvQ0FBb0MsQ0FBQyxVQUFlO0lBQ3pELFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQXNCLENBQUM7SUFDakYsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixFQUFFLHlCQUF5QixFQUFFLFVBQVUsQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLDhEQUE4RCxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6TyxHQUFHLENBQUMsaUJBQWlCLENBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUUsVUFBVSxDQUFDLDBCQUEwQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsaUVBQWlFLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hQLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3TCxHQUFHLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLHNEQUFzRCxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDak0sR0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0ssR0FBRyxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xNLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQWdCLENBQUMsQ0FBQztJQUNuTCxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFdBQVc7SUF3RjlDOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsUUFBNEIsRUFBRTtRQUMvRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FoRy9FLGFBQWE7Ozs7UUFpR2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXpHLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsdUJBQXVCLENBQUM7UUFDN0QsSUFBSSxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQywwQkFBMEIsQ0FBQztRQUNuRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ25ELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7UUFDM0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztRQUN2RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDekg7SUFyR0Q7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLG9DQUFvQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDN0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBc0ZEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDNUYsU0FBUyxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDOUU7SUFFRCxJQUFjLGFBQWE7UUFDdkIsT0FBTztZQUNILHVCQUF1QixFQUFFLElBQUksQ0FBQyx1QkFBdUI7WUFDckQsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtZQUMzRCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO1lBQzNDLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNyQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDL0IsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxrQ0FBa0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRDs7QUF0SUwsc0NBdUlDOzs7QUF0SUc7O0dBRUc7QUFDb0Isb0NBQXNCLEdBQUcsc0JBQXNCLENBQUM7QUFzSzNFOzs7Ozs7R0FNRztBQUNILFNBQVMsc0RBQXNELENBQUMsVUFBZTtJQUMzRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDMUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3ZHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLDREQUE0RCxDQUFDLFVBQWU7SUFDakYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELHNEQUFzRCxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ25GLE9BQU87UUFDSCxjQUFjLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDckUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0tBQ3hELENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsOERBQThELENBQUMsVUFBZTtJQUNuRixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBaUQsQ0FBQztJQUM1RyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUM3SCxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdJLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFxQkQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyx5REFBeUQsQ0FBQyxVQUFlO0lBQzlFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO0FBQ25HLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUywrREFBK0QsQ0FBQyxVQUFlO0lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCx5REFBeUQsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0RixPQUFPO1FBQ0gsVUFBVSxFQUFFLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0tBQ2pFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsaUVBQWlFLENBQUMsVUFBZTtJQUN0RixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBb0QsQ0FBQztJQUMvRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlKLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUEyQkQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyw4Q0FBOEMsQ0FBQyxVQUFlO0lBQ25FLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNqSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQywrREFBK0QsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxvREFBb0QsQ0FBQyxVQUFlO0lBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCw4Q0FBOEMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzRSxPQUFPO1FBQ0gsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUMvRSxVQUFVLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7S0FDaEUsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyxzREFBc0QsQ0FBQyxVQUFlO0lBQzNFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUF5QyxDQUFDO0lBQ3BHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxVQUFVLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqTSxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdKLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb25cbi8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWxcbi8vIEBjZm4ydHM6bWV0YUAge1wiZ2VuZXJhdGVkXCI6XCIyMDIzLTAzLTExVDA3OjMzOjQxLjc2OVpcIixcImZpbmdlcnByaW50XCI6XCJReTJXby9ZamVjNnJsSFJmMDN3VXc3eEEraUlURlJiWVVWRDdKMi9tNVlzPVwifVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjZm5fcGFyc2UgZnJvbSAnQGF3cy1jZGsvY29yZS9saWIvaGVscGVycy1pbnRlcm5hbCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUHVibGljUmVwb3NpdG9yeWBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1YmxpY3JlcG9zaXRvcnkuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblB1YmxpY1JlcG9zaXRvcnlQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGV0YWlscyBhYm91dCB0aGUgcmVwb3NpdG9yeSB0aGF0IGFyZSBwdWJsaWNseSB2aXNpYmxlIGluIHRoZSBBbWF6b24gRUNSIFB1YmxpYyBHYWxsZXJ5LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBbWF6b24gRUNSIFB1YmxpYyByZXBvc2l0b3J5IGNhdGFsb2cgZGF0YV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvcHVibGljL3B1YmxpYy1yZXBvc2l0b3J5LWNhdGFsb2ctZGF0YS5odG1sKSBpbiB0aGUgKkFtYXpvbiBFQ1IgUHVibGljIFVzZXIgR3VpZGUqIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1wdWJsaWNyZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlcG9zaXRvcnlDYXRhbG9nRGF0YT86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIHRvIHVzZSBmb3IgdGhlIHB1YmxpYyByZXBvc2l0b3J5LiBUaGUgcmVwb3NpdG9yeSBuYW1lIG1heSBiZSBzcGVjaWZpZWQgb24gaXRzIG93biAoc3VjaCBhcyBgbmdpbngtd2ViLWFwcGAgKSBvciBpdCBjYW4gYmUgcHJlcGVuZGVkIHdpdGggYSBuYW1lc3BhY2UgdG8gZ3JvdXAgdGhlIHJlcG9zaXRvcnkgaW50byBhIGNhdGVnb3J5IChzdWNoIGFzIGBwcm9qZWN0LWEvbmdpbngtd2ViLWFwcGAgKS4gSWYgeW91IGRvbid0IHNwZWNpZnkgYSBuYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSUQgZm9yIHRoZSByZXBvc2l0b3J5IG5hbWUuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW05hbWUgVHlwZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbmFtZS5odG1sKSAuXG4gICAgICpcbiAgICAgKiA+IElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IGNhbm5vdCBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIHJlcGxhY2VtZW50IG9mIHRoaXMgcmVzb3VyY2UuIFlvdSBjYW4gcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZSBubyBvciBzb21lIGludGVycnVwdGlvbi4gSWYgeW91IG11c3QgcmVwbGFjZSB0aGUgcmVzb3VyY2UsIHNwZWNpZnkgYSBuZXcgbmFtZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1wdWJsaWNyZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnluYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSlNPTiByZXBvc2l0b3J5IHBvbGljeSB0ZXh0IHRvIGFwcGx5IHRvIHRoZSBwdWJsaWMgcmVwb3NpdG9yeS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQW1hem9uIEVDUiBQdWJsaWMgcmVwb3NpdG9yeSBwb2xpY2llc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvcHVibGljL3B1YmxpYy1yZXBvc2l0b3J5LXBvbGljaWVzLmh0bWwpIGluIHRoZSAqQW1hem9uIEVDUiBQdWJsaWMgVXNlciBHdWlkZSogLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1YmxpY3JlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeXBvbGljeXRleHRcbiAgICAgKi9cbiAgICByZWFkb25seSByZXBvc2l0b3J5UG9saWN5VGV4dD86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1YmxpY3JlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXB1YmxpY3JlcG9zaXRvcnktdGFnc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHRhZ3M/OiBjZGsuQ2ZuVGFnW107XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUHVibGljUmVwb3NpdG9yeVByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUHVibGljUmVwb3NpdG9yeVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVwb3NpdG9yeUNhdGFsb2dEYXRhJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnJlcG9zaXRvcnlDYXRhbG9nRGF0YSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVwb3NpdG9yeU5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucmVwb3NpdG9yeU5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlcG9zaXRvcnlQb2xpY3lUZXh0JywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnJlcG9zaXRvcnlQb2xpY3lUZXh0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblB1YmxpY1JlcG9zaXRvcnlQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpQdWJsaWNSZXBvc2l0b3J5YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UHVibGljUmVwb3NpdG9yeWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblB1YmxpY1JlcG9zaXRvcnlQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVwb3NpdG9yeUNhdGFsb2dEYXRhOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlcG9zaXRvcnlDYXRhbG9nRGF0YSksXG4gICAgICAgIFJlcG9zaXRvcnlOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlcG9zaXRvcnlOYW1lKSxcbiAgICAgICAgUmVwb3NpdG9yeVBvbGljeVRleHQ6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVwb3NpdG9yeVBvbGljeVRleHQpLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUHVibGljUmVwb3NpdG9yeVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUHVibGljUmVwb3NpdG9yeVByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXBvc2l0b3J5Q2F0YWxvZ0RhdGEnLCAnUmVwb3NpdG9yeUNhdGFsb2dEYXRhJywgcHJvcGVydGllcy5SZXBvc2l0b3J5Q2F0YWxvZ0RhdGEgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QW55KHByb3BlcnRpZXMuUmVwb3NpdG9yeUNhdGFsb2dEYXRhKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXBvc2l0b3J5TmFtZScsICdSZXBvc2l0b3J5TmFtZScsIHByb3BlcnRpZXMuUmVwb3NpdG9yeU5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVwb3NpdG9yeU5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JlcG9zaXRvcnlQb2xpY3lUZXh0JywgJ1JlcG9zaXRvcnlQb2xpY3lUZXh0JywgcHJvcGVydGllcy5SZXBvc2l0b3J5UG9saWN5VGV4dCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBbnkocHJvcGVydGllcy5SZXBvc2l0b3J5UG9saWN5VGV4dCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFncycsICdUYWdzJywgcHJvcGVydGllcy5UYWdzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Q2ZuVGFnKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpFQ1I6OlB1YmxpY1JlcG9zaXRvcnlgXG4gKlxuICogVGhlIGBBV1M6OkVDUjo6UHVibGljUmVwb3NpdG9yeWAgcmVzb3VyY2Ugc3BlY2lmaWVzIGFuIEFtYXpvbiBFbGFzdGljIENvbnRhaW5lciBSZWdpc3RyeSBQdWJsaWMgKEFtYXpvbiBFQ1IgUHVibGljKSByZXBvc2l0b3J5LCB3aGVyZSB1c2VycyBjYW4gcHVzaCBhbmQgcHVsbCBEb2NrZXIgaW1hZ2VzLCBPcGVuIENvbnRhaW5lciBJbml0aWF0aXZlIChPQ0kpIGltYWdlcywgYW5kIE9DSSBjb21wYXRpYmxlIGFydGlmYWN0cy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQW1hem9uIEVDUiBwdWJsaWMgcmVwb3NpdG9yaWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC9wdWJsaWMvcHVibGljLXJlcG9zaXRvcmllcy5odG1sKSBpbiB0aGUgKkFtYXpvbiBFQ1IgUHVibGljIFVzZXIgR3VpZGUqIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkVDUjo6UHVibGljUmVwb3NpdG9yeVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1wdWJsaWNyZXBvc2l0b3J5Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblB1YmxpY1JlcG9zaXRvcnkgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpFQ1I6OlB1YmxpY1JlcG9zaXRvcnlcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5QdWJsaWNSZXBvc2l0b3J5IHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblB1YmxpY1JlcG9zaXRvcnkoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgZm9yIHRoZSBzcGVjaWZpZWQgYEFXUzo6RUNSOjpQdWJsaWNSZXBvc2l0b3J5YCByZXNvdXJjZS4gRm9yIGV4YW1wbGUsIGBhcm46YXdzOmVjci1wdWJsaWM6OiAqMTIzNDU2Nzg5MDEyKiA6cmVwb3NpdG9yeS8gKnRlc3QtcmVwb3NpdG9yeSpgIC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZXRhaWxzIGFib3V0IHRoZSByZXBvc2l0b3J5IHRoYXQgYXJlIHB1YmxpY2x5IHZpc2libGUgaW4gdGhlIEFtYXpvbiBFQ1IgUHVibGljIEdhbGxlcnkuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1IgUHVibGljIHJlcG9zaXRvcnkgY2F0YWxvZyBkYXRhXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC9wdWJsaWMvcHVibGljLXJlcG9zaXRvcnktY2F0YWxvZy1kYXRhLmh0bWwpIGluIHRoZSAqQW1hem9uIEVDUiBQdWJsaWMgVXNlciBHdWlkZSogLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1YmxpY3JlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeWNhdGFsb2dkYXRhXG4gICAgICovXG4gICAgcHVibGljIHJlcG9zaXRvcnlDYXRhbG9nRGF0YTogYW55IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgdG8gdXNlIGZvciB0aGUgcHVibGljIHJlcG9zaXRvcnkuIFRoZSByZXBvc2l0b3J5IG5hbWUgbWF5IGJlIHNwZWNpZmllZCBvbiBpdHMgb3duIChzdWNoIGFzIGBuZ2lueC13ZWItYXBwYCApIG9yIGl0IGNhbiBiZSBwcmVwZW5kZWQgd2l0aCBhIG5hbWVzcGFjZSB0byBncm91cCB0aGUgcmVwb3NpdG9yeSBpbnRvIGEgY2F0ZWdvcnkgKHN1Y2ggYXMgYHByb2plY3QtYS9uZ2lueC13ZWItYXBwYCApLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIHJlcG9zaXRvcnkgbmFtZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbTmFtZSBUeXBlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1uYW1lLmh0bWwpIC5cbiAgICAgKlxuICAgICAqID4gSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgY2Fubm90IHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgcmVwbGFjZW1lbnQgb2YgdGhpcyByZXNvdXJjZS4gWW91IGNhbiBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIG5vIG9yIHNvbWUgaW50ZXJydXB0aW9uLiBJZiB5b3UgbXVzdCByZXBsYWNlIHRoZSByZXNvdXJjZSwgc3BlY2lmeSBhIG5ldyBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1YmxpY3JlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVwb3NpdG9yeU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBKU09OIHJlcG9zaXRvcnkgcG9saWN5IHRleHQgdG8gYXBwbHkgdG8gdGhlIHB1YmxpYyByZXBvc2l0b3J5LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBbWF6b24gRUNSIFB1YmxpYyByZXBvc2l0b3J5IHBvbGljaWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC9wdWJsaWMvcHVibGljLXJlcG9zaXRvcnktcG9saWNpZXMuaHRtbCkgaW4gdGhlICpBbWF6b24gRUNSIFB1YmxpYyBVc2VyIEd1aWRlKiAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVibGljcmVwb3NpdG9yeS5odG1sI2Nmbi1lY3ItcHVibGljcmVwb3NpdG9yeS1yZXBvc2l0b3J5cG9saWN5dGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyByZXBvc2l0b3J5UG9saWN5VGV4dDogYW55IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzIHRvIGFwcGx5IHRvIHRoaXMgcmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVibGljcmVwb3NpdG9yeS5odG1sI2Nmbi1lY3ItcHVibGljcmVwb3NpdG9yeS10YWdzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkVDUjo6UHVibGljUmVwb3NpdG9yeWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblB1YmxpY1JlcG9zaXRvcnlQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5QdWJsaWNSZXBvc2l0b3J5LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICB0aGlzLmF0dHJBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0FybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5yZXBvc2l0b3J5Q2F0YWxvZ0RhdGEgPSBwcm9wcy5yZXBvc2l0b3J5Q2F0YWxvZ0RhdGE7XG4gICAgICAgIHRoaXMucmVwb3NpdG9yeU5hbWUgPSBwcm9wcy5yZXBvc2l0b3J5TmFtZTtcbiAgICAgICAgdGhpcy5yZXBvc2l0b3J5UG9saWN5VGV4dCA9IHByb3BzLnJlcG9zaXRvcnlQb2xpY3lUZXh0O1xuICAgICAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuU1RBTkRBUkQsIFwiQVdTOjpFQ1I6OlB1YmxpY1JlcG9zaXRvcnlcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblB1YmxpY1JlcG9zaXRvcnkuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcG9zaXRvcnlDYXRhbG9nRGF0YTogdGhpcy5yZXBvc2l0b3J5Q2F0YWxvZ0RhdGEsXG4gICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogdGhpcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgICAgIHJlcG9zaXRvcnlQb2xpY3lUZXh0OiB0aGlzLnJlcG9zaXRvcnlQb2xpY3lUZXh0LFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLnJlbmRlclRhZ3MoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5QdWJsaWNSZXBvc2l0b3J5UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUHVibGljUmVwb3NpdG9yeSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuUHVibGljUmVwb3NpdG9yeS5SZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eS5BYm91dFRleHRgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeWNhdGFsb2dkYXRhLmh0bWwjY2ZuLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS1hYm91dHRleHRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGFib3V0VGV4dD86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5QdWJsaWNSZXBvc2l0b3J5LlJlcG9zaXRvcnlDYXRhbG9nRGF0YVByb3BlcnR5LkFyY2hpdGVjdHVyZXNgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeWNhdGFsb2dkYXRhLmh0bWwjY2ZuLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS1hcmNoaXRlY3R1cmVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhcmNoaXRlY3R1cmVzPzogc3RyaW5nW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuUHVibGljUmVwb3NpdG9yeS5SZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eS5PcGVyYXRpbmdTeXN0ZW1zYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS5odG1sI2Nmbi1lY3ItcHVibGljcmVwb3NpdG9yeS1yZXBvc2l0b3J5Y2F0YWxvZ2RhdGEtb3BlcmF0aW5nc3lzdGVtc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgb3BlcmF0aW5nU3lzdGVtcz86IHN0cmluZ1tdO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblB1YmxpY1JlcG9zaXRvcnkuUmVwb3NpdG9yeUNhdGFsb2dEYXRhUHJvcGVydHkuUmVwb3NpdG9yeURlc2NyaXB0aW9uYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS5odG1sI2Nmbi1lY3ItcHVibGljcmVwb3NpdG9yeS1yZXBvc2l0b3J5Y2F0YWxvZ2RhdGEtcmVwb3NpdG9yeWRlc2NyaXB0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZXBvc2l0b3J5RGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuUHVibGljUmVwb3NpdG9yeS5SZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eS5Vc2FnZVRleHRgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXB1YmxpY3JlcG9zaXRvcnktcmVwb3NpdG9yeWNhdGFsb2dkYXRhLmh0bWwjY2ZuLWVjci1wdWJsaWNyZXBvc2l0b3J5LXJlcG9zaXRvcnljYXRhbG9nZGF0YS11c2FnZXRleHRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHVzYWdlVGV4dD86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUmVwb3NpdG9yeUNhdGFsb2dEYXRhUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlcG9zaXRvcnlDYXRhbG9nRGF0YVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblB1YmxpY1JlcG9zaXRvcnlfUmVwb3NpdG9yeUNhdGFsb2dEYXRhUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhYm91dFRleHQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYWJvdXRUZXh0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcmNoaXRlY3R1cmVzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5hcmNoaXRlY3R1cmVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdvcGVyYXRpbmdTeXN0ZW1zJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5vcGVyYXRpbmdTeXN0ZW1zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXBvc2l0b3J5RGVzY3JpcHRpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucmVwb3NpdG9yeURlc2NyaXB0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd1c2FnZVRleHQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudXNhZ2VUZXh0KSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJlcG9zaXRvcnlDYXRhbG9nRGF0YVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlB1YmxpY1JlcG9zaXRvcnkuUmVwb3NpdG9yeUNhdGFsb2dEYXRhYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpQdWJsaWNSZXBvc2l0b3J5LlJlcG9zaXRvcnlDYXRhbG9nRGF0YWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5QdWJsaWNSZXBvc2l0b3J5UmVwb3NpdG9yeUNhdGFsb2dEYXRhUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblB1YmxpY1JlcG9zaXRvcnlfUmVwb3NpdG9yeUNhdGFsb2dEYXRhUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEFib3V0VGV4dDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hYm91dFRleHQpLFxuICAgICAgICBBcmNoaXRlY3R1cmVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hcmNoaXRlY3R1cmVzKSxcbiAgICAgICAgT3BlcmF0aW5nU3lzdGVtczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMub3BlcmF0aW5nU3lzdGVtcyksXG4gICAgICAgIFJlcG9zaXRvcnlEZXNjcmlwdGlvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXBvc2l0b3J5RGVzY3JpcHRpb24pLFxuICAgICAgICBVc2FnZVRleHQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudXNhZ2VUZXh0KSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUHVibGljUmVwb3NpdG9yeVJlcG9zaXRvcnlDYXRhbG9nRGF0YVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUHVibGljUmVwb3NpdG9yeS5SZXBvc2l0b3J5Q2F0YWxvZ0RhdGFQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5QdWJsaWNSZXBvc2l0b3J5LlJlcG9zaXRvcnlDYXRhbG9nRGF0YVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYWJvdXRUZXh0JywgJ0Fib3V0VGV4dCcsIHByb3BlcnRpZXMuQWJvdXRUZXh0ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFib3V0VGV4dCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXJjaGl0ZWN0dXJlcycsICdBcmNoaXRlY3R1cmVzJywgcHJvcGVydGllcy5BcmNoaXRlY3R1cmVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuQXJjaGl0ZWN0dXJlcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnb3BlcmF0aW5nU3lzdGVtcycsICdPcGVyYXRpbmdTeXN0ZW1zJywgcHJvcGVydGllcy5PcGVyYXRpbmdTeXN0ZW1zICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuT3BlcmF0aW5nU3lzdGVtcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVwb3NpdG9yeURlc2NyaXB0aW9uJywgJ1JlcG9zaXRvcnlEZXNjcmlwdGlvbicsIHByb3BlcnRpZXMuUmVwb3NpdG9yeURlc2NyaXB0aW9uICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJlcG9zaXRvcnlEZXNjcmlwdGlvbikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndXNhZ2VUZXh0JywgJ1VzYWdlVGV4dCcsIHByb3BlcnRpZXMuVXNhZ2VUZXh0ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlVzYWdlVGV4dCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVsbHRocm91Z2hjYWNoZXJ1bGUuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBFQ1IgcmVwb3NpdG9yeSBwcmVmaXggYXNzb2NpYXRlZCB3aXRoIHRoZSBwdWxsIHRocm91Z2ggY2FjaGUgcnVsZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1wdWxsdGhyb3VnaGNhY2hlcnVsZS5odG1sI2Nmbi1lY3ItcHVsbHRocm91Z2hjYWNoZXJ1bGUtZWNycmVwb3NpdG9yeXByZWZpeFxuICAgICAqL1xuICAgIHJlYWRvbmx5IGVjclJlcG9zaXRvcnlQcmVmaXg/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdXBzdHJlYW0gcmVnaXN0cnkgVVJMIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHVsbCB0aHJvdWdoIGNhY2hlIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVsbHRocm91Z2hjYWNoZXJ1bGUuaHRtbCNjZm4tZWNyLXB1bGx0aHJvdWdoY2FjaGVydWxlLXVwc3RyZWFtcmVnaXN0cnl1cmxcbiAgICAgKi9cbiAgICByZWFkb25seSB1cHN0cmVhbVJlZ2lzdHJ5VXJsPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGVQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2VjclJlcG9zaXRvcnlQcmVmaXgnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZWNyUmVwb3NpdG9yeVByZWZpeCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndXBzdHJlYW1SZWdpc3RyeVVybCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy51cHN0cmVhbVJlZ2lzdHJ5VXJsKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UHVsbFRocm91Z2hDYWNoZVJ1bGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UHVsbFRocm91Z2hDYWNoZVJ1bGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGVQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRWNyUmVwb3NpdG9yeVByZWZpeDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5lY3JSZXBvc2l0b3J5UHJlZml4KSxcbiAgICAgICAgVXBzdHJlYW1SZWdpc3RyeVVybDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy51cHN0cmVhbVJlZ2lzdHJ5VXJsKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGVQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdlY3JSZXBvc2l0b3J5UHJlZml4JywgJ0VjclJlcG9zaXRvcnlQcmVmaXgnLCBwcm9wZXJ0aWVzLkVjclJlcG9zaXRvcnlQcmVmaXggIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRWNyUmVwb3NpdG9yeVByZWZpeCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndXBzdHJlYW1SZWdpc3RyeVVybCcsICdVcHN0cmVhbVJlZ2lzdHJ5VXJsJywgcHJvcGVydGllcy5VcHN0cmVhbVJlZ2lzdHJ5VXJsICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlVwc3RyZWFtUmVnaXN0cnlVcmwpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkVDUjo6UHVsbFRocm91Z2hDYWNoZVJ1bGVgXG4gKlxuICogQ3JlYXRlcyBhIHB1bGwgdGhyb3VnaCBjYWNoZSBydWxlLiBBIHB1bGwgdGhyb3VnaCBjYWNoZSBydWxlIHByb3ZpZGVzIGEgd2F5IHRvIGNhY2hlIGltYWdlcyBmcm9tIGFuIGV4dGVybmFsIHB1YmxpYyByZWdpc3RyeSBpbiB5b3VyIEFtYXpvbiBFQ1IgcHJpdmF0ZSByZWdpc3RyeS5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkVDUjo6UHVsbFRocm91Z2hDYWNoZVJ1bGVcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVsbHRocm91Z2hjYWNoZXJ1bGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGUgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpFQ1I6OlB1bGxUaHJvdWdoQ2FjaGVSdWxlXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGUge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblB1bGxUaHJvdWdoQ2FjaGVSdWxlKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gRUNSIHJlcG9zaXRvcnkgcHJlZml4IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHVsbCB0aHJvdWdoIGNhY2hlIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcHVsbHRocm91Z2hjYWNoZXJ1bGUuaHRtbCNjZm4tZWNyLXB1bGx0aHJvdWdoY2FjaGVydWxlLWVjcnJlcG9zaXRvcnlwcmVmaXhcbiAgICAgKi9cbiAgICBwdWJsaWMgZWNyUmVwb3NpdG9yeVByZWZpeDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHVwc3RyZWFtIHJlZ2lzdHJ5IFVSTCBhc3NvY2lhdGVkIHdpdGggdGhlIHB1bGwgdGhyb3VnaCBjYWNoZSBydWxlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXB1bGx0aHJvdWdoY2FjaGVydWxlLmh0bWwjY2ZuLWVjci1wdWxsdGhyb3VnaGNhY2hlcnVsZS11cHN0cmVhbXJlZ2lzdHJ5dXJsXG4gICAgICovXG4gICAgcHVibGljIHVwc3RyZWFtUmVnaXN0cnlVcmw6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpFQ1I6OlB1bGxUaHJvdWdoQ2FjaGVSdWxlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGVQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5QdWxsVGhyb3VnaENhY2hlUnVsZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcblxuICAgICAgICB0aGlzLmVjclJlcG9zaXRvcnlQcmVmaXggPSBwcm9wcy5lY3JSZXBvc2l0b3J5UHJlZml4O1xuICAgICAgICB0aGlzLnVwc3RyZWFtUmVnaXN0cnlVcmwgPSBwcm9wcy51cHN0cmVhbVJlZ2lzdHJ5VXJsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUHVsbFRocm91Z2hDYWNoZVJ1bGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVjclJlcG9zaXRvcnlQcmVmaXg6IHRoaXMuZWNyUmVwb3NpdG9yeVByZWZpeCxcbiAgICAgICAgICAgIHVwc3RyZWFtUmVnaXN0cnlVcmw6IHRoaXMudXBzdHJlYW1SZWdpc3RyeVVybCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5QdWxsVGhyb3VnaENhY2hlUnVsZVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblJlZ2lzdHJ5UG9saWN5YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcmVnaXN0cnlwb2xpY3kuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJlZ2lzdHJ5UG9saWN5UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpTT04gcG9saWN5IHRleHQgZm9yIHlvdXIgcmVnaXN0cnkuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcmVnaXN0cnlwb2xpY3kuaHRtbCNjZm4tZWNyLXJlZ2lzdHJ5cG9saWN5LXBvbGljeXRleHRcbiAgICAgKi9cbiAgICByZWFkb25seSBwb2xpY3lUZXh0OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZWdpc3RyeVBvbGljeVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5VGV4dCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wb2xpY3lUZXh0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2xpY3lUZXh0JywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnBvbGljeVRleHQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpSZWdpc3RyeVBvbGljeWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpSZWdpc3RyeVBvbGljeWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZWdpc3RyeVBvbGljeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZWdpc3RyeVBvbGljeVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBQb2xpY3lUZXh0OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnBvbGljeVRleHQpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5SZWdpc3RyeVBvbGljeVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVnaXN0cnlQb2xpY3lQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVnaXN0cnlQb2xpY3lQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3BvbGljeVRleHQnLCAnUG9saWN5VGV4dCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QW55KHByb3BlcnRpZXMuUG9saWN5VGV4dCkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6RUNSOjpSZWdpc3RyeVBvbGljeWBcbiAqXG4gKiBUaGUgYEFXUzo6RUNSOjpSZWdpc3RyeVBvbGljeWAgcmVzb3VyY2UgY3JlYXRlcyBvciB1cGRhdGVzIHRoZSBwZXJtaXNzaW9ucyBwb2xpY3kgZm9yIGEgcHJpdmF0ZSByZWdpc3RyeS5cbiAqXG4gKiBBIHByaXZhdGUgcmVnaXN0cnkgcG9saWN5IGlzIHVzZWQgdG8gc3BlY2lmeSBwZXJtaXNzaW9ucyBmb3IgYW5vdGhlciBBV1MgYWNjb3VudCBhbmQgaXMgdXNlZCB3aGVuIGNvbmZpZ3VyaW5nIGNyb3NzLWFjY291bnQgcmVwbGljYXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1JlZ2lzdHJ5IHBlcm1pc3Npb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC91c2VyZ3VpZGUvcmVnaXN0cnktcGVybWlzc2lvbnMuaHRtbCkgaW4gdGhlICpBbWF6b24gRWxhc3RpYyBDb250YWluZXIgUmVnaXN0cnkgVXNlciBHdWlkZSogLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6RUNSOjpSZWdpc3RyeVBvbGljeVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZWdpc3RyeXBvbGljeS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SZWdpc3RyeVBvbGljeSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkVDUjo6UmVnaXN0cnlQb2xpY3lcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SZWdpc3RyeVBvbGljeSB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuUmVnaXN0cnlQb2xpY3koc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGFjY291bnQgSUQgb2YgdGhlIHByaXZhdGUgcmVnaXN0cnkgdGhlIHBvbGljeSBpcyBhc3NvY2lhdGVkIHdpdGguXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFJlZ2lzdHJ5SWRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0clJlZ2lzdHJ5SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBKU09OIHBvbGljeSB0ZXh0IGZvciB5b3VyIHJlZ2lzdHJ5LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlZ2lzdHJ5cG9saWN5Lmh0bWwjY2ZuLWVjci1yZWdpc3RyeXBvbGljeS1wb2xpY3l0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHBvbGljeVRleHQ6IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpFQ1I6OlJlZ2lzdHJ5UG9saWN5YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVnaXN0cnlQb2xpY3lQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVnaXN0cnlQb2xpY3kuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdwb2xpY3lUZXh0JywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0clJlZ2lzdHJ5SWQgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ1JlZ2lzdHJ5SWQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMucG9saWN5VGV4dCA9IHByb3BzLnBvbGljeVRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5SZWdpc3RyeVBvbGljeS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcG9saWN5VGV4dDogdGhpcy5wb2xpY3lUZXh0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblJlZ2lzdHJ5UG9saWN5UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcmVwbGljYXRpb25jb25maWd1cmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVwbGljYXRpb24gY29uZmlndXJhdGlvbiBmb3IgYSByZWdpc3RyeS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICByZWFkb25seSByZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb246IENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVwbGljYXRpb25Db25maWd1cmF0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24nLCBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25fUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVwbGljYXRpb25Db25maWd1cmF0aW9uKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVwbGljYXRpb25Db25maWd1cmF0aW9uOiBjZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24pLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JlcGxpY2F0aW9uQ29uZmlndXJhdGlvbicsICdSZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24nLCBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbikpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6RUNSOjpSZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25gXG4gKlxuICogVGhlIGBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uYCByZXNvdXJjZSBjcmVhdGVzIG9yIHVwZGF0ZXMgdGhlIHJlcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIGEgcHJpdmF0ZSByZWdpc3RyeS4gVGhlIGZpcnN0IHRpbWUgYSByZXBsaWNhdGlvbiBjb25maWd1cmF0aW9uIGlzIGFwcGxpZWQgdG8gYSBwcml2YXRlIHJlZ2lzdHJ5LCBhIHNlcnZpY2UtbGlua2VkIElBTSByb2xlIGlzIGNyZWF0ZWQgaW4geW91ciBhY2NvdW50IGZvciB0aGUgcmVwbGljYXRpb24gcHJvY2Vzcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVXNpbmcgU2VydmljZS1MaW5rZWQgUm9sZXMgZm9yIEFtYXpvbiBFQ1JdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1IvbGF0ZXN0L3VzZXJndWlkZS91c2luZy1zZXJ2aWNlLWxpbmtlZC1yb2xlcy5odG1sKSBpbiB0aGUgKkFtYXpvbiBFbGFzdGljIENvbnRhaW5lciBSZWdpc3RyeSBVc2VyIEd1aWRlKiAuXG4gKlxuICogPiBXaGVuIGNvbmZpZ3VyaW5nIGNyb3NzLWFjY291bnQgcmVwbGljYXRpb24sIHRoZSBkZXN0aW5hdGlvbiBhY2NvdW50IG11c3QgZ3JhbnQgdGhlIHNvdXJjZSBhY2NvdW50IHBlcm1pc3Npb24gdG8gcmVwbGljYXRlLiBUaGlzIHBlcm1pc3Npb24gaXMgY29udHJvbGxlZCB1c2luZyBhIHByaXZhdGUgcmVnaXN0cnkgcGVybWlzc2lvbnMgcG9saWN5LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGBBV1M6OkVDUjo6UmVnaXN0cnlQb2xpY3lgIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbiB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbihzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWNjb3VudCBJRCBvZiB0aGUgZGVzdGluYXRpb24gcmVnaXN0cnkuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFJlZ2lzdHJ5SWRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0clJlZ2lzdHJ5SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSByZXBsaWNhdGlvbiBjb25maWd1cmF0aW9uIGZvciBhIHJlZ2lzdHJ5LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi5odG1sI2Nmbi1lY3ItcmVwbGljYXRpb25jb25maWd1cmF0aW9uLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyByZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb246IENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24nLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyUmVnaXN0cnlJZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnUmVnaXN0cnlJZCcsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5yZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24gPSBwcm9wcy5yZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbjogdGhpcy5yZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uIHtcbiAgICAvKipcbiAgICAgKiBUaGUgcmVwbGljYXRpb24gY29uZmlndXJhdGlvbiBmb3IgYSByZWdpc3RyeS5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25jb25maWd1cmF0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIG9iamVjdHMgcmVwcmVzZW50aW5nIHRoZSByZXBsaWNhdGlvbiBkZXN0aW5hdGlvbnMgYW5kIHJlcG9zaXRvcnkgZmlsdGVycyBmb3IgYSByZXBsaWNhdGlvbiBjb25maWd1cmF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25jb25maWd1cmF0aW9uLmh0bWwjY2ZuLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25jb25maWd1cmF0aW9uLXJ1bGVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBydWxlczogQXJyYXk8Q2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uUnVsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbl9SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3J1bGVzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJ1bGVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydWxlcycsIGNkay5saXN0VmFsaWRhdG9yKENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbl9SZXBsaWNhdGlvblJ1bGVQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMucnVsZXMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uX1JlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBSdWxlczogY2RrLmxpc3RNYXBwZXIoY2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwbGljYXRpb25SdWxlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnJ1bGVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uUmVwbGljYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncnVsZXMnLCAnUnVsZXMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblJlcGxpY2F0aW9uUnVsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLlJ1bGVzKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uIHtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBvYmplY3RzIHJlcHJlc2VudGluZyB0aGUgZGVzdGluYXRpb24gZm9yIGEgcmVwbGljYXRpb24gcnVsZS5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25kZXN0aW5hdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBsaWNhdGlvbkRlc3RpbmF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIFJlZ2lvbiB0byByZXBsaWNhdGUgdG8uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi1yZXBsaWNhdGlvbmRlc3RpbmF0aW9uLmh0bWwjY2ZuLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25kZXN0aW5hdGlvbi1yZWdpb25cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJlZ2lvbjogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIEFXUyBhY2NvdW50IElEIG9mIHRoZSBBbWF6b24gRUNSIHByaXZhdGUgcmVnaXN0cnkgdG8gcmVwbGljYXRlIHRvLiBXaGVuIGNvbmZpZ3VyaW5nIGNyb3NzLVJlZ2lvbiByZXBsaWNhdGlvbiB3aXRoaW4geW91ciBvd24gcmVnaXN0cnksIHNwZWNpZnkgeW91ciBvd24gYWNjb3VudCBJRC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lY3ItcmVwbGljYXRpb25jb25maWd1cmF0aW9uLXJlcGxpY2F0aW9uZGVzdGluYXRpb24uaHRtbCNjZm4tZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi1yZXBsaWNhdGlvbmRlc3RpbmF0aW9uLXJlZ2lzdHJ5aWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJlZ2lzdHJ5SWQ6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUmVwbGljYXRpb25EZXN0aW5hdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSZXBsaWNhdGlvbkRlc3RpbmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uX1JlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlZ2lvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yZWdpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlZ2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yZWdpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlZ2lzdHJ5SWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVnaXN0cnlJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVnaXN0cnlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yZWdpc3RyeUlkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpSZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uUmVwbGljYXRpb25EZXN0aW5hdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUmVwbGljYXRpb25EZXN0aW5hdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvbkRlc3RpbmF0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblJlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uX1JlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVnaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlZ2lvbiksXG4gICAgICAgIFJlZ2lzdHJ5SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVnaXN0cnlJZCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblJlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvbkRlc3RpbmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JlZ2lvbicsICdSZWdpb24nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJlZ2lvbikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVnaXN0cnlJZCcsICdSZWdpc3RyeUlkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5SZWdpc3RyeUlkKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uIHtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBvYmplY3RzIHJlcHJlc2VudGluZyB0aGUgcmVwbGljYXRpb24gZGVzdGluYXRpb25zIGFuZCByZXBvc2l0b3J5IGZpbHRlcnMgZm9yIGEgcmVwbGljYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25ydWxlLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlcGxpY2F0aW9uUnVsZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIG9iamVjdHMgcmVwcmVzZW50aW5nIHRoZSBkZXN0aW5hdGlvbiBmb3IgYSByZXBsaWNhdGlvbiBydWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25ydWxlLmh0bWwjY2ZuLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25ydWxlLWRlc3RpbmF0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGVzdGluYXRpb25zOiBBcnJheTxDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uUmVwbGljYXRpb25EZXN0aW5hdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIG9iamVjdHMgcmVwcmVzZW50aW5nIHRoZSBmaWx0ZXJzIGZvciBhIHJlcGxpY2F0aW9uIHJ1bGUuIFNwZWNpZnlpbmcgYSByZXBvc2l0b3J5IGZpbHRlciBmb3IgYSByZXBsaWNhdGlvbiBydWxlIHByb3ZpZGVzIGEgbWV0aG9kIGZvciBjb250cm9sbGluZyB3aGljaCByZXBvc2l0b3JpZXMgaW4gYSBwcml2YXRlIHJlZ2lzdHJ5IGFyZSByZXBsaWNhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25ydWxlLmh0bWwjY2ZuLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwbGljYXRpb25ydWxlLXJlcG9zaXRvcnlmaWx0ZXJzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZXBvc2l0b3J5RmlsdGVycz86IEFycmF5PENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBvc2l0b3J5RmlsdGVyUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBSZXBsaWNhdGlvblJ1bGVQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUmVwbGljYXRpb25SdWxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uX1JlcGxpY2F0aW9uUnVsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVzdGluYXRpb25zJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRlc3RpbmF0aW9ucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVzdGluYXRpb25zJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uX1JlcGxpY2F0aW9uRGVzdGluYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuZGVzdGluYXRpb25zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXBvc2l0b3J5RmlsdGVycycsIGNkay5saXN0VmFsaWRhdG9yKENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbl9SZXBvc2l0b3J5RmlsdGVyUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLnJlcG9zaXRvcnlGaWx0ZXJzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJlcGxpY2F0aW9uUnVsZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvblJ1bGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlcGxpY2F0aW9uUnVsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBsaWNhdGlvblJ1bGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwbGljYXRpb25SdWxlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbl9SZXBsaWNhdGlvblJ1bGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVzdGluYXRpb25zOiBjZGsubGlzdE1hcHBlcihjZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25SZXBsaWNhdGlvbkRlc3RpbmF0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmRlc3RpbmF0aW9ucyksXG4gICAgICAgIFJlcG9zaXRvcnlGaWx0ZXJzOiBjZGsubGlzdE1hcHBlcihjZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5RmlsdGVyUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnJlcG9zaXRvcnlGaWx0ZXJzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwbGljYXRpb25SdWxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uUmVwbGljYXRpb25SdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcGxpY2F0aW9uUnVsZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGVzdGluYXRpb25zJywgJ0Rlc3RpbmF0aW9ucycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwbGljYXRpb25EZXN0aW5hdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLkRlc3RpbmF0aW9ucykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVwb3NpdG9yeUZpbHRlcnMnLCAnUmVwb3NpdG9yeUZpbHRlcnMnLCBwcm9wZXJ0aWVzLlJlcG9zaXRvcnlGaWx0ZXJzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvblJlcG9zaXRvcnlGaWx0ZXJQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5SZXBvc2l0b3J5RmlsdGVycykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbiB7XG4gICAgLyoqXG4gICAgICogVGhlIGZpbHRlciBzZXR0aW5ncyB1c2VkIHdpdGggaW1hZ2UgcmVwbGljYXRpb24uIFNwZWNpZnlpbmcgYSByZXBvc2l0b3J5IGZpbHRlciB0byBhIHJlcGxpY2F0aW9uIHJ1bGUgcHJvdmlkZXMgYSBtZXRob2QgZm9yIGNvbnRyb2xsaW5nIHdoaWNoIHJlcG9zaXRvcmllcyBpbiBhIHByaXZhdGUgcmVnaXN0cnkgYXJlIHJlcGxpY2F0ZWQuIElmIG5vIHJlcG9zaXRvcnkgZmlsdGVyIGlzIHNwZWNpZmllZCwgYWxsIGltYWdlcyBpbiB0aGUgcmVwb3NpdG9yeSBhcmUgcmVwbGljYXRlZC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwb3NpdG9yeWZpbHRlci5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5RmlsdGVyUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlcG9zaXRvcnkgZmlsdGVyIGRldGFpbHMuIFdoZW4gdGhlIGBQUkVGSVhfTUFUQ0hgIGZpbHRlciB0eXBlIGlzIHNwZWNpZmllZCwgdGhpcyB2YWx1ZSBpcyByZXF1aXJlZCBhbmQgc2hvdWxkIGJlIHRoZSByZXBvc2l0b3J5IG5hbWUgcHJlZml4IHRvIGNvbmZpZ3VyZSByZXBsaWNhdGlvbiBmb3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcGxpY2F0aW9uY29uZmlndXJhdGlvbi1yZXBvc2l0b3J5ZmlsdGVyLmh0bWwjY2ZuLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwb3NpdG9yeWZpbHRlci1maWx0ZXJcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGZpbHRlcjogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlcG9zaXRvcnkgZmlsdGVyIHR5cGUuIFRoZSBvbmx5IHN1cHBvcnRlZCB2YWx1ZSBpcyBgUFJFRklYX01BVENIYCAsIHdoaWNoIGlzIGEgcmVwb3NpdG9yeSBuYW1lIHByZWZpeCBzcGVjaWZpZWQgd2l0aCB0aGUgYGZpbHRlcmAgcGFyYW1ldGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBsaWNhdGlvbmNvbmZpZ3VyYXRpb24tcmVwb3NpdG9yeWZpbHRlci5odG1sI2Nmbi1lY3ItcmVwbGljYXRpb25jb25maWd1cmF0aW9uLXJlcG9zaXRvcnlmaWx0ZXItZmlsdGVydHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZmlsdGVyVHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBSZXBvc2l0b3J5RmlsdGVyUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlcG9zaXRvcnlGaWx0ZXJQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25fUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmZpbHRlcikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmZpbHRlcikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyVHlwZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXJUeXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmZpbHRlclR5cGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbi5SZXBvc2l0b3J5RmlsdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSZXBvc2l0b3J5RmlsdGVyUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcG9zaXRvcnlGaWx0ZXJgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb25fUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBGaWx0ZXI6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyKSxcbiAgICAgICAgRmlsdGVyVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWx0ZXJUeXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVwbGljYXRpb25Db25maWd1cmF0aW9uLlJlcG9zaXRvcnlGaWx0ZXJQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXBsaWNhdGlvbkNvbmZpZ3VyYXRpb24uUmVwb3NpdG9yeUZpbHRlclByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmlsdGVyJywgJ0ZpbHRlcicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRmlsdGVyKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJUeXBlJywgJ0ZpbHRlclR5cGUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkZpbHRlclR5cGUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SZXBvc2l0b3J5YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3ItcmVwb3NpdG9yeS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVwb3NpdG9yeVByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSByZXBvc2l0b3J5LiBUaGlzIGRldGVybWluZXMgaG93IHRoZSBjb250ZW50cyBvZiB5b3VyIHJlcG9zaXRvcnkgYXJlIGVuY3J5cHRlZCBhdCByZXN0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBlbmNyeXB0aW9uQ29uZmlndXJhdGlvbj86IENmblJlcG9zaXRvcnkuRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbWFnZSBzY2FubmluZyBjb25maWd1cmF0aW9uIGZvciB0aGUgcmVwb3NpdG9yeS4gVGhpcyBkZXRlcm1pbmVzIHdoZXRoZXIgaW1hZ2VzIGFyZSBzY2FubmVkIGZvciBrbm93biB2dWxuZXJhYmlsaXRpZXMgYWZ0ZXIgYmVpbmcgcHVzaGVkIHRvIHRoZSByZXBvc2l0b3J5LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktaW1hZ2VzY2FubmluZ2NvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBpbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbj86IENmblJlcG9zaXRvcnkuSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0YWcgbXV0YWJpbGl0eSBzZXR0aW5nIGZvciB0aGUgcmVwb3NpdG9yeS4gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiBgTVVUQUJMRWAgd2lsbCBiZSB1c2VkIHdoaWNoIHdpbGwgYWxsb3cgaW1hZ2UgdGFncyB0byBiZSBvdmVyd3JpdHRlbi4gSWYgYElNTVVUQUJMRWAgaXMgc3BlY2lmaWVkLCBhbGwgaW1hZ2UgdGFncyB3aXRoaW4gdGhlIHJlcG9zaXRvcnkgd2lsbCBiZSBpbW11dGFibGUgd2hpY2ggd2lsbCBwcmV2ZW50IHRoZW0gZnJvbSBiZWluZyBvdmVyd3JpdHRlbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LWltYWdldGFnbXV0YWJpbGl0eVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGltYWdlVGFnTXV0YWJpbGl0eT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgb3IgdXBkYXRlcyBhIGxpZmVjeWNsZSBwb2xpY3kuIEZvciBpbmZvcm1hdGlvbiBhYm91dCBsaWZlY3ljbGUgcG9saWN5IHN5bnRheCwgc2VlIFtMaWZlY3ljbGUgcG9saWN5IHRlbXBsYXRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC91c2VyZ3VpZGUvTGlmZWN5Y2xlUG9saWNpZXMuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktbGlmZWN5Y2xlcG9saWN5XG4gICAgICovXG4gICAgcmVhZG9ubHkgbGlmZWN5Y2xlUG9saWN5PzogQ2ZuUmVwb3NpdG9yeS5MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIHRvIHVzZSBmb3IgdGhlIHJlcG9zaXRvcnkuIFRoZSByZXBvc2l0b3J5IG5hbWUgbWF5IGJlIHNwZWNpZmllZCBvbiBpdHMgb3duIChzdWNoIGFzIGBuZ2lueC13ZWItYXBwYCApIG9yIGl0IGNhbiBiZSBwcmVwZW5kZWQgd2l0aCBhIG5hbWVzcGFjZSB0byBncm91cCB0aGUgcmVwb3NpdG9yeSBpbnRvIGEgY2F0ZWdvcnkgKHN1Y2ggYXMgYHByb2plY3QtYS9uZ2lueC13ZWItYXBwYCApLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIHJlcG9zaXRvcnkgbmFtZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbTmFtZSB0eXBlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1uYW1lLmh0bWwpIC5cbiAgICAgKlxuICAgICAqID4gSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgY2Fubm90IHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgcmVwbGFjZW1lbnQgb2YgdGhpcyByZXNvdXJjZS4gWW91IGNhbiBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIG5vIG9yIHNvbWUgaW50ZXJydXB0aW9uLiBJZiB5b3UgbXVzdCByZXBsYWNlIHRoZSByZXNvdXJjZSwgc3BlY2lmeSBhIG5ldyBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktcmVwb3NpdG9yeW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSByZXBvc2l0b3J5TmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBKU09OIHJlcG9zaXRvcnkgcG9saWN5IHRleHQgdG8gYXBwbHkgdG8gdGhlIHJlcG9zaXRvcnkuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1IgcmVwb3NpdG9yeSBwb2xpY2llc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvdXNlcmd1aWRlL3JlcG9zaXRvcnktcG9saWN5LWV4YW1wbGVzLmh0bWwpIGluIHRoZSAqQW1hem9uIEVsYXN0aWMgQ29udGFpbmVyIFJlZ2lzdHJ5IFVzZXIgR3VpZGUqIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LXJlcG9zaXRvcnlwb2xpY3l0ZXh0XG4gICAgICovXG4gICAgcmVhZG9ubHkgcmVwb3NpdG9yeVBvbGljeVRleHQ/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYXBwbHkgdG8gdGhpcyByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblJlcG9zaXRvcnlQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVwb3NpdG9yeVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlcG9zaXRvcnlQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2VuY3J5cHRpb25Db25maWd1cmF0aW9uJywgQ2ZuUmVwb3NpdG9yeV9FbmNyeXB0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmVuY3J5cHRpb25Db25maWd1cmF0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbicsIENmblJlcG9zaXRvcnlfSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5pbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignaW1hZ2VUYWdNdXRhYmlsaXR5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmltYWdlVGFnTXV0YWJpbGl0eSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbGlmZWN5Y2xlUG9saWN5JywgQ2ZuUmVwb3NpdG9yeV9MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5saWZlY3ljbGVQb2xpY3kpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlcG9zaXRvcnlOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlcG9zaXRvcnlOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXBvc2l0b3J5UG9saWN5VGV4dCcsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yZXBvc2l0b3J5UG9saWN5VGV4dCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZUNmblRhZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5SZXBvc2l0b3J5UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwb3NpdG9yeWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVwb3NpdG9yeVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcG9zaXRvcnlgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVwb3NpdG9yeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXBvc2l0b3J5UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEVuY3J5cHRpb25Db25maWd1cmF0aW9uOiBjZm5SZXBvc2l0b3J5RW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5lbmNyeXB0aW9uQ29uZmlndXJhdGlvbiksXG4gICAgICAgIEltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uOiBjZm5SZXBvc2l0b3J5SW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5pbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbiksXG4gICAgICAgIEltYWdlVGFnTXV0YWJpbGl0eTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5pbWFnZVRhZ011dGFiaWxpdHkpLFxuICAgICAgICBMaWZlY3ljbGVQb2xpY3k6IGNmblJlcG9zaXRvcnlMaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5saWZlY3ljbGVQb2xpY3kpLFxuICAgICAgICBSZXBvc2l0b3J5TmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXBvc2l0b3J5TmFtZSksXG4gICAgICAgIFJlcG9zaXRvcnlQb2xpY3lUZXh0OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlcG9zaXRvcnlQb2xpY3lUZXh0KSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2RrLmNmblRhZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlcG9zaXRvcnlQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlcG9zaXRvcnlQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwb3NpdG9yeVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nLCAnRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nLCBwcm9wZXJ0aWVzLkVuY3J5cHRpb25Db25maWd1cmF0aW9uICE9IG51bGwgPyBDZm5SZXBvc2l0b3J5RW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkVuY3J5cHRpb25Db25maWd1cmF0aW9uKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdpbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbicsICdJbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbicsIHByb3BlcnRpZXMuSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb24gIT0gbnVsbCA/IENmblJlcG9zaXRvcnlJbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb24pIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ltYWdlVGFnTXV0YWJpbGl0eScsICdJbWFnZVRhZ011dGFiaWxpdHknLCBwcm9wZXJ0aWVzLkltYWdlVGFnTXV0YWJpbGl0eSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5JbWFnZVRhZ011dGFiaWxpdHkpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xpZmVjeWNsZVBvbGljeScsICdMaWZlY3ljbGVQb2xpY3knLCBwcm9wZXJ0aWVzLkxpZmVjeWNsZVBvbGljeSAhPSBudWxsID8gQ2ZuUmVwb3NpdG9yeUxpZmVjeWNsZVBvbGljeVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuTGlmZWN5Y2xlUG9saWN5KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXBvc2l0b3J5TmFtZScsICdSZXBvc2l0b3J5TmFtZScsIHByb3BlcnRpZXMuUmVwb3NpdG9yeU5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVwb3NpdG9yeU5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JlcG9zaXRvcnlQb2xpY3lUZXh0JywgJ1JlcG9zaXRvcnlQb2xpY3lUZXh0JywgcHJvcGVydGllcy5SZXBvc2l0b3J5UG9saWN5VGV4dCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBbnkocHJvcGVydGllcy5SZXBvc2l0b3J5UG9saWN5VGV4dCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFncycsICdUYWdzJywgcHJvcGVydGllcy5UYWdzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Q2ZuVGFnKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpFQ1I6OlJlcG9zaXRvcnlgXG4gKlxuICogVGhlIGBBV1M6OkVDUjo6UmVwb3NpdG9yeWAgcmVzb3VyY2Ugc3BlY2lmaWVzIGFuIEFtYXpvbiBFbGFzdGljIENvbnRhaW5lciBSZWdpc3RyeSAoQW1hem9uIEVDUikgcmVwb3NpdG9yeSwgd2hlcmUgdXNlcnMgY2FuIHB1c2ggYW5kIHB1bGwgRG9ja2VyIGltYWdlcywgT3BlbiBDb250YWluZXIgSW5pdGlhdGl2ZSAoT0NJKSBpbWFnZXMsIGFuZCBPQ0kgY29tcGF0aWJsZSBhcnRpZmFjdHMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1IgcHJpdmF0ZSByZXBvc2l0b3JpZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1IvbGF0ZXN0L3VzZXJndWlkZS9SZXBvc2l0b3JpZXMuaHRtbCkgaW4gdGhlICpBbWF6b24gRUNSIFVzZXIgR3VpZGUqIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkVDUjo6UmVwb3NpdG9yeVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblJlcG9zaXRvcnkgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpFQ1I6OlJlcG9zaXRvcnlcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SZXBvc2l0b3J5IHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5SZXBvc2l0b3J5UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJlcG9zaXRvcnkoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgZm9yIHRoZSBzcGVjaWZpZWQgYEFXUzo6RUNSOjpSZXBvc2l0b3J5YCByZXNvdXJjZS4gRm9yIGV4YW1wbGUsIGBhcm46YXdzOmVjcjogKmV1LXdlc3QtMSogOiAqMTIzNDU2Nzg5MDEyKiA6cmVwb3NpdG9yeS8gKnRlc3QtcmVwb3NpdG9yeSpgIC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIFVSSSBmb3IgdGhlIHNwZWNpZmllZCBgQVdTOjpFQ1I6OlJlcG9zaXRvcnlgIHJlc291cmNlLiBGb3IgZXhhbXBsZSwgYCoxMjM0NTY3ODkwMTIqIC5ka3IuZWNyLiAqdXMtd2VzdC0yKiAuYW1hem9uYXdzLmNvbS9yZXBvc2l0b3J5YCAuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFJlcG9zaXRvcnlVcmlcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0clJlcG9zaXRvcnlVcmk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSByZXBvc2l0b3J5LiBUaGlzIGRldGVybWluZXMgaG93IHRoZSBjb250ZW50cyBvZiB5b3VyIHJlcG9zaXRvcnkgYXJlIGVuY3J5cHRlZCBhdCByZXN0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZW5jcnlwdGlvbkNvbmZpZ3VyYXRpb246IENmblJlcG9zaXRvcnkuRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbWFnZSBzY2FubmluZyBjb25maWd1cmF0aW9uIGZvciB0aGUgcmVwb3NpdG9yeS4gVGhpcyBkZXRlcm1pbmVzIHdoZXRoZXIgaW1hZ2VzIGFyZSBzY2FubmVkIGZvciBrbm93biB2dWxuZXJhYmlsaXRpZXMgYWZ0ZXIgYmVpbmcgcHVzaGVkIHRvIHRoZSByZXBvc2l0b3J5LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktaW1hZ2VzY2FubmluZ2NvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgaW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb246IENmblJlcG9zaXRvcnkuSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0YWcgbXV0YWJpbGl0eSBzZXR0aW5nIGZvciB0aGUgcmVwb3NpdG9yeS4gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiBgTVVUQUJMRWAgd2lsbCBiZSB1c2VkIHdoaWNoIHdpbGwgYWxsb3cgaW1hZ2UgdGFncyB0byBiZSBvdmVyd3JpdHRlbi4gSWYgYElNTVVUQUJMRWAgaXMgc3BlY2lmaWVkLCBhbGwgaW1hZ2UgdGFncyB3aXRoaW4gdGhlIHJlcG9zaXRvcnkgd2lsbCBiZSBpbW11dGFibGUgd2hpY2ggd2lsbCBwcmV2ZW50IHRoZW0gZnJvbSBiZWluZyBvdmVyd3JpdHRlbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LWltYWdldGFnbXV0YWJpbGl0eVxuICAgICAqL1xuICAgIHB1YmxpYyBpbWFnZVRhZ011dGFiaWxpdHk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgb3IgdXBkYXRlcyBhIGxpZmVjeWNsZSBwb2xpY3kuIEZvciBpbmZvcm1hdGlvbiBhYm91dCBsaWZlY3ljbGUgcG9saWN5IHN5bnRheCwgc2VlIFtMaWZlY3ljbGUgcG9saWN5IHRlbXBsYXRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC91c2VyZ3VpZGUvTGlmZWN5Y2xlUG9saWNpZXMuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktbGlmZWN5Y2xlcG9saWN5XG4gICAgICovXG4gICAgcHVibGljIGxpZmVjeWNsZVBvbGljeTogQ2ZuUmVwb3NpdG9yeS5MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIHRvIHVzZSBmb3IgdGhlIHJlcG9zaXRvcnkuIFRoZSByZXBvc2l0b3J5IG5hbWUgbWF5IGJlIHNwZWNpZmllZCBvbiBpdHMgb3duIChzdWNoIGFzIGBuZ2lueC13ZWItYXBwYCApIG9yIGl0IGNhbiBiZSBwcmVwZW5kZWQgd2l0aCBhIG5hbWVzcGFjZSB0byBncm91cCB0aGUgcmVwb3NpdG9yeSBpbnRvIGEgY2F0ZWdvcnkgKHN1Y2ggYXMgYHByb2plY3QtYS9uZ2lueC13ZWItYXBwYCApLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIHJlcG9zaXRvcnkgbmFtZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbTmFtZSB0eXBlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1uYW1lLmh0bWwpIC5cbiAgICAgKlxuICAgICAqID4gSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgY2Fubm90IHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgcmVwbGFjZW1lbnQgb2YgdGhpcyByZXNvdXJjZS4gWW91IGNhbiBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIG5vIG9yIHNvbWUgaW50ZXJydXB0aW9uLiBJZiB5b3UgbXVzdCByZXBsYWNlIHRoZSByZXNvdXJjZSwgc3BlY2lmeSBhIG5ldyBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktcmVwb3NpdG9yeW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVwb3NpdG9yeU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBKU09OIHJlcG9zaXRvcnkgcG9saWN5IHRleHQgdG8gYXBwbHkgdG8gdGhlIHJlcG9zaXRvcnkuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1IgcmVwb3NpdG9yeSBwb2xpY2llc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvdXNlcmd1aWRlL3JlcG9zaXRvcnktcG9saWN5LWV4YW1wbGVzLmh0bWwpIGluIHRoZSAqQW1hem9uIEVsYXN0aWMgQ29udGFpbmVyIFJlZ2lzdHJ5IFVzZXIgR3VpZGUqIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LXJlcG9zaXRvcnlwb2xpY3l0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHJlcG9zaXRvcnlQb2xpY3lUZXh0OiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYXBwbHkgdG8gdGhpcyByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWVjci1yZXBvc2l0b3J5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LXRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6RUNSOjpSZXBvc2l0b3J5YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVwb3NpdG9yeVByb3BzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblJlcG9zaXRvcnkuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyUmVwb3NpdG9yeVVyaSA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnUmVwb3NpdG9yeVVyaScsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5lbmNyeXB0aW9uQ29uZmlndXJhdGlvbiA9IHByb3BzLmVuY3J5cHRpb25Db25maWd1cmF0aW9uO1xuICAgICAgICB0aGlzLmltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uID0gcHJvcHMuaW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb247XG4gICAgICAgIHRoaXMuaW1hZ2VUYWdNdXRhYmlsaXR5ID0gcHJvcHMuaW1hZ2VUYWdNdXRhYmlsaXR5O1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVBvbGljeSA9IHByb3BzLmxpZmVjeWNsZVBvbGljeTtcbiAgICAgICAgdGhpcy5yZXBvc2l0b3J5TmFtZSA9IHByb3BzLnJlcG9zaXRvcnlOYW1lO1xuICAgICAgICB0aGlzLnJlcG9zaXRvcnlQb2xpY3lUZXh0ID0gcHJvcHMucmVwb3NpdG9yeVBvbGljeVRleHQ7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OkVDUjo6UmVwb3NpdG9yeVwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUmVwb3NpdG9yeS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW5jcnlwdGlvbkNvbmZpZ3VyYXRpb246IHRoaXMuZW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICBpbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbjogdGhpcy5pbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgIGltYWdlVGFnTXV0YWJpbGl0eTogdGhpcy5pbWFnZVRhZ011dGFiaWxpdHksXG4gICAgICAgICAgICBsaWZlY3ljbGVQb2xpY3k6IHRoaXMubGlmZWN5Y2xlUG9saWN5LFxuICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6IHRoaXMucmVwb3NpdG9yeU5hbWUsXG4gICAgICAgICAgICByZXBvc2l0b3J5UG9saWN5VGV4dDogdGhpcy5yZXBvc2l0b3J5UG9saWN5VGV4dCxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuUmVwb3NpdG9yeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlcG9zaXRvcnkge1xuICAgIC8qKlxuICAgICAqIFRoZSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSByZXBvc2l0b3J5LiBUaGlzIGRldGVybWluZXMgaG93IHRoZSBjb250ZW50cyBvZiB5b3VyIHJlcG9zaXRvcnkgYXJlIGVuY3J5cHRlZCBhdCByZXN0LlxuICAgICAqXG4gICAgICogQnkgZGVmYXVsdCwgd2hlbiBubyBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gaXMgc2V0IG9yIHRoZSBgQUVTMjU2YCBlbmNyeXB0aW9uIHR5cGUgaXMgdXNlZCwgQW1hem9uIEVDUiB1c2VzIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBBbWF6b24gUzMtbWFuYWdlZCBlbmNyeXB0aW9uIGtleXMgd2hpY2ggZW5jcnlwdHMgeW91ciBkYXRhIGF0IHJlc3QgdXNpbmcgYW4gQUVTLTI1NiBlbmNyeXB0aW9uIGFsZ29yaXRobS4gVGhpcyBkb2VzIG5vdCByZXF1aXJlIGFueSBhY3Rpb24gb24geW91ciBwYXJ0LlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgY29udHJvbCBvdmVyIHRoZSBlbmNyeXB0aW9uIG9mIHRoZSBjb250ZW50cyBvZiB5b3VyIHJlcG9zaXRvcnksIHlvdSBjYW4gdXNlIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSBrZXkgc3RvcmVkIGluIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlICggQVdTIEtNUyApIHRvIGVuY3J5cHQgeW91ciBpbWFnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1IgZW5jcnlwdGlvbiBhdCByZXN0XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC91c2VyZ3VpZGUvZW5jcnlwdGlvbi1hdC1yZXN0Lmh0bWwpIGluIHRoZSAqQW1hem9uIEVsYXN0aWMgQ29udGFpbmVyIFJlZ2lzdHJ5IFVzZXIgR3VpZGUqIC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjci1yZXBvc2l0b3J5LWVuY3J5cHRpb25jb25maWd1cmF0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEVuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGVuY3J5cHRpb24gdHlwZSB0byB1c2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHlvdSB1c2UgdGhlIGBLTVNgIGVuY3J5cHRpb24gdHlwZSwgdGhlIGNvbnRlbnRzIG9mIHRoZSByZXBvc2l0b3J5IHdpbGwgYmUgZW5jcnlwdGVkIHVzaW5nIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSBrZXkgc3RvcmVkIGluIEFXUyBLTVMgLiBXaGVuIHlvdSB1c2UgQVdTIEtNUyB0byBlbmNyeXB0IHlvdXIgZGF0YSwgeW91IGNhbiBlaXRoZXIgdXNlIHRoZSBkZWZhdWx0IEFXUyBtYW5hZ2VkIEFXUyBLTVMga2V5IGZvciBBbWF6b24gRUNSLCBvciBzcGVjaWZ5IHlvdXIgb3duIEFXUyBLTVMga2V5LCB3aGljaCB5b3UgYWxyZWFkeSBjcmVhdGVkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtQcm90ZWN0aW5nIGRhdGEgdXNpbmcgc2VydmVyLXNpZGUgZW5jcnlwdGlvbiB3aXRoIGFuIEFXUyBLTVMga2V5IHN0b3JlZCBpbiBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSAoU1NFLUtNUyldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L1VzaW5nS01TRW5jcnlwdGlvbi5odG1sKSBpbiB0aGUgKkFtYXpvbiBTaW1wbGUgU3RvcmFnZSBTZXJ2aWNlIENvbnNvbGUgRGV2ZWxvcGVyIEd1aWRlKiAuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHlvdSB1c2UgdGhlIGBBRVMyNTZgIGVuY3J5cHRpb24gdHlwZSwgQW1hem9uIEVDUiB1c2VzIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBBbWF6b24gUzMtbWFuYWdlZCBlbmNyeXB0aW9uIGtleXMgd2hpY2ggZW5jcnlwdHMgdGhlIGltYWdlcyBpbiB0aGUgcmVwb3NpdG9yeSB1c2luZyBhbiBBRVMtMjU2IGVuY3J5cHRpb24gYWxnb3JpdGhtLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtQcm90ZWN0aW5nIGRhdGEgdXNpbmcgc2VydmVyLXNpZGUgZW5jcnlwdGlvbiB3aXRoIEFtYXpvbiBTMy1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5cyAoU1NFLVMzKV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdTZXJ2ZXJTaWRlRW5jcnlwdGlvbi5odG1sKSBpbiB0aGUgKkFtYXpvbiBTaW1wbGUgU3RvcmFnZSBTZXJ2aWNlIENvbnNvbGUgRGV2ZWxvcGVyIEd1aWRlKiAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb24tZW5jcnlwdGlvbnR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGVuY3J5cHRpb25UeXBlOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB5b3UgdXNlIHRoZSBgS01TYCBlbmNyeXB0aW9uIHR5cGUsIHNwZWNpZnkgdGhlIEFXUyBLTVMga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGlvbi4gVGhlIGFsaWFzLCBrZXkgSUQsIG9yIGZ1bGwgQVJOIG9mIHRoZSBBV1MgS01TIGtleSBjYW4gYmUgc3BlY2lmaWVkLiBUaGUga2V5IG11c3QgZXhpc3QgaW4gdGhlIHNhbWUgUmVnaW9uIGFzIHRoZSByZXBvc2l0b3J5LiBJZiBubyBrZXkgaXMgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBBV1MgbWFuYWdlZCBBV1MgS01TIGtleSBmb3IgQW1hem9uIEVDUiB3aWxsIGJlIHVzZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktZW5jcnlwdGlvbmNvbmZpZ3VyYXRpb24ta21za2V5XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBrbXNLZXk/OiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEVuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEVuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwb3NpdG9yeV9FbmNyeXB0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZW5jcnlwdGlvblR5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZW5jcnlwdGlvblR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2VuY3J5cHRpb25UeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmVuY3J5cHRpb25UeXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrbXNLZXknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMua21zS2V5KSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkVuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwb3NpdG9yeS5FbmNyeXB0aW9uQ29uZmlndXJhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpSZXBvc2l0b3J5LkVuY3J5cHRpb25Db25maWd1cmF0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlcG9zaXRvcnlFbmNyeXB0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXBvc2l0b3J5X0VuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEVuY3J5cHRpb25UeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmVuY3J5cHRpb25UeXBlKSxcbiAgICAgICAgS21zS2V5OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmttc0tleSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlcG9zaXRvcnlFbmNyeXB0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVwb3NpdG9yeS5FbmNyeXB0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJlcG9zaXRvcnkuRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb25Qcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2VuY3J5cHRpb25UeXBlJywgJ0VuY3J5cHRpb25UeXBlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5FbmNyeXB0aW9uVHlwZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgna21zS2V5JywgJ0ttc0tleScsIHByb3BlcnRpZXMuS21zS2V5ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkttc0tleSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlcG9zaXRvcnkge1xuICAgIC8qKlxuICAgICAqIFRoZSBpbWFnZSBzY2FubmluZyBjb25maWd1cmF0aW9uIGZvciBhIHJlcG9zaXRvcnkuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lY3ItcmVwb3NpdG9yeS1pbWFnZXNjYW5uaW5nY29uZmlndXJhdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZXR0aW5nIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIGltYWdlcyBhcmUgc2Nhbm5lZCBhZnRlciBiZWluZyBwdXNoZWQgdG8gYSByZXBvc2l0b3J5LiBJZiBzZXQgdG8gYHRydWVgICwgaW1hZ2VzIHdpbGwgYmUgc2Nhbm5lZCBhZnRlciBiZWluZyBwdXNoZWQuIElmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBzcGVjaWZpZWQsIGl0IHdpbGwgZGVmYXVsdCB0byBgZmFsc2VgIGFuZCBpbWFnZXMgd2lsbCBub3QgYmUgc2Nhbm5lZCB1bmxlc3MgYSBzY2FuIGlzIG1hbnVhbGx5IHN0YXJ0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktaW1hZ2VzY2FubmluZ2NvbmZpZ3VyYXRpb24uaHRtbCNjZm4tZWNyLXJlcG9zaXRvcnktaW1hZ2VzY2FubmluZ2NvbmZpZ3VyYXRpb24tc2Nhbm9ucHVzaFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgc2Nhbk9uUHVzaD86IGJvb2xlYW4gfCBjZGsuSVJlc29sdmFibGU7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwb3NpdG9yeV9JbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2Nhbk9uUHVzaCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMuc2Nhbk9uUHVzaCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJJbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcG9zaXRvcnkuSW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkVDUjo6UmVwb3NpdG9yeS5JbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZXBvc2l0b3J5SW1hZ2VTY2FubmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVwb3NpdG9yeV9JbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBTY2FuT25QdXNoOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zY2FuT25QdXNoKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVwb3NpdG9yeUltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXBvc2l0b3J5LkltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwb3NpdG9yeS5JbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvblByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnc2Nhbk9uUHVzaCcsICdTY2FuT25QdXNoJywgcHJvcGVydGllcy5TY2FuT25QdXNoICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocHJvcGVydGllcy5TY2FuT25QdXNoKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVwb3NpdG9yeSB7XG4gICAgLyoqXG4gICAgICogVGhlIGBMaWZlY3ljbGVQb2xpY3lgIHByb3BlcnR5IHR5cGUgc3BlY2lmaWVzIGEgbGlmZWN5Y2xlIHBvbGljeS4gRm9yIGluZm9ybWF0aW9uIGFib3V0IGxpZmVjeWNsZSBwb2xpY3kgc3ludGF4LCBzZWUgW0xpZmVjeWNsZSBwb2xpY3kgdGVtcGxhdGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1IvbGF0ZXN0L3VzZXJndWlkZS9MaWZlY3ljbGVQb2xpY2llcy5odG1sKSBpbiB0aGUgKkFtYXpvbiBFQ1IgVXNlciBHdWlkZSogLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktbGlmZWN5Y2xlcG9saWN5Lmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIExpZmVjeWNsZVBvbGljeVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBKU09OIHJlcG9zaXRvcnkgcG9saWN5IHRleHQgdG8gYXBwbHkgdG8gdGhlIHJlcG9zaXRvcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktbGlmZWN5Y2xlcG9saWN5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LWxpZmVjeWNsZXBvbGljeS1saWZlY3ljbGVwb2xpY3l0ZXh0XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBsaWZlY3ljbGVQb2xpY3lUZXh0Pzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIEFXUyBhY2NvdW50IElEIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVnaXN0cnkgdGhhdCBjb250YWlucyB0aGUgcmVwb3NpdG9yeS4gSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGEgcmVnaXN0cnksIHRoZSBkZWZhdWx0IHJlZ2lzdHJ5IGlzIGFzc3VtZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNyLXJlcG9zaXRvcnktbGlmZWN5Y2xlcG9saWN5Lmh0bWwjY2ZuLWVjci1yZXBvc2l0b3J5LWxpZmVjeWNsZXBvbGljeS1yZWdpc3RyeWlkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZWdpc3RyeUlkPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBMaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgTGlmZWN5Y2xlUG9saWN5UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVwb3NpdG9yeV9MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xpZmVjeWNsZVBvbGljeVRleHQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubGlmZWN5Y2xlUG9saWN5VGV4dCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVnaXN0cnlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yZWdpc3RyeUlkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkxpZmVjeWNsZVBvbGljeVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpFQ1I6OlJlcG9zaXRvcnkuTGlmZWN5Y2xlUG9saWN5YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBMaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RUNSOjpSZXBvc2l0b3J5LkxpZmVjeWNsZVBvbGljeWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZXBvc2l0b3J5TGlmZWN5Y2xlUG9saWN5UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlcG9zaXRvcnlfTGlmZWN5Y2xlUG9saWN5UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIExpZmVjeWNsZVBvbGljeVRleHQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubGlmZWN5Y2xlUG9saWN5VGV4dCksXG4gICAgICAgIFJlZ2lzdHJ5SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVnaXN0cnlJZCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlcG9zaXRvcnlMaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlcG9zaXRvcnkuTGlmZWN5Y2xlUG9saWN5UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVwb3NpdG9yeS5MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xpZmVjeWNsZVBvbGljeVRleHQnLCAnTGlmZWN5Y2xlUG9saWN5VGV4dCcsIHByb3BlcnRpZXMuTGlmZWN5Y2xlUG9saWN5VGV4dCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5MaWZlY3ljbGVQb2xpY3lUZXh0KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWdpc3RyeUlkJywgJ1JlZ2lzdHJ5SWQnLCBwcm9wZXJ0aWVzLlJlZ2lzdHJ5SWQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVnaXN0cnlJZCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19