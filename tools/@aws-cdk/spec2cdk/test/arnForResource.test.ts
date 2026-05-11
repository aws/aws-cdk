
import type { Resource, Service, SpecDatabase, StringType } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import type { Plain } from '@cdklabs/tskb';
import { ClassType } from '@cdklabs/typewriter';
import { moduleForResource, TestRenderer } from './util';

let renderer: TestRenderer;
let db: SpecDatabase;
let service: Service;

const BASE_INFO: Plain<Resource> = {
  name: 'Resource',
  cloudFormationType: 'AWS::Some::Resource',
  properties: {},
  attributes: {},
};
const BASE_RESOURCE: Plain<Resource> = {
  ...BASE_INFO,
  primaryIdentifier: ['Id'],
  properties: {
    Id: {
      type: { type: 'string' },
      documentation: 'The identifier of the resource',
    },
  },
};

describe('arnForResource is generated', () => {
  beforeEach(async () => {
    renderer = new TestRenderer();
    db = emptyDatabase();

    service = db.allocate('service', {
      name: 'aws-some',
      shortName: 'some',
      capitalized: 'Some',
      cloudFormationNamespace: 'AWS::Some',
    });
  });

  describe('Arn attributes', () => {
    test('resource with Arn attribute uses attribute', () => {
      const res = testResource({
        ...BASE_RESOURCE,
        attributes: {
          Arn: {
            type: { type: 'string' } as StringType,
          },
        },
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);
      expect(rendered).toContain('resource.resourceRef.resourceArn');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return resource.resourceRef.resourceArn;
}"
`);
    });

    test('resource with <Resource>Arn attribute uses attribute', () => {
      const res = testResource({
        ...BASE_RESOURCE,
        attributes: {
          ResourceArn: {
            type: { type: 'string' } as StringType,
          },
        },
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);
      expect(rendered).toContain('resource.resourceRef.resourceArn');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return resource.resourceRef.resourceArn;
}"
`);
    });

    test('resource with <Resource>ARN attribute uses attribute', () => {
      const res = testResource({
        ...BASE_RESOURCE,
        attributes: {
          ResourceARN: {
            type: { type: 'string' } as StringType,
          },
        },
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);
      expect(rendered).toContain('resource.resourceRef.resourceArn');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return resource.resourceRef.resourceArn;
}"
`);
    });

    test('resource with property prefix extracted from primary identifier uses <Prefix>Arn attribute', () => {
      const res = testResource({
        ...BASE_INFO,
        primaryIdentifier: ['FooBarId'],
        properties: {
          Id: {
            type: { type: 'string' },
            documentation: 'The identifier of the resource',
          },
        },
        attributes: {
          FooBarArn: {
            type: { type: 'string' } as StringType,
          },
        },
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);
      expect(rendered).toContain('resource.resourceRef.fooBarArn');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return resource.resourceRef.fooBarArn;
}"
`);
    });
  });

  describe('arn templates', () => {
    test('primary identifier is Id and template has <Resource>Id variable', () => {
      const res = testResource({
        ...BASE_RESOURCE,
        arnTemplate: 'arn:${Partition}:some:${Region}:${Account}:resource/${ResourceId}',
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);

      expect(rendered).toContain('.interpolate');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return new cfn_parse.TemplateString("arn:\${Partition}:some:\${Region}:\${Account}:resource/\${ResourceId}").interpolate({
    Partition: cdk.Stack.of(resource).partition,
    Region: resource.env.region,
    Account: resource.env.account,
    ResourceId: resource.resourceRef.resourceId
  });
}"
`);
    });

    test('primary identifier with custom name', () => {
      const res = testResource({
        ...BASE_RESOURCE,
        primaryIdentifier: ['Team'],
        properties: {
          Team: {
            type: { type: 'string' },
          },
        },
        arnTemplate: 'arn:${Partition}:some:${Region}:${Account}:resource/${Team}',
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);

      expect(rendered).toContain('.interpolate');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return new cfn_parse.TemplateString("arn:\${Partition}:some:\${Region}:\${Account}:resource/\${Team}").interpolate({
    Partition: cdk.Stack.of(resource).partition,
    Region: resource.env.region,
    Account: resource.env.account,
    Team: resource.resourceRef.team
  });
}"
`);
    });

    test('variable is not primary identifier ', () => {
      const res = testResource({
        ...BASE_INFO,
        arnTemplate: 'arn:${Partition}:sagemaker:${Region}:${Account}:workteam/${WorkteamName}',
        primaryIdentifier: ['Id'],
        attributes: {
          WorkteamName: {
            type: { type: 'string' },
          },
          Id: {
            type: { type: 'string' },
          },
        },
        properties: {
          WorkteamName: {
            type: { type: 'string' },
            causesReplacement: 'yes',
          },
        },
      });

      const arnForResource = findArnForResourceMethod(res);
      const rendered = renderer.renderMethod(arnForResource!);

      expect(rendered).toContain('.interpolate');
      expect(rendered).toMatchInlineSnapshot(`
"public static arnForResource(resource: IResourceRef): string {
  return new cfn_parse.TemplateString("arn:\${Partition}:sagemaker:\${Region}:\${Account}:workteam/\${WorkteamName}").interpolate({
    Partition: cdk.Stack.of(resource).partition,
    Region: resource.env.region,
    Account: resource.env.account,
    WorkteamName: resource.resourceRef.workteamName
  });
}"
`);
    });
  });
});

function testResource(spec: Plain<Resource>) {
  const resource = db.allocate('resource', spec);
  db.link('hasResource', service, resource);
  return db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();
}

function findArnForResourceMethod(resource: Resource) {
  const module = moduleForResource(resource, { db });

  const type = module.tryFindType('@aws-cdk/aws-some/aws-some.CfnResource') as ClassType;
  expect(type instanceof ClassType).toBeTruthy();

  const method = type.methods.find(m => m.name === 'arnForResource');
  expect(method).toBeDefined();

  return method;
}
