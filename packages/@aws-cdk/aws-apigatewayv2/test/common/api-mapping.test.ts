import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { DomainName, HttpApi, ApiMapping, WebSocketApi, DomainNameConfiguration, EndpointType } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

describe('ApiMapping', () => {
  test('default stage', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api');

    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
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

    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
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

    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
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

    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
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

    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
    });

    // WHEN
    expect(() => {
      new ApiMapping(stack, 'Mapping', {
        api,
        domainName: dn,
      });
    }).toThrow(/stage is required if default stage is not available/);
  });

  test('stage validation - throws if stage not provided for WebSocketApi', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');
    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
    });

    // WHEN
    expect(() => {
      new ApiMapping(stack, 'Mapping', {
        api,
        domainName: dn,
      });
    }).toThrow(/stage is required for WebSocket API/);
  });
});
