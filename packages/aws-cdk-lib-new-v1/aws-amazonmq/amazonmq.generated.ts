/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A *broker* is a message broker environment running on Amazon MQ .
 *
 * It is the basic building block of Amazon MQ .
 *
 * The `AWS::AmazonMQ::Broker` resource lets you create Amazon MQ for ActiveMQ and Amazon MQ for RabbitMQ brokers, add configuration changes or modify users for a speified ActiveMQ broker, return information about the specified broker, and delete the broker. For more information, see [How Amazon MQ works](https://docs.aws.amazon.com//amazon-mq/latest/developer-guide/amazon-mq-how-it-works.html) in the *Amazon MQ Developer Guide* .
 *
 * - `ec2:CreateNetworkInterface`
 *
 * This permission is required to allow Amazon MQ to create an elastic network interface (ENI) on behalf of your account.
 * - `ec2:CreateNetworkInterfacePermission`
 *
 * This permission is required to attach the ENI to the broker instance.
 * - `ec2:DeleteNetworkInterface`
 * - `ec2:DeleteNetworkInterfacePermission`
 * - `ec2:DetachNetworkInterface`
 * - `ec2:DescribeInternetGateways`
 * - `ec2:DescribeNetworkInterfaces`
 * - `ec2:DescribeNetworkInterfacePermissions`
 * - `ec2:DescribeRouteTables`
 * - `ec2:DescribeSecurityGroups`
 * - `ec2:DescribeSubnets`
 * - `ec2:DescribeVpcs`
 *
 * @cloudformationResource AWS::AmazonMQ::Broker
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html
 */
export class CfnBroker extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmazonMQ::Broker";

  /**
   * Build a CfnBroker from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBroker {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBrokerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBroker(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The AMQP endpoints of each broker instance as a list of strings.
   *
   * `amqp+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:5671`
   *
   * @cloudformationAttribute AmqpEndpoints
   */
  public readonly attrAmqpEndpoints: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the Amazon MQ broker.
   *
   * `arn:aws:mq:us-east-2:123456789012:broker:MyBroker:b-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique ID that Amazon MQ generates for the configuration.
   *
   * `c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
   *
   * @cloudformationAttribute ConfigurationId
   */
  public readonly attrConfigurationId: string;

  /**
   * The revision number of the configuration.
   *
   * `1`
   *
   * @cloudformationAttribute ConfigurationRevision
   */
  public readonly attrConfigurationRevision: number;

  /**
   * Required. The unique ID that Amazon MQ generates for the configuration.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The IP addresses of each broker instance as a list of strings. Does not apply to RabbitMQ brokers.
   *
   * `['198.51.100.2', '203.0.113.9']`
   *
   * @cloudformationAttribute IpAddresses
   */
  public readonly attrIpAddresses: Array<string>;

  /**
   * The MQTT endpoints of each broker instance as a list of strings.
   *
   * `mqtt+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:8883`
   *
   * @cloudformationAttribute MqttEndpoints
   */
  public readonly attrMqttEndpoints: Array<string>;

  /**
   * The OpenWire endpoints of each broker instance as a list of strings.
   *
   * `ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61617`
   *
   * @cloudformationAttribute OpenWireEndpoints
   */
  public readonly attrOpenWireEndpoints: Array<string>;

  /**
   * The STOMP endpoints of each broker instance as a list of strings.
   *
   * `stomp+ssl://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61614`
   *
   * @cloudformationAttribute StompEndpoints
   */
  public readonly attrStompEndpoints: Array<string>;

  /**
   * The WSS endpoints of each broker instance as a list of strings.
   *
   * `wss://b-4aada85d-a80c-4be0-9d30-e344a01b921e-1.mq.eu-central-amazonaws.com:61619`
   *
   * @cloudformationAttribute WssEndpoints
   */
  public readonly attrWssEndpoints: Array<string>;

  /**
   * Optional.
   */
  public authenticationStrategy?: string;

  /**
   * Enables automatic upgrades to new minor versions for brokers, as new broker engine versions are released and supported by Amazon MQ.
   */
  public autoMinorVersionUpgrade: boolean | cdk.IResolvable;

  /**
   * The name of the broker.
   */
  public brokerName: string;

  /**
   * A list of information about the configuration.
   */
  public configuration?: CfnBroker.ConfigurationIdProperty | cdk.IResolvable;

  /**
   * Defines whether this broker is a part of a data replication pair.
   */
  public dataReplicationMode?: string;

  /**
   * The Amazon Resource Name (ARN) of the primary broker that is used to replicate data from in a data replication pair, and is applied to the replica broker.
   */
  public dataReplicationPrimaryBrokerArn?: string;

  /**
   * The deployment mode of the broker. Available values:.
   */
  public deploymentMode: string;

  /**
   * Encryption options for the broker.
   */
  public encryptionOptions?: CfnBroker.EncryptionOptionsProperty | cdk.IResolvable;

  /**
   * The type of broker engine.
   */
  public engineType: string;

  /**
   * The version of the broker engine.
   */
  public engineVersion: string;

  /**
   * The broker's instance type.
   */
  public hostInstanceType: string;

  /**
   * Optional.
   */
  public ldapServerMetadata?: cdk.IResolvable | CfnBroker.LdapServerMetadataProperty;

  /**
   * Enables Amazon CloudWatch logging for brokers.
   */
  public logs?: cdk.IResolvable | CfnBroker.LogListProperty;

  /**
   * The scheduled time period relative to UTC during which Amazon MQ begins to apply pending updates or patches to the broker.
   */
  public maintenanceWindowStartTime?: cdk.IResolvable | CfnBroker.MaintenanceWindowProperty;

  /**
   * Enables connections from applications outside of the VPC that hosts the broker's subnets.
   */
  public publiclyAccessible: boolean | cdk.IResolvable;

  /**
   * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
   */
  public securityGroups?: Array<string>;

  /**
   * The broker's storage type.
   */
  public storageType?: string;

  /**
   * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones.
   */
  public subnetIds?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs.
   */
  public tagsRaw?: Array<CfnBroker.TagsEntryProperty>;

  /**
   * The list of broker users (persons or applications) who can access queues and topics.
   */
  public users: Array<cdk.IResolvable | CfnBroker.UserProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBrokerProps) {
    super(scope, id, {
      "type": CfnBroker.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoMinorVersionUpgrade", this);
    cdk.requireProperty(props, "brokerName", this);
    cdk.requireProperty(props, "deploymentMode", this);
    cdk.requireProperty(props, "engineType", this);
    cdk.requireProperty(props, "engineVersion", this);
    cdk.requireProperty(props, "hostInstanceType", this);
    cdk.requireProperty(props, "publiclyAccessible", this);
    cdk.requireProperty(props, "users", this);

    this.attrAmqpEndpoints = cdk.Token.asList(this.getAtt("AmqpEndpoints", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrConfigurationId = cdk.Token.asString(this.getAtt("ConfigurationId", cdk.ResolutionTypeHint.STRING));
    this.attrConfigurationRevision = cdk.Token.asNumber(this.getAtt("ConfigurationRevision", cdk.ResolutionTypeHint.NUMBER));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrIpAddresses = cdk.Token.asList(this.getAtt("IpAddresses", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrMqttEndpoints = cdk.Token.asList(this.getAtt("MqttEndpoints", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrOpenWireEndpoints = cdk.Token.asList(this.getAtt("OpenWireEndpoints", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrStompEndpoints = cdk.Token.asList(this.getAtt("StompEndpoints", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrWssEndpoints = cdk.Token.asList(this.getAtt("WssEndpoints", cdk.ResolutionTypeHint.STRING_LIST));
    this.authenticationStrategy = props.authenticationStrategy;
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.brokerName = props.brokerName;
    this.configuration = props.configuration;
    this.dataReplicationMode = props.dataReplicationMode;
    this.dataReplicationPrimaryBrokerArn = props.dataReplicationPrimaryBrokerArn;
    this.deploymentMode = props.deploymentMode;
    this.encryptionOptions = props.encryptionOptions;
    this.engineType = props.engineType;
    this.engineVersion = props.engineVersion;
    this.hostInstanceType = props.hostInstanceType;
    this.ldapServerMetadata = props.ldapServerMetadata;
    this.logs = props.logs;
    this.maintenanceWindowStartTime = props.maintenanceWindowStartTime;
    this.publiclyAccessible = props.publiclyAccessible;
    this.securityGroups = props.securityGroups;
    this.storageType = props.storageType;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AmazonMQ::Broker", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.users = props.users;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authenticationStrategy": this.authenticationStrategy,
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "brokerName": this.brokerName,
      "configuration": this.configuration,
      "dataReplicationMode": this.dataReplicationMode,
      "dataReplicationPrimaryBrokerArn": this.dataReplicationPrimaryBrokerArn,
      "deploymentMode": this.deploymentMode,
      "encryptionOptions": this.encryptionOptions,
      "engineType": this.engineType,
      "engineVersion": this.engineVersion,
      "hostInstanceType": this.hostInstanceType,
      "ldapServerMetadata": this.ldapServerMetadata,
      "logs": this.logs,
      "maintenanceWindowStartTime": this.maintenanceWindowStartTime,
      "publiclyAccessible": this.publiclyAccessible,
      "securityGroups": this.securityGroups,
      "storageType": this.storageType,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags(),
      "users": this.users
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBroker.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBrokerPropsToCloudFormation(props);
  }
}

export namespace CfnBroker {
  /**
   * A list of information about the configuration.
   *
   * > Does not apply to RabbitMQ brokers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html
   */
  export interface ConfigurationIdProperty {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html#cfn-amazonmq-broker-configurationid-id
     */
    readonly id: string;

    /**
     * The revision number of the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-configurationid.html#cfn-amazonmq-broker-configurationid-revision
     */
    readonly revision: number;
  }

  /**
   * The parameters that determine the `WeeklyStartTime` to apply pending updates or patches to the broker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html
   */
  export interface MaintenanceWindowProperty {
    /**
     * The day of the week.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-dayofweek
     */
    readonly dayOfWeek: string;

    /**
     * The time, in 24-hour format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-timeofday
     */
    readonly timeOfDay: string;

    /**
     * The time zone, UTC by default, in either the Country/City format, or the UTC offset format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-maintenancewindow.html#cfn-amazonmq-broker-maintenancewindow-timezone
     */
    readonly timeZone: string;
  }

  /**
   * The list of broker users (persons or applications) who can access queues and topics.
   *
   * For Amazon MQ for RabbitMQ brokers, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent broker users are created via the RabbitMQ web console or by using the RabbitMQ management API.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html
   */
  export interface UserProperty {
    /**
     * Enables access to the ActiveMQ web console for the ActiveMQ user.
     *
     * Does not apply to RabbitMQ brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-consoleaccess
     */
    readonly consoleAccess?: boolean | cdk.IResolvable;

    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs.
     *
     * This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long. Does not apply to RabbitMQ brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-groups
     */
    readonly groups?: Array<string>;

    /**
     * The password of the user.
     *
     * This value must be at least 12 characters long, must contain at least 4 unique characters, and must not contain commas, colons, or equal signs (,:=).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-password
     */
    readonly password: string;

    /**
     * The username of the broker user.
     *
     * For Amazon MQ for ActiveMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). For Amazon MQ for RabbitMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores (- . _). This value must not contain a tilde (~) character. Amazon MQ prohibts using guest as a valid usename. This value must be 2-100 characters long.
     *
     * > Do not add personally identifiable information (PII) or other confidential or sensitive information in broker usernames. Broker usernames are accessible to other AWS services, including CloudWatch Logs . Broker usernames are not intended to be used for private or sensitive data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-user.html#cfn-amazonmq-broker-user-username
     */
    readonly username: string;
  }

  /**
   * The list of information about logs to be enabled for the specified broker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html
   */
  export interface LogListProperty {
    /**
     * Enables audit logging.
     *
     * Every user management action made using JMX or the ActiveMQ Web Console is logged. Does not apply to RabbitMQ brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html#cfn-amazonmq-broker-loglist-audit
     */
    readonly audit?: boolean | cdk.IResolvable;

    /**
     * Enables general logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-loglist.html#cfn-amazonmq-broker-loglist-general
     */
    readonly general?: boolean | cdk.IResolvable;
  }

  /**
   * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker.
   *
   * > Does not apply to RabbitMQ brokers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html
   */
  export interface LdapServerMetadataProperty {
    /**
     * Specifies the location of the LDAP server such as AWS Directory Service for Microsoft Active Directory .
     *
     * Optional failover server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-hosts
     */
    readonly hosts: Array<string>;

    /**
     * The distinguished name of the node in the directory information tree (DIT) to search for roles or groups.
     *
     * For example, `ou=group` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolebase
     */
    readonly roleBase: string;

    /**
     * The group name attribute in a role entry whose value is the name of that role.
     *
     * For example, you can specify `cn` for a group entry's common name. If authentication succeeds, then the user is assigned the the value of the `cn` attribute for each role entry that they are a member of.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolename
     */
    readonly roleName?: string;

    /**
     * The LDAP search filter used to find roles within the roleBase.
     *
     * The distinguished name of the user matched by userSearchMatching is substituted into the `{0}` placeholder in the search filter. The client's username is substituted into the `{1}` placeholder. For example, if you set this option to `(member=uid={1})` for the user janedoe, the search filter becomes `(member=uid=janedoe)` after string substitution. It matches all role entries that have a member attribute equal to `uid=janedoe` under the subtree selected by the `RoleBases` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolesearchmatching
     */
    readonly roleSearchMatching: string;

    /**
     * The directory search scope for the role.
     *
     * If set to true, scope is to search the entire subtree.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-rolesearchsubtree
     */
    readonly roleSearchSubtree?: boolean | cdk.IResolvable;

    /**
     * Service account password.
     *
     * A service account is an account in your LDAP server that has access to initiate a connection. For example, `cn=admin` , `dc=corp` , `dc=example` , `dc=com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-serviceaccountpassword
     */
    readonly serviceAccountPassword: string;

    /**
     * Service account username.
     *
     * A service account is an account in your LDAP server that has access to initiate a connection. For example, `cn=admin` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-serviceaccountusername
     */
    readonly serviceAccountUsername: string;

    /**
     * Select a particular subtree of the directory information tree (DIT) to search for user entries.
     *
     * The subtree is specified by a DN, which specifies the base node of the subtree. For example, by setting this option to `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` , the search for user entries is restricted to the subtree beneath `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-userbase
     */
    readonly userBase: string;

    /**
     * The name of the LDAP attribute in the user's directory entry for the user's group membership.
     *
     * In some cases, user roles may be identified by the value of an attribute in the user's directory entry. The `UserRoleName` option allows you to provide the name of this attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-userrolename
     */
    readonly userRoleName?: string;

    /**
     * The LDAP search filter used to find users within the `userBase` .
     *
     * The client's username is substituted into the `{0}` placeholder in the search filter. For example, if this option is set to `(uid={0})` and the received username is `janedoe` , the search filter becomes `(uid=janedoe)` after string substitution. It will result in matching an entry like `uid=janedoe` , `ou=Users` , `ou=corp` , `dc=corp` , `dc=example` , `dc=com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-usersearchmatching
     */
    readonly userSearchMatching: string;

    /**
     * The directory search scope for the user.
     *
     * If set to true, scope is to search the entire subtree.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-ldapservermetadata.html#cfn-amazonmq-broker-ldapservermetadata-usersearchsubtree
     */
    readonly userSearchSubtree?: boolean | cdk.IResolvable;
  }

  /**
   * Encryption options for the broker.
   *
   * > Does not apply to RabbitMQ brokers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html
   */
  export interface EncryptionOptionsProperty {
    /**
     * The customer master key (CMK) to use for the A AWS KMS (KMS).
     *
     * This key is used to encrypt your data at rest. If not provided, Amazon MQ will use a default CMK to encrypt your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html#cfn-amazonmq-broker-encryptionoptions-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Enables the use of an AWS owned CMK using AWS KMS (KMS).
     *
     * Set to `true` by default, if no value is provided, for example, for RabbitMQ brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-encryptionoptions.html#cfn-amazonmq-broker-encryptionoptions-useawsownedkey
     */
    readonly useAwsOwnedKey: boolean | cdk.IResolvable;
  }

  /**
   * A key-value pair to associate with the broker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The key in a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html#cfn-amazonmq-broker-tagsentry-key
     */
    readonly key: string;

    /**
     * The value in a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-broker-tagsentry.html#cfn-amazonmq-broker-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnBroker`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html
 */
export interface CfnBrokerProps {
  /**
   * Optional.
   *
   * The authentication strategy used to secure the broker. The default is `SIMPLE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-authenticationstrategy
   */
  readonly authenticationStrategy?: string;

  /**
   * Enables automatic upgrades to new minor versions for brokers, as new broker engine versions are released and supported by Amazon MQ.
   *
   * Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade: boolean | cdk.IResolvable;

  /**
   * The name of the broker.
   *
   * This value must be unique in your AWS account , 1-50 characters long, must contain only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
   *
   * > Do not add personally identifiable information (PII) or other confidential or sensitive information in broker names. Broker names are accessible to other AWS services, including C CloudWatch Logs . Broker names are not intended to be used for private or sensitive data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-brokername
   */
  readonly brokerName: string;

  /**
   * A list of information about the configuration.
   *
   * Does not apply to RabbitMQ brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-configuration
   */
  readonly configuration?: CfnBroker.ConfigurationIdProperty | cdk.IResolvable;

  /**
   * Defines whether this broker is a part of a data replication pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-datareplicationmode
   */
  readonly dataReplicationMode?: string;

  /**
   * The Amazon Resource Name (ARN) of the primary broker that is used to replicate data from in a data replication pair, and is applied to the replica broker.
   *
   * Must be set when dataReplicationMode is set to CRDR.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-datareplicationprimarybrokerarn
   */
  readonly dataReplicationPrimaryBrokerArn?: string;

  /**
   * The deployment mode of the broker. Available values:.
   *
   * - `SINGLE_INSTANCE`
   * - `ACTIVE_STANDBY_MULTI_AZ`
   * - `CLUSTER_MULTI_AZ`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-deploymentmode
   */
  readonly deploymentMode: string;

  /**
   * Encryption options for the broker.
   *
   * Does not apply to RabbitMQ brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-encryptionoptions
   */
  readonly encryptionOptions?: CfnBroker.EncryptionOptionsProperty | cdk.IResolvable;

  /**
   * The type of broker engine.
   *
   * Currently, Amazon MQ supports `ACTIVEMQ` and `RABBITMQ` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-enginetype
   */
  readonly engineType: string;

  /**
   * The version of the broker engine.
   *
   * For a list of supported engine versions, see [Engine](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html) in the *Amazon MQ Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-engineversion
   */
  readonly engineVersion: string;

  /**
   * The broker's instance type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-hostinstancetype
   */
  readonly hostInstanceType: string;

  /**
   * Optional.
   *
   * The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-ldapservermetadata
   */
  readonly ldapServerMetadata?: cdk.IResolvable | CfnBroker.LdapServerMetadataProperty;

  /**
   * Enables Amazon CloudWatch logging for brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-logs
   */
  readonly logs?: cdk.IResolvable | CfnBroker.LogListProperty;

  /**
   * The scheduled time period relative to UTC during which Amazon MQ begins to apply pending updates or patches to the broker.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-maintenancewindowstarttime
   */
  readonly maintenanceWindowStartTime?: cdk.IResolvable | CfnBroker.MaintenanceWindowProperty;

  /**
   * Enables connections from applications outside of the VPC that hosts the broker's subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-publiclyaccessible
   */
  readonly publiclyAccessible: boolean | cdk.IResolvable;

  /**
   * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-securitygroups
   */
  readonly securityGroups?: Array<string>;

  /**
   * The broker's storage type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-storagetype
   */
  readonly storageType?: string;

  /**
   * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones.
   *
   * If you specify more than one subnet, the subnets must be in different Availability Zones. Amazon MQ will not be able to create VPC endpoints for your broker with multiple subnets in the same Availability Zone. A SINGLE_INSTANCE deployment requires one subnet (for example, the default subnet). An ACTIVE_STANDBY_MULTI_AZ deployment (ACTIVEMQ) requires two subnets. A CLUSTER_MULTI_AZ deployment (RABBITMQ) has no subnet requirements when deployed with public accessibility, deployment without public accessibility requires at least one subnet.
   *
   * > If you specify subnets in a shared VPC for a RabbitMQ broker, the associated VPC to which the specified subnets belong must be owned by your AWS account . Amazon MQ will not be able to create VPC enpoints in VPCs that are not owned by your AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * An array of key-value pairs.
   *
   * For more information, see [Using Cost Allocation Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) in the *Billing and Cost Management User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-tags
   */
  readonly tags?: Array<CfnBroker.TagsEntryProperty>;

  /**
   * The list of broker users (persons or applications) who can access queues and topics.
   *
   * For Amazon MQ for RabbitMQ brokers, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent RabbitMQ users are created by via the RabbitMQ web console or by using the RabbitMQ management API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-users
   */
  readonly users: Array<cdk.IResolvable | CfnBroker.UserProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConfigurationIdProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerConfigurationIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  return errors.wrap("supplied properties not correct for \"ConfigurationIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerConfigurationIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerConfigurationIdPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Revision": cdk.numberToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnBrokerConfigurationIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.ConfigurationIdProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.ConfigurationIdProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerMaintenanceWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.requiredValidator)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.validateString)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("timeOfDay", cdk.requiredValidator)(properties.timeOfDay));
  errors.collect(cdk.propertyValidator("timeOfDay", cdk.validateString)(properties.timeOfDay));
  errors.collect(cdk.propertyValidator("timeZone", cdk.requiredValidator)(properties.timeZone));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerMaintenanceWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerMaintenanceWindowPropertyValidator(properties).assertSuccess();
  return {
    "DayOfWeek": cdk.stringToCloudFormation(properties.dayOfWeek),
    "TimeOfDay": cdk.stringToCloudFormation(properties.timeOfDay),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone)
  };
}

// @ts-ignore TS6133
function CfnBrokerMaintenanceWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBroker.MaintenanceWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.MaintenanceWindowProperty>();
  ret.addPropertyResult("dayOfWeek", "DayOfWeek", (properties.DayOfWeek != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfWeek) : undefined));
  ret.addPropertyResult("timeOfDay", "TimeOfDay", (properties.TimeOfDay != null ? cfn_parse.FromCloudFormation.getString(properties.TimeOfDay) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserProperty`
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerUserPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consoleAccess", cdk.validateBoolean)(properties.consoleAccess));
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(cdk.validateString))(properties.groups));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"UserProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerUserPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerUserPropertyValidator(properties).assertSuccess();
  return {
    "ConsoleAccess": cdk.booleanToCloudFormation(properties.consoleAccess),
    "Groups": cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnBrokerUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBroker.UserProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.UserProperty>();
  ret.addPropertyResult("consoleAccess", "ConsoleAccess", (properties.ConsoleAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ConsoleAccess) : undefined));
  ret.addPropertyResult("groups", "Groups", (properties.Groups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Groups) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogListProperty`
 *
 * @param properties - the TypeScript properties of a `LogListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerLogListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audit", cdk.validateBoolean)(properties.audit));
  errors.collect(cdk.propertyValidator("general", cdk.validateBoolean)(properties.general));
  return errors.wrap("supplied properties not correct for \"LogListProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerLogListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerLogListPropertyValidator(properties).assertSuccess();
  return {
    "Audit": cdk.booleanToCloudFormation(properties.audit),
    "General": cdk.booleanToCloudFormation(properties.general)
  };
}

// @ts-ignore TS6133
function CfnBrokerLogListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBroker.LogListProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.LogListProperty>();
  ret.addPropertyResult("audit", "Audit", (properties.Audit != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Audit) : undefined));
  ret.addPropertyResult("general", "General", (properties.General != null ? cfn_parse.FromCloudFormation.getBoolean(properties.General) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LdapServerMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `LdapServerMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerLdapServerMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hosts", cdk.requiredValidator)(properties.hosts));
  errors.collect(cdk.propertyValidator("hosts", cdk.listValidator(cdk.validateString))(properties.hosts));
  errors.collect(cdk.propertyValidator("roleBase", cdk.requiredValidator)(properties.roleBase));
  errors.collect(cdk.propertyValidator("roleBase", cdk.validateString)(properties.roleBase));
  errors.collect(cdk.propertyValidator("roleName", cdk.validateString)(properties.roleName));
  errors.collect(cdk.propertyValidator("roleSearchMatching", cdk.requiredValidator)(properties.roleSearchMatching));
  errors.collect(cdk.propertyValidator("roleSearchMatching", cdk.validateString)(properties.roleSearchMatching));
  errors.collect(cdk.propertyValidator("roleSearchSubtree", cdk.validateBoolean)(properties.roleSearchSubtree));
  errors.collect(cdk.propertyValidator("serviceAccountPassword", cdk.requiredValidator)(properties.serviceAccountPassword));
  errors.collect(cdk.propertyValidator("serviceAccountPassword", cdk.validateString)(properties.serviceAccountPassword));
  errors.collect(cdk.propertyValidator("serviceAccountUsername", cdk.requiredValidator)(properties.serviceAccountUsername));
  errors.collect(cdk.propertyValidator("serviceAccountUsername", cdk.validateString)(properties.serviceAccountUsername));
  errors.collect(cdk.propertyValidator("userBase", cdk.requiredValidator)(properties.userBase));
  errors.collect(cdk.propertyValidator("userBase", cdk.validateString)(properties.userBase));
  errors.collect(cdk.propertyValidator("userRoleName", cdk.validateString)(properties.userRoleName));
  errors.collect(cdk.propertyValidator("userSearchMatching", cdk.requiredValidator)(properties.userSearchMatching));
  errors.collect(cdk.propertyValidator("userSearchMatching", cdk.validateString)(properties.userSearchMatching));
  errors.collect(cdk.propertyValidator("userSearchSubtree", cdk.validateBoolean)(properties.userSearchSubtree));
  return errors.wrap("supplied properties not correct for \"LdapServerMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerLdapServerMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerLdapServerMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Hosts": cdk.listMapper(cdk.stringToCloudFormation)(properties.hosts),
    "RoleBase": cdk.stringToCloudFormation(properties.roleBase),
    "RoleName": cdk.stringToCloudFormation(properties.roleName),
    "RoleSearchMatching": cdk.stringToCloudFormation(properties.roleSearchMatching),
    "RoleSearchSubtree": cdk.booleanToCloudFormation(properties.roleSearchSubtree),
    "ServiceAccountPassword": cdk.stringToCloudFormation(properties.serviceAccountPassword),
    "ServiceAccountUsername": cdk.stringToCloudFormation(properties.serviceAccountUsername),
    "UserBase": cdk.stringToCloudFormation(properties.userBase),
    "UserRoleName": cdk.stringToCloudFormation(properties.userRoleName),
    "UserSearchMatching": cdk.stringToCloudFormation(properties.userSearchMatching),
    "UserSearchSubtree": cdk.booleanToCloudFormation(properties.userSearchSubtree)
  };
}

// @ts-ignore TS6133
function CfnBrokerLdapServerMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBroker.LdapServerMetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.LdapServerMetadataProperty>();
  ret.addPropertyResult("hosts", "Hosts", (properties.Hosts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Hosts) : undefined));
  ret.addPropertyResult("roleBase", "RoleBase", (properties.RoleBase != null ? cfn_parse.FromCloudFormation.getString(properties.RoleBase) : undefined));
  ret.addPropertyResult("roleName", "RoleName", (properties.RoleName != null ? cfn_parse.FromCloudFormation.getString(properties.RoleName) : undefined));
  ret.addPropertyResult("roleSearchMatching", "RoleSearchMatching", (properties.RoleSearchMatching != null ? cfn_parse.FromCloudFormation.getString(properties.RoleSearchMatching) : undefined));
  ret.addPropertyResult("roleSearchSubtree", "RoleSearchSubtree", (properties.RoleSearchSubtree != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RoleSearchSubtree) : undefined));
  ret.addPropertyResult("serviceAccountPassword", "ServiceAccountPassword", (properties.ServiceAccountPassword != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccountPassword) : undefined));
  ret.addPropertyResult("serviceAccountUsername", "ServiceAccountUsername", (properties.ServiceAccountUsername != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccountUsername) : undefined));
  ret.addPropertyResult("userBase", "UserBase", (properties.UserBase != null ? cfn_parse.FromCloudFormation.getString(properties.UserBase) : undefined));
  ret.addPropertyResult("userRoleName", "UserRoleName", (properties.UserRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.UserRoleName) : undefined));
  ret.addPropertyResult("userSearchMatching", "UserSearchMatching", (properties.UserSearchMatching != null ? cfn_parse.FromCloudFormation.getString(properties.UserSearchMatching) : undefined));
  ret.addPropertyResult("userSearchSubtree", "UserSearchSubtree", (properties.UserSearchSubtree != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserSearchSubtree) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerEncryptionOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("useAwsOwnedKey", cdk.requiredValidator)(properties.useAwsOwnedKey));
  errors.collect(cdk.propertyValidator("useAwsOwnedKey", cdk.validateBoolean)(properties.useAwsOwnedKey));
  return errors.wrap("supplied properties not correct for \"EncryptionOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerEncryptionOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerEncryptionOptionsPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "UseAwsOwnedKey": cdk.booleanToCloudFormation(properties.useAwsOwnedKey)
  };
}

// @ts-ignore TS6133
function CfnBrokerEncryptionOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBroker.EncryptionOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.EncryptionOptionsProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("useAwsOwnedKey", "UseAwsOwnedKey", (properties.UseAwsOwnedKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAwsOwnedKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnBrokerTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBrokerTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBroker.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBroker.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBrokerProps`
 *
 * @param properties - the TypeScript properties of a `CfnBrokerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrokerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationStrategy", cdk.validateString)(properties.authenticationStrategy));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.requiredValidator)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("brokerName", cdk.requiredValidator)(properties.brokerName));
  errors.collect(cdk.propertyValidator("brokerName", cdk.validateString)(properties.brokerName));
  errors.collect(cdk.propertyValidator("configuration", CfnBrokerConfigurationIdPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("dataReplicationMode", cdk.validateString)(properties.dataReplicationMode));
  errors.collect(cdk.propertyValidator("dataReplicationPrimaryBrokerArn", cdk.validateString)(properties.dataReplicationPrimaryBrokerArn));
  errors.collect(cdk.propertyValidator("deploymentMode", cdk.requiredValidator)(properties.deploymentMode));
  errors.collect(cdk.propertyValidator("deploymentMode", cdk.validateString)(properties.deploymentMode));
  errors.collect(cdk.propertyValidator("encryptionOptions", CfnBrokerEncryptionOptionsPropertyValidator)(properties.encryptionOptions));
  errors.collect(cdk.propertyValidator("engineType", cdk.requiredValidator)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineType", cdk.validateString)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.requiredValidator)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("hostInstanceType", cdk.requiredValidator)(properties.hostInstanceType));
  errors.collect(cdk.propertyValidator("hostInstanceType", cdk.validateString)(properties.hostInstanceType));
  errors.collect(cdk.propertyValidator("ldapServerMetadata", CfnBrokerLdapServerMetadataPropertyValidator)(properties.ldapServerMetadata));
  errors.collect(cdk.propertyValidator("logs", CfnBrokerLogListPropertyValidator)(properties.logs));
  errors.collect(cdk.propertyValidator("maintenanceWindowStartTime", CfnBrokerMaintenanceWindowPropertyValidator)(properties.maintenanceWindowStartTime));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.requiredValidator)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("storageType", cdk.validateString)(properties.storageType));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnBrokerTagsEntryPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("users", cdk.requiredValidator)(properties.users));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(CfnBrokerUserPropertyValidator))(properties.users));
  return errors.wrap("supplied properties not correct for \"CfnBrokerProps\"");
}

// @ts-ignore TS6133
function convertCfnBrokerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrokerPropsValidator(properties).assertSuccess();
  return {
    "AuthenticationStrategy": cdk.stringToCloudFormation(properties.authenticationStrategy),
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "BrokerName": cdk.stringToCloudFormation(properties.brokerName),
    "Configuration": convertCfnBrokerConfigurationIdPropertyToCloudFormation(properties.configuration),
    "DataReplicationMode": cdk.stringToCloudFormation(properties.dataReplicationMode),
    "DataReplicationPrimaryBrokerArn": cdk.stringToCloudFormation(properties.dataReplicationPrimaryBrokerArn),
    "DeploymentMode": cdk.stringToCloudFormation(properties.deploymentMode),
    "EncryptionOptions": convertCfnBrokerEncryptionOptionsPropertyToCloudFormation(properties.encryptionOptions),
    "EngineType": cdk.stringToCloudFormation(properties.engineType),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "HostInstanceType": cdk.stringToCloudFormation(properties.hostInstanceType),
    "LdapServerMetadata": convertCfnBrokerLdapServerMetadataPropertyToCloudFormation(properties.ldapServerMetadata),
    "Logs": convertCfnBrokerLogListPropertyToCloudFormation(properties.logs),
    "MaintenanceWindowStartTime": convertCfnBrokerMaintenanceWindowPropertyToCloudFormation(properties.maintenanceWindowStartTime),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "StorageType": cdk.stringToCloudFormation(properties.storageType),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(convertCfnBrokerTagsEntryPropertyToCloudFormation)(properties.tags),
    "Users": cdk.listMapper(convertCfnBrokerUserPropertyToCloudFormation)(properties.users)
  };
}

// @ts-ignore TS6133
function CfnBrokerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBrokerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBrokerProps>();
  ret.addPropertyResult("authenticationStrategy", "AuthenticationStrategy", (properties.AuthenticationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationStrategy) : undefined));
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("brokerName", "BrokerName", (properties.BrokerName != null ? cfn_parse.FromCloudFormation.getString(properties.BrokerName) : undefined));
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnBrokerConfigurationIdPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("dataReplicationMode", "DataReplicationMode", (properties.DataReplicationMode != null ? cfn_parse.FromCloudFormation.getString(properties.DataReplicationMode) : undefined));
  ret.addPropertyResult("dataReplicationPrimaryBrokerArn", "DataReplicationPrimaryBrokerArn", (properties.DataReplicationPrimaryBrokerArn != null ? cfn_parse.FromCloudFormation.getString(properties.DataReplicationPrimaryBrokerArn) : undefined));
  ret.addPropertyResult("deploymentMode", "DeploymentMode", (properties.DeploymentMode != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentMode) : undefined));
  ret.addPropertyResult("encryptionOptions", "EncryptionOptions", (properties.EncryptionOptions != null ? CfnBrokerEncryptionOptionsPropertyFromCloudFormation(properties.EncryptionOptions) : undefined));
  ret.addPropertyResult("engineType", "EngineType", (properties.EngineType != null ? cfn_parse.FromCloudFormation.getString(properties.EngineType) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("hostInstanceType", "HostInstanceType", (properties.HostInstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.HostInstanceType) : undefined));
  ret.addPropertyResult("ldapServerMetadata", "LdapServerMetadata", (properties.LdapServerMetadata != null ? CfnBrokerLdapServerMetadataPropertyFromCloudFormation(properties.LdapServerMetadata) : undefined));
  ret.addPropertyResult("logs", "Logs", (properties.Logs != null ? CfnBrokerLogListPropertyFromCloudFormation(properties.Logs) : undefined));
  ret.addPropertyResult("maintenanceWindowStartTime", "MaintenanceWindowStartTime", (properties.MaintenanceWindowStartTime != null ? CfnBrokerMaintenanceWindowPropertyFromCloudFormation(properties.MaintenanceWindowStartTime) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("storageType", "StorageType", (properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnBrokerTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("users", "Users", (properties.Users != null ? cfn_parse.FromCloudFormation.getArray(CfnBrokerUserPropertyFromCloudFormation)(properties.Users) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new configuration for the specified configuration name.
 *
 * Amazon MQ uses the default configuration (the engine type and version).
 *
 * > Does not apply to RabbitMQ brokers.
 *
 * @cloudformationResource AWS::AmazonMQ::Configuration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html
 */
export class CfnConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmazonMQ::Configuration";

  /**
   * Build a CfnConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Amazon MQ configuration.
   *
   * `arn:aws:mq:us-east-2:123456789012:configuration:MyConfigurationDevelopment:c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the Amazon MQ configuration.
   *
   * `c-1234a5b6-78cd-901e-2fgh-3i45j6k178l9`
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The revision number of the configuration.
   *
   * `1`
   *
   * @cloudformationAttribute Revision
   */
  public readonly attrRevision: number;

  /**
   * Optional.
   */
  public authenticationStrategy?: string;

  /**
   * The base64-encoded XML configuration.
   */
  public data: string;

  /**
   * The description of the configuration.
   */
  public description?: string;

  /**
   * The type of broker engine.
   */
  public engineType: string;

  /**
   * The version of the broker engine.
   */
  public engineVersion: string;

  /**
   * The name of the configuration.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create tags when creating the configuration.
   */
  public tagsRaw?: Array<CfnConfiguration.TagsEntryProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationProps) {
    super(scope, id, {
      "type": CfnConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "data", this);
    cdk.requireProperty(props, "engineType", this);
    cdk.requireProperty(props, "engineVersion", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrRevision = cdk.Token.asNumber(this.getAtt("Revision", cdk.ResolutionTypeHint.NUMBER));
    this.authenticationStrategy = props.authenticationStrategy;
    this.data = props.data;
    this.description = props.description;
    this.engineType = props.engineType;
    this.engineVersion = props.engineVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AmazonMQ::Configuration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authenticationStrategy": this.authenticationStrategy,
      "data": this.data,
      "description": this.description,
      "engineType": this.engineType,
      "engineVersion": this.engineVersion,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnConfiguration {
  /**
   * A key-value pair to associate with the configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The key in a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-key
     */
    readonly key: string;

    /**
     * The value in a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html
 */
export interface CfnConfigurationProps {
  /**
   * Optional.
   *
   * The authentication strategy associated with the configuration. The default is `SIMPLE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-authenticationstrategy
   */
  readonly authenticationStrategy?: string;

  /**
   * The base64-encoded XML configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-data
   */
  readonly data: string;

  /**
   * The description of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-description
   */
  readonly description?: string;

  /**
   * The type of broker engine.
   *
   * Note: Currently, Amazon MQ only supports ACTIVEMQ for creating and editing broker configurations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-enginetype
   */
  readonly engineType: string;

  /**
   * The version of the broker engine.
   *
   * For a list of supported engine versions, see [](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/broker-engine.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-engineversion
   */
  readonly engineVersion: string;

  /**
   * The name of the configuration.
   *
   * This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-name
   */
  readonly name: string;

  /**
   * Create tags when creating the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configuration.html#cfn-amazonmq-configuration-tags
   */
  readonly tags?: Array<CfnConfiguration.TagsEntryProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigurationTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfiguration.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguration.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationStrategy", cdk.validateString)(properties.authenticationStrategy));
  errors.collect(cdk.propertyValidator("data", cdk.requiredValidator)(properties.data));
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engineType", cdk.requiredValidator)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineType", cdk.validateString)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.requiredValidator)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnConfigurationTagsEntryPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AuthenticationStrategy": cdk.stringToCloudFormation(properties.authenticationStrategy),
    "Data": cdk.stringToCloudFormation(properties.data),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EngineType": cdk.stringToCloudFormation(properties.engineType),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(convertCfnConfigurationTagsEntryPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProps>();
  ret.addPropertyResult("authenticationStrategy", "AuthenticationStrategy", (properties.AuthenticationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationStrategy) : undefined));
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engineType", "EngineType", (properties.EngineType != null ? cfn_parse.FromCloudFormation.getString(properties.EngineType) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the AWS CloudFormation `AWS::AmazonMQ::ConfigurationAssociation` resource to associate a configuration with a broker, or return information about the specified ConfigurationAssociation.
 *
 * Only use one per broker, and don't use a configuration on the broker resource if you have associated a configuration with that broker.
 *
 * > Does not apply to RabbitMQ brokers.
 *
 * @cloudformationResource AWS::AmazonMQ::ConfigurationAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html
 */
export class CfnConfigurationAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmazonMQ::ConfigurationAssociation";

  /**
   * Build a CfnConfigurationAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The broker to associate with a configuration.
   */
  public broker: string;

  /**
   * The configuration to associate with a broker.
   */
  public configuration: CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationAssociationProps) {
    super(scope, id, {
      "type": CfnConfigurationAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "broker", this);
    cdk.requireProperty(props, "configuration", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.broker = props.broker;
    this.configuration = props.configuration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "broker": this.broker,
      "configuration": this.configuration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationAssociation {
  /**
   * The `ConfigurationId` property type specifies a configuration Id and the revision of a configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html
   */
  export interface ConfigurationIdProperty {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html#cfn-amazonmq-configurationassociation-configurationid-id
     */
    readonly id: string;

    /**
     * The revision number of the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configurationassociation-configurationid.html#cfn-amazonmq-configurationassociation-configurationid-revision
     */
    readonly revision: number;
  }
}

/**
 * Properties for defining a `CfnConfigurationAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html
 */
export interface CfnConfigurationAssociationProps {
  /**
   * The broker to associate with a configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-broker
   */
  readonly broker: string;

  /**
   * The configuration to associate with a broker.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-configurationassociation.html#cfn-amazonmq-configurationassociation-configuration
   */
  readonly configuration: CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConfigurationIdProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationAssociationConfigurationIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  return errors.wrap("supplied properties not correct for \"ConfigurationIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationAssociationConfigurationIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationAssociationConfigurationIdPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Revision": cdk.numberToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnConfigurationAssociationConfigurationIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAssociation.ConfigurationIdProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAssociation.ConfigurationIdProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("broker", cdk.requiredValidator)(properties.broker));
  errors.collect(cdk.propertyValidator("broker", cdk.validateString)(properties.broker));
  errors.collect(cdk.propertyValidator("configuration", cdk.requiredValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("configuration", CfnConfigurationAssociationConfigurationIdPropertyValidator)(properties.configuration));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationAssociationPropsValidator(properties).assertSuccess();
  return {
    "Broker": cdk.stringToCloudFormation(properties.broker),
    "Configuration": convertCfnConfigurationAssociationConfigurationIdPropertyToCloudFormation(properties.configuration)
  };
}

// @ts-ignore TS6133
function CfnConfigurationAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAssociationProps>();
  ret.addPropertyResult("broker", "Broker", (properties.Broker != null ? cfn_parse.FromCloudFormation.getString(properties.Broker) : undefined));
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnConfigurationAssociationConfigurationIdPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}