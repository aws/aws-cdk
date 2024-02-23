/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::OpsWorksCM::Server` resource creates an AWS OpsWorks for Chef Automate or OpsWorks for Puppet Enterprise configuration management server.
 *
 * For more information, see [Create a Chef Automate Server in AWS CloudFormation](https://docs.aws.amazon.com/opsworks/latest/userguide/opscm-create-server-cfn.html) or [Create a Puppet Enterprise Master in AWS CloudFormation](https://docs.aws.amazon.com/opsworks/latest/userguide/opspup-create-server-cfn.html) in the *AWS OpsWorks User Guide* , and [CreateServer](https://docs.aws.amazon.com/opsworks-cm/latest/APIReference/API_CreateServer.html) in the *AWS OpsWorks CM API Reference* .
 *
 * @cloudformationResource AWS::OpsWorksCM::Server
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html
 */
export class CfnServer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorksCM::Server";

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
   * The Amazon Resource Name (ARN) of the server, such as `arn:aws:OpsWorksCM:us-east-1:123456789012:server/server-a1bzhi` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A DNS name that can be used to access the engine. Example: `myserver-asdfghjkl.us-east-1.opsworks.io` .
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * The name of the server.
   *
   * @cloudformationAttribute ServerName
   */
  public readonly attrServerName: string;

  /**
   * Associate a public IP address with a server that you are launching.
   */
  public associatePublicIpAddress?: boolean | cdk.IResolvable;

  /**
   * If you specify this field, AWS OpsWorks CM creates the server by using the backup represented by BackupId.
   */
  public backupId?: string;

  /**
   * The number of automated backups that you want to keep.
   */
  public backupRetentionCount?: number;

  /**
   * Supported on servers running Chef Automate 2.0 only. A PEM-formatted HTTPS certificate. The value can be be a single, self-signed certificate, or a certificate chain. If you specify a custom certificate, you must also specify values for `CustomDomain` and `CustomPrivateKey` . The following are requirements for the `CustomCertificate` value:.
   */
  public customCertificate?: string;

  /**
   * Supported on servers running Chef Automate 2.0 only. An optional public endpoint of a server, such as `https://aws.my-company.com` . To access the server, create a CNAME DNS record in your preferred DNS service that points the custom domain to the endpoint that is generated when the server is created (the value of the CreateServer Endpoint attribute). You cannot access the server by using the generated `Endpoint` value if the server is using a custom domain. If you specify a custom domain, you must also specify values for `CustomCertificate` and `CustomPrivateKey` .
   */
  public customDomain?: string;

  /**
   * Supported on servers running Chef Automate 2.0 only. A private key in PEM format for connecting to the server by using HTTPS. The private key must not be encrypted; it cannot be protected by a password or passphrase. If you specify a custom private key, you must also specify values for `CustomDomain` and `CustomCertificate` .
   */
  public customPrivateKey?: string;

  /**
   * Enable or disable scheduled backups.
   */
  public disableAutomatedBackup?: boolean | cdk.IResolvable;

  /**
   * The configuration management engine to use.
   */
  public engine?: string;

  /**
   * Optional engine attributes on a specified server.
   */
  public engineAttributes?: Array<CfnServer.EngineAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The engine model of the server.
   */
  public engineModel?: string;

  /**
   * The major release version of the engine that you want to use.
   */
  public engineVersion?: string;

  /**
   * The ARN of the instance profile that your Amazon EC2 instances use.
   */
  public instanceProfileArn: string;

  /**
   * The Amazon EC2 instance type to use.
   */
  public instanceType: string;

  /**
   * The Amazon EC2 key pair to set for the instance.
   */
  public keyPair?: string;

  /**
   * The start time for a one-hour period during which AWS OpsWorks CM backs up application-level data on your server if automated backups are enabled.
   */
  public preferredBackupWindow?: string;

  /**
   * The start time for a one-hour period each week during which AWS OpsWorks CM performs maintenance on the instance.
   */
  public preferredMaintenanceWindow?: string;

  /**
   * A list of security group IDs to attach to the Amazon EC2 instance.
   */
  public securityGroupIds?: Array<string>;

  public serverName?: string;

  /**
   * The service role that the AWS OpsWorks CM service backend uses to work with your account.
   */
  public serviceRoleArn: string;

  /**
   * The IDs of subnets in which to launch the server EC2 instance.
   */
  public subnetIds?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values to attach to an AWS OpsWorks for Chef Automate or OpsWorks for Puppet Enterprise server.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServerProps) {
    super(scope, id, {
      "type": CfnServer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceProfileArn", this);
    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "serviceRoleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrServerName = cdk.Token.asString(this.getAtt("ServerName", cdk.ResolutionTypeHint.STRING));
    this.associatePublicIpAddress = props.associatePublicIpAddress;
    this.backupId = props.backupId;
    this.backupRetentionCount = props.backupRetentionCount;
    this.customCertificate = props.customCertificate;
    this.customDomain = props.customDomain;
    this.customPrivateKey = props.customPrivateKey;
    this.disableAutomatedBackup = props.disableAutomatedBackup;
    this.engine = props.engine;
    this.engineAttributes = props.engineAttributes;
    this.engineModel = props.engineModel;
    this.engineVersion = props.engineVersion;
    this.instanceProfileArn = props.instanceProfileArn;
    this.instanceType = props.instanceType;
    this.keyPair = props.keyPair;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.securityGroupIds = props.securityGroupIds;
    this.serverName = props.serverName;
    this.serviceRoleArn = props.serviceRoleArn;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpsWorksCM::Server", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associatePublicIpAddress": this.associatePublicIpAddress,
      "backupId": this.backupId,
      "backupRetentionCount": this.backupRetentionCount,
      "customCertificate": this.customCertificate,
      "customDomain": this.customDomain,
      "customPrivateKey": this.customPrivateKey,
      "disableAutomatedBackup": this.disableAutomatedBackup,
      "engine": this.engine,
      "engineAttributes": this.engineAttributes,
      "engineModel": this.engineModel,
      "engineVersion": this.engineVersion,
      "instanceProfileArn": this.instanceProfileArn,
      "instanceType": this.instanceType,
      "keyPair": this.keyPair,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "securityGroupIds": this.securityGroupIds,
      "serverName": this.serverName,
      "serviceRoleArn": this.serviceRoleArn,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags()
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
   * The `EngineAttribute` property type specifies administrator credentials for an AWS OpsWorks for Chef Automate or OpsWorks for Puppet Enterprise server.
   *
   * `EngineAttribute` is a property of the `AWS::OpsWorksCM::Server` resource type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworkscm-server-engineattribute.html
   */
  export interface EngineAttributeProperty {
    /**
     * The name of the engine attribute.
     *
     * *Attribute name for Chef Automate servers:*
     *
     * - `CHEF_AUTOMATE_ADMIN_PASSWORD`
     *
     * *Attribute names for Puppet Enterprise servers:*
     *
     * - `PUPPET_ADMIN_PASSWORD`
     * - `PUPPET_R10K_REMOTE`
     * - `PUPPET_R10K_PRIVATE_KEY`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworkscm-server-engineattribute.html#cfn-opsworkscm-server-engineattribute-name
     */
    readonly name?: string;

    /**
     * The value of the engine attribute.
     *
     * *Attribute value for Chef Automate servers:*
     *
     * - `CHEF_AUTOMATE_PIVOTAL_KEY` : A base64-encoded RSA public key. The corresponding private key is required to access the Chef API. You can generate this key by running the following [OpenSSL](https://docs.aws.amazon.com/https://www.openssl.org/) command on Linux-based computers.
     *
     * `openssl genrsa -out *pivotal_key_file_name* .pem 2048`
     *
     * On Windows-based computers, you can use the PuTTYgen utility to generate a base64-encoded RSA private key. For more information, see [PuTTYgen - Key Generator for PuTTY on Windows](https://docs.aws.amazon.com/https://www.ssh.com/ssh/putty/windows/puttygen) on SSH.com.
     *
     * *Attribute values for Puppet Enterprise servers:*
     *
     * - `PUPPET_ADMIN_PASSWORD` : An administrator password that you can use to sign in to the Puppet Enterprise console webpage after the server is online. The password must use between 8 and 32 ASCII characters.
     * - `PUPPET_R10K_REMOTE` : The r10k remote is the URL of your control repository (for example, ssh://git@your.git-repo.com:user/control-repo.git). Specifying an r10k remote opens TCP port 8170.
     * - `PUPPET_R10K_PRIVATE_KEY` : If you are using a private Git repository, add `PUPPET_R10K_PRIVATE_KEY` to specify a PEM-encoded private SSH key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworkscm-server-engineattribute.html#cfn-opsworkscm-server-engineattribute-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnServer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html
 */
export interface CfnServerProps {
  /**
   * Associate a public IP address with a server that you are launching.
   *
   * Valid values are `true` or `false` . The default value is `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-associatepublicipaddress
   */
  readonly associatePublicIpAddress?: boolean | cdk.IResolvable;

  /**
   * If you specify this field, AWS OpsWorks CM creates the server by using the backup represented by BackupId.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-backupid
   */
  readonly backupId?: string;

  /**
   * The number of automated backups that you want to keep.
   *
   * Whenever a new backup is created, AWS OpsWorks CM deletes the oldest backups if this number is exceeded. The default value is `1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-backupretentioncount
   */
  readonly backupRetentionCount?: number;

  /**
   * Supported on servers running Chef Automate 2.0 only. A PEM-formatted HTTPS certificate. The value can be be a single, self-signed certificate, or a certificate chain. If you specify a custom certificate, you must also specify values for `CustomDomain` and `CustomPrivateKey` . The following are requirements for the `CustomCertificate` value:.
   *
   * - You can provide either a self-signed, custom certificate, or the full certificate chain.
   * - The certificate must be a valid X509 certificate, or a certificate chain in PEM format.
   * - The certificate must be valid at the time of upload. A certificate can't be used before its validity period begins (the certificate's `NotBefore` date), or after it expires (the certificate's `NotAfter` date).
   * - The certificate’s common name or subject alternative names (SANs), if present, must match the value of `CustomDomain` .
   * - The certificate must match the value of `CustomPrivateKey` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-customcertificate
   */
  readonly customCertificate?: string;

  /**
   * Supported on servers running Chef Automate 2.0 only. An optional public endpoint of a server, such as `https://aws.my-company.com` . To access the server, create a CNAME DNS record in your preferred DNS service that points the custom domain to the endpoint that is generated when the server is created (the value of the CreateServer Endpoint attribute). You cannot access the server by using the generated `Endpoint` value if the server is using a custom domain. If you specify a custom domain, you must also specify values for `CustomCertificate` and `CustomPrivateKey` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-customdomain
   */
  readonly customDomain?: string;

  /**
   * Supported on servers running Chef Automate 2.0 only. A private key in PEM format for connecting to the server by using HTTPS. The private key must not be encrypted; it cannot be protected by a password or passphrase. If you specify a custom private key, you must also specify values for `CustomDomain` and `CustomCertificate` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-customprivatekey
   */
  readonly customPrivateKey?: string;

  /**
   * Enable or disable scheduled backups.
   *
   * Valid values are `true` or `false` . The default value is `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-disableautomatedbackup
   */
  readonly disableAutomatedBackup?: boolean | cdk.IResolvable;

  /**
   * The configuration management engine to use.
   *
   * Valid values include `ChefAutomate` and `Puppet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-engine
   */
  readonly engine?: string;

  /**
   * Optional engine attributes on a specified server.
   *
   * **Attributes accepted in a Chef createServer request:** - `CHEF_AUTOMATE_PIVOTAL_KEY` : A base64-encoded RSA public key. The corresponding private key is required to access the Chef API. When no CHEF_AUTOMATE_PIVOTAL_KEY is set, a private key is generated and returned in the response. When you are specifying the value of CHEF_AUTOMATE_PIVOTAL_KEY as a parameter in the AWS CloudFormation console, you must add newline ( `\n` ) characters at the end of each line of the pivotal key value.
   * - `CHEF_AUTOMATE_ADMIN_PASSWORD` : The password for the administrative user in the Chef Automate web-based dashboard. The password length is a minimum of eight characters, and a maximum of 32. The password can contain letters, numbers, and special characters (!/@#$%^&+=_). The password must contain at least one lower case letter, one upper case letter, one number, and one special character. When no CHEF_AUTOMATE_ADMIN_PASSWORD is set, one is generated and returned in the response.
   *
   * **Attributes accepted in a Puppet createServer request:** - `PUPPET_ADMIN_PASSWORD` : To work with the Puppet Enterprise console, a password must use ASCII characters.
   * - `PUPPET_R10K_REMOTE` : The r10k remote is the URL of your control repository (for example, ssh://git@your.git-repo.com:user/control-repo.git). Specifying an r10k remote opens TCP port 8170.
   * - `PUPPET_R10K_PRIVATE_KEY` : If you are using a private Git repository, add PUPPET_R10K_PRIVATE_KEY to specify a PEM-encoded private SSH key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-engineattributes
   */
  readonly engineAttributes?: Array<CfnServer.EngineAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The engine model of the server.
   *
   * Valid values in this release include `Monolithic` for Puppet and `Single` for Chef.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-enginemodel
   */
  readonly engineModel?: string;

  /**
   * The major release version of the engine that you want to use.
   *
   * For a Chef server, the valid value for EngineVersion is currently `2` . For a Puppet server, valid values are `2019` or `2017` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-engineversion
   */
  readonly engineVersion?: string;

  /**
   * The ARN of the instance profile that your Amazon EC2 instances use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-instanceprofilearn
   */
  readonly instanceProfileArn: string;

  /**
   * The Amazon EC2 instance type to use.
   *
   * For example, `m5.large` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-instancetype
   */
  readonly instanceType: string;

  /**
   * The Amazon EC2 key pair to set for the instance.
   *
   * This parameter is optional; if desired, you may specify this parameter to connect to your instances by using SSH.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-keypair
   */
  readonly keyPair?: string;

  /**
   * The start time for a one-hour period during which AWS OpsWorks CM backs up application-level data on your server if automated backups are enabled.
   *
   * Valid values must be specified in one of the following formats:
   *
   * - `HH:MM` for daily backups
   * - `DDD:HH:MM` for weekly backups
   *
   * `MM` must be specified as `00` . The specified time is in coordinated universal time (UTC). The default value is a random, daily start time.
   *
   * *Example:* `08:00` , which represents a daily start time of 08:00 UTC.
   *
   * *Example:* `Mon:08:00` , which represents a start time of every Monday at 08:00 UTC. (8:00 a.m.)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * The start time for a one-hour period each week during which AWS OpsWorks CM performs maintenance on the instance.
   *
   * Valid values must be specified in the following format: `DDD:HH:MM` . `MM` must be specified as `00` . The specified time is in coordinated universal time (UTC). The default value is a random one-hour period on Tuesday, Wednesday, or Friday. See `TimeWindowDefinition` for more information.
   *
   * *Example:* `Mon:08:00` , which represents a start time of every Monday at 08:00 UTC. (8:00 a.m.)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * A list of security group IDs to attach to the Amazon EC2 instance.
   *
   * If you add this parameter, the specified security groups must be within the VPC that is specified by `SubnetIds` .
   *
   * If you do not specify this parameter, AWS OpsWorks CM creates one new security group that uses TCP ports 22 and 443, open to 0.0.0.0/0 (everyone).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-servername
   */
  readonly serverName?: string;

  /**
   * The service role that the AWS OpsWorks CM service backend uses to work with your account.
   *
   * Although the AWS OpsWorks management console typically creates the service role for you, if you are using the AWS CLI or API commands, run the service-role-creation.yaml AWS CloudFormation template, located at https://s3.amazonaws.com/opsworks-cm-us-east-1-prod-default-assets/misc/opsworks-cm-roles.yaml. This template creates a CloudFormation stack that includes the service role and instance profile that you need.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-servicerolearn
   */
  readonly serviceRoleArn: string;

  /**
   * The IDs of subnets in which to launch the server EC2 instance.
   *
   * Amazon EC2-Classic customers: This field is required. All servers must run within a VPC. The VPC must have "Auto Assign Public IP" enabled.
   *
   * EC2-VPC customers: This field is optional. If you do not specify subnet IDs, your EC2 instances are created in a default subnet that is selected by Amazon EC2. If you specify subnet IDs, the VPC must have "Auto Assign Public IP" enabled.
   *
   * For more information about supported Amazon EC2 platforms, see [Supported Platforms](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-supported-platforms.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * A map that contains tag keys and tag values to attach to an AWS OpsWorks for Chef Automate or OpsWorks for Puppet Enterprise server.
   *
   * - The key cannot be empty.
   * - The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : / @`
   * - The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : / @`
   * - Leading and trailing spaces are trimmed from both the key and value.
   * - A maximum of 50 user-applied tags is allowed for any AWS OpsWorks CM server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworkscm-server.html#cfn-opsworkscm-server-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EngineAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `EngineAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerEngineAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EngineAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerEngineAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerEngineAttributePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnServerEngineAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServer.EngineAttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServer.EngineAttributeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
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
  errors.collect(cdk.propertyValidator("associatePublicIpAddress", cdk.validateBoolean)(properties.associatePublicIpAddress));
  errors.collect(cdk.propertyValidator("backupId", cdk.validateString)(properties.backupId));
  errors.collect(cdk.propertyValidator("backupRetentionCount", cdk.validateNumber)(properties.backupRetentionCount));
  errors.collect(cdk.propertyValidator("customCertificate", cdk.validateString)(properties.customCertificate));
  errors.collect(cdk.propertyValidator("customDomain", cdk.validateString)(properties.customDomain));
  errors.collect(cdk.propertyValidator("customPrivateKey", cdk.validateString)(properties.customPrivateKey));
  errors.collect(cdk.propertyValidator("disableAutomatedBackup", cdk.validateBoolean)(properties.disableAutomatedBackup));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("engineAttributes", cdk.listValidator(CfnServerEngineAttributePropertyValidator))(properties.engineAttributes));
  errors.collect(cdk.propertyValidator("engineModel", cdk.validateString)(properties.engineModel));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("instanceProfileArn", cdk.requiredValidator)(properties.instanceProfileArn));
  errors.collect(cdk.propertyValidator("instanceProfileArn", cdk.validateString)(properties.instanceProfileArn));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("keyPair", cdk.validateString)(properties.keyPair));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("serverName", cdk.validateString)(properties.serverName));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.requiredValidator)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServerProps\"");
}

// @ts-ignore TS6133
function convertCfnServerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerPropsValidator(properties).assertSuccess();
  return {
    "AssociatePublicIpAddress": cdk.booleanToCloudFormation(properties.associatePublicIpAddress),
    "BackupId": cdk.stringToCloudFormation(properties.backupId),
    "BackupRetentionCount": cdk.numberToCloudFormation(properties.backupRetentionCount),
    "CustomCertificate": cdk.stringToCloudFormation(properties.customCertificate),
    "CustomDomain": cdk.stringToCloudFormation(properties.customDomain),
    "CustomPrivateKey": cdk.stringToCloudFormation(properties.customPrivateKey),
    "DisableAutomatedBackup": cdk.booleanToCloudFormation(properties.disableAutomatedBackup),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "EngineAttributes": cdk.listMapper(convertCfnServerEngineAttributePropertyToCloudFormation)(properties.engineAttributes),
    "EngineModel": cdk.stringToCloudFormation(properties.engineModel),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "InstanceProfileArn": cdk.stringToCloudFormation(properties.instanceProfileArn),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "KeyPair": cdk.stringToCloudFormation(properties.keyPair),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "ServerName": cdk.stringToCloudFormation(properties.serverName),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("associatePublicIpAddress", "AssociatePublicIpAddress", (properties.AssociatePublicIpAddress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AssociatePublicIpAddress) : undefined));
  ret.addPropertyResult("backupId", "BackupId", (properties.BackupId != null ? cfn_parse.FromCloudFormation.getString(properties.BackupId) : undefined));
  ret.addPropertyResult("backupRetentionCount", "BackupRetentionCount", (properties.BackupRetentionCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionCount) : undefined));
  ret.addPropertyResult("customCertificate", "CustomCertificate", (properties.CustomCertificate != null ? cfn_parse.FromCloudFormation.getString(properties.CustomCertificate) : undefined));
  ret.addPropertyResult("customDomain", "CustomDomain", (properties.CustomDomain != null ? cfn_parse.FromCloudFormation.getString(properties.CustomDomain) : undefined));
  ret.addPropertyResult("customPrivateKey", "CustomPrivateKey", (properties.CustomPrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomPrivateKey) : undefined));
  ret.addPropertyResult("disableAutomatedBackup", "DisableAutomatedBackup", (properties.DisableAutomatedBackup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableAutomatedBackup) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("engineAttributes", "EngineAttributes", (properties.EngineAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnServerEngineAttributePropertyFromCloudFormation)(properties.EngineAttributes) : undefined));
  ret.addPropertyResult("engineModel", "EngineModel", (properties.EngineModel != null ? cfn_parse.FromCloudFormation.getString(properties.EngineModel) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("instanceProfileArn", "InstanceProfileArn", (properties.InstanceProfileArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceProfileArn) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("keyPair", "KeyPair", (properties.KeyPair != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPair) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("serverName", "ServerName", (properties.ServerName != null ? cfn_parse.FromCloudFormation.getString(properties.ServerName) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}