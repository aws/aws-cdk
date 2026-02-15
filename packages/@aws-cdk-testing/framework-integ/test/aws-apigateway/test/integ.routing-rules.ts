import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

/**
 * Integration test for API Gateway custom domain routing rules.
 * Creates a domain with routingMode ROUTING_RULE_ONLY and multiple routing rules
 * (path-based, header-based, and catch-all).
 */
class RoutingRulesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate/00000000-0000-0000-0000-000000000000';
    const certificate = acm.Certificate.fromCertificateArn(this, 'Cert', certArn);

    const usersApi = new apigw.RestApi(this, 'UsersApi', { deploy: true });
    usersApi.root.addMethod('GET');

    const ordersApi = new apigw.RestApi(this, 'OrdersApi', { deploy: true });
    ordersApi.root.addMethod('GET');

    const defaultApi = new apigw.RestApi(this, 'DefaultApi', { deploy: true });
    defaultApi.root.addMethod('GET');

    const domainName = `api-${this.stackName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.example.com`;
    const domain = new apigw.DomainName(this, 'Domain', {
      domainName,
      certificate,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    domain.addRoutingRule('UsersRule', {
      priority: 100,
      conditions: { basePaths: ['users'] },
      action: {
        restApi: usersApi,
        stripBasePath: true,
      },
    });

    domain.addRoutingRule('HeaderV2Rule', {
      priority: 50,
      conditions: {
        headers: [{ header: 'x-api-version', valueGlob: 'v2' }],
      },
      action: { restApi: ordersApi },
    });

    domain.addRoutingRule('CatchAllRule', {
      priority: 999999,
      action: { restApi: defaultApi },
    });
  }
}

const app = new cdk.App();
const stack = new RoutingRulesStack(app, 'integ-routing-rules');

new IntegTest(app, 'routing-rules', {
  testCases: [stack],
});
