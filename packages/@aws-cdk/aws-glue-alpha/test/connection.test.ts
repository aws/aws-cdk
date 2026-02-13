import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as glue from '../lib';

test('a connection with connection properties', () => {
  const stack = new cdk.Stack();
  new glue.Connection(stack, 'Connection', {
    type: glue.ConnectionType.JDBC,
    properties: {
      JDBC_CONNECTION_URL: 'jdbc:server://server:443/connection',
      USERNAME: 'username',
      PASSWORD: 'password',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionProperties: {
        JDBC_CONNECTION_URL: 'jdbc:server://server:443/connection',
        USERNAME: 'username',
        PASSWORD: 'password',
      },
      ConnectionType: 'JDBC',
    },
  });
});

test('a connection with a subnet and security group', () => {
  const stack = new cdk.Stack();
  const subnet = ec2.Subnet.fromSubnetAttributes(stack, 'subnet', {
    subnetId: 'subnetId',
    availabilityZone: 'azId',
  });
  const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'securityGroup', 'sgId');
  new glue.Connection(stack, 'Connection', {
    type: glue.ConnectionType.NETWORK,
    securityGroups: [securityGroup],
    subnet,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'NETWORK',
      PhysicalConnectionRequirements: {
        AvailabilityZone: 'azId',
        SubnetId: 'subnetId',
        SecurityGroupIdList: ['sgId'],
      },
    },
  });
});

test('a connection with a name and description', () => {
  const stack = new cdk.Stack();
  new glue.Connection(stack, 'Connection', {
    connectionName: 'name',
    description: 'description',
    type: glue.ConnectionType.NETWORK,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'NETWORK',
      Name: 'name',
      Description: 'description',
    },
  });
});

test('a connection with a custom type', () => {
  const stack = new cdk.Stack();
  new glue.Connection(stack, 'Connection', {
    connectionName: 'name',
    description: 'description',
    type: new glue.ConnectionType('CUSTOM_TYPE'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'CUSTOM_TYPE',
      Name: 'name',
      Description: 'description',
    },
  });
});

test('a connection with match criteria', () => {
  const stack = new cdk.Stack();
  new glue.Connection(stack, 'Connection', {
    type: glue.ConnectionType.NETWORK,
    matchCriteria: ['c1', 'c2'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'NETWORK',
      MatchCriteria: ['c1', 'c2'],
    },
  });
});

test('addProperty', () => {
  const stack = new cdk.Stack();
  const connection = new glue.Connection(stack, 'Connection', {
    type: glue.ConnectionType.NETWORK,
  });
  connection.addProperty('SomeKey', 'SomeValue');

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'NETWORK',
      ConnectionProperties: {
        SomeKey: 'SomeValue',
      },
    },
  });
});

test('fromConnectionName', () => {
  const connectionName = 'name';
  const stack = new cdk.Stack();
  const connection = glue.Connection.fromConnectionName(stack, 'ImportedConnection', connectionName);

  expect(connection.connectionName).toEqual(connectionName);
  expect(connection.connectionArn).toEqual(stack.formatArn({
    service: 'glue',
    resource: 'connection',
    resourceName: connectionName,
  }));
});

test('fromConnectionArn', () => {
  const connectionArn = 'arn:aws:glue:region:account-id:connection/name';
  const stack = new cdk.Stack();
  const connection = glue.Connection.fromConnectionArn(stack, 'ImportedConnection', connectionArn);

  expect(connection.connectionName).toEqual('name');
  expect(connection.connectionArn).toEqual(connectionArn);
});

test('SNOWFLAKE connection type', () => {
  const stack = new cdk.Stack();
  new glue.Connection(stack, 'Connection', {
    type: glue.ConnectionType.SNOWFLAKE,
    properties: {
      JDBC_CONNECTION_URL: 'jdbc:snowflake://account.snowflakecomputing.com',
      USERNAME: 'username',
      PASSWORD: 'password',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionType: 'SNOWFLAKE',
      ConnectionProperties: {
        JDBC_CONNECTION_URL: 'jdbc:snowflake://account.snowflakecomputing.com',
        USERNAME: 'username',
        PASSWORD: 'password',
      },
    },
  });
});

test('additional connection types', () => {
  const stack = new cdk.Stack();

  // Test a few representative new connection types
  new glue.Connection(stack, 'GitLabConnection', {
    type: glue.ConnectionType.GITLAB,
    properties: {
      CONNECTION_URL: 'https://gitlab.com',
      USERNAME: 'username',
      PASSWORD: 'password',
    },
  });

  new glue.Connection(stack, 'MailchimpConnection', {
    type: glue.ConnectionType.MAILCHIMP,
    properties: {
      CONNECTION_URL: 'https://mailchimp.com',
      API_KEY: 'api-key',
    },
  });

  new glue.Connection(stack, 'PayPalConnection', {
    type: glue.ConnectionType.PAYPAL,
    properties: {
      CONNECTION_URL: 'https://api.paypal.com',
      CLIENT_ID: 'client-id',
      CLIENT_SECRET: 'client-secret',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    ConnectionInput: {
      ConnectionType: 'GITLAB',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    ConnectionInput: {
      ConnectionType: 'MAILCHIMP',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
    ConnectionInput: {
      ConnectionType: 'PAYPAL',
    },
  });
});
// Comprehensive tests for all SaaS connector connection types based on CloudFormation documentation
describe('SaaS connector connection types', () => {
  test('ADOBEANALYTICS connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.ADOBE_ANALYTICS,
      properties: {
        CONNECTION_URL: 'https://analytics.adobe.io',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'ADOBEANALYTICS',
      },
    });
  });

  test('ASANA connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.ASANA,
      properties: {
        CONNECTION_URL: 'https://app.asana.com',
        ACCESS_TOKEN: 'access-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'ASANA',
      },
    });
  });

  test('BLACKBAUDRAISEREDGENXT connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.BLACKBAUD_RAISERS_EDGE_NXT,
      properties: {
        CONNECTION_URL: 'https://api.blackbaud.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'BLACKBAUDRAISEREDGENXT',
      },
    });
  });

  test('CIRCLECI connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.CIRCLE_CI,
      properties: {
        CONNECTION_URL: 'https://circleci.com/api',
        API_TOKEN: 'api-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'CIRCLECI',
      },
    });
  });

  test('DATADOG connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.DATADOG,
      properties: {
        CONNECTION_URL: 'https://api.datadoghq.com',
        API_KEY: 'api-key',
        APPLICATION_KEY: 'app-key',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'DATADOG',
      },
    });
  });

  test('DOCUSIGNMONITOR connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.DOCUSIGN_MONITOR,
      properties: {
        CONNECTION_URL: 'https://monitor.docusign.com',
        USERNAME: 'username',
        PASSWORD: 'password',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'DOCUSIGNMONITOR',
      },
    });
  });

  test('DYNATRACE connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.DYNATRACE,
      properties: {
        CONNECTION_URL: 'https://environment.dynatrace.com',
        API_TOKEN: 'api-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'DYNATRACE',
      },
    });
  });

  test('FACEBOOKPAGEINSIGHTS connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.FACEBOOK_PAGE_INSIGHTS,
      properties: {
        CONNECTION_URL: 'https://graph.facebook.com',
        ACCESS_TOKEN: 'access-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'FACEBOOKPAGEINSIGHTS',
      },
    });
  });

  test('FRESHDESK connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.FRESHDESK,
      properties: {
        CONNECTION_URL: 'https://domain.freshdesk.com',
        API_KEY: 'api-key',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'FRESHDESK',
      },
    });
  });

  test('FRESHSALES connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.FRESHSALES,
      properties: {
        CONNECTION_URL: 'https://domain.freshsales.io',
        API_KEY: 'api-key',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'FRESHSALES',
      },
    });
  });

  test('GOOGLESEARCHCONSOLE connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.GOOGLE_SEARCH_CONSOLE,
      properties: {
        CONNECTION_URL: 'https://searchconsole.googleapis.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'GOOGLESEARCHCONSOLE',
      },
    });
  });

  test('LINKEDIN connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.LINKEDIN,
      properties: {
        CONNECTION_URL: 'https://api.linkedin.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'LINKEDIN',
      },
    });
  });

  test('MICROSOFTDYNAMIC365FINANCEANDOPS connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.MICROSOFT_DYNAMIC_365_FINANCE_AND_OPS,
      properties: {
        CONNECTION_URL: 'https://tenant.operations.dynamics.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'MICROSOFTDYNAMIC365FINANCEANDOPS',
      },
    });
  });

  test('MICROSOFTTEAMS connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.MICROSOFT_TEAMS,
      properties: {
        CONNECTION_URL: 'https://graph.microsoft.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'MICROSOFTTEAMS',
      },
    });
  });

  test('MIXPANEL connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.MIXPANEL,
      properties: {
        CONNECTION_URL: 'https://mixpanel.com/api',
        USERNAME: 'username',
        SECRET: 'secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'MIXPANEL',
      },
    });
  });

  test('PENDO connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.PENDO,
      properties: {
        CONNECTION_URL: 'https://app.pendo.io',
        API_KEY: 'api-key',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'PENDO',
      },
    });
  });

  test('PIPEDRIVE connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.PIPEDRIVE,
      properties: {
        CONNECTION_URL: 'https://api.pipedrive.com',
        API_TOKEN: 'api-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'PIPEDRIVE',
      },
    });
  });

  test('PRODUCTBOARD connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.PRODUCTBOARD,
      properties: {
        CONNECTION_URL: 'https://api.productboard.com',
        ACCESS_TOKEN: 'access-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'PRODUCTBOARD',
      },
    });
  });

  test('QUICKBOOKS connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.QUICKBOOKS,
      properties: {
        CONNECTION_URL: 'https://sandbox-quickbooks.api.intuit.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'QUICKBOOKS',
      },
    });
  });

  test('SALESFORCECOMMERCECLOUD connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.SALESFORCE_COMMERCE_CLOUD,
      properties: {
        CONNECTION_URL: 'https://instance.demandware.net',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'SALESFORCECOMMERCECLOUD',
      },
    });
  });

  test('SAPCONCUR connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.SAP_CONCUR,
      properties: {
        CONNECTION_URL: 'https://us.api.concursolutions.com',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'SAPCONCUR',
      },
    });
  });

  test('SENDGRID connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.SENDGRID,
      properties: {
        CONNECTION_URL: 'https://api.sendgrid.com',
        API_KEY: 'api-key',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'SENDGRID',
      },
    });
  });

  test('SMARTSHEET connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.SMARTSHEET,
      properties: {
        CONNECTION_URL: 'https://api.smartsheet.com',
        ACCESS_TOKEN: 'access-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'SMARTSHEET',
      },
    });
  });

  test('TWILIO connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.TWILIO,
      properties: {
        CONNECTION_URL: 'https://api.twilio.com',
        ACCOUNT_SID: 'account-sid',
        AUTH_TOKEN: 'auth-token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'TWILIO',
      },
    });
  });

  test('WOOCOMMERCE connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.WOO_COMMERCE,
      properties: {
        CONNECTION_URL: 'https://yourstore.com/wp-json/wc/v3',
        CONSUMER_KEY: 'consumer-key',
        CONSUMER_SECRET: 'consumer-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'WOOCOMMERCE',
      },
    });
  });

  test('ZOOM connection type', () => {
    const stack = new cdk.Stack();
    new glue.Connection(stack, 'Connection', {
      type: glue.ConnectionType.ZOOM,
      properties: {
        CONNECTION_URL: 'https://api.zoom.us',
        API_KEY: 'api-key',
        API_SECRET: 'api-secret',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Connection', {
      ConnectionInput: {
        ConnectionType: 'ZOOM',
      },
    });
  });
});
