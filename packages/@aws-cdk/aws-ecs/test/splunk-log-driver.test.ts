import '@aws-cdk/assert-internal/jest';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('splunk log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');


  });

  test('create a splunk log driver with minimum options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SplunkLogDriver({
        token: cdk.SecretValue.secretsManager('my-splunk-token'),
        url: 'my-splunk-url',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-token': '{{resolve:secretsmanager:my-splunk-token:SecretString:::}}',
              'splunk-url': 'my-splunk-url',
            },
          },
        },
      ],
    });


  });

  test('create a splunk log driver using splunk with minimum options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.splunk({
        token: cdk.SecretValue.secretsManager('my-splunk-token'),
        url: 'my-splunk-url',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-token': '{{resolve:secretsmanager:my-splunk-token:SecretString:::}}',
              'splunk-url': 'my-splunk-url',
            },
          },
        },
      ],
    });


  });

  test('create a splunk log driver using splunk with sourcetype defined', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.splunk({
        token: cdk.SecretValue.secretsManager('my-splunk-token'),
        url: 'my-splunk-url',
        sourceType: 'my-source-type',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-token': '{{resolve:secretsmanager:my-splunk-token:SecretString:::}}',
              'splunk-url': 'my-splunk-url',
              'splunk-sourcetype': 'my-source-type',
            },
          },
        },
      ],
    });


  });

  test('create a splunk log driver using secret splunk token from secrets manager', () => {
    const secret = new secretsmanager.Secret(stack, 'Secret');
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.splunk({
        secretToken: ecs.Secret.fromSecretsManager(secret),
        url: 'my-splunk-url',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-url': 'my-splunk-url',
            },
            SecretOptions: [
              {
                Name: 'splunk-token',
                ValueFrom: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
          },
        },
      ],
    });


  });

  test('create a splunk log driver using secret splunk token from systems manager parameter store', () => {
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
      parameterName: '/token',
      version: 1,
    });
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.splunk({
        secretToken: ecs.Secret.fromSsmParameter(parameter),
        url: 'my-splunk-url',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-url': 'my-splunk-url',
            },
            SecretOptions: [
              {
                Name: 'splunk-token',
                ValueFrom: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':ssm:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':parameter/token',
                    ],
                  ],
                },
              },
            ],
          },
        },
      ],
    });


  });

  test('throws when neither token nor secret token are provided', () => {
    expect(() => {
      td.addContainer('Container', {
        image,
        logging: ecs.LogDrivers.splunk({
          url: 'my-splunk-url',
        }),
        memoryLimitMiB: 128,
      });
    }).toThrow('Please provide either token or secretToken.');


  });
});
