import { Template } from '../../assertions';
import * as db from '../../aws-dynamodb';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let eventApi: appsync.EventApi;
beforeEach(() => {
  stack = new cdk.Stack();
  eventApi = new appsync.EventApi(stack, 'baseApi', {
    apiName: 'api',
  });
});

describe('DynamoDb Data Source configuration', () => {
  // GIVEN
  let table: db.Table;
  beforeEach(() => {
    table = new db.Table(stack, 'table', {
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });
  });

  test('default configuration', () => {
    // WHEN
    eventApi.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    eventApi.addDynamoDbDataSource('ds', table, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    eventApi.addDynamoDbDataSource('ds', table, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple dynamo db data sources with no configuration', () => {
    // THEN
    expect(() => {
      eventApi.addDynamoDbDataSource('ds', table);
      eventApi.addDynamoDbDataSource('ds', table);
    }).toThrow("There is already a Construct with name 'ds' in EventApi [baseApi]");
  });
});

describe('DynamoDb Data Source association with Channel Namespace', () => {
  // GIVEN
  let table: db.Table;
  let lambdaDataSource: appsync.LambdaDataSource;

  beforeEach(() => {
    table = new db.Table(stack, 'table', {
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });

    // Create a Lambda data source for testing DIRECT behavior
    lambdaDataSource = new appsync.LambdaDataSource(stack, 'lambdaDS', {
      api: eventApi,
      name: 'lambdaDS',
      lambdaFunction: new cdk.aws_lambda.Function(stack, 'testFunction', {
        code: cdk.aws_lambda.Code.fromInline('exports.handler = () => {};'),
        handler: 'index.handler',
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      }),
    });
  });

  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addDynamoDbDataSource('ds', table);
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
    const datasource = eventApi.addDynamoDbDataSource('ds', table);
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
    const datasource = eventApi.addDynamoDbDataSource('ds', table);
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
      const datasource = eventApi.addDynamoDbDataSource('ds', table);
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

  test('Adding a channel namespace with handlerConfigs - CODE behavior', () => {
    // WHEN
    const datasource = eventApi.addDynamoDbDataSource('ds', table);
    eventApi.addChannelNamespace('configChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      handlerConfigs: {
        onPublish: {
          behavior: appsync.HandlerBehavior.CODE,
          integration: {
            dataSourceName: datasource.name,
          },
        },
        onSubscribe: {
          behavior: appsync.HandlerBehavior.CODE,
          integration: {
            dataSourceName: datasource.name,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'configChannel',
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

  test('Adding a channel namespace with handlerConfigs - DIRECT behavior and Lambda invoke type', () => {
    // WHEN
    eventApi.addChannelNamespace('directChannel', {
      handlerConfigs: {
        onPublish: {
          behavior: appsync.HandlerBehavior.DIRECT,
          integration: {
            dataSourceName: lambdaDataSource.name,
            lambdaConfig: {
              invokeType: appsync.LambdaInvokeType.EVENT,
            },
          },
        },
        onSubscribe: {
          behavior: appsync.HandlerBehavior.DIRECT,
          integration: {
            dataSourceName: lambdaDataSource.name,
            lambdaConfig: {
              invokeType: appsync.LambdaInvokeType.REQUEST_RESPONSE,
            },
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'directChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'lambdaDS',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
        OnSubscribe: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'lambdaDS',
            LambdaConfig: {
              InvokeType: 'REQUEST_RESPONSE',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with handlerConfigs - only onPublish config', () => {
    // WHEN
    eventApi.addChannelNamespace('publishOnlyChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      handlerConfigs: {
        onPublish: {
          behavior: appsync.HandlerBehavior.CODE,
          integration: {
            dataSourceName: 'testSource',
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'publishOnlyChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'testSource',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with handlerConfigs - validation failure when both DIRECT with code', () => {
    // WHEN
    const when = () => {
      eventApi.addChannelNamespace('failChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        handlerConfigs: {
          onPublish: {
            behavior: appsync.HandlerBehavior.DIRECT,
            integration: {
              dataSourceName: lambdaDataSource.name,
            },
          },
          onSubscribe: {
            behavior: appsync.HandlerBehavior.DIRECT,
            integration: {
              dataSourceName: lambdaDataSource.name,
            },
          },
        },
      });
    };

    // THEN
    expect(when).toThrow('Code handlers are not supported when both publish and subscribe use the Direct data source behavior');
  });

  test('Backwards compatibility - handlerConfigs takes precedence over handlerConfig props', () => {
    // WHEN
    const datasource = eventApi.addDynamoDbDataSource('ds', table);
    eventApi.addChannelNamespace('precedenceChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
      handlerConfigs: {
        onPublish: {
          behavior: appsync.HandlerBehavior.CODE,
          integration: {
            dataSourceName: 'overriddenSource',
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'precedenceChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'overriddenSource',
          },
        },
      },
    });
  });
});

describe('adding DynamoDb data source from imported api', () => {
  // GIVEN
  let table: db.Table;
  beforeEach(() => {
    table = new db.Table(stack, 'table', {
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });
  });

  test('imported api can add DynamoDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add DynamoDbDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
