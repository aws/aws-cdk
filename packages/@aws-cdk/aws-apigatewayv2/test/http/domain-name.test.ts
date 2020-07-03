import '@aws-cdk/assert/jest';
import {  Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { Test, testCase } from 'nodeunit';
import { DomainName, HttpApi } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

export = testCase({
  'create domain name correctly'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });
    test.done();
  },

  'import domain name correctly'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // WHEN
    const imported = DomainName.fromDomainNameAttributes(stack, 'dn', {
      domainName: dn.domainName,
      regionalDomainName: dn.regionalDomainName,
      regionalHostedZoneId: dn.regionalHostedZoneId,
    });

    // THEN
    expect(imported.domainName).toEqual(dn.domainName);
    expect(imported.regionalDomainName).toEqual(dn.regionalDomainName);
    expect(imported.regionalHostedZoneId).toEqual(dn.regionalHostedZoneId);
    test.done();
  },

  'addStage with domainNameMapping'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: true,
    });

    // WHEN
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
    test.done();
  },

  'api with defaultDomainMapping'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dn = new DomainName(stack, 'DN', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // WHEN
    new HttpApi(stack, 'Api', {
      createDefaultStage: true,
      defaultDomainMapping: {
        domainName: dn,
        mappingKey: '/',
      },
    });

    // THEN
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
      Stage: '$default',
    });
    test.done();
  },

  'throws when defaultDomainMapping enabled with createDefaultStage disabled'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dn = new DomainName(stack, 'DN', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    // WHEN

    // WHEN/THEN
    test.throws(() => {
      new HttpApi(stack, 'Api', {
        createDefaultStage: false,
        defaultDomainMapping: {
          domainName: dn,
          mappingKey: '/',
        },
      });
    }, /defaultDomainMapping not supported with createDefaultStage disabled/);
    test.done();
  },
});
