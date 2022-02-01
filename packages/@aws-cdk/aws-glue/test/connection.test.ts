import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
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
