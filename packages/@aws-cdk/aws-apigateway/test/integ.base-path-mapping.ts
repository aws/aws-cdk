import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigateway from '../lib';

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const restApi = new apigateway.RestApi(this, 'Api');

    restApi.root.addMethod('GET');

    const domainName = apigateway.DomainName.fromDomainNameAttributes(this, 'Domain', {
      domainName: 'domainName',
      domainNameAliasHostedZoneId: 'domainNameAliasHostedZoneId',
      domainNameAliasTarget: 'domainNameAliasTarget',
    });

    new apigateway.BasePathMapping(this, 'MappingOne', {
      domainName,
      restApi,
    });

    new apigateway.BasePathMapping(this, 'MappingTwo', {
      domainName,
      restApi,
      basePath: 'path',
      attachToStage: false,
    });

    new apigateway.BasePathMapping(this, 'MappingThree', {
      domainName,
      restApi,
      basePath: 'api/v1/multi-level-path',
      attachToStage: false,
    });
  }
}

const app = new cdk.App();

const testStack = new TestStack(app, 'test-stack');

new IntegTest(app, 'base-path-mapping', {
  testCases: [testStack],
});
