#!/usr/bin/env node
import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

/**
 * Self-contained integration test for API Gateway custom domain routing rules.
 *
 * Routing rules require a REGIONAL custom domain name, which requires an ISSUED
 * certificate. A self-signed certificate for `routing-rule.integ.local` is imported
 * into ACM via a custom resource so the test needs no pre-existing domain or hosted zone.
 */
const DOMAIN_NAME = 'routing-rule.integ.local';
const IMPORT_CERTIFICATE_RESOURCE_TYPE = 'Custom::ACMImportRoutingRuleCertificate';

class ImportedCertificate extends Construct {
  public readonly certificateArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const serviceToken = cdk.CustomResourceProvider.getOrCreate(this, IMPORT_CERTIFICATE_RESOURCE_TYPE, {
      codeDirectory: path.join(__dirname, 'routing-rule-certificate-handler'),
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
      policyStatements: [{
        Effect: 'Allow',
        Action: ['acm:ImportCertificate', 'acm:DeleteCertificate'],
        Resource: '*',
      }],
    });

    const resource = new cdk.CustomResource(this, 'Resource', {
      resourceType: IMPORT_CERTIFICATE_RESOURCE_TYPE,
      serviceToken,
    });
    this.certificateArn = resource.getAttString('CertificateArn');
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigateway-routing-rule');

const importedCert = new ImportedCertificate(stack, 'Certificate');
const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', importedCert.certificateArn);

function mockApi(id: string): apigw.RestApi {
  const api = new apigw.RestApi(stack, id, {
    endpointTypes: [apigw.EndpointType.REGIONAL],
  });
  api.root.addMethod('GET', new apigw.MockIntegration({
    requestTemplates: { 'application/json': '{ "statusCode": 200 }' },
    integrationResponses: [{
      statusCode: '200',
      responseTemplates: { 'application/json': JSON.stringify({ message: 'ok' }) },
    }],
  }), {
    methodResponses: [{ statusCode: '200' }],
  });
  return api;
}

const usersApi = mockApi('UsersApi');
const ordersApi = mockApi('OrdersApi');
const defaultApi = mockApi('DefaultApi');

const domain = new apigw.DomainName(stack, 'Domain', {
  domainName: DOMAIN_NAME,
  certificate,
  endpointType: apigw.EndpointType.REGIONAL,
  routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
});
domain.node.addDependency(importedCert);

// Path-based routing.
domain.addRoutingRule('UsersRule', {
  priority: 100,
  conditions: { basePath: 'users' },
  action: { restApi: usersApi, stripBasePath: true },
});

// Header-based routing.
domain.addRoutingRule('HeaderV2Rule', {
  priority: 50,
  conditions: { headers: [{ header: 'x-api-version', valueGlob: 'v2' }] },
  action: { restApi: ordersApi },
});

// Combined base path + header conditions (AND).
domain.addRoutingRule('V2OrdersRule', {
  priority: 75,
  conditions: {
    basePath: 'orders',
    headers: [{ header: 'x-api-version', valueGlob: 'v2' }],
  },
  action: { restApi: ordersApi, stripBasePath: true },
});

// Catch-all rule (no conditions), using the maximum priority.
domain.addRoutingRule('CatchAllRule', {
  priority: 1000000,
  action: { restApi: defaultApi },
});

// Standalone RoutingRule construct against the same domain.
new apigw.RoutingRule(stack, 'StandaloneRule', {
  domainName: domain,
  priority: 200,
  conditions: { basePath: 'admin' },
  action: { restApi: usersApi, stripBasePath: true },
});

new IntegTest(app, 'routing-rule', {
  testCases: [stack],
});
