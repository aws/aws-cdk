import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import events = require('../lib');

export = {
  'minimal example'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.inline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "foo",
      ParentId: { "Fn::GetAtt": [ "MyFuncApiEventSourceA7A86A4FF4B434AC", "RootResourceId" ] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: "MyFuncApiEventSourceA7A86A4Ffoo73254F28" },
    }));

    test.done();
  },

  'disjoint routes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.inline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));
    handler.addEventSource(new events.ApiEventSource('post', '/bar'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "foo",
      ParentId: { "Fn::GetAtt": [ "MyFuncApiEventSourceA7A86A4FF4B434AC", "RootResourceId" ] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "bar",
      ParentId: { "Fn::GetAtt": [ "MyFuncApiEventSourceA7A86A4FF4B434AC", "RootResourceId" ] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: "MyFuncApiEventSourceA7A86A4Ffoo73254F28" },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: "MyFuncApiEventSourceA7A86A4FbarFF0EF497" },
    }));

    test.done();
  },

  "tree of routes"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'MyFunc', {
      code: lambda.Code.inline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
    });

    // WHEN
    handler.addEventSource(new events.ApiEventSource('get', '/foo'));
    handler.addEventSource(new events.ApiEventSource('post', '/foo/bar'));
    handler.addEventSource(new events.ApiEventSource('post', '/foo/bar/zoo'));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "foo",
      ParentId: { "Fn::GetAtt": [ "MyFuncApiEventSourceA7A86A4FF4B434AC", "RootResourceId" ] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "bar",
      ParentId: { Ref: "MyFuncApiEventSourceA7A86A4Ffoo73254F28" }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: "MyFuncApiEventSourceA7A86A4Ffoo73254F28" },
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: "MyFuncApiEventSourceA7A86A4Ffoobarzoo34214ADE" },
    }));

    test.done();
  }
};