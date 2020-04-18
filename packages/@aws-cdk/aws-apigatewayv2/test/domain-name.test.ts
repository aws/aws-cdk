import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new apigw.DomainName(stack, 'domain-name', {
    domainName: 'test.example.com',
    domainNameConfigurations: [
      {
        endpointType: apigw.EndpointType.EDGE
      }
    ]
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::DomainName", {
    DomainName: 'test.example.com',
    DomainNameConfigurations: [ { EndpointType: "EDGE" } ]
  }));
});