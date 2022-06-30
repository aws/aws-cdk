import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as sagemaker from '../lib';

/* eslint-disable quote-props */

describe('endpoint', () => {
  test('succeeds to create endpoint when endpoint config name is valid', () => {
    const stack = new cdk.Stack();

    new sagemaker.Endpoint(stack, 'MyEndpoint', {
      endpointConfigName: 'MyEndpointConfig',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyEndpointE262FD4F: {
          Type: 'AWS::SageMaker::Endpoint',
          Properties: {
            EndpointConfigName: 'MyEndpointConfig',
          },
        },
      },
    });
  });

  test('succeeds to create endpoint when endpoint name and config name is valid', () => {
    const stack = new cdk.Stack();

    new sagemaker.Endpoint(stack, 'MyEndpoint', {
      endpointName: 'MyEndpoint',
      endpointConfigName: 'MyEndpointConfig',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyEndpointE262FD4F: {
          Type: 'AWS::SageMaker::Endpoint',
          Properties: {
            EndpointName: 'MyEndpoint',
            EndpointConfigName: 'MyEndpointConfig',
          },
        },
      },
    });
  });

  test('fails to create endpoint when endpoint name or endpoint config name is invalid', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint1', {
        endpointName: 'MyEndpointNameIsMoreThan63Characters12345678901234567890123456789012345678901234567890',
        endpointConfigName: 'MyEndpointConfig',
      });
    }).toThrow('Endpoint name can not be longer than 63 characters.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint2', {
        endpointName: '_MyEndpoint',
        endpointConfigName: 'MyEndpointConfig',
      });
    }).toThrow('Endpoint name can contain only letters, numbers, hyphens with no spaces.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint13', {
        endpointName: 'MyEndpoint',
        endpointConfigName: 'MyEndpointConfigNameIsMoreThan63Characters1234567890123456789012345678901234567890',
      });
    }).toThrow('Endpoint config name can not be longer than 63 characters.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint4', {
        endpointName: 'MyEndpoint',
        endpointConfigName: '_MyEndpointConfig',
      });
    }).toThrow('Endpoint config name can contain only letters, numbers, hyphens with no spaces.');
  });

  test('endpoint creation fails when endpoint name or endpoint config name is invalid', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint1', {
        endpointName: 'MyEndpointNameIsMoreThan63Characters12345678901234567890123456789012345678901234567890',
        endpointConfigName: 'MyEndpointConfig',
      });
    }).toThrow('Endpoint name can not be longer than 63 characters.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint2', {
        endpointName: '_MyEndpoint',
        endpointConfigName: 'MyEndpointConfig',
      });
    }).toThrow('Endpoint name can contain only letters, numbers, hyphens with no spaces.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint13', {
        endpointName: 'MyEndpoint',
        endpointConfigName: 'MyEndpointConfigNameIsMoreThan63Characters1234567890123456789012345678901234567890',
      });
    }).toThrow('Endpoint config name can not be longer than 63 characters.');

    expect(() => {
      new sagemaker.Endpoint(stack, 'MyEndpoint4', {
        endpointName: 'MyEndpoint',
        endpointConfigName: '_MyEndpointConfig',
      });
    }).toThrow('Endpoint config name can contain only letters, numbers, hyphens with no spaces.');
  });

  test('succeeds to create endpoint with tags', () => {
    const stack = new cdk.Stack();

    new sagemaker.Endpoint(stack, 'MyEndpoint', {
      endpointName: 'MyEndpoint',
      endpointConfigName: 'MyEndpointConfig',
      tags: {
        'key1': 'value1',
        'key2': 'value2',
      },
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyEndpointE262FD4F: {
          Type: 'AWS::SageMaker::Endpoint',
          Properties: {
            EndpointName: 'MyEndpoint',
            EndpointConfigName: 'MyEndpointConfig',
            Tags: [
              {
                Key: 'key1',
                Value: 'value1',
              },
              {
                Key: 'key2',
                Value: 'value2',
              },
            ],
          },
        },
      },
    });
  });

  test('succeeds to import endpoint when endpoint arn and name are valid', () => {
    const stack = new cdk.Stack();

    const endpointName = 'test-endpoint';
    const endpointArn = `arn:aws:sagemaker:us-east-1:123456789012:endpoint/${endpointName}`;

    const importedEndpoint = sagemaker.Endpoint.fromEndpointAttributes(stack, 'MyEndpoint', {
      endpointArn: endpointArn,
      endpointName: endpointName,
    });

    expect(importedEndpoint).not.toEqual(undefined);
    expect(importedEndpoint.endpointArn).toEqual(endpointArn);
    expect(importedEndpoint.endpointName).toEqual(endpointName);
  });

  test('succeeds to import endpoint when endpoint arn is valid', () => {
    const stack = new cdk.Stack();

    const endpointArn = 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/test-endpoint';

    const importedEndpoint = sagemaker.Endpoint.fromEndpointAttributes(stack, 'MyEndpoint', {
      endpointArn: endpointArn,
    });

    expect(importedEndpoint).not.toEqual(undefined);
    expect(importedEndpoint.endpointArn).toEqual(endpointArn);
    expect(importedEndpoint.endpointName).toEqual('test-endpoint');
  });

  test('failed to import endpoint when endpoint arn is invalid', () => {
    const stack = new cdk.Stack();

    const endpointArn = 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/';
    expect(() => {
      sagemaker.Endpoint.fromEndpointAttributes(stack, 'MyEndpoint', {
        endpointArn: endpointArn,
      });
    }).toThrow(`Can not get endpoint name from ARN ${endpointArn}, please provide endpoint name.`);
  });
});

describe('grant', () => {
  test('succeeds to grantInvoke', () => {
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AccountPrincipal('accountPrincipal'),
    });
    const endpoint = new sagemaker.Endpoint(stack, 'MyEndpoint', {
      endpointName: 'MyEndpoint',
      endpointConfigName: 'MyEndpointConfig',
    });

    endpoint.grantInvoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:InvokeEndpoint',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyEndpointE262FD4F',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'RoleDefaultPolicy5FFB7DAB',
      Roles: [
        {
          Ref: 'Role1ABCC5F0',
        },
      ],
    });
  });

  test('succeeds to grantInvoke with imported endpoint', () => {
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AccountPrincipal('accountPrincipal'),
    });

    const endpointName = 'test-endpoint';
    const endpointArn = `arn:aws:sagemaker:us-east-1:123456789012:endpoint/${endpointName}`;

    const importedEndpoint = sagemaker.Endpoint.fromEndpointAttributes(stack, 'MyEndpoint', {
      endpointArn: endpointArn,
      endpointName: endpointName,
    });

    importedEndpoint.grantInvoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:InvokeEndpoint',
            Effect: 'Allow',
            Resource: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/test-endpoint',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'RoleDefaultPolicy5FFB7DAB',
      Roles: [
        {
          Ref: 'Role1ABCC5F0',
        },
      ],
    });
  });
});
