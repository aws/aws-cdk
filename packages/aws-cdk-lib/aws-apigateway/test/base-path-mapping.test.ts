import { Match, Template } from '../../assertions';
import * as acm from '../../aws-certificatemanager';
import * as cdk from '../../core';
import * as apigw from '../lib';

describe('BasePathMapping', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
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
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
      DomainName: { Ref: 'MyDomainE4943FBC' },
      RestApiId: { Ref: 'MyApi49610EDF' },
      Stage: { Ref: 'MyApiDeploymentStageprodE1054AF0' },
    });
  });

  test('specify basePath property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
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
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
      BasePath: 'My_B45E-P4th',
    });
  });

  test('specify multi-level basePath property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    new apigw.BasePathMapping(stack, 'MyBasePath', {
      restApi: api,
      domainName: domain,
      basePath: 'api/v1/example',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
      BasePath: 'api/v1/example',
    });
  });

  test('throws when basePath contains an invalid character', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    const invalidBasePath = 'invalid-/base-path?';

    // THEN
    expect(() => {
      new apigw.BasePathMapping(stack, 'MyBasePath', {
        restApi: api,
        domainName: domain,
        basePath: invalidBasePath,
      });
    }).toThrowError(/base path may only contain/);
  });

  test('throw error for basePath starting with /', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    const invalidBasePath = '/invalid-base-path';

    // THEN
    expect(() => {
      new apigw.BasePathMapping(stack, 'MyBasePath', {
        restApi: api,
        domainName: domain,
        basePath: invalidBasePath,
      });
    }).toThrowError(/A base path cannot start or end with/);
  });

  test('throw error for basePath ending with /', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    const invalidBasePath = 'invalid-base-path/';

    // THEN
    expect(() => {
      new apigw.BasePathMapping(stack, 'MyBasePath', {
        restApi: api,
        domainName: domain,
        basePath: invalidBasePath,
      });
    }).toThrowError(/A base path cannot start or end with/);
  });

  test('throw error for basePath containing more than one consecutive /', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    const invalidBasePath = 'in//valid-base-path';

    // THEN
    expect(() => {
      new apigw.BasePathMapping(stack, 'MyBasePath', {
        restApi: api,
        domainName: domain,
        basePath: invalidBasePath,
      });
    }).toThrowError(/A base path cannot have more than one consecutive \//);
  });

  test('specify stage property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
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
      attachToStage: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
      Stage: { Ref: 'MyStage572B0482' },
    });
  });

  test('specify attachToStage property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'MyApi');
    api.root.addMethod('GET'); // api must have at least one method.
    const domain = new apigw.DomainName(stack, 'MyDomain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL,
    });

    // WHEN
    new apigw.BasePathMapping(stack, 'MyBasePath', {
      restApi: api,
      domainName: domain,
      attachToStage: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
      Stage: Match.absent(),
    });
  });
});
