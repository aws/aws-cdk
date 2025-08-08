import * as path from 'path';
import { Template } from '../../assertions';
import * as sfn from '../../aws-stepfunctions';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let eventApi: appsync.EventApi;
let endpoint: string;
beforeEach(() => {
  stack = new cdk.Stack();
  eventApi = new appsync.EventApi(stack, 'baseApi', {
    apiName: 'api',
  });
  endpoint = 'aws.amazon.com';
});

describe('Http Data Source configuration', () => {
  test('default configuration produces name `HttpCDKDataSource`', () => {
    // WHEN
    eventApi.addHttpDataSource('ds', endpoint);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    eventApi.addHttpDataSource('ds', endpoint, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    eventApi.addHttpDataSource('ds', endpoint, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync configures name, authorizationConfig correctly', () => {
    // WHEN
    eventApi.addHttpDataSource('ds', endpoint, {
      name: 'custom',
      description: 'custom description',
      authorizationConfig: {
        signingRegion: 'us-east-1',
        signingServiceName: 'states',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'custom',
      Description: 'custom description',
      HttpConfig: {
        Endpoint: endpoint,
        AuthorizationConfig: {
          AuthorizationType: 'AWS_IAM',
          AwsIamConfig: {
            SigningRegion: 'us-east-1',
            SigningServiceName: 'states',
          },
        },
      },
    });
  });

  test('other aws resources can grant http data source', () => {
    // WHEN
    const machineArn = 'arn:aws:states:us-east-1::stateMachine:hello';
    const machine = sfn.StateMachine.fromStateMachineArn(stack, 'importedMachine', machineArn);
    const ds = eventApi.addHttpDataSource('ds', endpoint, {
      name: 'custom',
      description: 'custom description',
      authorizationConfig: {
        signingRegion: 'us-east-1',
        signingServiceName: 'states',
      },
    });
    machine.grantRead(ds);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'states:ListExecutions',
              'states:ListStateMachines',
            ],
            Effect: 'Allow',
            Resource: machineArn,
          },
          {
            Action: [
              'states:DescribeExecution',
              'states:DescribeStateMachineForExecution',
              'states:GetExecutionHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':states:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':execution:hello:*',
                ],
              ],
            },
          },
          {
            Action: [
              'states:ListActivities',
              'states:DescribeStateMachine',
              'states:DescribeActivity',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('appsync errors when creating multiple http data sources with no configuration', () => {
    // THEN
    expect(() => {
      eventApi.addHttpDataSource('ds', endpoint);
      eventApi.addHttpDataSource('ds', endpoint);
    }).toThrow("There is already a Construct with name 'ds' in EventApi [baseApi]");
  });
});

describe('Http Data Source association with Channel Namespace', () => {
  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addHttpDataSource('ds', endpoint);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - publish handler', () => {
    // WHEN
    const datasource = eventApi.addHttpDataSource('ds', endpoint);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addHttpDataSource('ds', endpoint);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that doesn\'t support DIRECT behavior', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addHttpDataSource('ds', endpoint);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          direct: true,
          dataSource: datasource,
        },
      });
    };

    // THEN
    expect(when).toThrow('Direct integration is only supported for AWS_LAMBDA data sources.');
  });
});

describe('adding http data source from imported api', () => {
  test('imported api can add HttpDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addHttpDataSource('ds', endpoint);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add HttpDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addHttpDataSource('ds', endpoint);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
