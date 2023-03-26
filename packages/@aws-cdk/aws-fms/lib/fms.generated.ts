// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:14.336Z","fingerprint":"wePhFXlXyLjKgodskMWrR1qoUJtUp+4U1ZAm72NkpgQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnNotificationChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html
 */
export interface CfnNotificationChannelProps {

    /**
     * The Amazon Resource Name (ARN) of the IAM role that allows Amazon SNS to record AWS Firewall Manager activity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html#cfn-fms-notificationchannel-snsrolename
     */
    readonly snsRoleName: string;

    /**
     * The Amazon Resource Name (ARN) of the SNS topic that collects notifications from AWS Firewall Manager .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html#cfn-fms-notificationchannel-snstopicarn
     */
    readonly snsTopicArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnNotificationChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnNotificationChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snsRoleName', cdk.requiredValidator)(properties.snsRoleName));
    errors.collect(cdk.propertyValidator('snsRoleName', cdk.validateString)(properties.snsRoleName));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.requiredValidator)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    return errors.wrap('supplied properties not correct for "CfnNotificationChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::NotificationChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnNotificationChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::NotificationChannel` resource.
 */
// @ts-ignore TS6133
function cfnNotificationChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationChannelPropsValidator(properties).assertSuccess();
    return {
        SnsRoleName: cdk.stringToCloudFormation(properties.snsRoleName),
        SnsTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
    };
}

// @ts-ignore TS6133
function CfnNotificationChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationChannelProps>();
    ret.addPropertyResult('snsRoleName', 'SnsRoleName', cfn_parse.FromCloudFormation.getString(properties.SnsRoleName));
    ret.addPropertyResult('snsTopicArn', 'SnsTopicArn', cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FMS::NotificationChannel`
 *
 * Designates the IAM role and Amazon Simple Notification Service (SNS) topic to use to record SNS logs.
 *
 * To perform this action outside of the console, you must configure the SNS topic to allow the role `AWSServiceRoleForFMS` to publish SNS logs. For more information, see [Firewall Manager required permissions for API actions](https://docs.aws.amazon.com/waf/latest/developerguide/fms-api-permissions-ref.html) in the *AWS Firewall Manager Developer Guide* .
 *
 * @cloudformationResource AWS::FMS::NotificationChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html
 */
export class CfnNotificationChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FMS::NotificationChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNotificationChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNotificationChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNotificationChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the IAM role that allows Amazon SNS to record AWS Firewall Manager activity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html#cfn-fms-notificationchannel-snsrolename
     */
    public snsRoleName: string;

    /**
     * The Amazon Resource Name (ARN) of the SNS topic that collects notifications from AWS Firewall Manager .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-notificationchannel.html#cfn-fms-notificationchannel-snstopicarn
     */
    public snsTopicArn: string;

    /**
     * Create a new `AWS::FMS::NotificationChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNotificationChannelProps) {
        super(scope, id, { type: CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'snsRoleName', this);
        cdk.requireProperty(props, 'snsTopicArn', this);

        this.snsRoleName = props.snsRoleName;
        this.snsTopicArn = props.snsTopicArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            snsRoleName: this.snsRoleName,
            snsTopicArn: this.snsTopicArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNotificationChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html
 */
export interface CfnPolicyProps {

    /**
     * Used only when tags are specified in the `ResourceTags` property. If this property is `True` , resources with the specified tags are not in scope of the policy. If it's `False` , only resources with the specified tags are in scope of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-excluderesourcetags
     */
    readonly excludeResourceTags: boolean | cdk.IResolvable;

    /**
     * The name of the AWS Firewall Manager policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-policyname
     */
    readonly policyName: string;

    /**
     * Indicates if the policy should be automatically applied to new resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-remediationenabled
     */
    readonly remediationEnabled: boolean | cdk.IResolvable;

    /**
     * Details about the security service that is being used to protect the resources.
     *
     * This contains the following settings:
     *
     * - Type - Indicates the service type that the policy uses to protect the resource. For security group policies, Firewall Manager supports one security group for each common policy and for each content audit policy. This is an adjustable limit that you can increase by contacting AWS Support .
     *
     * Valid values: `DNS_FIREWALL` | `NETWORK_FIREWALL` | `SECURITY_GROUPS_COMMON` | `SECURITY_GROUPS_CONTENT_AUDIT` | `SECURITY_GROUPS_USAGE_AUDIT` | `SHIELD_ADVANCED` | `WAFV2` | `WAF`
     * - ManagedServiceData - Details about the service that are specific to the service type, in JSON format.
     *
     * - Example: `DNS_FIREWALL`
     *
     * `"ManagedServiceData": "{ \"type\": \"DNS_FIREWALL\", \"preProcessRuleGroups\": [{\"ruleGroupId\": \"rslvr-frg-123456\", \"priority\": 11}], \"postProcessRuleGroups\": [{\"ruleGroupId\": \"rslvr-frg-123456\", \"priority\": 9902}]}"`
     * - Example: `NETWORK_FIREWALL`
     *
     * `"ManagedServiceData":"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:000000000000:stateless-rulegroup\/example\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:drop\",\"example\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:drop\",\"example\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"example\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"example\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:000000000000:stateful-rulegroup\/example\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[]}}"`
     * - Example: `SECURITY_GROUPS_COMMON`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_COMMON","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"},"RemediationEnabled":false,"ResourceType":"AWS::EC2::NetworkInterface"}`
     * - Example: `SECURITY_GROUPS_CONTENT_AUDIT`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_CONTENT_AUDIT","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_CONTENT_AUDIT\",\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd \"}],\"securityGroupAction\":{\"type\":\"ALLOW\"}}"},"RemediationEnabled":false,"ResourceType":"AWS::EC2::NetworkInterface"}`
     *
     * The security group action for content audit can be `ALLOW` or `DENY` . For `ALLOW` , all in-scope security group rules must be within the allowed range of the policy's security group rules. For `DENY` , all in-scope security group rules must not contain a value or a range that matches a rule value or range in the policy security group.
     * - Example: `SECURITY_GROUPS_USAGE_AUDIT`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_USAGE_AUDIT","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_USAGE_AUDIT\",\"deleteUnusedSecurityGroups\":true,\"coalesceRedundantSecurityGroups\":true}"},"RemediationEnabled":false,"Resou rceType":"AWS::EC2::SecurityGroup"}`
     * - Specification for `SHIELD_ADVANCED` for Amazon CloudFront distributions
     *
     * `"ManagedServiceData": "{\"type\": \"SHIELD_ADVANCED\", \"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED|IGNORED|DISABLED\", \"automaticResponseAction\":\"BLOCK|COUNT\"}, \"overrideCustomerWebaclClassic\":true|false}"`
     *
     * For example: `"ManagedServiceData": "{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED\", \"automaticResponseAction\":\"COUNT\"}}"`
     *
     * The default value for `automaticResponseStatus` is `IGNORED` . The value for `automaticResponseAction` is only required when `automaticResponseStatus` is set to `ENABLED` . The default value for `overrideCustomerWebaclClassic` is `false` .
     *
     * For other resource types that you can protect with a Shield Advanced policy, this `ManagedServiceData` configuration is an empty string.
     * - Example: `WAFV2`
     *
     * `"ManagedServiceData": "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesAmazonIpReputationList\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":{\"logDestinationConfigs\":[\"arn:aws:firehose:us-west-2:12345678912:deliverystream/aws-waf-logs-fms-admin-destination\"],\"redactedFields\":[{\"redactedFieldType\":\"SingleHeader\",\"redactedFieldValue\":\"Cookies\"},{\"redactedFieldType\":\"Method\"}]}}"`
     *
     * In the `loggingConfiguration` , you can specify one `logDestinationConfigs` , you can optionally provide up to 20 `redactedFields` , and the `RedactedFieldType` must be one of `URI` , `QUERY_STRING` , `HEADER` , or `METHOD` .
     * - Example: `WAF Classic`
     *
     * `"ManagedServiceData": "{\"type\": \"WAF\", \"ruleGroups\": [{\"id\":\"12345678-1bcd-9012-efga-0987654321ab\", \"overrideAction\" : {\"type\": \"COUNT\"}}],\"defaultAction\": {\"type\": \"BLOCK\"}}`
     *
     * AWS WAF Classic doesn't support rule groups in CloudFront . To create a WAF Classic policy through CloudFormation, create your rule groups outside of CloudFront , then provide the rule group IDs in the WAF managed service data specification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-securityservicepolicydata
     */
    readonly securityServicePolicyData: CfnPolicy.SecurityServicePolicyDataProperty | cdk.IResolvable;

    /**
     * Used when deleting a policy. If `true` , Firewall Manager performs cleanup according to the policy type.
     *
     * For AWS WAF and Shield Advanced policies, Firewall Manager does the following:
     *
     * - Deletes rule groups created by Firewall Manager
     * - Removes web ACLs from in-scope resources
     * - Deletes web ACLs that contain no rules or rule groups
     *
     * For security group policies, Firewall Manager does the following for each security group in the policy:
     *
     * - Disassociates the security group from in-scope resources
     * - Deletes the security group if it was created through Firewall Manager and if it's no longer associated with any resources through another policy
     *
     * After the cleanup, in-scope resources are no longer protected by web ACLs in this policy. Protection of out-of-scope resources remains unchanged. Scope is determined by tags that you create and accounts that you associate with the policy. When creating the policy, if you specify that only resources in specific accounts or with specific tags are in scope of the policy, those accounts and resources are handled by the policy. All others are out of scope. If you don't specify tags or accounts, all resources are in scope.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-deleteallpolicyresources
     */
    readonly deleteAllPolicyResources?: boolean | cdk.IResolvable;

    /**
     * Specifies the AWS account IDs and AWS Organizations organizational units (OUs) to exclude from the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time.
     *
     * You can specify inclusions or exclusions, but not both. If you specify an `IncludeMap` , AWS Firewall Manager applies the policy to all accounts specified by the `IncludeMap` , and does not evaluate any `ExcludeMap` specifications. If you do not specify an `IncludeMap` , then Firewall Manager applies the policy to all accounts except for those specified by the `ExcludeMap` .
     *
     * You can specify account IDs, OUs, or a combination:
     *
     * - Specify account IDs by setting the key to `ACCOUNT` . For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”]}` .
     * - Specify OUs by setting the key to `ORGUNIT` . For example, the following is a valid map: `{“ORGUNIT” : [“ouid111”, “ouid112”]}` .
     * - Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”], “ORGUNIT” : [“ouid111”, “ouid112”]}` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-excludemap
     */
    readonly excludeMap?: CfnPolicy.IEMapProperty | cdk.IResolvable;

    /**
     * Specifies the AWS account IDs and AWS Organizations organizational units (OUs) to include in the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time.
     *
     * You can specify inclusions or exclusions, but not both. If you specify an `IncludeMap` , AWS Firewall Manager applies the policy to all accounts specified by the `IncludeMap` , and does not evaluate any `ExcludeMap` specifications. If you do not specify an `IncludeMap` , then Firewall Manager applies the policy to all accounts except for those specified by the `ExcludeMap` .
     *
     * You can specify account IDs, OUs, or a combination:
     *
     * - Specify account IDs by setting the key to `ACCOUNT` . For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”]}` .
     * - Specify OUs by setting the key to `ORGUNIT` . For example, the following is a valid map: `{“ORGUNIT” : [“ouid111”, “ouid112”]}` .
     * - Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”], “ORGUNIT” : [“ouid111”, “ouid112”]}` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-includemap
     */
    readonly includeMap?: CfnPolicy.IEMapProperty | cdk.IResolvable;

    /**
     * `AWS::FMS::Policy.PolicyDescription`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-policydescription
     */
    readonly policyDescription?: string;

    /**
     * Indicates whether AWS Firewall Manager should automatically remove protections from resources that leave the policy scope and clean up resources that Firewall Manager is managing for accounts when those accounts leave policy scope. For example, Firewall Manager will disassociate a Firewall Manager managed web ACL from a protected customer resource when the customer resource leaves policy scope.
     *
     * By default, Firewall Manager doesn't remove protections or delete Firewall Manager managed resources.
     *
     * This option is not available for Shield Advanced or AWS WAF Classic policies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcescleanup
     */
    readonly resourcesCleanUp?: boolean | cdk.IResolvable;

    /**
     * `AWS::FMS::Policy.ResourceSetIds`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcesetids
     */
    readonly resourceSetIds?: string[];

    /**
     * An array of `ResourceTag` objects, used to explicitly include resources in the policy scope or explicitly exclude them. If this isn't set, then tags aren't used to modify policy scope. See also `ExcludeResourceTags` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetags
     */
    readonly resourceTags?: Array<CfnPolicy.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The type of resource protected by or in scope of the policy. This is in the format shown in the [AWS Resource Types Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) . To apply this policy to multiple resource types, specify a resource type of `ResourceTypeList` and then specify the resource types in a `ResourceTypeList` .
     *
     * For AWS WAF and Shield Advanced, example resource types include `AWS::ElasticLoadBalancingV2::LoadBalancer` and `AWS::CloudFront::Distribution` . For a security group common policy, valid values are `AWS::EC2::NetworkInterface` and `AWS::EC2::Instance` . For a security group content audit policy, valid values are `AWS::EC2::SecurityGroup` , `AWS::EC2::NetworkInterface` , and `AWS::EC2::Instance` . For a security group usage audit policy, the value is `AWS::EC2::SecurityGroup` . For an AWS Network Firewall policy or DNS Firewall policy, the value is `AWS::EC2::VPC` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetype
     */
    readonly resourceType?: string;

    /**
     * An array of `ResourceType` objects. Use this only to specify multiple resource types. To specify a single resource type, use `ResourceType` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetypelist
     */
    readonly resourceTypeList?: string[];

    /**
     * A collection of key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-tags
     */
    readonly tags?: CfnPolicy.PolicyTagProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteAllPolicyResources', cdk.validateBoolean)(properties.deleteAllPolicyResources));
    errors.collect(cdk.propertyValidator('excludeMap', CfnPolicy_IEMapPropertyValidator)(properties.excludeMap));
    errors.collect(cdk.propertyValidator('excludeResourceTags', cdk.requiredValidator)(properties.excludeResourceTags));
    errors.collect(cdk.propertyValidator('excludeResourceTags', cdk.validateBoolean)(properties.excludeResourceTags));
    errors.collect(cdk.propertyValidator('includeMap', CfnPolicy_IEMapPropertyValidator)(properties.includeMap));
    errors.collect(cdk.propertyValidator('policyDescription', cdk.validateString)(properties.policyDescription));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    errors.collect(cdk.propertyValidator('remediationEnabled', cdk.requiredValidator)(properties.remediationEnabled));
    errors.collect(cdk.propertyValidator('remediationEnabled', cdk.validateBoolean)(properties.remediationEnabled));
    errors.collect(cdk.propertyValidator('resourceSetIds', cdk.listValidator(cdk.validateString))(properties.resourceSetIds));
    errors.collect(cdk.propertyValidator('resourceTags', cdk.listValidator(CfnPolicy_ResourceTagPropertyValidator))(properties.resourceTags));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceTypeList', cdk.listValidator(cdk.validateString))(properties.resourceTypeList));
    errors.collect(cdk.propertyValidator('resourcesCleanUp', cdk.validateBoolean)(properties.resourcesCleanUp));
    errors.collect(cdk.propertyValidator('securityServicePolicyData', cdk.requiredValidator)(properties.securityServicePolicyData));
    errors.collect(cdk.propertyValidator('securityServicePolicyData', CfnPolicy_SecurityServicePolicyDataPropertyValidator)(properties.securityServicePolicyData));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnPolicy_PolicyTagPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy` resource
 *
 * @param properties - the TypeScript properties of a `CfnPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy` resource.
 */
// @ts-ignore TS6133
function cfnPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicyPropsValidator(properties).assertSuccess();
    return {
        ExcludeResourceTags: cdk.booleanToCloudFormation(properties.excludeResourceTags),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
        RemediationEnabled: cdk.booleanToCloudFormation(properties.remediationEnabled),
        SecurityServicePolicyData: cfnPolicySecurityServicePolicyDataPropertyToCloudFormation(properties.securityServicePolicyData),
        DeleteAllPolicyResources: cdk.booleanToCloudFormation(properties.deleteAllPolicyResources),
        ExcludeMap: cfnPolicyIEMapPropertyToCloudFormation(properties.excludeMap),
        IncludeMap: cfnPolicyIEMapPropertyToCloudFormation(properties.includeMap),
        PolicyDescription: cdk.stringToCloudFormation(properties.policyDescription),
        ResourcesCleanUp: cdk.booleanToCloudFormation(properties.resourcesCleanUp),
        ResourceSetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceSetIds),
        ResourceTags: cdk.listMapper(cfnPolicyResourceTagPropertyToCloudFormation)(properties.resourceTags),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
        ResourceTypeList: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypeList),
        Tags: cdk.listMapper(cfnPolicyPolicyTagPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyProps>();
    ret.addPropertyResult('excludeResourceTags', 'ExcludeResourceTags', cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeResourceTags));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addPropertyResult('remediationEnabled', 'RemediationEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.RemediationEnabled));
    ret.addPropertyResult('securityServicePolicyData', 'SecurityServicePolicyData', CfnPolicySecurityServicePolicyDataPropertyFromCloudFormation(properties.SecurityServicePolicyData));
    ret.addPropertyResult('deleteAllPolicyResources', 'DeleteAllPolicyResources', properties.DeleteAllPolicyResources != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteAllPolicyResources) : undefined);
    ret.addPropertyResult('excludeMap', 'ExcludeMap', properties.ExcludeMap != null ? CfnPolicyIEMapPropertyFromCloudFormation(properties.ExcludeMap) : undefined);
    ret.addPropertyResult('includeMap', 'IncludeMap', properties.IncludeMap != null ? CfnPolicyIEMapPropertyFromCloudFormation(properties.IncludeMap) : undefined);
    ret.addPropertyResult('policyDescription', 'PolicyDescription', properties.PolicyDescription != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDescription) : undefined);
    ret.addPropertyResult('resourcesCleanUp', 'ResourcesCleanUp', properties.ResourcesCleanUp != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ResourcesCleanUp) : undefined);
    ret.addPropertyResult('resourceSetIds', 'ResourceSetIds', properties.ResourceSetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceSetIds) : undefined);
    ret.addPropertyResult('resourceTags', 'ResourceTags', properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnPolicyResourceTagPropertyFromCloudFormation)(properties.ResourceTags) : undefined);
    ret.addPropertyResult('resourceType', 'ResourceType', properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined);
    ret.addPropertyResult('resourceTypeList', 'ResourceTypeList', properties.ResourceTypeList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypeList) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnPolicyPolicyTagPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FMS::Policy`
 *
 * An AWS Firewall Manager policy.
 *
 * Firewall Manager provides the following types of policies:
 *
 * - An AWS Shield Advanced policy, which applies Shield Advanced protection to specified accounts and resources.
 * - An AWS WAF policy (type WAFV2), which defines rule groups to run first in the corresponding AWS WAF web ACL and rule groups to run last in the web ACL.
 * - An AWS WAF Classic policy, which defines a rule group. AWS WAF Classic doesn't support rule groups in Amazon CloudFront , so, to create AWS WAF Classic policies through CloudFront , you first need to create your rule groups outside of CloudFront .
 * - A security group policy, which manages VPC security groups across your AWS organization.
 * - An AWS Network Firewall policy, which provides firewall rules to filter network traffic in specified Amazon VPCs.
 * - A DNS Firewall policy, which provides Amazon Route 53 Resolver DNS Firewall rules to filter DNS queries for specified Amazon VPCs.
 *
 * Each policy is specific to one of the types. If you want to enforce more than one policy type across accounts, create multiple policies. You can create multiple policies for each type.
 *
 * These policies require some setup to use. For more information, see the sections on prerequisites and getting started under [AWS Firewall Manager](https://docs.aws.amazon.com/waf/latest/developerguide/fms-prereq.html) .
 *
 * @cloudformationResource AWS::FMS::Policy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html
 */
export class CfnPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FMS::Policy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the policy.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the policy.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Used only when tags are specified in the `ResourceTags` property. If this property is `True` , resources with the specified tags are not in scope of the policy. If it's `False` , only resources with the specified tags are in scope of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-excluderesourcetags
     */
    public excludeResourceTags: boolean | cdk.IResolvable;

    /**
     * The name of the AWS Firewall Manager policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-policyname
     */
    public policyName: string;

    /**
     * Indicates if the policy should be automatically applied to new resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-remediationenabled
     */
    public remediationEnabled: boolean | cdk.IResolvable;

    /**
     * Details about the security service that is being used to protect the resources.
     *
     * This contains the following settings:
     *
     * - Type - Indicates the service type that the policy uses to protect the resource. For security group policies, Firewall Manager supports one security group for each common policy and for each content audit policy. This is an adjustable limit that you can increase by contacting AWS Support .
     *
     * Valid values: `DNS_FIREWALL` | `NETWORK_FIREWALL` | `SECURITY_GROUPS_COMMON` | `SECURITY_GROUPS_CONTENT_AUDIT` | `SECURITY_GROUPS_USAGE_AUDIT` | `SHIELD_ADVANCED` | `WAFV2` | `WAF`
     * - ManagedServiceData - Details about the service that are specific to the service type, in JSON format.
     *
     * - Example: `DNS_FIREWALL`
     *
     * `"ManagedServiceData": "{ \"type\": \"DNS_FIREWALL\", \"preProcessRuleGroups\": [{\"ruleGroupId\": \"rslvr-frg-123456\", \"priority\": 11}], \"postProcessRuleGroups\": [{\"ruleGroupId\": \"rslvr-frg-123456\", \"priority\": 9902}]}"`
     * - Example: `NETWORK_FIREWALL`
     *
     * `"ManagedServiceData":"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:000000000000:stateless-rulegroup\/example\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:drop\",\"example\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:drop\",\"example\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"example\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"example\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:000000000000:stateful-rulegroup\/example\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[]}}"`
     * - Example: `SECURITY_GROUPS_COMMON`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_COMMON","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"},"RemediationEnabled":false,"ResourceType":"AWS::EC2::NetworkInterface"}`
     * - Example: `SECURITY_GROUPS_CONTENT_AUDIT`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_CONTENT_AUDIT","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_CONTENT_AUDIT\",\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd \"}],\"securityGroupAction\":{\"type\":\"ALLOW\"}}"},"RemediationEnabled":false,"ResourceType":"AWS::EC2::NetworkInterface"}`
     *
     * The security group action for content audit can be `ALLOW` or `DENY` . For `ALLOW` , all in-scope security group rules must be within the allowed range of the policy's security group rules. For `DENY` , all in-scope security group rules must not contain a value or a range that matches a rule value or range in the policy security group.
     * - Example: `SECURITY_GROUPS_USAGE_AUDIT`
     *
     * `"SecurityServicePolicyData":{"Type":"SECURITY_GROUPS_USAGE_AUDIT","ManagedServiceData":"{\"type\":\"SECURITY_GROUPS_USAGE_AUDIT\",\"deleteUnusedSecurityGroups\":true,\"coalesceRedundantSecurityGroups\":true}"},"RemediationEnabled":false,"Resou rceType":"AWS::EC2::SecurityGroup"}`
     * - Specification for `SHIELD_ADVANCED` for Amazon CloudFront distributions
     *
     * `"ManagedServiceData": "{\"type\": \"SHIELD_ADVANCED\", \"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED|IGNORED|DISABLED\", \"automaticResponseAction\":\"BLOCK|COUNT\"}, \"overrideCustomerWebaclClassic\":true|false}"`
     *
     * For example: `"ManagedServiceData": "{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED\", \"automaticResponseAction\":\"COUNT\"}}"`
     *
     * The default value for `automaticResponseStatus` is `IGNORED` . The value for `automaticResponseAction` is only required when `automaticResponseStatus` is set to `ENABLED` . The default value for `overrideCustomerWebaclClassic` is `false` .
     *
     * For other resource types that you can protect with a Shield Advanced policy, this `ManagedServiceData` configuration is an empty string.
     * - Example: `WAFV2`
     *
     * `"ManagedServiceData": "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesAmazonIpReputationList\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":{\"logDestinationConfigs\":[\"arn:aws:firehose:us-west-2:12345678912:deliverystream/aws-waf-logs-fms-admin-destination\"],\"redactedFields\":[{\"redactedFieldType\":\"SingleHeader\",\"redactedFieldValue\":\"Cookies\"},{\"redactedFieldType\":\"Method\"}]}}"`
     *
     * In the `loggingConfiguration` , you can specify one `logDestinationConfigs` , you can optionally provide up to 20 `redactedFields` , and the `RedactedFieldType` must be one of `URI` , `QUERY_STRING` , `HEADER` , or `METHOD` .
     * - Example: `WAF Classic`
     *
     * `"ManagedServiceData": "{\"type\": \"WAF\", \"ruleGroups\": [{\"id\":\"12345678-1bcd-9012-efga-0987654321ab\", \"overrideAction\" : {\"type\": \"COUNT\"}}],\"defaultAction\": {\"type\": \"BLOCK\"}}`
     *
     * AWS WAF Classic doesn't support rule groups in CloudFront . To create a WAF Classic policy through CloudFormation, create your rule groups outside of CloudFront , then provide the rule group IDs in the WAF managed service data specification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-securityservicepolicydata
     */
    public securityServicePolicyData: CfnPolicy.SecurityServicePolicyDataProperty | cdk.IResolvable;

    /**
     * Used when deleting a policy. If `true` , Firewall Manager performs cleanup according to the policy type.
     *
     * For AWS WAF and Shield Advanced policies, Firewall Manager does the following:
     *
     * - Deletes rule groups created by Firewall Manager
     * - Removes web ACLs from in-scope resources
     * - Deletes web ACLs that contain no rules or rule groups
     *
     * For security group policies, Firewall Manager does the following for each security group in the policy:
     *
     * - Disassociates the security group from in-scope resources
     * - Deletes the security group if it was created through Firewall Manager and if it's no longer associated with any resources through another policy
     *
     * After the cleanup, in-scope resources are no longer protected by web ACLs in this policy. Protection of out-of-scope resources remains unchanged. Scope is determined by tags that you create and accounts that you associate with the policy. When creating the policy, if you specify that only resources in specific accounts or with specific tags are in scope of the policy, those accounts and resources are handled by the policy. All others are out of scope. If you don't specify tags or accounts, all resources are in scope.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-deleteallpolicyresources
     */
    public deleteAllPolicyResources: boolean | cdk.IResolvable | undefined;

    /**
     * Specifies the AWS account IDs and AWS Organizations organizational units (OUs) to exclude from the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time.
     *
     * You can specify inclusions or exclusions, but not both. If you specify an `IncludeMap` , AWS Firewall Manager applies the policy to all accounts specified by the `IncludeMap` , and does not evaluate any `ExcludeMap` specifications. If you do not specify an `IncludeMap` , then Firewall Manager applies the policy to all accounts except for those specified by the `ExcludeMap` .
     *
     * You can specify account IDs, OUs, or a combination:
     *
     * - Specify account IDs by setting the key to `ACCOUNT` . For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”]}` .
     * - Specify OUs by setting the key to `ORGUNIT` . For example, the following is a valid map: `{“ORGUNIT” : [“ouid111”, “ouid112”]}` .
     * - Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”], “ORGUNIT” : [“ouid111”, “ouid112”]}` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-excludemap
     */
    public excludeMap: CfnPolicy.IEMapProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the AWS account IDs and AWS Organizations organizational units (OUs) to include in the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time.
     *
     * You can specify inclusions or exclusions, but not both. If you specify an `IncludeMap` , AWS Firewall Manager applies the policy to all accounts specified by the `IncludeMap` , and does not evaluate any `ExcludeMap` specifications. If you do not specify an `IncludeMap` , then Firewall Manager applies the policy to all accounts except for those specified by the `ExcludeMap` .
     *
     * You can specify account IDs, OUs, or a combination:
     *
     * - Specify account IDs by setting the key to `ACCOUNT` . For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”]}` .
     * - Specify OUs by setting the key to `ORGUNIT` . For example, the following is a valid map: `{“ORGUNIT” : [“ouid111”, “ouid112”]}` .
     * - Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”], “ORGUNIT” : [“ouid111”, “ouid112”]}` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-includemap
     */
    public includeMap: CfnPolicy.IEMapProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::FMS::Policy.PolicyDescription`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-policydescription
     */
    public policyDescription: string | undefined;

    /**
     * Indicates whether AWS Firewall Manager should automatically remove protections from resources that leave the policy scope and clean up resources that Firewall Manager is managing for accounts when those accounts leave policy scope. For example, Firewall Manager will disassociate a Firewall Manager managed web ACL from a protected customer resource when the customer resource leaves policy scope.
     *
     * By default, Firewall Manager doesn't remove protections or delete Firewall Manager managed resources.
     *
     * This option is not available for Shield Advanced or AWS WAF Classic policies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcescleanup
     */
    public resourcesCleanUp: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::FMS::Policy.ResourceSetIds`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcesetids
     */
    public resourceSetIds: string[] | undefined;

    /**
     * An array of `ResourceTag` objects, used to explicitly include resources in the policy scope or explicitly exclude them. If this isn't set, then tags aren't used to modify policy scope. See also `ExcludeResourceTags` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetags
     */
    public resourceTags: Array<CfnPolicy.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The type of resource protected by or in scope of the policy. This is in the format shown in the [AWS Resource Types Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) . To apply this policy to multiple resource types, specify a resource type of `ResourceTypeList` and then specify the resource types in a `ResourceTypeList` .
     *
     * For AWS WAF and Shield Advanced, example resource types include `AWS::ElasticLoadBalancingV2::LoadBalancer` and `AWS::CloudFront::Distribution` . For a security group common policy, valid values are `AWS::EC2::NetworkInterface` and `AWS::EC2::Instance` . For a security group content audit policy, valid values are `AWS::EC2::SecurityGroup` , `AWS::EC2::NetworkInterface` , and `AWS::EC2::Instance` . For a security group usage audit policy, the value is `AWS::EC2::SecurityGroup` . For an AWS Network Firewall policy or DNS Firewall policy, the value is `AWS::EC2::VPC` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetype
     */
    public resourceType: string | undefined;

    /**
     * An array of `ResourceType` objects. Use this only to specify multiple resource types. To specify a single resource type, use `ResourceType` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-resourcetypelist
     */
    public resourceTypeList: string[] | undefined;

    /**
     * A collection of key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fms-policy.html#cfn-fms-policy-tags
     */
    public tags: CfnPolicy.PolicyTagProperty[] | undefined;

    /**
     * Create a new `AWS::FMS::Policy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPolicyProps) {
        super(scope, id, { type: CfnPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'excludeResourceTags', this);
        cdk.requireProperty(props, 'policyName', this);
        cdk.requireProperty(props, 'remediationEnabled', this);
        cdk.requireProperty(props, 'securityServicePolicyData', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.excludeResourceTags = props.excludeResourceTags;
        this.policyName = props.policyName;
        this.remediationEnabled = props.remediationEnabled;
        this.securityServicePolicyData = props.securityServicePolicyData;
        this.deleteAllPolicyResources = props.deleteAllPolicyResources;
        this.excludeMap = props.excludeMap;
        this.includeMap = props.includeMap;
        this.policyDescription = props.policyDescription;
        this.resourcesCleanUp = props.resourcesCleanUp;
        this.resourceSetIds = props.resourceSetIds;
        this.resourceTags = props.resourceTags;
        this.resourceType = props.resourceType;
        this.resourceTypeList = props.resourceTypeList;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            excludeResourceTags: this.excludeResourceTags,
            policyName: this.policyName,
            remediationEnabled: this.remediationEnabled,
            securityServicePolicyData: this.securityServicePolicyData,
            deleteAllPolicyResources: this.deleteAllPolicyResources,
            excludeMap: this.excludeMap,
            includeMap: this.includeMap,
            policyDescription: this.policyDescription,
            resourcesCleanUp: this.resourcesCleanUp,
            resourceSetIds: this.resourceSetIds,
            resourceTags: this.resourceTags,
            resourceType: this.resourceType,
            resourceTypeList: this.resourceTypeList,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnPolicy {
    /**
     * Specifies the AWS account IDs and AWS Organizations organizational units (OUs) to include in or exclude from the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time.
     *
     * This is used for the policy's `IncludeMap` and `ExcludeMap` .
     *
     * You can specify account IDs, OUs, or a combination:
     *
     * - Specify account IDs by setting the key to `ACCOUNT` . For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”]}` .
     * - Specify OUs by setting the key to `ORGUNIT` . For example, the following is a valid map: `{“ORGUNIT” : [“ouid111”, “ouid112”]}` .
     * - Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: `{“ACCOUNT” : [“accountID1”, “accountID2”], “ORGUNIT” : [“ouid111”, “ouid112”]}` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-iemap.html
     */
    export interface IEMapProperty {
        /**
         * The account list for the map.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-iemap.html#cfn-fms-policy-iemap-account
         */
        readonly account?: string[];
        /**
         * The organizational unit list for the map.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-iemap.html#cfn-fms-policy-iemap-orgunit
         */
        readonly orgunit?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `IEMapProperty`
 *
 * @param properties - the TypeScript properties of a `IEMapProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_IEMapPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('account', cdk.listValidator(cdk.validateString))(properties.account));
    errors.collect(cdk.propertyValidator('orgunit', cdk.listValidator(cdk.validateString))(properties.orgunit));
    return errors.wrap('supplied properties not correct for "IEMapProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.IEMap` resource
 *
 * @param properties - the TypeScript properties of a `IEMapProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.IEMap` resource.
 */
// @ts-ignore TS6133
function cfnPolicyIEMapPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_IEMapPropertyValidator(properties).assertSuccess();
    return {
        ACCOUNT: cdk.listMapper(cdk.stringToCloudFormation)(properties.account),
        ORGUNIT: cdk.listMapper(cdk.stringToCloudFormation)(properties.orgunit),
    };
}

// @ts-ignore TS6133
function CfnPolicyIEMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.IEMapProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.IEMapProperty>();
    ret.addPropertyResult('account', 'ACCOUNT', properties.ACCOUNT != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ACCOUNT) : undefined);
    ret.addPropertyResult('orgunit', 'ORGUNIT', properties.ORGUNIT != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ORGUNIT) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * Configures the firewall policy deployment model of AWS Network Firewall . For information about Network Firewall deployment models, see [AWS Network Firewall example architectures with routing](https://docs.aws.amazon.com/network-firewall/latest/developerguide/architectures.html) in the *Network Firewall Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-networkfirewallpolicy.html
     */
    export interface NetworkFirewallPolicyProperty {
        /**
         * Defines the deployment model to use for the firewall policy. To use a distributed model, set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `NULL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-networkfirewallpolicy.html#cfn-fms-policy-networkfirewallpolicy-firewalldeploymentmodel
         */
        readonly firewallDeploymentModel: string;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkFirewallPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkFirewallPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_NetworkFirewallPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('firewallDeploymentModel', cdk.requiredValidator)(properties.firewallDeploymentModel));
    errors.collect(cdk.propertyValidator('firewallDeploymentModel', cdk.validateString)(properties.firewallDeploymentModel));
    return errors.wrap('supplied properties not correct for "NetworkFirewallPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.NetworkFirewallPolicy` resource
 *
 * @param properties - the TypeScript properties of a `NetworkFirewallPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.NetworkFirewallPolicy` resource.
 */
// @ts-ignore TS6133
function cfnPolicyNetworkFirewallPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_NetworkFirewallPolicyPropertyValidator(properties).assertSuccess();
    return {
        FirewallDeploymentModel: cdk.stringToCloudFormation(properties.firewallDeploymentModel),
    };
}

// @ts-ignore TS6133
function CfnPolicyNetworkFirewallPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.NetworkFirewallPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.NetworkFirewallPolicyProperty>();
    ret.addPropertyResult('firewallDeploymentModel', 'FirewallDeploymentModel', cfn_parse.FromCloudFormation.getString(properties.FirewallDeploymentModel));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * Contains the AWS Network Firewall firewall policy options to configure the policy's deployment model and third-party firewall policy settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policyoption.html
     */
    export interface PolicyOptionProperty {
        /**
         * Defines the deployment model to use for the firewall policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policyoption.html#cfn-fms-policy-policyoption-networkfirewallpolicy
         */
        readonly networkFirewallPolicy?: CfnPolicy.NetworkFirewallPolicyProperty | cdk.IResolvable;
        /**
         * Defines the policy options for a third-party firewall policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policyoption.html#cfn-fms-policy-policyoption-thirdpartyfirewallpolicy
         */
        readonly thirdPartyFirewallPolicy?: CfnPolicy.ThirdPartyFirewallPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyOptionProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_PolicyOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('networkFirewallPolicy', CfnPolicy_NetworkFirewallPolicyPropertyValidator)(properties.networkFirewallPolicy));
    errors.collect(cdk.propertyValidator('thirdPartyFirewallPolicy', CfnPolicy_ThirdPartyFirewallPolicyPropertyValidator)(properties.thirdPartyFirewallPolicy));
    return errors.wrap('supplied properties not correct for "PolicyOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.PolicyOption` resource
 *
 * @param properties - the TypeScript properties of a `PolicyOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.PolicyOption` resource.
 */
// @ts-ignore TS6133
function cfnPolicyPolicyOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_PolicyOptionPropertyValidator(properties).assertSuccess();
    return {
        NetworkFirewallPolicy: cfnPolicyNetworkFirewallPolicyPropertyToCloudFormation(properties.networkFirewallPolicy),
        ThirdPartyFirewallPolicy: cfnPolicyThirdPartyFirewallPolicyPropertyToCloudFormation(properties.thirdPartyFirewallPolicy),
    };
}

// @ts-ignore TS6133
function CfnPolicyPolicyOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.PolicyOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.PolicyOptionProperty>();
    ret.addPropertyResult('networkFirewallPolicy', 'NetworkFirewallPolicy', properties.NetworkFirewallPolicy != null ? CfnPolicyNetworkFirewallPolicyPropertyFromCloudFormation(properties.NetworkFirewallPolicy) : undefined);
    ret.addPropertyResult('thirdPartyFirewallPolicy', 'ThirdPartyFirewallPolicy', properties.ThirdPartyFirewallPolicy != null ? CfnPolicyThirdPartyFirewallPolicyPropertyFromCloudFormation(properties.ThirdPartyFirewallPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * A collection of key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policytag.html
     */
    export interface PolicyTagProperty {
        /**
         * Part of the key:value pair that defines a tag. You can use a tag key to describe a category of information, such as "customer." Tag keys are case-sensitive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policytag.html#cfn-fms-policy-policytag-key
         */
        readonly key: string;
        /**
         * Part of the key:value pair that defines a tag. You can use a tag value to describe a specific value within a category, such as "companyA" or "companyB." Tag values are case-sensitive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-policytag.html#cfn-fms-policy-policytag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyTagProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_PolicyTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "PolicyTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.PolicyTag` resource
 *
 * @param properties - the TypeScript properties of a `PolicyTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.PolicyTag` resource.
 */
// @ts-ignore TS6133
function cfnPolicyPolicyTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_PolicyTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPolicyPolicyTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.PolicyTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.PolicyTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * The resource tags that AWS Firewall Manager uses to determine if a particular resource should be included or excluded from the AWS Firewall Manager policy. Tags enable you to categorize your AWS resources in different ways, for example, by purpose, owner, or environment. Each tag consists of a key and an optional value. Firewall Manager combines the tags with "AND" so that, if you add more than one tag to a policy scope, a resource must have all the specified tags to be included or excluded. For more information, see [Working with Tag Editor](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/tag-editor.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-resourcetag.html
     */
    export interface ResourceTagProperty {
        /**
         * The resource tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-resourcetag.html#cfn-fms-policy-resourcetag-key
         */
        readonly key: string;
        /**
         * The resource tag value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-resourcetag.html#cfn-fms-policy-resourcetag-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceTagProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_ResourceTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ResourceTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.ResourceTag` resource
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.ResourceTag` resource.
 */
// @ts-ignore TS6133
function cfnPolicyResourceTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_ResourceTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPolicyResourceTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.ResourceTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.ResourceTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * Details about the security service that is being used to protect the resources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-securityservicepolicydata.html
     */
    export interface SecurityServicePolicyDataProperty {
        /**
         * Details about the service that are specific to the service type, in JSON format.
         *
         * - Example: `DNS_FIREWALL`
         *
         * `"{\"type\":\"DNS_FIREWALL\",\"preProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-1\",\"priority\":10}],\"postProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-2\",\"priority\":9911}]}"`
         *
         * > Valid values for `preProcessRuleGroups` are between 1 and 99. Valid values for `postProcessRuleGroups` are between 9901 and 10000.
         * - Example: `NETWORK_FIREWALL` - Centralized deployment model
         *
         * `"{\"type\":\"NETWORK_FIREWALL\",\"awsNetworkFirewallConfig\":{\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}},\"firewallDeploymentModel\":{\"centralizedFirewallDeploymentModel\":{\"centralizedFirewallOrchestrationConfig\":{\"inspectionVpcIds\":[{\"resourceId\":\"vpc-1234\",\"accountId\":\"123456789011\"}],\"firewallCreationConfig\":{\"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneId\":null,\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]}]}},\"allowedIPV4CidrList\":[]}}}}"`
         *
         * To use the centralized deployment model, you must set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `CENTRALIZED` .
         * - Example: `NETWORK_FIREWALL` - Distributed deployment model with automatic Availability Zone configuration
         *
         * `"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[\"10.0.0.0/28\",\"192.168.0.0/28\"],\"routeManagementAction\":\"OFF\"},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}}"`
         *
         * With automatic Availbility Zone configuration, Firewall Manager chooses which Availability Zones to create the endpoints in. To use the distributed deployment model, you must set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `NULL` .
         * - Example: `NETWORK_FIREWALL` - Distributed deployment model with automatic Availability Zone configuration and route management
         *
         * `"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[\"10.0.0.0/28\",\"192.168.0.0/28\"],\"routeManagementAction\":\"MONITOR\",\"routeManagementTargetTypes\":[\"InternetGateway\"]},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\": \"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}}"`
         *
         * To use the distributed deployment model, you must set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `NULL` .
         * - Example: `NETWORK_FIREWALL` - Distributed deployment model with custom Availability Zone configuration
         *
         * `"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"fragmentcustomactionname\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\", \"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}},{\"actionName\":\"fragmentcustomactionname\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"fragmentmetricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"firewallCreationConfig\":{ \"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]},{\"availabilityZoneName\":\"us-east-1b\",\"allowedIPV4CidrList\":[ \"10.0.0.0/28\"]}]} },\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":null,\"routeManagementAction\":\"OFF\",\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":boolean}}"`
         *
         * With custom Availability Zone configuration, you define which specific Availability Zones to create endpoints in by configuring `firewallCreationConfig` . To configure the Availability Zones in `firewallCreationConfig` , specify either the `availabilityZoneName` or `availabilityZoneId` parameter, not both parameters.
         *
         * To use the distributed deployment model, you must set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `NULL` .
         * - Example: `NETWORK_FIREWALL` - Distributed deployment model with custom Availability Zone configuration and route management
         *
         * `"{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"fragmentcustomactionname\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}},{\"actionName\":\"fragmentcustomactionname\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"fragmentmetricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"firewallCreationConfig\":{\"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]},{\"availabilityZoneName\":\"us-east-1b\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]}]}},\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":null,\"routeManagementAction\":\"MONITOR\",\"routeManagementTargetTypes\":[\"InternetGateway\"],\"routeManagementConfig\":{\"allowCrossAZTrafficIfNoEndpoint\":true}},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":boolean}}"`
         *
         * To use the distributed deployment model, you must set [PolicyOption](https://docs.aws.amazon.com/fms/2018-01-01/APIReference/API_PolicyOption.html) to `NULL` .
         * - Example: `THIRD_PARTY_FIREWALL`
         *
         * `"{ "type":"THIRD_PARTY_FIREWALL", "thirdPartyFirewall":"PALO_ALTO_NETWORKS_CLOUD_NGFW", "thirdPartyFirewallConfig":{ "thirdPartyFirewallPolicyList":["global-1"] }, "firewallDeploymentModel":{ "distributedFirewallDeploymentModel":{ "distributedFirewallOrchestrationConfig":{ "firewallCreationConfig":{ "endpointLocation":{ "availabilityZoneConfigList":[ { "availabilityZoneName":"${AvailabilityZone}" } ] } }, "allowedIPV4CidrList":[ ] } } } }"`
         * - Example: `SECURITY_GROUPS_COMMON`
         *
         * `"{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false, \"applyToAllEC2InstanceENIs\":false,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"`
         * - Example: `SECURITY_GROUPS_COMMON` - Security group tag distribution
         *
         * `""{\"type\":\"SECURITY_GROUPS_COMMON\",\"securityGroups\":[{\"id\":\"sg-000e55995d61a06bd\"}],\"revertManualSecurityGroupChanges\":true,\"exclusiveResourceSecurityGroupManagement\":false,\"applyToAllEC2InstanceENIs\":false,\"includeSharedVPC\":false,\"enableTagDistribution\":true}""`
         *
         * Firewall Manager automatically distributes tags from the primary group to the security groups created by this policy. To use security group tag distribution, you must also set `revertManualSecurityGroupChanges` to `true` , otherwise Firewall Manager won't be able to create the policy. When you enable `revertManualSecurityGroupChanges` , Firewall Manager identifies and reports when the security groups created by this policy become non-compliant.
         *
         * Firewall Manager won't distrubute system tags added by AWS services into the replica security groups. System tags begin with the `aws:` prefix.
         * - Example: Shared VPCs. Apply the preceding policy to resources in shared VPCs as well as to those in VPCs that the account owns
         *
         * `"{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false, \"applyToAllEC2InstanceENIs\":false,\"includeSharedVPC\":true,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"`
         * - Example: `SECURITY_GROUPS_CONTENT_AUDIT`
         *
         * `"{\"type\":\"SECURITY_GROUPS_CONTENT_AUDIT\",\"securityGroups\":[{\"id\":\"sg-000e55995d61a06bd\"}],\"securityGroupAction\":{\"type\":\"ALLOW\"}}"`
         *
         * The security group action for content audit can be `ALLOW` or `DENY` . For `ALLOW` , all in-scope security group rules must be within the allowed range of the policy's security group rules. For `DENY` , all in-scope security group rules must not contain a value or a range that matches a rule value or range in the policy security group.
         * - Example: `SECURITY_GROUPS_USAGE_AUDIT`
         *
         * `"{\"type\":\"SECURITY_GROUPS_USAGE_AUDIT\",\"deleteUnusedSecurityGroups\":true,\"coalesceRedundantSecurityGroups\":true}"`
         * - Specification for `SHIELD_ADVANCED` for Amazon CloudFront distributions
         *
         * `"{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED|IGNORED|DISABLED\", \"automaticResponseAction\":\"BLOCK|COUNT\"}, \"overrideCustomerWebaclClassic\":true|false}"`
         *
         * For example: `"{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED\", \"automaticResponseAction\":\"COUNT\"}}"`
         *
         * The default value for `automaticResponseStatus` is `IGNORED` . The value for `automaticResponseAction` is only required when `automaticResponseStatus` is set to `ENABLED` . The default value for `overrideCustomerWebaclClassic` is `false` .
         *
         * For other resource types that you can protect with a Shield Advanced policy, this `ManagedServiceData` configuration is an empty string.
         * - Example: `WAFV2`
         *
         * `"{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesAmazonIpReputationList\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[{\"name\":\"NoUserAgent_HEADER\"}]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":{\"logDestinationConfigs\":[\"arn:aws:firehose:us-west-2:12345678912:deliverystream/aws-waf-logs-fms-admin-destination\"],\"redactedFields\":[{\"redactedFieldType\":\"SingleHeader\",\"redactedFieldValue\":\"Cookies\"},{\"redactedFieldType\":\"Method\"}]}}"`
         *
         * In the `loggingConfiguration` , you can specify one `logDestinationConfigs` , you can optionally provide up to 20 `redactedFields` , and the `RedactedFieldType` must be one of `URI` , `QUERY_STRING` , `HEADER` , or `METHOD` .
         * - Example: `WAFV2` - AWS Firewall Manager support for AWS WAF managed rule group versioning
         *
         * `"{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"versionEnabled\":true,\"version\":\"Version_2.0\",\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesCommonRuleSet\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[{\"name\":\"NoUserAgent_HEADER\"}]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":{\"logDestinationConfigs\":[\"arn:aws:firehose:us-west-2:12345678912:deliverystream/aws-waf-logs-fms-admin-destination\"],\"redactedFields\":[{\"redactedFieldType\":\"SingleHeader\",\"redactedFieldValue\":\"Cookies\"},{\"redactedFieldType\":\"Method\"}]}}"`
         *
         * To use a specific version of a AWS WAF managed rule group in your Firewall Manager policy, you must set `versionEnabled` to `true` , and set `version` to the version you'd like to use. If you don't set `versionEnabled` to `true` , or if you omit `versionEnabled` , then Firewall Manager uses the default version of the AWS WAF managed rule group.
         * - Example: `AWS WAF Classic`
         *
         * `"{\"type\": \"WAF\", \"ruleGroups\": [{\"id\":\"12345678-1bcd-9012-efga-0987654321ab\", \"overrideAction\" : {\"type\": \"COUNT\"}}], \"defaultAction\": {\"type\": \"BLOCK\"}}"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-securityservicepolicydata.html#cfn-fms-policy-securityservicepolicydata-managedservicedata
         */
        readonly managedServiceData?: string;
        /**
         * Contains the Network Firewall firewall policy options to configure a centralized deployment model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-securityservicepolicydata.html#cfn-fms-policy-securityservicepolicydata-policyoption
         */
        readonly policyOption?: CfnPolicy.PolicyOptionProperty | cdk.IResolvable;
        /**
         * The service that the policy is using to protect the resources. This specifies the type of policy that is created, either an AWS WAF policy, a Shield Advanced policy, or a security group policy. For security group policies, Firewall Manager supports one security group for each common policy and for each content audit policy. This is an adjustable limit that you can increase by contacting AWS Support .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-securityservicepolicydata.html#cfn-fms-policy-securityservicepolicydata-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `SecurityServicePolicyDataProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityServicePolicyDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_SecurityServicePolicyDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('managedServiceData', cdk.validateString)(properties.managedServiceData));
    errors.collect(cdk.propertyValidator('policyOption', CfnPolicy_PolicyOptionPropertyValidator)(properties.policyOption));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "SecurityServicePolicyDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.SecurityServicePolicyData` resource
 *
 * @param properties - the TypeScript properties of a `SecurityServicePolicyDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.SecurityServicePolicyData` resource.
 */
// @ts-ignore TS6133
function cfnPolicySecurityServicePolicyDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_SecurityServicePolicyDataPropertyValidator(properties).assertSuccess();
    return {
        ManagedServiceData: cdk.stringToCloudFormation(properties.managedServiceData),
        PolicyOption: cfnPolicyPolicyOptionPropertyToCloudFormation(properties.policyOption),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPolicySecurityServicePolicyDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.SecurityServicePolicyDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.SecurityServicePolicyDataProperty>();
    ret.addPropertyResult('managedServiceData', 'ManagedServiceData', properties.ManagedServiceData != null ? cfn_parse.FromCloudFormation.getString(properties.ManagedServiceData) : undefined);
    ret.addPropertyResult('policyOption', 'PolicyOption', properties.PolicyOption != null ? CfnPolicyPolicyOptionPropertyFromCloudFormation(properties.PolicyOption) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPolicy {
    /**
     * Configures the deployment model for the third-party firewall.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-thirdpartyfirewallpolicy.html
     */
    export interface ThirdPartyFirewallPolicyProperty {
        /**
         * Defines the deployment model to use for the third-party firewall policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fms-policy-thirdpartyfirewallpolicy.html#cfn-fms-policy-thirdpartyfirewallpolicy-firewalldeploymentmodel
         */
        readonly firewallDeploymentModel: string;
    }
}

/**
 * Determine whether the given properties match those of a `ThirdPartyFirewallPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ThirdPartyFirewallPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPolicy_ThirdPartyFirewallPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('firewallDeploymentModel', cdk.requiredValidator)(properties.firewallDeploymentModel));
    errors.collect(cdk.propertyValidator('firewallDeploymentModel', cdk.validateString)(properties.firewallDeploymentModel));
    return errors.wrap('supplied properties not correct for "ThirdPartyFirewallPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FMS::Policy.ThirdPartyFirewallPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ThirdPartyFirewallPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FMS::Policy.ThirdPartyFirewallPolicy` resource.
 */
// @ts-ignore TS6133
function cfnPolicyThirdPartyFirewallPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPolicy_ThirdPartyFirewallPolicyPropertyValidator(properties).assertSuccess();
    return {
        FirewallDeploymentModel: cdk.stringToCloudFormation(properties.firewallDeploymentModel),
    };
}

// @ts-ignore TS6133
function CfnPolicyThirdPartyFirewallPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.ThirdPartyFirewallPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.ThirdPartyFirewallPolicyProperty>();
    ret.addPropertyResult('firewallDeploymentModel', 'FirewallDeploymentModel', cfn_parse.FromCloudFormation.getString(properties.FirewallDeploymentModel));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
