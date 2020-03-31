import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api');
  const domainName = new apigw.DomainName(stack, 'domain-name', { domainName: 'test.example.com' });
  new apigw.ApiMapping(stack, 'mapping', {
    stage: api.deploymentStage!,
    domainName,
    api
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::ApiMapping", {
    ApiId: { Ref: "myapi4C7BF186" },
    Stage: { Ref: "myapiStageprod07E02E1F" },
    DomainName: { Ref: "domainname1131E743" }
  }));
});