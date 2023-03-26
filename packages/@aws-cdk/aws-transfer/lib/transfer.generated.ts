// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:24.979Z","fingerprint":"D677bX5pvzVMWH9vmaxqj03dCmn5mOZ/5CuHC1PfV24="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAgreement`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html
 */
export interface CfnAgreementProps {

    /**
     * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-accessrole
     */
    readonly accessRole: string;

    /**
     * The landing directory (folder) for files that are transferred by using the AS2 protocol.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-basedirectory
     */
    readonly baseDirectory: string;

    /**
     * A unique identifier for the AS2 local profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-localprofileid
     */
    readonly localProfileId: string;

    /**
     * A unique identifier for the partner profile used in the agreement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-partnerprofileid
     */
    readonly partnerProfileId: string;

    /**
     * A system-assigned unique identifier for a server instance. This identifier indicates the specific server that the agreement uses.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-serverid
     */
    readonly serverId: string;

    /**
     * The name or short description that's used to identify the agreement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-description
     */
    readonly description?: string;

    /**
     * The current status of the agreement, either `ACTIVE` or `INACTIVE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-status
     */
    readonly status?: string;

    /**
     * Key-value pairs that can be used to group and search for agreements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAgreementProps`
 *
 * @param properties - the TypeScript properties of a `CfnAgreementProps`
 *
 * @returns the result of the validation.
 */
function CfnAgreementPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessRole', cdk.requiredValidator)(properties.accessRole));
    errors.collect(cdk.propertyValidator('accessRole', cdk.validateString)(properties.accessRole));
    errors.collect(cdk.propertyValidator('baseDirectory', cdk.requiredValidator)(properties.baseDirectory));
    errors.collect(cdk.propertyValidator('baseDirectory', cdk.validateString)(properties.baseDirectory));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('localProfileId', cdk.requiredValidator)(properties.localProfileId));
    errors.collect(cdk.propertyValidator('localProfileId', cdk.validateString)(properties.localProfileId));
    errors.collect(cdk.propertyValidator('partnerProfileId', cdk.requiredValidator)(properties.partnerProfileId));
    errors.collect(cdk.propertyValidator('partnerProfileId', cdk.validateString)(properties.partnerProfileId));
    errors.collect(cdk.propertyValidator('serverId', cdk.requiredValidator)(properties.serverId));
    errors.collect(cdk.propertyValidator('serverId', cdk.validateString)(properties.serverId));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAgreementProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Agreement` resource
 *
 * @param properties - the TypeScript properties of a `CfnAgreementProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Agreement` resource.
 */
// @ts-ignore TS6133
function cfnAgreementPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAgreementPropsValidator(properties).assertSuccess();
    return {
        AccessRole: cdk.stringToCloudFormation(properties.accessRole),
        BaseDirectory: cdk.stringToCloudFormation(properties.baseDirectory),
        LocalProfileId: cdk.stringToCloudFormation(properties.localProfileId),
        PartnerProfileId: cdk.stringToCloudFormation(properties.partnerProfileId),
        ServerId: cdk.stringToCloudFormation(properties.serverId),
        Description: cdk.stringToCloudFormation(properties.description),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAgreementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAgreementProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAgreementProps>();
    ret.addPropertyResult('accessRole', 'AccessRole', cfn_parse.FromCloudFormation.getString(properties.AccessRole));
    ret.addPropertyResult('baseDirectory', 'BaseDirectory', cfn_parse.FromCloudFormation.getString(properties.BaseDirectory));
    ret.addPropertyResult('localProfileId', 'LocalProfileId', cfn_parse.FromCloudFormation.getString(properties.LocalProfileId));
    ret.addPropertyResult('partnerProfileId', 'PartnerProfileId', cfn_parse.FromCloudFormation.getString(properties.PartnerProfileId));
    ret.addPropertyResult('serverId', 'ServerId', cfn_parse.FromCloudFormation.getString(properties.ServerId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Agreement`
 *
 * Creates an agreement. An agreement is a bilateral trading partner agreement, or partnership, between an AWS Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes.
 *
 * The partner is identified with the `PartnerProfileId` , and the AS2 process is identified with the `LocalProfileId` .
 *
 * @cloudformationResource AWS::Transfer::Agreement
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html
 */
export class CfnAgreement extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Agreement";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAgreement {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAgreementPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAgreement(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute AgreementId
     */
    public readonly attrAgreementId: string;

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-accessrole
     */
    public accessRole: string;

    /**
     * The landing directory (folder) for files that are transferred by using the AS2 protocol.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-basedirectory
     */
    public baseDirectory: string;

    /**
     * A unique identifier for the AS2 local profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-localprofileid
     */
    public localProfileId: string;

    /**
     * A unique identifier for the partner profile used in the agreement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-partnerprofileid
     */
    public partnerProfileId: string;

    /**
     * A system-assigned unique identifier for a server instance. This identifier indicates the specific server that the agreement uses.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-serverid
     */
    public serverId: string;

    /**
     * The name or short description that's used to identify the agreement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-description
     */
    public description: string | undefined;

    /**
     * The current status of the agreement, either `ACTIVE` or `INACTIVE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-status
     */
    public status: string | undefined;

    /**
     * Key-value pairs that can be used to group and search for agreements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::Agreement`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAgreementProps) {
        super(scope, id, { type: CfnAgreement.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accessRole', this);
        cdk.requireProperty(props, 'baseDirectory', this);
        cdk.requireProperty(props, 'localProfileId', this);
        cdk.requireProperty(props, 'partnerProfileId', this);
        cdk.requireProperty(props, 'serverId', this);
        this.attrAgreementId = cdk.Token.asString(this.getAtt('AgreementId', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.accessRole = props.accessRole;
        this.baseDirectory = props.baseDirectory;
        this.localProfileId = props.localProfileId;
        this.partnerProfileId = props.partnerProfileId;
        this.serverId = props.serverId;
        this.description = props.description;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Agreement", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAgreement.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accessRole: this.accessRole,
            baseDirectory: this.baseDirectory,
            localProfileId: this.localProfileId,
            partnerProfileId: this.partnerProfileId,
            serverId: this.serverId,
            description: this.description,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAgreementPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html
 */
export interface CfnCertificateProps {

    /**
     * The file name for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificate
     */
    readonly certificate: string;

    /**
     * Specifies whether this certificate is used for signing or encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-usage
     */
    readonly usage: string;

    /**
     * An optional date that specifies when the certificate becomes active.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-activedate
     */
    readonly activeDate?: string;

    /**
     * The list of certificates that make up the chain for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificatechain
     */
    readonly certificateChain?: string;

    /**
     * The name or description that's used to identity the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-description
     */
    readonly description?: string;

    /**
     * An optional date that specifies when the certificate becomes inactive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-inactivedate
     */
    readonly inactiveDate?: string;

    /**
     * The file that contains the private key for the certificate that's being imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-privatekey
     */
    readonly privateKey?: string;

    /**
     * Key-value pairs that can be used to group and search for certificates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    errors.collect(cdk.propertyValidator('activeDate', cdk.validateString)(properties.activeDate));
    errors.collect(cdk.propertyValidator('certificate', cdk.requiredValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inactiveDate', cdk.validateString)(properties.inactiveDate));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('usage', cdk.requiredValidator)(properties.usage));
    errors.collect(cdk.propertyValidator('usage', cdk.validateString)(properties.usage));
    return errors.wrap('supplied properties not correct for "CfnCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Certificate` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificatePropsValidator(properties).assertSuccess();
    return {
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        Usage: cdk.stringToCloudFormation(properties.usage),
        ActiveDate: cdk.stringToCloudFormation(properties.activeDate),
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
        Description: cdk.stringToCloudFormation(properties.description),
        InactiveDate: cdk.stringToCloudFormation(properties.inactiveDate),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
    ret.addPropertyResult('certificate', 'Certificate', cfn_parse.FromCloudFormation.getString(properties.Certificate));
    ret.addPropertyResult('usage', 'Usage', cfn_parse.FromCloudFormation.getString(properties.Usage));
    ret.addPropertyResult('activeDate', 'ActiveDate', properties.ActiveDate != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveDate) : undefined);
    ret.addPropertyResult('certificateChain', 'CertificateChain', properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inactiveDate', 'InactiveDate', properties.InactiveDate != null ? cfn_parse.FromCloudFormation.getString(properties.InactiveDate) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Certificate`
 *
 * Imports the signing and encryption certificates that you need to create local (AS2) profiles and partner profiles.
 *
 * @cloudformationResource AWS::Transfer::Certificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Certificate";

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
     * The unique Amazon Resource Name (ARN) for the certificate.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     * @cloudformationAttribute CertificateId
     */
    public readonly attrCertificateId: string;

    /**
     * The final date that the certificate is valid.
     * @cloudformationAttribute NotAfterDate
     */
    public readonly attrNotAfterDate: string;

    /**
     * The earliest date that the certificate is valid.
     * @cloudformationAttribute NotBeforeDate
     */
    public readonly attrNotBeforeDate: string;

    /**
     * The serial number for the certificate.
     * @cloudformationAttribute Serial
     */
    public readonly attrSerial: string;

    /**
     * The certificate can be either `ACTIVE` , `PENDING_ROTATION` , or `INACTIVE` . `PENDING_ROTATION` means that this certificate will replace the current certificate when it expires.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * If a private key has been specified for the certificate, its type is `CERTIFICATE_WITH_PRIVATE_KEY` . If there is no private key, the type is `CERTIFICATE` .
     * @cloudformationAttribute Type
     */
    public readonly attrType: string;

    /**
     * The file name for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificate
     */
    public certificate: string;

    /**
     * Specifies whether this certificate is used for signing or encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-usage
     */
    public usage: string;

    /**
     * An optional date that specifies when the certificate becomes active.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-activedate
     */
    public activeDate: string | undefined;

    /**
     * The list of certificates that make up the chain for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificatechain
     */
    public certificateChain: string | undefined;

    /**
     * The name or description that's used to identity the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-description
     */
    public description: string | undefined;

    /**
     * An optional date that specifies when the certificate becomes inactive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-inactivedate
     */
    public inactiveDate: string | undefined;

    /**
     * The file that contains the private key for the certificate that's being imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-privatekey
     */
    public privateKey: string | undefined;

    /**
     * Key-value pairs that can be used to group and search for certificates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::Certificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
        super(scope, id, { type: CfnCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificate', this);
        cdk.requireProperty(props, 'usage', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCertificateId = cdk.Token.asString(this.getAtt('CertificateId', cdk.ResolutionTypeHint.STRING));
        this.attrNotAfterDate = cdk.Token.asString(this.getAtt('NotAfterDate', cdk.ResolutionTypeHint.STRING));
        this.attrNotBeforeDate = cdk.Token.asString(this.getAtt('NotBeforeDate', cdk.ResolutionTypeHint.STRING));
        this.attrSerial = cdk.Token.asString(this.getAtt('Serial', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.attrType = cdk.Token.asString(this.getAtt('Type', cdk.ResolutionTypeHint.STRING));

        this.certificate = props.certificate;
        this.usage = props.usage;
        this.activeDate = props.activeDate;
        this.certificateChain = props.certificateChain;
        this.description = props.description;
        this.inactiveDate = props.inactiveDate;
        this.privateKey = props.privateKey;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Certificate", props.tags, { tagPropertyName: 'tags' });
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
            certificate: this.certificate,
            usage: this.usage,
            activeDate: this.activeDate,
            certificateChain: this.certificateChain,
            description: this.description,
            inactiveDate: this.inactiveDate,
            privateKey: this.privateKey,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html
 */
export interface CfnConnectorProps {

    /**
     * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-accessrole
     */
    readonly accessRole: string;

    /**
     * A structure that contains the parameters for a connector object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-as2config
     */
    readonly as2Config: any | cdk.IResolvable;

    /**
     * The URL of the partner's AS2 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-url
     */
    readonly url: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events. When set, you can view connector activity in your CloudWatch logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-loggingrole
     */
    readonly loggingRole?: string;

    /**
     * Key-value pairs that can be used to group and search for connectors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessRole', cdk.requiredValidator)(properties.accessRole));
    errors.collect(cdk.propertyValidator('accessRole', cdk.validateString)(properties.accessRole));
    errors.collect(cdk.propertyValidator('as2Config', cdk.requiredValidator)(properties.as2Config));
    errors.collect(cdk.propertyValidator('as2Config', cdk.validateObject)(properties.as2Config));
    errors.collect(cdk.propertyValidator('loggingRole', cdk.validateString)(properties.loggingRole));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "CfnConnectorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Connector` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Connector` resource.
 */
// @ts-ignore TS6133
function cfnConnectorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectorPropsValidator(properties).assertSuccess();
    return {
        AccessRole: cdk.stringToCloudFormation(properties.accessRole),
        As2Config: cdk.objectToCloudFormation(properties.as2Config),
        Url: cdk.stringToCloudFormation(properties.url),
        LoggingRole: cdk.stringToCloudFormation(properties.loggingRole),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
    ret.addPropertyResult('accessRole', 'AccessRole', cfn_parse.FromCloudFormation.getString(properties.AccessRole));
    ret.addPropertyResult('as2Config', 'As2Config', cfn_parse.FromCloudFormation.getAny(properties.As2Config));
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addPropertyResult('loggingRole', 'LoggingRole', properties.LoggingRole != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingRole) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Connector`
 *
 * Creates the connector, which captures the parameters for an outbound connection for the AS2 protocol. The connector is required for sending files to an externally hosted AS2 server. For more details about connectors, see [Create AS2 connectors](https://docs.aws.amazon.com/transfer/latest/userguide/create-b2b-server.html#configure-as2-connector) .
 *
 * @cloudformationResource AWS::Transfer::Connector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Connector";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConnectorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConnector(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute ConnectorId
     */
    public readonly attrConnectorId: string;

    /**
     * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-accessrole
     */
    public accessRole: string;

    /**
     * A structure that contains the parameters for a connector object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-as2config
     */
    public as2Config: any | cdk.IResolvable;

    /**
     * The URL of the partner's AS2 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-url
     */
    public url: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events. When set, you can view connector activity in your CloudWatch logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-loggingrole
     */
    public loggingRole: string | undefined;

    /**
     * Key-value pairs that can be used to group and search for connectors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::Connector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
        super(scope, id, { type: CfnConnector.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accessRole', this);
        cdk.requireProperty(props, 'as2Config', this);
        cdk.requireProperty(props, 'url', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrConnectorId = cdk.Token.asString(this.getAtt('ConnectorId', cdk.ResolutionTypeHint.STRING));

        this.accessRole = props.accessRole;
        this.as2Config = props.as2Config;
        this.url = props.url;
        this.loggingRole = props.loggingRole;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Connector", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accessRole: this.accessRole,
            as2Config: this.as2Config,
            url: this.url,
            loggingRole: this.loggingRole,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectorPropsToCloudFormation(props);
    }
}

export namespace CfnConnector {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html
     */
    export interface As2ConfigProperty {
        /**
         * `CfnConnector.As2ConfigProperty.Compression`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-compression
         */
        readonly compression?: string;
        /**
         * `CfnConnector.As2ConfigProperty.EncryptionAlgorithm`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-encryptionalgorithm
         */
        readonly encryptionAlgorithm?: string;
        /**
         * `CfnConnector.As2ConfigProperty.LocalProfileId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-localprofileid
         */
        readonly localProfileId?: string;
        /**
         * `CfnConnector.As2ConfigProperty.MdnResponse`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-mdnresponse
         */
        readonly mdnResponse?: string;
        /**
         * `CfnConnector.As2ConfigProperty.MdnSigningAlgorithm`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-mdnsigningalgorithm
         */
        readonly mdnSigningAlgorithm?: string;
        /**
         * `CfnConnector.As2ConfigProperty.MessageSubject`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-messagesubject
         */
        readonly messageSubject?: string;
        /**
         * `CfnConnector.As2ConfigProperty.PartnerProfileId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-partnerprofileid
         */
        readonly partnerProfileId?: string;
        /**
         * `CfnConnector.As2ConfigProperty.SigningAlgorithm`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-signingalgorithm
         */
        readonly signingAlgorithm?: string;
    }
}

/**
 * Determine whether the given properties match those of a `As2ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `As2ConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnector_As2ConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('compression', cdk.validateString)(properties.compression));
    errors.collect(cdk.propertyValidator('encryptionAlgorithm', cdk.validateString)(properties.encryptionAlgorithm));
    errors.collect(cdk.propertyValidator('localProfileId', cdk.validateString)(properties.localProfileId));
    errors.collect(cdk.propertyValidator('mdnResponse', cdk.validateString)(properties.mdnResponse));
    errors.collect(cdk.propertyValidator('mdnSigningAlgorithm', cdk.validateString)(properties.mdnSigningAlgorithm));
    errors.collect(cdk.propertyValidator('messageSubject', cdk.validateString)(properties.messageSubject));
    errors.collect(cdk.propertyValidator('partnerProfileId', cdk.validateString)(properties.partnerProfileId));
    errors.collect(cdk.propertyValidator('signingAlgorithm', cdk.validateString)(properties.signingAlgorithm));
    return errors.wrap('supplied properties not correct for "As2ConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Connector.As2Config` resource
 *
 * @param properties - the TypeScript properties of a `As2ConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Connector.As2Config` resource.
 */
// @ts-ignore TS6133
function cfnConnectorAs2ConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnector_As2ConfigPropertyValidator(properties).assertSuccess();
    return {
        Compression: cdk.stringToCloudFormation(properties.compression),
        EncryptionAlgorithm: cdk.stringToCloudFormation(properties.encryptionAlgorithm),
        LocalProfileId: cdk.stringToCloudFormation(properties.localProfileId),
        MdnResponse: cdk.stringToCloudFormation(properties.mdnResponse),
        MdnSigningAlgorithm: cdk.stringToCloudFormation(properties.mdnSigningAlgorithm),
        MessageSubject: cdk.stringToCloudFormation(properties.messageSubject),
        PartnerProfileId: cdk.stringToCloudFormation(properties.partnerProfileId),
        SigningAlgorithm: cdk.stringToCloudFormation(properties.signingAlgorithm),
    };
}

// @ts-ignore TS6133
function CfnConnectorAs2ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.As2ConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.As2ConfigProperty>();
    ret.addPropertyResult('compression', 'Compression', properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined);
    ret.addPropertyResult('encryptionAlgorithm', 'EncryptionAlgorithm', properties.EncryptionAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionAlgorithm) : undefined);
    ret.addPropertyResult('localProfileId', 'LocalProfileId', properties.LocalProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.LocalProfileId) : undefined);
    ret.addPropertyResult('mdnResponse', 'MdnResponse', properties.MdnResponse != null ? cfn_parse.FromCloudFormation.getString(properties.MdnResponse) : undefined);
    ret.addPropertyResult('mdnSigningAlgorithm', 'MdnSigningAlgorithm', properties.MdnSigningAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.MdnSigningAlgorithm) : undefined);
    ret.addPropertyResult('messageSubject', 'MessageSubject', properties.MessageSubject != null ? cfn_parse.FromCloudFormation.getString(properties.MessageSubject) : undefined);
    ret.addPropertyResult('partnerProfileId', 'PartnerProfileId', properties.PartnerProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerProfileId) : undefined);
    ret.addPropertyResult('signingAlgorithm', 'SigningAlgorithm', properties.SigningAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.SigningAlgorithm) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html
 */
export interface CfnProfileProps {

    /**
     * The `As2Id` is the *AS2-name* , as defined in the [RFC 4130](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc4130) . For inbound transfers, this is the `AS2-From` header for the AS2 messages sent from the partner. For outbound connectors, this is the `AS2-To` header for the AS2 messages sent to the partner using the `StartFileTransfer` API operation. This ID cannot include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-as2id
     */
    readonly as2Id: string;

    /**
     * Indicates whether to list only `LOCAL` type profiles or only `PARTNER` type profiles. If not supplied in the request, the command lists all types of profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-profiletype
     */
    readonly profileType: string;

    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-certificateids
     */
    readonly certificateIds?: string[];

    /**
     * Key-value pairs that can be used to group and search for profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('as2Id', cdk.requiredValidator)(properties.as2Id));
    errors.collect(cdk.propertyValidator('as2Id', cdk.validateString)(properties.as2Id));
    errors.collect(cdk.propertyValidator('certificateIds', cdk.listValidator(cdk.validateString))(properties.certificateIds));
    errors.collect(cdk.propertyValidator('profileType', cdk.requiredValidator)(properties.profileType));
    errors.collect(cdk.propertyValidator('profileType', cdk.validateString)(properties.profileType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Profile` resource
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Profile` resource.
 */
// @ts-ignore TS6133
function cfnProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilePropsValidator(properties).assertSuccess();
    return {
        As2Id: cdk.stringToCloudFormation(properties.as2Id),
        ProfileType: cdk.stringToCloudFormation(properties.profileType),
        CertificateIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateIds),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfileProps>();
    ret.addPropertyResult('as2Id', 'As2Id', cfn_parse.FromCloudFormation.getString(properties.As2Id));
    ret.addPropertyResult('profileType', 'ProfileType', cfn_parse.FromCloudFormation.getString(properties.ProfileType));
    ret.addPropertyResult('certificateIds', 'CertificateIds', properties.CertificateIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CertificateIds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Profile`
 *
 * Creates the local or partner profile to use for AS2 transfers.
 *
 * @cloudformationResource AWS::Transfer::Profile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html
 */
export class CfnProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Profile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute ProfileId
     */
    public readonly attrProfileId: string;

    /**
     * The `As2Id` is the *AS2-name* , as defined in the [RFC 4130](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc4130) . For inbound transfers, this is the `AS2-From` header for the AS2 messages sent from the partner. For outbound connectors, this is the `AS2-To` header for the AS2 messages sent to the partner using the `StartFileTransfer` API operation. This ID cannot include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-as2id
     */
    public as2Id: string;

    /**
     * Indicates whether to list only `LOCAL` type profiles or only `PARTNER` type profiles. If not supplied in the request, the command lists all types of profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-profiletype
     */
    public profileType: string;

    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-certificateids
     */
    public certificateIds: string[] | undefined;

    /**
     * Key-value pairs that can be used to group and search for profiles.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::Profile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProfileProps) {
        super(scope, id, { type: CfnProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'as2Id', this);
        cdk.requireProperty(props, 'profileType', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrProfileId = cdk.Token.asString(this.getAtt('ProfileId', cdk.ResolutionTypeHint.STRING));

        this.as2Id = props.as2Id;
        this.profileType = props.profileType;
        this.certificateIds = props.certificateIds;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Profile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            as2Id: this.as2Id,
            profileType: this.profileType,
            certificateIds: this.certificateIds,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProfilePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnServer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html
 */
export interface CfnServerProps {

    /**
     * The Amazon Resource Name (ARN) of the AWS Certificate Manager (ACM) certificate. Required when `Protocols` is set to `FTPS` .
     *
     * To request a new public certificate, see [Request a public certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) in the *AWS Certificate Manager User Guide* .
     *
     * To import an existing certificate into ACM, see [Importing certificates into ACM](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) in the *AWS Certificate Manager User Guide* .
     *
     * To request a private certificate to use FTPS through private IP addresses, see [Request a private certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-private.html) in the *AWS Certificate Manager User Guide* .
     *
     * Certificates with the following cryptographic algorithms and key sizes are supported:
     *
     * - 2048-bit RSA (RSA_2048)
     * - 4096-bit RSA (RSA_4096)
     * - Elliptic Prime Curve 256 bit (EC_prime256v1)
     * - Elliptic Prime Curve 384 bit (EC_secp384r1)
     * - Elliptic Prime Curve 521 bit (EC_secp521r1)
     *
     * > The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-certificate
     */
    readonly certificate?: string;

    /**
     * Specifies the domain of the storage system that is used for file transfers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-domain
     */
    readonly domain?: string;

    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointdetails
     */
    readonly endpointDetails?: CfnServer.EndpointDetailsProperty | cdk.IResolvable;

    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointtype
     */
    readonly endpointType?: string;

    /**
     * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` or `API_GATEWAY` . Accepts an array containing all of the information required to use a directory in `AWS_DIRECTORY_SERVICE` or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when `IdentityProviderType` is set to `SERVICE_MANAGED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityproviderdetails
     */
    readonly identityProviderDetails?: CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable;

    /**
     * The mode of authentication for a server. The default value is `SERVICE_MANAGED` , which allows you to store and access user credentials within the AWS Transfer Family service.
     *
     * Use `AWS_DIRECTORY_SERVICE` to provide access to Active Directory groups in AWS Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in AWS using AD Connector. This option also requires you to provide a Directory ID by using the `IdentityProviderDetails` parameter.
     *
     * Use the `API_GATEWAY` value to integrate with an identity provider of your choosing. The `API_GATEWAY` setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the `IdentityProviderDetails` parameter.
     *
     * Use the `AWS_LAMBDA` value to directly use an AWS Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the `Function` parameter or the `IdentityProviderDetails` data type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityprovidertype
     */
    readonly identityProviderType?: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-loggingrole
     */
    readonly loggingRole?: string;

    /**
     * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.
     *
     * > The SFTP protocol does not support post-authentication display banners.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-postauthenticationloginbanner
     */
    readonly postAuthenticationLoginBanner?: string;

    /**
     * Specifies a string to display when users connect to a server. This string is displayed before the user authenticates. For example, the following banner displays details about using the system:
     *
     * `This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-preauthenticationloginbanner
     */
    readonly preAuthenticationLoginBanner?: string;

    /**
     * The protocol settings that are configured for your server.
     *
     * - To indicate passive mode (for FTP and FTPS protocols), use the `PassiveIp` parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.
     * - To ignore the error that is generated when the client attempts to use the `SETSTAT` command on a file that you are uploading to an Amazon S3 bucket, use the `SetStatOption` parameter. To have the AWS Transfer Family server ignore the `SETSTAT` command and upload files without needing to make any changes to your SFTP client, set the value to `ENABLE_NO_OP` . If you set the `SetStatOption` parameter to `ENABLE_NO_OP` , Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a `SETSTAT` call.
     * - To determine whether your AWS Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the `TlsSessionResumptionMode` parameter.
     * - `As2Transports` indicates the transport method for the AS2 messages. Currently, only HTTP is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocoldetails
     */
    readonly protocolDetails?: CfnServer.ProtocolDetailsProperty | cdk.IResolvable;

    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:
     *
     * - `SFTP` (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH
     * - `FTPS` (File Transfer Protocol Secure): File transfer with TLS encryption
     * - `FTP` (File Transfer Protocol): Unencrypted file transfer
     * - `AS2` (Applicability Statement 2): used for transporting structured business-to-business data
     *
     * > - If you select `FTPS` , you must choose a certificate stored in AWS Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS.
     * > - If `Protocol` includes either `FTP` or `FTPS` , then the `EndpointType` must be `VPC` and the `IdentityProviderType` must be either `AWS_DIRECTORY_SERVICE` , `AWS_LAMBDA` , or `API_GATEWAY` .
     * > - If `Protocol` includes `FTP` , then `AddressAllocationIds` cannot be associated.
     * > - If `Protocol` is set only to `SFTP` , the `EndpointType` can be set to `PUBLIC` and the `IdentityProviderType` can be set any of the supported identity types: `SERVICE_MANAGED` , `AWS_DIRECTORY_SERVICE` , `AWS_LAMBDA` , or `API_GATEWAY` .
     * > - If `Protocol` includes `AS2` , then the `EndpointType` must be `VPC` , and domain must be Amazon S3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocols
     */
    readonly protocols?: string[];

    /**
     * Specifies the name of the security policy that is attached to the server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-securitypolicyname
     */
    readonly securityPolicyName?: string;

    /**
     * Key-value pairs that can be used to group and search for servers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
     *
     * In addition to a workflow to execute when a file is uploaded completely, `WorkflowDetails` can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when a file is open when the session disconnects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-workflowdetails
     */
    readonly workflowDetails?: CfnServer.WorkflowDetailsProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnServerProps`
 *
 * @param properties - the TypeScript properties of a `CfnServerProps`
 *
 * @returns the result of the validation.
 */
function CfnServerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('endpointDetails', CfnServer_EndpointDetailsPropertyValidator)(properties.endpointDetails));
    errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
    errors.collect(cdk.propertyValidator('identityProviderDetails', CfnServer_IdentityProviderDetailsPropertyValidator)(properties.identityProviderDetails));
    errors.collect(cdk.propertyValidator('identityProviderType', cdk.validateString)(properties.identityProviderType));
    errors.collect(cdk.propertyValidator('loggingRole', cdk.validateString)(properties.loggingRole));
    errors.collect(cdk.propertyValidator('postAuthenticationLoginBanner', cdk.validateString)(properties.postAuthenticationLoginBanner));
    errors.collect(cdk.propertyValidator('preAuthenticationLoginBanner', cdk.validateString)(properties.preAuthenticationLoginBanner));
    errors.collect(cdk.propertyValidator('protocolDetails', CfnServer_ProtocolDetailsPropertyValidator)(properties.protocolDetails));
    errors.collect(cdk.propertyValidator('protocols', cdk.listValidator(cdk.validateString))(properties.protocols));
    errors.collect(cdk.propertyValidator('securityPolicyName', cdk.validateString)(properties.securityPolicyName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('workflowDetails', CfnServer_WorkflowDetailsPropertyValidator)(properties.workflowDetails));
    return errors.wrap('supplied properties not correct for "CfnServerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server` resource
 *
 * @param properties - the TypeScript properties of a `CfnServerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server` resource.
 */
// @ts-ignore TS6133
function cfnServerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServerPropsValidator(properties).assertSuccess();
    return {
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        Domain: cdk.stringToCloudFormation(properties.domain),
        EndpointDetails: cfnServerEndpointDetailsPropertyToCloudFormation(properties.endpointDetails),
        EndpointType: cdk.stringToCloudFormation(properties.endpointType),
        IdentityProviderDetails: cfnServerIdentityProviderDetailsPropertyToCloudFormation(properties.identityProviderDetails),
        IdentityProviderType: cdk.stringToCloudFormation(properties.identityProviderType),
        LoggingRole: cdk.stringToCloudFormation(properties.loggingRole),
        PostAuthenticationLoginBanner: cdk.stringToCloudFormation(properties.postAuthenticationLoginBanner),
        PreAuthenticationLoginBanner: cdk.stringToCloudFormation(properties.preAuthenticationLoginBanner),
        ProtocolDetails: cfnServerProtocolDetailsPropertyToCloudFormation(properties.protocolDetails),
        Protocols: cdk.listMapper(cdk.stringToCloudFormation)(properties.protocols),
        SecurityPolicyName: cdk.stringToCloudFormation(properties.securityPolicyName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        WorkflowDetails: cfnServerWorkflowDetailsPropertyToCloudFormation(properties.workflowDetails),
    };
}

// @ts-ignore TS6133
function CfnServerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerProps>();
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addPropertyResult('endpointDetails', 'EndpointDetails', properties.EndpointDetails != null ? CfnServerEndpointDetailsPropertyFromCloudFormation(properties.EndpointDetails) : undefined);
    ret.addPropertyResult('endpointType', 'EndpointType', properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined);
    ret.addPropertyResult('identityProviderDetails', 'IdentityProviderDetails', properties.IdentityProviderDetails != null ? CfnServerIdentityProviderDetailsPropertyFromCloudFormation(properties.IdentityProviderDetails) : undefined);
    ret.addPropertyResult('identityProviderType', 'IdentityProviderType', properties.IdentityProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderType) : undefined);
    ret.addPropertyResult('loggingRole', 'LoggingRole', properties.LoggingRole != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingRole) : undefined);
    ret.addPropertyResult('postAuthenticationLoginBanner', 'PostAuthenticationLoginBanner', properties.PostAuthenticationLoginBanner != null ? cfn_parse.FromCloudFormation.getString(properties.PostAuthenticationLoginBanner) : undefined);
    ret.addPropertyResult('preAuthenticationLoginBanner', 'PreAuthenticationLoginBanner', properties.PreAuthenticationLoginBanner != null ? cfn_parse.FromCloudFormation.getString(properties.PreAuthenticationLoginBanner) : undefined);
    ret.addPropertyResult('protocolDetails', 'ProtocolDetails', properties.ProtocolDetails != null ? CfnServerProtocolDetailsPropertyFromCloudFormation(properties.ProtocolDetails) : undefined);
    ret.addPropertyResult('protocols', 'Protocols', properties.Protocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Protocols) : undefined);
    ret.addPropertyResult('securityPolicyName', 'SecurityPolicyName', properties.SecurityPolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicyName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('workflowDetails', 'WorkflowDetails', properties.WorkflowDetails != null ? CfnServerWorkflowDetailsPropertyFromCloudFormation(properties.WorkflowDetails) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Server`
 *
 * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in AWS . When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated `ServerId` property that is assigned to the newly created server.
 *
 * @cloudformationResource AWS::Transfer::Server
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html
 */
export class CfnServer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Server";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnServerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnServer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name associated with the server, in the form `arn:aws:transfer:region: *account-id* :server/ *server-id* /` .
     *
     * An example of a server ARN is: `arn:aws:transfer:us-east-1:123456789012:server/s-01234567890abcdef` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The service-assigned ID of the server that is created.
     *
     * An example `ServerId` is `s-01234567890abcdef` .
     * @cloudformationAttribute ServerId
     */
    public readonly attrServerId: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Certificate Manager (ACM) certificate. Required when `Protocols` is set to `FTPS` .
     *
     * To request a new public certificate, see [Request a public certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) in the *AWS Certificate Manager User Guide* .
     *
     * To import an existing certificate into ACM, see [Importing certificates into ACM](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) in the *AWS Certificate Manager User Guide* .
     *
     * To request a private certificate to use FTPS through private IP addresses, see [Request a private certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-private.html) in the *AWS Certificate Manager User Guide* .
     *
     * Certificates with the following cryptographic algorithms and key sizes are supported:
     *
     * - 2048-bit RSA (RSA_2048)
     * - 4096-bit RSA (RSA_4096)
     * - Elliptic Prime Curve 256 bit (EC_prime256v1)
     * - Elliptic Prime Curve 384 bit (EC_secp384r1)
     * - Elliptic Prime Curve 521 bit (EC_secp521r1)
     *
     * > The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-certificate
     */
    public certificate: string | undefined;

    /**
     * Specifies the domain of the storage system that is used for file transfers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-domain
     */
    public domain: string | undefined;

    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointdetails
     */
    public endpointDetails: CfnServer.EndpointDetailsProperty | cdk.IResolvable | undefined;

    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointtype
     */
    public endpointType: string | undefined;

    /**
     * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` or `API_GATEWAY` . Accepts an array containing all of the information required to use a directory in `AWS_DIRECTORY_SERVICE` or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when `IdentityProviderType` is set to `SERVICE_MANAGED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityproviderdetails
     */
    public identityProviderDetails: CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable | undefined;

    /**
     * The mode of authentication for a server. The default value is `SERVICE_MANAGED` , which allows you to store and access user credentials within the AWS Transfer Family service.
     *
     * Use `AWS_DIRECTORY_SERVICE` to provide access to Active Directory groups in AWS Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in AWS using AD Connector. This option also requires you to provide a Directory ID by using the `IdentityProviderDetails` parameter.
     *
     * Use the `API_GATEWAY` value to integrate with an identity provider of your choosing. The `API_GATEWAY` setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the `IdentityProviderDetails` parameter.
     *
     * Use the `AWS_LAMBDA` value to directly use an AWS Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the `Function` parameter or the `IdentityProviderDetails` data type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityprovidertype
     */
    public identityProviderType: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-loggingrole
     */
    public loggingRole: string | undefined;

    /**
     * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.
     *
     * > The SFTP protocol does not support post-authentication display banners.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-postauthenticationloginbanner
     */
    public postAuthenticationLoginBanner: string | undefined;

    /**
     * Specifies a string to display when users connect to a server. This string is displayed before the user authenticates. For example, the following banner displays details about using the system:
     *
     * `This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-preauthenticationloginbanner
     */
    public preAuthenticationLoginBanner: string | undefined;

    /**
     * The protocol settings that are configured for your server.
     *
     * - To indicate passive mode (for FTP and FTPS protocols), use the `PassiveIp` parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.
     * - To ignore the error that is generated when the client attempts to use the `SETSTAT` command on a file that you are uploading to an Amazon S3 bucket, use the `SetStatOption` parameter. To have the AWS Transfer Family server ignore the `SETSTAT` command and upload files without needing to make any changes to your SFTP client, set the value to `ENABLE_NO_OP` . If you set the `SetStatOption` parameter to `ENABLE_NO_OP` , Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a `SETSTAT` call.
     * - To determine whether your AWS Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the `TlsSessionResumptionMode` parameter.
     * - `As2Transports` indicates the transport method for the AS2 messages. Currently, only HTTP is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocoldetails
     */
    public protocolDetails: CfnServer.ProtocolDetailsProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:
     *
     * - `SFTP` (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH
     * - `FTPS` (File Transfer Protocol Secure): File transfer with TLS encryption
     * - `FTP` (File Transfer Protocol): Unencrypted file transfer
     * - `AS2` (Applicability Statement 2): used for transporting structured business-to-business data
     *
     * > - If you select `FTPS` , you must choose a certificate stored in AWS Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS.
     * > - If `Protocol` includes either `FTP` or `FTPS` , then the `EndpointType` must be `VPC` and the `IdentityProviderType` must be either `AWS_DIRECTORY_SERVICE` , `AWS_LAMBDA` , or `API_GATEWAY` .
     * > - If `Protocol` includes `FTP` , then `AddressAllocationIds` cannot be associated.
     * > - If `Protocol` is set only to `SFTP` , the `EndpointType` can be set to `PUBLIC` and the `IdentityProviderType` can be set any of the supported identity types: `SERVICE_MANAGED` , `AWS_DIRECTORY_SERVICE` , `AWS_LAMBDA` , or `API_GATEWAY` .
     * > - If `Protocol` includes `AS2` , then the `EndpointType` must be `VPC` , and domain must be Amazon S3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocols
     */
    public protocols: string[] | undefined;

    /**
     * Specifies the name of the security policy that is attached to the server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-securitypolicyname
     */
    public securityPolicyName: string | undefined;

    /**
     * Key-value pairs that can be used to group and search for servers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
     *
     * In addition to a workflow to execute when a file is uploaded completely, `WorkflowDetails` can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when a file is open when the session disconnects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-workflowdetails
     */
    public workflowDetails: CfnServer.WorkflowDetailsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Transfer::Server`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServerProps = {}) {
        super(scope, id, { type: CfnServer.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrServerId = cdk.Token.asString(this.getAtt('ServerId', cdk.ResolutionTypeHint.STRING));

        this.certificate = props.certificate;
        this.domain = props.domain;
        this.endpointDetails = props.endpointDetails;
        this.endpointType = props.endpointType;
        this.identityProviderDetails = props.identityProviderDetails;
        this.identityProviderType = props.identityProviderType;
        this.loggingRole = props.loggingRole;
        this.postAuthenticationLoginBanner = props.postAuthenticationLoginBanner;
        this.preAuthenticationLoginBanner = props.preAuthenticationLoginBanner;
        this.protocolDetails = props.protocolDetails;
        this.protocols = props.protocols;
        this.securityPolicyName = props.securityPolicyName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Server", props.tags, { tagPropertyName: 'tags' });
        this.workflowDetails = props.workflowDetails;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnServer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificate: this.certificate,
            domain: this.domain,
            endpointDetails: this.endpointDetails,
            endpointType: this.endpointType,
            identityProviderDetails: this.identityProviderDetails,
            identityProviderType: this.identityProviderType,
            loggingRole: this.loggingRole,
            postAuthenticationLoginBanner: this.postAuthenticationLoginBanner,
            preAuthenticationLoginBanner: this.preAuthenticationLoginBanner,
            protocolDetails: this.protocolDetails,
            protocols: this.protocols,
            securityPolicyName: this.securityPolicyName,
            tags: this.tags.renderTags(),
            workflowDetails: this.workflowDetails,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnServerPropsToCloudFormation(props);
    }
}

export namespace CfnServer {
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html
     */
    export interface EndpointDetailsProperty {
        /**
         * A list of address allocation IDs that are required to attach an Elastic IP address to your server's endpoint.
         *
         * > This property can only be set when `EndpointType` is set to `VPC` and it is only valid in the `UpdateServer` API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-addressallocationids
         */
        readonly addressAllocationIds?: string[];
        /**
         * A list of security groups IDs that are available to attach to your server's endpoint.
         *
         * > This property can only be set when `EndpointType` is set to `VPC` .
         * >
         * > You can edit the `SecurityGroupIds` property in the [UpdateServer](https://docs.aws.amazon.com/transfer/latest/userguide/API_UpdateServer.html) API only if you are changing the `EndpointType` from `PUBLIC` or `VPC_ENDPOINT` to `VPC` . To change security groups associated with your server's VPC endpoint after creation, use the Amazon EC2 [ModifyVpcEndpoint](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyVpcEndpoint.html) API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * A list of subnet IDs that are required to host your server endpoint in your VPC.
         *
         * > This property can only be set when `EndpointType` is set to `VPC` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-subnetids
         */
        readonly subnetIds?: string[];
        /**
         * The ID of the VPC endpoint.
         *
         * > This property can only be set when `EndpointType` is set to `VPC_ENDPOINT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-vpcendpointid
         */
        readonly vpcEndpointId?: string;
        /**
         * The VPC ID of the virtual private cloud in which the server's endpoint will be hosted.
         *
         * > This property can only be set when `EndpointType` is set to `VPC` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-vpcid
         */
        readonly vpcId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EndpointDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnServer_EndpointDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addressAllocationIds', cdk.listValidator(cdk.validateString))(properties.addressAllocationIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('vpcEndpointId', cdk.validateString)(properties.vpcEndpointId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "EndpointDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server.EndpointDetails` resource
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server.EndpointDetails` resource.
 */
// @ts-ignore TS6133
function cfnServerEndpointDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServer_EndpointDetailsPropertyValidator(properties).assertSuccess();
    return {
        AddressAllocationIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.addressAllocationIds),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        VpcEndpointId: cdk.stringToCloudFormation(properties.vpcEndpointId),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnServerEndpointDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.EndpointDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.EndpointDetailsProperty>();
    ret.addPropertyResult('addressAllocationIds', 'AddressAllocationIds', properties.AddressAllocationIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AddressAllocationIds) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addPropertyResult('vpcEndpointId', 'VpcEndpointId', properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined);
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnServer {
    /**
     * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` or `API_GATEWAY` . Accepts an array containing all of the information required to use a directory in `AWS_DIRECTORY_SERVICE` or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when `IdentityProviderType` is set to `SERVICE_MANAGED` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html
     */
    export interface IdentityProviderDetailsProperty {
        /**
         * The identifier of the AWS Directory Service directory that you want to stop sharing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-directoryid
         */
        readonly directoryId?: string;
        /**
         * The ARN for a lambda function to use for the Identity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-function
         */
        readonly function?: string;
        /**
         * Provides the type of `InvocationRole` used to authenticate the user account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-invocationrole
         */
        readonly invocationRole?: string;
        /**
         * Provides the location of the service endpoint used to authenticate users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IdentityProviderDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `IdentityProviderDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnServer_IdentityProviderDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('directoryId', cdk.validateString)(properties.directoryId));
    errors.collect(cdk.propertyValidator('function', cdk.validateString)(properties.function));
    errors.collect(cdk.propertyValidator('invocationRole', cdk.validateString)(properties.invocationRole));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "IdentityProviderDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server.IdentityProviderDetails` resource
 *
 * @param properties - the TypeScript properties of a `IdentityProviderDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server.IdentityProviderDetails` resource.
 */
// @ts-ignore TS6133
function cfnServerIdentityProviderDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServer_IdentityProviderDetailsPropertyValidator(properties).assertSuccess();
    return {
        DirectoryId: cdk.stringToCloudFormation(properties.directoryId),
        Function: cdk.stringToCloudFormation(properties.function),
        InvocationRole: cdk.stringToCloudFormation(properties.invocationRole),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnServerIdentityProviderDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.IdentityProviderDetailsProperty>();
    ret.addPropertyResult('directoryId', 'DirectoryId', properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined);
    ret.addPropertyResult('function', 'Function', properties.Function != null ? cfn_parse.FromCloudFormation.getString(properties.Function) : undefined);
    ret.addPropertyResult('invocationRole', 'InvocationRole', properties.InvocationRole != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationRole) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnServer {
    /**
     * Protocol settings that are configured for your server.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html
     */
    export interface ProtocolDetailsProperty {
        /**
         * List of `As2Transport` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-as2transports
         */
        readonly as2Transports?: string[];
        /**
         * Indicates passive mode, for FTP and FTPS protocols. Enter a single IPv4 address, such as the public IP address of a firewall, router, or load balancer. For example:
         *
         * `aws transfer update-server --protocol-details PassiveIp=0.0.0.0`
         *
         * Replace `0.0.0.0` in the example above with the actual IP address you want to use.
         *
         * > If you change the `PassiveIp` value, you must stop and then restart your Transfer Family server for the change to take effect. For details on using passive mode (PASV) in a NAT environment, see [Configuring your FTPS server behind a firewall or NAT with AWS Transfer Family](https://docs.aws.amazon.com/storage/configuring-your-ftps-server-behind-a-firewall-or-nat-with-aws-transfer-family/) .
         *
         * *Special values*
         *
         * The `AUTO` and `0.0.0.0` are special values for the `PassiveIp` parameter. The value `PassiveIp=AUTO` is assigned by default to FTP and FTPS type servers. In this case, the server automatically responds with one of the endpoint IPs within the PASV response. `PassiveIp=0.0.0.0` has a more unique application for its usage. For example, if you have a High Availability (HA) Network Load Balancer (NLB) environment, where you have 3 subnets, you can only specify a single IP address using the `PassiveIp` parameter. This reduces the effectiveness of having High Availability. In this case, you can specify `PassiveIp=0.0.0.0` . This tells the client to use the same IP address as the Control connection and utilize all AZs for their connections. Note, however, that not all FTP clients support the `PassiveIp=0.0.0.0` response. FileZilla and WinSCP do support it. If you are using other clients, check to see if your client supports the `PassiveIp=0.0.0.0` response.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-passiveip
         */
        readonly passiveIp?: string;
        /**
         * Use the `SetStatOption` to ignore the error that is generated when the client attempts to use `SETSTAT` on a file you are uploading to an S3 bucket.
         *
         * Some SFTP file transfer clients can attempt to change the attributes of remote files, including timestamp and permissions, using commands, such as `SETSTAT` when uploading the file. However, these commands are not compatible with object storage systems, such as Amazon S3. Due to this incompatibility, file uploads from these clients can result in errors even when the file is otherwise successfully uploaded.
         *
         * Set the value to `ENABLE_NO_OP` to have the Transfer Family server ignore the `SETSTAT` command, and upload files without needing to make any changes to your SFTP client. While the `SetStatOption` `ENABLE_NO_OP` setting ignores the error, it does generate a log entry in Amazon CloudWatch Logs, so you can determine when the client is making a `SETSTAT` call.
         *
         * > If you want to preserve the original timestamp for your file, and modify other file attributes using `SETSTAT` , you can use Amazon EFS as backend storage with Transfer Family.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-setstatoption
         */
        readonly setStatOption?: string;
        /**
         * A property used with Transfer Family servers that use the FTPS protocol. TLS Session Resumption provides a mechanism to resume or share a negotiated secret key between the control and data connection for an FTPS session. `TlsSessionResumptionMode` determines whether or not the server resumes recent, negotiated sessions through a unique session ID. This property is available during `CreateServer` and `UpdateServer` calls. If a `TlsSessionResumptionMode` value is not specified during `CreateServer` , it is set to `ENFORCED` by default.
         *
         * - `DISABLED` : the server does not process TLS session resumption client requests and creates a new TLS session for each request.
         * - `ENABLED` : the server processes and accepts clients that are performing TLS session resumption. The server doesn't reject client data connections that do not perform the TLS session resumption client processing.
         * - `ENFORCED` : the server processes and accepts clients that are performing TLS session resumption. The server rejects client data connections that do not perform the TLS session resumption client processing. Before you set the value to `ENFORCED` , test your clients.
         *
         * > Not all FTPS clients perform TLS session resumption. So, if you choose to enforce TLS session resumption, you prevent any connections from FTPS clients that don't perform the protocol negotiation. To determine whether or not you can use the `ENFORCED` value, you need to test your clients.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-tlssessionresumptionmode
         */
        readonly tlsSessionResumptionMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProtocolDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnServer_ProtocolDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('as2Transports', cdk.listValidator(cdk.validateString))(properties.as2Transports));
    errors.collect(cdk.propertyValidator('passiveIp', cdk.validateString)(properties.passiveIp));
    errors.collect(cdk.propertyValidator('setStatOption', cdk.validateString)(properties.setStatOption));
    errors.collect(cdk.propertyValidator('tlsSessionResumptionMode', cdk.validateString)(properties.tlsSessionResumptionMode));
    return errors.wrap('supplied properties not correct for "ProtocolDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server.ProtocolDetails` resource
 *
 * @param properties - the TypeScript properties of a `ProtocolDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server.ProtocolDetails` resource.
 */
// @ts-ignore TS6133
function cfnServerProtocolDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServer_ProtocolDetailsPropertyValidator(properties).assertSuccess();
    return {
        As2Transports: cdk.listMapper(cdk.stringToCloudFormation)(properties.as2Transports),
        PassiveIp: cdk.stringToCloudFormation(properties.passiveIp),
        SetStatOption: cdk.stringToCloudFormation(properties.setStatOption),
        TlsSessionResumptionMode: cdk.stringToCloudFormation(properties.tlsSessionResumptionMode),
    };
}

// @ts-ignore TS6133
function CfnServerProtocolDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.ProtocolDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.ProtocolDetailsProperty>();
    ret.addPropertyResult('as2Transports', 'As2Transports', properties.As2Transports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.As2Transports) : undefined);
    ret.addPropertyResult('passiveIp', 'PassiveIp', properties.PassiveIp != null ? cfn_parse.FromCloudFormation.getString(properties.PassiveIp) : undefined);
    ret.addPropertyResult('setStatOption', 'SetStatOption', properties.SetStatOption != null ? cfn_parse.FromCloudFormation.getString(properties.SetStatOption) : undefined);
    ret.addPropertyResult('tlsSessionResumptionMode', 'TlsSessionResumptionMode', properties.TlsSessionResumptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.TlsSessionResumptionMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnServer {
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
     *
     * In addition to a workflow to execute when a file is uploaded completely, `WorkflowDetails` can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when a file is open when the session disconnects.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html
     */
    export interface WorkflowDetailProperty {
        /**
         * Includes the necessary permissions for S3, EFS, and Lambda operations that Transfer can assume, so that all workflow steps can operate on the required resources
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html#cfn-transfer-server-workflowdetail-executionrole
         */
        readonly executionRole: string;
        /**
         * A unique identifier for the workflow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html#cfn-transfer-server-workflowdetail-workflowid
         */
        readonly workflowId: string;
    }
}

/**
 * Determine whether the given properties match those of a `WorkflowDetailProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailProperty`
 *
 * @returns the result of the validation.
 */
function CfnServer_WorkflowDetailPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('executionRole', cdk.requiredValidator)(properties.executionRole));
    errors.collect(cdk.propertyValidator('executionRole', cdk.validateString)(properties.executionRole));
    errors.collect(cdk.propertyValidator('workflowId', cdk.requiredValidator)(properties.workflowId));
    errors.collect(cdk.propertyValidator('workflowId', cdk.validateString)(properties.workflowId));
    return errors.wrap('supplied properties not correct for "WorkflowDetailProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server.WorkflowDetail` resource
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server.WorkflowDetail` resource.
 */
// @ts-ignore TS6133
function cfnServerWorkflowDetailPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServer_WorkflowDetailPropertyValidator(properties).assertSuccess();
    return {
        ExecutionRole: cdk.stringToCloudFormation(properties.executionRole),
        WorkflowId: cdk.stringToCloudFormation(properties.workflowId),
    };
}

// @ts-ignore TS6133
function CfnServerWorkflowDetailPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.WorkflowDetailProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.WorkflowDetailProperty>();
    ret.addPropertyResult('executionRole', 'ExecutionRole', cfn_parse.FromCloudFormation.getString(properties.ExecutionRole));
    ret.addPropertyResult('workflowId', 'WorkflowId', cfn_parse.FromCloudFormation.getString(properties.WorkflowId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnServer {
    /**
     * Container for the `WorkflowDetail` data type. It is used by actions that trigger a workflow to begin execution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html
     */
    export interface WorkflowDetailsProperty {
        /**
         * A trigger that starts a workflow if a file is only partially uploaded. You can attach a workflow to a server that executes whenever there is a partial upload.
         *
         * A *partial upload* occurs when a file is open when the session disconnects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html#cfn-transfer-server-workflowdetails-onpartialupload
         */
        readonly onPartialUpload?: Array<CfnServer.WorkflowDetailProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A trigger that starts a workflow: the workflow begins to execute after a file is uploaded.
         *
         * To remove an associated workflow from a server, you can provide an empty `OnUpload` object, as in the following example.
         *
         * `aws transfer update-server --server-id s-01234567890abcdef --workflow-details '{"OnUpload":[]}'`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html#cfn-transfer-server-workflowdetails-onupload
         */
        readonly onUpload?: Array<CfnServer.WorkflowDetailProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WorkflowDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnServer_WorkflowDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onPartialUpload', cdk.listValidator(CfnServer_WorkflowDetailPropertyValidator))(properties.onPartialUpload));
    errors.collect(cdk.propertyValidator('onUpload', cdk.listValidator(CfnServer_WorkflowDetailPropertyValidator))(properties.onUpload));
    return errors.wrap('supplied properties not correct for "WorkflowDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Server.WorkflowDetails` resource
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Server.WorkflowDetails` resource.
 */
// @ts-ignore TS6133
function cfnServerWorkflowDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServer_WorkflowDetailsPropertyValidator(properties).assertSuccess();
    return {
        OnPartialUpload: cdk.listMapper(cfnServerWorkflowDetailPropertyToCloudFormation)(properties.onPartialUpload),
        OnUpload: cdk.listMapper(cfnServerWorkflowDetailPropertyToCloudFormation)(properties.onUpload),
    };
}

// @ts-ignore TS6133
function CfnServerWorkflowDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.WorkflowDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.WorkflowDetailsProperty>();
    ret.addPropertyResult('onPartialUpload', 'OnPartialUpload', properties.OnPartialUpload != null ? cfn_parse.FromCloudFormation.getArray(CfnServerWorkflowDetailPropertyFromCloudFormation)(properties.OnPartialUpload) : undefined);
    ret.addPropertyResult('onUpload', 'OnUpload', properties.OnUpload != null ? cfn_parse.FromCloudFormation.getArray(CfnServerWorkflowDetailPropertyFromCloudFormation)(properties.OnUpload) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html
 */
export interface CfnUserProps {

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-role
     */
    readonly role: string;

    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-serverid
     */
    readonly serverId: string;

    /**
     * A unique string that identifies a user and is associated with a `ServerId` . This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-username
     */
    readonly userName: string;

    /**
     * The landing directory (folder) for a user when they log in to the server using the client.
     *
     * A `HomeDirectory` example is `/bucket_name/home/mydirectory` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectory
     */
    readonly homeDirectory?: string;

    /**
     * Logical directory mappings that specify what Amazon S3 paths and keys should be visible to your user and how you want to make them visible. You will need to specify the " `Entry` " and " `Target` " pair, where `Entry` shows how the path is made visible and `Target` is the actual Amazon S3 path. If you only specify a target, it will be displayed as is. You will need to also make sure that your IAM role provides access to paths in `Target` . The following is an example.
     *
     * `'[ { "Entry": "/", "Target": "/bucket3/customized-reports/" } ]'`
     *
     * In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set `Entry` to '/' and set `Target` to the HomeDirectory parameter value.
     *
     * > If the target of a logical directory entry does not exist in Amazon S3, the entry will be ignored. As a workaround, you can use the Amazon S3 API to create 0 byte objects as place holders for your directory. If using the CLI, use the `s3api` call instead of `s3` so you can use the put-object operation. For example, you use the following: `AWS s3api put-object --bucket bucketname --key path/to/folder/` . Make sure that the end of the key name ends in a '/' for it to be considered a folder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorymappings
     */
    readonly homeDirectoryMappings?: Array<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to `PATH` , the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it `LOGICAL` , you need to provide mappings in the `HomeDirectoryMappings` for how you want to make Amazon S3 or Amazon EFS paths visible to your users.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorytype
     */
    readonly homeDirectoryType?: string;

    /**
     * A session policy for your user so you can use the same IAM role across multiple users. This policy restricts user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include `${Transfer:UserName}` , `${Transfer:HomeDirectory}` , and `${Transfer:HomeBucket}` .
     *
     * > For session policies, AWS Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the `Policy` argument.
     * >
     * > For an example of a session policy, see [Example session policy](https://docs.aws.amazon.com/transfer/latest/userguide/session-policy.html) .
     * >
     * > For more information, see [AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) in the *AWS Security Token Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-policy
     */
    readonly policy?: string;

    /**
     * Specifies the full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems. The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-posixprofile
     */
    readonly posixProfile?: CfnUser.PosixProfileProperty | cdk.IResolvable;

    /**
     * Specifies the public key portion of the Secure Shell (SSH) keys stored for the described user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-sshpublickeys
     */
    readonly sshPublicKeys?: string[];

    /**
     * Key-value pairs that can be used to group and search for users. Tags are metadata attached to users for any purpose.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('homeDirectory', cdk.validateString)(properties.homeDirectory));
    errors.collect(cdk.propertyValidator('homeDirectoryMappings', cdk.listValidator(CfnUser_HomeDirectoryMapEntryPropertyValidator))(properties.homeDirectoryMappings));
    errors.collect(cdk.propertyValidator('homeDirectoryType', cdk.validateString)(properties.homeDirectoryType));
    errors.collect(cdk.propertyValidator('policy', cdk.validateString)(properties.policy));
    errors.collect(cdk.propertyValidator('posixProfile', CfnUser_PosixProfilePropertyValidator)(properties.posixProfile));
    errors.collect(cdk.propertyValidator('role', cdk.requiredValidator)(properties.role));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('serverId', cdk.requiredValidator)(properties.serverId));
    errors.collect(cdk.propertyValidator('serverId', cdk.validateString)(properties.serverId));
    errors.collect(cdk.propertyValidator('sshPublicKeys', cdk.listValidator(cdk.validateString))(properties.sshPublicKeys));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('userName', cdk.requiredValidator)(properties.userName));
    errors.collect(cdk.propertyValidator('userName', cdk.validateString)(properties.userName));
    return errors.wrap('supplied properties not correct for "CfnUserProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::User` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::User` resource.
 */
// @ts-ignore TS6133
function cfnUserPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserPropsValidator(properties).assertSuccess();
    return {
        Role: cdk.stringToCloudFormation(properties.role),
        ServerId: cdk.stringToCloudFormation(properties.serverId),
        UserName: cdk.stringToCloudFormation(properties.userName),
        HomeDirectory: cdk.stringToCloudFormation(properties.homeDirectory),
        HomeDirectoryMappings: cdk.listMapper(cfnUserHomeDirectoryMapEntryPropertyToCloudFormation)(properties.homeDirectoryMappings),
        HomeDirectoryType: cdk.stringToCloudFormation(properties.homeDirectoryType),
        Policy: cdk.stringToCloudFormation(properties.policy),
        PosixProfile: cfnUserPosixProfilePropertyToCloudFormation(properties.posixProfile),
        SshPublicKeys: cdk.listMapper(cdk.stringToCloudFormation)(properties.sshPublicKeys),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
    ret.addPropertyResult('role', 'Role', cfn_parse.FromCloudFormation.getString(properties.Role));
    ret.addPropertyResult('serverId', 'ServerId', cfn_parse.FromCloudFormation.getString(properties.ServerId));
    ret.addPropertyResult('userName', 'UserName', cfn_parse.FromCloudFormation.getString(properties.UserName));
    ret.addPropertyResult('homeDirectory', 'HomeDirectory', properties.HomeDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.HomeDirectory) : undefined);
    ret.addPropertyResult('homeDirectoryMappings', 'HomeDirectoryMappings', properties.HomeDirectoryMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnUserHomeDirectoryMapEntryPropertyFromCloudFormation)(properties.HomeDirectoryMappings) : undefined);
    ret.addPropertyResult('homeDirectoryType', 'HomeDirectoryType', properties.HomeDirectoryType != null ? cfn_parse.FromCloudFormation.getString(properties.HomeDirectoryType) : undefined);
    ret.addPropertyResult('policy', 'Policy', properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined);
    ret.addPropertyResult('posixProfile', 'PosixProfile', properties.PosixProfile != null ? CfnUserPosixProfilePropertyFromCloudFormation(properties.PosixProfile) : undefined);
    ret.addPropertyResult('sshPublicKeys', 'SshPublicKeys', properties.SshPublicKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SshPublicKeys) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::User`
 *
 * The `AWS::Transfer::User` resource creates a user and associates them with an existing server. You can only create and associate users with servers that have the `IdentityProviderType` set to `SERVICE_MANAGED` . Using parameters for `CreateUser` , you can specify the user name, set the home directory, store the user's public key, and assign the user's AWS Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
 *
 * @cloudformationResource AWS::Transfer::User
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::User";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUser(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name associated with the user, in the form `arn:aws:transfer:region: *account-id* :user/ *server-id* / *username*` .
     *
     * An example of a user ARN is: `arn:aws:transfer:us-east-1:123456789012:user/user1` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the server to which the user is attached.
     *
     * An example `ServerId` is `s-01234567890abcdef` .
     * @cloudformationAttribute ServerId
     */
    public readonly attrServerId: string;

    /**
     * A unique string that identifies a user account associated with a server.
     *
     * An example `UserName` is `transfer-user-1` .
     * @cloudformationAttribute UserName
     */
    public readonly attrUserName: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-role
     */
    public role: string;

    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-serverid
     */
    public serverId: string;

    /**
     * A unique string that identifies a user and is associated with a `ServerId` . This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-username
     */
    public userName: string;

    /**
     * The landing directory (folder) for a user when they log in to the server using the client.
     *
     * A `HomeDirectory` example is `/bucket_name/home/mydirectory` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectory
     */
    public homeDirectory: string | undefined;

    /**
     * Logical directory mappings that specify what Amazon S3 paths and keys should be visible to your user and how you want to make them visible. You will need to specify the " `Entry` " and " `Target` " pair, where `Entry` shows how the path is made visible and `Target` is the actual Amazon S3 path. If you only specify a target, it will be displayed as is. You will need to also make sure that your IAM role provides access to paths in `Target` . The following is an example.
     *
     * `'[ { "Entry": "/", "Target": "/bucket3/customized-reports/" } ]'`
     *
     * In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set `Entry` to '/' and set `Target` to the HomeDirectory parameter value.
     *
     * > If the target of a logical directory entry does not exist in Amazon S3, the entry will be ignored. As a workaround, you can use the Amazon S3 API to create 0 byte objects as place holders for your directory. If using the CLI, use the `s3api` call instead of `s3` so you can use the put-object operation. For example, you use the following: `AWS s3api put-object --bucket bucketname --key path/to/folder/` . Make sure that the end of the key name ends in a '/' for it to be considered a folder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorymappings
     */
    public homeDirectoryMappings: Array<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to `PATH` , the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it `LOGICAL` , you need to provide mappings in the `HomeDirectoryMappings` for how you want to make Amazon S3 or Amazon EFS paths visible to your users.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorytype
     */
    public homeDirectoryType: string | undefined;

    /**
     * A session policy for your user so you can use the same IAM role across multiple users. This policy restricts user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include `${Transfer:UserName}` , `${Transfer:HomeDirectory}` , and `${Transfer:HomeBucket}` .
     *
     * > For session policies, AWS Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the `Policy` argument.
     * >
     * > For an example of a session policy, see [Example session policy](https://docs.aws.amazon.com/transfer/latest/userguide/session-policy.html) .
     * >
     * > For more information, see [AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) in the *AWS Security Token Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-policy
     */
    public policy: string | undefined;

    /**
     * Specifies the full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems. The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-posixprofile
     */
    public posixProfile: CfnUser.PosixProfileProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the public key portion of the Secure Shell (SSH) keys stored for the described user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-sshpublickeys
     */
    public sshPublicKeys: string[] | undefined;

    /**
     * Key-value pairs that can be used to group and search for users. Tags are metadata attached to users for any purpose.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::User`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
        super(scope, id, { type: CfnUser.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'role', this);
        cdk.requireProperty(props, 'serverId', this);
        cdk.requireProperty(props, 'userName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrServerId = cdk.Token.asString(this.getAtt('ServerId', cdk.ResolutionTypeHint.STRING));
        this.attrUserName = cdk.Token.asString(this.getAtt('UserName', cdk.ResolutionTypeHint.STRING));

        this.role = props.role;
        this.serverId = props.serverId;
        this.userName = props.userName;
        this.homeDirectory = props.homeDirectory;
        this.homeDirectoryMappings = props.homeDirectoryMappings;
        this.homeDirectoryType = props.homeDirectoryType;
        this.policy = props.policy;
        this.posixProfile = props.posixProfile;
        this.sshPublicKeys = props.sshPublicKeys;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::User", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            role: this.role,
            serverId: this.serverId,
            userName: this.userName,
            homeDirectory: this.homeDirectory,
            homeDirectoryMappings: this.homeDirectoryMappings,
            homeDirectoryType: this.homeDirectoryType,
            policy: this.policy,
            posixProfile: this.posixProfile,
            sshPublicKeys: this.sshPublicKeys,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserPropsToCloudFormation(props);
    }
}

export namespace CfnUser {
    /**
     * Represents an object that contains entries and targets for `HomeDirectoryMappings` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html
     */
    export interface HomeDirectoryMapEntryProperty {
        /**
         * Represents an entry for `HomeDirectoryMappings` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html#cfn-transfer-user-homedirectorymapentry-entry
         */
        readonly entry: string;
        /**
         * Represents the map target that is used in a `HomeDirectorymapEntry` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html#cfn-transfer-user-homedirectorymapentry-target
         */
        readonly target: string;
    }
}

/**
 * Determine whether the given properties match those of a `HomeDirectoryMapEntryProperty`
 *
 * @param properties - the TypeScript properties of a `HomeDirectoryMapEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnUser_HomeDirectoryMapEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('entry', cdk.requiredValidator)(properties.entry));
    errors.collect(cdk.propertyValidator('entry', cdk.validateString)(properties.entry));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    return errors.wrap('supplied properties not correct for "HomeDirectoryMapEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::User.HomeDirectoryMapEntry` resource
 *
 * @param properties - the TypeScript properties of a `HomeDirectoryMapEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::User.HomeDirectoryMapEntry` resource.
 */
// @ts-ignore TS6133
function cfnUserHomeDirectoryMapEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUser_HomeDirectoryMapEntryPropertyValidator(properties).assertSuccess();
    return {
        Entry: cdk.stringToCloudFormation(properties.entry),
        Target: cdk.stringToCloudFormation(properties.target),
    };
}

// @ts-ignore TS6133
function CfnUserHomeDirectoryMapEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.HomeDirectoryMapEntryProperty>();
    ret.addPropertyResult('entry', 'Entry', cfn_parse.FromCloudFormation.getString(properties.Entry));
    ret.addPropertyResult('target', 'Target', cfn_parse.FromCloudFormation.getString(properties.Target));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnUser {
    /**
     * The full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon EFS file systems. The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html
     */
    export interface PosixProfileProperty {
        /**
         * The POSIX group ID used for all EFS operations by this user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-gid
         */
        readonly gid: number;
        /**
         * The secondary POSIX group IDs used for all EFS operations by this user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-secondarygids
         */
        readonly secondaryGids?: number[] | cdk.IResolvable;
        /**
         * The POSIX user ID used for all EFS operations by this user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-uid
         */
        readonly uid: number;
    }
}

/**
 * Determine whether the given properties match those of a `PosixProfileProperty`
 *
 * @param properties - the TypeScript properties of a `PosixProfileProperty`
 *
 * @returns the result of the validation.
 */
function CfnUser_PosixProfilePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gid', cdk.requiredValidator)(properties.gid));
    errors.collect(cdk.propertyValidator('gid', cdk.validateNumber)(properties.gid));
    errors.collect(cdk.propertyValidator('secondaryGids', cdk.listValidator(cdk.validateNumber))(properties.secondaryGids));
    errors.collect(cdk.propertyValidator('uid', cdk.requiredValidator)(properties.uid));
    errors.collect(cdk.propertyValidator('uid', cdk.validateNumber)(properties.uid));
    return errors.wrap('supplied properties not correct for "PosixProfileProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::User.PosixProfile` resource
 *
 * @param properties - the TypeScript properties of a `PosixProfileProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::User.PosixProfile` resource.
 */
// @ts-ignore TS6133
function cfnUserPosixProfilePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUser_PosixProfilePropertyValidator(properties).assertSuccess();
    return {
        Gid: cdk.numberToCloudFormation(properties.gid),
        SecondaryGids: cdk.listMapper(cdk.numberToCloudFormation)(properties.secondaryGids),
        Uid: cdk.numberToCloudFormation(properties.uid),
    };
}

// @ts-ignore TS6133
function CfnUserPosixProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.PosixProfileProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.PosixProfileProperty>();
    ret.addPropertyResult('gid', 'Gid', cfn_parse.FromCloudFormation.getNumber(properties.Gid));
    ret.addPropertyResult('secondaryGids', 'SecondaryGids', properties.SecondaryGids != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.SecondaryGids) : undefined);
    ret.addPropertyResult('uid', 'Uid', cfn_parse.FromCloudFormation.getNumber(properties.Uid));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWorkflow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html
 */
export interface CfnWorkflowProps {

    /**
     * Specifies the details for the steps that are in the specified workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-steps
     */
    readonly steps: Array<CfnWorkflow.WorkflowStepProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the text description for the workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-description
     */
    readonly description?: string;

    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-onexceptionsteps
     */
    readonly onExceptionSteps?: Array<CfnWorkflow.WorkflowStepProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Key-value pairs that can be used to group and search for workflows. Tags are metadata attached to workflows for any purpose.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the result of the validation.
 */
function CfnWorkflowPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('onExceptionSteps', cdk.listValidator(CfnWorkflow_WorkflowStepPropertyValidator))(properties.onExceptionSteps));
    errors.collect(cdk.propertyValidator('steps', cdk.requiredValidator)(properties.steps));
    errors.collect(cdk.propertyValidator('steps', cdk.listValidator(CfnWorkflow_WorkflowStepPropertyValidator))(properties.steps));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnWorkflowProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflowPropsValidator(properties).assertSuccess();
    return {
        Steps: cdk.listMapper(cfnWorkflowWorkflowStepPropertyToCloudFormation)(properties.steps),
        Description: cdk.stringToCloudFormation(properties.description),
        OnExceptionSteps: cdk.listMapper(cfnWorkflowWorkflowStepPropertyToCloudFormation)(properties.onExceptionSteps),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflowProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflowProps>();
    ret.addPropertyResult('steps', 'Steps', cfn_parse.FromCloudFormation.getArray(CfnWorkflowWorkflowStepPropertyFromCloudFormation)(properties.Steps));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('onExceptionSteps', 'OnExceptionSteps', properties.OnExceptionSteps != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkflowWorkflowStepPropertyFromCloudFormation)(properties.OnExceptionSteps) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Transfer::Workflow`
 *
 * Allows you to create a workflow with specified steps and step details the workflow invokes after file transfer completes. After creating a workflow, you can associate the workflow created with any transfer servers by specifying the `workflow-details` field in `CreateServer` and `UpdateServer` operations.
 *
 * @cloudformationResource AWS::Transfer::Workflow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html
 */
export class CfnWorkflow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Transfer::Workflow";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkflow {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWorkflowPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWorkflow(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * A unique identifier for a workflow.
     * @cloudformationAttribute WorkflowId
     */
    public readonly attrWorkflowId: string;

    /**
     * Specifies the details for the steps that are in the specified workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-steps
     */
    public steps: Array<CfnWorkflow.WorkflowStepProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the text description for the workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-description
     */
    public description: string | undefined;

    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-onexceptionsteps
     */
    public onExceptionSteps: Array<CfnWorkflow.WorkflowStepProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Key-value pairs that can be used to group and search for workflows. Tags are metadata attached to workflows for any purpose.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Transfer::Workflow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkflowProps) {
        super(scope, id, { type: CfnWorkflow.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'steps', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrWorkflowId = cdk.Token.asString(this.getAtt('WorkflowId', cdk.ResolutionTypeHint.STRING));

        this.steps = props.steps;
        this.description = props.description;
        this.onExceptionSteps = props.onExceptionSteps;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Workflow", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkflow.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            steps: this.steps,
            description: this.description,
            onExceptionSteps: this.onExceptionSteps,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkflowPropsToCloudFormation(props);
    }
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html
     */
    export interface CopyStepDetailsProperty {
        /**
         * `CfnWorkflow.CopyStepDetailsProperty.DestinationFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-destinationfilelocation
         */
        readonly destinationFileLocation?: CfnWorkflow.S3FileLocationProperty | cdk.IResolvable;
        /**
         * `CfnWorkflow.CopyStepDetailsProperty.Name`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-name
         */
        readonly name?: string;
        /**
         * `CfnWorkflow.CopyStepDetailsProperty.OverwriteExisting`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-overwriteexisting
         */
        readonly overwriteExisting?: string;
        /**
         * `CfnWorkflow.CopyStepDetailsProperty.SourceFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-sourcefilelocation
         */
        readonly sourceFileLocation?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CopyStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CopyStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_CopyStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationFileLocation', CfnWorkflow_S3FileLocationPropertyValidator)(properties.destinationFileLocation));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overwriteExisting', cdk.validateString)(properties.overwriteExisting));
    errors.collect(cdk.propertyValidator('sourceFileLocation', cdk.validateString)(properties.sourceFileLocation));
    return errors.wrap('supplied properties not correct for "CopyStepDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.CopyStepDetails` resource
 *
 * @param properties - the TypeScript properties of a `CopyStepDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.CopyStepDetails` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowCopyStepDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_CopyStepDetailsPropertyValidator(properties).assertSuccess();
    return {
        DestinationFileLocation: cfnWorkflowS3FileLocationPropertyToCloudFormation(properties.destinationFileLocation),
        Name: cdk.stringToCloudFormation(properties.name),
        OverwriteExisting: cdk.stringToCloudFormation(properties.overwriteExisting),
        SourceFileLocation: cdk.stringToCloudFormation(properties.sourceFileLocation),
    };
}

// @ts-ignore TS6133
function CfnWorkflowCopyStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.CopyStepDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.CopyStepDetailsProperty>();
    ret.addPropertyResult('destinationFileLocation', 'DestinationFileLocation', properties.DestinationFileLocation != null ? CfnWorkflowS3FileLocationPropertyFromCloudFormation(properties.DestinationFileLocation) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('overwriteExisting', 'OverwriteExisting', properties.OverwriteExisting != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteExisting) : undefined);
    ret.addPropertyResult('sourceFileLocation', 'SourceFileLocation', properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html
     */
    export interface CustomStepDetailsProperty {
        /**
         * `CfnWorkflow.CustomStepDetailsProperty.Name`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-name
         */
        readonly name?: string;
        /**
         * `CfnWorkflow.CustomStepDetailsProperty.SourceFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-sourcefilelocation
         */
        readonly sourceFileLocation?: string;
        /**
         * `CfnWorkflow.CustomStepDetailsProperty.Target`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-target
         */
        readonly target?: string;
        /**
         * `CfnWorkflow.CustomStepDetailsProperty.TimeoutSeconds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-timeoutseconds
         */
        readonly timeoutSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CustomStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_CustomStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sourceFileLocation', cdk.validateString)(properties.sourceFileLocation));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    errors.collect(cdk.propertyValidator('timeoutSeconds', cdk.validateNumber)(properties.timeoutSeconds));
    return errors.wrap('supplied properties not correct for "CustomStepDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.CustomStepDetails` resource
 *
 * @param properties - the TypeScript properties of a `CustomStepDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.CustomStepDetails` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowCustomStepDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_CustomStepDetailsPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SourceFileLocation: cdk.stringToCloudFormation(properties.sourceFileLocation),
        Target: cdk.stringToCloudFormation(properties.target),
        TimeoutSeconds: cdk.numberToCloudFormation(properties.timeoutSeconds),
    };
}

// @ts-ignore TS6133
function CfnWorkflowCustomStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.CustomStepDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.CustomStepDetailsProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sourceFileLocation', 'SourceFileLocation', properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined);
    ret.addPropertyResult('target', 'Target', properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined);
    ret.addPropertyResult('timeoutSeconds', 'TimeoutSeconds', properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html
     */
    export interface DecryptStepDetailsProperty {
        /**
         * `CfnWorkflow.DecryptStepDetailsProperty.DestinationFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-destinationfilelocation
         */
        readonly destinationFileLocation?: CfnWorkflow.InputFileLocationProperty | cdk.IResolvable;
        /**
         * `CfnWorkflow.DecryptStepDetailsProperty.Name`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-name
         */
        readonly name?: string;
        /**
         * `CfnWorkflow.DecryptStepDetailsProperty.OverwriteExisting`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-overwriteexisting
         */
        readonly overwriteExisting?: string;
        /**
         * `CfnWorkflow.DecryptStepDetailsProperty.SourceFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-sourcefilelocation
         */
        readonly sourceFileLocation?: string;
        /**
         * `CfnWorkflow.DecryptStepDetailsProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DecryptStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DecryptStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_DecryptStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationFileLocation', CfnWorkflow_InputFileLocationPropertyValidator)(properties.destinationFileLocation));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overwriteExisting', cdk.validateString)(properties.overwriteExisting));
    errors.collect(cdk.propertyValidator('sourceFileLocation', cdk.validateString)(properties.sourceFileLocation));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DecryptStepDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.DecryptStepDetails` resource
 *
 * @param properties - the TypeScript properties of a `DecryptStepDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.DecryptStepDetails` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowDecryptStepDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_DecryptStepDetailsPropertyValidator(properties).assertSuccess();
    return {
        DestinationFileLocation: cfnWorkflowInputFileLocationPropertyToCloudFormation(properties.destinationFileLocation),
        Name: cdk.stringToCloudFormation(properties.name),
        OverwriteExisting: cdk.stringToCloudFormation(properties.overwriteExisting),
        SourceFileLocation: cdk.stringToCloudFormation(properties.sourceFileLocation),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnWorkflowDecryptStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.DecryptStepDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.DecryptStepDetailsProperty>();
    ret.addPropertyResult('destinationFileLocation', 'DestinationFileLocation', properties.DestinationFileLocation != null ? CfnWorkflowInputFileLocationPropertyFromCloudFormation(properties.DestinationFileLocation) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('overwriteExisting', 'OverwriteExisting', properties.OverwriteExisting != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteExisting) : undefined);
    ret.addPropertyResult('sourceFileLocation', 'SourceFileLocation', properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html
     */
    export interface DeleteStepDetailsProperty {
        /**
         * `CfnWorkflow.DeleteStepDetailsProperty.Name`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html#cfn-transfer-workflow-deletestepdetails-name
         */
        readonly name?: string;
        /**
         * `CfnWorkflow.DeleteStepDetailsProperty.SourceFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html#cfn-transfer-workflow-deletestepdetails-sourcefilelocation
         */
        readonly sourceFileLocation?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeleteStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DeleteStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_DeleteStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sourceFileLocation', cdk.validateString)(properties.sourceFileLocation));
    return errors.wrap('supplied properties not correct for "DeleteStepDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.DeleteStepDetails` resource
 *
 * @param properties - the TypeScript properties of a `DeleteStepDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.DeleteStepDetails` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowDeleteStepDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_DeleteStepDetailsPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SourceFileLocation: cdk.stringToCloudFormation(properties.sourceFileLocation),
    };
}

// @ts-ignore TS6133
function CfnWorkflowDeleteStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.DeleteStepDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.DeleteStepDetailsProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sourceFileLocation', 'SourceFileLocation', properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html
     */
    export interface EfsInputFileLocationProperty {
        /**
         * `CfnWorkflow.EfsInputFileLocationProperty.FileSystemId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html#cfn-transfer-workflow-efsinputfilelocation-filesystemid
         */
        readonly fileSystemId?: string;
        /**
         * `CfnWorkflow.EfsInputFileLocationProperty.Path`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html#cfn-transfer-workflow-efsinputfilelocation-path
         */
        readonly path?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EfsInputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `EfsInputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_EfsInputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "EfsInputFileLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.EfsInputFileLocation` resource
 *
 * @param properties - the TypeScript properties of a `EfsInputFileLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.EfsInputFileLocation` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowEfsInputFileLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_EfsInputFileLocationPropertyValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnWorkflowEfsInputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.EfsInputFileLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.EfsInputFileLocationProperty>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html
     */
    export interface InputFileLocationProperty {
        /**
         * `CfnWorkflow.InputFileLocationProperty.EfsFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html#cfn-transfer-workflow-inputfilelocation-efsfilelocation
         */
        readonly efsFileLocation?: CfnWorkflow.EfsInputFileLocationProperty | cdk.IResolvable;
        /**
         * `CfnWorkflow.InputFileLocationProperty.S3FileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html#cfn-transfer-workflow-inputfilelocation-s3filelocation
         */
        readonly s3FileLocation?: CfnWorkflow.S3InputFileLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `InputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_InputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('efsFileLocation', CfnWorkflow_EfsInputFileLocationPropertyValidator)(properties.efsFileLocation));
    errors.collect(cdk.propertyValidator('s3FileLocation', CfnWorkflow_S3InputFileLocationPropertyValidator)(properties.s3FileLocation));
    return errors.wrap('supplied properties not correct for "InputFileLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.InputFileLocation` resource
 *
 * @param properties - the TypeScript properties of a `InputFileLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.InputFileLocation` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowInputFileLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_InputFileLocationPropertyValidator(properties).assertSuccess();
    return {
        EfsFileLocation: cfnWorkflowEfsInputFileLocationPropertyToCloudFormation(properties.efsFileLocation),
        S3FileLocation: cfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties.s3FileLocation),
    };
}

// @ts-ignore TS6133
function CfnWorkflowInputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.InputFileLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.InputFileLocationProperty>();
    ret.addPropertyResult('efsFileLocation', 'EfsFileLocation', properties.EfsFileLocation != null ? CfnWorkflowEfsInputFileLocationPropertyFromCloudFormation(properties.EfsFileLocation) : undefined);
    ret.addPropertyResult('s3FileLocation', 'S3FileLocation', properties.S3FileLocation != null ? CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties.S3FileLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3filelocation.html
     */
    export interface S3FileLocationProperty {
        /**
         * `CfnWorkflow.S3FileLocationProperty.S3FileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3filelocation.html#cfn-transfer-workflow-s3filelocation-s3filelocation
         */
        readonly s3FileLocation?: CfnWorkflow.S3InputFileLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3FileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3FileLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_S3FileLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3FileLocation', CfnWorkflow_S3InputFileLocationPropertyValidator)(properties.s3FileLocation));
    return errors.wrap('supplied properties not correct for "S3FileLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3FileLocation` resource
 *
 * @param properties - the TypeScript properties of a `S3FileLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3FileLocation` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowS3FileLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_S3FileLocationPropertyValidator(properties).assertSuccess();
    return {
        S3FileLocation: cfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties.s3FileLocation),
    };
}

// @ts-ignore TS6133
function CfnWorkflowS3FileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.S3FileLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3FileLocationProperty>();
    ret.addPropertyResult('s3FileLocation', 'S3FileLocation', properties.S3FileLocation != null ? CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties.S3FileLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html
     */
    export interface S3InputFileLocationProperty {
        /**
         * `CfnWorkflow.S3InputFileLocationProperty.Bucket`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html#cfn-transfer-workflow-s3inputfilelocation-bucket
         */
        readonly bucket?: string;
        /**
         * `CfnWorkflow.S3InputFileLocationProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html#cfn-transfer-workflow-s3inputfilelocation-key
         */
        readonly key?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3InputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3InputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_S3InputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    return errors.wrap('supplied properties not correct for "S3InputFileLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3InputFileLocation` resource
 *
 * @param properties - the TypeScript properties of a `S3InputFileLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3InputFileLocation` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_S3InputFileLocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
    };
}

// @ts-ignore TS6133
function CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.S3InputFileLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3InputFileLocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined);
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html
     */
    export interface S3TagProperty {
        /**
         * `CfnWorkflow.S3TagProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html#cfn-transfer-workflow-s3tag-key
         */
        readonly key: string;
        /**
         * `CfnWorkflow.S3TagProperty.Value`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html#cfn-transfer-workflow-s3tag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3TagProperty`
 *
 * @param properties - the TypeScript properties of a `S3TagProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_S3TagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "S3TagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3Tag` resource
 *
 * @param properties - the TypeScript properties of a `S3TagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.S3Tag` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowS3TagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_S3TagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnWorkflowS3TagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.S3TagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3TagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html
     */
    export interface TagStepDetailsProperty {
        /**
         * `CfnWorkflow.TagStepDetailsProperty.Name`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-name
         */
        readonly name?: string;
        /**
         * `CfnWorkflow.TagStepDetailsProperty.SourceFileLocation`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-sourcefilelocation
         */
        readonly sourceFileLocation?: string;
        /**
         * `CfnWorkflow.TagStepDetailsProperty.Tags`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-tags
         */
        readonly tags?: CfnWorkflow.S3TagProperty[];
    }
}

/**
 * Determine whether the given properties match those of a `TagStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `TagStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_TagStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sourceFileLocation', cdk.validateString)(properties.sourceFileLocation));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnWorkflow_S3TagPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "TagStepDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.TagStepDetails` resource
 *
 * @param properties - the TypeScript properties of a `TagStepDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.TagStepDetails` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowTagStepDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_TagStepDetailsPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SourceFileLocation: cdk.stringToCloudFormation(properties.sourceFileLocation),
        Tags: cdk.listMapper(cfnWorkflowS3TagPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnWorkflowTagStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.TagStepDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.TagStepDetailsProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sourceFileLocation', 'SourceFileLocation', properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkflowS3TagPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkflow {
    /**
     * The basic building block of a workflow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html
     */
    export interface WorkflowStepProperty {
        /**
         * Details for a step that performs a file copy.
         *
         * Consists of the following values:
         *
         * - A description
         * - An Amazon S3 location for the destination of the file copy.
         * - A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-copystepdetails
         */
        readonly copyStepDetails?: any | cdk.IResolvable;
        /**
         * Details for a step that invokes an AWS Lambda function.
         *
         * Consists of the Lambda function's name, target, and timeout (in seconds).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-customstepdetails
         */
        readonly customStepDetails?: any | cdk.IResolvable;
        /**
         * `CfnWorkflow.WorkflowStepProperty.DecryptStepDetails`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-decryptstepdetails
         */
        readonly decryptStepDetails?: CfnWorkflow.DecryptStepDetailsProperty | cdk.IResolvable;
        /**
         * Details for a step that deletes the file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-deletestepdetails
         */
        readonly deleteStepDetails?: any | cdk.IResolvable;
        /**
         * Details for a step that creates one or more tags.
         *
         * You specify one or more tags. Each tag contains a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-tagstepdetails
         */
        readonly tagStepDetails?: any | cdk.IResolvable;
        /**
         * Currently, the following step types are supported.
         *
         * - *`COPY`* - Copy the file to another location.
         * - *`CUSTOM`* - Perform a custom step with an AWS Lambda function target.
         * - *`DECRYPT`* - Decrypt a file that was encrypted before it was uploaded.
         * - *`DELETE`* - Delete the file.
         * - *`TAG`* - Add a tag to the file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WorkflowStepProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowStepProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkflow_WorkflowStepPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyStepDetails', cdk.validateObject)(properties.copyStepDetails));
    errors.collect(cdk.propertyValidator('customStepDetails', cdk.validateObject)(properties.customStepDetails));
    errors.collect(cdk.propertyValidator('decryptStepDetails', CfnWorkflow_DecryptStepDetailsPropertyValidator)(properties.decryptStepDetails));
    errors.collect(cdk.propertyValidator('deleteStepDetails', cdk.validateObject)(properties.deleteStepDetails));
    errors.collect(cdk.propertyValidator('tagStepDetails', cdk.validateObject)(properties.tagStepDetails));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "WorkflowStepProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Transfer::Workflow.WorkflowStep` resource
 *
 * @param properties - the TypeScript properties of a `WorkflowStepProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Transfer::Workflow.WorkflowStep` resource.
 */
// @ts-ignore TS6133
function cfnWorkflowWorkflowStepPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkflow_WorkflowStepPropertyValidator(properties).assertSuccess();
    return {
        CopyStepDetails: cdk.objectToCloudFormation(properties.copyStepDetails),
        CustomStepDetails: cdk.objectToCloudFormation(properties.customStepDetails),
        DecryptStepDetails: cfnWorkflowDecryptStepDetailsPropertyToCloudFormation(properties.decryptStepDetails),
        DeleteStepDetails: cdk.objectToCloudFormation(properties.deleteStepDetails),
        TagStepDetails: cdk.objectToCloudFormation(properties.tagStepDetails),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnWorkflowWorkflowStepPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.WorkflowStepProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.WorkflowStepProperty>();
    ret.addPropertyResult('copyStepDetails', 'CopyStepDetails', properties.CopyStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.CopyStepDetails) : undefined);
    ret.addPropertyResult('customStepDetails', 'CustomStepDetails', properties.CustomStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomStepDetails) : undefined);
    ret.addPropertyResult('decryptStepDetails', 'DecryptStepDetails', properties.DecryptStepDetails != null ? CfnWorkflowDecryptStepDetailsPropertyFromCloudFormation(properties.DecryptStepDetails) : undefined);
    ret.addPropertyResult('deleteStepDetails', 'DeleteStepDetails', properties.DeleteStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.DeleteStepDetails) : undefined);
    ret.addPropertyResult('tagStepDetails', 'TagStepDetails', properties.TagStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.TagStepDetails) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
