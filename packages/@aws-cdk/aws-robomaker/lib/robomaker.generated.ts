// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:59.163Z","fingerprint":"nVodRJ4I0UY3SmvRAtt0kADhn+x0I0AnvPlB73sg3D0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export interface CfnFleetProps {

    /**
     * The name of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-name
     */
    readonly name?: string;

    /**
     * The list of all tags added to the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFleetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::Fleet` resource
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::Fleet` resource.
 */
// @ts-ignore TS6133
function cfnFleetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFleetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::Fleet`
 *
 * > The following resource is now deprecated. This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::Fleet` resource creates an AWS RoboMaker fleet. Fleets contain robots and can receive deployments.
 *
 * @cloudformationResource AWS::RoboMaker::Fleet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::Fleet";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFleet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the fleet, such as `arn:aws:robomaker:us-west-2:123456789012:deployment-fleet/MyFleet/1539894765711` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-name
     */
    public name: string | undefined;

    /**
     * The list of all tags added to the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RoboMaker::Fleet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFleetProps = {}) {
        super(scope, id, { type: CfnFleet.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::Fleet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFleetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRobot`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export interface CfnRobotProps {

    /**
     * The architecture of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-architecture
     */
    readonly architecture: string;

    /**
     * The Greengrass group associated with the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-greengrassgroupid
     */
    readonly greengrassGroupId: string;

    /**
     * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-fleet
     */
    readonly fleet?: string;

    /**
     * The name of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-name
     */
    readonly name?: string;

    /**
     * A map that contains tag keys and tag values that are attached to the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnRobotProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotProps`
 *
 * @returns the result of the validation.
 */
function CfnRobotPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('architecture', cdk.requiredValidator)(properties.architecture));
    errors.collect(cdk.propertyValidator('architecture', cdk.validateString)(properties.architecture));
    errors.collect(cdk.propertyValidator('fleet', cdk.validateString)(properties.fleet));
    errors.collect(cdk.propertyValidator('greengrassGroupId', cdk.requiredValidator)(properties.greengrassGroupId));
    errors.collect(cdk.propertyValidator('greengrassGroupId', cdk.validateString)(properties.greengrassGroupId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRobotProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::Robot` resource
 *
 * @param properties - the TypeScript properties of a `CfnRobotProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::Robot` resource.
 */
// @ts-ignore TS6133
function cfnRobotPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRobotPropsValidator(properties).assertSuccess();
    return {
        Architecture: cdk.stringToCloudFormation(properties.architecture),
        GreengrassGroupId: cdk.stringToCloudFormation(properties.greengrassGroupId),
        Fleet: cdk.stringToCloudFormation(properties.fleet),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRobotPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotProps>();
    ret.addPropertyResult('architecture', 'Architecture', cfn_parse.FromCloudFormation.getString(properties.Architecture));
    ret.addPropertyResult('greengrassGroupId', 'GreengrassGroupId', cfn_parse.FromCloudFormation.getString(properties.GreengrassGroupId));
    ret.addPropertyResult('fleet', 'Fleet', properties.Fleet != null ? cfn_parse.FromCloudFormation.getString(properties.Fleet) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::Robot`
 *
 * > The following resource is now deprecated. This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot.
 *
 * @cloudformationResource AWS::RoboMaker::Robot
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export class CfnRobot extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::Robot";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobot {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRobotPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRobot(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the robot.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The architecture of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-architecture
     */
    public architecture: string;

    /**
     * The Greengrass group associated with the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-greengrassgroupid
     */
    public greengrassGroupId: string;

    /**
     * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-fleet
     */
    public fleet: string | undefined;

    /**
     * The name of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-name
     */
    public name: string | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RoboMaker::Robot`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotProps) {
        super(scope, id, { type: CfnRobot.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'architecture', this);
        cdk.requireProperty(props, 'greengrassGroupId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.architecture = props.architecture;
        this.greengrassGroupId = props.greengrassGroupId;
        this.fleet = props.fleet;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::Robot", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobot.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            architecture: this.architecture,
            greengrassGroupId: this.greengrassGroupId,
            fleet: this.fleet,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRobotPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRobotApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export interface CfnRobotApplicationProps {

    /**
     * The robot software suite used by the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-robotsoftwaresuite
     */
    readonly robotSoftwareSuite: CfnRobotApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-currentrevisionid
     */
    readonly currentRevisionId?: string;

    /**
     * The environment of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-environment
     */
    readonly environment?: string;

    /**
     * The name of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-name
     */
    readonly name?: string;

    /**
     * The sources of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-sources
     */
    readonly sources?: Array<CfnRobotApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A map that contains tag keys and tag values that are attached to the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnRobotApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnRobotApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('currentRevisionId', cdk.validateString)(properties.currentRevisionId));
    errors.collect(cdk.propertyValidator('environment', cdk.validateString)(properties.environment));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('robotSoftwareSuite', cdk.requiredValidator)(properties.robotSoftwareSuite));
    errors.collect(cdk.propertyValidator('robotSoftwareSuite', CfnRobotApplication_RobotSoftwareSuitePropertyValidator)(properties.robotSoftwareSuite));
    errors.collect(cdk.propertyValidator('sources', cdk.listValidator(CfnRobotApplication_SourceConfigPropertyValidator))(properties.sources));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRobotApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication` resource
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication` resource.
 */
// @ts-ignore TS6133
function cfnRobotApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRobotApplicationPropsValidator(properties).assertSuccess();
    return {
        RobotSoftwareSuite: cfnRobotApplicationRobotSoftwareSuitePropertyToCloudFormation(properties.robotSoftwareSuite),
        CurrentRevisionId: cdk.stringToCloudFormation(properties.currentRevisionId),
        Environment: cdk.stringToCloudFormation(properties.environment),
        Name: cdk.stringToCloudFormation(properties.name),
        Sources: cdk.listMapper(cfnRobotApplicationSourceConfigPropertyToCloudFormation)(properties.sources),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRobotApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplicationProps>();
    ret.addPropertyResult('robotSoftwareSuite', 'RobotSoftwareSuite', CfnRobotApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties.RobotSoftwareSuite));
    ret.addPropertyResult('currentRevisionId', 'CurrentRevisionId', properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getString(properties.Environment) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sources', 'Sources', properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnRobotApplicationSourceConfigPropertyFromCloudFormation)(properties.Sources) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::RobotApplication`
 *
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot application.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplication
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export class CfnRobotApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::RobotApplication";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRobotApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRobotApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the robot application.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The current revision id.
     * @cloudformationAttribute CurrentRevisionId
     */
    public readonly attrCurrentRevisionId: string;

    /**
     * The robot software suite used by the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-robotsoftwaresuite
     */
    public robotSoftwareSuite: CfnRobotApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-currentrevisionid
     */
    public currentRevisionId: string | undefined;

    /**
     * The environment of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-environment
     */
    public environment: string | undefined;

    /**
     * The name of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-name
     */
    public name: string | undefined;

    /**
     * The sources of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-sources
     */
    public sources: Array<CfnRobotApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RoboMaker::RobotApplication`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationProps) {
        super(scope, id, { type: CfnRobotApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'robotSoftwareSuite', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCurrentRevisionId = cdk.Token.asString(this.getAtt('CurrentRevisionId', cdk.ResolutionTypeHint.STRING));

        this.robotSoftwareSuite = props.robotSoftwareSuite;
        this.currentRevisionId = props.currentRevisionId;
        this.environment = props.environment;
        this.name = props.name;
        this.sources = props.sources;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::RobotApplication", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobotApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            robotSoftwareSuite: this.robotSoftwareSuite,
            currentRevisionId: this.currentRevisionId,
            environment: this.environment,
            name: this.name,
            sources: this.sources,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRobotApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnRobotApplication {
    /**
     * Information about a robot software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html
     */
    export interface RobotSoftwareSuiteProperty {
        /**
         * The name of the robot software suite. `General` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the robot software suite. Not applicable for General software suite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RobotSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
function CfnRobotApplication_RobotSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "RobotSoftwareSuiteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication.RobotSoftwareSuite` resource
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication.RobotSoftwareSuite` resource.
 */
// @ts-ignore TS6133
function cfnRobotApplicationRobotSoftwareSuitePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRobotApplication_RobotSoftwareSuitePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnRobotApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplication.RobotSoftwareSuiteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplication.RobotSoftwareSuiteProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRobotApplication {
    /**
     * Information about a source configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html
     */
    export interface SourceConfigProperty {
        /**
         * The target processor architecture for the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-architecture
         */
        readonly architecture: string;
        /**
         * The Amazon S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The s3 object key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3key
         */
        readonly s3Key: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnRobotApplication_SourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('architecture', cdk.requiredValidator)(properties.architecture));
    errors.collect(cdk.propertyValidator('architecture', cdk.validateString)(properties.architecture));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    return errors.wrap('supplied properties not correct for "SourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication.SourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplication.SourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnRobotApplicationSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRobotApplication_SourceConfigPropertyValidator(properties).assertSuccess();
    return {
        Architecture: cdk.stringToCloudFormation(properties.architecture),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
    };
}

// @ts-ignore TS6133
function CfnRobotApplicationSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplication.SourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplication.SourceConfigProperty>();
    ret.addPropertyResult('architecture', 'Architecture', cfn_parse.FromCloudFormation.getString(properties.Architecture));
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Key', 'S3Key', cfn_parse.FromCloudFormation.getString(properties.S3Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRobotApplicationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export interface CfnRobotApplicationVersionProps {

    /**
     * The application information for the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-application
     */
    readonly application: string;

    /**
     * The current revision id for the robot application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-currentrevisionid
     */
    readonly currentRevisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRobotApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnRobotApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('application', cdk.requiredValidator)(properties.application));
    errors.collect(cdk.propertyValidator('application', cdk.validateString)(properties.application));
    errors.collect(cdk.propertyValidator('currentRevisionId', cdk.validateString)(properties.currentRevisionId));
    return errors.wrap('supplied properties not correct for "CfnRobotApplicationVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplicationVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::RobotApplicationVersion` resource.
 */
// @ts-ignore TS6133
function cfnRobotApplicationVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRobotApplicationVersionPropsValidator(properties).assertSuccess();
    return {
        Application: cdk.stringToCloudFormation(properties.application),
        CurrentRevisionId: cdk.stringToCloudFormation(properties.currentRevisionId),
    };
}

// @ts-ignore TS6133
function CfnRobotApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplicationVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplicationVersionProps>();
    ret.addPropertyResult('application', 'Application', cfn_parse.FromCloudFormation.getString(properties.Application));
    ret.addPropertyResult('currentRevisionId', 'CurrentRevisionId', properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::RobotApplicationVersion`
 *
 * The `AWS::RoboMaker::RobotApplicationVersion` resource creates an AWS RoboMaker robot version.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplicationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export class CfnRobotApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::RobotApplicationVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplicationVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRobotApplicationVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRobotApplicationVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The robot application version.
     * @cloudformationAttribute ApplicationVersion
     */
    public readonly attrApplicationVersion: string;

    /**
     * The Amazon Resource Name (ARN) of the robot application version.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The application information for the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-application
     */
    public application: string;

    /**
     * The current revision id for the robot application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-currentrevisionid
     */
    public currentRevisionId: string | undefined;

    /**
     * Create a new `AWS::RoboMaker::RobotApplicationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationVersionProps) {
        super(scope, id, { type: CfnRobotApplicationVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'application', this);
        this.attrApplicationVersion = cdk.Token.asString(this.getAtt('ApplicationVersion', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.application = props.application;
        this.currentRevisionId = props.currentRevisionId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobotApplicationVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            application: this.application,
            currentRevisionId: this.currentRevisionId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRobotApplicationVersionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSimulationApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export interface CfnSimulationApplicationProps {

    /**
     * The robot software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-robotsoftwaresuite
     */
    readonly robotSoftwareSuite: CfnSimulationApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The simulation software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite
     */
    readonly simulationSoftwareSuite: CfnSimulationApplication.SimulationSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-currentrevisionid
     */
    readonly currentRevisionId?: string;

    /**
     * The environment of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-environment
     */
    readonly environment?: string;

    /**
     * The name of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-name
     */
    readonly name?: string;

    /**
     * The rendering engine for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-renderingengine
     */
    readonly renderingEngine?: CfnSimulationApplication.RenderingEngineProperty | cdk.IResolvable;

    /**
     * The sources of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-sources
     */
    readonly sources?: Array<CfnSimulationApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A map that contains tag keys and tag values that are attached to the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnSimulationApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('currentRevisionId', cdk.validateString)(properties.currentRevisionId));
    errors.collect(cdk.propertyValidator('environment', cdk.validateString)(properties.environment));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('renderingEngine', CfnSimulationApplication_RenderingEnginePropertyValidator)(properties.renderingEngine));
    errors.collect(cdk.propertyValidator('robotSoftwareSuite', cdk.requiredValidator)(properties.robotSoftwareSuite));
    errors.collect(cdk.propertyValidator('robotSoftwareSuite', CfnSimulationApplication_RobotSoftwareSuitePropertyValidator)(properties.robotSoftwareSuite));
    errors.collect(cdk.propertyValidator('simulationSoftwareSuite', cdk.requiredValidator)(properties.simulationSoftwareSuite));
    errors.collect(cdk.propertyValidator('simulationSoftwareSuite', CfnSimulationApplication_SimulationSoftwareSuitePropertyValidator)(properties.simulationSoftwareSuite));
    errors.collect(cdk.propertyValidator('sources', cdk.listValidator(CfnSimulationApplication_SourceConfigPropertyValidator))(properties.sources));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSimulationApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication` resource
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplicationPropsValidator(properties).assertSuccess();
    return {
        RobotSoftwareSuite: cfnSimulationApplicationRobotSoftwareSuitePropertyToCloudFormation(properties.robotSoftwareSuite),
        SimulationSoftwareSuite: cfnSimulationApplicationSimulationSoftwareSuitePropertyToCloudFormation(properties.simulationSoftwareSuite),
        CurrentRevisionId: cdk.stringToCloudFormation(properties.currentRevisionId),
        Environment: cdk.stringToCloudFormation(properties.environment),
        Name: cdk.stringToCloudFormation(properties.name),
        RenderingEngine: cfnSimulationApplicationRenderingEnginePropertyToCloudFormation(properties.renderingEngine),
        Sources: cdk.listMapper(cfnSimulationApplicationSourceConfigPropertyToCloudFormation)(properties.sources),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplicationProps>();
    ret.addPropertyResult('robotSoftwareSuite', 'RobotSoftwareSuite', CfnSimulationApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties.RobotSoftwareSuite));
    ret.addPropertyResult('simulationSoftwareSuite', 'SimulationSoftwareSuite', CfnSimulationApplicationSimulationSoftwareSuitePropertyFromCloudFormation(properties.SimulationSoftwareSuite));
    ret.addPropertyResult('currentRevisionId', 'CurrentRevisionId', properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getString(properties.Environment) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('renderingEngine', 'RenderingEngine', properties.RenderingEngine != null ? CfnSimulationApplicationRenderingEnginePropertyFromCloudFormation(properties.RenderingEngine) : undefined);
    ret.addPropertyResult('sources', 'Sources', properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnSimulationApplicationSourceConfigPropertyFromCloudFormation)(properties.Sources) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::SimulationApplication`
 *
 * The `AWS::RoboMaker::SimulationApplication` resource creates an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplication
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export class CfnSimulationApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::SimulationApplication";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSimulationApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSimulationApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the simulation application.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The current revision id.
     * @cloudformationAttribute CurrentRevisionId
     */
    public readonly attrCurrentRevisionId: string;

    /**
     * The robot software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-robotsoftwaresuite
     */
    public robotSoftwareSuite: CfnSimulationApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The simulation software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite
     */
    public simulationSoftwareSuite: CfnSimulationApplication.SimulationSoftwareSuiteProperty | cdk.IResolvable;

    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-currentrevisionid
     */
    public currentRevisionId: string | undefined;

    /**
     * The environment of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-environment
     */
    public environment: string | undefined;

    /**
     * The name of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-name
     */
    public name: string | undefined;

    /**
     * The rendering engine for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-renderingengine
     */
    public renderingEngine: CfnSimulationApplication.RenderingEngineProperty | cdk.IResolvable | undefined;

    /**
     * The sources of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-sources
     */
    public sources: Array<CfnSimulationApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RoboMaker::SimulationApplication`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationProps) {
        super(scope, id, { type: CfnSimulationApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'robotSoftwareSuite', this);
        cdk.requireProperty(props, 'simulationSoftwareSuite', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCurrentRevisionId = cdk.Token.asString(this.getAtt('CurrentRevisionId', cdk.ResolutionTypeHint.STRING));

        this.robotSoftwareSuite = props.robotSoftwareSuite;
        this.simulationSoftwareSuite = props.simulationSoftwareSuite;
        this.currentRevisionId = props.currentRevisionId;
        this.environment = props.environment;
        this.name = props.name;
        this.renderingEngine = props.renderingEngine;
        this.sources = props.sources;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::SimulationApplication", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimulationApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            robotSoftwareSuite: this.robotSoftwareSuite,
            simulationSoftwareSuite: this.simulationSoftwareSuite,
            currentRevisionId: this.currentRevisionId,
            environment: this.environment,
            name: this.name,
            renderingEngine: this.renderingEngine,
            sources: this.sources,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSimulationApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnSimulationApplication {
    /**
     * Information about a rendering engine.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html
     */
    export interface RenderingEngineProperty {
        /**
         * The name of the rendering engine.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-name
         */
        readonly name: string;
        /**
         * The version of the rendering engine.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-version
         */
        readonly version: string;
    }
}

/**
 * Determine whether the given properties match those of a `RenderingEngineProperty`
 *
 * @param properties - the TypeScript properties of a `RenderingEngineProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplication_RenderingEnginePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "RenderingEngineProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.RenderingEngine` resource
 *
 * @param properties - the TypeScript properties of a `RenderingEngineProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.RenderingEngine` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationRenderingEnginePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplication_RenderingEnginePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationRenderingEnginePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplication.RenderingEngineProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.RenderingEngineProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSimulationApplication {
    /**
     * Information about a robot software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html
     */
    export interface RobotSoftwareSuiteProperty {
        /**
         * The name of the robot software suite. `General` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the robot software suite. Not applicable for General software suite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RobotSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplication_RobotSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "RobotSoftwareSuiteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.RobotSoftwareSuite` resource
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.RobotSoftwareSuite` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationRobotSoftwareSuitePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplication_RobotSoftwareSuitePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplication.RobotSoftwareSuiteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.RobotSoftwareSuiteProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSimulationApplication {
    /**
     * Information about a simulation software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html
     */
    export interface SimulationSoftwareSuiteProperty {
        /**
         * The name of the simulation software suite. `SimulationRuntime` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the simulation software suite. Not applicable for `SimulationRuntime` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SimulationSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `SimulationSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplication_SimulationSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "SimulationSoftwareSuiteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.SimulationSoftwareSuite` resource
 *
 * @param properties - the TypeScript properties of a `SimulationSoftwareSuiteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.SimulationSoftwareSuite` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationSimulationSoftwareSuitePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplication_SimulationSoftwareSuitePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationSimulationSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplication.SimulationSoftwareSuiteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.SimulationSoftwareSuiteProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSimulationApplication {
    /**
     * Information about a source configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html
     */
    export interface SourceConfigProperty {
        /**
         * The target processor architecture for the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-architecture
         */
        readonly architecture: string;
        /**
         * The Amazon S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The s3 object key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3key
         */
        readonly s3Key: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplication_SourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('architecture', cdk.requiredValidator)(properties.architecture));
    errors.collect(cdk.propertyValidator('architecture', cdk.validateString)(properties.architecture));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    return errors.wrap('supplied properties not correct for "SourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.SourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplication.SourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplication_SourceConfigPropertyValidator(properties).assertSuccess();
    return {
        Architecture: cdk.stringToCloudFormation(properties.architecture),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplication.SourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.SourceConfigProperty>();
    ret.addPropertyResult('architecture', 'Architecture', cfn_parse.FromCloudFormation.getString(properties.Architecture));
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Key', 'S3Key', cfn_parse.FromCloudFormation.getString(properties.S3Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSimulationApplicationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export interface CfnSimulationApplicationVersionProps {

    /**
     * The application information for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-application
     */
    readonly application: string;

    /**
     * The current revision id for the simulation application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-currentrevisionid
     */
    readonly currentRevisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSimulationApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnSimulationApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('application', cdk.requiredValidator)(properties.application));
    errors.collect(cdk.propertyValidator('application', cdk.validateString)(properties.application));
    errors.collect(cdk.propertyValidator('currentRevisionId', cdk.validateString)(properties.currentRevisionId));
    return errors.wrap('supplied properties not correct for "CfnSimulationApplicationVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplicationVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RoboMaker::SimulationApplicationVersion` resource.
 */
// @ts-ignore TS6133
function cfnSimulationApplicationVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimulationApplicationVersionPropsValidator(properties).assertSuccess();
    return {
        Application: cdk.stringToCloudFormation(properties.application),
        CurrentRevisionId: cdk.stringToCloudFormation(properties.currentRevisionId),
    };
}

// @ts-ignore TS6133
function CfnSimulationApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplicationVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplicationVersionProps>();
    ret.addPropertyResult('application', 'Application', cfn_parse.FromCloudFormation.getString(properties.Application));
    ret.addPropertyResult('currentRevisionId', 'CurrentRevisionId', properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RoboMaker::SimulationApplicationVersion`
 *
 * The `AWS::RoboMaker::SimulationApplicationVersion` resource creates a version of an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplicationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export class CfnSimulationApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::SimulationApplicationVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplicationVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSimulationApplicationVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSimulationApplicationVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The simulation application version.
     * @cloudformationAttribute ApplicationVersion
     */
    public readonly attrApplicationVersion: string;

    /**
     * The Amazon Resource Name (ARN) of the simulation application version.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The application information for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-application
     */
    public application: string;

    /**
     * The current revision id for the simulation application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-currentrevisionid
     */
    public currentRevisionId: string | undefined;

    /**
     * Create a new `AWS::RoboMaker::SimulationApplicationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationVersionProps) {
        super(scope, id, { type: CfnSimulationApplicationVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'application', this);
        this.attrApplicationVersion = cdk.Token.asString(this.getAtt('ApplicationVersion', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.application = props.application;
        this.currentRevisionId = props.currentRevisionId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimulationApplicationVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            application: this.application,
            currentRevisionId: this.currentRevisionId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSimulationApplicationVersionPropsToCloudFormation(props);
    }
}
