import '@aws-cdk/assert/jest';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { DomainName, HttpApi } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

describe('DomainName', () => {
  test('default', () => {

    const stack = new Stack();

    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });
  });

  test('import domain name correctly', () => {

    const stack = new Stack();
    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    const imported = DomainName.fromDomainNameAttributes(stack, 'dn', {
      domainName: dn.domainName,
      regionalDomainName: dn.regionalDomainName,
      regionalHostedZoneId: dn.regionalHostedZoneId,
    });

    expect(imported.domainName).toEqual(dn.domainName);
    expect(imported.regionalDomainName).toEqual(dn.regionalDomainName);
    expect(imported.regionalHostedZoneId).toEqual(dn.regionalHostedZoneId);

  });

  test('addStage with domainNameMapping', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: true,
    });

    const dn = new DomainName(stack, 'DN', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    api.addStage('beta', {
      stageName: 'beta',
      autoDeploy: true,
      domainMapping: {
        domainName: dn,
        mappingKey: 'beta',
      },
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });
    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::ApiMapping', {
      ApiId: {
        Ref: 'ApiF70053CD',
      },
      DomainName: 'example.com',
      Stage: 'beta',
      ApiMappingKey: 'beta',
    });
  });
});
