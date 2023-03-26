// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:01.056Z","fingerprint":"qrrdqvc/QSoXtTRydXd7BIne1Qy+jjtelMDI+w19lz8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html
 */
export interface CfnCertificateProps {

    /**
     * The Amazon Resource Name (ARN) for the private CA issues the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-certificateauthorityarn
     */
    readonly certificateAuthorityArn: string;

    /**
     * The certificate signing request (CSR) for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-certificatesigningrequest
     */
    readonly certificateSigningRequest: string;

    /**
     * The name of the algorithm that will be used to sign the certificate to be issued.
     *
     * This parameter should not be confused with the `SigningAlgorithm` parameter used to sign a CSR in the `CreateCertificateAuthority` action.
     *
     * > The specified signing algorithm family (RSA or ECDSA) must match the algorithm family of the CA's secret key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-signingalgorithm
     */
    readonly signingAlgorithm: string;

    /**
     * The period of time during which the certificate will be valid.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-validity
     */
    readonly validity: CfnCertificate.ValidityProperty | cdk.IResolvable;

    /**
     * Specifies X.509 certificate information to be included in the issued certificate. An `APIPassthrough` or `APICSRPassthrough` template variant must be selected, or else this parameter is ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-apipassthrough
     */
    readonly apiPassthrough?: CfnCertificate.ApiPassthroughProperty | cdk.IResolvable;

    /**
     * Specifies a custom configuration template to use when issuing a certificate. If this parameter is not provided, AWS Private CA defaults to the `EndEntityCertificate/V1` template. For more information about AWS Private CA templates, see [Using Templates](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-templatearn
     */
    readonly templateArn?: string;

    /**
     * Information describing the start of the validity period of the certificate. This parameter sets the “Not Before" date for the certificate.
     *
     * By default, when issuing a certificate, AWS Private CA sets the "Not Before" date to the issuance time minus 60 minutes. This compensates for clock inconsistencies across computer systems. The `ValidityNotBefore` parameter can be used to customize the “Not Before” value.
     *
     * Unlike the `Validity` parameter, the `ValidityNotBefore` parameter is optional.
     *
     * The `ValidityNotBefore` value is expressed as an explicit date and time, using the `Validity` type value `ABSOLUTE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-validitynotbefore
     */
    readonly validityNotBefore?: CfnCertificate.ValidityProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('apiPassthrough', CfnCertificate_ApiPassthroughPropertyValidator)(properties.apiPassthrough));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.requiredValidator)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.validateString)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateSigningRequest', cdk.requiredValidator)(properties.certificateSigningRequest));
    errors.collect(cdk.propertyValidator('certificateSigningRequest', cdk.validateString)(properties.certificateSigningRequest));
    errors.collect(cdk.propertyValidator('signingAlgorithm', cdk.requiredValidator)(properties.signingAlgorithm));
    errors.collect(cdk.propertyValidator('signingAlgorithm', cdk.validateString)(properties.signingAlgorithm));
    errors.collect(cdk.propertyValidator('templateArn', cdk.validateString)(properties.templateArn));
    errors.collect(cdk.propertyValidator('validity', cdk.requiredValidator)(properties.validity));
    errors.collect(cdk.propertyValidator('validity', CfnCertificate_ValidityPropertyValidator)(properties.validity));
    errors.collect(cdk.propertyValidator('validityNotBefore', CfnCertificate_ValidityPropertyValidator)(properties.validityNotBefore));
    return errors.wrap('supplied properties not correct for "CfnCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificatePropsValidator(properties).assertSuccess();
    return {
        CertificateAuthorityArn: cdk.stringToCloudFormation(properties.certificateAuthorityArn),
        CertificateSigningRequest: cdk.stringToCloudFormation(properties.certificateSigningRequest),
        SigningAlgorithm: cdk.stringToCloudFormation(properties.signingAlgorithm),
        Validity: cfnCertificateValidityPropertyToCloudFormation(properties.validity),
        ApiPassthrough: cfnCertificateApiPassthroughPropertyToCloudFormation(properties.apiPassthrough),
        TemplateArn: cdk.stringToCloudFormation(properties.templateArn),
        ValidityNotBefore: cfnCertificateValidityPropertyToCloudFormation(properties.validityNotBefore),
    };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
    ret.addPropertyResult('certificateAuthorityArn', 'CertificateAuthorityArn', cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn));
    ret.addPropertyResult('certificateSigningRequest', 'CertificateSigningRequest', cfn_parse.FromCloudFormation.getString(properties.CertificateSigningRequest));
    ret.addPropertyResult('signingAlgorithm', 'SigningAlgorithm', cfn_parse.FromCloudFormation.getString(properties.SigningAlgorithm));
    ret.addPropertyResult('validity', 'Validity', CfnCertificateValidityPropertyFromCloudFormation(properties.Validity));
    ret.addPropertyResult('apiPassthrough', 'ApiPassthrough', properties.ApiPassthrough != null ? CfnCertificateApiPassthroughPropertyFromCloudFormation(properties.ApiPassthrough) : undefined);
    ret.addPropertyResult('templateArn', 'TemplateArn', properties.TemplateArn != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateArn) : undefined);
    ret.addPropertyResult('validityNotBefore', 'ValidityNotBefore', properties.ValidityNotBefore != null ? CfnCertificateValidityPropertyFromCloudFormation(properties.ValidityNotBefore) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ACMPCA::Certificate`
 *
 * The `AWS::ACMPCA::Certificate` resource is used to issue a certificate using your private certificate authority. For more information, see the [IssueCertificate](https://docs.aws.amazon.com/privateca/latest/APIReference/API_IssueCertificate.html) action.
 *
 * @cloudformationResource AWS::ACMPCA::Certificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ACMPCA::Certificate";

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
     * The Amazon Resource Name (ARN) of the issued certificate.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The issued Base64 PEM-encoded certificate.
     * @cloudformationAttribute Certificate
     */
    public readonly attrCertificate: string;

    /**
     * The Amazon Resource Name (ARN) for the private CA issues the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-certificateauthorityarn
     */
    public certificateAuthorityArn: string;

    /**
     * The certificate signing request (CSR) for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-certificatesigningrequest
     */
    public certificateSigningRequest: string;

    /**
     * The name of the algorithm that will be used to sign the certificate to be issued.
     *
     * This parameter should not be confused with the `SigningAlgorithm` parameter used to sign a CSR in the `CreateCertificateAuthority` action.
     *
     * > The specified signing algorithm family (RSA or ECDSA) must match the algorithm family of the CA's secret key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-signingalgorithm
     */
    public signingAlgorithm: string;

    /**
     * The period of time during which the certificate will be valid.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-validity
     */
    public validity: CfnCertificate.ValidityProperty | cdk.IResolvable;

    /**
     * Specifies X.509 certificate information to be included in the issued certificate. An `APIPassthrough` or `APICSRPassthrough` template variant must be selected, or else this parameter is ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-apipassthrough
     */
    public apiPassthrough: CfnCertificate.ApiPassthroughProperty | cdk.IResolvable | undefined;

    /**
     * Specifies a custom configuration template to use when issuing a certificate. If this parameter is not provided, AWS Private CA defaults to the `EndEntityCertificate/V1` template. For more information about AWS Private CA templates, see [Using Templates](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-templatearn
     */
    public templateArn: string | undefined;

    /**
     * Information describing the start of the validity period of the certificate. This parameter sets the “Not Before" date for the certificate.
     *
     * By default, when issuing a certificate, AWS Private CA sets the "Not Before" date to the issuance time minus 60 minutes. This compensates for clock inconsistencies across computer systems. The `ValidityNotBefore` parameter can be used to customize the “Not Before” value.
     *
     * Unlike the `Validity` parameter, the `ValidityNotBefore` parameter is optional.
     *
     * The `ValidityNotBefore` value is expressed as an explicit date and time, using the `Validity` type value `ABSOLUTE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificate.html#cfn-acmpca-certificate-validitynotbefore
     */
    public validityNotBefore: CfnCertificate.ValidityProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ACMPCA::Certificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
        super(scope, id, { type: CfnCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificateAuthorityArn', this);
        cdk.requireProperty(props, 'certificateSigningRequest', this);
        cdk.requireProperty(props, 'signingAlgorithm', this);
        cdk.requireProperty(props, 'validity', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCertificate = cdk.Token.asString(this.getAtt('Certificate', cdk.ResolutionTypeHint.STRING));

        this.certificateAuthorityArn = props.certificateAuthorityArn;
        this.certificateSigningRequest = props.certificateSigningRequest;
        this.signingAlgorithm = props.signingAlgorithm;
        this.validity = props.validity;
        this.apiPassthrough = props.apiPassthrough;
        this.templateArn = props.templateArn;
        this.validityNotBefore = props.validityNotBefore;
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
            certificateAuthorityArn: this.certificateAuthorityArn,
            certificateSigningRequest: this.certificateSigningRequest,
            signingAlgorithm: this.signingAlgorithm,
            validity: this.validity,
            apiPassthrough: this.apiPassthrough,
            templateArn: this.templateArn,
            validityNotBefore: this.validityNotBefore,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificatePropsToCloudFormation(props);
    }
}

export namespace CfnCertificate {
    /**
     * Contains X.509 certificate information to be placed in an issued certificate. An `APIPassthrough` or `APICSRPassthrough` template variant must be selected, or else this parameter is ignored.
     *
     * If conflicting or duplicate certificate information is supplied from other sources, AWS Private CA applies [order of operation rules](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html#template-order-of-operations) to determine what information is used.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-apipassthrough.html
     */
    export interface ApiPassthroughProperty {
        /**
         * Specifies X.509 extension information for a certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-apipassthrough.html#cfn-acmpca-certificate-apipassthrough-extensions
         */
        readonly extensions?: CfnCertificate.ExtensionsProperty | cdk.IResolvable;
        /**
         * Contains information about the certificate subject. The Subject field in the certificate identifies the entity that owns or controls the public key in the certificate. The entity can be a user, computer, device, or service. The Subject must contain an X.500 distinguished name (DN). A DN is a sequence of relative distinguished names (RDNs). The RDNs are separated by commas in the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-apipassthrough.html#cfn-acmpca-certificate-apipassthrough-subject
         */
        readonly subject?: CfnCertificate.SubjectProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApiPassthroughProperty`
 *
 * @param properties - the TypeScript properties of a `ApiPassthroughProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_ApiPassthroughPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('extensions', CfnCertificate_ExtensionsPropertyValidator)(properties.extensions));
    errors.collect(cdk.propertyValidator('subject', CfnCertificate_SubjectPropertyValidator)(properties.subject));
    return errors.wrap('supplied properties not correct for "ApiPassthroughProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.ApiPassthrough` resource
 *
 * @param properties - the TypeScript properties of a `ApiPassthroughProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.ApiPassthrough` resource.
 */
// @ts-ignore TS6133
function cfnCertificateApiPassthroughPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_ApiPassthroughPropertyValidator(properties).assertSuccess();
    return {
        Extensions: cfnCertificateExtensionsPropertyToCloudFormation(properties.extensions),
        Subject: cfnCertificateSubjectPropertyToCloudFormation(properties.subject),
    };
}

// @ts-ignore TS6133
function CfnCertificateApiPassthroughPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.ApiPassthroughProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.ApiPassthroughProperty>();
    ret.addPropertyResult('extensions', 'Extensions', properties.Extensions != null ? CfnCertificateExtensionsPropertyFromCloudFormation(properties.Extensions) : undefined);
    ret.addPropertyResult('subject', 'Subject', properties.Subject != null ? CfnCertificateSubjectPropertyFromCloudFormation(properties.Subject) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Defines the X.500 relative distinguished name (RDN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customattribute.html
     */
    export interface CustomAttributeProperty {
        /**
         * Specifies the object identifier (OID) of the attribute type of the relative distinguished name (RDN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customattribute.html#cfn-acmpca-certificate-customattribute-objectidentifier
         */
        readonly objectIdentifier: string;
        /**
         * Specifies the attribute value of relative distinguished name (RDN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customattribute.html#cfn-acmpca-certificate-customattribute-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `CustomAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_CustomAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.requiredValidator)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.validateString)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.CustomAttribute` resource
 *
 * @param properties - the TypeScript properties of a `CustomAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.CustomAttribute` resource.
 */
// @ts-ignore TS6133
function cfnCertificateCustomAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_CustomAttributePropertyValidator(properties).assertSuccess();
    return {
        ObjectIdentifier: cdk.stringToCloudFormation(properties.objectIdentifier),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateCustomAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.CustomAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.CustomAttributeProperty>();
    ret.addPropertyResult('objectIdentifier', 'ObjectIdentifier', cfn_parse.FromCloudFormation.getString(properties.ObjectIdentifier));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Specifies the X.509 extension information for a certificate.
     *
     * Extensions present in `CustomExtensions` follow the `ApiPassthrough` [template rules](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html#template-order-of-operations) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customextension.html
     */
    export interface CustomExtensionProperty {
        /**
         * Specifies the critical flag of the X.509 extension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customextension.html#cfn-acmpca-certificate-customextension-critical
         */
        readonly critical?: boolean | cdk.IResolvable;
        /**
         * Specifies the object identifier (OID) of the X.509 extension. For more information, see the [Global OID reference database.](https://docs.aws.amazon.com/https://oidref.com/2.5.29)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customextension.html#cfn-acmpca-certificate-customextension-objectidentifier
         */
        readonly objectIdentifier: string;
        /**
         * Specifies the base64-encoded value of the X.509 extension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-customextension.html#cfn-acmpca-certificate-customextension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomExtensionProperty`
 *
 * @param properties - the TypeScript properties of a `CustomExtensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_CustomExtensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('critical', cdk.validateBoolean)(properties.critical));
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.requiredValidator)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.validateString)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomExtensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.CustomExtension` resource
 *
 * @param properties - the TypeScript properties of a `CustomExtensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.CustomExtension` resource.
 */
// @ts-ignore TS6133
function cfnCertificateCustomExtensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_CustomExtensionPropertyValidator(properties).assertSuccess();
    return {
        Critical: cdk.booleanToCloudFormation(properties.critical),
        ObjectIdentifier: cdk.stringToCloudFormation(properties.objectIdentifier),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateCustomExtensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.CustomExtensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.CustomExtensionProperty>();
    ret.addPropertyResult('critical', 'Critical', properties.Critical != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Critical) : undefined);
    ret.addPropertyResult('objectIdentifier', 'ObjectIdentifier', cfn_parse.FromCloudFormation.getString(properties.ObjectIdentifier));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Describes an Electronic Data Interchange (EDI) entity as described in as defined in [Subject Alternative Name](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280) in RFC 5280.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-edipartyname.html
     */
    export interface EdiPartyNameProperty {
        /**
         * Specifies the name assigner.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-edipartyname.html#cfn-acmpca-certificate-edipartyname-nameassigner
         */
        readonly nameAssigner: string;
        /**
         * Specifies the party name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-edipartyname.html#cfn-acmpca-certificate-edipartyname-partyname
         */
        readonly partyName: string;
    }
}

/**
 * Determine whether the given properties match those of a `EdiPartyNameProperty`
 *
 * @param properties - the TypeScript properties of a `EdiPartyNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_EdiPartyNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nameAssigner', cdk.requiredValidator)(properties.nameAssigner));
    errors.collect(cdk.propertyValidator('nameAssigner', cdk.validateString)(properties.nameAssigner));
    errors.collect(cdk.propertyValidator('partyName', cdk.requiredValidator)(properties.partyName));
    errors.collect(cdk.propertyValidator('partyName', cdk.validateString)(properties.partyName));
    return errors.wrap('supplied properties not correct for "EdiPartyNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.EdiPartyName` resource
 *
 * @param properties - the TypeScript properties of a `EdiPartyNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.EdiPartyName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateEdiPartyNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_EdiPartyNamePropertyValidator(properties).assertSuccess();
    return {
        NameAssigner: cdk.stringToCloudFormation(properties.nameAssigner),
        PartyName: cdk.stringToCloudFormation(properties.partyName),
    };
}

// @ts-ignore TS6133
function CfnCertificateEdiPartyNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.EdiPartyNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.EdiPartyNameProperty>();
    ret.addPropertyResult('nameAssigner', 'NameAssigner', cfn_parse.FromCloudFormation.getString(properties.NameAssigner));
    ret.addPropertyResult('partyName', 'PartyName', cfn_parse.FromCloudFormation.getString(properties.PartyName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Specifies additional purposes for which the certified public key may be used other than basic purposes indicated in the `KeyUsage` extension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extendedkeyusage.html
     */
    export interface ExtendedKeyUsageProperty {
        /**
         * Specifies a custom `ExtendedKeyUsage` with an object identifier (OID).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extendedkeyusage.html#cfn-acmpca-certificate-extendedkeyusage-extendedkeyusageobjectidentifier
         */
        readonly extendedKeyUsageObjectIdentifier?: string;
        /**
         * Specifies a standard `ExtendedKeyUsage` as defined as in [RFC 5280](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.12) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extendedkeyusage.html#cfn-acmpca-certificate-extendedkeyusage-extendedkeyusagetype
         */
        readonly extendedKeyUsageType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ExtendedKeyUsageProperty`
 *
 * @param properties - the TypeScript properties of a `ExtendedKeyUsageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_ExtendedKeyUsagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('extendedKeyUsageObjectIdentifier', cdk.validateString)(properties.extendedKeyUsageObjectIdentifier));
    errors.collect(cdk.propertyValidator('extendedKeyUsageType', cdk.validateString)(properties.extendedKeyUsageType));
    return errors.wrap('supplied properties not correct for "ExtendedKeyUsageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.ExtendedKeyUsage` resource
 *
 * @param properties - the TypeScript properties of a `ExtendedKeyUsageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.ExtendedKeyUsage` resource.
 */
// @ts-ignore TS6133
function cfnCertificateExtendedKeyUsagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_ExtendedKeyUsagePropertyValidator(properties).assertSuccess();
    return {
        ExtendedKeyUsageObjectIdentifier: cdk.stringToCloudFormation(properties.extendedKeyUsageObjectIdentifier),
        ExtendedKeyUsageType: cdk.stringToCloudFormation(properties.extendedKeyUsageType),
    };
}

// @ts-ignore TS6133
function CfnCertificateExtendedKeyUsagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.ExtendedKeyUsageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.ExtendedKeyUsageProperty>();
    ret.addPropertyResult('extendedKeyUsageObjectIdentifier', 'ExtendedKeyUsageObjectIdentifier', properties.ExtendedKeyUsageObjectIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ExtendedKeyUsageObjectIdentifier) : undefined);
    ret.addPropertyResult('extendedKeyUsageType', 'ExtendedKeyUsageType', properties.ExtendedKeyUsageType != null ? cfn_parse.FromCloudFormation.getString(properties.ExtendedKeyUsageType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Contains X.509 extension information for a certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html
     */
    export interface ExtensionsProperty {
        /**
         * Contains a sequence of one or more policy information terms, each of which consists of an object identifier (OID) and optional qualifiers. For more information, see NIST's definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
         *
         * In an end-entity certificate, these terms indicate the policy under which the certificate was issued and the purposes for which it may be used. In a CA certificate, these terms limit the set of policies for certification paths that include this certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html#cfn-acmpca-certificate-extensions-certificatepolicies
         */
        readonly certificatePolicies?: Array<CfnCertificate.PolicyInformationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Contains a sequence of one or more X.509 extensions, each of which consists of an object identifier (OID), a base64-encoded value, and the critical flag. For more information, see the [Global OID reference database.](https://docs.aws.amazon.com/https://oidref.com/2.5.29)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html#cfn-acmpca-certificate-extensions-customextensions
         */
        readonly customExtensions?: Array<CfnCertificate.CustomExtensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies additional purposes for which the certified public key may be used other than basic purposes indicated in the `KeyUsage` extension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html#cfn-acmpca-certificate-extensions-extendedkeyusage
         */
        readonly extendedKeyUsage?: Array<CfnCertificate.ExtendedKeyUsageProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Defines one or more purposes for which the key contained in the certificate can be used. Default value for each option is false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html#cfn-acmpca-certificate-extensions-keyusage
         */
        readonly keyUsage?: CfnCertificate.KeyUsageProperty | cdk.IResolvable;
        /**
         * The subject alternative name extension allows identities to be bound to the subject of the certificate. These identities may be included in addition to or in place of the identity in the subject field of the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-extensions.html#cfn-acmpca-certificate-extensions-subjectalternativenames
         */
        readonly subjectAlternativeNames?: Array<CfnCertificate.GeneralNameProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExtensionsProperty`
 *
 * @param properties - the TypeScript properties of a `ExtensionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_ExtensionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificatePolicies', cdk.listValidator(CfnCertificate_PolicyInformationPropertyValidator))(properties.certificatePolicies));
    errors.collect(cdk.propertyValidator('customExtensions', cdk.listValidator(CfnCertificate_CustomExtensionPropertyValidator))(properties.customExtensions));
    errors.collect(cdk.propertyValidator('extendedKeyUsage', cdk.listValidator(CfnCertificate_ExtendedKeyUsagePropertyValidator))(properties.extendedKeyUsage));
    errors.collect(cdk.propertyValidator('keyUsage', CfnCertificate_KeyUsagePropertyValidator)(properties.keyUsage));
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', cdk.listValidator(CfnCertificate_GeneralNamePropertyValidator))(properties.subjectAlternativeNames));
    return errors.wrap('supplied properties not correct for "ExtensionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Extensions` resource
 *
 * @param properties - the TypeScript properties of a `ExtensionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Extensions` resource.
 */
// @ts-ignore TS6133
function cfnCertificateExtensionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_ExtensionsPropertyValidator(properties).assertSuccess();
    return {
        CertificatePolicies: cdk.listMapper(cfnCertificatePolicyInformationPropertyToCloudFormation)(properties.certificatePolicies),
        CustomExtensions: cdk.listMapper(cfnCertificateCustomExtensionPropertyToCloudFormation)(properties.customExtensions),
        ExtendedKeyUsage: cdk.listMapper(cfnCertificateExtendedKeyUsagePropertyToCloudFormation)(properties.extendedKeyUsage),
        KeyUsage: cfnCertificateKeyUsagePropertyToCloudFormation(properties.keyUsage),
        SubjectAlternativeNames: cdk.listMapper(cfnCertificateGeneralNamePropertyToCloudFormation)(properties.subjectAlternativeNames),
    };
}

// @ts-ignore TS6133
function CfnCertificateExtensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.ExtensionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.ExtensionsProperty>();
    ret.addPropertyResult('certificatePolicies', 'CertificatePolicies', properties.CertificatePolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificatePolicyInformationPropertyFromCloudFormation)(properties.CertificatePolicies) : undefined);
    ret.addPropertyResult('customExtensions', 'CustomExtensions', properties.CustomExtensions != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateCustomExtensionPropertyFromCloudFormation)(properties.CustomExtensions) : undefined);
    ret.addPropertyResult('extendedKeyUsage', 'ExtendedKeyUsage', properties.ExtendedKeyUsage != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateExtendedKeyUsagePropertyFromCloudFormation)(properties.ExtendedKeyUsage) : undefined);
    ret.addPropertyResult('keyUsage', 'KeyUsage', properties.KeyUsage != null ? CfnCertificateKeyUsagePropertyFromCloudFormation(properties.KeyUsage) : undefined);
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateGeneralNamePropertyFromCloudFormation)(properties.SubjectAlternativeNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Describes an ASN.1 X.400 `GeneralName` as defined in [RFC 5280](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280) . Only one of the following naming options should be provided. Providing more than one option results in an `InvalidArgsException` error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html
     */
    export interface GeneralNameProperty {
        /**
         * Contains information about the certificate subject. The certificate can be one issued by your private certificate authority (CA) or it can be your private CA certificate. The Subject field in the certificate identifies the entity that owns or controls the public key in the certificate. The entity can be a user, computer, device, or service. The Subject must contain an X.500 distinguished name (DN). A DN is a sequence of relative distinguished names (RDNs). The RDNs are separated by commas in the certificate. The DN must be unique for each entity, but your private CA can issue more than one certificate with the same DN to the same entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-directoryname
         */
        readonly directoryName?: CfnCertificate.SubjectProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as a DNS name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-dnsname
         */
        readonly dnsName?: string;
        /**
         * Represents `GeneralName` as an `EdiPartyName` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-edipartyname
         */
        readonly ediPartyName?: CfnCertificate.EdiPartyNameProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as an IPv4 or IPv6 address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-ipaddress
         */
        readonly ipAddress?: string;
        /**
         * Represents `GeneralName` using an `OtherName` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-othername
         */
        readonly otherName?: CfnCertificate.OtherNameProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as an object identifier (OID).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-registeredid
         */
        readonly registeredId?: string;
        /**
         * Represents `GeneralName` as an [RFC 822](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc822) email address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-rfc822name
         */
        readonly rfc822Name?: string;
        /**
         * Represents `GeneralName` as a URI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-generalname.html#cfn-acmpca-certificate-generalname-uniformresourceidentifier
         */
        readonly uniformResourceIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GeneralNameProperty`
 *
 * @param properties - the TypeScript properties of a `GeneralNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_GeneralNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('directoryName', CfnCertificate_SubjectPropertyValidator)(properties.directoryName));
    errors.collect(cdk.propertyValidator('dnsName', cdk.validateString)(properties.dnsName));
    errors.collect(cdk.propertyValidator('ediPartyName', CfnCertificate_EdiPartyNamePropertyValidator)(properties.ediPartyName));
    errors.collect(cdk.propertyValidator('ipAddress', cdk.validateString)(properties.ipAddress));
    errors.collect(cdk.propertyValidator('otherName', CfnCertificate_OtherNamePropertyValidator)(properties.otherName));
    errors.collect(cdk.propertyValidator('registeredId', cdk.validateString)(properties.registeredId));
    errors.collect(cdk.propertyValidator('rfc822Name', cdk.validateString)(properties.rfc822Name));
    errors.collect(cdk.propertyValidator('uniformResourceIdentifier', cdk.validateString)(properties.uniformResourceIdentifier));
    return errors.wrap('supplied properties not correct for "GeneralNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.GeneralName` resource
 *
 * @param properties - the TypeScript properties of a `GeneralNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.GeneralName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateGeneralNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_GeneralNamePropertyValidator(properties).assertSuccess();
    return {
        DirectoryName: cfnCertificateSubjectPropertyToCloudFormation(properties.directoryName),
        DnsName: cdk.stringToCloudFormation(properties.dnsName),
        EdiPartyName: cfnCertificateEdiPartyNamePropertyToCloudFormation(properties.ediPartyName),
        IpAddress: cdk.stringToCloudFormation(properties.ipAddress),
        OtherName: cfnCertificateOtherNamePropertyToCloudFormation(properties.otherName),
        RegisteredId: cdk.stringToCloudFormation(properties.registeredId),
        Rfc822Name: cdk.stringToCloudFormation(properties.rfc822Name),
        UniformResourceIdentifier: cdk.stringToCloudFormation(properties.uniformResourceIdentifier),
    };
}

// @ts-ignore TS6133
function CfnCertificateGeneralNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.GeneralNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.GeneralNameProperty>();
    ret.addPropertyResult('directoryName', 'DirectoryName', properties.DirectoryName != null ? CfnCertificateSubjectPropertyFromCloudFormation(properties.DirectoryName) : undefined);
    ret.addPropertyResult('dnsName', 'DnsName', properties.DnsName != null ? cfn_parse.FromCloudFormation.getString(properties.DnsName) : undefined);
    ret.addPropertyResult('ediPartyName', 'EdiPartyName', properties.EdiPartyName != null ? CfnCertificateEdiPartyNamePropertyFromCloudFormation(properties.EdiPartyName) : undefined);
    ret.addPropertyResult('ipAddress', 'IpAddress', properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined);
    ret.addPropertyResult('otherName', 'OtherName', properties.OtherName != null ? CfnCertificateOtherNamePropertyFromCloudFormation(properties.OtherName) : undefined);
    ret.addPropertyResult('registeredId', 'RegisteredId', properties.RegisteredId != null ? cfn_parse.FromCloudFormation.getString(properties.RegisteredId) : undefined);
    ret.addPropertyResult('rfc822Name', 'Rfc822Name', properties.Rfc822Name != null ? cfn_parse.FromCloudFormation.getString(properties.Rfc822Name) : undefined);
    ret.addPropertyResult('uniformResourceIdentifier', 'UniformResourceIdentifier', properties.UniformResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.UniformResourceIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Defines one or more purposes for which the key contained in the certificate can be used. Default value for each option is false.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html
     */
    export interface KeyUsageProperty {
        /**
         * Key can be used to sign CRLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-crlsign
         */
        readonly crlSign?: boolean | cdk.IResolvable;
        /**
         * Key can be used to decipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-dataencipherment
         */
        readonly dataEncipherment?: boolean | cdk.IResolvable;
        /**
         * Key can be used only to decipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-decipheronly
         */
        readonly decipherOnly?: boolean | cdk.IResolvable;
        /**
         * Key can be used for digital signing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-digitalsignature
         */
        readonly digitalSignature?: boolean | cdk.IResolvable;
        /**
         * Key can be used only to encipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-encipheronly
         */
        readonly encipherOnly?: boolean | cdk.IResolvable;
        /**
         * Key can be used in a key-agreement protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-keyagreement
         */
        readonly keyAgreement?: boolean | cdk.IResolvable;
        /**
         * Key can be used to sign certificates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-keycertsign
         */
        readonly keyCertSign?: boolean | cdk.IResolvable;
        /**
         * Key can be used to encipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-keyencipherment
         */
        readonly keyEncipherment?: boolean | cdk.IResolvable;
        /**
         * Key can be used for non-repudiation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-keyusage.html#cfn-acmpca-certificate-keyusage-nonrepudiation
         */
        readonly nonRepudiation?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KeyUsageProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_KeyUsagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crlSign', cdk.validateBoolean)(properties.crlSign));
    errors.collect(cdk.propertyValidator('dataEncipherment', cdk.validateBoolean)(properties.dataEncipherment));
    errors.collect(cdk.propertyValidator('decipherOnly', cdk.validateBoolean)(properties.decipherOnly));
    errors.collect(cdk.propertyValidator('digitalSignature', cdk.validateBoolean)(properties.digitalSignature));
    errors.collect(cdk.propertyValidator('encipherOnly', cdk.validateBoolean)(properties.encipherOnly));
    errors.collect(cdk.propertyValidator('keyAgreement', cdk.validateBoolean)(properties.keyAgreement));
    errors.collect(cdk.propertyValidator('keyCertSign', cdk.validateBoolean)(properties.keyCertSign));
    errors.collect(cdk.propertyValidator('keyEncipherment', cdk.validateBoolean)(properties.keyEncipherment));
    errors.collect(cdk.propertyValidator('nonRepudiation', cdk.validateBoolean)(properties.nonRepudiation));
    return errors.wrap('supplied properties not correct for "KeyUsageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.KeyUsage` resource
 *
 * @param properties - the TypeScript properties of a `KeyUsageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.KeyUsage` resource.
 */
// @ts-ignore TS6133
function cfnCertificateKeyUsagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_KeyUsagePropertyValidator(properties).assertSuccess();
    return {
        CRLSign: cdk.booleanToCloudFormation(properties.crlSign),
        DataEncipherment: cdk.booleanToCloudFormation(properties.dataEncipherment),
        DecipherOnly: cdk.booleanToCloudFormation(properties.decipherOnly),
        DigitalSignature: cdk.booleanToCloudFormation(properties.digitalSignature),
        EncipherOnly: cdk.booleanToCloudFormation(properties.encipherOnly),
        KeyAgreement: cdk.booleanToCloudFormation(properties.keyAgreement),
        KeyCertSign: cdk.booleanToCloudFormation(properties.keyCertSign),
        KeyEncipherment: cdk.booleanToCloudFormation(properties.keyEncipherment),
        NonRepudiation: cdk.booleanToCloudFormation(properties.nonRepudiation),
    };
}

// @ts-ignore TS6133
function CfnCertificateKeyUsagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.KeyUsageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.KeyUsageProperty>();
    ret.addPropertyResult('crlSign', 'CRLSign', properties.CRLSign != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CRLSign) : undefined);
    ret.addPropertyResult('dataEncipherment', 'DataEncipherment', properties.DataEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataEncipherment) : undefined);
    ret.addPropertyResult('decipherOnly', 'DecipherOnly', properties.DecipherOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DecipherOnly) : undefined);
    ret.addPropertyResult('digitalSignature', 'DigitalSignature', properties.DigitalSignature != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DigitalSignature) : undefined);
    ret.addPropertyResult('encipherOnly', 'EncipherOnly', properties.EncipherOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EncipherOnly) : undefined);
    ret.addPropertyResult('keyAgreement', 'KeyAgreement', properties.KeyAgreement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyAgreement) : undefined);
    ret.addPropertyResult('keyCertSign', 'KeyCertSign', properties.KeyCertSign != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyCertSign) : undefined);
    ret.addPropertyResult('keyEncipherment', 'KeyEncipherment', properties.KeyEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyEncipherment) : undefined);
    ret.addPropertyResult('nonRepudiation', 'NonRepudiation', properties.NonRepudiation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NonRepudiation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Defines a custom ASN.1 X.400 `GeneralName` using an object identifier (OID) and value. The OID must satisfy the regular expression shown below. For more information, see NIST's definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-othername.html
     */
    export interface OtherNameProperty {
        /**
         * Specifies an OID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-othername.html#cfn-acmpca-certificate-othername-typeid
         */
        readonly typeId: string;
        /**
         * Specifies an OID value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-othername.html#cfn-acmpca-certificate-othername-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `OtherNameProperty`
 *
 * @param properties - the TypeScript properties of a `OtherNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_OtherNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('typeId', cdk.requiredValidator)(properties.typeId));
    errors.collect(cdk.propertyValidator('typeId', cdk.validateString)(properties.typeId));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "OtherNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.OtherName` resource
 *
 * @param properties - the TypeScript properties of a `OtherNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.OtherName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateOtherNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_OtherNamePropertyValidator(properties).assertSuccess();
    return {
        TypeId: cdk.stringToCloudFormation(properties.typeId),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateOtherNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.OtherNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.OtherNameProperty>();
    ret.addPropertyResult('typeId', 'TypeId', cfn_parse.FromCloudFormation.getString(properties.TypeId));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Defines the X.509 `CertificatePolicies` extension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyinformation.html
     */
    export interface PolicyInformationProperty {
        /**
         * Specifies the object identifier (OID) of the certificate policy under which the certificate was issued. For more information, see NIST's definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyinformation.html#cfn-acmpca-certificate-policyinformation-certpolicyid
         */
        readonly certPolicyId: string;
        /**
         * Modifies the given `CertPolicyId` with a qualifier. AWS Private CA supports the certification practice statement (CPS) qualifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyinformation.html#cfn-acmpca-certificate-policyinformation-policyqualifiers
         */
        readonly policyQualifiers?: Array<CfnCertificate.PolicyQualifierInfoProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyInformationProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyInformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_PolicyInformationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certPolicyId', cdk.requiredValidator)(properties.certPolicyId));
    errors.collect(cdk.propertyValidator('certPolicyId', cdk.validateString)(properties.certPolicyId));
    errors.collect(cdk.propertyValidator('policyQualifiers', cdk.listValidator(CfnCertificate_PolicyQualifierInfoPropertyValidator))(properties.policyQualifiers));
    return errors.wrap('supplied properties not correct for "PolicyInformationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.PolicyInformation` resource
 *
 * @param properties - the TypeScript properties of a `PolicyInformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.PolicyInformation` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePolicyInformationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_PolicyInformationPropertyValidator(properties).assertSuccess();
    return {
        CertPolicyId: cdk.stringToCloudFormation(properties.certPolicyId),
        PolicyQualifiers: cdk.listMapper(cfnCertificatePolicyQualifierInfoPropertyToCloudFormation)(properties.policyQualifiers),
    };
}

// @ts-ignore TS6133
function CfnCertificatePolicyInformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.PolicyInformationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.PolicyInformationProperty>();
    ret.addPropertyResult('certPolicyId', 'CertPolicyId', cfn_parse.FromCloudFormation.getString(properties.CertPolicyId));
    ret.addPropertyResult('policyQualifiers', 'PolicyQualifiers', properties.PolicyQualifiers != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificatePolicyQualifierInfoPropertyFromCloudFormation)(properties.PolicyQualifiers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Modifies the `CertPolicyId` of a `PolicyInformation` object with a qualifier. AWS Private CA supports the certification practice statement (CPS) qualifier.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyqualifierinfo.html
     */
    export interface PolicyQualifierInfoProperty {
        /**
         * Identifies the qualifier modifying a `CertPolicyId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyqualifierinfo.html#cfn-acmpca-certificate-policyqualifierinfo-policyqualifierid
         */
        readonly policyQualifierId: string;
        /**
         * Defines the qualifier type. AWS Private CA supports the use of a URI for a CPS qualifier in this field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-policyqualifierinfo.html#cfn-acmpca-certificate-policyqualifierinfo-qualifier
         */
        readonly qualifier: CfnCertificate.QualifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyQualifierInfoProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyQualifierInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_PolicyQualifierInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyQualifierId', cdk.requiredValidator)(properties.policyQualifierId));
    errors.collect(cdk.propertyValidator('policyQualifierId', cdk.validateString)(properties.policyQualifierId));
    errors.collect(cdk.propertyValidator('qualifier', cdk.requiredValidator)(properties.qualifier));
    errors.collect(cdk.propertyValidator('qualifier', CfnCertificate_QualifierPropertyValidator)(properties.qualifier));
    return errors.wrap('supplied properties not correct for "PolicyQualifierInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.PolicyQualifierInfo` resource
 *
 * @param properties - the TypeScript properties of a `PolicyQualifierInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.PolicyQualifierInfo` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePolicyQualifierInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_PolicyQualifierInfoPropertyValidator(properties).assertSuccess();
    return {
        PolicyQualifierId: cdk.stringToCloudFormation(properties.policyQualifierId),
        Qualifier: cfnCertificateQualifierPropertyToCloudFormation(properties.qualifier),
    };
}

// @ts-ignore TS6133
function CfnCertificatePolicyQualifierInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.PolicyQualifierInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.PolicyQualifierInfoProperty>();
    ret.addPropertyResult('policyQualifierId', 'PolicyQualifierId', cfn_parse.FromCloudFormation.getString(properties.PolicyQualifierId));
    ret.addPropertyResult('qualifier', 'Qualifier', CfnCertificateQualifierPropertyFromCloudFormation(properties.Qualifier));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Defines a `PolicyInformation` qualifier. AWS Private CA supports the [certification practice statement (CPS) qualifier](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.4) defined in RFC 5280.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-qualifier.html
     */
    export interface QualifierProperty {
        /**
         * Contains a pointer to a certification practice statement (CPS) published by the CA.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-qualifier.html#cfn-acmpca-certificate-qualifier-cpsuri
         */
        readonly cpsUri: string;
    }
}

/**
 * Determine whether the given properties match those of a `QualifierProperty`
 *
 * @param properties - the TypeScript properties of a `QualifierProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_QualifierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpsUri', cdk.requiredValidator)(properties.cpsUri));
    errors.collect(cdk.propertyValidator('cpsUri', cdk.validateString)(properties.cpsUri));
    return errors.wrap('supplied properties not correct for "QualifierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Qualifier` resource
 *
 * @param properties - the TypeScript properties of a `QualifierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Qualifier` resource.
 */
// @ts-ignore TS6133
function cfnCertificateQualifierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_QualifierPropertyValidator(properties).assertSuccess();
    return {
        CpsUri: cdk.stringToCloudFormation(properties.cpsUri),
    };
}

// @ts-ignore TS6133
function CfnCertificateQualifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.QualifierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.QualifierProperty>();
    ret.addPropertyResult('cpsUri', 'CpsUri', cfn_parse.FromCloudFormation.getString(properties.CpsUri));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Contains information about the certificate subject. The `Subject` field in the certificate identifies the entity that owns or controls the public key in the certificate. The entity can be a user, computer, device, or service. The `Subject` must contain an X.500 distinguished name (DN). A DN is a sequence of relative distinguished names (RDNs). The RDNs are separated by commas in the certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html
     */
    export interface SubjectProperty {
        /**
         * For CA and end-entity certificates in a private PKI, the common name (CN) can be any string within the length limit.
         *
         * Note: In publicly trusted certificates, the common name must be a fully qualified domain name (FQDN) associated with the certificate subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-commonname
         */
        readonly commonName?: string;
        /**
         * Two-digit code that specifies the country in which the certificate subject located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-country
         */
        readonly country?: string;
        /**
         * Contains a sequence of one or more X.500 relative distinguished names (RDNs), each of which consists of an object identifier (OID) and a value. For more information, see NIST’s definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
         *
         * > Custom attributes cannot be used in combination with standard attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-customattributes
         */
        readonly customAttributes?: Array<CfnCertificate.CustomAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Disambiguating information for the certificate subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-distinguishednamequalifier
         */
        readonly distinguishedNameQualifier?: string;
        /**
         * Typically a qualifier appended to the name of an individual. Examples include Jr. for junior, Sr. for senior, and III for third.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-generationqualifier
         */
        readonly generationQualifier?: string;
        /**
         * First name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-givenname
         */
        readonly givenName?: string;
        /**
         * Concatenation that typically contains the first letter of the *GivenName* , the first letter of the middle name if one exists, and the first letter of the *Surname* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-initials
         */
        readonly initials?: string;
        /**
         * The locality (such as a city or town) in which the certificate subject is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-locality
         */
        readonly locality?: string;
        /**
         * Legal name of the organization with which the certificate subject is affiliated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-organization
         */
        readonly organization?: string;
        /**
         * A subdivision or unit of the organization (such as sales or finance) with which the certificate subject is affiliated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-organizationalunit
         */
        readonly organizationalUnit?: string;
        /**
         * Typically a shortened version of a longer *GivenName* . For example, Jonathan is often shortened to John. Elizabeth is often shortened to Beth, Liz, or Eliza.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-pseudonym
         */
        readonly pseudonym?: string;
        /**
         * The certificate serial number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-serialnumber
         */
        readonly serialNumber?: string;
        /**
         * State in which the subject of the certificate is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-state
         */
        readonly state?: string;
        /**
         * Family name. In the US and the UK, for example, the surname of an individual is ordered last. In Asian cultures the surname is typically ordered first.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-surname
         */
        readonly surname?: string;
        /**
         * A title such as Mr. or Ms., which is pre-pended to the name to refer formally to the certificate subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-subject.html#cfn-acmpca-certificate-subject-title
         */
        readonly title?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubjectProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_SubjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('commonName', cdk.validateString)(properties.commonName));
    errors.collect(cdk.propertyValidator('country', cdk.validateString)(properties.country));
    errors.collect(cdk.propertyValidator('customAttributes', cdk.listValidator(CfnCertificate_CustomAttributePropertyValidator))(properties.customAttributes));
    errors.collect(cdk.propertyValidator('distinguishedNameQualifier', cdk.validateString)(properties.distinguishedNameQualifier));
    errors.collect(cdk.propertyValidator('generationQualifier', cdk.validateString)(properties.generationQualifier));
    errors.collect(cdk.propertyValidator('givenName', cdk.validateString)(properties.givenName));
    errors.collect(cdk.propertyValidator('initials', cdk.validateString)(properties.initials));
    errors.collect(cdk.propertyValidator('locality', cdk.validateString)(properties.locality));
    errors.collect(cdk.propertyValidator('organization', cdk.validateString)(properties.organization));
    errors.collect(cdk.propertyValidator('organizationalUnit', cdk.validateString)(properties.organizationalUnit));
    errors.collect(cdk.propertyValidator('pseudonym', cdk.validateString)(properties.pseudonym));
    errors.collect(cdk.propertyValidator('serialNumber', cdk.validateString)(properties.serialNumber));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('surname', cdk.validateString)(properties.surname));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    return errors.wrap('supplied properties not correct for "SubjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Subject` resource
 *
 * @param properties - the TypeScript properties of a `SubjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Subject` resource.
 */
// @ts-ignore TS6133
function cfnCertificateSubjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_SubjectPropertyValidator(properties).assertSuccess();
    return {
        CommonName: cdk.stringToCloudFormation(properties.commonName),
        Country: cdk.stringToCloudFormation(properties.country),
        CustomAttributes: cdk.listMapper(cfnCertificateCustomAttributePropertyToCloudFormation)(properties.customAttributes),
        DistinguishedNameQualifier: cdk.stringToCloudFormation(properties.distinguishedNameQualifier),
        GenerationQualifier: cdk.stringToCloudFormation(properties.generationQualifier),
        GivenName: cdk.stringToCloudFormation(properties.givenName),
        Initials: cdk.stringToCloudFormation(properties.initials),
        Locality: cdk.stringToCloudFormation(properties.locality),
        Organization: cdk.stringToCloudFormation(properties.organization),
        OrganizationalUnit: cdk.stringToCloudFormation(properties.organizationalUnit),
        Pseudonym: cdk.stringToCloudFormation(properties.pseudonym),
        SerialNumber: cdk.stringToCloudFormation(properties.serialNumber),
        State: cdk.stringToCloudFormation(properties.state),
        Surname: cdk.stringToCloudFormation(properties.surname),
        Title: cdk.stringToCloudFormation(properties.title),
    };
}

// @ts-ignore TS6133
function CfnCertificateSubjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.SubjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.SubjectProperty>();
    ret.addPropertyResult('commonName', 'CommonName', properties.CommonName != null ? cfn_parse.FromCloudFormation.getString(properties.CommonName) : undefined);
    ret.addPropertyResult('country', 'Country', properties.Country != null ? cfn_parse.FromCloudFormation.getString(properties.Country) : undefined);
    ret.addPropertyResult('customAttributes', 'CustomAttributes', properties.CustomAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateCustomAttributePropertyFromCloudFormation)(properties.CustomAttributes) : undefined);
    ret.addPropertyResult('distinguishedNameQualifier', 'DistinguishedNameQualifier', properties.DistinguishedNameQualifier != null ? cfn_parse.FromCloudFormation.getString(properties.DistinguishedNameQualifier) : undefined);
    ret.addPropertyResult('generationQualifier', 'GenerationQualifier', properties.GenerationQualifier != null ? cfn_parse.FromCloudFormation.getString(properties.GenerationQualifier) : undefined);
    ret.addPropertyResult('givenName', 'GivenName', properties.GivenName != null ? cfn_parse.FromCloudFormation.getString(properties.GivenName) : undefined);
    ret.addPropertyResult('initials', 'Initials', properties.Initials != null ? cfn_parse.FromCloudFormation.getString(properties.Initials) : undefined);
    ret.addPropertyResult('locality', 'Locality', properties.Locality != null ? cfn_parse.FromCloudFormation.getString(properties.Locality) : undefined);
    ret.addPropertyResult('organization', 'Organization', properties.Organization != null ? cfn_parse.FromCloudFormation.getString(properties.Organization) : undefined);
    ret.addPropertyResult('organizationalUnit', 'OrganizationalUnit', properties.OrganizationalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnit) : undefined);
    ret.addPropertyResult('pseudonym', 'Pseudonym', properties.Pseudonym != null ? cfn_parse.FromCloudFormation.getString(properties.Pseudonym) : undefined);
    ret.addPropertyResult('serialNumber', 'SerialNumber', properties.SerialNumber != null ? cfn_parse.FromCloudFormation.getString(properties.SerialNumber) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('surname', 'Surname', properties.Surname != null ? cfn_parse.FromCloudFormation.getString(properties.Surname) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificate {
    /**
     * Length of time for which the certificate issued by your private certificate authority (CA), or by the private CA itself, is valid in days, months, or years. You can issue a certificate by calling the `IssueCertificate` operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-validity.html
     */
    export interface ValidityProperty {
        /**
         * Specifies whether the `Value` parameter represents days, months, or years.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-validity.html#cfn-acmpca-certificate-validity-type
         */
        readonly type: string;
        /**
         * A long integer interpreted according to the value of `Type` , below.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificate-validity.html#cfn-acmpca-certificate-validity-value
         */
        readonly value: number;
    }
}

/**
 * Determine whether the given properties match those of a `ValidityProperty`
 *
 * @param properties - the TypeScript properties of a `ValidityProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificate_ValidityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "ValidityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Validity` resource
 *
 * @param properties - the TypeScript properties of a `ValidityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Certificate.Validity` resource.
 */
// @ts-ignore TS6133
function cfnCertificateValidityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificate_ValidityPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateValidityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificate.ValidityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificate.ValidityProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getNumber(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCertificateAuthority`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html
 */
export interface CfnCertificateAuthorityProps {

    /**
     * Type of the public key algorithm and size, in bits, of the key pair that your CA creates when it issues a certificate. When you create a subordinate CA, you must use a key algorithm supported by the parent CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-keyalgorithm
     */
    readonly keyAlgorithm: string;

    /**
     * Name of the algorithm your private CA uses to sign certificate requests.
     *
     * This parameter should not be confused with the `SigningAlgorithm` parameter used to sign certificates when they are issued.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-signingalgorithm
     */
    readonly signingAlgorithm: string;

    /**
     * Structure that contains X.500 distinguished name information for your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-subject
     */
    readonly subject: CfnCertificateAuthority.SubjectProperty | cdk.IResolvable;

    /**
     * Type of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-type
     */
    readonly type: string;

    /**
     * Specifies information to be added to the extension section of the certificate signing request (CSR).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-csrextensions
     */
    readonly csrExtensions?: CfnCertificateAuthority.CsrExtensionsProperty | cdk.IResolvable;

    /**
     * Specifies a cryptographic key management compliance standard used for handling CA keys.
     *
     * Default: FIPS_140_2_LEVEL_3_OR_HIGHER
     *
     * *Note:* `FIPS_140_2_LEVEL_3_OR_HIGHER` is not supported in the following Regions:
     *
     * - ap-northeast-3
     * - ap-southeast-3
     *
     * When creating a CA in these Regions, you must provide `FIPS_140_2_LEVEL_2_OR_HIGHER` as the argument for `KeyStorageSecurityStandard` . Failure to do this results in an `InvalidArgsException` with the message, "A certificate authority cannot be created in this region with the specified security standard."
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-keystoragesecuritystandard
     */
    readonly keyStorageSecurityStandard?: string;

    /**
     * Certificate revocation information used by the [CreateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_CreateCertificateAuthority.html) and [UpdateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_UpdateCertificateAuthority.html) actions. Your private certificate authority (CA) can configure Online Certificate Status Protocol (OCSP) support and/or maintain a certificate revocation list (CRL). OCSP returns validation information about certificates as requested by clients, and a CRL contains an updated list of certificates revoked by your CA. For more information, see [RevokeCertificate](https://docs.aws.amazon.com/privateca/latest/APIReference/API_RevokeCertificate.html) in the *AWS Private CA API Reference* and [Setting up a certificate revocation method](https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html) in the *AWS Private CA User Guide* .
     *
     * > The following requirements apply to revocation configurations.
     * >
     * > - A configuration disabling CRLs or OCSP must contain only the `Enabled=False` parameter, and will fail if other parameters such as `CustomCname` or `ExpirationInDays` are included.
     * > - In a CRL configuration, the `S3BucketName` parameter must conform to the [Amazon S3 bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) .
     * > - A configuration containing a custom Canonical Name (CNAME) parameter for CRLs or OCSP must conform to [RFC2396](https://docs.aws.amazon.com/https://www.ietf.org/rfc/rfc2396.txt) restrictions on the use of special characters in a CNAME.
     * > - In a CRL or OCSP configuration, the value of a CNAME parameter must not include a protocol prefix such as "http://" or "https://".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-revocationconfiguration
     */
    readonly revocationConfiguration?: CfnCertificateAuthority.RevocationConfigurationProperty | cdk.IResolvable;

    /**
     * Key-value pairs that will be attached to the new private CA. You can associate up to 50 tags with a private CA. For information using tags with IAM to manage permissions, see [Controlling Access Using IAM Tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_iam-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specifies whether the CA issues general-purpose certificates that typically require a revocation mechanism, or short-lived certificates that may optionally omit revocation because they expire quickly. Short-lived certificate validity is limited to seven days.
     *
     * The default value is GENERAL_PURPOSE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-usagemode
     */
    readonly usageMode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateAuthorityProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateAuthorityProps`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthorityPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csrExtensions', CfnCertificateAuthority_CsrExtensionsPropertyValidator)(properties.csrExtensions));
    errors.collect(cdk.propertyValidator('keyAlgorithm', cdk.requiredValidator)(properties.keyAlgorithm));
    errors.collect(cdk.propertyValidator('keyAlgorithm', cdk.validateString)(properties.keyAlgorithm));
    errors.collect(cdk.propertyValidator('keyStorageSecurityStandard', cdk.validateString)(properties.keyStorageSecurityStandard));
    errors.collect(cdk.propertyValidator('revocationConfiguration', CfnCertificateAuthority_RevocationConfigurationPropertyValidator)(properties.revocationConfiguration));
    errors.collect(cdk.propertyValidator('signingAlgorithm', cdk.requiredValidator)(properties.signingAlgorithm));
    errors.collect(cdk.propertyValidator('signingAlgorithm', cdk.validateString)(properties.signingAlgorithm));
    errors.collect(cdk.propertyValidator('subject', cdk.requiredValidator)(properties.subject));
    errors.collect(cdk.propertyValidator('subject', CfnCertificateAuthority_SubjectPropertyValidator)(properties.subject));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('usageMode', cdk.validateString)(properties.usageMode));
    return errors.wrap('supplied properties not correct for "CfnCertificateAuthorityProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateAuthorityProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthorityPropsValidator(properties).assertSuccess();
    return {
        KeyAlgorithm: cdk.stringToCloudFormation(properties.keyAlgorithm),
        SigningAlgorithm: cdk.stringToCloudFormation(properties.signingAlgorithm),
        Subject: cfnCertificateAuthoritySubjectPropertyToCloudFormation(properties.subject),
        Type: cdk.stringToCloudFormation(properties.type),
        CsrExtensions: cfnCertificateAuthorityCsrExtensionsPropertyToCloudFormation(properties.csrExtensions),
        KeyStorageSecurityStandard: cdk.stringToCloudFormation(properties.keyStorageSecurityStandard),
        RevocationConfiguration: cfnCertificateAuthorityRevocationConfigurationPropertyToCloudFormation(properties.revocationConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UsageMode: cdk.stringToCloudFormation(properties.usageMode),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthorityProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthorityProps>();
    ret.addPropertyResult('keyAlgorithm', 'KeyAlgorithm', cfn_parse.FromCloudFormation.getString(properties.KeyAlgorithm));
    ret.addPropertyResult('signingAlgorithm', 'SigningAlgorithm', cfn_parse.FromCloudFormation.getString(properties.SigningAlgorithm));
    ret.addPropertyResult('subject', 'Subject', CfnCertificateAuthoritySubjectPropertyFromCloudFormation(properties.Subject));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('csrExtensions', 'CsrExtensions', properties.CsrExtensions != null ? CfnCertificateAuthorityCsrExtensionsPropertyFromCloudFormation(properties.CsrExtensions) : undefined);
    ret.addPropertyResult('keyStorageSecurityStandard', 'KeyStorageSecurityStandard', properties.KeyStorageSecurityStandard != null ? cfn_parse.FromCloudFormation.getString(properties.KeyStorageSecurityStandard) : undefined);
    ret.addPropertyResult('revocationConfiguration', 'RevocationConfiguration', properties.RevocationConfiguration != null ? CfnCertificateAuthorityRevocationConfigurationPropertyFromCloudFormation(properties.RevocationConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('usageMode', 'UsageMode', properties.UsageMode != null ? cfn_parse.FromCloudFormation.getString(properties.UsageMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ACMPCA::CertificateAuthority`
 *
 * Use the `AWS::ACMPCA::CertificateAuthority` resource to create a private CA. Once the CA exists, you can use the `AWS::ACMPCA::Certificate` resource to issue a new CA certificate. Alternatively, you can issue a CA certificate using an on-premises CA, and then use the `AWS::ACMPCA::CertificateAuthorityActivation` resource to import the new CA certificate and activate the CA.
 *
 * > Before removing a `AWS::ACMPCA::CertificateAuthority` resource from the CloudFormation stack, disable the affected CA. Otherwise, the action will fail. You can disable the CA by removing its associated `AWS::ACMPCA::CertificateAuthorityActivation` resource from CloudFormation.
 *
 * @cloudformationResource AWS::ACMPCA::CertificateAuthority
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html
 */
export class CfnCertificateAuthority extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ACMPCA::CertificateAuthority";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificateAuthority {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCertificateAuthorityPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCertificateAuthority(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the private CA that issued the certificate.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Base64 PEM-encoded certificate signing request (CSR) for your certificate authority certificate.
     * @cloudformationAttribute CertificateSigningRequest
     */
    public readonly attrCertificateSigningRequest: string;

    /**
     * Type of the public key algorithm and size, in bits, of the key pair that your CA creates when it issues a certificate. When you create a subordinate CA, you must use a key algorithm supported by the parent CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-keyalgorithm
     */
    public keyAlgorithm: string;

    /**
     * Name of the algorithm your private CA uses to sign certificate requests.
     *
     * This parameter should not be confused with the `SigningAlgorithm` parameter used to sign certificates when they are issued.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-signingalgorithm
     */
    public signingAlgorithm: string;

    /**
     * Structure that contains X.500 distinguished name information for your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-subject
     */
    public subject: CfnCertificateAuthority.SubjectProperty | cdk.IResolvable;

    /**
     * Type of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-type
     */
    public type: string;

    /**
     * Specifies information to be added to the extension section of the certificate signing request (CSR).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-csrextensions
     */
    public csrExtensions: CfnCertificateAuthority.CsrExtensionsProperty | cdk.IResolvable | undefined;

    /**
     * Specifies a cryptographic key management compliance standard used for handling CA keys.
     *
     * Default: FIPS_140_2_LEVEL_3_OR_HIGHER
     *
     * *Note:* `FIPS_140_2_LEVEL_3_OR_HIGHER` is not supported in the following Regions:
     *
     * - ap-northeast-3
     * - ap-southeast-3
     *
     * When creating a CA in these Regions, you must provide `FIPS_140_2_LEVEL_2_OR_HIGHER` as the argument for `KeyStorageSecurityStandard` . Failure to do this results in an `InvalidArgsException` with the message, "A certificate authority cannot be created in this region with the specified security standard."
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-keystoragesecuritystandard
     */
    public keyStorageSecurityStandard: string | undefined;

    /**
     * Certificate revocation information used by the [CreateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_CreateCertificateAuthority.html) and [UpdateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_UpdateCertificateAuthority.html) actions. Your private certificate authority (CA) can configure Online Certificate Status Protocol (OCSP) support and/or maintain a certificate revocation list (CRL). OCSP returns validation information about certificates as requested by clients, and a CRL contains an updated list of certificates revoked by your CA. For more information, see [RevokeCertificate](https://docs.aws.amazon.com/privateca/latest/APIReference/API_RevokeCertificate.html) in the *AWS Private CA API Reference* and [Setting up a certificate revocation method](https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html) in the *AWS Private CA User Guide* .
     *
     * > The following requirements apply to revocation configurations.
     * >
     * > - A configuration disabling CRLs or OCSP must contain only the `Enabled=False` parameter, and will fail if other parameters such as `CustomCname` or `ExpirationInDays` are included.
     * > - In a CRL configuration, the `S3BucketName` parameter must conform to the [Amazon S3 bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) .
     * > - A configuration containing a custom Canonical Name (CNAME) parameter for CRLs or OCSP must conform to [RFC2396](https://docs.aws.amazon.com/https://www.ietf.org/rfc/rfc2396.txt) restrictions on the use of special characters in a CNAME.
     * > - In a CRL or OCSP configuration, the value of a CNAME parameter must not include a protocol prefix such as "http://" or "https://".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-revocationconfiguration
     */
    public revocationConfiguration: CfnCertificateAuthority.RevocationConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Key-value pairs that will be attached to the new private CA. You can associate up to 50 tags with a private CA. For information using tags with IAM to manage permissions, see [Controlling Access Using IAM Tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_iam-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specifies whether the CA issues general-purpose certificates that typically require a revocation mechanism, or short-lived certificates that may optionally omit revocation because they expire quickly. Short-lived certificate validity is limited to seven days.
     *
     * The default value is GENERAL_PURPOSE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthority.html#cfn-acmpca-certificateauthority-usagemode
     */
    public usageMode: string | undefined;

    /**
     * Create a new `AWS::ACMPCA::CertificateAuthority`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateAuthorityProps) {
        super(scope, id, { type: CfnCertificateAuthority.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'keyAlgorithm', this);
        cdk.requireProperty(props, 'signingAlgorithm', this);
        cdk.requireProperty(props, 'subject', this);
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCertificateSigningRequest = cdk.Token.asString(this.getAtt('CertificateSigningRequest', cdk.ResolutionTypeHint.STRING));

        this.keyAlgorithm = props.keyAlgorithm;
        this.signingAlgorithm = props.signingAlgorithm;
        this.subject = props.subject;
        this.type = props.type;
        this.csrExtensions = props.csrExtensions;
        this.keyStorageSecurityStandard = props.keyStorageSecurityStandard;
        this.revocationConfiguration = props.revocationConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ACMPCA::CertificateAuthority", props.tags, { tagPropertyName: 'tags' });
        this.usageMode = props.usageMode;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificateAuthority.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            keyAlgorithm: this.keyAlgorithm,
            signingAlgorithm: this.signingAlgorithm,
            subject: this.subject,
            type: this.type,
            csrExtensions: this.csrExtensions,
            keyStorageSecurityStandard: this.keyStorageSecurityStandard,
            revocationConfiguration: this.revocationConfiguration,
            tags: this.tags.renderTags(),
            usageMode: this.usageMode,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificateAuthorityPropsToCloudFormation(props);
    }
}

export namespace CfnCertificateAuthority {
    /**
     * Provides access information used by the `authorityInfoAccess` and `subjectInfoAccess` extensions described in [RFC 5280](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessdescription.html
     */
    export interface AccessDescriptionProperty {
        /**
         * The location of `AccessDescription` information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessdescription.html#cfn-acmpca-certificateauthority-accessdescription-accesslocation
         */
        readonly accessLocation: CfnCertificateAuthority.GeneralNameProperty | cdk.IResolvable;
        /**
         * The type and format of `AccessDescription` information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessdescription.html#cfn-acmpca-certificateauthority-accessdescription-accessmethod
         */
        readonly accessMethod: CfnCertificateAuthority.AccessMethodProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AccessDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `AccessDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_AccessDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLocation', cdk.requiredValidator)(properties.accessLocation));
    errors.collect(cdk.propertyValidator('accessLocation', CfnCertificateAuthority_GeneralNamePropertyValidator)(properties.accessLocation));
    errors.collect(cdk.propertyValidator('accessMethod', cdk.requiredValidator)(properties.accessMethod));
    errors.collect(cdk.propertyValidator('accessMethod', CfnCertificateAuthority_AccessMethodPropertyValidator)(properties.accessMethod));
    return errors.wrap('supplied properties not correct for "AccessDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.AccessDescription` resource
 *
 * @param properties - the TypeScript properties of a `AccessDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.AccessDescription` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityAccessDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_AccessDescriptionPropertyValidator(properties).assertSuccess();
    return {
        AccessLocation: cfnCertificateAuthorityGeneralNamePropertyToCloudFormation(properties.accessLocation),
        AccessMethod: cfnCertificateAuthorityAccessMethodPropertyToCloudFormation(properties.accessMethod),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityAccessDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.AccessDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.AccessDescriptionProperty>();
    ret.addPropertyResult('accessLocation', 'AccessLocation', CfnCertificateAuthorityGeneralNamePropertyFromCloudFormation(properties.AccessLocation));
    ret.addPropertyResult('accessMethod', 'AccessMethod', CfnCertificateAuthorityAccessMethodPropertyFromCloudFormation(properties.AccessMethod));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Describes the type and format of extension access. Only one of `CustomObjectIdentifier` or `AccessMethodType` may be provided. Providing both results in `InvalidArgsException` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessmethod.html
     */
    export interface AccessMethodProperty {
        /**
         * Specifies the `AccessMethod` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessmethod.html#cfn-acmpca-certificateauthority-accessmethod-accessmethodtype
         */
        readonly accessMethodType?: string;
        /**
         * An object identifier (OID) specifying the `AccessMethod` . The OID must satisfy the regular expression shown below. For more information, see NIST's definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-accessmethod.html#cfn-acmpca-certificateauthority-accessmethod-customobjectidentifier
         */
        readonly customObjectIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessMethodProperty`
 *
 * @param properties - the TypeScript properties of a `AccessMethodProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_AccessMethodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessMethodType', cdk.validateString)(properties.accessMethodType));
    errors.collect(cdk.propertyValidator('customObjectIdentifier', cdk.validateString)(properties.customObjectIdentifier));
    return errors.wrap('supplied properties not correct for "AccessMethodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.AccessMethod` resource
 *
 * @param properties - the TypeScript properties of a `AccessMethodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.AccessMethod` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityAccessMethodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_AccessMethodPropertyValidator(properties).assertSuccess();
    return {
        AccessMethodType: cdk.stringToCloudFormation(properties.accessMethodType),
        CustomObjectIdentifier: cdk.stringToCloudFormation(properties.customObjectIdentifier),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityAccessMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.AccessMethodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.AccessMethodProperty>();
    ret.addPropertyResult('accessMethodType', 'AccessMethodType', properties.AccessMethodType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessMethodType) : undefined);
    ret.addPropertyResult('customObjectIdentifier', 'CustomObjectIdentifier', properties.CustomObjectIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CustomObjectIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Contains configuration information for a certificate revocation list (CRL). Your private certificate authority (CA) creates base CRLs. Delta CRLs are not supported. You can enable CRLs for your new or an existing private CA by setting the *Enabled* parameter to `true` . Your private CA writes CRLs to an S3 bucket that you specify in the *S3BucketName* parameter. You can hide the name of your bucket by specifying a value for the *CustomCname* parameter. Your private CA copies the CNAME or the S3 bucket name to the *CRL Distribution Points* extension of each certificate it issues. Your S3 bucket policy must give write permission to AWS Private CA.
     *
     * AWS Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see [Encrypting Your CRLs](https://docs.aws.amazon.com/privateca/latest/userguide/PcaCreateCa.html#crl-encryption) .
     *
     * Your private CA uses the value in the *ExpirationInDays* parameter to calculate the *nextUpdate* field in the CRL. The CRL is refreshed prior to a certificate's expiration date or when a certificate is revoked. When a certificate is revoked, it appears in the CRL until the certificate expires, and then in one additional CRL after expiration, and it always appears in the audit report.
     *
     * A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason a CRL update fails, AWS Private CA makes further attempts every 15 minutes.
     *
     * CRLs contain the following fields:
     *
     * - *Version* : The current version number defined in RFC 5280 is V2. The integer value is 0x1.
     * - *Signature Algorithm* : The name of the algorithm used to sign the CRL.
     * - *Issuer* : The X.500 distinguished name of your private CA that issued the CRL.
     * - *Last Update* : The issue date and time of this CRL.
     * - *Next Update* : The day and time by which the next CRL will be issued.
     * - *Revoked Certificates* : List of revoked certificates. Each list item contains the following information.
     *
     * - *Serial Number* : The serial number, in hexadecimal format, of the revoked certificate.
     * - *Revocation Date* : Date and time the certificate was revoked.
     * - *CRL Entry Extensions* : Optional extensions for the CRL entry.
     *
     * - *X509v3 CRL Reason Code* : Reason the certificate was revoked.
     * - *CRL Extensions* : Optional extensions for the CRL.
     *
     * - *X509v3 Authority Key Identifier* : Identifies the public key associated with the private key used to sign the certificate.
     * - *X509v3 CRL Number:* : Decimal sequence number for the CRL.
     * - *Signature Algorithm* : Algorithm used by your private CA to sign the CRL.
     * - *Signature Value* : Signature computed over the CRL.
     *
     * Certificate revocation lists created by AWS Private CA are DER-encoded. You can use the following OpenSSL command to list a CRL.
     *
     * `openssl crl -inform DER -text -in *crl_path* -noout`
     *
     * For more information, see [Planning a certificate revocation list (CRL)](https://docs.aws.amazon.com/privateca/latest/userguide/crl-planning.html) in the *AWS Private Certificate Authority User Guide*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html
     */
    export interface CrlConfigurationProperty {
        /**
         * Name inserted into the certificate *CRL Distribution Points* extension that enables the use of an alias for the CRL distribution point. Use this value if you don't want the name of your S3 bucket to be public.
         *
         * > The content of a Canonical Name (CNAME) record must conform to [RFC2396](https://docs.aws.amazon.com/https://www.ietf.org/rfc/rfc2396.txt) restrictions on the use of special characters in URIs. Additionally, the value of the CNAME must not include a protocol prefix such as "http://" or "https://".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html#cfn-acmpca-certificateauthority-crlconfiguration-customcname
         */
        readonly customCname?: string;
        /**
         * Boolean value that specifies whether certificate revocation lists (CRLs) are enabled. You can use this value to enable certificate revocation for a new CA when you call the `CreateCertificateAuthority` operation or for an existing CA when you call the `UpdateCertificateAuthority` operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html#cfn-acmpca-certificateauthority-crlconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * Validity period of the CRL in days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html#cfn-acmpca-certificateauthority-crlconfiguration-expirationindays
         */
        readonly expirationInDays?: number;
        /**
         * Name of the S3 bucket that contains the CRL. If you do not provide a value for the *CustomCname* argument, the name of your S3 bucket is placed into the *CRL Distribution Points* extension of the issued certificate. You can change the name of your bucket by calling the [UpdateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_UpdateCertificateAuthority.html) operation. You must specify a [bucket policy](https://docs.aws.amazon.com/privateca/latest/userguide/PcaCreateCa.html#s3-policies) that allows AWS Private CA to write the CRL to your bucket.
         *
         * > The `S3BucketName` parameter must conform to the [S3 bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html#cfn-acmpca-certificateauthority-crlconfiguration-s3bucketname
         */
        readonly s3BucketName?: string;
        /**
         * Determines whether the CRL will be publicly readable or privately held in the CRL Amazon S3 bucket. If you choose PUBLIC_READ, the CRL will be accessible over the public internet. If you choose BUCKET_OWNER_FULL_CONTROL, only the owner of the CRL S3 bucket can access the CRL, and your PKI clients may need an alternative method of access.
         *
         * If no value is specified, the default is PUBLIC_READ.
         *
         * *Note:* This default can cause CA creation to fail in some circumstances. If you have have enabled the Block Public Access (BPA) feature in your S3 account, then you must specify the value of this parameter as `BUCKET_OWNER_FULL_CONTROL` , and not doing so results in an error. If you have disabled BPA in S3, then you can specify either `BUCKET_OWNER_FULL_CONTROL` or `PUBLIC_READ` as the value.
         *
         * For more information, see [Blocking public access to the S3 bucket](https://docs.aws.amazon.com/privateca/latest/userguide/PcaCreateCa.html#s3-bpa) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-crlconfiguration.html#cfn-acmpca-certificateauthority-crlconfiguration-s3objectacl
         */
        readonly s3ObjectAcl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CrlConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CrlConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_CrlConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customCname', cdk.validateString)(properties.customCname));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('expirationInDays', cdk.validateNumber)(properties.expirationInDays));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3ObjectAcl', cdk.validateString)(properties.s3ObjectAcl));
    return errors.wrap('supplied properties not correct for "CrlConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CrlConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CrlConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CrlConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityCrlConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_CrlConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CustomCname: cdk.stringToCloudFormation(properties.customCname),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        ExpirationInDays: cdk.numberToCloudFormation(properties.expirationInDays),
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        S3ObjectAcl: cdk.stringToCloudFormation(properties.s3ObjectAcl),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityCrlConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.CrlConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.CrlConfigurationProperty>();
    ret.addPropertyResult('customCname', 'CustomCname', properties.CustomCname != null ? cfn_parse.FromCloudFormation.getString(properties.CustomCname) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('expirationInDays', 'ExpirationInDays', properties.ExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationInDays) : undefined);
    ret.addPropertyResult('s3BucketName', 'S3BucketName', properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined);
    ret.addPropertyResult('s3ObjectAcl', 'S3ObjectAcl', properties.S3ObjectAcl != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectAcl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Describes the certificate extensions to be added to the certificate signing request (CSR).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-csrextensions.html
     */
    export interface CsrExtensionsProperty {
        /**
         * Indicates the purpose of the certificate and of the key contained in the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-csrextensions.html#cfn-acmpca-certificateauthority-csrextensions-keyusage
         */
        readonly keyUsage?: CfnCertificateAuthority.KeyUsageProperty | cdk.IResolvable;
        /**
         * For CA certificates, provides a path to additional information pertaining to the CA, such as revocation and policy. For more information, see [Subject Information Access](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.2.2) in RFC 5280.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-csrextensions.html#cfn-acmpca-certificateauthority-csrextensions-subjectinformationaccess
         */
        readonly subjectInformationAccess?: Array<CfnCertificateAuthority.AccessDescriptionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CsrExtensionsProperty`
 *
 * @param properties - the TypeScript properties of a `CsrExtensionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_CsrExtensionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyUsage', CfnCertificateAuthority_KeyUsagePropertyValidator)(properties.keyUsage));
    errors.collect(cdk.propertyValidator('subjectInformationAccess', cdk.listValidator(CfnCertificateAuthority_AccessDescriptionPropertyValidator))(properties.subjectInformationAccess));
    return errors.wrap('supplied properties not correct for "CsrExtensionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CsrExtensions` resource
 *
 * @param properties - the TypeScript properties of a `CsrExtensionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CsrExtensions` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityCsrExtensionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_CsrExtensionsPropertyValidator(properties).assertSuccess();
    return {
        KeyUsage: cfnCertificateAuthorityKeyUsagePropertyToCloudFormation(properties.keyUsage),
        SubjectInformationAccess: cdk.listMapper(cfnCertificateAuthorityAccessDescriptionPropertyToCloudFormation)(properties.subjectInformationAccess),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityCsrExtensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.CsrExtensionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.CsrExtensionsProperty>();
    ret.addPropertyResult('keyUsage', 'KeyUsage', properties.KeyUsage != null ? CfnCertificateAuthorityKeyUsagePropertyFromCloudFormation(properties.KeyUsage) : undefined);
    ret.addPropertyResult('subjectInformationAccess', 'SubjectInformationAccess', properties.SubjectInformationAccess != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateAuthorityAccessDescriptionPropertyFromCloudFormation)(properties.SubjectInformationAccess) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Defines the X.500 relative distinguished name (RDN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-customattribute.html
     */
    export interface CustomAttributeProperty {
        /**
         * Specifies the object identifier (OID) of the attribute type of the relative distinguished name (RDN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-customattribute.html#cfn-acmpca-certificateauthority-customattribute-objectidentifier
         */
        readonly objectIdentifier: string;
        /**
         * Specifies the attribute value of relative distinguished name (RDN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-customattribute.html#cfn-acmpca-certificateauthority-customattribute-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `CustomAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_CustomAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.requiredValidator)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('objectIdentifier', cdk.validateString)(properties.objectIdentifier));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CustomAttribute` resource
 *
 * @param properties - the TypeScript properties of a `CustomAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.CustomAttribute` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityCustomAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_CustomAttributePropertyValidator(properties).assertSuccess();
    return {
        ObjectIdentifier: cdk.stringToCloudFormation(properties.objectIdentifier),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityCustomAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.CustomAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.CustomAttributeProperty>();
    ret.addPropertyResult('objectIdentifier', 'ObjectIdentifier', cfn_parse.FromCloudFormation.getString(properties.ObjectIdentifier));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Describes an Electronic Data Interchange (EDI) entity as described in as defined in [Subject Alternative Name](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280) in RFC 5280.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-edipartyname.html
     */
    export interface EdiPartyNameProperty {
        /**
         * Specifies the name assigner.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-edipartyname.html#cfn-acmpca-certificateauthority-edipartyname-nameassigner
         */
        readonly nameAssigner: string;
        /**
         * Specifies the party name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-edipartyname.html#cfn-acmpca-certificateauthority-edipartyname-partyname
         */
        readonly partyName: string;
    }
}

/**
 * Determine whether the given properties match those of a `EdiPartyNameProperty`
 *
 * @param properties - the TypeScript properties of a `EdiPartyNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_EdiPartyNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nameAssigner', cdk.requiredValidator)(properties.nameAssigner));
    errors.collect(cdk.propertyValidator('nameAssigner', cdk.validateString)(properties.nameAssigner));
    errors.collect(cdk.propertyValidator('partyName', cdk.requiredValidator)(properties.partyName));
    errors.collect(cdk.propertyValidator('partyName', cdk.validateString)(properties.partyName));
    return errors.wrap('supplied properties not correct for "EdiPartyNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.EdiPartyName` resource
 *
 * @param properties - the TypeScript properties of a `EdiPartyNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.EdiPartyName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityEdiPartyNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_EdiPartyNamePropertyValidator(properties).assertSuccess();
    return {
        NameAssigner: cdk.stringToCloudFormation(properties.nameAssigner),
        PartyName: cdk.stringToCloudFormation(properties.partyName),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityEdiPartyNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.EdiPartyNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.EdiPartyNameProperty>();
    ret.addPropertyResult('nameAssigner', 'NameAssigner', cfn_parse.FromCloudFormation.getString(properties.NameAssigner));
    ret.addPropertyResult('partyName', 'PartyName', cfn_parse.FromCloudFormation.getString(properties.PartyName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Describes an ASN.1 X.400 `GeneralName` as defined in [RFC 5280](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc5280) . Only one of the following naming options should be provided. Providing more than one option results in an `InvalidArgsException` error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html
     */
    export interface GeneralNameProperty {
        /**
         * Contains information about the certificate subject. The certificate can be one issued by your private certificate authority (CA) or it can be your private CA certificate. The Subject field in the certificate identifies the entity that owns or controls the public key in the certificate. The entity can be a user, computer, device, or service. The Subject must contain an X.500 distinguished name (DN). A DN is a sequence of relative distinguished names (RDNs). The RDNs are separated by commas in the certificate. The DN must be unique for each entity, but your private CA can issue more than one certificate with the same DN to the same entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-directoryname
         */
        readonly directoryName?: CfnCertificateAuthority.SubjectProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as a DNS name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-dnsname
         */
        readonly dnsName?: string;
        /**
         * Represents `GeneralName` as an `EdiPartyName` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-edipartyname
         */
        readonly ediPartyName?: CfnCertificateAuthority.EdiPartyNameProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as an IPv4 or IPv6 address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-ipaddress
         */
        readonly ipAddress?: string;
        /**
         * Represents `GeneralName` using an `OtherName` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-othername
         */
        readonly otherName?: CfnCertificateAuthority.OtherNameProperty | cdk.IResolvable;
        /**
         * Represents `GeneralName` as an object identifier (OID).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-registeredid
         */
        readonly registeredId?: string;
        /**
         * Represents `GeneralName` as an [RFC 822](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc822) email address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-rfc822name
         */
        readonly rfc822Name?: string;
        /**
         * Represents `GeneralName` as a URI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-generalname.html#cfn-acmpca-certificateauthority-generalname-uniformresourceidentifier
         */
        readonly uniformResourceIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GeneralNameProperty`
 *
 * @param properties - the TypeScript properties of a `GeneralNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_GeneralNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('directoryName', CfnCertificateAuthority_SubjectPropertyValidator)(properties.directoryName));
    errors.collect(cdk.propertyValidator('dnsName', cdk.validateString)(properties.dnsName));
    errors.collect(cdk.propertyValidator('ediPartyName', CfnCertificateAuthority_EdiPartyNamePropertyValidator)(properties.ediPartyName));
    errors.collect(cdk.propertyValidator('ipAddress', cdk.validateString)(properties.ipAddress));
    errors.collect(cdk.propertyValidator('otherName', CfnCertificateAuthority_OtherNamePropertyValidator)(properties.otherName));
    errors.collect(cdk.propertyValidator('registeredId', cdk.validateString)(properties.registeredId));
    errors.collect(cdk.propertyValidator('rfc822Name', cdk.validateString)(properties.rfc822Name));
    errors.collect(cdk.propertyValidator('uniformResourceIdentifier', cdk.validateString)(properties.uniformResourceIdentifier));
    return errors.wrap('supplied properties not correct for "GeneralNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.GeneralName` resource
 *
 * @param properties - the TypeScript properties of a `GeneralNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.GeneralName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityGeneralNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_GeneralNamePropertyValidator(properties).assertSuccess();
    return {
        DirectoryName: cfnCertificateAuthoritySubjectPropertyToCloudFormation(properties.directoryName),
        DnsName: cdk.stringToCloudFormation(properties.dnsName),
        EdiPartyName: cfnCertificateAuthorityEdiPartyNamePropertyToCloudFormation(properties.ediPartyName),
        IpAddress: cdk.stringToCloudFormation(properties.ipAddress),
        OtherName: cfnCertificateAuthorityOtherNamePropertyToCloudFormation(properties.otherName),
        RegisteredId: cdk.stringToCloudFormation(properties.registeredId),
        Rfc822Name: cdk.stringToCloudFormation(properties.rfc822Name),
        UniformResourceIdentifier: cdk.stringToCloudFormation(properties.uniformResourceIdentifier),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityGeneralNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.GeneralNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.GeneralNameProperty>();
    ret.addPropertyResult('directoryName', 'DirectoryName', properties.DirectoryName != null ? CfnCertificateAuthoritySubjectPropertyFromCloudFormation(properties.DirectoryName) : undefined);
    ret.addPropertyResult('dnsName', 'DnsName', properties.DnsName != null ? cfn_parse.FromCloudFormation.getString(properties.DnsName) : undefined);
    ret.addPropertyResult('ediPartyName', 'EdiPartyName', properties.EdiPartyName != null ? CfnCertificateAuthorityEdiPartyNamePropertyFromCloudFormation(properties.EdiPartyName) : undefined);
    ret.addPropertyResult('ipAddress', 'IpAddress', properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined);
    ret.addPropertyResult('otherName', 'OtherName', properties.OtherName != null ? CfnCertificateAuthorityOtherNamePropertyFromCloudFormation(properties.OtherName) : undefined);
    ret.addPropertyResult('registeredId', 'RegisteredId', properties.RegisteredId != null ? cfn_parse.FromCloudFormation.getString(properties.RegisteredId) : undefined);
    ret.addPropertyResult('rfc822Name', 'Rfc822Name', properties.Rfc822Name != null ? cfn_parse.FromCloudFormation.getString(properties.Rfc822Name) : undefined);
    ret.addPropertyResult('uniformResourceIdentifier', 'UniformResourceIdentifier', properties.UniformResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.UniformResourceIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Defines one or more purposes for which the key contained in the certificate can be used. Default value for each option is false.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html
     */
    export interface KeyUsageProperty {
        /**
         * Key can be used to sign CRLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-crlsign
         */
        readonly crlSign?: boolean | cdk.IResolvable;
        /**
         * Key can be used to decipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-dataencipherment
         */
        readonly dataEncipherment?: boolean | cdk.IResolvable;
        /**
         * Key can be used only to decipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-decipheronly
         */
        readonly decipherOnly?: boolean | cdk.IResolvable;
        /**
         * Key can be used for digital signing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-digitalsignature
         */
        readonly digitalSignature?: boolean | cdk.IResolvable;
        /**
         * Key can be used only to encipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-encipheronly
         */
        readonly encipherOnly?: boolean | cdk.IResolvable;
        /**
         * Key can be used in a key-agreement protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-keyagreement
         */
        readonly keyAgreement?: boolean | cdk.IResolvable;
        /**
         * Key can be used to sign certificates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-keycertsign
         */
        readonly keyCertSign?: boolean | cdk.IResolvable;
        /**
         * Key can be used to encipher data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-keyencipherment
         */
        readonly keyEncipherment?: boolean | cdk.IResolvable;
        /**
         * Key can be used for non-repudiation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-keyusage.html#cfn-acmpca-certificateauthority-keyusage-nonrepudiation
         */
        readonly nonRepudiation?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KeyUsageProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_KeyUsagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crlSign', cdk.validateBoolean)(properties.crlSign));
    errors.collect(cdk.propertyValidator('dataEncipherment', cdk.validateBoolean)(properties.dataEncipherment));
    errors.collect(cdk.propertyValidator('decipherOnly', cdk.validateBoolean)(properties.decipherOnly));
    errors.collect(cdk.propertyValidator('digitalSignature', cdk.validateBoolean)(properties.digitalSignature));
    errors.collect(cdk.propertyValidator('encipherOnly', cdk.validateBoolean)(properties.encipherOnly));
    errors.collect(cdk.propertyValidator('keyAgreement', cdk.validateBoolean)(properties.keyAgreement));
    errors.collect(cdk.propertyValidator('keyCertSign', cdk.validateBoolean)(properties.keyCertSign));
    errors.collect(cdk.propertyValidator('keyEncipherment', cdk.validateBoolean)(properties.keyEncipherment));
    errors.collect(cdk.propertyValidator('nonRepudiation', cdk.validateBoolean)(properties.nonRepudiation));
    return errors.wrap('supplied properties not correct for "KeyUsageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.KeyUsage` resource
 *
 * @param properties - the TypeScript properties of a `KeyUsageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.KeyUsage` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityKeyUsagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_KeyUsagePropertyValidator(properties).assertSuccess();
    return {
        CRLSign: cdk.booleanToCloudFormation(properties.crlSign),
        DataEncipherment: cdk.booleanToCloudFormation(properties.dataEncipherment),
        DecipherOnly: cdk.booleanToCloudFormation(properties.decipherOnly),
        DigitalSignature: cdk.booleanToCloudFormation(properties.digitalSignature),
        EncipherOnly: cdk.booleanToCloudFormation(properties.encipherOnly),
        KeyAgreement: cdk.booleanToCloudFormation(properties.keyAgreement),
        KeyCertSign: cdk.booleanToCloudFormation(properties.keyCertSign),
        KeyEncipherment: cdk.booleanToCloudFormation(properties.keyEncipherment),
        NonRepudiation: cdk.booleanToCloudFormation(properties.nonRepudiation),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityKeyUsagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.KeyUsageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.KeyUsageProperty>();
    ret.addPropertyResult('crlSign', 'CRLSign', properties.CRLSign != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CRLSign) : undefined);
    ret.addPropertyResult('dataEncipherment', 'DataEncipherment', properties.DataEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataEncipherment) : undefined);
    ret.addPropertyResult('decipherOnly', 'DecipherOnly', properties.DecipherOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DecipherOnly) : undefined);
    ret.addPropertyResult('digitalSignature', 'DigitalSignature', properties.DigitalSignature != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DigitalSignature) : undefined);
    ret.addPropertyResult('encipherOnly', 'EncipherOnly', properties.EncipherOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EncipherOnly) : undefined);
    ret.addPropertyResult('keyAgreement', 'KeyAgreement', properties.KeyAgreement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyAgreement) : undefined);
    ret.addPropertyResult('keyCertSign', 'KeyCertSign', properties.KeyCertSign != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyCertSign) : undefined);
    ret.addPropertyResult('keyEncipherment', 'KeyEncipherment', properties.KeyEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyEncipherment) : undefined);
    ret.addPropertyResult('nonRepudiation', 'NonRepudiation', properties.NonRepudiation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NonRepudiation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Contains information to enable and configure Online Certificate Status Protocol (OCSP) for validating certificate revocation status.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-ocspconfiguration.html
     */
    export interface OcspConfigurationProperty {
        /**
         * Flag enabling use of the Online Certificate Status Protocol (OCSP) for validating certificate revocation status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-ocspconfiguration.html#cfn-acmpca-certificateauthority-ocspconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * By default, AWS Private CA injects an Amazon domain into certificates being validated by the Online Certificate Status Protocol (OCSP). A customer can alternatively use this object to define a CNAME specifying a customized OCSP domain.
         *
         * > The content of a Canonical Name (CNAME) record must conform to [RFC2396](https://docs.aws.amazon.com/https://www.ietf.org/rfc/rfc2396.txt) restrictions on the use of special characters in URIs. Additionally, the value of the CNAME must not include a protocol prefix such as "http://" or "https://".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-ocspconfiguration.html#cfn-acmpca-certificateauthority-ocspconfiguration-ocspcustomcname
         */
        readonly ocspCustomCname?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OcspConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OcspConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_OcspConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('ocspCustomCname', cdk.validateString)(properties.ocspCustomCname));
    return errors.wrap('supplied properties not correct for "OcspConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.OcspConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OcspConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.OcspConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityOcspConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_OcspConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        OcspCustomCname: cdk.stringToCloudFormation(properties.ocspCustomCname),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityOcspConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.OcspConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.OcspConfigurationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('ocspCustomCname', 'OcspCustomCname', properties.OcspCustomCname != null ? cfn_parse.FromCloudFormation.getString(properties.OcspCustomCname) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Defines a custom ASN.1 X.400 `GeneralName` using an object identifier (OID) and value. The OID must satisfy the regular expression shown below. For more information, see NIST's definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-othername.html
     */
    export interface OtherNameProperty {
        /**
         * Specifies an OID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-othername.html#cfn-acmpca-certificateauthority-othername-typeid
         */
        readonly typeId: string;
        /**
         * Specifies an OID value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-othername.html#cfn-acmpca-certificateauthority-othername-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `OtherNameProperty`
 *
 * @param properties - the TypeScript properties of a `OtherNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_OtherNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('typeId', cdk.requiredValidator)(properties.typeId));
    errors.collect(cdk.propertyValidator('typeId', cdk.validateString)(properties.typeId));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "OtherNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.OtherName` resource
 *
 * @param properties - the TypeScript properties of a `OtherNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.OtherName` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityOtherNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_OtherNamePropertyValidator(properties).assertSuccess();
    return {
        TypeId: cdk.stringToCloudFormation(properties.typeId),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityOtherNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.OtherNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.OtherNameProperty>();
    ret.addPropertyResult('typeId', 'TypeId', cfn_parse.FromCloudFormation.getString(properties.TypeId));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * Certificate revocation information used by the [CreateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_CreateCertificateAuthority.html) and [UpdateCertificateAuthority](https://docs.aws.amazon.com/privateca/latest/APIReference/API_UpdateCertificateAuthority.html) actions. Your private certificate authority (CA) can configure Online Certificate Status Protocol (OCSP) support and/or maintain a certificate revocation list (CRL). OCSP returns validation information about certificates as requested by clients, and a CRL contains an updated list of certificates revoked by your CA. For more information, see [RevokeCertificate](https://docs.aws.amazon.com/privateca/latest/APIReference/API_RevokeCertificate.html) in the *AWS Private CA API Reference* and [Setting up a certificate revocation method](https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html) in the *AWS Private CA User Guide* .
     *
     * > The following requirements apply to revocation configurations.
     * >
     * > - A configuration disabling CRLs or OCSP must contain only the `Enabled=False` parameter, and will fail if other parameters such as `CustomCname` or `ExpirationInDays` are included.
     * > - In a CRL configuration, the `S3BucketName` parameter must conform to the [Amazon S3 bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) .
     * > - A configuration containing a custom Canonical Name (CNAME) parameter for CRLs or OCSP must conform to [RFC2396](https://docs.aws.amazon.com/https://www.ietf.org/rfc/rfc2396.txt) restrictions on the use of special characters in a CNAME.
     * > - In a CRL or OCSP configuration, the value of a CNAME parameter must not include a protocol prefix such as "http://" or "https://".
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-revocationconfiguration.html
     */
    export interface RevocationConfigurationProperty {
        /**
         * Configuration of the certificate revocation list (CRL), if any, maintained by your private CA.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-revocationconfiguration.html#cfn-acmpca-certificateauthority-revocationconfiguration-crlconfiguration
         */
        readonly crlConfiguration?: CfnCertificateAuthority.CrlConfigurationProperty | cdk.IResolvable;
        /**
         * Configuration of Online Certificate Status Protocol (OCSP) support, if any, maintained by your private CA.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-revocationconfiguration.html#cfn-acmpca-certificateauthority-revocationconfiguration-ocspconfiguration
         */
        readonly ocspConfiguration?: CfnCertificateAuthority.OcspConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RevocationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RevocationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_RevocationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crlConfiguration', CfnCertificateAuthority_CrlConfigurationPropertyValidator)(properties.crlConfiguration));
    errors.collect(cdk.propertyValidator('ocspConfiguration', CfnCertificateAuthority_OcspConfigurationPropertyValidator)(properties.ocspConfiguration));
    return errors.wrap('supplied properties not correct for "RevocationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.RevocationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RevocationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.RevocationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityRevocationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_RevocationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CrlConfiguration: cfnCertificateAuthorityCrlConfigurationPropertyToCloudFormation(properties.crlConfiguration),
        OcspConfiguration: cfnCertificateAuthorityOcspConfigurationPropertyToCloudFormation(properties.ocspConfiguration),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityRevocationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.RevocationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.RevocationConfigurationProperty>();
    ret.addPropertyResult('crlConfiguration', 'CrlConfiguration', properties.CrlConfiguration != null ? CfnCertificateAuthorityCrlConfigurationPropertyFromCloudFormation(properties.CrlConfiguration) : undefined);
    ret.addPropertyResult('ocspConfiguration', 'OcspConfiguration', properties.OcspConfiguration != null ? CfnCertificateAuthorityOcspConfigurationPropertyFromCloudFormation(properties.OcspConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCertificateAuthority {
    /**
     * ASN1 subject for the certificate authority.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html
     */
    export interface SubjectProperty {
        /**
         * Fully qualified domain name (FQDN) associated with the certificate subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-commonname
         */
        readonly commonName?: string;
        /**
         * Two-digit code that specifies the country in which the certificate subject located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-country
         */
        readonly country?: string;
        /**
         * Contains a sequence of one or more X.500 relative distinguished names (RDNs), each of which consists of an object identifier (OID) and a value. For more information, see NIST’s definition of [Object Identifier (OID)](https://docs.aws.amazon.com/https://csrc.nist.gov/glossary/term/Object_Identifier) .
         *
         * > Custom attributes cannot be used in combination with standard attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-customattributes
         */
        readonly customAttributes?: Array<CfnCertificateAuthority.CustomAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Disambiguating information for the certificate subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-distinguishednamequalifier
         */
        readonly distinguishedNameQualifier?: string;
        /**
         * Typically a qualifier appended to the name of an individual. Examples include Jr. for junior, Sr. for senior, and III for third.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-generationqualifier
         */
        readonly generationQualifier?: string;
        /**
         * First name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-givenname
         */
        readonly givenName?: string;
        /**
         * Concatenation that typically contains the first letter of the GivenName, the first letter of the middle name if one exists, and the first letter of the SurName.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-initials
         */
        readonly initials?: string;
        /**
         * The locality (such as a city or town) in which the certificate subject is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-locality
         */
        readonly locality?: string;
        /**
         * Legal name of the organization with which the certificate subject is affiliated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-organization
         */
        readonly organization?: string;
        /**
         * A subdivision or unit of the organization (such as sales or finance) with which the certificate subject is affiliated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-organizationalunit
         */
        readonly organizationalUnit?: string;
        /**
         * Typically a shortened version of a longer GivenName. For example, Jonathan is often shortened to John. Elizabeth is often shortened to Beth, Liz, or Eliza.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-pseudonym
         */
        readonly pseudonym?: string;
        /**
         * The certificate serial number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-serialnumber
         */
        readonly serialNumber?: string;
        /**
         * State in which the subject of the certificate is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-state
         */
        readonly state?: string;
        /**
         * Family name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-surname
         */
        readonly surname?: string;
        /**
         * A personal title such as Mr.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-acmpca-certificateauthority-subject.html#cfn-acmpca-certificateauthority-subject-title
         */
        readonly title?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubjectProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthority_SubjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('commonName', cdk.validateString)(properties.commonName));
    errors.collect(cdk.propertyValidator('country', cdk.validateString)(properties.country));
    errors.collect(cdk.propertyValidator('customAttributes', cdk.listValidator(CfnCertificateAuthority_CustomAttributePropertyValidator))(properties.customAttributes));
    errors.collect(cdk.propertyValidator('distinguishedNameQualifier', cdk.validateString)(properties.distinguishedNameQualifier));
    errors.collect(cdk.propertyValidator('generationQualifier', cdk.validateString)(properties.generationQualifier));
    errors.collect(cdk.propertyValidator('givenName', cdk.validateString)(properties.givenName));
    errors.collect(cdk.propertyValidator('initials', cdk.validateString)(properties.initials));
    errors.collect(cdk.propertyValidator('locality', cdk.validateString)(properties.locality));
    errors.collect(cdk.propertyValidator('organization', cdk.validateString)(properties.organization));
    errors.collect(cdk.propertyValidator('organizationalUnit', cdk.validateString)(properties.organizationalUnit));
    errors.collect(cdk.propertyValidator('pseudonym', cdk.validateString)(properties.pseudonym));
    errors.collect(cdk.propertyValidator('serialNumber', cdk.validateString)(properties.serialNumber));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('surname', cdk.validateString)(properties.surname));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    return errors.wrap('supplied properties not correct for "SubjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.Subject` resource
 *
 * @param properties - the TypeScript properties of a `SubjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthority.Subject` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthoritySubjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthority_SubjectPropertyValidator(properties).assertSuccess();
    return {
        CommonName: cdk.stringToCloudFormation(properties.commonName),
        Country: cdk.stringToCloudFormation(properties.country),
        CustomAttributes: cdk.listMapper(cfnCertificateAuthorityCustomAttributePropertyToCloudFormation)(properties.customAttributes),
        DistinguishedNameQualifier: cdk.stringToCloudFormation(properties.distinguishedNameQualifier),
        GenerationQualifier: cdk.stringToCloudFormation(properties.generationQualifier),
        GivenName: cdk.stringToCloudFormation(properties.givenName),
        Initials: cdk.stringToCloudFormation(properties.initials),
        Locality: cdk.stringToCloudFormation(properties.locality),
        Organization: cdk.stringToCloudFormation(properties.organization),
        OrganizationalUnit: cdk.stringToCloudFormation(properties.organizationalUnit),
        Pseudonym: cdk.stringToCloudFormation(properties.pseudonym),
        SerialNumber: cdk.stringToCloudFormation(properties.serialNumber),
        State: cdk.stringToCloudFormation(properties.state),
        Surname: cdk.stringToCloudFormation(properties.surname),
        Title: cdk.stringToCloudFormation(properties.title),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthoritySubjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthority.SubjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthority.SubjectProperty>();
    ret.addPropertyResult('commonName', 'CommonName', properties.CommonName != null ? cfn_parse.FromCloudFormation.getString(properties.CommonName) : undefined);
    ret.addPropertyResult('country', 'Country', properties.Country != null ? cfn_parse.FromCloudFormation.getString(properties.Country) : undefined);
    ret.addPropertyResult('customAttributes', 'CustomAttributes', properties.CustomAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnCertificateAuthorityCustomAttributePropertyFromCloudFormation)(properties.CustomAttributes) : undefined);
    ret.addPropertyResult('distinguishedNameQualifier', 'DistinguishedNameQualifier', properties.DistinguishedNameQualifier != null ? cfn_parse.FromCloudFormation.getString(properties.DistinguishedNameQualifier) : undefined);
    ret.addPropertyResult('generationQualifier', 'GenerationQualifier', properties.GenerationQualifier != null ? cfn_parse.FromCloudFormation.getString(properties.GenerationQualifier) : undefined);
    ret.addPropertyResult('givenName', 'GivenName', properties.GivenName != null ? cfn_parse.FromCloudFormation.getString(properties.GivenName) : undefined);
    ret.addPropertyResult('initials', 'Initials', properties.Initials != null ? cfn_parse.FromCloudFormation.getString(properties.Initials) : undefined);
    ret.addPropertyResult('locality', 'Locality', properties.Locality != null ? cfn_parse.FromCloudFormation.getString(properties.Locality) : undefined);
    ret.addPropertyResult('organization', 'Organization', properties.Organization != null ? cfn_parse.FromCloudFormation.getString(properties.Organization) : undefined);
    ret.addPropertyResult('organizationalUnit', 'OrganizationalUnit', properties.OrganizationalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnit) : undefined);
    ret.addPropertyResult('pseudonym', 'Pseudonym', properties.Pseudonym != null ? cfn_parse.FromCloudFormation.getString(properties.Pseudonym) : undefined);
    ret.addPropertyResult('serialNumber', 'SerialNumber', properties.SerialNumber != null ? cfn_parse.FromCloudFormation.getString(properties.SerialNumber) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('surname', 'Surname', properties.Surname != null ? cfn_parse.FromCloudFormation.getString(properties.Surname) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCertificateAuthorityActivation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html
 */
export interface CfnCertificateAuthorityActivationProps {

    /**
     * The Base64 PEM-encoded certificate authority certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificate
     */
    readonly certificate: string;

    /**
     * The Amazon Resource Name (ARN) of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificateauthorityarn
     */
    readonly certificateAuthorityArn: string;

    /**
     * The Base64 PEM-encoded certificate chain that chains up to the root CA certificate that you used to sign your private CA certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificatechain
     */
    readonly certificateChain?: string;

    /**
     * Status of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-status
     */
    readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateAuthorityActivationProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateAuthorityActivationProps`
 *
 * @returns the result of the validation.
 */
function CfnCertificateAuthorityActivationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', cdk.requiredValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.requiredValidator)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.validateString)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "CfnCertificateAuthorityActivationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthorityActivation` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateAuthorityActivationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::CertificateAuthorityActivation` resource.
 */
// @ts-ignore TS6133
function cfnCertificateAuthorityActivationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificateAuthorityActivationPropsValidator(properties).assertSuccess();
    return {
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        CertificateAuthorityArn: cdk.stringToCloudFormation(properties.certificateAuthorityArn),
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnCertificateAuthorityActivationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateAuthorityActivationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateAuthorityActivationProps>();
    ret.addPropertyResult('certificate', 'Certificate', cfn_parse.FromCloudFormation.getString(properties.Certificate));
    ret.addPropertyResult('certificateAuthorityArn', 'CertificateAuthorityArn', cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn));
    ret.addPropertyResult('certificateChain', 'CertificateChain', properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ACMPCA::CertificateAuthorityActivation`
 *
 * The `AWS::ACMPCA::CertificateAuthorityActivation` resource creates and installs a CA certificate on a CA. If no status is specified, the `AWS::ACMPCA::CertificateAuthorityActivation` resource status defaults to ACTIVE. Once the CA has a CA certificate installed, you can use the resource to toggle the CA status field between `ACTIVE` and `DISABLED` .
 *
 * @cloudformationResource AWS::ACMPCA::CertificateAuthorityActivation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html
 */
export class CfnCertificateAuthorityActivation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ACMPCA::CertificateAuthorityActivation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificateAuthorityActivation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCertificateAuthorityActivationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCertificateAuthorityActivation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The complete Base64 PEM-encoded certificate chain, including the certificate authority certificate.
     * @cloudformationAttribute CompleteCertificateChain
     */
    public readonly attrCompleteCertificateChain: string;

    /**
     * The Base64 PEM-encoded certificate authority certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificate
     */
    public certificate: string;

    /**
     * The Amazon Resource Name (ARN) of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificateauthorityarn
     */
    public certificateAuthorityArn: string;

    /**
     * The Base64 PEM-encoded certificate chain that chains up to the root CA certificate that you used to sign your private CA certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-certificatechain
     */
    public certificateChain: string | undefined;

    /**
     * Status of your private CA.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-certificateauthorityactivation.html#cfn-acmpca-certificateauthorityactivation-status
     */
    public status: string | undefined;

    /**
     * Create a new `AWS::ACMPCA::CertificateAuthorityActivation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateAuthorityActivationProps) {
        super(scope, id, { type: CfnCertificateAuthorityActivation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificate', this);
        cdk.requireProperty(props, 'certificateAuthorityArn', this);
        this.attrCompleteCertificateChain = cdk.Token.asString(this.getAtt('CompleteCertificateChain', cdk.ResolutionTypeHint.STRING));

        this.certificate = props.certificate;
        this.certificateAuthorityArn = props.certificateAuthorityArn;
        this.certificateChain = props.certificateChain;
        this.status = props.status;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificateAuthorityActivation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificate: this.certificate,
            certificateAuthorityArn: this.certificateAuthorityArn,
            certificateChain: this.certificateChain,
            status: this.status,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificateAuthorityActivationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPermission`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html
 */
export interface CfnPermissionProps {

    /**
     * The private CA actions that can be performed by the designated AWS service. Supported actions are `IssueCertificate` , `GetCertificate` , and `ListPermissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-actions
     */
    readonly actions: string[];

    /**
     * The Amazon Resource Number (ARN) of the private CA from which the permission was issued.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-certificateauthorityarn
     */
    readonly certificateAuthorityArn: string;

    /**
     * The AWS service or entity that holds the permission. At this time, the only valid principal is `acm.amazonaws.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-principal
     */
    readonly principal: string;

    /**
     * The ID of the account that assigned the permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-sourceaccount
     */
    readonly sourceAccount?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the result of the validation.
 */
function CfnPermissionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.requiredValidator)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('certificateAuthorityArn', cdk.validateString)(properties.certificateAuthorityArn));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    errors.collect(cdk.propertyValidator('sourceAccount', cdk.validateString)(properties.sourceAccount));
    return errors.wrap('supplied properties not correct for "CfnPermissionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ACMPCA::Permission` resource
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ACMPCA::Permission` resource.
 */
// @ts-ignore TS6133
function cfnPermissionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissionPropsValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        CertificateAuthorityArn: cdk.stringToCloudFormation(properties.certificateAuthorityArn),
        Principal: cdk.stringToCloudFormation(properties.principal),
        SourceAccount: cdk.stringToCloudFormation(properties.sourceAccount),
    };
}

// @ts-ignore TS6133
function CfnPermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionProps>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('certificateAuthorityArn', 'CertificateAuthorityArn', cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addPropertyResult('sourceAccount', 'SourceAccount', properties.SourceAccount != null ? cfn_parse.FromCloudFormation.getString(properties.SourceAccount) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ACMPCA::Permission`
 *
 * Grants permissions to the AWS Certificate Manager ( ACM ) service principal ( `acm.amazonaws.com` ) to perform [IssueCertificate](https://docs.aws.amazon.com/latest/APIReference/API_IssueCertificate.html) , [GetCertificate](https://docs.aws.amazon.com/privateca/latest/APIReference/API_GetCertificate.html) , and [ListPermissions](https://docs.aws.amazon.com/privateca/latest/APIReference/API_ListPermissions.html) actions on a CA. These actions are needed for the ACM principal to renew private PKI certificates requested through ACM and residing in the same AWS account as the CA.
 *
 * **About permissions** - If the private CA and the certificates it issues reside in the same account, you can use `AWS::ACMPCA::Permission` to grant permissions for ACM to carry out automatic certificate renewals.
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list permissions.
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see [Using a Resource Based Policy with AWS Private CA](https://docs.aws.amazon.com/privateca/latest/userguide/pca-rbp.html) .
 *
 * > To update an `AWS::ACMPCA::Permission` resource, you must first delete the existing permission resource from the CloudFormation stack and then create a new permission resource with updated properties.
 *
 * @cloudformationResource AWS::ACMPCA::Permission
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html
 */
export class CfnPermission extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ACMPCA::Permission";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPermission {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPermissionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPermission(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The private CA actions that can be performed by the designated AWS service. Supported actions are `IssueCertificate` , `GetCertificate` , and `ListPermissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-actions
     */
    public actions: string[];

    /**
     * The Amazon Resource Number (ARN) of the private CA from which the permission was issued.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-certificateauthorityarn
     */
    public certificateAuthorityArn: string;

    /**
     * The AWS service or entity that holds the permission. At this time, the only valid principal is `acm.amazonaws.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-principal
     */
    public principal: string;

    /**
     * The ID of the account that assigned the permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-acmpca-permission.html#cfn-acmpca-permission-sourceaccount
     */
    public sourceAccount: string | undefined;

    /**
     * Create a new `AWS::ACMPCA::Permission`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPermissionProps) {
        super(scope, id, { type: CfnPermission.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actions', this);
        cdk.requireProperty(props, 'certificateAuthorityArn', this);
        cdk.requireProperty(props, 'principal', this);

        this.actions = props.actions;
        this.certificateAuthorityArn = props.certificateAuthorityArn;
        this.principal = props.principal;
        this.sourceAccount = props.sourceAccount;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermission.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actions: this.actions,
            certificateAuthorityArn: this.certificateAuthorityArn,
            principal: this.principal,
            sourceAccount: this.sourceAccount,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPermissionPropsToCloudFormation(props);
    }
}
