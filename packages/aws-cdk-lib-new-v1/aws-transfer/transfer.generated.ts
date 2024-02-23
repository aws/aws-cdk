/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an agreement.
 *
 * An agreement is a bilateral trading partner agreement, or partnership, between an AWS Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes.
 *
 * The partner is identified with the `PartnerProfileId` , and the AS2 process is identified with the `LocalProfileId` .
 *
 * @cloudformationResource AWS::Transfer::Agreement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html
 */
export class CfnAgreement extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Agreement";

  /**
   * Build a CfnAgreement from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAgreement(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the AS2 agreement, returned after the API call succeeds.
   *
   * @cloudformationAttribute AgreementId
   */
  public readonly attrAgreementId: string;

  /**
   * Specifies the unique Amazon Resource Name (ARN) for the agreement.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Connectors are used to send files using either the AS2 or SFTP protocol.
   */
  public accessRole: string;

  /**
   * The landing directory (folder) for files that are transferred by using the AS2 protocol.
   */
  public baseDirectory: string;

  /**
   * The name or short description that's used to identify the agreement.
   */
  public description?: string;

  /**
   * A unique identifier for the AS2 local profile.
   */
  public localProfileId: string;

  /**
   * A unique identifier for the partner profile used in the agreement.
   */
  public partnerProfileId: string;

  /**
   * A system-assigned unique identifier for a server instance.
   */
  public serverId: string;

  /**
   * The current status of the agreement, either `ACTIVE` or `INACTIVE` .
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for agreements.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAgreementProps) {
    super(scope, id, {
      "type": CfnAgreement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessRole", this);
    cdk.requireProperty(props, "baseDirectory", this);
    cdk.requireProperty(props, "localProfileId", this);
    cdk.requireProperty(props, "partnerProfileId", this);
    cdk.requireProperty(props, "serverId", this);

    this.attrAgreementId = cdk.Token.asString(this.getAtt("AgreementId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.accessRole = props.accessRole;
    this.baseDirectory = props.baseDirectory;
    this.description = props.description;
    this.localProfileId = props.localProfileId;
    this.partnerProfileId = props.partnerProfileId;
    this.serverId = props.serverId;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Agreement", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessRole": this.accessRole,
      "baseDirectory": this.baseDirectory,
      "description": this.description,
      "localProfileId": this.localProfileId,
      "partnerProfileId": this.partnerProfileId,
      "serverId": this.serverId,
      "status": this.status,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAgreement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAgreementPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAgreement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html
 */
export interface CfnAgreementProps {
  /**
   * Connectors are used to send files using either the AS2 or SFTP protocol.
   *
   * For the access role, provide the Amazon Resource Name (ARN) of the AWS Identity and Access Management role to use.
   *
   * *For AS2 connectors*
   *
   * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
   *
   * If you are using Basic authentication for your AS2 connector, the access role requires the `secretsmanager:GetSecretValue` permission for the secret. If the secret is encrypted using a customer-managed key instead of the AWS managed key in Secrets Manager, then the role also needs the `kms:Decrypt` permission for that key.
   *
   * *For SFTP connectors*
   *
   * Make sure that the access role provides read and write access to the parent directory of the file location that's used in the `StartFileTransfer` request. Additionally, make sure that the role provides `secretsmanager:GetSecretValue` permission to AWS Secrets Manager .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-accessrole
   */
  readonly accessRole: string;

  /**
   * The landing directory (folder) for files that are transferred by using the AS2 protocol.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-basedirectory
   */
  readonly baseDirectory: string;

  /**
   * The name or short description that's used to identify the agreement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-description
   */
  readonly description?: string;

  /**
   * A unique identifier for the AS2 local profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-localprofileid
   */
  readonly localProfileId: string;

  /**
   * A unique identifier for the partner profile used in the agreement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-partnerprofileid
   */
  readonly partnerProfileId: string;

  /**
   * A system-assigned unique identifier for a server instance.
   *
   * This identifier indicates the specific server that the agreement uses.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-serverid
   */
  readonly serverId: string;

  /**
   * The current status of the agreement, either `ACTIVE` or `INACTIVE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-status
   */
  readonly status?: string;

  /**
   * Key-value pairs that can be used to group and search for agreements.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-agreement.html#cfn-transfer-agreement-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAgreementProps`
 *
 * @param properties - the TypeScript properties of a `CfnAgreementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAgreementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessRole", cdk.requiredValidator)(properties.accessRole));
  errors.collect(cdk.propertyValidator("accessRole", cdk.validateString)(properties.accessRole));
  errors.collect(cdk.propertyValidator("baseDirectory", cdk.requiredValidator)(properties.baseDirectory));
  errors.collect(cdk.propertyValidator("baseDirectory", cdk.validateString)(properties.baseDirectory));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("localProfileId", cdk.requiredValidator)(properties.localProfileId));
  errors.collect(cdk.propertyValidator("localProfileId", cdk.validateString)(properties.localProfileId));
  errors.collect(cdk.propertyValidator("partnerProfileId", cdk.requiredValidator)(properties.partnerProfileId));
  errors.collect(cdk.propertyValidator("partnerProfileId", cdk.validateString)(properties.partnerProfileId));
  errors.collect(cdk.propertyValidator("serverId", cdk.requiredValidator)(properties.serverId));
  errors.collect(cdk.propertyValidator("serverId", cdk.validateString)(properties.serverId));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAgreementProps\"");
}

// @ts-ignore TS6133
function convertCfnAgreementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAgreementPropsValidator(properties).assertSuccess();
  return {
    "AccessRole": cdk.stringToCloudFormation(properties.accessRole),
    "BaseDirectory": cdk.stringToCloudFormation(properties.baseDirectory),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LocalProfileId": cdk.stringToCloudFormation(properties.localProfileId),
    "PartnerProfileId": cdk.stringToCloudFormation(properties.partnerProfileId),
    "ServerId": cdk.stringToCloudFormation(properties.serverId),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAgreementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAgreementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAgreementProps>();
  ret.addPropertyResult("accessRole", "AccessRole", (properties.AccessRole != null ? cfn_parse.FromCloudFormation.getString(properties.AccessRole) : undefined));
  ret.addPropertyResult("baseDirectory", "BaseDirectory", (properties.BaseDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.BaseDirectory) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("localProfileId", "LocalProfileId", (properties.LocalProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.LocalProfileId) : undefined));
  ret.addPropertyResult("partnerProfileId", "PartnerProfileId", (properties.PartnerProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerProfileId) : undefined));
  ret.addPropertyResult("serverId", "ServerId", (properties.ServerId != null ? cfn_parse.FromCloudFormation.getString(properties.ServerId) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Imports the signing and encryption certificates that you need to create local (AS2) profiles and partner profiles.
 *
 * @cloudformationResource AWS::Transfer::Certificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Certificate";

  /**
   * Build a CfnCertificate from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique Amazon Resource Name (ARN) for the certificate.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
   *
   * @cloudformationAttribute CertificateId
   */
  public readonly attrCertificateId: string;

  /**
   * The final date that the certificate is valid.
   *
   * @cloudformationAttribute NotAfterDate
   */
  public readonly attrNotAfterDate: string;

  /**
   * The earliest date that the certificate is valid.
   *
   * @cloudformationAttribute NotBeforeDate
   */
  public readonly attrNotBeforeDate: string;

  /**
   * The serial number for the certificate.
   *
   * @cloudformationAttribute Serial
   */
  public readonly attrSerial: string;

  /**
   * The certificate can be either `ACTIVE` , `PENDING_ROTATION` , or `INACTIVE` . `PENDING_ROTATION` means that this certificate will replace the current certificate when it expires.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * If a private key has been specified for the certificate, its type is `CERTIFICATE_WITH_PRIVATE_KEY` . If there is no private key, the type is `CERTIFICATE` .
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  /**
   * An optional date that specifies when the certificate becomes active.
   */
  public activeDate?: string;

  /**
   * The file name for the certificate.
   */
  public certificate: string;

  /**
   * The list of certificates that make up the chain for the certificate.
   */
  public certificateChain?: string;

  /**
   * The name or description that's used to identity the certificate.
   */
  public description?: string;

  /**
   * An optional date that specifies when the certificate becomes inactive.
   */
  public inactiveDate?: string;

  /**
   * The file that contains the private key for the certificate that's being imported.
   */
  public privateKey?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for certificates.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies whether this certificate is used for signing or encryption.
   */
  public usage: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
    super(scope, id, {
      "type": CfnCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificate", this);
    cdk.requireProperty(props, "usage", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCertificateId = cdk.Token.asString(this.getAtt("CertificateId", cdk.ResolutionTypeHint.STRING));
    this.attrNotAfterDate = cdk.Token.asString(this.getAtt("NotAfterDate", cdk.ResolutionTypeHint.STRING));
    this.attrNotBeforeDate = cdk.Token.asString(this.getAtt("NotBeforeDate", cdk.ResolutionTypeHint.STRING));
    this.attrSerial = cdk.Token.asString(this.getAtt("Serial", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.activeDate = props.activeDate;
    this.certificate = props.certificate;
    this.certificateChain = props.certificateChain;
    this.description = props.description;
    this.inactiveDate = props.inactiveDate;
    this.privateKey = props.privateKey;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Certificate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.usage = props.usage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "activeDate": this.activeDate,
      "certificate": this.certificate,
      "certificateChain": this.certificateChain,
      "description": this.description,
      "inactiveDate": this.inactiveDate,
      "privateKey": this.privateKey,
      "tags": this.tags.renderTags(),
      "usage": this.usage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html
 */
export interface CfnCertificateProps {
  /**
   * An optional date that specifies when the certificate becomes active.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-activedate
   */
  readonly activeDate?: string;

  /**
   * The file name for the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificate
   */
  readonly certificate: string;

  /**
   * The list of certificates that make up the chain for the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-certificatechain
   */
  readonly certificateChain?: string;

  /**
   * The name or description that's used to identity the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-description
   */
  readonly description?: string;

  /**
   * An optional date that specifies when the certificate becomes inactive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-inactivedate
   */
  readonly inactiveDate?: string;

  /**
   * The file that contains the private key for the certificate that's being imported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-privatekey
   */
  readonly privateKey?: string;

  /**
   * Key-value pairs that can be used to group and search for certificates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies whether this certificate is used for signing or encryption.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-certificate.html#cfn-transfer-certificate-usage
   */
  readonly usage: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeDate", cdk.validateString)(properties.activeDate));
  errors.collect(cdk.propertyValidator("certificate", cdk.requiredValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inactiveDate", cdk.validateString)(properties.inactiveDate));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("usage", cdk.requiredValidator)(properties.usage));
  errors.collect(cdk.propertyValidator("usage", cdk.validateString)(properties.usage));
  return errors.wrap("supplied properties not correct for \"CfnCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCertificatePropsValidator(properties).assertSuccess();
  return {
    "ActiveDate": cdk.stringToCloudFormation(properties.activeDate),
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InactiveDate": cdk.stringToCloudFormation(properties.inactiveDate),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Usage": cdk.stringToCloudFormation(properties.usage)
  };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
  ret.addPropertyResult("activeDate", "ActiveDate", (properties.ActiveDate != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveDate) : undefined));
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("certificateChain", "CertificateChain", (properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inactiveDate", "InactiveDate", (properties.InactiveDate != null ? cfn_parse.FromCloudFormation.getString(properties.InactiveDate) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("usage", "Usage", (properties.Usage != null ? cfn_parse.FromCloudFormation.getString(properties.Usage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates the connector, which captures the parameters for a connection for the AS2 or SFTP protocol.
 *
 * For AS2, the connector is required for sending files to an externally hosted AS2 server. For SFTP, the connector is required when sending files to an SFTP server or receiving files from an SFTP server. For more details about connectors, see [Configure AS2 connectors](https://docs.aws.amazon.com/transfer/latest/userguide/configure-as2-connector.html) and [Create SFTP connectors](https://docs.aws.amazon.com/transfer/latest/userguide/configure-sftp-connector.html) .
 *
 * > You must specify exactly one configuration object: either for AS2 ( `As2Config` ) or SFTP ( `SftpConfig` ).
 *
 * @cloudformationResource AWS::Transfer::Connector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Connector";

  /**
   * Build a CfnConnector from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies the unique Amazon Resource Name (ARN) for the connector.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A unique identifier for the connector.
   *
   * @cloudformationAttribute ConnectorId
   */
  public readonly attrConnectorId: string;

  /**
   * Connectors are used to send files using either the AS2 or SFTP protocol.
   */
  public accessRole: string;

  /**
   * A structure that contains the parameters for an AS2 connector object.
   */
  public as2Config?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events.
   */
  public loggingRole?: string;

  /**
   * A structure that contains the parameters for an SFTP connector object.
   */
  public sftpConfig?: cdk.IResolvable | CfnConnector.SftpConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for connectors.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The URL of the partner's AS2 or SFTP endpoint.
   */
  public url: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
    super(scope, id, {
      "type": CfnConnector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessRole", this);
    cdk.requireProperty(props, "url", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrConnectorId = cdk.Token.asString(this.getAtt("ConnectorId", cdk.ResolutionTypeHint.STRING));
    this.accessRole = props.accessRole;
    this.as2Config = props.as2Config;
    this.loggingRole = props.loggingRole;
    this.sftpConfig = props.sftpConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Connector", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.url = props.url;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessRole": this.accessRole,
      "as2Config": this.as2Config,
      "loggingRole": this.loggingRole,
      "sftpConfig": this.sftpConfig,
      "tags": this.tags.renderTags(),
      "url": this.url
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorPropsToCloudFormation(props);
  }
}

export namespace CfnConnector {
  /**
   * A structure that contains the parameters for an AS2 connector object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html
   */
  export interface As2ConfigProperty {
    /**
     * Provides Basic authentication support to the AS2 Connectors API.
     *
     * To use Basic authentication, you must provide the name or Amazon Resource Name (ARN) of a secret in AWS Secrets Manager .
     *
     * The default value for this parameter is `null` , which indicates that Basic authentication is not enabled for the connector.
     *
     * If the connector should use Basic authentication, the secret needs to be in the following format:
     *
     * `{ "Username": "user-name", "Password": "user-password" }`
     *
     * Replace `user-name` and `user-password` with the credentials for the actual user that is being authenticated.
     *
     * Note the following:
     *
     * - You are storing these credentials in Secrets Manager, *not passing them directly* into this API.
     * - If you are using the API, SDKs, or CloudFormation to configure your connector, then you must create the secret before you can enable Basic authentication. However, if you are using the AWS management console, you can have the system create the secret for you.
     *
     * If you have previously enabled Basic authentication for a connector, you can disable it by using the `UpdateConnector` API call. For example, if you are using the CLI, you can run the following command to remove Basic authentication:
     *
     * `update-connector --connector-id my-connector-id --as2-config 'BasicAuthSecretId=""'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-basicauthsecretid
     */
    readonly basicAuthSecretId?: string;

    /**
     * Specifies whether the AS2 file is compressed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-compression
     */
    readonly compression?: string;

    /**
     * The algorithm that is used to encrypt the file.
     *
     * > You can only specify `NONE` if the URL for your connector uses HTTPS. This ensures that no traffic is sent in clear text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-encryptionalgorithm
     */
    readonly encryptionAlgorithm?: string;

    /**
     * A unique identifier for the AS2 local profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-localprofileid
     */
    readonly localProfileId?: string;

    /**
     * Used for outbound requests (from an AWS Transfer Family server to a partner AS2 server) to determine whether the partner response for transfers is synchronous or asynchronous.
     *
     * Specify either of the following values:
     *
     * - `SYNC` : The system expects a synchronous MDN response, confirming that the file was transferred successfully (or not).
     * - `NONE` : Specifies that no MDN response is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-mdnresponse
     */
    readonly mdnResponse?: string;

    /**
     * The signing algorithm for the MDN response.
     *
     * > If set to DEFAULT (or not set at all), the value for `SigningAlgorithm` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-mdnsigningalgorithm
     */
    readonly mdnSigningAlgorithm?: string;

    /**
     * Used as the `Subject` HTTP header attribute in AS2 messages that are being sent with the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-messagesubject
     */
    readonly messageSubject?: string;

    /**
     * A unique identifier for the partner profile for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-partnerprofileid
     */
    readonly partnerProfileId?: string;

    /**
     * The algorithm that is used to sign the AS2 messages sent with the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-as2config.html#cfn-transfer-connector-as2config-signingalgorithm
     */
    readonly signingAlgorithm?: string;
  }

  /**
   * A structure that contains the parameters for an SFTP connector object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-sftpconfig.html
   */
  export interface SftpConfigProperty {
    /**
     * The public portion of the host key, or keys, that are used to identify the external server to which you are connecting.
     *
     * You can use the `ssh-keyscan` command against the SFTP server to retrieve the necessary key.
     *
     * The three standard SSH public key format elements are `<key type>` , `<body base64>` , and an optional `<comment>` , with spaces between each element. Specify only the `<key type>` and `<body base64>` : do not enter the `<comment>` portion of the key.
     *
     * For the trusted host key, AWS Transfer Family accepts RSA and ECDSA keys.
     *
     * - For RSA keys, the `<key type>` string is `ssh-rsa` .
     * - For ECDSA keys, the `<key type>` string is either `ecdsa-sha2-nistp256` , `ecdsa-sha2-nistp384` , or `ecdsa-sha2-nistp521` , depending on the size of the key you generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-sftpconfig.html#cfn-transfer-connector-sftpconfig-trustedhostkeys
     */
    readonly trustedHostKeys?: Array<string>;

    /**
     * The identifier for the secret (in AWS Secrets Manager) that contains the SFTP user's private key, password, or both.
     *
     * The identifier must be the Amazon Resource Name (ARN) of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-connector-sftpconfig.html#cfn-transfer-connector-sftpconfig-usersecretid
     */
    readonly userSecretId?: string;
  }
}

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html
 */
export interface CfnConnectorProps {
  /**
   * Connectors are used to send files using either the AS2 or SFTP protocol.
   *
   * For the access role, provide the Amazon Resource Name (ARN) of the AWS Identity and Access Management role to use.
   *
   * *For AS2 connectors*
   *
   * With AS2, you can send files by calling `StartFileTransfer` and specifying the file paths in the request parameter, `SendFilePaths` . We use the file’s parent directory (for example, for `--send-file-paths /bucket/dir/file.txt` , parent directory is `/bucket/dir/` ) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the `AccessRole` needs to provide read and write access to the parent directory of the file location used in the `StartFileTransfer` request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with `StartFileTransfer` .
   *
   * If you are using Basic authentication for your AS2 connector, the access role requires the `secretsmanager:GetSecretValue` permission for the secret. If the secret is encrypted using a customer-managed key instead of the AWS managed key in Secrets Manager, then the role also needs the `kms:Decrypt` permission for that key.
   *
   * *For SFTP connectors*
   *
   * Make sure that the access role provides read and write access to the parent directory of the file location that's used in the `StartFileTransfer` request. Additionally, make sure that the role provides `secretsmanager:GetSecretValue` permission to AWS Secrets Manager .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-accessrole
   */
  readonly accessRole: string;

  /**
   * A structure that contains the parameters for an AS2 connector object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-as2config
   */
  readonly as2Config?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events.
   *
   * When set, you can view connector activity in your CloudWatch logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-loggingrole
   */
  readonly loggingRole?: string;

  /**
   * A structure that contains the parameters for an SFTP connector object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-sftpconfig
   */
  readonly sftpConfig?: cdk.IResolvable | CfnConnector.SftpConfigProperty;

  /**
   * Key-value pairs that can be used to group and search for connectors.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The URL of the partner's AS2 or SFTP endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-connector.html#cfn-transfer-connector-url
   */
  readonly url: string;
}

/**
 * Determine whether the given properties match those of a `As2ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `As2ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorAs2ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basicAuthSecretId", cdk.validateString)(properties.basicAuthSecretId));
  errors.collect(cdk.propertyValidator("compression", cdk.validateString)(properties.compression));
  errors.collect(cdk.propertyValidator("encryptionAlgorithm", cdk.validateString)(properties.encryptionAlgorithm));
  errors.collect(cdk.propertyValidator("localProfileId", cdk.validateString)(properties.localProfileId));
  errors.collect(cdk.propertyValidator("mdnResponse", cdk.validateString)(properties.mdnResponse));
  errors.collect(cdk.propertyValidator("mdnSigningAlgorithm", cdk.validateString)(properties.mdnSigningAlgorithm));
  errors.collect(cdk.propertyValidator("messageSubject", cdk.validateString)(properties.messageSubject));
  errors.collect(cdk.propertyValidator("partnerProfileId", cdk.validateString)(properties.partnerProfileId));
  errors.collect(cdk.propertyValidator("signingAlgorithm", cdk.validateString)(properties.signingAlgorithm));
  return errors.wrap("supplied properties not correct for \"As2ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorAs2ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorAs2ConfigPropertyValidator(properties).assertSuccess();
  return {
    "BasicAuthSecretId": cdk.stringToCloudFormation(properties.basicAuthSecretId),
    "Compression": cdk.stringToCloudFormation(properties.compression),
    "EncryptionAlgorithm": cdk.stringToCloudFormation(properties.encryptionAlgorithm),
    "LocalProfileId": cdk.stringToCloudFormation(properties.localProfileId),
    "MdnResponse": cdk.stringToCloudFormation(properties.mdnResponse),
    "MdnSigningAlgorithm": cdk.stringToCloudFormation(properties.mdnSigningAlgorithm),
    "MessageSubject": cdk.stringToCloudFormation(properties.messageSubject),
    "PartnerProfileId": cdk.stringToCloudFormation(properties.partnerProfileId),
    "SigningAlgorithm": cdk.stringToCloudFormation(properties.signingAlgorithm)
  };
}

// @ts-ignore TS6133
function CfnConnectorAs2ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.As2ConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.As2ConfigProperty>();
  ret.addPropertyResult("basicAuthSecretId", "BasicAuthSecretId", (properties.BasicAuthSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.BasicAuthSecretId) : undefined));
  ret.addPropertyResult("compression", "Compression", (properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined));
  ret.addPropertyResult("encryptionAlgorithm", "EncryptionAlgorithm", (properties.EncryptionAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionAlgorithm) : undefined));
  ret.addPropertyResult("localProfileId", "LocalProfileId", (properties.LocalProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.LocalProfileId) : undefined));
  ret.addPropertyResult("mdnResponse", "MdnResponse", (properties.MdnResponse != null ? cfn_parse.FromCloudFormation.getString(properties.MdnResponse) : undefined));
  ret.addPropertyResult("mdnSigningAlgorithm", "MdnSigningAlgorithm", (properties.MdnSigningAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.MdnSigningAlgorithm) : undefined));
  ret.addPropertyResult("messageSubject", "MessageSubject", (properties.MessageSubject != null ? cfn_parse.FromCloudFormation.getString(properties.MessageSubject) : undefined));
  ret.addPropertyResult("partnerProfileId", "PartnerProfileId", (properties.PartnerProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerProfileId) : undefined));
  ret.addPropertyResult("signingAlgorithm", "SigningAlgorithm", (properties.SigningAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.SigningAlgorithm) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SftpConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SftpConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorSftpConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("trustedHostKeys", cdk.listValidator(cdk.validateString))(properties.trustedHostKeys));
  errors.collect(cdk.propertyValidator("userSecretId", cdk.validateString)(properties.userSecretId));
  return errors.wrap("supplied properties not correct for \"SftpConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorSftpConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorSftpConfigPropertyValidator(properties).assertSuccess();
  return {
    "TrustedHostKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedHostKeys),
    "UserSecretId": cdk.stringToCloudFormation(properties.userSecretId)
  };
}

// @ts-ignore TS6133
function CfnConnectorSftpConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.SftpConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.SftpConfigProperty>();
  ret.addPropertyResult("trustedHostKeys", "TrustedHostKeys", (properties.TrustedHostKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedHostKeys) : undefined));
  ret.addPropertyResult("userSecretId", "UserSecretId", (properties.UserSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.UserSecretId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessRole", cdk.requiredValidator)(properties.accessRole));
  errors.collect(cdk.propertyValidator("accessRole", cdk.validateString)(properties.accessRole));
  errors.collect(cdk.propertyValidator("as2Config", cdk.validateObject)(properties.as2Config));
  errors.collect(cdk.propertyValidator("loggingRole", cdk.validateString)(properties.loggingRole));
  errors.collect(cdk.propertyValidator("sftpConfig", CfnConnectorSftpConfigPropertyValidator)(properties.sftpConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"CfnConnectorProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorPropsValidator(properties).assertSuccess();
  return {
    "AccessRole": cdk.stringToCloudFormation(properties.accessRole),
    "As2Config": cdk.objectToCloudFormation(properties.as2Config),
    "LoggingRole": cdk.stringToCloudFormation(properties.loggingRole),
    "SftpConfig": convertCfnConnectorSftpConfigPropertyToCloudFormation(properties.sftpConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
  ret.addPropertyResult("accessRole", "AccessRole", (properties.AccessRole != null ? cfn_parse.FromCloudFormation.getString(properties.AccessRole) : undefined));
  ret.addPropertyResult("as2Config", "As2Config", (properties.As2Config != null ? cfn_parse.FromCloudFormation.getAny(properties.As2Config) : undefined));
  ret.addPropertyResult("loggingRole", "LoggingRole", (properties.LoggingRole != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingRole) : undefined));
  ret.addPropertyResult("sftpConfig", "SftpConfig", (properties.SftpConfig != null ? CfnConnectorSftpConfigPropertyFromCloudFormation(properties.SftpConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates the local or partner profile to use for AS2 transfers.
 *
 * @cloudformationResource AWS::Transfer::Profile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html
 */
export class CfnProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Profile";

  /**
   * Build a CfnProfile from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name associated with the profile, in the form `arn:aws:transfer:region:account-id:profile/profile-id/` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the AS2 profile, returned after the API call succeeds.
   *
   * @cloudformationAttribute ProfileId
   */
  public readonly attrProfileId: string;

  /**
   * The `As2Id` is the *AS2-name* , as defined in the [RFC 4130](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc4130) . For inbound transfers, this is the `AS2-From` header for the AS2 messages sent from the partner. For outbound connectors, this is the `AS2-To` header for the AS2 messages sent to the partner using the `StartFileTransfer` API operation. This ID cannot include spaces.
   */
  public as2Id: string;

  /**
   * An array of identifiers for the imported certificates.
   */
  public certificateIds?: Array<string>;

  /**
   * Indicates whether to list only `LOCAL` type profiles or only `PARTNER` type profiles.
   */
  public profileType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for profiles.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProfileProps) {
    super(scope, id, {
      "type": CfnProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "as2Id", this);
    cdk.requireProperty(props, "profileType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrProfileId = cdk.Token.asString(this.getAtt("ProfileId", cdk.ResolutionTypeHint.STRING));
    this.as2Id = props.as2Id;
    this.certificateIds = props.certificateIds;
    this.profileType = props.profileType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Profile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "as2Id": this.as2Id,
      "certificateIds": this.certificateIds,
      "profileType": this.profileType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html
 */
export interface CfnProfileProps {
  /**
   * The `As2Id` is the *AS2-name* , as defined in the [RFC 4130](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc4130) . For inbound transfers, this is the `AS2-From` header for the AS2 messages sent from the partner. For outbound connectors, this is the `AS2-To` header for the AS2 messages sent to the partner using the `StartFileTransfer` API operation. This ID cannot include spaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-as2id
   */
  readonly as2Id: string;

  /**
   * An array of identifiers for the imported certificates.
   *
   * You use this identifier for working with profiles and partner profiles.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-certificateids
   */
  readonly certificateIds?: Array<string>;

  /**
   * Indicates whether to list only `LOCAL` type profiles or only `PARTNER` type profiles.
   *
   * If not supplied in the request, the command lists all types of profiles.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-profiletype
   */
  readonly profileType: string;

  /**
   * Key-value pairs that can be used to group and search for profiles.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-profile.html#cfn-transfer-profile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("as2Id", cdk.requiredValidator)(properties.as2Id));
  errors.collect(cdk.propertyValidator("as2Id", cdk.validateString)(properties.as2Id));
  errors.collect(cdk.propertyValidator("certificateIds", cdk.listValidator(cdk.validateString))(properties.certificateIds));
  errors.collect(cdk.propertyValidator("profileType", cdk.requiredValidator)(properties.profileType));
  errors.collect(cdk.propertyValidator("profileType", cdk.validateString)(properties.profileType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilePropsValidator(properties).assertSuccess();
  return {
    "As2Id": cdk.stringToCloudFormation(properties.as2Id),
    "CertificateIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateIds),
    "ProfileType": cdk.stringToCloudFormation(properties.profileType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfileProps>();
  ret.addPropertyResult("as2Id", "As2Id", (properties.As2Id != null ? cfn_parse.FromCloudFormation.getString(properties.As2Id) : undefined));
  ret.addPropertyResult("certificateIds", "CertificateIds", (properties.CertificateIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateIds) : undefined));
  ret.addPropertyResult("profileType", "ProfileType", (properties.ProfileType != null ? cfn_parse.FromCloudFormation.getString(properties.ProfileType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in AWS .
 *
 * When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated `ServerId` property that is assigned to the newly created server.
 *
 * @cloudformationResource AWS::Transfer::Server
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html
 */
export class CfnServer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Server";

  /**
   * Build a CfnServer from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name associated with the server, in the form `arn:aws:transfer:region: *account-id* :server/ *server-id* /` .
   *
   * An example of a server ARN is: `arn:aws:transfer:us-east-1:123456789012:server/s-01234567890abcdef` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The service-assigned ID of the server that is created.
   *
   * An example `ServerId` is `s-01234567890abcdef` .
   *
   * @cloudformationAttribute ServerId
   */
  public readonly attrServerId: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Certificate Manager (ACM) certificate.
   */
  public certificate?: string;

  /**
   * Specifies the domain of the storage system that is used for file transfers.
   */
  public domain?: string;

  /**
   * The virtual private cloud (VPC) endpoint settings that are configured for your server.
   */
  public endpointDetails?: CfnServer.EndpointDetailsProperty | cdk.IResolvable;

  /**
   * The type of endpoint that you want your server to use.
   */
  public endpointType?: string;

  /**
   * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` , `AWS _LAMBDA` or `API_GATEWAY` .
   */
  public identityProviderDetails?: CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable;

  /**
   * The mode of authentication for a server.
   */
  public identityProviderType?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents.
   */
  public loggingRole?: string;

  /**
   * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.
   */
  public postAuthenticationLoginBanner?: string;

  /**
   * Specifies a string to display when users connect to a server.
   */
  public preAuthenticationLoginBanner?: string;

  /**
   * The protocol settings that are configured for your server.
   */
  public protocolDetails?: cdk.IResolvable | CfnServer.ProtocolDetailsProperty;

  /**
   * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint.
   */
  public protocols?: Array<string>;

  /**
   * Specifies whether or not performance for your Amazon S3 directories is optimized. This is disabled by default.
   */
  public s3StorageOptions?: cdk.IResolvable | CfnServer.S3StorageOptionsProperty;

  /**
   * Specifies the name of the security policy that is attached to the server.
   */
  public securityPolicyName?: string;

  /**
   * Specifies the log groups to which your server logs are sent.
   */
  public structuredLogDestinations?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for servers.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
   */
  public workflowDetails?: cdk.IResolvable | CfnServer.WorkflowDetailsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServerProps = {}) {
    super(scope, id, {
      "type": CfnServer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrServerId = cdk.Token.asString(this.getAtt("ServerId", cdk.ResolutionTypeHint.STRING));
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
    this.s3StorageOptions = props.s3StorageOptions;
    this.securityPolicyName = props.securityPolicyName;
    this.structuredLogDestinations = props.structuredLogDestinations;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Server", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workflowDetails = props.workflowDetails;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificate": this.certificate,
      "domain": this.domain,
      "endpointDetails": this.endpointDetails,
      "endpointType": this.endpointType,
      "identityProviderDetails": this.identityProviderDetails,
      "identityProviderType": this.identityProviderType,
      "loggingRole": this.loggingRole,
      "postAuthenticationLoginBanner": this.postAuthenticationLoginBanner,
      "preAuthenticationLoginBanner": this.preAuthenticationLoginBanner,
      "protocolDetails": this.protocolDetails,
      "protocols": this.protocols,
      "s3StorageOptions": this.s3StorageOptions,
      "securityPolicyName": this.securityPolicyName,
      "structuredLogDestinations": this.structuredLogDestinations,
      "tags": this.tags.renderTags(),
      "workflowDetails": this.workflowDetails
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServerPropsToCloudFormation(props);
  }
}

export namespace CfnServer {
  /**
   * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` , `AWS _LAMBDA` or `API_GATEWAY` .
   *
   * Accepts an array containing all of the information required to use a directory in `AWS_DIRECTORY_SERVICE` or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when `IdentityProviderType` is set to `SERVICE_MANAGED` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html
   */
  export interface IdentityProviderDetailsProperty {
    /**
     * The identifier of the AWS Directory Service directory that you want to use as your identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-directoryid
     */
    readonly directoryId?: string;

    /**
     * The ARN for a Lambda function to use for the Identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-function
     */
    readonly function?: string;

    /**
     * This parameter is only applicable if your `IdentityProviderType` is `API_GATEWAY` .
     *
     * Provides the type of `InvocationRole` used to authenticate the user account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-invocationrole
     */
    readonly invocationRole?: string;

    /**
     * For SFTP-enabled servers, and for custom identity providers *only* , you can specify whether to authenticate using a password, SSH key pair, or both.
     *
     * - `PASSWORD` - users must provide their password to connect.
     * - `PUBLIC_KEY` - users must provide their private key to connect.
     * - `PUBLIC_KEY_OR_PASSWORD` - users can authenticate with either their password or their key. This is the default value.
     * - `PUBLIC_KEY_AND_PASSWORD` - users must provide both their private key and their password to connect. The server checks the key first, and then if the key is valid, the system prompts for a password. If the private key provided does not match the public key that is stored, authentication fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-sftpauthenticationmethods
     */
    readonly sftpAuthenticationMethods?: string;

    /**
     * Provides the location of the service endpoint used to authenticate users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-identityproviderdetails.html#cfn-transfer-server-identityproviderdetails-url
     */
    readonly url?: string;
  }

  /**
   * The virtual private cloud (VPC) endpoint settings that are configured for your server.
   *
   * When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html
   */
  export interface EndpointDetailsProperty {
    /**
     * A list of address allocation IDs that are required to attach an Elastic IP address to your server's endpoint.
     *
     * An address allocation ID corresponds to the allocation ID of an Elastic IP address. This value can be retrieved from the `allocationId` field from the Amazon EC2 [Address](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_Address.html) data type. One way to retrieve this value is by calling the EC2 [DescribeAddresses](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAddresses.html) API.
     *
     * This parameter is optional. Set this parameter if you want to make your VPC endpoint public-facing. For details, see [Create an internet-facing endpoint for your server](https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#create-internet-facing-endpoint) .
     *
     * > This property can only be set as follows:
     * >
     * > - `EndpointType` must be set to `VPC`
     * > - The Transfer Family server must be offline.
     * > - You cannot set this parameter for Transfer Family servers that use the FTP protocol.
     * > - The server must already have `SubnetIds` populated ( `SubnetIds` and `AddressAllocationIds` cannot be updated simultaneously).
     * > - `AddressAllocationIds` can't contain duplicates, and must be equal in length to `SubnetIds` . For example, if you have three subnet IDs, you must also specify three address allocation IDs.
     * > - Call the `UpdateServer` API to set or change this parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-addressallocationids
     */
    readonly addressAllocationIds?: Array<string>;

    /**
     * A list of security groups IDs that are available to attach to your server's endpoint.
     *
     * > This property can only be set when `EndpointType` is set to `VPC` .
     * >
     * > You can edit the `SecurityGroupIds` property in the [UpdateServer](https://docs.aws.amazon.com/transfer/latest/userguide/API_UpdateServer.html) API only if you are changing the `EndpointType` from `PUBLIC` or `VPC_ENDPOINT` to `VPC` . To change security groups associated with your server's VPC endpoint after creation, use the Amazon EC2 [ModifyVpcEndpoint](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyVpcEndpoint.html) API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * A list of subnet IDs that are required to host your server endpoint in your VPC.
     *
     * > This property can only be set when `EndpointType` is set to `VPC` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-subnetids
     */
    readonly subnetIds?: Array<string>;

    /**
     * The ID of the VPC endpoint.
     *
     * > This property can only be set when `EndpointType` is set to `VPC_ENDPOINT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-vpcendpointid
     */
    readonly vpcEndpointId?: string;

    /**
     * The VPC ID of the virtual private cloud in which the server's endpoint will be hosted.
     *
     * > This property can only be set when `EndpointType` is set to `VPC` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-endpointdetails.html#cfn-transfer-server-endpointdetails-vpcid
     */
    readonly vpcId?: string;
  }

  /**
   * The protocol settings that are configured for your server.
   *
   * - To indicate passive mode (for FTP and FTPS protocols), use the `PassiveIp` parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.
   * - To ignore the error that is generated when the client attempts to use the `SETSTAT` command on a file that you are uploading to an Amazon S3 bucket, use the `SetStatOption` parameter. To have the AWS Transfer Family server ignore the `SETSTAT` command and upload files without needing to make any changes to your SFTP client, set the value to `ENABLE_NO_OP` . If you set the `SetStatOption` parameter to `ENABLE_NO_OP` , Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a `SETSTAT` call.
   * - To determine whether your AWS Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the `TlsSessionResumptionMode` parameter.
   * - `As2Transports` indicates the transport method for the AS2 messages. Currently, only HTTP is supported.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html
   */
  export interface ProtocolDetailsProperty {
    /**
     * List of `As2Transport` objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-as2transports
     */
    readonly as2Transports?: Array<string>;

    /**
     * Indicates passive mode, for FTP and FTPS protocols.
     *
     * Enter a single IPv4 address, such as the public IP address of a firewall, router, or load balancer. For example:
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-passiveip
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-setstatoption
     */
    readonly setStatOption?: string;

    /**
     * A property used with Transfer Family servers that use the FTPS protocol.
     *
     * TLS Session Resumption provides a mechanism to resume or share a negotiated secret key between the control and data connection for an FTPS session. `TlsSessionResumptionMode` determines whether or not the server resumes recent, negotiated sessions through a unique session ID. This property is available during `CreateServer` and `UpdateServer` calls. If a `TlsSessionResumptionMode` value is not specified during `CreateServer` , it is set to `ENFORCED` by default.
     *
     * - `DISABLED` : the server does not process TLS session resumption client requests and creates a new TLS session for each request.
     * - `ENABLED` : the server processes and accepts clients that are performing TLS session resumption. The server doesn't reject client data connections that do not perform the TLS session resumption client processing.
     * - `ENFORCED` : the server processes and accepts clients that are performing TLS session resumption. The server rejects client data connections that do not perform the TLS session resumption client processing. Before you set the value to `ENFORCED` , test your clients.
     *
     * > Not all FTPS clients perform TLS session resumption. So, if you choose to enforce TLS session resumption, you prevent any connections from FTPS clients that don't perform the protocol negotiation. To determine whether or not you can use the `ENFORCED` value, you need to test your clients.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-protocoldetails.html#cfn-transfer-server-protocoldetails-tlssessionresumptionmode
     */
    readonly tlsSessionResumptionMode?: string;
  }

  /**
   * Container for the `WorkflowDetail` data type.
   *
   * It is used by actions that trigger a workflow to begin execution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html
   */
  export interface WorkflowDetailsProperty {
    /**
     * A trigger that starts a workflow if a file is only partially uploaded.
     *
     * You can attach a workflow to a server that executes whenever there is a partial upload.
     *
     * A *partial upload* occurs when a file is open when the session disconnects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html#cfn-transfer-server-workflowdetails-onpartialupload
     */
    readonly onPartialUpload?: Array<cdk.IResolvable | CfnServer.WorkflowDetailProperty> | cdk.IResolvable;

    /**
     * A trigger that starts a workflow: the workflow begins to execute after a file is uploaded.
     *
     * To remove an associated workflow from a server, you can provide an empty `OnUpload` object, as in the following example.
     *
     * `aws transfer update-server --server-id s-01234567890abcdef --workflow-details '{"OnUpload":[]}'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetails.html#cfn-transfer-server-workflowdetails-onupload
     */
    readonly onUpload?: Array<cdk.IResolvable | CfnServer.WorkflowDetailProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
   *
   * In addition to a workflow to execute when a file is uploaded completely, `WorkflowDetails` can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when a file is open when the session disconnects.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html
   */
  export interface WorkflowDetailProperty {
    /**
     * Includes the necessary permissions for S3, EFS, and Lambda operations that Transfer can assume, so that all workflow steps can operate on the required resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html#cfn-transfer-server-workflowdetail-executionrole
     */
    readonly executionRole: string;

    /**
     * A unique identifier for the workflow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-workflowdetail.html#cfn-transfer-server-workflowdetail-workflowid
     */
    readonly workflowId: string;
  }

  /**
   * The Amazon S3 storage options that are configured for your server.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-s3storageoptions.html
   */
  export interface S3StorageOptionsProperty {
    /**
     * Specifies whether or not performance for your Amazon S3 directories is optimized. This is disabled by default.
     *
     * By default, home directory mappings have a `TYPE` of `DIRECTORY` . If you enable this option, you would then need to explicitly set the `HomeDirectoryMapEntry` `Type` to `FILE` if you want a mapping to have a file target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-server-s3storageoptions.html#cfn-transfer-server-s3storageoptions-directorylistingoptimization
     */
    readonly directoryListingOptimization?: string;
  }
}

/**
 * Properties for defining a `CfnServer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html
 */
export interface CfnServerProps {
  /**
   * The Amazon Resource Name (ARN) of the AWS Certificate Manager (ACM) certificate.
   *
   * Required when `Protocols` is set to `FTPS` .
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-certificate
   */
  readonly certificate?: string;

  /**
   * Specifies the domain of the storage system that is used for file transfers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-domain
   */
  readonly domain?: string;

  /**
   * The virtual private cloud (VPC) endpoint settings that are configured for your server.
   *
   * When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointdetails
   */
  readonly endpointDetails?: CfnServer.EndpointDetailsProperty | cdk.IResolvable;

  /**
   * The type of endpoint that you want your server to use.
   *
   * You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.
   *
   * > After May 19, 2021, you won't be able to create a server using `EndpointType=VPC_ENDPOINT` in your AWS account if your account hasn't already done so before May 19, 2021. If you have already created servers with `EndpointType=VPC_ENDPOINT` in your AWS account on or before May 19, 2021, you will not be affected. After this date, use `EndpointType` = `VPC` .
   * >
   * > For more information, see [Discontinuing the use of VPC_ENDPOINT](https://docs.aws.amazon.com//transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint) .
   * >
   * > It is recommended that you use `VPC` as the `EndpointType` . With this endpoint type, you have the option to directly associate up to three Elastic IPv4 addresses (BYO IP included) with your server's endpoint and use VPC security groups to restrict traffic by the client's public IP address. This is not possible with `EndpointType` set to `VPC_ENDPOINT` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-endpointtype
   */
  readonly endpointType?: string;

  /**
   * Required when `IdentityProviderType` is set to `AWS_DIRECTORY_SERVICE` , `AWS _LAMBDA` or `API_GATEWAY` .
   *
   * Accepts an array containing all of the information required to use a directory in `AWS_DIRECTORY_SERVICE` or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when `IdentityProviderType` is set to `SERVICE_MANAGED` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityproviderdetails
   */
  readonly identityProviderDetails?: CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable;

  /**
   * The mode of authentication for a server.
   *
   * The default value is `SERVICE_MANAGED` , which allows you to store and access user credentials within the AWS Transfer Family service.
   *
   * Use `AWS_DIRECTORY_SERVICE` to provide access to Active Directory groups in AWS Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in AWS using AD Connector. This option also requires you to provide a Directory ID by using the `IdentityProviderDetails` parameter.
   *
   * Use the `API_GATEWAY` value to integrate with an identity provider of your choosing. The `API_GATEWAY` setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the `IdentityProviderDetails` parameter.
   *
   * Use the `AWS_LAMBDA` value to directly use an AWS Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the `Function` parameter for the `IdentityProviderDetails` data type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-identityprovidertype
   */
  readonly identityProviderType?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents.
   *
   * When set, you can view user activity in your CloudWatch logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-loggingrole
   */
  readonly loggingRole?: string;

  /**
   * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.
   *
   * > The SFTP protocol does not support post-authentication display banners.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-postauthenticationloginbanner
   */
  readonly postAuthenticationLoginBanner?: string;

  /**
   * Specifies a string to display when users connect to a server.
   *
   * This string is displayed before the user authenticates. For example, the following banner displays details about using the system:
   *
   * `This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel.`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-preauthenticationloginbanner
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
   * The `Protocols` parameter is an array of strings.
   *
   * *Allowed values* : One or more of `SFTP` , `FTPS` , `FTP` , `AS2`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocoldetails
   */
  readonly protocolDetails?: cdk.IResolvable | CfnServer.ProtocolDetailsProperty;

  /**
   * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint.
   *
   * The available protocols are:
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
   * The `Protocols` parameter is an array of strings.
   *
   * *Allowed values* : One or more of `SFTP` , `FTPS` , `FTP` , `AS2`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-protocols
   */
  readonly protocols?: Array<string>;

  /**
   * Specifies whether or not performance for your Amazon S3 directories is optimized. This is disabled by default.
   *
   * By default, home directory mappings have a `TYPE` of `DIRECTORY` . If you enable this option, you would then need to explicitly set the `HomeDirectoryMapEntry` `Type` to `FILE` if you want a mapping to have a file target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-s3storageoptions
   */
  readonly s3StorageOptions?: cdk.IResolvable | CfnServer.S3StorageOptionsProperty;

  /**
   * Specifies the name of the security policy that is attached to the server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-securitypolicyname
   */
  readonly securityPolicyName?: string;

  /**
   * Specifies the log groups to which your server logs are sent.
   *
   * To specify a log group, you must provide the ARN for an existing log group. In this case, the format of the log group is as follows:
   *
   * `arn:aws:logs:region-name:amazon-account-id:log-group:log-group-name:*`
   *
   * For example, `arn:aws:logs:us-east-1:111122223333:log-group:mytestgroup:*`
   *
   * If you have previously specified a log group for a server, you can clear it, and in effect turn off structured logging, by providing an empty value for this parameter in an `update-server` call. For example:
   *
   * `update-server --server-id s-1234567890abcdef0 --structured-log-destinations`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-structuredlogdestinations
   */
  readonly structuredLogDestinations?: Array<string>;

  /**
   * Key-value pairs that can be used to group and search for servers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow.
   *
   * In addition to a workflow to execute when a file is uploaded completely, `WorkflowDetails` can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when a file is open when the session disconnects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-server.html#cfn-transfer-server-workflowdetails
   */
  readonly workflowDetails?: cdk.IResolvable | CfnServer.WorkflowDetailsProperty;
}

/**
 * Determine whether the given properties match those of a `IdentityProviderDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `IdentityProviderDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerIdentityProviderDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("function", cdk.validateString)(properties.function));
  errors.collect(cdk.propertyValidator("invocationRole", cdk.validateString)(properties.invocationRole));
  errors.collect(cdk.propertyValidator("sftpAuthenticationMethods", cdk.validateString)(properties.sftpAuthenticationMethods));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"IdentityProviderDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerIdentityProviderDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerIdentityProviderDetailsPropertyValidator(properties).assertSuccess();
  return {
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "Function": cdk.stringToCloudFormation(properties.function),
    "InvocationRole": cdk.stringToCloudFormation(properties.invocationRole),
    "SftpAuthenticationMethods": cdk.stringToCloudFormation(properties.sftpAuthenticationMethods),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnServerIdentityProviderDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.IdentityProviderDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.IdentityProviderDetailsProperty>();
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("function", "Function", (properties.Function != null ? cfn_parse.FromCloudFormation.getString(properties.Function) : undefined));
  ret.addPropertyResult("invocationRole", "InvocationRole", (properties.InvocationRole != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationRole) : undefined));
  ret.addPropertyResult("sftpAuthenticationMethods", "SftpAuthenticationMethods", (properties.SftpAuthenticationMethods != null ? cfn_parse.FromCloudFormation.getString(properties.SftpAuthenticationMethods) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerEndpointDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addressAllocationIds", cdk.listValidator(cdk.validateString))(properties.addressAllocationIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"EndpointDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerEndpointDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerEndpointDetailsPropertyValidator(properties).assertSuccess();
  return {
    "AddressAllocationIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.addressAllocationIds),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnServerEndpointDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.EndpointDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.EndpointDetailsProperty>();
  ret.addPropertyResult("addressAllocationIds", "AddressAllocationIds", (properties.AddressAllocationIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AddressAllocationIds) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProtocolDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerProtocolDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("as2Transports", cdk.listValidator(cdk.validateString))(properties.as2Transports));
  errors.collect(cdk.propertyValidator("passiveIp", cdk.validateString)(properties.passiveIp));
  errors.collect(cdk.propertyValidator("setStatOption", cdk.validateString)(properties.setStatOption));
  errors.collect(cdk.propertyValidator("tlsSessionResumptionMode", cdk.validateString)(properties.tlsSessionResumptionMode));
  return errors.wrap("supplied properties not correct for \"ProtocolDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerProtocolDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerProtocolDetailsPropertyValidator(properties).assertSuccess();
  return {
    "As2Transports": cdk.listMapper(cdk.stringToCloudFormation)(properties.as2Transports),
    "PassiveIp": cdk.stringToCloudFormation(properties.passiveIp),
    "SetStatOption": cdk.stringToCloudFormation(properties.setStatOption),
    "TlsSessionResumptionMode": cdk.stringToCloudFormation(properties.tlsSessionResumptionMode)
  };
}

// @ts-ignore TS6133
function CfnServerProtocolDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServer.ProtocolDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.ProtocolDetailsProperty>();
  ret.addPropertyResult("as2Transports", "As2Transports", (properties.As2Transports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.As2Transports) : undefined));
  ret.addPropertyResult("passiveIp", "PassiveIp", (properties.PassiveIp != null ? cfn_parse.FromCloudFormation.getString(properties.PassiveIp) : undefined));
  ret.addPropertyResult("setStatOption", "SetStatOption", (properties.SetStatOption != null ? cfn_parse.FromCloudFormation.getString(properties.SetStatOption) : undefined));
  ret.addPropertyResult("tlsSessionResumptionMode", "TlsSessionResumptionMode", (properties.TlsSessionResumptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.TlsSessionResumptionMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowDetailProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerWorkflowDetailPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionRole", cdk.requiredValidator)(properties.executionRole));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("workflowId", cdk.requiredValidator)(properties.workflowId));
  errors.collect(cdk.propertyValidator("workflowId", cdk.validateString)(properties.workflowId));
  return errors.wrap("supplied properties not correct for \"WorkflowDetailProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerWorkflowDetailPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerWorkflowDetailPropertyValidator(properties).assertSuccess();
  return {
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "WorkflowId": cdk.stringToCloudFormation(properties.workflowId)
  };
}

// @ts-ignore TS6133
function CfnServerWorkflowDetailPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServer.WorkflowDetailProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.WorkflowDetailProperty>();
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("workflowId", "WorkflowId", (properties.WorkflowId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerWorkflowDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onPartialUpload", cdk.listValidator(CfnServerWorkflowDetailPropertyValidator))(properties.onPartialUpload));
  errors.collect(cdk.propertyValidator("onUpload", cdk.listValidator(CfnServerWorkflowDetailPropertyValidator))(properties.onUpload));
  return errors.wrap("supplied properties not correct for \"WorkflowDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerWorkflowDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerWorkflowDetailsPropertyValidator(properties).assertSuccess();
  return {
    "OnPartialUpload": cdk.listMapper(convertCfnServerWorkflowDetailPropertyToCloudFormation)(properties.onPartialUpload),
    "OnUpload": cdk.listMapper(convertCfnServerWorkflowDetailPropertyToCloudFormation)(properties.onUpload)
  };
}

// @ts-ignore TS6133
function CfnServerWorkflowDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServer.WorkflowDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.WorkflowDetailsProperty>();
  ret.addPropertyResult("onPartialUpload", "OnPartialUpload", (properties.OnPartialUpload != null ? cfn_parse.FromCloudFormation.getArray(CfnServerWorkflowDetailPropertyFromCloudFormation)(properties.OnPartialUpload) : undefined));
  ret.addPropertyResult("onUpload", "OnUpload", (properties.OnUpload != null ? cfn_parse.FromCloudFormation.getArray(CfnServerWorkflowDetailPropertyFromCloudFormation)(properties.OnUpload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3StorageOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `S3StorageOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerS3StorageOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryListingOptimization", cdk.validateString)(properties.directoryListingOptimization));
  return errors.wrap("supplied properties not correct for \"S3StorageOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerS3StorageOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerS3StorageOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DirectoryListingOptimization": cdk.stringToCloudFormation(properties.directoryListingOptimization)
  };
}

// @ts-ignore TS6133
function CfnServerS3StorageOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServer.S3StorageOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.S3StorageOptionsProperty>();
  ret.addPropertyResult("directoryListingOptimization", "DirectoryListingOptimization", (properties.DirectoryListingOptimization != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryListingOptimization) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServerProps`
 *
 * @param properties - the TypeScript properties of a `CfnServerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("endpointDetails", CfnServerEndpointDetailsPropertyValidator)(properties.endpointDetails));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("identityProviderDetails", CfnServerIdentityProviderDetailsPropertyValidator)(properties.identityProviderDetails));
  errors.collect(cdk.propertyValidator("identityProviderType", cdk.validateString)(properties.identityProviderType));
  errors.collect(cdk.propertyValidator("loggingRole", cdk.validateString)(properties.loggingRole));
  errors.collect(cdk.propertyValidator("postAuthenticationLoginBanner", cdk.validateString)(properties.postAuthenticationLoginBanner));
  errors.collect(cdk.propertyValidator("preAuthenticationLoginBanner", cdk.validateString)(properties.preAuthenticationLoginBanner));
  errors.collect(cdk.propertyValidator("protocolDetails", CfnServerProtocolDetailsPropertyValidator)(properties.protocolDetails));
  errors.collect(cdk.propertyValidator("protocols", cdk.listValidator(cdk.validateString))(properties.protocols));
  errors.collect(cdk.propertyValidator("s3StorageOptions", CfnServerS3StorageOptionsPropertyValidator)(properties.s3StorageOptions));
  errors.collect(cdk.propertyValidator("securityPolicyName", cdk.validateString)(properties.securityPolicyName));
  errors.collect(cdk.propertyValidator("structuredLogDestinations", cdk.listValidator(cdk.validateString))(properties.structuredLogDestinations));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workflowDetails", CfnServerWorkflowDetailsPropertyValidator)(properties.workflowDetails));
  return errors.wrap("supplied properties not correct for \"CfnServerProps\"");
}

// @ts-ignore TS6133
function convertCfnServerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerPropsValidator(properties).assertSuccess();
  return {
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "EndpointDetails": convertCfnServerEndpointDetailsPropertyToCloudFormation(properties.endpointDetails),
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "IdentityProviderDetails": convertCfnServerIdentityProviderDetailsPropertyToCloudFormation(properties.identityProviderDetails),
    "IdentityProviderType": cdk.stringToCloudFormation(properties.identityProviderType),
    "LoggingRole": cdk.stringToCloudFormation(properties.loggingRole),
    "PostAuthenticationLoginBanner": cdk.stringToCloudFormation(properties.postAuthenticationLoginBanner),
    "PreAuthenticationLoginBanner": cdk.stringToCloudFormation(properties.preAuthenticationLoginBanner),
    "ProtocolDetails": convertCfnServerProtocolDetailsPropertyToCloudFormation(properties.protocolDetails),
    "Protocols": cdk.listMapper(cdk.stringToCloudFormation)(properties.protocols),
    "S3StorageOptions": convertCfnServerS3StorageOptionsPropertyToCloudFormation(properties.s3StorageOptions),
    "SecurityPolicyName": cdk.stringToCloudFormation(properties.securityPolicyName),
    "StructuredLogDestinations": cdk.listMapper(cdk.stringToCloudFormation)(properties.structuredLogDestinations),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkflowDetails": convertCfnServerWorkflowDetailsPropertyToCloudFormation(properties.workflowDetails)
  };
}

// @ts-ignore TS6133
function CfnServerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerProps>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("endpointDetails", "EndpointDetails", (properties.EndpointDetails != null ? CfnServerEndpointDetailsPropertyFromCloudFormation(properties.EndpointDetails) : undefined));
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("identityProviderDetails", "IdentityProviderDetails", (properties.IdentityProviderDetails != null ? CfnServerIdentityProviderDetailsPropertyFromCloudFormation(properties.IdentityProviderDetails) : undefined));
  ret.addPropertyResult("identityProviderType", "IdentityProviderType", (properties.IdentityProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderType) : undefined));
  ret.addPropertyResult("loggingRole", "LoggingRole", (properties.LoggingRole != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingRole) : undefined));
  ret.addPropertyResult("postAuthenticationLoginBanner", "PostAuthenticationLoginBanner", (properties.PostAuthenticationLoginBanner != null ? cfn_parse.FromCloudFormation.getString(properties.PostAuthenticationLoginBanner) : undefined));
  ret.addPropertyResult("preAuthenticationLoginBanner", "PreAuthenticationLoginBanner", (properties.PreAuthenticationLoginBanner != null ? cfn_parse.FromCloudFormation.getString(properties.PreAuthenticationLoginBanner) : undefined));
  ret.addPropertyResult("protocolDetails", "ProtocolDetails", (properties.ProtocolDetails != null ? CfnServerProtocolDetailsPropertyFromCloudFormation(properties.ProtocolDetails) : undefined));
  ret.addPropertyResult("protocols", "Protocols", (properties.Protocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Protocols) : undefined));
  ret.addPropertyResult("s3StorageOptions", "S3StorageOptions", (properties.S3StorageOptions != null ? CfnServerS3StorageOptionsPropertyFromCloudFormation(properties.S3StorageOptions) : undefined));
  ret.addPropertyResult("securityPolicyName", "SecurityPolicyName", (properties.SecurityPolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicyName) : undefined));
  ret.addPropertyResult("structuredLogDestinations", "StructuredLogDestinations", (properties.StructuredLogDestinations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StructuredLogDestinations) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workflowDetails", "WorkflowDetails", (properties.WorkflowDetails != null ? CfnServerWorkflowDetailsPropertyFromCloudFormation(properties.WorkflowDetails) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Transfer::User` resource creates a user and associates them with an existing server.
 *
 * You can only create and associate users with servers that have the `IdentityProviderType` set to `SERVICE_MANAGED` . Using parameters for `CreateUser` , you can specify the user name, set the home directory, store the user's public key, and assign the user's AWS Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
 *
 * @cloudformationResource AWS::Transfer::User
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::User";

  /**
   * Build a CfnUser from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUser(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name associated with the user, in the form `arn:aws:transfer:region: *account-id* :user/ *server-id* / *username*` .
   *
   * An example of a user ARN is: `arn:aws:transfer:us-east-1:123456789012:user/user1` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the server to which the user is attached.
   *
   * An example `ServerId` is `s-01234567890abcdef` .
   *
   * @cloudformationAttribute ServerId
   */
  public readonly attrServerId: string;

  /**
   * A unique string that identifies a Transfer Family user account associated with a server.
   *
   * An example `UserName` is `transfer-user-1` .
   *
   * @cloudformationAttribute UserName
   */
  public readonly attrUserName: string;

  /**
   * The landing directory (folder) for a user when they log in to the server using the client.
   */
  public homeDirectory?: string;

  /**
   * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible.
   */
  public homeDirectoryMappings?: Array<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server.
   */
  public homeDirectoryType?: string;

  /**
   * A session policy for your user so you can use the same IAM role across multiple users.
   */
  public policy?: string;

  /**
   * Specifies the full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems.
   */
  public posixProfile?: cdk.IResolvable | CfnUser.PosixProfileProperty;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system.
   */
  public role: string;

  /**
   * A system-assigned unique identifier for a server instance.
   */
  public serverId: string;

  /**
   * Specifies the public key portion of the Secure Shell (SSH) keys stored for the described user.
   */
  public sshPublicKeys?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for users.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A unique string that identifies a user and is associated with a `ServerId` .
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
    super(scope, id, {
      "type": CfnUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "role", this);
    cdk.requireProperty(props, "serverId", this);
    cdk.requireProperty(props, "userName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrServerId = cdk.Token.asString(this.getAtt("ServerId", cdk.ResolutionTypeHint.STRING));
    this.attrUserName = cdk.Token.asString(this.getAtt("UserName", cdk.ResolutionTypeHint.STRING));
    this.homeDirectory = props.homeDirectory;
    this.homeDirectoryMappings = props.homeDirectoryMappings;
    this.homeDirectoryType = props.homeDirectoryType;
    this.policy = props.policy;
    this.posixProfile = props.posixProfile;
    this.role = props.role;
    this.serverId = props.serverId;
    this.sshPublicKeys = props.sshPublicKeys;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::User", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "homeDirectory": this.homeDirectory,
      "homeDirectoryMappings": this.homeDirectoryMappings,
      "homeDirectoryType": this.homeDirectoryType,
      "policy": this.policy,
      "posixProfile": this.posixProfile,
      "role": this.role,
      "serverId": this.serverId,
      "sshPublicKeys": this.sshPublicKeys,
      "tags": this.tags.renderTags(),
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPropsToCloudFormation(props);
  }
}

export namespace CfnUser {
  /**
   * Represents an object that contains entries and targets for `HomeDirectoryMappings` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html
   */
  export interface HomeDirectoryMapEntryProperty {
    /**
     * Represents an entry for `HomeDirectoryMappings` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html#cfn-transfer-user-homedirectorymapentry-entry
     */
    readonly entry: string;

    /**
     * Represents the map target that is used in a `HomeDirectoryMapEntry` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html#cfn-transfer-user-homedirectorymapentry-target
     */
    readonly target: string;

    /**
     * Specifies the type of mapping.
     *
     * Set the type to `FILE` if you want the mapping to point to a file, or `DIRECTORY` for the directory to point to a directory.
     *
     * > By default, home directory mappings have a `Type` of `DIRECTORY` when you create a Transfer Family server. You would need to explicitly set `Type` to `FILE` if you want a mapping to have a file target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-homedirectorymapentry.html#cfn-transfer-user-homedirectorymapentry-type
     */
    readonly type?: string;
  }

  /**
   * The full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon EFS file systems.
   *
   * The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html
   */
  export interface PosixProfileProperty {
    /**
     * The POSIX group ID used for all EFS operations by this user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-gid
     */
    readonly gid: number;

    /**
     * The secondary POSIX group IDs used for all EFS operations by this user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-secondarygids
     */
    readonly secondaryGids?: Array<number> | cdk.IResolvable;

    /**
     * The POSIX user ID used for all EFS operations by this user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-posixprofile.html#cfn-transfer-user-posixprofile-uid
     */
    readonly uid: number;
  }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html
 */
export interface CfnUserProps {
  /**
   * The landing directory (folder) for a user when they log in to the server using the client.
   *
   * A `HomeDirectory` example is `/bucket_name/home/mydirectory` .
   *
   * > The `HomeDirectory` parameter is only used if `HomeDirectoryType` is set to `PATH` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectory
   */
  readonly homeDirectory?: string;

  /**
   * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible.
   *
   * You must specify the `Entry` and `Target` pair, where `Entry` shows how the path is made visible and `Target` is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your AWS Identity and Access Management (IAM) role provides access to paths in `Target` . This value can be set only when `HomeDirectoryType` is set to *LOGICAL* .
   *
   * The following is an `Entry` and `Target` pair example.
   *
   * `[ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]`
   *
   * In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory (" `chroot` "). To do this, you can set `Entry` to `/` and set `Target` to the value the user should see for their home directory when they log in.
   *
   * The following is an `Entry` and `Target` pair example for `chroot` .
   *
   * `[ { "Entry": "/", "Target": "/bucket_name/home/mydirectory" } ]`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorymappings
   */
  readonly homeDirectoryMappings?: Array<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server.
   *
   * If you set it to `PATH` , the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to `LOGICAL` , you need to provide mappings in the `HomeDirectoryMappings` for how you want to make Amazon S3 or Amazon EFS paths visible to your users.
   *
   * > If `HomeDirectoryType` is `LOGICAL` , you must provide mappings, using the `HomeDirectoryMappings` parameter. If, on the other hand, `HomeDirectoryType` is `PATH` , you provide an absolute path using the `HomeDirectory` parameter. You cannot have both `HomeDirectory` and `HomeDirectoryMappings` in your template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectorytype
   */
  readonly homeDirectoryType?: string;

  /**
   * A session policy for your user so you can use the same IAM role across multiple users.
   *
   * This policy restricts user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include `${Transfer:UserName}` , `${Transfer:HomeDirectory}` , and `${Transfer:HomeBucket}` .
   *
   * > For session policies, AWS Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the `Policy` argument.
   * >
   * > For an example of a session policy, see [Example session policy](https://docs.aws.amazon.com/transfer/latest/userguide/session-policy.html) .
   * >
   * > For more information, see [AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) in the *AWS Security Token Service API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-policy
   */
  readonly policy?: string;

  /**
   * Specifies the full POSIX identity, including user ID ( `Uid` ), group ID ( `Gid` ), and any secondary groups IDs ( `SecondaryGids` ), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems.
   *
   * The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-posixprofile
   */
  readonly posixProfile?: cdk.IResolvable | CfnUser.PosixProfileProperty;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system.
   *
   * The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-role
   */
  readonly role: string;

  /**
   * A system-assigned unique identifier for a server instance.
   *
   * This is the specific server that you added your user to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-serverid
   */
  readonly serverId: string;

  /**
   * Specifies the public key portion of the Secure Shell (SSH) keys stored for the described user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-sshpublickeys
   */
  readonly sshPublicKeys?: Array<string>;

  /**
   * Key-value pairs that can be used to group and search for users.
   *
   * Tags are metadata attached to users for any purpose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A unique string that identifies a user and is associated with a `ServerId` .
   *
   * This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `HomeDirectoryMapEntryProperty`
 *
 * @param properties - the TypeScript properties of a `HomeDirectoryMapEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserHomeDirectoryMapEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entry", cdk.requiredValidator)(properties.entry));
  errors.collect(cdk.propertyValidator("entry", cdk.validateString)(properties.entry));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"HomeDirectoryMapEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserHomeDirectoryMapEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserHomeDirectoryMapEntryPropertyValidator(properties).assertSuccess();
  return {
    "Entry": cdk.stringToCloudFormation(properties.entry),
    "Target": cdk.stringToCloudFormation(properties.target),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnUserHomeDirectoryMapEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.HomeDirectoryMapEntryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.HomeDirectoryMapEntryProperty>();
  ret.addPropertyResult("entry", "Entry", (properties.Entry != null ? cfn_parse.FromCloudFormation.getString(properties.Entry) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PosixProfileProperty`
 *
 * @param properties - the TypeScript properties of a `PosixProfileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPosixProfilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gid", cdk.requiredValidator)(properties.gid));
  errors.collect(cdk.propertyValidator("gid", cdk.validateNumber)(properties.gid));
  errors.collect(cdk.propertyValidator("secondaryGids", cdk.listValidator(cdk.validateNumber))(properties.secondaryGids));
  errors.collect(cdk.propertyValidator("uid", cdk.requiredValidator)(properties.uid));
  errors.collect(cdk.propertyValidator("uid", cdk.validateNumber)(properties.uid));
  return errors.wrap("supplied properties not correct for \"PosixProfileProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPosixProfilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPosixProfilePropertyValidator(properties).assertSuccess();
  return {
    "Gid": cdk.numberToCloudFormation(properties.gid),
    "SecondaryGids": cdk.listMapper(cdk.numberToCloudFormation)(properties.secondaryGids),
    "Uid": cdk.numberToCloudFormation(properties.uid)
  };
}

// @ts-ignore TS6133
function CfnUserPosixProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUser.PosixProfileProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.PosixProfileProperty>();
  ret.addPropertyResult("gid", "Gid", (properties.Gid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gid) : undefined));
  ret.addPropertyResult("secondaryGids", "SecondaryGids", (properties.SecondaryGids != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.SecondaryGids) : undefined));
  ret.addPropertyResult("uid", "Uid", (properties.Uid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Uid) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("homeDirectory", cdk.validateString)(properties.homeDirectory));
  errors.collect(cdk.propertyValidator("homeDirectoryMappings", cdk.listValidator(CfnUserHomeDirectoryMapEntryPropertyValidator))(properties.homeDirectoryMappings));
  errors.collect(cdk.propertyValidator("homeDirectoryType", cdk.validateString)(properties.homeDirectoryType));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  errors.collect(cdk.propertyValidator("posixProfile", CfnUserPosixProfilePropertyValidator)(properties.posixProfile));
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("serverId", cdk.requiredValidator)(properties.serverId));
  errors.collect(cdk.propertyValidator("serverId", cdk.validateString)(properties.serverId));
  errors.collect(cdk.propertyValidator("sshPublicKeys", cdk.listValidator(cdk.validateString))(properties.sshPublicKeys));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPropsValidator(properties).assertSuccess();
  return {
    "HomeDirectory": cdk.stringToCloudFormation(properties.homeDirectory),
    "HomeDirectoryMappings": cdk.listMapper(convertCfnUserHomeDirectoryMapEntryPropertyToCloudFormation)(properties.homeDirectoryMappings),
    "HomeDirectoryType": cdk.stringToCloudFormation(properties.homeDirectoryType),
    "Policy": cdk.stringToCloudFormation(properties.policy),
    "PosixProfile": convertCfnUserPosixProfilePropertyToCloudFormation(properties.posixProfile),
    "Role": cdk.stringToCloudFormation(properties.role),
    "ServerId": cdk.stringToCloudFormation(properties.serverId),
    "SshPublicKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.sshPublicKeys),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
  ret.addPropertyResult("homeDirectory", "HomeDirectory", (properties.HomeDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.HomeDirectory) : undefined));
  ret.addPropertyResult("homeDirectoryMappings", "HomeDirectoryMappings", (properties.HomeDirectoryMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnUserHomeDirectoryMapEntryPropertyFromCloudFormation)(properties.HomeDirectoryMappings) : undefined));
  ret.addPropertyResult("homeDirectoryType", "HomeDirectoryType", (properties.HomeDirectoryType != null ? cfn_parse.FromCloudFormation.getString(properties.HomeDirectoryType) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
  ret.addPropertyResult("posixProfile", "PosixProfile", (properties.PosixProfile != null ? CfnUserPosixProfilePropertyFromCloudFormation(properties.PosixProfile) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("serverId", "ServerId", (properties.ServerId != null ? cfn_parse.FromCloudFormation.getString(properties.ServerId) : undefined));
  ret.addPropertyResult("sshPublicKeys", "SshPublicKeys", (properties.SshPublicKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SshPublicKeys) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userName", "UserName", (properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Allows you to create a workflow with specified steps and step details the workflow invokes after file transfer completes.
 *
 * After creating a workflow, you can associate the workflow created with any transfer servers by specifying the `workflow-details` field in `CreateServer` and `UpdateServer` operations.
 *
 * @cloudformationResource AWS::Transfer::Workflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html
 */
export class CfnWorkflow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Transfer::Workflow";

  /**
   * Build a CfnWorkflow from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies the unique Amazon Resource Name (ARN) for the workflow.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A unique identifier for a workflow.
   *
   * @cloudformationAttribute WorkflowId
   */
  public readonly attrWorkflowId: string;

  /**
   * Specifies the text description for the workflow.
   */
  public description?: string;

  /**
   * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
   */
  public onExceptionSteps?: Array<cdk.IResolvable | CfnWorkflow.WorkflowStepProperty> | cdk.IResolvable;

  /**
   * Specifies the details for the steps that are in the specified workflow.
   */
  public steps: Array<cdk.IResolvable | CfnWorkflow.WorkflowStepProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs that can be used to group and search for workflows.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkflowProps) {
    super(scope, id, {
      "type": CfnWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "steps", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrWorkflowId = cdk.Token.asString(this.getAtt("WorkflowId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.onExceptionSteps = props.onExceptionSteps;
    this.steps = props.steps;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Transfer::Workflow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "onExceptionSteps": this.onExceptionSteps,
      "steps": this.steps,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkflowPropsToCloudFormation(props);
  }
}

export namespace CfnWorkflow {
  /**
   * The basic building block of a workflow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-copystepdetails
     */
    readonly copyStepDetails?: any | cdk.IResolvable;

    /**
     * Details for a step that invokes an AWS Lambda function.
     *
     * Consists of the Lambda function's name, target, and timeout (in seconds).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-customstepdetails
     */
    readonly customStepDetails?: any | cdk.IResolvable;

    /**
     * Details for a step that decrypts an encrypted file.
     *
     * Consists of the following values:
     *
     * - A descriptive name
     * - An Amazon S3 or Amazon Elastic File System (Amazon EFS) location for the source file to decrypt.
     * - An S3 or Amazon EFS location for the destination of the file decryption.
     * - A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
     * - The type of encryption that's used. Currently, only PGP encryption is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-decryptstepdetails
     */
    readonly decryptStepDetails?: CfnWorkflow.DecryptStepDetailsProperty | cdk.IResolvable;

    /**
     * Details for a step that deletes the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-deletestepdetails
     */
    readonly deleteStepDetails?: any | cdk.IResolvable;

    /**
     * Details for a step that creates one or more tags.
     *
     * You specify one or more tags. Each tag contains a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-tagstepdetails
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-workflowstep.html#cfn-transfer-workflow-workflowstep-type
     */
    readonly type?: string;
  }

  /**
   * Details for a step that decrypts an encrypted file.
   *
   * Consists of the following values:
   *
   * - A descriptive name
   * - An Amazon S3 or Amazon Elastic File System (Amazon EFS) location for the source file to decrypt.
   * - An S3 or Amazon EFS location for the destination of the file decryption.
   * - A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
   * - The type of encryption that's used. Currently, only PGP encryption is supported.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html
   */
  export interface DecryptStepDetailsProperty {
    /**
     * Specifies the location for the file being decrypted.
     *
     * Use `${Transfer:UserName}` or `${Transfer:UploadDate}` in this field to parametrize the destination prefix by username or uploaded date.
     *
     * - Set the value of `DestinationFileLocation` to `${Transfer:UserName}` to decrypt uploaded files to an Amazon S3 bucket that is prefixed with the name of the Transfer Family user that uploaded the file.
     * - Set the value of `DestinationFileLocation` to `${Transfer:UploadDate}` to decrypt uploaded files to an Amazon S3 bucket that is prefixed with the date of the upload.
     *
     * > The system resolves `UploadDate` to a date format of *YYYY-MM-DD* , based on the date the file is uploaded in UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-destinationfilelocation
     */
    readonly destinationFileLocation?: CfnWorkflow.InputFileLocationProperty | cdk.IResolvable;

    /**
     * The name of the step, used as an identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-name
     */
    readonly name?: string;

    /**
     * A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
     *
     * If the workflow is processing a file that has the same name as an existing file, the behavior is as follows:
     *
     * - If `OverwriteExisting` is `TRUE` , the existing file is replaced with the file being processed.
     * - If `OverwriteExisting` is `FALSE` , nothing happens, and the workflow processing stops.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-overwriteexisting
     */
    readonly overwriteExisting?: string;

    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.
     *
     * - To use the previous file as the input, enter `${previous.file}` . In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.
     * - To use the originally uploaded file location as input for this step, enter `${original.file}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-sourcefilelocation
     */
    readonly sourceFileLocation?: string;

    /**
     * The type of encryption used.
     *
     * Currently, this value must be `PGP` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-decryptstepdetails.html#cfn-transfer-workflow-decryptstepdetails-type
     */
    readonly type?: string;
  }

  /**
   * Specifies the location for the file that's being processed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html
   */
  export interface InputFileLocationProperty {
    /**
     * Specifies the details for the Amazon Elastic File System (Amazon EFS) file that's being decrypted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html#cfn-transfer-workflow-inputfilelocation-efsfilelocation
     */
    readonly efsFileLocation?: CfnWorkflow.EfsInputFileLocationProperty | cdk.IResolvable;

    /**
     * Specifies the details for the Amazon S3 file that's being copied or decrypted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-inputfilelocation.html#cfn-transfer-workflow-inputfilelocation-s3filelocation
     */
    readonly s3FileLocation?: cdk.IResolvable | CfnWorkflow.S3InputFileLocationProperty;
  }

  /**
   * Specifies the Amazon EFS identifier and the path for the file being used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html
   */
  export interface EfsInputFileLocationProperty {
    /**
     * The identifier of the file system, assigned by Amazon EFS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html#cfn-transfer-workflow-efsinputfilelocation-filesystemid
     */
    readonly fileSystemId?: string;

    /**
     * The pathname for the folder being used by a workflow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-efsinputfilelocation.html#cfn-transfer-workflow-efsinputfilelocation-path
     */
    readonly path?: string;
  }

  /**
   * Specifies the details for the Amazon S3 location for an input file to a workflow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html
   */
  export interface S3InputFileLocationProperty {
    /**
     * Specifies the S3 bucket for the customer input file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html#cfn-transfer-workflow-s3inputfilelocation-bucket
     */
    readonly bucket?: string;

    /**
     * The name assigned to the file when it was created in Amazon S3.
     *
     * You use the object key to retrieve the object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3inputfilelocation.html#cfn-transfer-workflow-s3inputfilelocation-key
     */
    readonly key?: string;
  }

  /**
   * Details for a step that performs a file copy.
   *
   * Consists of the following values:
   *
   * - A description
   * - An Amazon S3 location for the destination of the file copy.
   * - A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html
   */
  export interface CopyStepDetailsProperty {
    /**
     * Specifies the location for the file being copied.
     *
     * Use `${Transfer:UserName}` or `${Transfer:UploadDate}` in this field to parametrize the destination prefix by username or uploaded date.
     *
     * - Set the value of `DestinationFileLocation` to `${Transfer:UserName}` to copy uploaded files to an Amazon S3 bucket that is prefixed with the name of the Transfer Family user that uploaded the file.
     * - Set the value of `DestinationFileLocation` to `${Transfer:UploadDate}` to copy uploaded files to an Amazon S3 bucket that is prefixed with the date of the upload.
     *
     * > The system resolves `UploadDate` to a date format of *YYYY-MM-DD* , based on the date the file is uploaded in UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-destinationfilelocation
     */
    readonly destinationFileLocation?: cdk.IResolvable | CfnWorkflow.S3FileLocationProperty;

    /**
     * The name of the step, used as an identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-name
     */
    readonly name?: string;

    /**
     * A flag that indicates whether to overwrite an existing file of the same name. The default is `FALSE` .
     *
     * If the workflow is processing a file that has the same name as an existing file, the behavior is as follows:
     *
     * - If `OverwriteExisting` is `TRUE` , the existing file is replaced with the file being processed.
     * - If `OverwriteExisting` is `FALSE` , nothing happens, and the workflow processing stops.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-overwriteexisting
     */
    readonly overwriteExisting?: string;

    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.
     *
     * - To use the previous file as the input, enter `${previous.file}` . In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.
     * - To use the originally uploaded file location as input for this step, enter `${original.file}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-copystepdetails.html#cfn-transfer-workflow-copystepdetails-sourcefilelocation
     */
    readonly sourceFileLocation?: string;
  }

  /**
   * Specifies the S3 details for the file being used, such as bucket, ETag, and so forth.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3filelocation.html
   */
  export interface S3FileLocationProperty {
    /**
     * Specifies the details for the file location for the file that's being used in the workflow.
     *
     * Only applicable if you are using Amazon S3 storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3filelocation.html#cfn-transfer-workflow-s3filelocation-s3filelocation
     */
    readonly s3FileLocation?: cdk.IResolvable | CfnWorkflow.S3InputFileLocationProperty;
  }

  /**
   * Details for a step that invokes an AWS Lambda function.
   *
   * Consists of the Lambda function's name, target, and timeout (in seconds).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html
   */
  export interface CustomStepDetailsProperty {
    /**
     * The name of the step, used as an identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-name
     */
    readonly name?: string;

    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.
     *
     * - To use the previous file as the input, enter `${previous.file}` . In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.
     * - To use the originally uploaded file location as input for this step, enter `${original.file}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-sourcefilelocation
     */
    readonly sourceFileLocation?: string;

    /**
     * The ARN for the Lambda function that is being called.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-target
     */
    readonly target?: string;

    /**
     * Timeout, in seconds, for the step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-customstepdetails.html#cfn-transfer-workflow-customstepdetails-timeoutseconds
     */
    readonly timeoutSeconds?: number;
  }

  /**
   * An object that contains the name and file location for a file being deleted by a workflow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html
   */
  export interface DeleteStepDetailsProperty {
    /**
     * The name of the step, used as an identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html#cfn-transfer-workflow-deletestepdetails-name
     */
    readonly name?: string;

    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.
     *
     * - To use the previous file as the input, enter `${previous.file}` . In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.
     * - To use the originally uploaded file location as input for this step, enter `${original.file}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-deletestepdetails.html#cfn-transfer-workflow-deletestepdetails-sourcefilelocation
     */
    readonly sourceFileLocation?: string;
  }

  /**
   * Specifies the key-value pair that are assigned to a file during the execution of a Tagging step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html
   */
  export interface S3TagProperty {
    /**
     * The name assigned to the tag that you create.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html#cfn-transfer-workflow-s3tag-key
     */
    readonly key: string;

    /**
     * The value that corresponds to the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-s3tag.html#cfn-transfer-workflow-s3tag-value
     */
    readonly value: string;
  }

  /**
   * Details for a step that creates one or more tags.
   *
   * You specify one or more tags. Each tag contains a key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html
   */
  export interface TagStepDetailsProperty {
    /**
     * The name of the step, used as an identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-name
     */
    readonly name?: string;

    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.
     *
     * - To use the previous file as the input, enter `${previous.file}` . In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.
     * - To use the originally uploaded file location as input for this step, enter `${original.file}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-sourcefilelocation
     */
    readonly sourceFileLocation?: string;

    /**
     * Array that contains from 1 to 10 key/value pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-workflow-tagstepdetails.html#cfn-transfer-workflow-tagstepdetails-tags
     */
    readonly tags?: Array<CfnWorkflow.S3TagProperty>;
  }
}

/**
 * Properties for defining a `CfnWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html
 */
export interface CfnWorkflowProps {
  /**
   * Specifies the text description for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-description
   */
  readonly description?: string;

  /**
   * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-onexceptionsteps
   */
  readonly onExceptionSteps?: Array<cdk.IResolvable | CfnWorkflow.WorkflowStepProperty> | cdk.IResolvable;

  /**
   * Specifies the details for the steps that are in the specified workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-steps
   */
  readonly steps: Array<cdk.IResolvable | CfnWorkflow.WorkflowStepProperty> | cdk.IResolvable;

  /**
   * Key-value pairs that can be used to group and search for workflows.
   *
   * Tags are metadata attached to workflows for any purpose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-workflow.html#cfn-transfer-workflow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EfsInputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `EfsInputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowEfsInputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"EfsInputFileLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowEfsInputFileLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowEfsInputFileLocationPropertyValidator(properties).assertSuccess();
  return {
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnWorkflowEfsInputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.EfsInputFileLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.EfsInputFileLocationProperty>();
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3InputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3InputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowS3InputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3InputFileLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowS3InputFileLocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.S3InputFileLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3InputFileLocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `InputFileLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowInputFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("efsFileLocation", CfnWorkflowEfsInputFileLocationPropertyValidator)(properties.efsFileLocation));
  errors.collect(cdk.propertyValidator("s3FileLocation", CfnWorkflowS3InputFileLocationPropertyValidator)(properties.s3FileLocation));
  return errors.wrap("supplied properties not correct for \"InputFileLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowInputFileLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowInputFileLocationPropertyValidator(properties).assertSuccess();
  return {
    "EfsFileLocation": convertCfnWorkflowEfsInputFileLocationPropertyToCloudFormation(properties.efsFileLocation),
    "S3FileLocation": convertCfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties.s3FileLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkflowInputFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.InputFileLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.InputFileLocationProperty>();
  ret.addPropertyResult("efsFileLocation", "EfsFileLocation", (properties.EfsFileLocation != null ? CfnWorkflowEfsInputFileLocationPropertyFromCloudFormation(properties.EfsFileLocation) : undefined));
  ret.addPropertyResult("s3FileLocation", "S3FileLocation", (properties.S3FileLocation != null ? CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties.S3FileLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DecryptStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DecryptStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowDecryptStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationFileLocation", CfnWorkflowInputFileLocationPropertyValidator)(properties.destinationFileLocation));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overwriteExisting", cdk.validateString)(properties.overwriteExisting));
  errors.collect(cdk.propertyValidator("sourceFileLocation", cdk.validateString)(properties.sourceFileLocation));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DecryptStepDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowDecryptStepDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowDecryptStepDetailsPropertyValidator(properties).assertSuccess();
  return {
    "DestinationFileLocation": convertCfnWorkflowInputFileLocationPropertyToCloudFormation(properties.destinationFileLocation),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OverwriteExisting": cdk.stringToCloudFormation(properties.overwriteExisting),
    "SourceFileLocation": cdk.stringToCloudFormation(properties.sourceFileLocation),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnWorkflowDecryptStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.DecryptStepDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.DecryptStepDetailsProperty>();
  ret.addPropertyResult("destinationFileLocation", "DestinationFileLocation", (properties.DestinationFileLocation != null ? CfnWorkflowInputFileLocationPropertyFromCloudFormation(properties.DestinationFileLocation) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overwriteExisting", "OverwriteExisting", (properties.OverwriteExisting != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteExisting) : undefined));
  ret.addPropertyResult("sourceFileLocation", "SourceFileLocation", (properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowStepProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowStepProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowWorkflowStepPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("copyStepDetails", cdk.validateObject)(properties.copyStepDetails));
  errors.collect(cdk.propertyValidator("customStepDetails", cdk.validateObject)(properties.customStepDetails));
  errors.collect(cdk.propertyValidator("decryptStepDetails", CfnWorkflowDecryptStepDetailsPropertyValidator)(properties.decryptStepDetails));
  errors.collect(cdk.propertyValidator("deleteStepDetails", cdk.validateObject)(properties.deleteStepDetails));
  errors.collect(cdk.propertyValidator("tagStepDetails", cdk.validateObject)(properties.tagStepDetails));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"WorkflowStepProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowWorkflowStepPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowWorkflowStepPropertyValidator(properties).assertSuccess();
  return {
    "CopyStepDetails": cdk.objectToCloudFormation(properties.copyStepDetails),
    "CustomStepDetails": cdk.objectToCloudFormation(properties.customStepDetails),
    "DecryptStepDetails": convertCfnWorkflowDecryptStepDetailsPropertyToCloudFormation(properties.decryptStepDetails),
    "DeleteStepDetails": cdk.objectToCloudFormation(properties.deleteStepDetails),
    "TagStepDetails": cdk.objectToCloudFormation(properties.tagStepDetails),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnWorkflowWorkflowStepPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.WorkflowStepProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.WorkflowStepProperty>();
  ret.addPropertyResult("copyStepDetails", "CopyStepDetails", (properties.CopyStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.CopyStepDetails) : undefined));
  ret.addPropertyResult("customStepDetails", "CustomStepDetails", (properties.CustomStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomStepDetails) : undefined));
  ret.addPropertyResult("decryptStepDetails", "DecryptStepDetails", (properties.DecryptStepDetails != null ? CfnWorkflowDecryptStepDetailsPropertyFromCloudFormation(properties.DecryptStepDetails) : undefined));
  ret.addPropertyResult("deleteStepDetails", "DeleteStepDetails", (properties.DeleteStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.DeleteStepDetails) : undefined));
  ret.addPropertyResult("tagStepDetails", "TagStepDetails", (properties.TagStepDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.TagStepDetails) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("onExceptionSteps", cdk.listValidator(CfnWorkflowWorkflowStepPropertyValidator))(properties.onExceptionSteps));
  errors.collect(cdk.propertyValidator("steps", cdk.requiredValidator)(properties.steps));
  errors.collect(cdk.propertyValidator("steps", cdk.listValidator(CfnWorkflowWorkflowStepPropertyValidator))(properties.steps));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "OnExceptionSteps": cdk.listMapper(convertCfnWorkflowWorkflowStepPropertyToCloudFormation)(properties.onExceptionSteps),
    "Steps": cdk.listMapper(convertCfnWorkflowWorkflowStepPropertyToCloudFormation)(properties.steps),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflowProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("onExceptionSteps", "OnExceptionSteps", (properties.OnExceptionSteps != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkflowWorkflowStepPropertyFromCloudFormation)(properties.OnExceptionSteps) : undefined));
  ret.addPropertyResult("steps", "Steps", (properties.Steps != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkflowWorkflowStepPropertyFromCloudFormation)(properties.Steps) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3FileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3FileLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowS3FileLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3FileLocation", CfnWorkflowS3InputFileLocationPropertyValidator)(properties.s3FileLocation));
  return errors.wrap("supplied properties not correct for \"S3FileLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowS3FileLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowS3FileLocationPropertyValidator(properties).assertSuccess();
  return {
    "S3FileLocation": convertCfnWorkflowS3InputFileLocationPropertyToCloudFormation(properties.s3FileLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkflowS3FileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.S3FileLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3FileLocationProperty>();
  ret.addPropertyResult("s3FileLocation", "S3FileLocation", (properties.S3FileLocation != null ? CfnWorkflowS3InputFileLocationPropertyFromCloudFormation(properties.S3FileLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CopyStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CopyStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowCopyStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationFileLocation", CfnWorkflowS3FileLocationPropertyValidator)(properties.destinationFileLocation));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overwriteExisting", cdk.validateString)(properties.overwriteExisting));
  errors.collect(cdk.propertyValidator("sourceFileLocation", cdk.validateString)(properties.sourceFileLocation));
  return errors.wrap("supplied properties not correct for \"CopyStepDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowCopyStepDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowCopyStepDetailsPropertyValidator(properties).assertSuccess();
  return {
    "DestinationFileLocation": convertCfnWorkflowS3FileLocationPropertyToCloudFormation(properties.destinationFileLocation),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OverwriteExisting": cdk.stringToCloudFormation(properties.overwriteExisting),
    "SourceFileLocation": cdk.stringToCloudFormation(properties.sourceFileLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkflowCopyStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.CopyStepDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.CopyStepDetailsProperty>();
  ret.addPropertyResult("destinationFileLocation", "DestinationFileLocation", (properties.DestinationFileLocation != null ? CfnWorkflowS3FileLocationPropertyFromCloudFormation(properties.DestinationFileLocation) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overwriteExisting", "OverwriteExisting", (properties.OverwriteExisting != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteExisting) : undefined));
  ret.addPropertyResult("sourceFileLocation", "SourceFileLocation", (properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowCustomStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sourceFileLocation", cdk.validateString)(properties.sourceFileLocation));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("timeoutSeconds", cdk.validateNumber)(properties.timeoutSeconds));
  return errors.wrap("supplied properties not correct for \"CustomStepDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowCustomStepDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowCustomStepDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SourceFileLocation": cdk.stringToCloudFormation(properties.sourceFileLocation),
    "Target": cdk.stringToCloudFormation(properties.target),
    "TimeoutSeconds": cdk.numberToCloudFormation(properties.timeoutSeconds)
  };
}

// @ts-ignore TS6133
function CfnWorkflowCustomStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.CustomStepDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.CustomStepDetailsProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sourceFileLocation", "SourceFileLocation", (properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("timeoutSeconds", "TimeoutSeconds", (properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeleteStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DeleteStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowDeleteStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sourceFileLocation", cdk.validateString)(properties.sourceFileLocation));
  return errors.wrap("supplied properties not correct for \"DeleteStepDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowDeleteStepDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowDeleteStepDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SourceFileLocation": cdk.stringToCloudFormation(properties.sourceFileLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkflowDeleteStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflow.DeleteStepDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.DeleteStepDetailsProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sourceFileLocation", "SourceFileLocation", (properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3TagProperty`
 *
 * @param properties - the TypeScript properties of a `S3TagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowS3TagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"S3TagProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowS3TagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowS3TagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnWorkflowS3TagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.S3TagProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.S3TagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagStepDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `TagStepDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowTagStepDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sourceFileLocation", cdk.validateString)(properties.sourceFileLocation));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnWorkflowS3TagPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"TagStepDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowTagStepDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowTagStepDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SourceFileLocation": cdk.stringToCloudFormation(properties.sourceFileLocation),
    "Tags": cdk.listMapper(convertCfnWorkflowS3TagPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWorkflowTagStepDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.TagStepDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.TagStepDetailsProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sourceFileLocation", "SourceFileLocation", (properties.SourceFileLocation != null ? cfn_parse.FromCloudFormation.getString(properties.SourceFileLocation) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkflowS3TagPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}