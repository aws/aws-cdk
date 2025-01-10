import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib/core';
import * as constructs from 'constructs';
import { CfnConnection } from 'aws-cdk-lib/aws-glue';

/**
 * The type of the glue connection
 *
 * If you need to use a connection type that doesn't exist as a static member, you
 * can instantiate a `ConnectionType` object, e.g: `new ConnectionType('NEW_TYPE')`.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype
 */
export class ConnectionType {

  /**
   * Designates a connection to a database through Java Database Connectivity (JDBC).
   */
  public static readonly JDBC = new ConnectionType('JDBC');

  /**
   * Designates a connection to an Apache Kafka streaming platform.
   */
  public static readonly KAFKA = new ConnectionType('KAFKA');

  /**
   * Designates a connection to a MongoDB document database.
   */
  public static readonly MONGODB = new ConnectionType('MONGODB');

  /**
   * Designates a connection used for view validation by Amazon Redshift.
   */
  public static readonly VIEW_VALIDATION_REDSHIFT = new ConnectionType('VIEW_VALIDATION_REDSHIFT');

  /**
   * Designates a connection used for view validation by Amazon Athena.
   */
  public static readonly VIEW_VALIDATION_ATHENA = new ConnectionType('VIEW_VALIDATION_ATHENA');

  /**
   * Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).
   */
  public static readonly NETWORK = new ConnectionType('NETWORK');

  /**
   * Uses configuration settings contained in a connector purchased from AWS Marketplace
   * to read from and write to data stores that are not natively supported by AWS Glue.
   */
  public static readonly MARKETPLACE = new ConnectionType('MARKETPLACE');

  /**
   * Uses configuration settings contained in a custom connector to read from and write to data stores
   * that are not natively supported by AWS Glue.
   */
  public static readonly CUSTOM = new ConnectionType('CUSTOM');

  /**
   * Designates a connection to Facebook Ads.
   */
  public static readonly FACEBOOKADS = new ConnectionType('FACEBOOKADS');

  /**
   * Designates a connection to Google Ads.
   */
  public static readonly GOOGLEADS = new ConnectionType('GOOGLEADS');

  /**
   * Designates a connection to Google Sheets.
   */
  public static readonly GOOGLESHEETS = new ConnectionType('GOOGLESHEETS');

  /**
   * Designates a connection to Google Analytics 4.
   */
  public static readonly GOOGLEANALYTICS4 = new ConnectionType('GOOGLEANALYTICS4');

  /**
   * Designates a connection to HubSpot.
   */
  public static readonly HUBSPOT = new ConnectionType('HUBSPOT');

  /**
   * Designates a connection to Instagram Ads.
   */
  public static readonly INSTAGRAMADS = new ConnectionType('INSTAGRAMADS');

  /**
   * Designates a connection to Intercom.
   */
  public static readonly INTERCOM = new ConnectionType('INTERCOM');

  /**
   * Designates a connection to Jira Cloud.
   */
  public static readonly JIRACLOUD = new ConnectionType('JIRACLOUD');

  /**
   * Designates a connection to Adobe Marketo Engage.
   */
  public static readonly MARKETO = new ConnectionType('MARKETO');

  /**
   * Designates a connection to Oracle NetSuite.
   */
  public static readonly NETSUITEERP = new ConnectionType('NETSUITEERP');

  /**
   * Designates a connection to Salesforce using OAuth authentication.
   */
  public static readonly SALESFORCE = new ConnectionType('SALESFORCE');

  /**
   * Designates a connection to Salesforce Marketing Cloud.
   */
  public static readonly SALESFORCEMARKETINGCLOUD = new ConnectionType('SALESFORCEMARKETINGCLOUD');

  /**
   * Designates a connection to Salesforce Marketing Cloud Account Engagement (MCAE).
   */
  public static readonly SALESFORCEPARDOT = new ConnectionType('SALESFORCEPARDOT');

  /**
   * Designates a connection to SAP OData.
   */
  public static readonly SAPODATA = new ConnectionType('SAPODATA');

  /**
   * Designates a connection to ServiceNow.
   */
  public static readonly SERVICENOW = new ConnectionType('SERVICENOW');

  /**
   * Designates a connection to Slack.
   */
  public static readonly SLACK = new ConnectionType('SLACK');

  /**
   * Designates a connection to Snapchat Ads.
   */
  public static readonly SNAPCHATADS = new ConnectionType('SNAPCHATADS');

  /**
   * Designates a connection to Stripe.
   */
  public static readonly STRIPE = new ConnectionType('STRIPE');

  /**
   * Designates a connection to Zendesk.
   */
  public static readonly ZENDESK = new ConnectionType('ZENDESK');

  /**
   * Designates a connection to Zoho CRM.
   */
  public static readonly ZOHOCRM = new ConnectionType('ZOHOCRM');

  /**
   * The name of this ConnectionType, as expected by Connection resource.
   */
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * The connection type name as expected by Connection resource.
   */
  public toString(): string {
    return this.name;
  }
}

/**
 * Interface representing a created or an imported `Connection`
 */
export interface IConnection extends cdk.IResource {
  /**
   * The name of the connection
   * @attribute
   */
  readonly connectionName: string;

  /**
   * The ARN of the connection
   * @attribute
   */
  readonly connectionArn: string;
}

/**
 * Base Connection Options
 */
export interface ConnectionOptions {
  /**
   * The name of the connection
   * @default cloudformation generated name
   */
  readonly connectionName?: string;

  /**
   * The description of the connection.
   * @default no description
   */
  readonly description?: string;

  /**
   *  Key-Value pairs that define parameters for the connection.
   *  @default empty properties
   *  @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect.html
   */
  readonly properties?: { [key: string]: string };

  /**
   * A list of criteria that can be used in selecting this connection.
   * This is useful for filtering the results of https://awscli.amazonaws.com/v2/documentation/api/latest/reference/glue/get-connections.html
   * @default no match criteria
   */
  readonly matchCriteria?: string[];

  /**
   * The list of security groups needed to successfully make this connection e.g. to successfully connect to VPC.
   * @default no security group
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The VPC subnet to connect to resources within a VPC. See more at https://docs.aws.amazon.com/glue/latest/dg/start-connecting.html.
   * @default no subnet
   */
  readonly subnet?: ec2.ISubnet;
}

/**
 * Construction properties for `Connection`
 */
export interface ConnectionProps extends ConnectionOptions {
  /**
   * The type of the connection
   */
  readonly type: ConnectionType;
}

/**
 * An AWS Glue connection to a data source.
 */
export class Connection extends cdk.Resource implements IConnection {

  /**
   * Creates a Connection construct that represents an external connection.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param connectionArn arn of external connection.
   */
  public static fromConnectionArn(scope: constructs.Construct, id: string, connectionArn: string): IConnection {
    class Import extends cdk.Resource implements IConnection {
      public readonly connectionName = cdk.Arn.extractResourceName(connectionArn, 'connection');
      public readonly connectionArn = connectionArn;
    }

    return new Import(scope, id);
  }

  /**
   * Creates a Connection construct that represents an external connection.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param connectionName name of external connection.
   */
  public static fromConnectionName(scope: constructs.Construct, id: string, connectionName: string): IConnection {
    class Import extends cdk.Resource implements IConnection {
      public readonly connectionName = connectionName;
      public readonly connectionArn = Connection.buildConnectionArn(scope, connectionName);
    }

    return new Import(scope, id);
  }

  private static buildConnectionArn(scope: constructs.Construct, connectionName: string): string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'connection',
      resourceName: connectionName,
    });
  }

  /**
   * The ARN of the connection
   */
  public readonly connectionArn: string;

  /**
   * The name of the connection
   */
  public readonly connectionName: string;

  private readonly properties: { [key: string]: string };

  constructor(scope: constructs.Construct, id: string, props: ConnectionProps) {
    super(scope, id, {
      physicalName: props.connectionName,
    });

    this.properties = props.properties || {};

    const physicalConnectionRequirements = props.subnet || props.securityGroups ? {
      availabilityZone: props.subnet ? props.subnet.availabilityZone : undefined,
      subnetId: props.subnet ? props.subnet.subnetId : undefined,
      securityGroupIdList: props.securityGroups ? props.securityGroups.map(sg => sg.securityGroupId) : undefined,
    } : undefined;

    const connectionResource = new CfnConnection(this, 'Resource', {
      catalogId: cdk.Stack.of(this).account,
      connectionInput: {
        connectionProperties: cdk.Lazy.any({ produce: () => Object.keys(this.properties).length > 0 ? this.properties : undefined }),
        connectionType: props.type.name,
        description: props.description,
        matchCriteria: props.matchCriteria,
        name: props.connectionName,
        physicalConnectionRequirements,
      },
    });

    const resourceName = this.getResourceNameAttribute(connectionResource.ref);
    this.connectionArn = Connection.buildConnectionArn(this, resourceName);
    this.connectionName = resourceName;
  }

  /**
   * Add additional connection parameters
   * @param key parameter key
   * @param value parameter value
   */
  public addProperty(key: string, value: string): void {
    this.properties[key] = value;
  }
}
