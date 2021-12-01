import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { DomainName, HttpApi, ApiMapping, WebSocketApi } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

describe('ApiMapping', () => {
  test('default stage', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api');

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    new ApiMapping(stack, 'Mapping', {
      api,
      domainName: dn,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
      ApiId: {
        Ref: 'ApiF70053CD',
      },
      Stage: '$default',
    });
  });

  test('beta stage mapping', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

    const beta = api.addStage('beta', {
      stageName: 'beta',
    });

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    new ApiMapping(stack, 'Mapping', {
      api,
      domainName: dn,
      stage: beta,
      apiMappingKey: 'beta',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
      ApiId: {
        Ref: 'ApiF70053CD',
      },
      Stage: 'beta',
      ApiMappingKey: 'beta',
    });
  });

  test('apiMappingKey validation - empty string not allowed', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api');

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    expect(() => {
      new ApiMapping(stack, 'Mapping', {
        api,
        domainName: dn,
        apiMappingKey: '',
      });
    }).toThrow(/empty string for api mapping key not allowed/);
  });

  test('import mapping', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api');

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    const mapping = new ApiMapping(stack, 'Mapping', {
      api,
      domainName: dn,
    });

    const imported = ApiMapping.fromApiMappingAttributes(stack, 'ImportedMapping', {
      apiMappingId: mapping.apiMappingId,
    } );

    expect(imported.apiMappingId).toEqual(mapping.apiMappingId);
  });

  test('stage validation - throws if defaultStage not available for HttpApi', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });
    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // WHEN
    expect(() => {
      new ApiMapping(stack, 'Mapping', {
        api,
        domainName: dn,
      });
    }).toThrow(/stage property must be specified/);
  });

  test('stage validation - throws if stage not provided for WebSocketApi', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');
    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // WHEN
    expect(() => {
      new ApiMapping(stack, 'Mapping', {
        api,
        domainName: dn,
      });
    }).toThrow(/stage property must be specified/);
  });
});
