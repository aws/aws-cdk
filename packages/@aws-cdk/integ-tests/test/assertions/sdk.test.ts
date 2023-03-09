import { Template, Match } from '@aws-cdk/assertions';
import { App, CfnOutput, Duration } from '@aws-cdk/core';
import { LogType, InvocationType, ExpectedResult } from '../../lib/assertions';
import { DeployAssert } from '../../lib/assertions/private/deploy-assert';

describe('AwsApiCall', () => {
  test('default', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    deplossert.awsApiCall('MyService', 'MyApi');

    // THEN
    const template = Template.fromStack(deplossert.scope);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: Match.absent(),
    });
  });

  test('parameters', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    });

    // THEN
    const template = Template.fromStack(deplossert.scope);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
    });

  });

  test('restrict output paths', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    }, ['path1', 'path2']);

    // THEN
    const template = Template.fromStack(deplossert.scope);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
      outputPaths: [
        'path1',
        'path2',
      ],
    });
  });

  test('assert at path', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    }).assertAtPath('Messages.0.Key', ExpectedResult.exact('first-key'));

    // THEN
    const template = Template.fromStack(deplossert.scope);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
      flattenResponse: 'true',
      outputPaths: [
        'Messages.0.Key',
      ],
      expected: JSON.stringify({ $Exact: 'first-key' }),
    });
  });

  test('add policy to provider', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    const apiCall = deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    });
    apiCall.provider.addToRolePolicy({
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: ['*'],
    });

    Template.fromStack(deplossert.scope).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: [
                  'myservice:MyApi',
                ],
                Effect: 'Allow',
                Resource: [
                  '*',
                ],
              },
              {
                Action: [
                  's3:GetObject',
                ],
                Effect: 'Allow',
                Resource: [
                  '*',
                ],
              },
            ],
          },
        },
      ],
    });
  });

  test('waitFor', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    const apiCall = deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    }).expect(ExpectedResult.objectLike({
      Key: 'Value',
    })).waitForAssertions();
    apiCall.provider.addToRolePolicy({
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: ['*'],
    });

    // THEN
    Template.fromStack(deplossert.scope).hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
      expected: JSON.stringify({ $ObjectLike: { Key: 'Value' } }),
    });
    Template.fromStack(deplossert.scope).findResources('AWS::IAM::Role', {
      SingletonFunction1488541a7b23466481b69b4408076b81Role37ABCE73: {
        Properties: {
          Policies: [
            {
              PolicyName: 'Inline',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Action: [
                      'myservice:MyApi',
                    ],
                    Effect: 'Allow',
                    Resource: [
                      '*',
                    ],
                  },
                  {
                    Action: [
                      's3:GetObject',
                    ],
                    Effect: 'Allow',
                    Resource: [
                      '*',
                    ],
                  },
                  {
                    Action: [
                      'states:StartExecution',
                    ],
                    Effect: 'Allow',
                    Resource: ['*'],
                  },
                ],
              },
            },
          ],
        },
      },
    });
  });
  test('waitFor with options', () => {
    // GIVEN
    const app = new App();
    const deplossert = new DeployAssert(app);

    // WHEN
    deplossert.awsApiCall('MyService', 'MyApi', {
      param1: 'val1',
      param2: 2,
    }).expect(ExpectedResult.objectLike({
      Key: 'Value',
    })).waitForAssertions({
      interval: Duration.seconds(10),
      backoffRate: 2,
      totalTimeout: Duration.minutes(10),
    });

    // THEN
    Template.fromStack(deplossert.scope).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"framework-isComplete-task","States":{"framework-isComplete-task":{"End":true,"Retry":[{"ErrorEquals":["States.ALL"],"IntervalSeconds":10,"MaxAttempts":4,"BackoffRate":2}],"Catch":[{"ErrorEquals":["States.ALL"],"Next":"framework-onTimeout-task"}],"Type":"Task","Resource":"',
            {
              'Fn::GetAtt': [
                'SingletonFunction76b3e830a873425f8453eddd85c86925Handler81461ECE',
                'Arn',
              ],
            },
            '"},"framework-onTimeout-task":{"End":true,"Type":"Task","Resource":"',
            {
              'Fn::GetAtt': [
                'SingletonFunction5c1898e096fb4e3e95d5f6c67f3ce41aHandlerADF3E6EA',
                'Arn',
              ],
            },
            '"}}}',
          ],
        ],
      },
    });
  });

  describe('get attribute', () => {
    test('getAttString', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      const query = deplossert.awsApiCall('MyService', 'MyApi');

      new CfnOutput(deplossert.scope, 'GetAttString', {
        value: query.getAttString('att'),
      }).overrideLogicalId('GetAtt');

      // THEN
      const template = Template.fromStack(deplossert.scope);
      template.hasOutput('GetAtt', {
        Value: {
          'Fn::GetAtt': [
            'AwsApiCallMyServiceMyApi',
            'apiCallResponse.att',
          ],
        },
      });
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        service: 'MyService',
        api: 'MyApi',
        flattenResponse: 'true',
      });
    });

    test('getAtt', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      const query = deplossert.awsApiCall('MyService', 'MyApi');

      new CfnOutput(deplossert.scope, 'GetAttString', {
        value: query.getAtt('att').toString(),
      }).overrideLogicalId('GetAtt');

      // THEN
      const template = Template.fromStack(deplossert.scope);
      template.hasOutput('GetAtt', {
        Value: {
          'Fn::GetAtt': [
            'AwsApiCallMyServiceMyApi',
            'apiCallResponse.att',
          ],
        },
      });
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        service: 'MyService',
        api: 'MyApi',
        flattenResponse: 'true',
      });
    });
  });

  describe('assertEqual', () => {
    test('objectEqual', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      const query = deplossert.awsApiCall('MyService', 'MyApi');
      query.expect(ExpectedResult.exact({ foo: 'bar' }));

      // THEN
      const template = Template.fromStack(deplossert.scope);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        expected: JSON.stringify({ $Exact: { foo: 'bar' } }),
      });
    });

    test('objectLike', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      const query = deplossert.awsApiCall('MyService', 'MyApi');
      query.expect(ExpectedResult.objectLike({ foo: 'bar' }));

      // THEN
      const template = Template.fromStack(deplossert.scope);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        expected: JSON.stringify({ $ObjectLike: { foo: 'bar' } }),
      });
    });

    test('string', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      const query = deplossert.awsApiCall('MyService', 'MyApi');
      query.expect(ExpectedResult.exact('bar'));

      // THEN
      const template = Template.fromStack(deplossert.scope);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        expected: JSON.stringify({ $Exact: 'bar' }),
      });
    });
  });

  describe('invoke lambda', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      deplossert.invokeFunction({
        functionName: 'my-func',
        logType: LogType.TAIL,
        payload: JSON.stringify({ key: 'val' }),
        invocationType: InvocationType.EVENT,
      });

      const template = Template.fromStack(deplossert.scope);
      template.hasResourceProperties('Custom::DeployAssert@SdkCallLambdainvoke', {
        service: 'Lambda',
        api: 'invoke',
        parameters: {
          FunctionName: 'my-func',
          InvocationType: 'Event',
          LogType: 'Tail',
          Payload: '{"key":"val"}',
        },
      });
      template.hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: 'my-func',
        Principal: {
          'Fn::GetAtt': [
            'SingletonFunction1488541a7b23466481b69b4408076b81Role37ABCE73',
            'Arn',
          ],
        },
      });
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            },
          ],
        },
        ManagedPolicyArns: [
          {
            'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          },
        ],
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: [
                    'lambda:Invoke',
                  ],
                  Effect: 'Allow',
                  Resource: [
                    '*',
                  ],
                },
                {
                  Action: [
                    'lambda:InvokeFunction',
                  ],
                  Effect: 'Allow',
                  Resource: [
                    {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':lambda:',
                          {
                            Ref: 'AWS::Region',
                          },
                          ':',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':function:my-func',
                        ],
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
    });
  });
});
