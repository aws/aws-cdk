// tslint:disable:object-literal-key-quotes
import { expect, haveResource } from '@aws-cdk/assert';
import acm = require('@aws-cdk/aws-certificatemanager');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import apigw = require('../lib');

export = {
  'can define either an EDGE or REGIONAL domain name'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });

    // WHEN
    const regionalDomain = new apigw.DomainName(stack, 'my-domain', {
      domainName: 'example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL
    });

    const edgeDomain = new apigw.DomainName(stack, 'your-domain', {
      domainName: 'example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.EDGE
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::DomainName', {
      "DomainName": "example.com",
      "EndpointConfiguration": { "Types": [ "REGIONAL" ] },
      "RegionalCertificateArn": { "Ref": "Cert5C9FAEC1" }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::DomainName', {
      "DomainName": "example.com",
      "EndpointConfiguration": { "Types": [ "EDGE" ] },
      "CertificateArn": { "Ref": "Cert5C9FAEC1" }
    }));

    test.deepEqual(stack.resolve(regionalDomain.domainNameAliasDomainName), { 'Fn::GetAtt': [ 'mydomain592C948B', 'RegionalDomainName' ] });
    test.deepEqual(stack.resolve(regionalDomain.domainNameAliasHostedZoneId), { 'Fn::GetAtt': [ 'mydomain592C948B', 'RegionalHostedZoneId' ] });
    test.deepEqual(stack.resolve(edgeDomain.domainNameAliasDomainName), { 'Fn::GetAtt': [ 'yourdomain5FE30C81', 'DistributionDomainName' ] });
    test.deepEqual(stack.resolve(edgeDomain.domainNameAliasHostedZoneId), { 'Fn::GetAtt': [ 'yourdomain5FE30C81', 'DistributionHostedZoneId' ] });

    test.done();
  },

  'default endpoint type is REGIONAL'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });

    // WHEN
    new apigw.DomainName(stack, 'my-domain', {
      domainName: 'example.com',
      certificate: cert,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::DomainName', {
      "DomainName": "example.com",
      "EndpointConfiguration": { "Types": [ "REGIONAL" ] },
      "RegionalCertificateArn": { "Ref": "Cert5C9FAEC1" }
    }));
    test.done();
  },

  '"mapping" can be used to automatically map this domain to the deployment stage of an API'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // WHEN
    new apigw.DomainName(stack, 'Domain', {
      domainName: 'foo.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.EDGE,
      mapping: api
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::BasePathMapping', {
      "DomainName": {
        "Ref": "Domain66AC69E0"
      },
      "RestApiId": {
        "Ref": "apiC8550315"
      },
      "Stage": {
        "Ref": "apiDeploymentStageprod896C8101"
      }
    }));
    test.done();
  },

  '"addBasePathMapping" can be used to add base path mapping to the domain'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api1 = new apigw.RestApi(stack, 'api1');
    const api2 = new apigw.RestApi(stack, 'api2');
    const domain = new apigw.DomainName(stack, 'my-domain', {
      domainName: 'example.com',
      certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
      endpointType: apigw.EndpointType.REGIONAL
    });
    api1.root.addMethod('GET');
    api2.root.addMethod('GET');

    // WHEN
    domain.addBasePathMapping(api1, { basePath: 'api1' });
    domain.addBasePathMapping(api2, { basePath: 'api2' });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::BasePathMapping', {
      "DomainName": {
        "Ref": "mydomain592C948B"
      },
      "BasePath": "api1",
      "RestApiId": {
        "Ref": "api1A91238E2"
      },
      "Stage": {
        "Ref": "api1DeploymentStageprod362746F6"
      }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::BasePathMapping', {
      "DomainName": {
        "Ref": "mydomain592C948B"
      },
      "BasePath": "api2",
      "RestApiId": {
        "Ref": "api2C4850CEA"
      },
      "Stage": {
        "Ref": "api2DeploymentStageprod4120D74E"
      }
    }));
    test.done();
  },

  'a domain name can be defined with the API'(test: Test) {
    // GIVEN
    const domainName = 'my.domain.com';
    const stack = new Stack();
    const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      domainName: { domainName, certificate }
    });

    api.root.addMethod('GET');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::DomainName', {
      "DomainName": "my.domain.com",
      "EndpointConfiguration": {
        "Types": [
          "REGIONAL"
        ]
      },
      "RegionalCertificateArn": {
        "Ref": "cert56CA94EB"
      }
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::BasePathMapping', {
      "DomainName": {
        "Ref": "apiCustomDomain64773C4F"
      },
      "RestApiId": {
        "Ref": "apiC8550315"
      },
      "Stage": {
        "Ref": "apiDeploymentStageprod896C8101"
      }
    }));

    test.done();
  }
};