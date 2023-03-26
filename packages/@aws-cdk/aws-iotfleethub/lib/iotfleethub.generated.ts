// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:37.876Z","fingerprint":"FvaxJiHLpyVQw1Dk4Hr70ltKpuKSmyHbYIgrEHn2GiE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html
 */
export interface CfnApplicationProps {

    /**
     * The name of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationname
     */
    readonly applicationName: string;

    /**
     * The ARN of the role that the web application assumes when it interacts with AWS IoT Core .
     *
     * > The name of the role must be in the form `FleetHub_random_string` .
     *
     * Pattern: `^arn:[!-~]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-rolearn
     */
    readonly roleArn: string;

    /**
     * An optional description of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationdescription
     */
    readonly applicationDescription?: string;

    /**
     * A set of key/value pairs that you can use to manage the web application resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationDescription', cdk.validateString)(properties.applicationDescription));
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetHub::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetHub::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        ApplicationDescription: cdk.stringToCloudFormation(properties.applicationDescription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('applicationDescription', 'ApplicationDescription', properties.ApplicationDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetHub::Application`
 *
 * Represents a Fleet Hub for AWS IoT Device Management web application.
 *
 * @cloudformationResource AWS::IoTFleetHub::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetHub::Application";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the web application.
     * @cloudformationAttribute ApplicationArn
     */
    public readonly attrApplicationArn: string;

    /**
     * The date (in Unix epoch time) when the web application was created.
     * @cloudformationAttribute ApplicationCreationDate
     */
    public readonly attrApplicationCreationDate: number;

    /**
     * The unique Id of the web application.
     * @cloudformationAttribute ApplicationId
     */
    public readonly attrApplicationId: string;

    /**
     * The date (in Unix epoch time) when the web application was last updated.
     * @cloudformationAttribute ApplicationLastUpdateDate
     */
    public readonly attrApplicationLastUpdateDate: number;

    /**
     * The current state of the web application.
     * @cloudformationAttribute ApplicationState
     */
    public readonly attrApplicationState: string;

    /**
     * The URL of the web application.
     * @cloudformationAttribute ApplicationUrl
     */
    public readonly attrApplicationUrl: string;

    /**
     * A message that explains any failures included in the applicationState response field. This message explains failures in the `CreateApplication` and `DeleteApplication` actions.
     * @cloudformationAttribute ErrorMessage
     */
    public readonly attrErrorMessage: string;

    /**
     * The Id of the single sign-on client that you use to authenticate and authorize users on the web application.
     * @cloudformationAttribute SsoClientId
     */
    public readonly attrSsoClientId: string;

    /**
     * The name of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationname
     */
    public applicationName: string;

    /**
     * The ARN of the role that the web application assumes when it interacts with AWS IoT Core .
     *
     * > The name of the role must be in the form `FleetHub_random_string` .
     *
     * Pattern: `^arn:[!-~]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-rolearn
     */
    public roleArn: string;

    /**
     * An optional description of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationdescription
     */
    public applicationDescription: string | undefined;

    /**
     * A set of key/value pairs that you can use to manage the web application resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetHub::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrApplicationArn = cdk.Token.asString(this.getAtt('ApplicationArn', cdk.ResolutionTypeHint.STRING));
        this.attrApplicationCreationDate = cdk.Token.asNumber(this.getAtt('ApplicationCreationDate', cdk.ResolutionTypeHint.NUMBER));
        this.attrApplicationId = cdk.Token.asString(this.getAtt('ApplicationId', cdk.ResolutionTypeHint.STRING));
        this.attrApplicationLastUpdateDate = cdk.Token.asNumber(this.getAtt('ApplicationLastUpdateDate', cdk.ResolutionTypeHint.NUMBER));
        this.attrApplicationState = cdk.Token.asString(this.getAtt('ApplicationState', cdk.ResolutionTypeHint.STRING));
        this.attrApplicationUrl = cdk.Token.asString(this.getAtt('ApplicationUrl', cdk.ResolutionTypeHint.STRING));
        this.attrErrorMessage = cdk.Token.asString(this.getAtt('ErrorMessage', cdk.ResolutionTypeHint.STRING));
        this.attrSsoClientId = cdk.Token.asString(this.getAtt('SsoClientId', cdk.ResolutionTypeHint.STRING));

        this.applicationName = props.applicationName;
        this.roleArn = props.roleArn;
        this.applicationDescription = props.applicationDescription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetHub::Application", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            roleArn: this.roleArn,
            applicationDescription: this.applicationDescription,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}
