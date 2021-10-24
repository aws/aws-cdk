import '@aws-cdk/assert-internal/jest';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../lib';

describe('BasePathMapping', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have atleast one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    new apigw.BasePathMapping(stack, 'MyBasePath', {
      restApi: api,
      domainName: domain,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::BasePathMapping', {
      DomainName: { Ref: 'MyDomainE4943FBC' },
      RestApiId: { Ref: 'MyApi49610EDF' },
    });
  });

  test('specify basePath property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have atleast one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    new apigw.BasePathMapping(stack, 'MyBasePath', {
      restApi: api,
      domainName: domain,
      basePath: 'My_B45E-P4th',
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApiGateway::BasePathMapping', {
      BasePath: 'My_B45E-P4th',
    });
  });

  test('throw error for invalid basePath property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have atleast one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    const invalidBasePath = '/invalid-/base-path';

    // THEN
    expect(() => {
      new apigw.BasePathMapping(stack, 'MyBasePath', {
        restApi: api,
        domainName: domain,
        basePath: invalidBasePath,
      });
    }).toThrowError(/base path may only contain/);
  });

  test('specify stage property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have atleast one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });
    const stage = new apigw.Stage(stack, 'MyStage', {
      deployment: new apigw.Deployment(stack, 'MyDeplouyment', {
        api,
      }),
    });

    // WHEN
    new apigw.BasePathMapping(stack, 'MyBasePathMapping', {
      restApi: api,
      domainName: domain,
      stage,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApiGateway::BasePathMapping', {
      Stage: { Ref: 'MyStage572B0482' },
    });
  });
});
