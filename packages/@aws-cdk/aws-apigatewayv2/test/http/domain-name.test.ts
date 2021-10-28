import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Bucket } from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { DomainName, DomainNameConfiguration, EndpointType, HttpApi } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const ownershipCertArn = 'arn:aws:acm:us-east-1:111111111111:ownershipcertificate';

describe('DomainName', () => {
  test('create domain name correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });
  });

  test('throws when domainName is empty string', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const t = () => {
      const domainNameConfigurations = new Array<DomainNameConfiguration>();
      const dnConfig: DomainNameConfiguration = {
        certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
        endpointType: EndpointType.REGIONAL,
      };
      domainNameConfigurations.push(dnConfig);

      new DomainName(stack, 'DomainName', {
        domainName: '',
        domainNameConfigurations,
      });
    };

    // THEN
    expect(t).toThrow(/empty string for domainName not allowed/);
  });

  test('import domain name correctly', () => {
    // GIVEN
    const stack = new Stack();

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
    const imported = DomainName.fromDomainNameAttributes(stack, 'dn', {
      name: dn.name,
      regionalDomainName: dn.regionalDomainName,
      regionalHostedZoneId: dn.regionalHostedZoneId,
    });

    // THEN;
    expect(imported.name).toEqual(dn.name);
    expect(imported.regionalDomainName).toEqual(dn.regionalDomainName);
    expect(imported.regionalHostedZoneId).toEqual(dn.regionalHostedZoneId);
  });

  test('addStage with domainNameMapping', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: true,
    });

    // WHEN
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

    api.addStage('beta', {
      stageName: 'beta',
      autoDeploy: true,
      domainMapping: {
        domainName: dn,
        mappingKey: 'beta',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
      ApiId: {
        Ref: 'ApiF70053CD',
      },
      DomainName: {
        Ref: 'DomainNameEC95A6E9',
      },
      Stage: 'beta',
      ApiMappingKey: 'beta',
    });
  });

  test('api with defaultDomainMapping', () => {
    // GIVEN
    const stack = new Stack();
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
    new HttpApi(stack, 'Api', {
      createDefaultStage: true,
      defaultDomainMapping: {
        domainName: dn,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
      ApiId: {
        Ref: 'ApiF70053CD',
      },
      DomainName: {
        Ref: 'DomainNameEC95A6E9',
      },
      Stage: '$default',
    });
  });

  test('throws when defaultDomainMapping enabled with createDefaultStage disabled', () => {
    // GIVEN
    const stack = new Stack();
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
    const t = () => {
      new HttpApi(stack, 'Api', {
        createDefaultStage: false,
        defaultDomainMapping: {
          domainName: dn,
        },
      });
    };

    // WHEN/THEN
    expect(t).toThrow('defaultDomainMapping not supported with createDefaultStage disabled');

  });

  test('domain with mutual tls configuration', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'exampleBucket');

    // WHEN
    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
      mtls: {
        bucket,
        key: 'someca.pem',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
      ],
      MutualTlsAuthentication: {
        TruststoreUri: 's3://exampleBucket/someca.pem',
      },
    });
  });

  test('domain with mutual tls configuration and ownership cert', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'exampleBucket');

    // WHEN
    const domainNameConfigurations = new Array<DomainNameConfiguration>();
    const dnConfig: DomainNameConfiguration = {
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      ownershipVerificationCertificate: Certificate.fromCertificateArn(stack, 'ownershipCert', ownershipCertArn),
      endpointType: EndpointType.REGIONAL,
    };
    domainNameConfigurations.push(dnConfig);

    new DomainName(stack, 'DomainName', {
      domainName,
      domainNameConfigurations,
      mtls: {
        bucket,
        key: 'someca.pem',
        version: 'version',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
          OwnershipVerificationCertificateArn: 'arn:aws:acm:us-east-1:111111111111:ownershipcertificate',
        },
      ],
      MutualTlsAuthentication: {
        TruststoreUri: 's3://exampleBucket/someca.pem',
        TruststoreVersion: 'version',
      },
    });
  });
});
