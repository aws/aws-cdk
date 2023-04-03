"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const acm = require("@aws-cdk/aws-certificatemanager");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const apigw = require("../lib");
/* eslint-disable quote-props */
describe('domains', () => {
    test('can define either an EDGE or REGIONAL domain name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });
        // WHEN
        const regionalDomain = new apigw.DomainName(stack, 'my-domain', {
            domainName: 'example.com',
            certificate: cert,
            endpointType: apigw.EndpointType.REGIONAL,
        });
        const edgeDomain = new apigw.DomainName(stack, 'your-domain', {
            domainName: 'example.com',
            certificate: cert,
            endpointType: apigw.EndpointType.EDGE,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': { 'Ref': 'Cert5C9FAEC1' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'example.com',
            'EndpointConfiguration': { 'Types': ['EDGE'] },
            'CertificateArn': { 'Ref': 'Cert5C9FAEC1' },
        });
        expect(stack.resolve(regionalDomain.domainNameAliasDomainName)).toEqual({ 'Fn::GetAtt': ['mydomain592C948B', 'RegionalDomainName'] });
        expect(stack.resolve(regionalDomain.domainNameAliasHostedZoneId)).toEqual({ 'Fn::GetAtt': ['mydomain592C948B', 'RegionalHostedZoneId'] });
        expect(stack.resolve(edgeDomain.domainNameAliasDomainName)).toEqual({ 'Fn::GetAtt': ['yourdomain5FE30C81', 'DistributionDomainName'] });
        expect(stack.resolve(edgeDomain.domainNameAliasHostedZoneId)).toEqual({ 'Fn::GetAtt': ['yourdomain5FE30C81', 'DistributionHostedZoneId'] });
    });
    test('default endpoint type is REGIONAL', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });
        // WHEN
        new apigw.DomainName(stack, 'my-domain', {
            domainName: 'example.com',
            certificate: cert,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': { 'Ref': 'Cert5C9FAEC1' },
        });
    });
    test('accepts different security policies', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });
        // WHEN
        new apigw.DomainName(stack, 'my-domain', {
            domainName: 'old.example.com',
            certificate: cert,
            securityPolicy: apigw.SecurityPolicy.TLS_1_0,
        });
        new apigw.DomainName(stack, 'your-domain', {
            domainName: 'new.example.com',
            certificate: cert,
            securityPolicy: apigw.SecurityPolicy.TLS_1_2,
        });
        new apigw.DomainName(stack, 'default-domain', {
            domainName: 'default.example.com',
            certificate: cert,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'old.example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': { 'Ref': 'Cert5C9FAEC1' },
            'SecurityPolicy': 'TLS_1_0',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'new.example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': { 'Ref': 'Cert5C9FAEC1' },
            'SecurityPolicy': 'TLS_1_2',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'default.example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': { 'Ref': 'Cert5C9FAEC1' },
            'SecurityPolicy': assertions_1.Match.absent(),
        });
    });
    test('"mapping" can be used to automatically map this domain to the deployment stage of an API', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // WHEN
        new apigw.DomainName(stack, 'Domain', {
            domainName: 'foo.com',
            certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            endpointType: apigw.EndpointType.EDGE,
            mapping: api,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'Domain66AC69E0',
            },
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
            'Stage': {
                'Ref': 'apiDeploymentStageprod896C8101',
            },
        });
    });
    describe('multi-level mapping', () => {
        test('can add a multi-level path', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            // WHEN
            new apigw.DomainName(stack, 'Domain', {
                domainName: 'foo.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                endpointType: apigw.EndpointType.REGIONAL,
                mapping: api,
                basePath: 'v1/api',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'Domain66AC69E0',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
                'ApiMappingKey': 'v1/api',
            });
        });
        test('throws if endpointType is not REGIONAL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            // THEN
            expect(() => {
                new apigw.DomainName(stack, 'Domain', {
                    domainName: 'foo.com',
                    certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                    endpointType: apigw.EndpointType.EDGE,
                    mapping: api,
                    basePath: 'v1/api',
                });
            }).toThrow(/multi-level basePath is only supported when endpointType is EndpointType.REGIONAL/);
        });
        test('throws if securityPolicy is not TLS_1_2', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            // THEN
            expect(() => {
                new apigw.DomainName(stack, 'Domain', {
                    domainName: 'foo.com',
                    certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                    mapping: api,
                    basePath: 'v1/api',
                    securityPolicy: apigw.SecurityPolicy.TLS_1_0,
                });
            }).toThrow(/securityPolicy must be set to TLS_1_2 if multi-level basePath is provided/);
        });
        test('can use addApiMapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            // WHEN
            const domain = new apigw.DomainName(stack, 'Domain', {
                domainName: 'foo.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            });
            domain.addApiMapping(api.deploymentStage);
            domain.addApiMapping(api.deploymentStage, { basePath: '//' });
            domain.addApiMapping(api.deploymentStage, {
                basePath: 'v1/my-api',
            });
            domain.addApiMapping(api.deploymentStage, {
                basePath: 'v1//my-api',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'Domain66AC69E0',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'Domain66AC69E0',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
                'ApiMappingKey': '//',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'Domain66AC69E0',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
                'ApiMappingKey': 'v1/my-api',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'Domain66AC69E0',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
                'ApiMappingKey': 'v1//my-api',
            });
        });
        test('can use addDomainName', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            const domain = api.addDomainName('Domain', {
                domainName: 'foo.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            });
            // WHEN
            domain.addApiMapping(api.deploymentStage, {
                basePath: 'v1/my-api',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
                'DomainName': {
                    'Ref': 'apiDomain6D60CEFD',
                },
                'RestApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::ApiMapping', {
                'DomainName': {
                    'Ref': 'apiDomain6D60CEFD',
                },
                'ApiId': {
                    'Ref': 'apiC8550315',
                },
                'Stage': {
                    'Ref': 'apiDeploymentStageprod896C8101',
                },
                'ApiMappingKey': 'v1/my-api',
            });
        });
        test('throws if addBasePathMapping tries to add a mapping for a path that is already mapped', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'api');
            api.root.addMethod('GET');
            // WHEN
            const domain = new apigw.DomainName(stack, 'Domain', {
                domainName: 'foo.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                mapping: api,
                basePath: 'v1/path',
            });
            // THEN
            expect(() => {
                domain.addApiMapping(api.deploymentStage, {
                    basePath: 'v1/path',
                });
            }).toThrow(/DomainName Domain already has a mapping for path v1\/path/);
        });
    });
    test('"addBasePathMapping" can be used to add base path mapping to the domain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api1 = new apigw.RestApi(stack, 'api1');
        const api2 = new apigw.RestApi(stack, 'api2');
        const domain = new apigw.DomainName(stack, 'my-domain', {
            domainName: 'example.com',
            certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            endpointType: apigw.EndpointType.REGIONAL,
        });
        api1.root.addMethod('GET');
        api2.root.addMethod('GET');
        // WHEN
        domain.addBasePathMapping(api1, { basePath: 'api1' });
        domain.addBasePathMapping(api2, { basePath: 'api2' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'mydomain592C948B',
            },
            'BasePath': 'api1',
            'RestApiId': {
                'Ref': 'api1A91238E2',
            },
            'Stage': {
                'Ref': 'api1DeploymentStageprod362746F6',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'mydomain592C948B',
            },
            'BasePath': 'api2',
            'RestApiId': {
                'Ref': 'api2C4850CEA',
            },
            'Stage': {
                'Ref': 'api2DeploymentStageprod4120D74E',
            },
        });
    });
    test('a domain name can be defined with the API', () => {
        // GIVEN
        const domainName = 'my.domain.com';
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            domainName: { domainName, certificate },
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'my.domain.com',
            'EndpointConfiguration': {
                'Types': [
                    'REGIONAL',
                ],
            },
            'RegionalCertificateArn': {
                'Ref': 'cert56CA94EB',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'apiCustomDomain64773C4F',
            },
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
            'Stage': {
                'Ref': 'apiDeploymentStageprod896C8101',
            },
        });
    });
    test('a domain name can be added later', () => {
        // GIVEN
        const domainName = 'my.domain.com';
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {});
        api.root.addMethod('GET');
        api.addDomainName('domainId', { domainName, certificate });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': domainName,
            'EndpointConfiguration': {
                'Types': [
                    'REGIONAL',
                ],
            },
            'RegionalCertificateArn': {
                'Ref': 'cert56CA94EB',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'apidomainId102F8DAA',
            },
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
            'Stage': {
                'Ref': 'apiDeploymentStageprod896C8101',
            },
        });
    });
    test('a base path can be defined when adding a domain name', () => {
        // GIVEN
        const domainName = 'my.domain.com';
        const basePath = 'users';
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {});
        api.root.addMethod('GET');
        api.addDomainName('domainId', { domainName, certificate, basePath });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'BasePath': 'users',
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
        });
    });
    test('additional base paths can added if addDomainName was called with a non-empty base path', () => {
        // GIVEN
        const domainName = 'my.domain.com';
        const basePath = 'users';
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {});
        api.root.addMethod('GET');
        const dn = api.addDomainName('domainId', { domainName, certificate, basePath });
        dn.addBasePathMapping(api, {
            basePath: 'books',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'BasePath': 'users',
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'BasePath': 'books',
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
        });
    });
    test('domain name cannot contain uppercase letters', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'someDomainWithUpercase.domain.com' });
        // WHEN & THEN
        expect(() => {
            new apigw.DomainName(stack, 'someDomain', { domainName: 'someDomainWithUpercase.domain.com', certificate });
        }).toThrow(/uppercase/);
    });
    test('multiple domain names can be added', () => {
        // GIVEN
        const domainName = 'my.domain.com';
        const stack = new core_1.Stack();
        const certificate = new acm.Certificate(stack, 'cert', { domainName: 'my.domain.com' });
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {});
        api.root.addMethod('GET');
        const domainName1 = api.addDomainName('domainId', { domainName, certificate });
        api.addDomainName('domainId1', { domainName: 'your.domain.com', certificate });
        api.addDomainName('domainId2', { domainName: 'our.domain.com', certificate });
        expect(api.domainName).toEqual(domainName1);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'my.domain.com',
            'EndpointConfiguration': {
                'Types': [
                    'REGIONAL',
                ],
            },
            'RegionalCertificateArn': {
                'Ref': 'cert56CA94EB',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'your.domain.com',
            'EndpointConfiguration': {
                'Types': [
                    'REGIONAL',
                ],
            },
            'RegionalCertificateArn': {
                'Ref': 'cert56CA94EB',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'our.domain.com',
            'EndpointConfiguration': {
                'Types': [
                    'REGIONAL',
                ],
            },
            'RegionalCertificateArn': {
                'Ref': 'cert56CA94EB',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'apidomainId102F8DAA',
            },
            'RestApiId': {
                'Ref': 'apiC8550315',
            },
            'Stage': {
                'Ref': 'apiDeploymentStageprod896C8101',
            },
        });
    });
    test('"addBasePathMapping" can be used to add base path mapping to the domain with specific stage', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api1 = new apigw.RestApi(stack, 'api1');
        const api2 = new apigw.RestApi(stack, 'api2');
        const domain = new apigw.DomainName(stack, 'my-domain', {
            domainName: 'example.com',
            certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            endpointType: apigw.EndpointType.REGIONAL,
        });
        api1.root.addMethod('GET');
        api2.root.addMethod('GET');
        const testDeploy = new apigw.Deployment(stack, 'test-deployment', {
            api: api1,
        });
        const testStage = new apigw.Stage(stack, 'test-stage', {
            deployment: testDeploy,
        });
        // WHEN
        domain.addBasePathMapping(api1, { basePath: 'api1', stage: testStage });
        domain.addBasePathMapping(api2, { basePath: 'api2' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'mydomain592C948B',
            },
            'BasePath': 'api1',
            'RestApiId': {
                'Ref': 'api1A91238E2',
            },
            'Stage': stack.resolve(testStage.stageName),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'mydomain592C948B',
            },
            'BasePath': 'api2',
            'RestApiId': {
                'Ref': 'api2C4850CEA',
            },
            'Stage': {
                'Ref': 'api2DeploymentStageprod4120D74E',
            },
        });
    });
    test('accepts a mutual TLS configuration', () => {
        const stack = new core_1.Stack();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'example-bucket');
        new apigw.DomainName(stack, 'another-domain', {
            domainName: 'example.com',
            mtls: {
                bucket,
                key: 'someca.pem',
            },
            certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
            'MutualTlsAuthentication': { 'TruststoreUri': 's3://example-bucket/someca.pem' },
        });
    });
    test('mTLS should allow versions to be set on the s3 bucket', () => {
        const stack = new core_1.Stack();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'example-bucket');
        new apigw.DomainName(stack, 'another-domain', {
            domainName: 'example.com',
            certificate: acm.Certificate.fromCertificateArn(stack, 'cert2', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
            mtls: {
                bucket,
                key: 'someca.pem',
                version: 'version',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
            'DomainName': 'example.com',
            'EndpointConfiguration': { 'Types': ['REGIONAL'] },
            'RegionalCertificateArn': 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
            'MutualTlsAuthentication': { 'TruststoreUri': 's3://example-bucket/someca.pem', 'TruststoreVersion': 'version' },
        });
    });
    test('base path mapping configures stage for RestApi creation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new apigw.RestApi(stack, 'restApiWithStage', {
            domainName: {
                domainName: 'example.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                endpointType: apigw.EndpointType.REGIONAL,
            },
        }).root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'restApiWithStageCustomDomainC4749625',
            },
            'RestApiId': {
                'Ref': 'restApiWithStageD4F931D0',
            },
            'Stage': {
                'Ref': 'restApiWithStageDeploymentStageprodC82A6648',
            },
        });
    });
    test('base path mapping configures stage for SpecRestApi creation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const definition = {
            key1: 'val1',
        };
        new apigw.SpecRestApi(stack, 'specRestApiWithStage', {
            apiDefinition: apigw.ApiDefinition.fromInline(definition),
            domainName: {
                domainName: 'example.com',
                certificate: acm.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'),
                endpointType: apigw.EndpointType.REGIONAL,
            },
        }).root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::BasePathMapping', {
            'DomainName': {
                'Ref': 'specRestApiWithStageCustomDomain8A36A5C9',
            },
            'RestApiId': {
                'Ref': 'specRestApiWithStageC1492575',
            },
            'Stage': {
                'Ref': 'specRestApiWithStageDeploymentStageprod2D3037ED',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWlucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9tYWlucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHVEQUF1RDtBQUN2RCw0Q0FBeUM7QUFDekMsd0NBQXNDO0FBQ3RDLGdDQUFnQztBQUVoQyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBRS9FLE9BQU87UUFDUCxNQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUM5RCxVQUFVLEVBQUUsYUFBYTtZQUN6QixXQUFXLEVBQUUsSUFBSTtZQUNqQixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzVELFVBQVUsRUFBRSxhQUFhO1lBQ3pCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUk7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO1lBQzdFLFlBQVksRUFBRSxhQUFhO1lBQzNCLHVCQUF1QixFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUU7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QUFXLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLDhCQUE4QjthQUN0QztZQUNELE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsaURBQWlEO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYWNtIGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnZG9tYWlucycsICgpID0+IHtcbiAgdGVzdCgnY2FuIGRlZmluZSBlaXRoZXIgYW4gRURHRSBvciBSRUdJT05BTCBkb21haW4gbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2VydCA9IG5ldyBhY20uQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0JywgeyBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlZ2lvbmFsRG9tYWluID0gbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdteS1kb21haW4nLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgY2VydGlmaWNhdGU6IGNlcnQsXG4gICAgICBlbmRwb2ludFR5cGU6IGFwaWd3LkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGVkZ2VEb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ3lvdXItZG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICAgIGNlcnRpZmljYXRlOiBjZXJ0LFxuICAgICAgZW5kcG9pbnRUeXBlOiBhcGlndy5FbmRwb2ludFR5cGUuRURHRSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiAnZXhhbXBsZS5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHsgJ1R5cGVzJzogWydSRUdJT05BTCddIH0sXG4gICAgICAnUmVnaW9uYWxDZXJ0aWZpY2F0ZUFybic6IHsgJ1JlZic6ICdDZXJ0NUM5RkFFQzEnIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiAnZXhhbXBsZS5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHsgJ1R5cGVzJzogWydFREdFJ10gfSxcbiAgICAgICdDZXJ0aWZpY2F0ZUFybic6IHsgJ1JlZic6ICdDZXJ0NUM5RkFFQzEnIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZWdpb25hbERvbWFpbi5kb21haW5OYW1lQWxpYXNEb21haW5OYW1lKSkudG9FcXVhbCh7ICdGbjo6R2V0QXR0JzogWydteWRvbWFpbjU5MkM5NDhCJywgJ1JlZ2lvbmFsRG9tYWluTmFtZSddIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlZ2lvbmFsRG9tYWluLmRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCkpLnRvRXF1YWwoeyAnRm46OkdldEF0dCc6IFsnbXlkb21haW41OTJDOTQ4QicsICdSZWdpb25hbEhvc3RlZFpvbmVJZCddIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGVkZ2VEb21haW4uZG9tYWluTmFtZUFsaWFzRG9tYWluTmFtZSkpLnRvRXF1YWwoeyAnRm46OkdldEF0dCc6IFsneW91cmRvbWFpbjVGRTMwQzgxJywgJ0Rpc3RyaWJ1dGlvbkRvbWFpbk5hbWUnXSB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShlZGdlRG9tYWluLmRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCkpLnRvRXF1YWwoeyAnRm46OkdldEF0dCc6IFsneW91cmRvbWFpbjVGRTMwQzgxJywgJ0Rpc3RyaWJ1dGlvbkhvc3RlZFpvbmVJZCddIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGVuZHBvaW50IHR5cGUgaXMgUkVHSU9OQUwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNlcnQgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHsgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ215LWRvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScsXG4gICAgICBjZXJ0aWZpY2F0ZTogY2VydCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiAnZXhhbXBsZS5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHsgJ1R5cGVzJzogWydSRUdJT05BTCddIH0sXG4gICAgICAnUmVnaW9uYWxDZXJ0aWZpY2F0ZUFybic6IHsgJ1JlZic6ICdDZXJ0NUM5RkFFQzEnIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FjY2VwdHMgZGlmZmVyZW50IHNlY3VyaXR5IHBvbGljaWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjZXJ0ID0gbmV3IGFjbS5DZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnQnLCB7IGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdteS1kb21haW4nLCB7XG4gICAgICBkb21haW5OYW1lOiAnb2xkLmV4YW1wbGUuY29tJyxcbiAgICAgIGNlcnRpZmljYXRlOiBjZXJ0LFxuICAgICAgc2VjdXJpdHlQb2xpY3k6IGFwaWd3LlNlY3VyaXR5UG9saWN5LlRMU18xXzAsXG4gICAgfSk7XG5cbiAgICBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ3lvdXItZG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ25ldy5leGFtcGxlLmNvbScsXG4gICAgICBjZXJ0aWZpY2F0ZTogY2VydCxcbiAgICAgIHNlY3VyaXR5UG9saWN5OiBhcGlndy5TZWN1cml0eVBvbGljeS5UTFNfMV8yLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdkZWZhdWx0LWRvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdkZWZhdWx0LmV4YW1wbGUuY29tJyxcbiAgICAgIGNlcnRpZmljYXRlOiBjZXJ0LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkRvbWFpbk5hbWUnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6ICdvbGQuZXhhbXBsZS5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHsgJ1R5cGVzJzogWydSRUdJT05BTCddIH0sXG4gICAgICAnUmVnaW9uYWxDZXJ0aWZpY2F0ZUFybic6IHsgJ1JlZic6ICdDZXJ0NUM5RkFFQzEnIH0sXG4gICAgICAnU2VjdXJpdHlQb2xpY3knOiAnVExTXzFfMCcsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiAnbmV3LmV4YW1wbGUuY29tJyxcbiAgICAgICdFbmRwb2ludENvbmZpZ3VyYXRpb24nOiB7ICdUeXBlcyc6IFsnUkVHSU9OQUwnXSB9LFxuICAgICAgJ1JlZ2lvbmFsQ2VydGlmaWNhdGVBcm4nOiB7ICdSZWYnOiAnQ2VydDVDOUZBRUMxJyB9LFxuICAgICAgJ1NlY3VyaXR5UG9saWN5JzogJ1RMU18xXzInLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RG9tYWluTmFtZScsIHtcbiAgICAgICdEb21haW5OYW1lJzogJ2RlZmF1bHQuZXhhbXBsZS5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHsgJ1R5cGVzJzogWydSRUdJT05BTCddIH0sXG4gICAgICAnUmVnaW9uYWxDZXJ0aWZpY2F0ZUFybic6IHsgJ1JlZic6ICdDZXJ0NUM5RkFFQzEnIH0sXG4gICAgICAnU2VjdXJpdHlQb2xpY3knOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJtYXBwaW5nXCIgY2FuIGJlIHVzZWQgdG8gYXV0b21hdGljYWxseSBtYXAgdGhpcyBkb21haW4gdG8gdGhlIGRlcGxveW1lbnQgc3RhZ2Ugb2YgYW4gQVBJJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdEb21haW4nLCB7XG4gICAgICBkb21haW5OYW1lOiAnZm9vLmNvbScsXG4gICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgZW5kcG9pbnRUeXBlOiBhcGlndy5FbmRwb2ludFR5cGUuRURHRSxcbiAgICAgIG1hcHBpbmc6IGFwaSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpCYXNlUGF0aE1hcHBpbmcnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgJ1JlZic6ICdEb21haW42NkFDNjlFMCcsXG4gICAgICB9LFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGlDODU1MDMxNScsXG4gICAgICB9LFxuICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAnUmVmJzogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbXVsdGktbGV2ZWwgbWFwcGluZycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYWRkIGEgbXVsdGktbGV2ZWwgcGF0aCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBhcGlndy5Eb21haW5OYW1lKHN0YWNrLCAnRG9tYWluJywge1xuICAgICAgICBkb21haW5OYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTpjZXJ0aWZpY2F0ZS8xMS0zMzM2ZjEtNDQ0ODNkLWFkYzctOWNkMzc1YzUxNjlkJyksXG4gICAgICAgIGVuZHBvaW50VHlwZTogYXBpZ3cuRW5kcG9pbnRUeXBlLlJFR0lPTkFMLFxuICAgICAgICBtYXBwaW5nOiBhcGksXG4gICAgICAgIGJhc2VQYXRoOiAndjEvYXBpJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5VjI6OkFwaU1hcHBpbmcnLCB7XG4gICAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAgICdSZWYnOiAnRG9tYWluNjZBQzY5RTAnLFxuICAgICAgICB9LFxuICAgICAgICAnQXBpSWQnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlDODU1MDMxNScsXG4gICAgICAgIH0sXG4gICAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgICAnUmVmJzogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScsXG4gICAgICAgIH0sXG4gICAgICAgICdBcGlNYXBwaW5nS2V5JzogJ3YxL2FwaScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBlbmRwb2ludFR5cGUgaXMgbm90IFJFR0lPTkFMJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdEb21haW4nLCB7XG4gICAgICAgICAgZG9tYWluTmFtZTogJ2Zvby5jb20nLFxuICAgICAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTpjZXJ0aWZpY2F0ZS8xMS0zMzM2ZjEtNDQ0ODNkLWFkYzctOWNkMzc1YzUxNjlkJyksXG4gICAgICAgICAgZW5kcG9pbnRUeXBlOiBhcGlndy5FbmRwb2ludFR5cGUuRURHRSxcbiAgICAgICAgICBtYXBwaW5nOiBhcGksXG4gICAgICAgICAgYmFzZVBhdGg6ICd2MS9hcGknLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL211bHRpLWxldmVsIGJhc2VQYXRoIGlzIG9ubHkgc3VwcG9ydGVkIHdoZW4gZW5kcG9pbnRUeXBlIGlzIEVuZHBvaW50VHlwZS5SRUdJT05BTC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIHNlY3VyaXR5UG9saWN5IGlzIG5vdCBUTFNfMV8yJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdEb21haW4nLCB7XG4gICAgICAgICAgZG9tYWluTmFtZTogJ2Zvby5jb20nLFxuICAgICAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTpjZXJ0aWZpY2F0ZS8xMS0zMzM2ZjEtNDQ0ODNkLWFkYzctOWNkMzc1YzUxNjlkJyksXG4gICAgICAgICAgbWFwcGluZzogYXBpLFxuICAgICAgICAgIGJhc2VQYXRoOiAndjEvYXBpJyxcbiAgICAgICAgICBzZWN1cml0eVBvbGljeTogYXBpZ3cuU2VjdXJpdHlQb2xpY3kuVExTXzFfMCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9zZWN1cml0eVBvbGljeSBtdXN0IGJlIHNldCB0byBUTFNfMV8yIGlmIG11bHRpLWxldmVsIGJhc2VQYXRoIGlzIHByb3ZpZGVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gdXNlIGFkZEFwaU1hcHBpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBkb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ0RvbWFpbicsIHtcbiAgICAgICAgZG9tYWluTmFtZTogJ2Zvby5jb20nLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgfSk7XG4gICAgICBkb21haW4uYWRkQXBpTWFwcGluZyhhcGkuZGVwbG95bWVudFN0YWdlKTtcbiAgICAgIGRvbWFpbi5hZGRBcGlNYXBwaW5nKGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgYmFzZVBhdGg6ICcvLycgfSk7XG4gICAgICBkb21haW4uYWRkQXBpTWFwcGluZyhhcGkuZGVwbG95bWVudFN0YWdlLCB7XG4gICAgICAgIGJhc2VQYXRoOiAndjEvbXktYXBpJyxcbiAgICAgIH0pO1xuICAgICAgZG9tYWluLmFkZEFwaU1hcHBpbmcoYXBpLmRlcGxveW1lbnRTdGFnZSwge1xuICAgICAgICBiYXNlUGF0aDogJ3YxLy9teS1hcGknLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZycsIHtcbiAgICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICAgJ1JlZic6ICdEb21haW42NkFDNjlFMCcsXG4gICAgICAgIH0sXG4gICAgICAgICdBcGlJZCc6IHtcbiAgICAgICAgICAnUmVmJzogJ2FwaUM4NTUwMzE1JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAgICdSZWYnOiAnYXBpRGVwbG95bWVudFN0YWdlcHJvZDg5NkM4MTAxJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nJywge1xuICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAnUmVmJzogJ0RvbWFpbjY2QUM2OUUwJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0FwaUlkJzoge1xuICAgICAgICAgICdSZWYnOiAnYXBpQzg1NTAzMTUnLFxuICAgICAgICB9LFxuICAgICAgICAnU3RhZ2UnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kODk2QzgxMDEnLFxuICAgICAgICB9LFxuICAgICAgICAnQXBpTWFwcGluZ0tleSc6ICcvLycsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZycsIHtcbiAgICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICAgJ1JlZic6ICdEb21haW42NkFDNjlFMCcsXG4gICAgICAgIH0sXG4gICAgICAgICdBcGlJZCc6IHtcbiAgICAgICAgICAnUmVmJzogJ2FwaUM4NTUwMzE1JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAgICdSZWYnOiAnYXBpRGVwbG95bWVudFN0YWdlcHJvZDg5NkM4MTAxJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0FwaU1hcHBpbmdLZXknOiAndjEvbXktYXBpJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nJywge1xuICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAnUmVmJzogJ0RvbWFpbjY2QUM2OUUwJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0FwaUlkJzoge1xuICAgICAgICAgICdSZWYnOiAnYXBpQzg1NTAzMTUnLFxuICAgICAgICB9LFxuICAgICAgICAnU3RhZ2UnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kODk2QzgxMDEnLFxuICAgICAgICB9LFxuICAgICAgICAnQXBpTWFwcGluZ0tleSc6ICd2MS8vbXktYXBpJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSBhZGREb21haW5OYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgY29uc3QgZG9tYWluID0gYXBpLmFkZERvbWFpbk5hbWUoJ0RvbWFpbicsIHtcbiAgICAgICAgZG9tYWluTmFtZTogJ2Zvby5jb20nLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGRvbWFpbi5hZGRBcGlNYXBwaW5nKGFwaS5kZXBsb3ltZW50U3RhZ2UsIHtcbiAgICAgICAgYmFzZVBhdGg6ICd2MS9teS1hcGknLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlEb21haW42RDYwQ0VGRCcsXG4gICAgICAgIH0sXG4gICAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlDODU1MDMxNScsXG4gICAgICAgIH0sXG4gICAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgICAnUmVmJzogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZycsIHtcbiAgICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICAgJ1JlZic6ICdhcGlEb21haW42RDYwQ0VGRCcsXG4gICAgICAgIH0sXG4gICAgICAgICdBcGlJZCc6IHtcbiAgICAgICAgICAnUmVmJzogJ2FwaUM4NTUwMzE1JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAgICdSZWYnOiAnYXBpRGVwbG95bWVudFN0YWdlcHJvZDg5NkM4MTAxJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0FwaU1hcHBpbmdLZXknOiAndjEvbXktYXBpJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIGFkZEJhc2VQYXRoTWFwcGluZyB0cmllcyB0byBhZGQgYSBtYXBwaW5nIGZvciBhIHBhdGggdGhhdCBpcyBhbHJlYWR5IG1hcHBlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGRvbWFpbiA9IG5ldyBhcGlndy5Eb21haW5OYW1lKHN0YWNrLCAnRG9tYWluJywge1xuICAgICAgICBkb21haW5OYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTpjZXJ0aWZpY2F0ZS8xMS0zMzM2ZjEtNDQ0ODNkLWFkYzctOWNkMzc1YzUxNjlkJyksXG4gICAgICAgIG1hcHBpbmc6IGFwaSxcbiAgICAgICAgYmFzZVBhdGg6ICd2MS9wYXRoJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBkb21haW4uYWRkQXBpTWFwcGluZyhhcGkuZGVwbG95bWVudFN0YWdlLCB7XG4gICAgICAgICAgYmFzZVBhdGg6ICd2MS9wYXRoJyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Eb21haW5OYW1lIERvbWFpbiBhbHJlYWR5IGhhcyBhIG1hcHBpbmcgZm9yIHBhdGggdjFcXC9wYXRoLyk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnXCJhZGRCYXNlUGF0aE1hcHBpbmdcIiBjYW4gYmUgdXNlZCB0byBhZGQgYmFzZSBwYXRoIG1hcHBpbmcgdG8gdGhlIGRvbWFpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpMSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpMScpO1xuICAgIGNvbnN0IGFwaTIgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaTInKTtcbiAgICBjb25zdCBkb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ215LWRvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScsXG4gICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgZW5kcG9pbnRUeXBlOiBhcGlndy5FbmRwb2ludFR5cGUuUkVHSU9OQUwsXG4gICAgfSk7XG4gICAgYXBpMS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgYXBpMi5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZG9tYWluLmFkZEJhc2VQYXRoTWFwcGluZyhhcGkxLCB7IGJhc2VQYXRoOiAnYXBpMScgfSk7XG4gICAgZG9tYWluLmFkZEJhc2VQYXRoTWFwcGluZyhhcGkyLCB7IGJhc2VQYXRoOiAnYXBpMicgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QmFzZVBhdGhNYXBwaW5nJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICdSZWYnOiAnbXlkb21haW41OTJDOTQ4QicsXG4gICAgICB9LFxuICAgICAgJ0Jhc2VQYXRoJzogJ2FwaTEnLFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGkxQTkxMjM4RTInLFxuICAgICAgfSxcbiAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGkxRGVwbG95bWVudFN0YWdlcHJvZDM2Mjc0NkY2JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpCYXNlUGF0aE1hcHBpbmcnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgJ1JlZic6ICdteWRvbWFpbjU5MkM5NDhCJyxcbiAgICAgIH0sXG4gICAgICAnQmFzZVBhdGgnOiAnYXBpMicsXG4gICAgICAnUmVzdEFwaUlkJzoge1xuICAgICAgICAnUmVmJzogJ2FwaTJDNDg1MENFQScsXG4gICAgICB9LFxuICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAnUmVmJzogJ2FwaTJEZXBsb3ltZW50U3RhZ2Vwcm9kNDEyMEQ3NEUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYSBkb21haW4gbmFtZSBjYW4gYmUgZGVmaW5lZCB3aXRoIHRoZSBBUEknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBkb21haW5OYW1lID0gJ215LmRvbWFpbi5jb20nO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnY2VydCcsIHsgZG9tYWluTmFtZTogJ215LmRvbWFpbi5jb20nIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJywge1xuICAgICAgZG9tYWluTmFtZTogeyBkb21haW5OYW1lLCBjZXJ0aWZpY2F0ZSB9LFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiAnbXkuZG9tYWluLmNvbScsXG4gICAgICAnRW5kcG9pbnRDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAnVHlwZXMnOiBbXG4gICAgICAgICAgJ1JFR0lPTkFMJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnUmVnaW9uYWxDZXJ0aWZpY2F0ZUFybic6IHtcbiAgICAgICAgJ1JlZic6ICdjZXJ0NTZDQTk0RUInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpCYXNlUGF0aE1hcHBpbmcnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGlDdXN0b21Eb21haW42NDc3M0M0RicsXG4gICAgICB9LFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGlDODU1MDMxNScsXG4gICAgICB9LFxuICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAnUmVmJzogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhIGRvbWFpbiBuYW1lIGNhbiBiZSBhZGRlZCBsYXRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGRvbWFpbk5hbWUgPSAnbXkuZG9tYWluLmNvbSc7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG5ldyBhY20uQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0JywgeyBkb21haW5OYW1lOiAnbXkuZG9tYWluLmNvbScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknLCB7fSk7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgYXBpLmFkZERvbWFpbk5hbWUoJ2RvbWFpbklkJywgeyBkb21haW5OYW1lLCBjZXJ0aWZpY2F0ZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpEb21haW5OYW1lJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiBkb21haW5OYW1lLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgJ1R5cGVzJzogW1xuICAgICAgICAgICdSRUdJT05BTCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ1JlZ2lvbmFsQ2VydGlmaWNhdGVBcm4nOiB7XG4gICAgICAgICdSZWYnOiAnY2VydDU2Q0E5NEVCJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QmFzZVBhdGhNYXBwaW5nJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICdSZWYnOiAnYXBpZG9tYWluSWQxMDJGOERBQScsXG4gICAgICB9LFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGlDODU1MDMxNScsXG4gICAgICB9LFxuICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAnUmVmJzogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhIGJhc2UgcGF0aCBjYW4gYmUgZGVmaW5lZCB3aGVuIGFkZGluZyBhIGRvbWFpbiBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZG9tYWluTmFtZSA9ICdteS5kb21haW4uY29tJztcbiAgICBjb25zdCBiYXNlUGF0aCA9ICd1c2Vycyc7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG5ldyBhY20uQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0JywgeyBkb21haW5OYW1lOiAnbXkuZG9tYWluLmNvbScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknLCB7fSk7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgYXBpLmFkZERvbWFpbk5hbWUoJ2RvbWFpbklkJywgeyBkb21haW5OYW1lLCBjZXJ0aWZpY2F0ZSwgYmFzZVBhdGggfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QmFzZVBhdGhNYXBwaW5nJywge1xuICAgICAgJ0Jhc2VQYXRoJzogJ3VzZXJzJyxcbiAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICdSZWYnOiAnYXBpQzg1NTAzMTUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaXRpb25hbCBiYXNlIHBhdGhzIGNhbiBhZGRlZCBpZiBhZGREb21haW5OYW1lIHdhcyBjYWxsZWQgd2l0aCBhIG5vbi1lbXB0eSBiYXNlIHBhdGgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBkb21haW5OYW1lID0gJ215LmRvbWFpbi5jb20nO1xuICAgIGNvbnN0IGJhc2VQYXRoID0gJ3VzZXJzJztcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gbmV3IGFjbS5DZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQnLCB7IGRvbWFpbk5hbWU6ICdteS5kb21haW4uY29tJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScsIHt9KTtcblxuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICBjb25zdCBkbiA9IGFwaS5hZGREb21haW5OYW1lKCdkb21haW5JZCcsIHsgZG9tYWluTmFtZSwgY2VydGlmaWNhdGUsIGJhc2VQYXRoIH0pO1xuICAgIGRuLmFkZEJhc2VQYXRoTWFwcGluZyhhcGksIHtcbiAgICAgIGJhc2VQYXRoOiAnYm9va3MnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICdCYXNlUGF0aCc6ICd1c2VycycsXG4gICAgICAnUmVzdEFwaUlkJzoge1xuICAgICAgICAnUmVmJzogJ2FwaUM4NTUwMzE1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QmFzZVBhdGhNYXBwaW5nJywge1xuICAgICAgJ0Jhc2VQYXRoJzogJ2Jvb2tzJyxcbiAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICdSZWYnOiAnYXBpQzg1NTAzMTUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9tYWluIG5hbWUgY2Fubm90IGNvbnRhaW4gdXBwZXJjYXNlIGxldHRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gbmV3IGFjbS5DZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQnLCB7IGRvbWFpbk5hbWU6ICdzb21lRG9tYWluV2l0aFVwZXJjYXNlLmRvbWFpbi5jb20nIH0pO1xuXG4gICAgLy8gV0hFTiAmIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGFwaWd3LkRvbWFpbk5hbWUoc3RhY2ssICdzb21lRG9tYWluJywgeyBkb21haW5OYW1lOiAnc29tZURvbWFpbldpdGhVcGVyY2FzZS5kb21haW4uY29tJywgY2VydGlmaWNhdGUgfSk7XG4gICAgfSkudG9UaHJvdygvdXBwZXJjYXNlLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIGRvbWFpbiBuYW1lcyBjYW4gYmUgYWRkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBkb21haW5OYW1lID0gJ215LmRvbWFpbi5jb20nO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnY2VydCcsIHsgZG9tYWluTmFtZTogJ215LmRvbWFpbi5jb20nIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJywge30pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIGNvbnN0IGRvbWFpbk5hbWUxID0gYXBpLmFkZERvbWFpbk5hbWUoJ2RvbWFpbklkJywgeyBkb21haW5OYW1lLCBjZXJ0aWZpY2F0ZSB9KTtcbiAgICBhcGkuYWRkRG9tYWluTmFtZSgnZG9tYWluSWQxJywgeyBkb21haW5OYW1lOiAneW91ci5kb21haW4uY29tJywgY2VydGlmaWNhdGUgfSk7XG4gICAgYXBpLmFkZERvbWFpbk5hbWUoJ2RvbWFpbklkMicsIHsgZG9tYWluTmFtZTogJ291ci5kb21haW4uY29tJywgY2VydGlmaWNhdGUgfSk7XG5cbiAgICBleHBlY3QoYXBpLmRvbWFpbk5hbWUpLnRvRXF1YWwoZG9tYWluTmFtZTEpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkRvbWFpbk5hbWUnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6ICdteS5kb21haW4uY29tJyxcbiAgICAgICdFbmRwb2ludENvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICdUeXBlcyc6IFtcbiAgICAgICAgICAnUkVHSU9OQUwnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdSZWdpb25hbENlcnRpZmljYXRlQXJuJzoge1xuICAgICAgICAnUmVmJzogJ2NlcnQ1NkNBOTRFQicsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkRvbWFpbk5hbWUnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6ICd5b3VyLmRvbWFpbi5jb20nLFxuICAgICAgJ0VuZHBvaW50Q29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgJ1R5cGVzJzogW1xuICAgICAgICAgICdSRUdJT05BTCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ1JlZ2lvbmFsQ2VydGlmaWNhdGVBcm4nOiB7XG4gICAgICAgICdSZWYnOiAnY2VydDU2Q0E5NEVCJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RG9tYWluTmFtZScsIHtcbiAgICAgICdEb21haW5OYW1lJzogJ291ci5kb21haW4uY29tJyxcbiAgICAgICdFbmRwb2ludENvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICdUeXBlcyc6IFtcbiAgICAgICAgICAnUkVHSU9OQUwnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdSZWdpb25hbENlcnRpZmljYXRlQXJuJzoge1xuICAgICAgICAnUmVmJzogJ2NlcnQ1NkNBOTRFQicsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAnUmVmJzogJ2FwaWRvbWFpbklkMTAyRjhEQUEnLFxuICAgICAgfSxcbiAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICdSZWYnOiAnYXBpQzg1NTAzMTUnLFxuICAgICAgfSxcbiAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kODk2QzgxMDEnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJhZGRCYXNlUGF0aE1hcHBpbmdcIiBjYW4gYmUgdXNlZCB0byBhZGQgYmFzZSBwYXRoIG1hcHBpbmcgdG8gdGhlIGRvbWFpbiB3aXRoIHNwZWNpZmljIHN0YWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkxID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGkxJyk7XG4gICAgY29uc3QgYXBpMiA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpMicpO1xuICAgIGNvbnN0IGRvbWFpbiA9IG5ldyBhcGlndy5Eb21haW5OYW1lKHN0YWNrLCAnbXktZG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTpjZXJ0aWZpY2F0ZS8xMS0zMzM2ZjEtNDQ0ODNkLWFkYzctOWNkMzc1YzUxNjlkJyksXG4gICAgICBlbmRwb2ludFR5cGU6IGFwaWd3LkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICB9KTtcbiAgICBhcGkxLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICBhcGkyLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIGNvbnN0IHRlc3REZXBsb3kgPSBuZXcgYXBpZ3cuRGVwbG95bWVudChzdGFjaywgJ3Rlc3QtZGVwbG95bWVudCcsIHtcbiAgICAgIGFwaTogYXBpMSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRlc3RTdGFnZSA9IG5ldyBhcGlndy5TdGFnZShzdGFjaywgJ3Rlc3Qtc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50OiB0ZXN0RGVwbG95LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGRvbWFpbi5hZGRCYXNlUGF0aE1hcHBpbmcoYXBpMSwgeyBiYXNlUGF0aDogJ2FwaTEnLCBzdGFnZTogdGVzdFN0YWdlIH0pO1xuICAgIGRvbWFpbi5hZGRCYXNlUGF0aE1hcHBpbmcoYXBpMiwgeyBiYXNlUGF0aDogJ2FwaTInIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAnUmVmJzogJ215ZG9tYWluNTkyQzk0OEInLFxuICAgICAgfSxcbiAgICAgICdCYXNlUGF0aCc6ICdhcGkxJyxcbiAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICdSZWYnOiAnYXBpMUE5MTIzOEUyJyxcbiAgICAgIH0sXG4gICAgICAnU3RhZ2UnOiBzdGFjay5yZXNvbHZlKHRlc3RTdGFnZS5zdGFnZU5hbWUpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QmFzZVBhdGhNYXBwaW5nJywge1xuICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICdSZWYnOiAnbXlkb21haW41OTJDOTQ4QicsXG4gICAgICB9LFxuICAgICAgJ0Jhc2VQYXRoJzogJ2FwaTInLFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGkyQzQ4NTBDRUEnLFxuICAgICAgfSxcbiAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgJ1JlZic6ICdhcGkyRGVwbG95bWVudFN0YWdlcHJvZDQxMjBENzRFJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYWNjZXB0cyBhIG11dHVhbCBUTFMgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ3Rlc3RCdWNrZXQnLCAnZXhhbXBsZS1idWNrZXQnKTtcbiAgICBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ2Fub3RoZXItZG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICAgIG10bHM6IHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBrZXk6ICdzb21lY2EucGVtJyxcbiAgICAgIH0sXG4gICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RG9tYWluTmFtZScsIHtcbiAgICAgICdEb21haW5OYW1lJzogJ2V4YW1wbGUuY29tJyxcbiAgICAgICdFbmRwb2ludENvbmZpZ3VyYXRpb24nOiB7ICdUeXBlcyc6IFsnUkVHSU9OQUwnXSB9LFxuICAgICAgJ1JlZ2lvbmFsQ2VydGlmaWNhdGVBcm4nOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcsXG4gICAgICAnTXV0dWFsVGxzQXV0aGVudGljYXRpb24nOiB7ICdUcnVzdHN0b3JlVXJpJzogJ3MzOi8vZXhhbXBsZS1idWNrZXQvc29tZWNhLnBlbScgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdtVExTIHNob3VsZCBhbGxvdyB2ZXJzaW9ucyB0byBiZSBzZXQgb24gdGhlIHMzIGJ1Y2tldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ3Rlc3RCdWNrZXQnLCAnZXhhbXBsZS1idWNrZXQnKTtcbiAgICBuZXcgYXBpZ3cuRG9tYWluTmFtZShzdGFjaywgJ2Fub3RoZXItZG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICAgIGNlcnRpZmljYXRlOiBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydDInLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgbXRsczoge1xuICAgICAgICBidWNrZXQsXG4gICAgICAgIGtleTogJ3NvbWVjYS5wZW0nLFxuICAgICAgICB2ZXJzaW9uOiAndmVyc2lvbicsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkRvbWFpbk5hbWUnLCB7XG4gICAgICAnRG9tYWluTmFtZSc6ICdleGFtcGxlLmNvbScsXG4gICAgICAnRW5kcG9pbnRDb25maWd1cmF0aW9uJzogeyAnVHlwZXMnOiBbJ1JFR0lPTkFMJ10gfSxcbiAgICAgICdSZWdpb25hbENlcnRpZmljYXRlQXJuJzogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMToxMTExMTExOmNlcnRpZmljYXRlLzExLTMzMzZmMS00NDQ4M2QtYWRjNy05Y2QzNzVjNTE2OWQnLFxuICAgICAgJ011dHVhbFRsc0F1dGhlbnRpY2F0aW9uJzogeyAnVHJ1c3RzdG9yZVVyaSc6ICdzMzovL2V4YW1wbGUtYnVja2V0L3NvbWVjYS5wZW0nLCAnVHJ1c3RzdG9yZVZlcnNpb24nOiAndmVyc2lvbicgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzZSBwYXRoIG1hcHBpbmcgY29uZmlndXJlcyBzdGFnZSBmb3IgUmVzdEFwaSBjcmVhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdyZXN0QXBpV2l0aFN0YWdlJywge1xuICAgICAgZG9tYWluTmFtZToge1xuICAgICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgICBlbmRwb2ludFR5cGU6IGFwaWd3LkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICAgIH0sXG4gICAgfSkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAnUmVmJzogJ3Jlc3RBcGlXaXRoU3RhZ2VDdXN0b21Eb21haW5DNDc0OTYyNScsXG4gICAgICB9LFxuICAgICAgJ1Jlc3RBcGlJZCc6IHtcbiAgICAgICAgJ1JlZic6ICdyZXN0QXBpV2l0aFN0YWdlRDRGOTMxRDAnLFxuICAgICAgfSxcbiAgICAgICdTdGFnZSc6IHtcbiAgICAgICAgJ1JlZic6ICdyZXN0QXBpV2l0aFN0YWdlRGVwbG95bWVudFN0YWdlcHJvZEM4MkE2NjQ4JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Jhc2UgcGF0aCBtYXBwaW5nIGNvbmZpZ3VyZXMgc3RhZ2UgZm9yIFNwZWNSZXN0QXBpIGNyZWF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSB7XG4gICAgICBrZXkxOiAndmFsMScsXG4gICAgfTtcblxuICAgIG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ3NwZWNSZXN0QXBpV2l0aFN0YWdlJywge1xuICAgICAgYXBpRGVmaW5pdGlvbjogYXBpZ3cuQXBpRGVmaW5pdGlvbi5mcm9tSW5saW5lKGRlZmluaXRpb24pLFxuICAgICAgZG9tYWluTmFtZToge1xuICAgICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcpLFxuICAgICAgICBlbmRwb2ludFR5cGU6IGFwaWd3LkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICAgIH0sXG4gICAgfSkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkJhc2VQYXRoTWFwcGluZycsIHtcbiAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAnUmVmJzogJ3NwZWNSZXN0QXBpV2l0aFN0YWdlQ3VzdG9tRG9tYWluOEEzNkE1QzknLFxuICAgICAgfSxcbiAgICAgICdSZXN0QXBpSWQnOiB7XG4gICAgICAgICdSZWYnOiAnc3BlY1Jlc3RBcGlXaXRoU3RhZ2VDMTQ5MjU3NScsXG4gICAgICB9LFxuICAgICAgJ1N0YWdlJzoge1xuICAgICAgICAnUmVmJzogJ3NwZWNSZXN0QXBpV2l0aFN0YWdlRGVwbG95bWVudFN0YWdlcHJvZDJEMzAzN0VEJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=