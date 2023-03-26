// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:54.893Z","fingerprint":"IVuTHPu5wmTB69uq/A4+wSLHmGK6XW0D5PrVh0eoF4k="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnMicrosoftAD`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export interface CfnMicrosoftADProps {

    /**
     * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-name
     */
    readonly name: string;

    /**
     * The password for the default administrative user named `Admin` .
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-password
     */
    readonly password: string;

    /**
     * Specifies the VPC settings of the Microsoft AD directory server in AWS .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-vpcsettings
     */
    readonly vpcSettings: CfnMicrosoftAD.VpcSettingsProperty | cdk.IResolvable;

    /**
     * Specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, AWS CloudFormation does not create an alias.
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-createalias
     */
    readonly createAlias?: boolean | cdk.IResolvable;

    /**
     * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` . `Enterprise` is the default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-edition
     */
    readonly edition?: string;

    /**
     * Whether to enable single sign-on for a Microsoft Active Directory in AWS . Single sign-on allows users in your directory to access certain AWS services from a computer joined to the directory without having to enter their credentials separately. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-enablesso
     */
    readonly enableSso?: boolean | cdk.IResolvable;

    /**
     * The NetBIOS name for your domain, such as `CORP` . If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, `CORP` for the directory DNS `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-shortname
     */
    readonly shortName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMicrosoftADProps`
 *
 * @param properties - the TypeScript properties of a `CfnMicrosoftADProps`
 *
 * @returns the result of the validation.
 */
function CfnMicrosoftADPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('createAlias', cdk.validateBoolean)(properties.createAlias));
    errors.collect(cdk.propertyValidator('edition', cdk.validateString)(properties.edition));
    errors.collect(cdk.propertyValidator('enableSso', cdk.validateBoolean)(properties.enableSso));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('password', cdk.requiredValidator)(properties.password));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('shortName', cdk.validateString)(properties.shortName));
    errors.collect(cdk.propertyValidator('vpcSettings', cdk.requiredValidator)(properties.vpcSettings));
    errors.collect(cdk.propertyValidator('vpcSettings', CfnMicrosoftAD_VpcSettingsPropertyValidator)(properties.vpcSettings));
    return errors.wrap('supplied properties not correct for "CfnMicrosoftADProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DirectoryService::MicrosoftAD` resource
 *
 * @param properties - the TypeScript properties of a `CfnMicrosoftADProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DirectoryService::MicrosoftAD` resource.
 */
// @ts-ignore TS6133
function cfnMicrosoftADPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMicrosoftADPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Password: cdk.stringToCloudFormation(properties.password),
        VpcSettings: cfnMicrosoftADVpcSettingsPropertyToCloudFormation(properties.vpcSettings),
        CreateAlias: cdk.booleanToCloudFormation(properties.createAlias),
        Edition: cdk.stringToCloudFormation(properties.edition),
        EnableSso: cdk.booleanToCloudFormation(properties.enableSso),
        ShortName: cdk.stringToCloudFormation(properties.shortName),
    };
}

// @ts-ignore TS6133
function CfnMicrosoftADPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMicrosoftADProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMicrosoftADProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('password', 'Password', cfn_parse.FromCloudFormation.getString(properties.Password));
    ret.addPropertyResult('vpcSettings', 'VpcSettings', CfnMicrosoftADVpcSettingsPropertyFromCloudFormation(properties.VpcSettings));
    ret.addPropertyResult('createAlias', 'CreateAlias', properties.CreateAlias != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateAlias) : undefined);
    ret.addPropertyResult('edition', 'Edition', properties.Edition != null ? cfn_parse.FromCloudFormation.getString(properties.Edition) : undefined);
    ret.addPropertyResult('enableSso', 'EnableSso', properties.EnableSso != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSso) : undefined);
    ret.addPropertyResult('shortName', 'ShortName', properties.ShortName != null ? cfn_parse.FromCloudFormation.getString(properties.ShortName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DirectoryService::MicrosoftAD`
 *
 * The `AWS::DirectoryService::MicrosoftAD` resource specifies a Microsoft Active Directory in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials. For more information, see [AWS Managed Microsoft AD](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_microsoft_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::MicrosoftAD
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export class CfnMicrosoftAD extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DirectoryService::MicrosoftAD";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMicrosoftAD {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMicrosoftADPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMicrosoftAD(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
     * @cloudformationAttribute Alias
     */
    public readonly attrAlias: string;

    /**
     * The IP addresses of the DNS servers for the directory, such as `[ "192.0.2.1", "192.0.2.2" ]` .
     * @cloudformationAttribute DnsIpAddresses
     */
    public readonly attrDnsIpAddresses: string[];

    /**
     * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-name
     */
    public name: string;

    /**
     * The password for the default administrative user named `Admin` .
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-password
     */
    public password: string;

    /**
     * Specifies the VPC settings of the Microsoft AD directory server in AWS .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-vpcsettings
     */
    public vpcSettings: CfnMicrosoftAD.VpcSettingsProperty | cdk.IResolvable;

    /**
     * Specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, AWS CloudFormation does not create an alias.
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-createalias
     */
    public createAlias: boolean | cdk.IResolvable | undefined;

    /**
     * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` . `Enterprise` is the default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-edition
     */
    public edition: string | undefined;

    /**
     * Whether to enable single sign-on for a Microsoft Active Directory in AWS . Single sign-on allows users in your directory to access certain AWS services from a computer joined to the directory without having to enter their credentials separately. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-enablesso
     */
    public enableSso: boolean | cdk.IResolvable | undefined;

    /**
     * The NetBIOS name for your domain, such as `CORP` . If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, `CORP` for the directory DNS `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-shortname
     */
    public shortName: string | undefined;

    /**
     * Create a new `AWS::DirectoryService::MicrosoftAD`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMicrosoftADProps) {
        super(scope, id, { type: CfnMicrosoftAD.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'password', this);
        cdk.requireProperty(props, 'vpcSettings', this);
        this.attrAlias = cdk.Token.asString(this.getAtt('Alias', cdk.ResolutionTypeHint.STRING));
        this.attrDnsIpAddresses = cdk.Token.asList(this.getAtt('DnsIpAddresses', cdk.ResolutionTypeHint.STRING_LIST));

        this.name = props.name;
        this.password = props.password;
        this.vpcSettings = props.vpcSettings;
        this.createAlias = props.createAlias;
        this.edition = props.edition;
        this.enableSso = props.enableSso;
        this.shortName = props.shortName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMicrosoftAD.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            password: this.password,
            vpcSettings: this.vpcSettings,
            createAlias: this.createAlias,
            edition: this.edition,
            enableSso: this.enableSso,
            shortName: this.shortName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMicrosoftADPropsToCloudFormation(props);
    }
}

export namespace CfnMicrosoftAD {
    /**
     * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html
     */
    export interface VpcSettingsProperty {
        /**
         * The identifiers of the subnets for the directory servers. The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-subnetids
         */
        readonly subnetIds: string[];
        /**
         * The identifier of the VPC in which to create the directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-vpcid
         */
        readonly vpcId: string;
    }
}

/**
 * Determine whether the given properties match those of a `VpcSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnMicrosoftAD_VpcSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('vpcId', cdk.requiredValidator)(properties.vpcId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "VpcSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DirectoryService::MicrosoftAD.VpcSettings` resource
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DirectoryService::MicrosoftAD.VpcSettings` resource.
 */
// @ts-ignore TS6133
function cfnMicrosoftADVpcSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMicrosoftAD_VpcSettingsPropertyValidator(properties).assertSuccess();
    return {
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnMicrosoftADVpcSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMicrosoftAD.VpcSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMicrosoftAD.VpcSettingsProperty>();
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('vpcId', 'VpcId', cfn_parse.FromCloudFormation.getString(properties.VpcId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSimpleAD`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export interface CfnSimpleADProps {

    /**
     * The fully qualified name for the directory, such as `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name
     */
    readonly name: string;

    /**
     * The size of the directory. For valid values, see [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size
     */
    readonly size: string;

    /**
     * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings
     */
    readonly vpcSettings: CfnSimpleAD.VpcSettingsProperty | cdk.IResolvable;

    /**
     * If set to `true` , specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, this property is set to `false` .
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias
     */
    readonly createAlias?: boolean | cdk.IResolvable;

    /**
     * A description for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description
     */
    readonly description?: string;

    /**
     * Whether to enable single sign-on for a directory. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso
     */
    readonly enableSso?: boolean | cdk.IResolvable;

    /**
     * The password for the directory administrator. The directory creation process creates a directory administrator account with the user name `Administrator` and this password.
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password
     */
    readonly password?: string;

    /**
     * The NetBIOS name of the directory, such as `CORP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname
     */
    readonly shortName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSimpleADProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimpleADProps`
 *
 * @returns the result of the validation.
 */
function CfnSimpleADPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('createAlias', cdk.validateBoolean)(properties.createAlias));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('enableSso', cdk.validateBoolean)(properties.enableSso));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('shortName', cdk.validateString)(properties.shortName));
    errors.collect(cdk.propertyValidator('size', cdk.requiredValidator)(properties.size));
    errors.collect(cdk.propertyValidator('size', cdk.validateString)(properties.size));
    errors.collect(cdk.propertyValidator('vpcSettings', cdk.requiredValidator)(properties.vpcSettings));
    errors.collect(cdk.propertyValidator('vpcSettings', CfnSimpleAD_VpcSettingsPropertyValidator)(properties.vpcSettings));
    return errors.wrap('supplied properties not correct for "CfnSimpleADProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DirectoryService::SimpleAD` resource
 *
 * @param properties - the TypeScript properties of a `CfnSimpleADProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DirectoryService::SimpleAD` resource.
 */
// @ts-ignore TS6133
function cfnSimpleADPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleADPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Size: cdk.stringToCloudFormation(properties.size),
        VpcSettings: cfnSimpleADVpcSettingsPropertyToCloudFormation(properties.vpcSettings),
        CreateAlias: cdk.booleanToCloudFormation(properties.createAlias),
        Description: cdk.stringToCloudFormation(properties.description),
        EnableSso: cdk.booleanToCloudFormation(properties.enableSso),
        Password: cdk.stringToCloudFormation(properties.password),
        ShortName: cdk.stringToCloudFormation(properties.shortName),
    };
}

// @ts-ignore TS6133
function CfnSimpleADPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleADProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleADProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getString(properties.Size));
    ret.addPropertyResult('vpcSettings', 'VpcSettings', CfnSimpleADVpcSettingsPropertyFromCloudFormation(properties.VpcSettings));
    ret.addPropertyResult('createAlias', 'CreateAlias', properties.CreateAlias != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateAlias) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('enableSso', 'EnableSso', properties.EnableSso != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSso) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('shortName', 'ShortName', properties.ShortName != null ? cfn_parse.FromCloudFormation.getString(properties.ShortName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DirectoryService::SimpleAD`
 *
 * The `AWS::DirectoryService::SimpleAD` resource specifies an AWS Directory Service Simple Active Directory ( Simple AD ) in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials. Simple AD is a Microsoft Active Directory–compatible directory. For more information, see [Simple Active Directory](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_simple_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::SimpleAD
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export class CfnSimpleAD extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DirectoryService::SimpleAD";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleAD {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSimpleADPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSimpleAD(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
     * @cloudformationAttribute Alias
     */
    public readonly attrAlias: string;

    /**
     *
     * @cloudformationAttribute DirectoryId
     */
    public readonly attrDirectoryId: string;

    /**
     * The IP addresses of the DNS servers for the directory, such as `[ "172.31.3.154", "172.31.63.203" ]` .
     * @cloudformationAttribute DnsIpAddresses
     */
    public readonly attrDnsIpAddresses: string[];

    /**
     * The fully qualified name for the directory, such as `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name
     */
    public name: string;

    /**
     * The size of the directory. For valid values, see [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size
     */
    public size: string;

    /**
     * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings
     */
    public vpcSettings: CfnSimpleAD.VpcSettingsProperty | cdk.IResolvable;

    /**
     * If set to `true` , specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, this property is set to `false` .
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias
     */
    public createAlias: boolean | cdk.IResolvable | undefined;

    /**
     * A description for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description
     */
    public description: string | undefined;

    /**
     * Whether to enable single sign-on for a directory. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso
     */
    public enableSso: boolean | cdk.IResolvable | undefined;

    /**
     * The password for the directory administrator. The directory creation process creates a directory administrator account with the user name `Administrator` and this password.
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password
     */
    public password: string | undefined;

    /**
     * The NetBIOS name of the directory, such as `CORP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname
     */
    public shortName: string | undefined;

    /**
     * Create a new `AWS::DirectoryService::SimpleAD`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimpleADProps) {
        super(scope, id, { type: CfnSimpleAD.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'size', this);
        cdk.requireProperty(props, 'vpcSettings', this);
        this.attrAlias = cdk.Token.asString(this.getAtt('Alias', cdk.ResolutionTypeHint.STRING));
        this.attrDirectoryId = cdk.Token.asString(this.getAtt('DirectoryId', cdk.ResolutionTypeHint.STRING));
        this.attrDnsIpAddresses = cdk.Token.asList(this.getAtt('DnsIpAddresses', cdk.ResolutionTypeHint.STRING_LIST));

        this.name = props.name;
        this.size = props.size;
        this.vpcSettings = props.vpcSettings;
        this.createAlias = props.createAlias;
        this.description = props.description;
        this.enableSso = props.enableSso;
        this.password = props.password;
        this.shortName = props.shortName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimpleAD.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            size: this.size,
            vpcSettings: this.vpcSettings,
            createAlias: this.createAlias,
            description: this.description,
            enableSso: this.enableSso,
            password: this.password,
            shortName: this.shortName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSimpleADPropsToCloudFormation(props);
    }
}

export namespace CfnSimpleAD {
    /**
     * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html
     */
    export interface VpcSettingsProperty {
        /**
         * The identifiers of the subnets for the directory servers. The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-subnetids
         */
        readonly subnetIds: string[];
        /**
         * The identifier of the VPC in which to create the directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-vpcid
         */
        readonly vpcId: string;
    }
}

/**
 * Determine whether the given properties match those of a `VpcSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleAD_VpcSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('vpcId', cdk.requiredValidator)(properties.vpcId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "VpcSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DirectoryService::SimpleAD.VpcSettings` resource
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DirectoryService::SimpleAD.VpcSettings` resource.
 */
// @ts-ignore TS6133
function cfnSimpleADVpcSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleAD_VpcSettingsPropertyValidator(properties).assertSuccess();
    return {
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnSimpleADVpcSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleAD.VpcSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleAD.VpcSettingsProperty>();
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('vpcId', 'VpcId', cfn_parse.FromCloudFormation.getString(properties.VpcId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
