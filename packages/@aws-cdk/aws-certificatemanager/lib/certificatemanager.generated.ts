// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:55:56.161Z","fingerprint":"GGNvNZ8AU5swV+b2Khafr+uCAbjYJGQ9fIxXc4BQBEY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAccount`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-account.html
 */
export interface CfnAccountProps {

    /**
     * Object containing expiration events options associated with an AWS account . For more information, see [ExpiryEventsConfiguration](https://docs.aws.amazon.com/acm/latest/APIReference/API_ExpiryEventsConfiguration.html) in the API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-account.html#cfn-certificatemanager-account-expiryeventsconfiguration
     */
    readonly expiryEventsConfiguration: CfnAccount.ExpiryEventsConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAccountProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountProps`
 *
 * @returns the result of the validation.
 */
function CfnAccountPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('expiryEventsConfiguration', cdk.requiredValidator)(properties.expiryEventsConfiguration));
    errors.collect(cdk.propertyValidator('expiryEventsConfiguration', CfnAccount_ExpiryEventsConfigurationPropertyValidator)(properties.expiryEventsConfiguration));
    return errors.wrap('supplied properties not correct for "CfnAccountProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CertificateManager::Account` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccountProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CertificateManager::Account` resource.
 */
// @ts-ignore TS6133
function cfnAccountPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccountPropsValidator(properties).assertSuccess();
    return {
        ExpiryEventsConfiguration: cfnAccountExpiryEventsConfigurationPropertyToCloudFormation(properties.expiryEventsConfiguration),
    };
}

// @ts-ignore TS6133
function CfnAccountPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountProps>();
    ret.addPropertyResult('expiryEventsConfiguration', 'ExpiryEventsConfiguration', CfnAccountExpiryEventsConfigurationPropertyFromCloudFormation(properties.ExpiryEventsConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CertificateManager::Account`
 *
 * The `AWS::CertificateManager::Account` resource defines the expiry event configuration that determines the number of days prior to expiry when ACM starts generating EventBridge events.
 *
 * @cloudformationResource AWS::CertificateManager::Account
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-account.html
 */
export class CfnAccount extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CertificateManager::Account";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccount {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAccountPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAccount(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * ID of the AWS account that owns the certificate.
     * @cloudformationAttribute AccountId
     */
    public readonly attrAccountId: string;

    /**
     * Object containing expiration events options associated with an AWS account . For more information, see [ExpiryEventsConfiguration](https://docs.aws.amazon.com/acm/latest/APIReference/API_ExpiryEventsConfiguration.html) in the API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-account.html#cfn-certificatemanager-account-expiryeventsconfiguration
     */
    public expiryEventsConfiguration: CfnAccount.ExpiryEventsConfigurationProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CertificateManager::Account`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccountProps) {
        super(scope, id, { type: CfnAccount.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'expiryEventsConfiguration', this);
        this.attrAccountId = cdk.Token.asString(this.getAtt('AccountId', cdk.ResolutionTypeHint.STRING));

        this.expiryEventsConfiguration = props.expiryEventsConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccount.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            expiryEventsConfiguration: this.expiryEventsConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccountPropsToCloudFormation(props);
    }
}

export namespace CfnAccount {
    /**
     * Object containing expiration events options associated with an AWS account . For more information, see [ExpiryEventsConfiguration](https://docs.aws.amazon.com/acm/latest/APIReference/API_ExpiryEventsConfiguration.html) in the API reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-account-expiryeventsconfiguration.html
     */
    export interface ExpiryEventsConfigurationProperty {
        /**
         * This option specifies the number of days prior to certificate expiration when ACM starts generating `EventBridge` events. ACM sends one event per day per certificate until the certificate expires. By default, accounts receive events starting 45 days before certificate expiration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-account-expiryeventsconfiguration.html#cfn-certificatemanager-account-expiryeventsconfiguration-daysbeforeexpiry
         */
        readonly daysBeforeExpiry?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ExpiryEventsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExpiryEventsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccount_ExpiryEventsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('daysBeforeExpiry', cdk.validateNumber)(properties.daysBeforeExpiry));
    return errors.wrap('supplied properties not correct for "ExpiryEventsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CertificateManager::Account.ExpiryEventsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ExpiryEventsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CertificateManager::Account.ExpiryEventsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAccountExpiryEventsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccount_ExpiryEventsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DaysBeforeExpiry: cdk.numberToCloudFormation(properties.daysBeforeExpiry),
    };
}

// @ts-ignore TS6133
function CfnAccountExpiryEventsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccount.ExpiryEventsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccount.ExpiryEventsConfigurationProperty>();
    ret.addPropertyResult('daysBeforeExpiry', 'DaysBeforeExpiry', properties.DaysBeforeExpiry != null ? cfn_parse.FromCloudFormation.getNumber(properties.DaysBeforeExpiry) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html
 */
export interface CfnCertificateProps {

    /**
     * The fully qualified domain name (FQDN), such as www.example.com, with which you want to secure an ACM certificate. Use an asterisk (*) to create a wildcard certificate that protects several sites in the same domain. For example, `*.example.com` protects `www.example.com` , `site.example.com` , and `images.example.com.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainname
     */
    readonly domainName: string;

    /**
     * The Amazon Resource Name (ARN) of the private certificate authority (CA) that will be used to issue the certificate. If you do not provide an ARN and you are trying to request a private certificate, ACM will attempt to issue a public certificate. For more information about private CAs, see the [AWS Private Certificate Authority](https://docs.aws.amazon.com/privateca/latest/userguide/PcaWelcome.html) user guide. The ARN must have the following form:
     *
     * `arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-certificateauthorityarn
     */
    readonly certificateAuthorityArn?: string;

    /**
     * You can opt out of certificate transparency logging by specifying the `DISABLED` option. Opt in by specifying `ENABLED` .
     *
     * If you do not specify a certificate transparency logging preference on a new CloudFormation template, or if you remove the logging preference from an existing template, this is the same as explicitly enabling the preference.
     *
     * Changing the certificate transparency logging preference will update the existing resource by calling `UpdateCertificateOptions` on the certificate. This action will not create a new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-certificatetransparencyloggingpreference
     */
    readonly certificateTransparencyLoggingPreference?: string;

    /**
     * Domain information that domain name registrars use to verify your identity.
     *
     * > In order for a AWS::CertificateManager::Certificate to be provisioned and validated in CloudFormation automatically, the `DomainName` property needs to be identical to one of the `DomainName` property supplied in DomainValidationOptions, if the ValidationMethod is **DNS**. Failing to keep them like-for-like will result in failure to create the domain validation records in Route53.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainvalidationoptions
     */
    readonly domainValidationOptions?: Array<CfnCertificate.DomainValidationOptionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Additional FQDNs to be included in the Subject Alternative Name extension of the ACM certificate. For example, you can add www.example.net to a certificate for which the `DomainName` field is www.example.com if users can reach your site by using either name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-subjectalternativenames
     */
    readonly subjectAlternativeNames?: string[];

    /**
     * Key-value pairs that can identify the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The method you want to use to validate that you own or control the domain associated with a public certificate. You can [validate with DNS](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html) or [validate with email](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html) . We recommend that you use DNS validation.
     *
     * If not specified, this property defaults to email validation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-validationmethod
     */
    readonly validationMethod?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.validateString)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateTransparencyLoggingPreference', cdk.validateString)(properties.certificateTransparencyLoggingPreference));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainValidationOptions', cdk.listValidator(CfnCertificate_DomainValidationOptionPropertyValidator))(properties.domainValidationOptions));
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', cdk.listValidator(cdk.validateString))(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('validationMethod', cdk.validateString)(properties.validationMethod));
    return errors.wrap('supplied properties not correct for "CfnCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CertificateManager::Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CertificateManager::Certificate` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificatePropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        CertificateAuthorityArn: cdk.stringToCloudFormation(properties.certificateAuthorityArn),
        CertificateTransparencyLoggingPreference: cdk.stringToCloudFormation(properties.certificateTransparencyLoggingPreference),
        DomainValidationOptions: cdk.listMapper(cfnCertificateDomainValidationOptionPropertyToCloudFormation)(properties.domainValidationOptions),
        SubjectAlternativeNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.subjectAlternativeNames),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        ValidationMethod: cdk.stringToCloudFormation(properties.validationMethod),
    };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('certificateAuthorityArn', 'CertificateAuthorityArn', properties.CertificateAuthorityArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn) : undefined);
    ret.addPropertyResult('certificateTransparencyLoggingPreference', 'CertificateTransparencyLoggingPreference', properties.CertificateTransparencyLoggingPreference != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateTransparencyLoggingPreference) : undefined);
    ret.addPropertyResult('domainValidationOptions', 'DomainValidationOptions', properties.DomainValidationOptions != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateDomainValidationOptionPropertyFromCloudFormation)(properties.DomainValidationOptions) : undefined);
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('validationMethod', 'ValidationMethod', properties.ValidationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationMethod) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CertificateManager::Certificate`
 *
 * The `AWS::CertificateManager::Certificate` resource requests an AWS Certificate Manager ( ACM ) certificate that you can use to enable secure connections. For example, you can deploy an ACM certificate to an Elastic Load Balancer to enable HTTPS support. For more information, see [RequestCertificate](https://docs.aws.amazon.com/acm/latest/APIReference/API_RequestCertificate.html) in the AWS Certificate Manager API Reference.
 *
 * > When you use the `AWS::CertificateManager::Certificate` resource in a CloudFormation stack, domain validation is handled automatically if all three of the following are true: The certificate domain is hosted in Amazon Route 53, the domain resides in your AWS account , and you are using DNS validation.
 * >
 * > However, if the certificate uses email validation, or if the domain is not hosted in Route 53, then the stack will remain in the `CREATE_IN_PROGRESS` state. Further stack operations are delayed until you validate the certificate request, either by acting upon the instructions in the validation email, or by adding a CNAME record to your DNS configuration. For more information, see [Option 1: DNS Validation](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html) and [Option 2: Email Validation](https://docs.aws.amazon.com/acm/latest/userguide/email-validation.html) .
 *
 * @cloudformationResource AWS::CertificateManager::Certificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CertificateManager::Certificate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCertificatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnCertificate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The fully qualified domain name (FQDN), such as www.example.com, with which you want to secure an ACM certificate. Use an asterisk (*) to create a wildcard certificate that protects several sites in the same domain. For example, `*.example.com` protects `www.example.com` , `site.example.com` , and `images.example.com.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainname
     */
    public domainName: string;

    /**
     * The Amazon Resource Name (ARN) of the private certificate authority (CA) that will be used to issue the certificate. If you do not provide an ARN and you are trying to request a private certificate, ACM will attempt to issue a public certificate. For more information about private CAs, see the [AWS Private Certificate Authority](https://docs.aws.amazon.com/privateca/latest/userguide/PcaWelcome.html) user guide. The ARN must have the following form:
     *
     * `arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-certificateauthorityarn
     */
    public certificateAuthorityArn: string | undefined;

    /**
     * You can opt out of certificate transparency logging by specifying the `DISABLED` option. Opt in by specifying `ENABLED` .
     *
     * If you do not specify a certificate transparency logging preference on a new CloudFormation template, or if you remove the logging preference from an existing template, this is the same as explicitly enabling the preference.
     *
     * Changing the certificate transparency logging preference will update the existing resource by calling `UpdateCertificateOptions` on the certificate. This action will not create a new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-certificatetransparencyloggingpreference
     */
    public certificateTransparencyLoggingPreference: string | undefined;

    /**
     * Domain information that domain name registrars use to verify your identity.
     *
     * > In order for a AWS::CertificateManager::Certificate to be provisioned and validated in CloudFormation automatically, the `DomainName` property needs to be identical to one of the `DomainName` property supplied in DomainValidationOptions, if the ValidationMethod is **DNS**. Failing to keep them like-for-like will result in failure to create the domain validation records in Route53.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainvalidationoptions
     */
    public domainValidationOptions: Array<CfnCertificate.DomainValidationOptionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Additional FQDNs to be included in the Subject Alternative Name extension of the ACM certificate. For example, you can add www.example.net to a certificate for which the `DomainName` field is www.example.com if users can reach your site by using either name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-subjectalternativenames
     */
    public subjectAlternativeNames: string[] | undefined;

    /**
     * Key-value pairs that can identify the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The method you want to use to validate that you own or control the domain associated with a public certificate. You can [validate with DNS](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html) or [validate with email](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html) . We recommend that you use DNS validation.
     *
     * If not specified, this property defaults to email validation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-validationmethod
     */
    public validationMethod: string | undefined;

    /**
     * Create a new `AWS::CertificateManager::Certificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
        super(scope, id, { type: CfnCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);

        this.domainName = props.domainName;
        this.certificateAuthorityArn = props.certificateAuthorityArn;
        this.certificateTransparencyLoggingPreference = props.certificateTransparencyLoggingPreference;
        this.domainValidationOptions = props.domainValidationOptions;
        this.subjectAlternativeNames = props.subjectAlternativeNames;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CertificateManager::Certificate", props.tags, { tagPropertyName: 'tags' });
        this.validationMethod = props.validationMethod;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domainName: this.domainName,
            certificateAuthorityArn: this.certificateAuthorityArn,
            certificateTransparencyLoggingPreference: this.certificateTransparencyLoggingPreference,
            domainValidationOptions: this.domainValidationOptions,
            subjectAlternativeNames: this.subjectAlternativeNames,
            tags: this.tags.renderTags(),
            validationMethod: this.validationMethod,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificatePropsToCloudFormation(props);
    }
}

export namespace CfnCertificate {
    /**
     * `DomainValidationOption` is a property of the [AWS::CertificateManager::Certificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html) resource that specifies the AWS Certificate Manager ( ACM ) certificate domain to validate. Depending on the chosen validation method, ACM checks the domain's DNS record for a validation CNAME, or it attempts to send a validation email message to the domain owner.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html
     */
    export interface DomainValidationOptionProperty {
        /**
         * A fully qualified domain name (FQDN) in the certificate request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html#cfn-certificatemanager-certificate-domainvalidationoptions-domainname
         */
        readonly domainName: string;
        /**
         * The `HostedZoneId` option, which is available if you are using Route 53 as your domain registrar, causes ACM to add your CNAME to the domain record. Your list of `DomainValidationOptions` must contain one and only one of the domain-validation options, and the `HostedZoneId` can be used only when `DNS` is specified as your validation method.
         *
         * Use the Route 53 `ListHostedZones` API to discover IDs for available hosted zones.
         *
         * This option is required for publicly trusted certificates.
         *
         * > The `ListHostedZones` API returns IDs in the format "/hostedzone/Z111111QQQQQQQ", but CloudFormation requires the IDs to be in the format "Z111111QQQQQQQ".
         *
         * When you change your `DomainValidationOptions` , a new resource is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html#cfn-certificatemanager-certificate-domainvalidationoption-hostedzoneid
         */
        readonly hostedZoneId?: string;
        /**
         * The domain name to which you want ACM to send validation emails. This domain name is the suffix of the email addresses that you want ACM to use. This must be the same as the `DomainName` value or a superdomain of the `DomainName` value. For example, if you request a certificate for `testing.example.com` , you can specify `example.com` as this value. In that case, ACM sends domain validation emails to the following five addresses:
         *
         * - admin@example.com
         * - administrator@example.com
         * - hostmaster@example.com
         * - postmaster@example.com
         * - webmaster@example.com
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html#cfn-certificatemanager-certificate-domainvalidationoption-validationdomain
         */
        readonly validationDomain?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DomainValidationOptionProperty`
 *
 * @param properties - the TypeScript properties of a `DomainValidationOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_DomainValidationOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('hostedZoneId', cdk.validateString)(properties.hostedZoneId));
    errors.collect(cdk.propertyValidator('validationDomain', cdk.validateString)(properties.validationDomain));
    return errors.wrap('supplied properties not correct for "DomainValidationOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CertificateManager::Certificate.DomainValidationOption` resource
 *
 * @param properties - the TypeScript properties of a `DomainValidationOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CertificateManager::Certificate.DomainValidationOption` resource.
 */
// @ts-ignore TS6133
function cfnCertificateDomainValidationOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_DomainValidationOptionPropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        HostedZoneId: cdk.stringToCloudFormation(properties.hostedZoneId),
        ValidationDomain: cdk.stringToCloudFormation(properties.validationDomain),
    };
}

// @ts-ignore TS6133
function CfnCertificateDomainValidationOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.DomainValidationOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.DomainValidationOptionProperty>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('hostedZoneId', 'HostedZoneId', properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined);
    ret.addPropertyResult('validationDomain', 'ValidationDomain', properties.ValidationDomain != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationDomain) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
