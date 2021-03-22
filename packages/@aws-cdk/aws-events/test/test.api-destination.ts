import { expect, haveResource } from '@aws-cdk/assert';
import { Stack, Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ApiDestination, HttpMethod } from '../lib/api-destination';


export = {
  'creates an api destination for an EventBus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ApiDestination(stack, 'ApiDestination', {
      connectionArn: 'connectionArn',
      description: 'ApiDestination',
      httpMethod: HttpMethod.GET,
      invocationEndpoint: 'someendpoint',
      invocationRateLimitPerSecond: Duration.seconds(60),
      name: 'ApiDestination',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::ApiDestination', {
      ConnectionArn: 'connectionArn',
      Description: 'ApiDestination',
      HttpMethod: 'GET',
      InvocationEndpoint: 'someendpoint',
      InvocationRateLimitPerSecond: 60,
      Name: 'ApiDestination',
    }));

    test.done();
  },
}
