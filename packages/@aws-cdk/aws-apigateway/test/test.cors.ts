import { countResources, expect, haveResource } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigw from '../lib';

export = {
  'adds an OPTIONS method to a resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com']
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'allowCredentials'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com'],
      allowCredentials: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Access-Control-Allow-Credentials': "'true'"
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'allowMethods'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://aws.amazon.com'],
      allowMethods: ['GET', 'PUT']
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'GET,PUT'",
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'allowMethods ANY will expand to all supported methods'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://aws.amazon.com'],
      allowMethods: ['ANY']
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'allowMethods ANY cannot be used with any other method'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // THEN
    test.throws(() => resource.addCorsPreflight({
      allowOrigins: ['https://aws.amazon.com'],
      allowMethods: ['ANY', 'PUT']
    }), /ANY cannot be used with any other method. Received: ANY,PUT/);

    test.done();
  },

  'statusCode can be used to set the response status code'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://aws.amazon.com'],
      statusCode: 200
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
            },
            StatusCode: '200'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
          StatusCode: '200'
        }
      ]
    }));
    test.done();
  },

  'allowOrigins must contain at least one origin'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    test.throws(() => resource.addCorsPreflight({
      allowOrigins: []
    }), /allowOrigins must contain at least one origin/);

    test.done();
  },

  'allowOrigins can be used to specify multiple origins'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://twitch.tv', 'https://amazon.com', 'https://aws.amazon.com']
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://twitch.tv'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'"
            },
            ResponseTemplates: {
              'application/json': '#set($origin = $input.params("Origin"))\n#if($origin == "") #set($origin = $input.params("origin")) #end\n#if($origin.matches("https://amazon.com") || $origin.matches("https://aws.amazon.com"))\n  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)\n#end'
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'maxAge can be used to specify Access-Control-Max-Age'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com'],
      maxAge: Duration.minutes(60)
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Access-Control-Max-Age': `'${60 * 60}'`
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Max-Age': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'disableCache will set Max-Age to -1'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com'],
      disableCache: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Access-Control-Max-Age': '\'-1\''
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Max-Age': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'maxAge and disableCache are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // THEN
    test.throws(() => resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com'],
      disableCache: true,
      maxAge: Duration.seconds(10)
    }), /The options "maxAge" and "disableCache" are mutually exclusive/);

    test.done();
  },

  'exposeHeaders can be used to specify Access-Control-Expose-Headers'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const resource = api.root.addResource('MyResource');

    // WHEN
    resource.addCorsPreflight({
      allowOrigins: ['https://amazon.com'],
      exposeHeaders: [ 'Authorization', 'Foo' ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Access-Control-Expose-Headers': "'Authorization,Foo'",
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Expose-Headers': true,
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'defaultCorsPreflightOptions can be used to specify CORS for all resource tree'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    const resource = api.root.addResource('MyResource', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://amazon.com'],
      }
    });
    resource.addResource('MyChildResource');

    // THEN
    expect(stack).to(countResources('AWS::ApiGateway::Method', 2)); // on both resources
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceD5CDB490' }
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apiMyResourceMyChildResource2DC010C5' }
    }));
    test.done();
  },

  'defaultCorsPreflightOptions can be specified at the API level to apply to all resources'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://amazon.com'],
      }
    });

    const child1 = api.root.addResource('child1');
    child1.addResource('child2');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { 'Fn::GetAtt': [ 'apiC8550315', 'RootResourceId' ] }
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apichild1841A5840' }
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'apichild1child26A9A7C47' }
    }));
    test.done();
  },

  'Vary: Origin is sent back if Allow-Origin is not "*"'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    api.root.addResource('AllowAll', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS
      }
    });

    api.root.addResource('AllowSpecific', {
      defaultCorsPreflightOptions: {
        allowOrigins: [ 'http://specific.com' ]
      }
    });

    // THENB
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      ResourceId: {
        Ref: 'apiAllowAll2F5BC564'
      },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'"
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Methods': true
          },
          StatusCode: '204'
        }
      ]
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      ResourceId: {
        Ref: 'apiAllowSpecific77DD8AF1'
      },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'http://specific.com'",
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Vary': "'Origin'"
            },
            StatusCode: '204'
          }
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }'
        },
        Type: 'MOCK'
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Vary': true
          },
          StatusCode: '204'
        }
      ]
    }));
    test.done();
  },

  'If "*" is specified in allow-origin, it cannot be mixed with specific origins'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    test.throws(() => api.root.addResource('AllowAll', {
      defaultCorsPreflightOptions: {
        allowOrigins: [ 'https://bla.com', '*', 'https://specific' ]
      }
    }), /Invalid "allowOrigins" - cannot mix "\*" with specific origins: https:\/\/bla\.com,\*,https:\/\/specific/);

    test.done();
  },

  'defaultCorsPreflightOptions can be used to specify CORS for all resource tree [LambdaRestApi]'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://amazon.com'],
      }
    });

    // THEN
    expect(stack).to(countResources('AWS::ApiGateway::Method', 4)); // two ANY and two OPTIONS resources
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: {
        'Fn::GetAtt': [
          'lambdarestapiAAD10924',
          'RootResourceId'
        ]
      },
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: {
        Ref: 'lambdarestapiproxyE3AE07E3'
      }
    }));
    test.done();
  },

  'CORS and proxy resources'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'API', {
      defaultCorsPreflightOptions: { allowOrigins: [ '*' ] }
    });

    api.root.addProxy();

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
    }));
    test.done();
  }
};
