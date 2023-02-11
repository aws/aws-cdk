import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let certificate: acm.Certificate;

beforeEach(() => {
  stack = new cdk.Stack();
  certificate = new Certificate(stack, 'certificate', {
    domainName: 'aws.amazon.com',
  });
});

describe('Tests of AppSync Domain Name', () => {
  test('DomainNameAssociation depends on DomainName construct', () => {
    new appsync.GraphqlApi(stack, 'baseApi', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
      domainName: {
        certificate,
        domainName: 'aws.amazon.com',
      },
    });

    const domainName = Template.fromStack(stack).findResources(
      'AWS::AppSync::DomainName',
    );

    Template.fromStack(stack).hasResource(
      'AWS::AppSync::DomainNameApiAssociation',
      {
        DependsOn: [Object.keys(domainName)[0]],
      },
    );
  });

  test('appSyncDomainName exposes the domain of the associated AWS::AppSync::DomainName', () => {
    const api = new appsync.GraphqlApi(stack, 'baseApi', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
      domainName: {
        certificate,
        domainName: 'aws.amazon.com',
      },
    });

    expect(stack.resolve(api.appSyncDomainName)).toEqual({ 'Fn::GetAtt': ['baseApiDomainName52E3D63D', 'AppSyncDomainName'] });
  });

  test('appSyncDomainName should throw an error when no custom domain has been configured', () => {
    const api = new appsync.GraphqlApi(stack, 'baseApi', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
    });

    expect(() => api.appSyncDomainName).toThrow('Cannot retrieve the appSyncDomainName without a domainName configuration');
  });
});
