import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.HttpApi(stack, 'my-api');
  const domainName = new apigw.DomainName(stack, 'domain-name', { domainName: 'test.example.com' });
  api.addApiMapping({
    stage: api.deploymentStage!,
    domainName,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::ApiMapping', {
    ApiId: { Ref: 'myapi4C7BF186' },
    Stage: { Ref: 'myapiDefaultStage51F6D7C3' },
    DomainName: { Ref: 'domainname1131E743' },
  }));
});