import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Bucket } from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { DomainName, EndpointType, HttpApi, SecurityPolicy } from '../../lib';

const domainName = 'example.com';
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const certArn2 = 'arn:aws:acm:us-east-1:111111111111:certificate2';
const ownershipCertArn = 'arn:aws:acm:us-east-1:111111111111:ownershipcertificate';

describe('DomainName', () => {
  test('create domain name correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
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
      new DomainName(stack, 'DomainName', {
        domainName: '',
        certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      });
    };

    // THEN
    expect(t).toThrow(/empty string for domainName not allowed/);
  });

  test('import domain name correctly', () => {
    // GIVEN
    const stack = new Stack();

    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
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
        Ref: 'DNFDC76583',
      },
      Stage: 'beta',
      ApiMappingKey: 'beta',
    });
  });

  test('api with defaultDomainMapping', () => {
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
        Ref: 'DNFDC76583',
      },
      Stage: '$default',
    });
  });

  test('throws when defaultDomainMapping enabled with createDefaultStage disabled', () => {
    // GIVEN
    const stack = new Stack();
    const dn = new DomainName(stack, 'DN', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
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

  test('accepts a mutual TLS configuration', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'example-bucket');

    // WHEN
    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
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
        TruststoreUri: 's3://example-bucket/someca.pem',
      },
    });
  });

  test('mTLS should allow versions to be set on the s3 bucket', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'example-bucket');

    // WHEN
    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
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
        },
      ],
      MutualTlsAuthentication: {
        TruststoreUri: 's3://example-bucket/someca.pem',
        TruststoreVersion: 'version',
      },
    });
  });

  test('domain with mutual tls configuration and ownership cert', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'example-bucket');

    // WHEN
    new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert2', certArn2),
      ownershipCertificate: Certificate.fromCertificateArn(stack, 'ownershipCert', ownershipCertArn),
      endpointType: EndpointType.REGIONAL,
      securityPolicy: SecurityPolicy.TLS_1_2,
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
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate2',
          EndpointType: 'REGIONAL',
          SecurityPolicy: 'TLS_1_2',
          OwnershipVerificationCertificateArn: 'arn:aws:acm:us-east-1:111111111111:ownershipcertificate',
        },
      ],
      MutualTlsAuthentication: {
        TruststoreUri: 's3://example-bucket/someca.pem',
        TruststoreVersion: 'version',
      },
    });
  });

  test('throws when ownerhsip cert is used for non-mtls domain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const t = () => {
      new DomainName(stack, 'DomainName', {
        domainName,
        certificate: Certificate.fromCertificateArn(stack, 'cert2', certArn2),
        ownershipCertificate: Certificate.fromCertificateArn(stack, 'ownershipCert', ownershipCertArn),
      });
    };

    // THEN
    expect(t).toThrow(/ownership certificate can only be used with mtls domains/);
  });

  test('add new configuration to a domain name for migration', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const dn = new DomainName(stack, 'DomainName', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
      endpointType: EndpointType.REGIONAL,
    });
    dn.addEndpoint({
      certificate: Certificate.fromCertificateArn(stack, 'cert2', certArn2),
      endpointType: EndpointType.EDGE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::DomainName', {
      DomainName: 'example.com',
      DomainNameConfigurations: [
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate',
          EndpointType: 'REGIONAL',
        },
        {
          CertificateArn: 'arn:aws:acm:us-east-1:111111111111:certificate2',
          EndpointType: 'EDGE',
        },
      ],
    });
  });

  test('throws when endpoint types for two domain name configurations are the same', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const t = () => {
      const dn = new DomainName(stack, 'DomainName', {
        domainName,
        certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
        endpointType: EndpointType.REGIONAL,
      });
      dn.addEndpoint({
        certificate: Certificate.fromCertificateArn(stack, 'cert2', certArn2),
      });
    };

    // THEN
    expect(t).toThrow(/an endpoint with type REGIONAL already exists/);
  });
});
