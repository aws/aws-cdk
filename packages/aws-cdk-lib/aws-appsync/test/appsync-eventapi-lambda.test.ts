import * as path from 'path';
import { Template } from '../../assertions';
import * as lambda from '../../aws-lambda';
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

describe('Lambda Data Source configuration', () => {
  // GIVEN
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'eventapi-lambda-ds')),
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  });

  test('default configuration', () => {
    // WHEN
    eventApi.addLambdaDataSource('ds', func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    eventApi.addLambdaDataSource('ds', func, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    eventApi.addLambdaDataSource('ds', func, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync sanitized datasource name from unsupported characters', () => {
    const badCharacters = [...'!@#$%^&*()+-=[]{}\\|;:\'",<>?/'];

    badCharacters.forEach((badCharacter) => {
      // WHEN
      const newStack = new cdk.Stack();
      const eventApi1 = new appsync.EventApi(newStack, 'baseApi', {
        apiName: 'api',
      });
      const dummyFunction = new lambda.Function(newStack, 'func', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'eventapi-lambda-ds')),
        handler: 'handler.handler',
        runtime: lambda.Runtime.NODEJS_LATEST,
      });
      eventApi1.addLambdaDataSource(`data-${badCharacter}-source`, dummyFunction);

      // THEN
      Template.fromStack(newStack).hasResourceProperties('AWS::AppSync::DataSource', {
        Type: 'AWS_LAMBDA',
        Name: 'datasource',
      });
    });
  });

  test('appsync leaves underscore untouched in datasource name', () => {
    // WHEN
    eventApi.addLambdaDataSource('data_source', func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'data_source',
    });
  });

  test('appsync errors when creating multiple lambda data sources with no configuration', () => {
    // THEN
    expect(() => {
      eventApi.addLambdaDataSource('ds', func);
      eventApi.addLambdaDataSource('ds', func);
    }).toThrow("There is already a Construct with name 'ds' in EventApi [baseApi]");
  });
});

describe('Lambda Data Source association with Channel Namespace', () => {
  let codeFunc: lambda.Function;
  let directFunc: lambda.Function;
  beforeEach(() => {
    codeFunc = new lambda.Function(stack, 'codeFunc', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'eventapi-lambda-ds')),
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    directFunc = new lambda.Function(stack, 'directFunc', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'eventapi-lambda-direct')),
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - code', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
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

  test('Adding a channel namespace with API data source - publish and subscribe handler - code/sync', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        publishHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.REQUEST_RESPONSE,
        },
        subscribeHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.REQUEST_RESPONSE,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - code/async', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        publishHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
        },
        subscribeHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - publish handler - code', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
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

  test('Adding a channel namespace with API data source - publish handler - code/sync', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        publishHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.REQUEST_RESPONSE,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - publish handler - code/async', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        publishHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - subscribe handler - code', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
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

  test('Adding a channel namespace with API data source - subscribe handler - code/sync', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.REQUEST_RESPONSE,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - subscribe handler - code/async', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addLambdaDataSource('ds', codeFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          dataSource: datasource,
          lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
        },
      });
    };

    // THEN
    expect(when).toThrow('LambdaInvokeType is only supported for Direct handler behavior type');
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - direct/sync', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      publishHandlerConfig: {
        direct: true,
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        direct: true,
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'REQUEST_RESPONSE',
            },
          },
        },
        OnSubscribe: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'REQUEST_RESPONSE',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - publish handler - direct/sync', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      publishHandlerConfig: {
        direct: true,
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'REQUEST_RESPONSE',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - subscribe handler - direct/sync', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      subscribeHandlerConfig: {
        direct: true,
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'REQUEST_RESPONSE',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - direct/async', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      publishHandlerConfig: {
        direct: true,
        dataSource: datasource,
        lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
      },
      subscribeHandlerConfig: {
        direct: true,
        dataSource: datasource,
        lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
        OnSubscribe: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - publish handler - direct/async', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      publishHandlerConfig: {
        direct: true,
        dataSource: datasource,
        lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - subscribe handler - direct/async', () => {
    // WHEN
    const datasource = eventApi.addLambdaDataSource('ds', directFunc);
    eventApi.addChannelNamespace('newChannel', {
      subscribeHandlerConfig: {
        direct: true,
        dataSource: datasource,
        lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'ds',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - mismatched', () => {
    // WHEN
    const directDS = eventApi.addLambdaDataSource('directDS', directFunc);
    const codeDS = eventApi.addLambdaDataSource('codeDS', codeFunc);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        direct: true,
        dataSource: directDS,
        lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
      },
      subscribeHandlerConfig: {
        dataSource: codeDS,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'DIRECT',
          Integration: {
            DataSourceName: 'directDS',
            LambdaConfig: {
              InvokeType: 'EVENT',
            },
          },
        },
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'codeDS',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source - publish and subscribe handler - both direct with code specified', () => {
    // WHEN
    const when = () => {
      const ds = eventApi.addLambdaDataSource('ds', directFunc);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        publishHandlerConfig: {
          direct: true,
          dataSource: ds,
        },
        subscribeHandlerConfig: {
          direct: true,
          dataSource: ds,
        },
      });
    };

    // THEN
    expect(when).toThrow('Code handlers are not supported when both publish and subscribe use the Direct data source behavior');
  });
});

describe('adding lambda data source from imported api', () => {
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'eventapi-lambda-ds')),
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  });

  test('imported api can add LambdaDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addLambdaDataSource('ds', func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add LambdaDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addLambdaDataSource('ds', func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
