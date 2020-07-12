import { expect, haveResource } from '@aws-cdk/assert';
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
      ParentId: { 'Fn::GetAtt': [ 'StackMyFunc9605894BApiEventSourceA7A86A4FA0EF20EE', 'RootResourceId' ] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4Ffoo036E62EF' },
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
      ParentId: { 'Fn::GetAtt': [ 'StackMyFunc9605894BApiEventSourceA7A86A4FA0EF20EE', 'RootResourceId' ] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'bar',
      ParentId: { 'Fn::GetAtt': [ 'StackMyFunc9605894BApiEventSourceA7A86A4FA0EF20EE', 'RootResourceId' ] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4Ffoo036E62EF' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4FbarDB723DC5' },
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
      ParentId: { 'Fn::GetAtt': [ 'StackMyFunc9605894BApiEventSourceA7A86A4FA0EF20EE', 'RootResourceId' ] },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'bar',
      ParentId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4Ffoo036E62EF' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4Ffoo036E62EF' },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'StackMyFunc9605894BApiEventSourceA7A86A4Ffoobar74614CB9' },
    }));

    test.done();
  },
};
