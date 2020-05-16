import '@aws-cdk/assert/jest';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { DomainName, HttpApi } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

describe('DomainName', () => {
  test('default', () => {

    const stack = new Stack();
    new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

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

  test('addDomainName() creates DomainName correctly', () => {

    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: true,
    });

    api.addDomainName({
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      domainName,
      stage: api.defaultStage!,
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
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: true,
    });

    const dn = api.addDomainName({
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      domainName,
      stage: api.defaultStage!,
    });

    const imported = DomainName.fromDomainNameAttributes(stack, 'dn', {
      domainNameId: dn.domainNameId,
      domainName: dn.domainNameId,
      regionalDomainName: dn.regionalHostedZoneId,
      regionalHostedZoneId: dn.regionalHostedZoneId,
    });

    expect(imported.domainNameId).toEqual(dn.domainNameId);

  });

});