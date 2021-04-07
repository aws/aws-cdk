import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as events from '../lib';

export = {
  'minimal example'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.fromInline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'foo',
      ParentId: { 'Fn::GetAtt': ['MyFuncApiEventSourceA7A86A4FFB3F557C', 'RootResourceId'] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'MyFuncApiEventSourceA7A86A4FfooCA6F87E4' },
    }));

    test.done();
  },

  'disjoint routes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.fromInline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));
    handler.addEventSource(new events.ApiEventSource('post', '/bar'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'foo',
      ParentId: { 'Fn::GetAtt': ['MyFuncApiEventSourceA7A86A4FFB3F557C', 'RootResourceId'] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'bar',
      ParentId: { 'Fn::GetAtt': ['MyFuncApiEventSourceA7A86A4FFB3F557C', 'RootResourceId'] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'MyFuncApiEventSourceA7A86A4FfooCA6F87E4' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'MyFuncApiEventSourceA7A86A4FbarDFB0F21B' },
    }));

    test.done();
  },

  'tree of routes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.fromInline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));
    handler.addEventSource(new events.ApiEventSource('post', '/foo/bar'));
    handler.addEventSource(new events.ApiEventSource('post', '/foo/bar/zoo'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'foo',
      ParentId: { 'Fn::GetAtt': ['MyFuncApiEventSourceA7A86A4FFB3F557C', 'RootResourceId'] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'bar',
      ParentId: { Ref: 'MyFuncApiEventSourceA7A86A4FfooCA6F87E4' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'MyFuncApiEventSourceA7A86A4FfooCA6F87E4' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'MyFuncApiEventSourceA7A86A4Ffoobar028FFFDE' },
    }));

    test.done();
  },
};
