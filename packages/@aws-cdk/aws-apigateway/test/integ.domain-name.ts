import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CfnRecordSet } from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import {
  IntegTest,
  ExpectedResult,
  Match,
} from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as apigw from '../lib';

const domainName = process.env.CDK_INTEG_DOMAIN_NAME || process.env.DOMAIN_NAME;
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID || process.env.HOSTED_ZONE_ID;
const certArn = process.env.CDK_INTEG_CERT_ARN || process.env.CERT_ARN;
if (!domainName || !certArn || !hostedZoneId) {
  throw new Error('Env vars DOMAIN_NAME, HOSTED_ZONE_ID, and CERT_ARN must be set');
}

/**
 * -------------------------------------------------------
 * ------------------------- GIVEN------------------------
 * -------------------------------------------------------
 */
const app = new cdk.App();
const testCase = new cdk.Stack(app, 'integ-apigw-domain-name-mapping');

interface ApiProps {
  statusCode: string;
  path: string;
}

class Api extends Construct {
  public readonly restApi: apigw.IRestApi;
  private readonly resource: apigw.Resource;
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);
    this.restApi = new apigw.RestApi(this, 'IntegApi'+props.statusCode, {
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });
    this.resource = this.restApi.root.addResource(props.path);
    const integration = this.createIntegration(props.statusCode);
    const options = {
      methodResponses: [{
        statusCode: props.statusCode,
      }],
    };
    this.restApi.root.addMethod('GET', integration, options);
    this.resource.addMethod('GET', integration, options);
  }
  public addResource(path: string, statusCode: string, resource?: apigw.Resource): void {
    const subResource = (resource ?? this.resource).addResource(path);
    const integration = this.createIntegration(statusCode);
    subResource.addMethod('GET', integration, {
      methodResponses: [{ statusCode }],
    });
  }
  public addRootResource(path: string, statusCode: string): apigw.Resource {
    const subResource = this.restApi.root.addResource(path);
    const integration = this.createIntegration(statusCode);
    subResource.addMethod('GET', integration, {
      methodResponses: [{ statusCode }],
    });
    return subResource;
  }

  private createIntegration(statusCode: string): apigw.MockIntegration {
    return new apigw.MockIntegration({
      requestTemplates: { 'application/json': `{ statusCode: ${Number(statusCode)} }` },
      integrationResponses: [{
        statusCode: statusCode,
        responseTemplates: {
          'application/json': JSON.stringify({ message: 'Hello, world' }),
        },
      }],
    });
  }
}

/**
 * -------------------------------------------------------
 * ------------------------- WHEN ------------------------
 * -------------------------------------------------------
 */
const certificate = Certificate.fromCertificateArn(testCase, 'Cert', certArn);
const api1 = new Api(testCase, 'IntegApi1', {
  statusCode: '201',
  path: 'items',
});
const api2 = new Api(testCase, 'IntegApi2', {
  statusCode: '202',
  path: 'items',
});


/**
 * Test 1
 *
 * Create an initial BasePathMapping for (none)
 * Then use a mixture of `addBasePathMapping` and `addApiMapping`
 * to test that they can be used together
 */
const domain = new apigw.DomainName(testCase, 'IntegDomain', {
  domainName,
  securityPolicy: apigw.SecurityPolicy.TLS_1_2,
  certificate,
  mapping: api1.restApi,
});
new CfnRecordSet(testCase, 'IntegDomainRecord', {
  name: domainName,
  type: 'A',
  hostedZoneId,
  aliasTarget: {
    hostedZoneId: domain.domainNameAliasHostedZoneId,
    dnsName: domain.domainNameAliasDomainName,
  },
});
domain.addBasePathMapping(api1.restApi, {
  basePath: 'orders',
});
domain.addApiMapping(api2.restApi.deploymentStage, {
  basePath: 'orders/v2',
});
domain.addApiMapping(api1.restApi.deploymentStage, {
  basePath: 'orders/v1',
});

/**
 * Test 2
 *
 * Create an initial BasePathMapping for 'orders'
 * and then add an ApiMapping for a multi-level path
 */
const secondDomain = new apigw.DomainName(testCase, 'Integ2Domain', {
  domainName: `another-${domainName}`,
  securityPolicy: apigw.SecurityPolicy.TLS_1_2,
  certificate,
  mapping: api1.restApi,
  basePath: 'orders',
});
new CfnRecordSet(testCase, 'Integ2DomainRecord', {
  name: `another-${domainName}`,
  type: 'A',
  hostedZoneId,
  aliasTarget: {
    hostedZoneId: secondDomain.domainNameAliasHostedZoneId,
    dnsName: secondDomain.domainNameAliasDomainName,
  },
});
secondDomain.addApiMapping(api2.restApi.deploymentStage, {
  basePath: 'orders/v2',
});


/**
 * Test 3
 *
 * Test that you can create an initial BasePathMapping (none)
 * and then add additional base path mappings
 */
const thirdDomain = new apigw.DomainName(testCase, 'Integ3Domain', {
  domainName: `yet-another-${domainName}`,
  securityPolicy: apigw.SecurityPolicy.TLS_1_2,
  certificate,
  mapping: api1.restApi,
});
new CfnRecordSet(testCase, 'Integ3DomainRecord', {
  name: `yet-another-${domainName}`,
  type: 'A',
  hostedZoneId,
  aliasTarget: {
    hostedZoneId: thirdDomain.domainNameAliasHostedZoneId,
    dnsName: thirdDomain.domainNameAliasDomainName,
  },
});
thirdDomain.addBasePathMapping(api2.restApi, {
  basePath: 'v2',
});


/**
 * -------------------------------------------------------
 * ------------------------- THEN ------------------------
 * -------------------------------------------------------
 */
const integ = new IntegTest(app, 'domain-name-mapping-test', {
  testCases: [testCase],
  enableLookups: true,
});

const invoke = new Function(testCase, 'InvokeApi', {
  code: Code.fromInline(`
const https = require('https');
exports.handler = async function(event) {
  console.log(event);
  const options = {
    hostname: event.hostname,
    path: event.path,
  };
  let dataString = '';
  const response = await new Promise((resolve, reject) => {
    const req = https.get(options, (res) => {
      res.on('data', data => {
        dataString += data;
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: dataString,
        });
      })
    });
    req.on('error', err => {
      reject({
        statusCode: 500,
        body: JSON.stringify({
          cause: 'Something went wrong',
          error: err,
        })
      });
    });
    req.end();
  });
  return response;
}

`),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_16_X,
});

const api1Invoke = integ.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    hostname: domain.domainName,
    path: '/orders/v1/items',
  }),
});
api1Invoke.expect(ExpectedResult.objectLike({
  Payload: Match.stringLikeRegexp('201'),
}));
const api2Invoke = integ.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    hostname: domain.domainName,
    path: '/orders/v2/items',
  }),
});
api2Invoke.expect(ExpectedResult.objectLike({
  Payload: Match.stringLikeRegexp('202'),
}));

const domain2api1Invoke = integ.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    hostname: secondDomain.domainName,
    path: '/orders/items',
  }),
});
domain2api1Invoke.expect(ExpectedResult.objectLike({
  Payload: Match.stringLikeRegexp('201'),
}));
const domain2api2Invoke = integ.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    hostname: secondDomain.domainName,
    path: '/orders/v2/items',
  }),
});
domain2api2Invoke.expect(ExpectedResult.objectLike({
  Payload: Match.stringLikeRegexp('202'),
}));
