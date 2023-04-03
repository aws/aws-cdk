// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:53:52.983Z","fingerprint":"PPZ/hwfO0V0As+PPNOV8mrJJptChw/PabOdcJ4fvWoQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html
 */
export interface CfnLoadBalancerProps {

    /**
     * The listeners for the load balancer. You can specify at most one listener per port.
     *
     * If you update the properties for a listener, AWS CloudFormation deletes the existing listener and creates a new one with the specified properties. While the new listener is being created, clients cannot connect to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-listeners
     */
    readonly listeners: Array<CfnLoadBalancer.ListenersProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Information about where and how access logs are stored for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-accessloggingpolicy
     */
    readonly accessLoggingPolicy?: CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable;

    /**
     * Information about a policy for application-controlled session stickiness.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-appcookiestickinesspolicy
     */
    readonly appCookieStickinessPolicy?: Array<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Availability Zones for the load balancer. For load balancers in a VPC, specify `Subnets` instead.
     *
     * Update requires replacement if you did not previously specify an Availability Zone or if you are removing all Availability Zones. Otherwise, update requires no interruption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-availabilityzones
     */
    readonly availabilityZones?: string[];

    /**
     * If enabled, the load balancer allows existing requests to complete before the load balancer shifts traffic away from a deregistered or unhealthy instance.
     *
     * For more information, see [Configure Connection Draining](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-conn-drain.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectiondrainingpolicy
     */
    readonly connectionDrainingPolicy?: CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable;

    /**
     * If enabled, the load balancer allows the connections to remain idle (no data is sent over the connection) for the specified duration.
     *
     * By default, Elastic Load Balancing maintains a 60-second idle connection timeout for both front-end and back-end connections of your load balancer. For more information, see [Configure Idle Connection Timeout](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-idle-timeout.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectionsettings
     */
    readonly connectionSettings?: CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable;

    /**
     * If enabled, the load balancer routes the request traffic evenly across all instances regardless of the Availability Zones.
     *
     * For more information, see [Configure Cross-Zone Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-crosszone
     */
    readonly crossZone?: boolean | cdk.IResolvable;

    /**
     * The health check settings to use when evaluating the health of your EC2 instances.
     *
     * Update requires replacement if you did not previously specify health check settings or if you are removing the health check settings. Otherwise, update requires no interruption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-healthcheck
     */
    readonly healthCheck?: CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable;

    /**
     * The IDs of the instances for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-instances
     */
    readonly instances?: string[];

    /**
     * Information about a policy for duration-based session stickiness.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-lbcookiestickinesspolicy
     */
    readonly lbCookieStickinessPolicy?: Array<CfnLoadBalancer.LBCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the load balancer. This name must be unique within your set of load balancers for the region.
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) . If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-elbname
     */
    readonly loadBalancerName?: string;

    /**
     * The policies defined for your Classic Load Balancer. Specify only back-end server policies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-policies
     */
    readonly policies?: Array<CfnLoadBalancer.PoliciesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The type of load balancer. Valid only for load balancers in a VPC.
     *
     * If `Scheme` is `internet-facing` , the load balancer has a public DNS name that resolves to a public IP address.
     *
     * If `Scheme` is `internal` , the load balancer has a public DNS name that resolves to a private IP address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-scheme
     */
    readonly scheme?: string;

    /**
     * The security groups for the load balancer. Valid only for load balancers in a VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-securitygroups
     */
    readonly securityGroups?: string[];

    /**
     * The IDs of the subnets for the load balancer. You can specify at most one subnet per Availability Zone.
     *
     * Update requires replacement if you did not previously specify a subnet or if you are removing all subnets. Otherwise, update requires no interruption. To update to a different subnet in the current Availability Zone, you must first update to a subnet in a different Availability Zone, then update to the new subnet in the original Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-subnets
     */
    readonly subnets?: string[];

    /**
     * The tags associated with a load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-elasticloadbalancing-loadbalancer-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLoggingPolicy', CfnLoadBalancer_AccessLoggingPolicyPropertyValidator)(properties.accessLoggingPolicy));
    errors.collect(cdk.propertyValidator('appCookieStickinessPolicy', cdk.listValidator(CfnLoadBalancer_AppCookieStickinessPolicyPropertyValidator))(properties.appCookieStickinessPolicy));
    errors.collect(cdk.propertyValidator('availabilityZones', cdk.listValidator(cdk.validateString))(properties.availabilityZones));
    errors.collect(cdk.propertyValidator('connectionDrainingPolicy', CfnLoadBalancer_ConnectionDrainingPolicyPropertyValidator)(properties.connectionDrainingPolicy));
    errors.collect(cdk.propertyValidator('connectionSettings', CfnLoadBalancer_ConnectionSettingsPropertyValidator)(properties.connectionSettings));
    errors.collect(cdk.propertyValidator('crossZone', cdk.validateBoolean)(properties.crossZone));
    errors.collect(cdk.propertyValidator('healthCheck', CfnLoadBalancer_HealthCheckPropertyValidator)(properties.healthCheck));
    errors.collect(cdk.propertyValidator('instances', cdk.listValidator(cdk.validateString))(properties.instances));
    errors.collect(cdk.propertyValidator('lbCookieStickinessPolicy', cdk.listValidator(CfnLoadBalancer_LBCookieStickinessPolicyPropertyValidator))(properties.lbCookieStickinessPolicy));
    errors.collect(cdk.propertyValidator('listeners', cdk.requiredValidator)(properties.listeners));
    errors.collect(cdk.propertyValidator('listeners', cdk.listValidator(CfnLoadBalancer_ListenersPropertyValidator))(properties.listeners));
    errors.collect(cdk.propertyValidator('loadBalancerName', cdk.validateString)(properties.loadBalancerName));
    errors.collect(cdk.propertyValidator('policies', cdk.listValidator(CfnLoadBalancer_PoliciesPropertyValidator))(properties.policies));
    errors.collect(cdk.propertyValidator('scheme', cdk.validateString)(properties.scheme));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLoadBalancerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancerPropsValidator(properties).assertSuccess();
    return {
        Listeners: cdk.listMapper(cfnLoadBalancerListenersPropertyToCloudFormation)(properties.listeners),
        AccessLoggingPolicy: cfnLoadBalancerAccessLoggingPolicyPropertyToCloudFormation(properties.accessLoggingPolicy),
        AppCookieStickinessPolicy: cdk.listMapper(cfnLoadBalancerAppCookieStickinessPolicyPropertyToCloudFormation)(properties.appCookieStickinessPolicy),
        AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
        ConnectionDrainingPolicy: cfnLoadBalancerConnectionDrainingPolicyPropertyToCloudFormation(properties.connectionDrainingPolicy),
        ConnectionSettings: cfnLoadBalancerConnectionSettingsPropertyToCloudFormation(properties.connectionSettings),
        CrossZone: cdk.booleanToCloudFormation(properties.crossZone),
        HealthCheck: cfnLoadBalancerHealthCheckPropertyToCloudFormation(properties.healthCheck),
        Instances: cdk.listMapper(cdk.stringToCloudFormation)(properties.instances),
        LBCookieStickinessPolicy: cdk.listMapper(cfnLoadBalancerLBCookieStickinessPolicyPropertyToCloudFormation)(properties.lbCookieStickinessPolicy),
        LoadBalancerName: cdk.stringToCloudFormation(properties.loadBalancerName),
        Policies: cdk.listMapper(cfnLoadBalancerPoliciesPropertyToCloudFormation)(properties.policies),
        Scheme: cdk.stringToCloudFormation(properties.scheme),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerProps>();
    ret.addPropertyResult('listeners', 'Listeners', cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerListenersPropertyFromCloudFormation)(properties.Listeners));
    ret.addPropertyResult('accessLoggingPolicy', 'AccessLoggingPolicy', properties.AccessLoggingPolicy != null ? CfnLoadBalancerAccessLoggingPolicyPropertyFromCloudFormation(properties.AccessLoggingPolicy) : undefined);
    ret.addPropertyResult('appCookieStickinessPolicy', 'AppCookieStickinessPolicy', properties.AppCookieStickinessPolicy != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerAppCookieStickinessPolicyPropertyFromCloudFormation)(properties.AppCookieStickinessPolicy) : undefined);
    ret.addPropertyResult('availabilityZones', 'AvailabilityZones', properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AvailabilityZones) : undefined);
    ret.addPropertyResult('connectionDrainingPolicy', 'ConnectionDrainingPolicy', properties.ConnectionDrainingPolicy != null ? CfnLoadBalancerConnectionDrainingPolicyPropertyFromCloudFormation(properties.ConnectionDrainingPolicy) : undefined);
    ret.addPropertyResult('connectionSettings', 'ConnectionSettings', properties.ConnectionSettings != null ? CfnLoadBalancerConnectionSettingsPropertyFromCloudFormation(properties.ConnectionSettings) : undefined);
    ret.addPropertyResult('crossZone', 'CrossZone', properties.CrossZone != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrossZone) : undefined);
    ret.addPropertyResult('healthCheck', 'HealthCheck', properties.HealthCheck != null ? CfnLoadBalancerHealthCheckPropertyFromCloudFormation(properties.HealthCheck) : undefined);
    ret.addPropertyResult('instances', 'Instances', properties.Instances != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Instances) : undefined);
    ret.addPropertyResult('lbCookieStickinessPolicy', 'LBCookieStickinessPolicy', properties.LBCookieStickinessPolicy != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerLBCookieStickinessPolicyPropertyFromCloudFormation)(properties.LBCookieStickinessPolicy) : undefined);
    ret.addPropertyResult('loadBalancerName', 'LoadBalancerName', properties.LoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName) : undefined);
    ret.addPropertyResult('policies', 'Policies', properties.Policies != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerPoliciesPropertyFromCloudFormation)(properties.Policies) : undefined);
    ret.addPropertyResult('scheme', 'Scheme', properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined);
    ret.addPropertyResult('securityGroups', 'SecurityGroups', properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', properties.Subnets != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Subnets) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElasticLoadBalancing::LoadBalancer`
 *
 * Specifies a Classic Load Balancer.
 *
 * You can specify the `AvailabilityZones` or `Subnets` property, but not both.
 *
 * If this resource has a public IP address and is also in a VPC that is defined in the same template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the VPC-gateway attachment.
 *
 * @cloudformationResource AWS::ElasticLoadBalancing::LoadBalancer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html
 */
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancing::LoadBalancer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLoadBalancerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLoadBalancer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Route 53 hosted zone that is associated with the load balancer. Internal-facing load balancers don't use this value, use `DNSName` instead.
     * @cloudformationAttribute CanonicalHostedZoneName
     */
    public readonly attrCanonicalHostedZoneName: string;

    /**
     * The ID of the Route 53 hosted zone name that is associated with the load balancer.
     * @cloudformationAttribute CanonicalHostedZoneNameID
     */
    public readonly attrCanonicalHostedZoneNameId: string;

    /**
     * The DNS name for the load balancer.
     * @cloudformationAttribute DNSName
     */
    public readonly attrDnsName: string;

    /**
     * The name of the security group that you can use as part of your inbound rules for your load balancer's back-end instances.
     * @cloudformationAttribute SourceSecurityGroup.GroupName
     */
    public readonly attrSourceSecurityGroupGroupName: string;

    /**
     * The owner of the source security group.
     * @cloudformationAttribute SourceSecurityGroup.OwnerAlias
     */
    public readonly attrSourceSecurityGroupOwnerAlias: string;

    /**
     * The listeners for the load balancer. You can specify at most one listener per port.
     *
     * If you update the properties for a listener, AWS CloudFormation deletes the existing listener and creates a new one with the specified properties. While the new listener is being created, clients cannot connect to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-listeners
     */
    public listeners: Array<CfnLoadBalancer.ListenersProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Information about where and how access logs are stored for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-accessloggingpolicy
     */
    public accessLoggingPolicy: CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable | undefined;

    /**
     * Information about a policy for application-controlled session stickiness.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-appcookiestickinesspolicy
     */
    public appCookieStickinessPolicy: Array<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Availability Zones for the load balancer. For load balancers in a VPC, specify `Subnets` instead.
     *
     * Update requires replacement if you did not previously specify an Availability Zone or if you are removing all Availability Zones. Otherwise, update requires no interruption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-availabilityzones
     */
    public availabilityZones: string[] | undefined;

    /**
     * If enabled, the load balancer allows existing requests to complete before the load balancer shifts traffic away from a deregistered or unhealthy instance.
     *
     * For more information, see [Configure Connection Draining](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-conn-drain.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectiondrainingpolicy
     */
    public connectionDrainingPolicy: CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable | undefined;

    /**
     * If enabled, the load balancer allows the connections to remain idle (no data is sent over the connection) for the specified duration.
     *
     * By default, Elastic Load Balancing maintains a 60-second idle connection timeout for both front-end and back-end connections of your load balancer. For more information, see [Configure Idle Connection Timeout](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-idle-timeout.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectionsettings
     */
    public connectionSettings: CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable | undefined;

    /**
     * If enabled, the load balancer routes the request traffic evenly across all instances regardless of the Availability Zones.
     *
     * For more information, see [Configure Cross-Zone Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html) in the *Classic Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-crosszone
     */
    public crossZone: boolean | cdk.IResolvable | undefined;

    /**
     * The health check settings to use when evaluating the health of your EC2 instances.
     *
     * Update requires replacement if you did not previously specify health check settings or if you are removing the health check settings. Otherwise, update requires no interruption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-healthcheck
     */
    public healthCheck: CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable | undefined;

    /**
     * The IDs of the instances for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-instances
     */
    public instances: string[] | undefined;

    /**
     * Information about a policy for duration-based session stickiness.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-lbcookiestickinesspolicy
     */
    public lbCookieStickinessPolicy: Array<CfnLoadBalancer.LBCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the load balancer. This name must be unique within your set of load balancers for the region.
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) . If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-elbname
     */
    public loadBalancerName: string | undefined;

    /**
     * The policies defined for your Classic Load Balancer. Specify only back-end server policies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-policies
     */
    public policies: Array<CfnLoadBalancer.PoliciesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The type of load balancer. Valid only for load balancers in a VPC.
     *
     * If `Scheme` is `internet-facing` , the load balancer has a public DNS name that resolves to a public IP address.
     *
     * If `Scheme` is `internal` , the load balancer has a public DNS name that resolves to a private IP address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-scheme
     */
    public scheme: string | undefined;

    /**
     * The security groups for the load balancer. Valid only for load balancers in a VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-securitygroups
     */
    public securityGroups: string[] | undefined;

    /**
     * The IDs of the subnets for the load balancer. You can specify at most one subnet per Availability Zone.
     *
     * Update requires replacement if you did not previously specify a subnet or if you are removing all subnets. Otherwise, update requires no interruption. To update to a different subnet in the current Availability Zone, you must first update to a subnet in a different Availability Zone, then update to the new subnet in the original Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-subnets
     */
    public subnets: string[] | undefined;

    /**
     * The tags associated with a load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-elasticloadbalancing-loadbalancer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ElasticLoadBalancing::LoadBalancer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps) {
        super(scope, id, { type: CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'listeners', this);
        this.attrCanonicalHostedZoneName = cdk.Token.asString(this.getAtt('CanonicalHostedZoneName', cdk.ResolutionTypeHint.STRING));
        this.attrCanonicalHostedZoneNameId = cdk.Token.asString(this.getAtt('CanonicalHostedZoneNameID', cdk.ResolutionTypeHint.STRING));
        this.attrDnsName = cdk.Token.asString(this.getAtt('DNSName', cdk.ResolutionTypeHint.STRING));
        this.attrSourceSecurityGroupGroupName = cdk.Token.asString(this.getAtt('SourceSecurityGroup.GroupName', cdk.ResolutionTypeHint.STRING));
        this.attrSourceSecurityGroupOwnerAlias = cdk.Token.asString(this.getAtt('SourceSecurityGroup.OwnerAlias', cdk.ResolutionTypeHint.STRING));

        this.listeners = props.listeners;
        this.accessLoggingPolicy = props.accessLoggingPolicy;
        this.appCookieStickinessPolicy = props.appCookieStickinessPolicy;
        this.availabilityZones = props.availabilityZones;
        this.connectionDrainingPolicy = props.connectionDrainingPolicy;
        this.connectionSettings = props.connectionSettings;
        this.crossZone = props.crossZone;
        this.healthCheck = props.healthCheck;
        this.instances = props.instances;
        this.lbCookieStickinessPolicy = props.lbCookieStickinessPolicy;
        this.loadBalancerName = props.loadBalancerName;
        this.policies = props.policies;
        this.scheme = props.scheme;
        this.securityGroups = props.securityGroups;
        this.subnets = props.subnets;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancing::LoadBalancer", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            listeners: this.listeners,
            accessLoggingPolicy: this.accessLoggingPolicy,
            appCookieStickinessPolicy: this.appCookieStickinessPolicy,
            availabilityZones: this.availabilityZones,
            connectionDrainingPolicy: this.connectionDrainingPolicy,
            connectionSettings: this.connectionSettings,
            crossZone: this.crossZone,
            healthCheck: this.healthCheck,
            instances: this.instances,
            lbCookieStickinessPolicy: this.lbCookieStickinessPolicy,
            loadBalancerName: this.loadBalancerName,
            policies: this.policies,
            scheme: this.scheme,
            securityGroups: this.securityGroups,
            subnets: this.subnets,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoadBalancerPropsToCloudFormation(props);
    }
}

export namespace CfnLoadBalancer {
    /**
     * Specifies where and how access logs are stored for your Classic Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html
     */
    export interface AccessLoggingPolicyProperty {
        /**
         * The interval for publishing the access logs. You can specify an interval of either 5 minutes or 60 minutes.
         *
         * Default: 60 minutes
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-emitinterval
         */
        readonly emitInterval?: number;
        /**
         * Specifies whether access logs are enabled for the load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The name of the Amazon S3 bucket where the access logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-s3bucketname
         */
        readonly s3BucketName: string;
        /**
         * The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod` . If the prefix is not provided, the log is placed at the root level of the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-s3bucketprefix
         */
        readonly s3BucketPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessLoggingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLoggingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_AccessLoggingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('emitInterval', cdk.validateNumber)(properties.emitInterval));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.requiredValidator)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3BucketPrefix', cdk.validateString)(properties.s3BucketPrefix));
    return errors.wrap('supplied properties not correct for "AccessLoggingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.AccessLoggingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AccessLoggingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.AccessLoggingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerAccessLoggingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_AccessLoggingPolicyPropertyValidator(properties).assertSuccess();
    return {
        EmitInterval: cdk.numberToCloudFormation(properties.emitInterval),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        S3BucketPrefix: cdk.stringToCloudFormation(properties.s3BucketPrefix),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerAccessLoggingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.AccessLoggingPolicyProperty>();
    ret.addPropertyResult('emitInterval', 'EmitInterval', properties.EmitInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.EmitInterval) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('s3BucketName', 'S3BucketName', cfn_parse.FromCloudFormation.getString(properties.S3BucketName));
    ret.addPropertyResult('s3BucketPrefix', 'S3BucketPrefix', properties.S3BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies a policy for application-controlled session stickiness for your Classic Load Balancer.
     *
     * To associate a policy with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html
     */
    export interface AppCookieStickinessPolicyProperty {
        /**
         * The name of the application cookie used for stickiness.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-cookiename
         */
        readonly cookieName: string;
        /**
         * The mnemonic name for the policy being created. The name must be unique within a set of policies for this load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-policyname
         */
        readonly policyName: string;
    }
}

/**
 * Determine whether the given properties match those of a `AppCookieStickinessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AppCookieStickinessPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_AppCookieStickinessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookieName', cdk.requiredValidator)(properties.cookieName));
    errors.collect(cdk.propertyValidator('cookieName', cdk.validateString)(properties.cookieName));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    return errors.wrap('supplied properties not correct for "AppCookieStickinessPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.AppCookieStickinessPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AppCookieStickinessPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.AppCookieStickinessPolicy` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerAppCookieStickinessPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_AppCookieStickinessPolicyPropertyValidator(properties).assertSuccess();
    return {
        CookieName: cdk.stringToCloudFormation(properties.cookieName),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerAppCookieStickinessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.AppCookieStickinessPolicyProperty>();
    ret.addPropertyResult('cookieName', 'CookieName', cfn_parse.FromCloudFormation.getString(properties.CookieName));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies the connection draining settings for your Classic Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html
     */
    export interface ConnectionDrainingPolicyProperty {
        /**
         * Specifies whether connection draining is enabled for the load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html#cfn-elb-connectiondrainingpolicy-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The maximum time, in seconds, to keep the existing connections open before deregistering the instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html#cfn-elb-connectiondrainingpolicy-timeout
         */
        readonly timeout?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectionDrainingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionDrainingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_ConnectionDrainingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('timeout', cdk.validateNumber)(properties.timeout));
    return errors.wrap('supplied properties not correct for "ConnectionDrainingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.ConnectionDrainingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ConnectionDrainingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.ConnectionDrainingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerConnectionDrainingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_ConnectionDrainingPolicyPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Timeout: cdk.numberToCloudFormation(properties.timeout),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerConnectionDrainingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ConnectionDrainingPolicyProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies the idle timeout value for your Classic Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectionsettings.html
     */
    export interface ConnectionSettingsProperty {
        /**
         * The time, in seconds, that the connection is allowed to be idle (no data has been sent over the connection) before it is closed by the load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectionsettings.html#cfn-elb-connectionsettings-idletimeout
         */
        readonly idleTimeout: number;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectionSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_ConnectionSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idleTimeout', cdk.requiredValidator)(properties.idleTimeout));
    errors.collect(cdk.propertyValidator('idleTimeout', cdk.validateNumber)(properties.idleTimeout));
    return errors.wrap('supplied properties not correct for "ConnectionSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.ConnectionSettings` resource
 *
 * @param properties - the TypeScript properties of a `ConnectionSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.ConnectionSettings` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerConnectionSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_ConnectionSettingsPropertyValidator(properties).assertSuccess();
    return {
        IdleTimeout: cdk.numberToCloudFormation(properties.idleTimeout),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerConnectionSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ConnectionSettingsProperty>();
    ret.addPropertyResult('idleTimeout', 'IdleTimeout', cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeout));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies health check settings for your Classic Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html
     */
    export interface HealthCheckProperty {
        /**
         * The number of consecutive health checks successes required before moving the instance to the `Healthy` state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html#cfn-elb-healthcheck-healthythreshold
         */
        readonly healthyThreshold: string;
        /**
         * The approximate interval, in seconds, between health checks of an individual instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html#cfn-elb-healthcheck-interval
         */
        readonly interval: string;
        /**
         * The instance being checked. The protocol is either TCP, HTTP, HTTPS, or SSL. The range of valid ports is one (1) through 65535.
         *
         * TCP is the default, specified as a TCP: port pair, for example "TCP:5000". In this case, a health check simply attempts to open a TCP connection to the instance on the specified port. Failure to connect within the configured timeout is considered unhealthy.
         *
         * SSL is also specified as SSL: port pair, for example, SSL:5000.
         *
         * For HTTP/HTTPS, you must include a ping path in the string. HTTP is specified as a HTTP:port;/;PathToPing; grouping, for example "HTTP:80/weather/us/wa/seattle". In this case, a HTTP GET request is issued to the instance on the given port and path. Any answer other than "200 OK" within the timeout period is considered unhealthy.
         *
         * The total length of the HTTP ping target must be 1024 16-bit Unicode characters or less.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html#cfn-elb-healthcheck-target
         */
        readonly target: string;
        /**
         * The amount of time, in seconds, during which no response means a failed health check.
         *
         * This value must be less than the `Interval` value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html#cfn-elb-healthcheck-timeout
         */
        readonly timeout: string;
        /**
         * The number of consecutive health check failures required before moving the instance to the `Unhealthy` state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-health-check.html#cfn-elb-healthcheck-unhealthythreshold
         */
        readonly unhealthyThreshold: string;
    }
}

/**
 * Determine whether the given properties match those of a `HealthCheckProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_HealthCheckPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.requiredValidator)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.validateString)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('interval', cdk.requiredValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('interval', cdk.validateString)(properties.interval));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    errors.collect(cdk.propertyValidator('timeout', cdk.requiredValidator)(properties.timeout));
    errors.collect(cdk.propertyValidator('timeout', cdk.validateString)(properties.timeout));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.requiredValidator)(properties.unhealthyThreshold));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.validateString)(properties.unhealthyThreshold));
    return errors.wrap('supplied properties not correct for "HealthCheckProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.HealthCheck` resource
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.HealthCheck` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerHealthCheckPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_HealthCheckPropertyValidator(properties).assertSuccess();
    return {
        HealthyThreshold: cdk.stringToCloudFormation(properties.healthyThreshold),
        Interval: cdk.stringToCloudFormation(properties.interval),
        Target: cdk.stringToCloudFormation(properties.target),
        Timeout: cdk.stringToCloudFormation(properties.timeout),
        UnhealthyThreshold: cdk.stringToCloudFormation(properties.unhealthyThreshold),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerHealthCheckPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.HealthCheckProperty>();
    ret.addPropertyResult('healthyThreshold', 'HealthyThreshold', cfn_parse.FromCloudFormation.getString(properties.HealthyThreshold));
    ret.addPropertyResult('interval', 'Interval', cfn_parse.FromCloudFormation.getString(properties.Interval));
    ret.addPropertyResult('target', 'Target', cfn_parse.FromCloudFormation.getString(properties.Target));
    ret.addPropertyResult('timeout', 'Timeout', cfn_parse.FromCloudFormation.getString(properties.Timeout));
    ret.addPropertyResult('unhealthyThreshold', 'UnhealthyThreshold', cfn_parse.FromCloudFormation.getString(properties.UnhealthyThreshold));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies a policy for duration-based session stickiness for your Classic Load Balancer.
     *
     * To associate a policy with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html
     */
    export interface LBCookieStickinessPolicyProperty {
        /**
         * The time period, in seconds, after which the cookie should be considered stale. If this parameter is not specified, the stickiness session lasts for the duration of the browser session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html#cfn-elb-lbcookiestickinesspolicy-cookieexpirationperiod
         */
        readonly cookieExpirationPeriod?: string;
        /**
         * The name of the policy. This name must be unique within the set of policies for this load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html#cfn-elb-lbcookiestickinesspolicy-policyname
         */
        readonly policyName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LBCookieStickinessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LBCookieStickinessPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_LBCookieStickinessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookieExpirationPeriod', cdk.validateString)(properties.cookieExpirationPeriod));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    return errors.wrap('supplied properties not correct for "LBCookieStickinessPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.LBCookieStickinessPolicy` resource
 *
 * @param properties - the TypeScript properties of a `LBCookieStickinessPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.LBCookieStickinessPolicy` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerLBCookieStickinessPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_LBCookieStickinessPolicyPropertyValidator(properties).assertSuccess();
    return {
        CookieExpirationPeriod: cdk.stringToCloudFormation(properties.cookieExpirationPeriod),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerLBCookieStickinessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.LBCookieStickinessPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.LBCookieStickinessPolicyProperty>();
    ret.addPropertyResult('cookieExpirationPeriod', 'CookieExpirationPeriod', properties.CookieExpirationPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.CookieExpirationPeriod) : undefined);
    ret.addPropertyResult('policyName', 'PolicyName', properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies a listener for your Classic Load Balancer.
     *
     * Modifying any property replaces the listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html
     */
    export interface ListenersProperty {
        /**
         * The port on which the instance is listening.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-instanceport
         */
        readonly instancePort: string;
        /**
         * The protocol to use for routing traffic to instances: HTTP, HTTPS, TCP, or SSL.
         *
         * If the front-end protocol is TCP or SSL, the back-end protocol must be TCP or SSL. If the front-end protocol is HTTP or HTTPS, the back-end protocol must be HTTP or HTTPS.
         *
         * If there is another listener with the same `InstancePort` whose `InstanceProtocol` is secure, (HTTPS or SSL), the listener's `InstanceProtocol` must also be secure.
         *
         * If there is another listener with the same `InstancePort` whose `InstanceProtocol` is HTTP or TCP, the listener's `InstanceProtocol` must be HTTP or TCP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-instanceprotocol
         */
        readonly instanceProtocol?: string;
        /**
         * The port on which the load balancer is listening. On EC2-VPC, you can specify any port from the range 1-65535. On EC2-Classic, you can specify any port from the following list: 25, 80, 443, 465, 587, 1024-65535.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-loadbalancerport
         */
        readonly loadBalancerPort: string;
        /**
         * The names of the policies to associate with the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames
         */
        readonly policyNames?: string[];
        /**
         * The load balancer transport protocol to use for routing: HTTP, HTTPS, TCP, or SSL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-protocol
         */
        readonly protocol: string;
        /**
         * The Amazon Resource Name (ARN) of the server certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-sslcertificateid
         */
        readonly sslCertificateId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ListenersProperty`
 *
 * @param properties - the TypeScript properties of a `ListenersProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_ListenersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('instancePort', cdk.requiredValidator)(properties.instancePort));
    errors.collect(cdk.propertyValidator('instancePort', cdk.validateString)(properties.instancePort));
    errors.collect(cdk.propertyValidator('instanceProtocol', cdk.validateString)(properties.instanceProtocol));
    errors.collect(cdk.propertyValidator('loadBalancerPort', cdk.requiredValidator)(properties.loadBalancerPort));
    errors.collect(cdk.propertyValidator('loadBalancerPort', cdk.validateString)(properties.loadBalancerPort));
    errors.collect(cdk.propertyValidator('policyNames', cdk.listValidator(cdk.validateString))(properties.policyNames));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('sslCertificateId', cdk.validateString)(properties.sslCertificateId));
    return errors.wrap('supplied properties not correct for "ListenersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.Listeners` resource
 *
 * @param properties - the TypeScript properties of a `ListenersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.Listeners` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerListenersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_ListenersPropertyValidator(properties).assertSuccess();
    return {
        InstancePort: cdk.stringToCloudFormation(properties.instancePort),
        InstanceProtocol: cdk.stringToCloudFormation(properties.instanceProtocol),
        LoadBalancerPort: cdk.stringToCloudFormation(properties.loadBalancerPort),
        PolicyNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.policyNames),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        SSLCertificateId: cdk.stringToCloudFormation(properties.sslCertificateId),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerListenersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.ListenersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ListenersProperty>();
    ret.addPropertyResult('instancePort', 'InstancePort', cfn_parse.FromCloudFormation.getString(properties.InstancePort));
    ret.addPropertyResult('instanceProtocol', 'InstanceProtocol', properties.InstanceProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceProtocol) : undefined);
    ret.addPropertyResult('loadBalancerPort', 'LoadBalancerPort', cfn_parse.FromCloudFormation.getString(properties.LoadBalancerPort));
    ret.addPropertyResult('policyNames', 'PolicyNames', properties.PolicyNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PolicyNames) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('sslCertificateId', 'SSLCertificateId', properties.SSLCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.SSLCertificateId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies policies for your Classic Load Balancer.
     *
     * To associate policies with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html
     */
    export interface PoliciesProperty {
        /**
         * The policy attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html#cfn-ec2-elb-policy-attributes
         */
        readonly attributes: Array<any | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The instance ports for the policy. Required only for some policy types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html#cfn-ec2-elb-policy-instanceports
         */
        readonly instancePorts?: string[];
        /**
         * The load balancer ports for the policy. Required only for some policy types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html#cfn-ec2-elb-policy-loadbalancerports
         */
        readonly loadBalancerPorts?: string[];
        /**
         * The name of the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html#cfn-ec2-elb-policy-policyname
         */
        readonly policyName: string;
        /**
         * The name of the policy type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-policy.html#cfn-ec2-elb-policy-policytype
         */
        readonly policyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `PoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `PoliciesProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_PoliciesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(cdk.validateObject))(properties.attributes));
    errors.collect(cdk.propertyValidator('instancePorts', cdk.listValidator(cdk.validateString))(properties.instancePorts));
    errors.collect(cdk.propertyValidator('loadBalancerPorts', cdk.listValidator(cdk.validateString))(properties.loadBalancerPorts));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyType', cdk.requiredValidator)(properties.policyType));
    errors.collect(cdk.propertyValidator('policyType', cdk.validateString)(properties.policyType));
    return errors.wrap('supplied properties not correct for "PoliciesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.Policies` resource
 *
 * @param properties - the TypeScript properties of a `PoliciesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancing::LoadBalancer.Policies` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerPoliciesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_PoliciesPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cdk.objectToCloudFormation)(properties.attributes),
        InstancePorts: cdk.listMapper(cdk.stringToCloudFormation)(properties.instancePorts),
        LoadBalancerPorts: cdk.listMapper(cdk.stringToCloudFormation)(properties.loadBalancerPorts),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
        PolicyType: cdk.stringToCloudFormation(properties.policyType),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.PoliciesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.PoliciesProperty>();
    ret.addPropertyResult('attributes', 'Attributes', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Attributes));
    ret.addPropertyResult('instancePorts', 'InstancePorts', properties.InstancePorts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InstancePorts) : undefined);
    ret.addPropertyResult('loadBalancerPorts', 'LoadBalancerPorts', properties.LoadBalancerPorts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.LoadBalancerPorts) : undefined);
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addPropertyResult('policyType', 'PolicyType', cfn_parse.FromCloudFormation.getString(properties.PolicyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
