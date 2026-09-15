import * as path from 'path';
import type { Construct } from 'constructs';
import { readFileSync, readdirSync } from 'fs-extra';
import { toCloudFormation } from './util';
import * as cxapi from '../../cx-api';
import type { CfnStack } from '../lib';
import {
  Stack, NestedStack, Resource, CfnResource, App, CfnOutput, FileAssetPackaging, LegacyStackSynthesizer,
} from '../lib';
import { memoizedGetter } from '../lib/helpers-internal/memoize';
import { CfnReference } from '../lib/private/cfn-reference';
import { prepareApp } from '../lib/private/prepare-app';
import { resolveReferences } from '../lib/private/refs';

describe('nested-stack', () => {
  test('a nested-stack has a defaultChild', () => {
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack');
    var cfn_nestedStack = (nestedStack.node.defaultChild) as CfnStack;
    cfn_nestedStack.addPropertyOverride('TemplateURL', 'http://my-url.com');
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903: {
          DeletionPolicy: 'Delete',
          Properties: {
            TemplateURL: 'http://my-url.com',
          },
          Type: 'AWS::CloudFormation::Stack',
          UpdateReplacePolicy: 'Delete',
        },
      },
    });
  });
  test('a nested-stack has a description in templateOptions.', () => {
    const description = 'This is a description.';
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack', {
      description,
    });

    expect(nestedStack.templateOptions.description).toEqual(description);
  });

  test('indent templates when suppressTemplateIndentation is not set', () => {
    const app = new App();

    const stack = new Stack(app, 'Stack');
    const nestedStack = new NestedStack(stack, 'Nested1');
    new CfnResource(nestedStack, 'MyResource', { type: 'MyResourceType' });

    const assembly = app.synth();
    const nestedTemplate = readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8');
    expect(nestedTemplate).toMatch(/^{\n \"Resources\": {\n  \"MyResource\": {\n   \"Type\": \"MyResourceType\"\n  }\n }/);
  });

  test('indent templates when @aws-cdk/core:suppressTemplateIndentation is true but is overriden by suppressTemplateIndentation', () => {
    const app = new App({
      context: {
        '@aws-cdk/core:suppressTemplateIndentation': true,
      },
    });

    const stack = new Stack(app, 'Stack');
    const nestedStack = new NestedStack(stack, 'Nested1', { suppressTemplateIndentation: false });
    new CfnResource(nestedStack, 'MyResource', { type: 'MyResourceType' });

    const assembly = app.synth();
    const nestedTemplate = readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8');
    expect(nestedTemplate).toMatch(/^{\n \"Resources\": {\n  \"MyResource\": {\n   \"Type\": \"MyResourceType\"\n  }\n }/);
  });

  test('do not indent templates when suppressTemplateIndentation is true', () => {
    const app = new App();

    const stack = new Stack(app, 'Stack');
    const nestedStack = new NestedStack(stack, 'Nested1', { suppressTemplateIndentation: true });
    new CfnResource(nestedStack, 'MyResource', { type: 'MyResourceType' });

    const assembly = app.synth();
    const nestedTemplate = readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8');
    expect(nestedTemplate).toMatch(/^{\"Resources\":{\"MyResource\":{\"Type\":\"MyResourceType\"}}/);
  });

  test('do not indent templates when @aws-cdk/core:suppressTemplateIndentation is true', () => {
    const app = new App({
      context: {
        '@aws-cdk/core:suppressTemplateIndentation': true,
      },
    });

    const stack = new Stack(app, 'Stack');
    const nestedStack = new NestedStack(stack, 'Nested1');
    new CfnResource(nestedStack, 'MyResource', { type: 'MyResourceType' });

    const assembly = app.synth();
    const nestedTemplate = readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8');
    expect(nestedTemplate).toMatch(/^{\"Resources\":{\"MyResource\":{\"Type\":\"MyResourceType\"}}/);
  });

  test('can create cross region references when crossRegionReferences=true', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'weak' } });
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
      crossRegionReferences: true,
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
      crossRegionReferences: true,
    });
    const nestedStack = new NestedStack(stack1, 'Nested1');
    const nestedStack2 = new NestedStack(stack2, 'Nested2');

    // WHEN
    const myResource = new MyResource(nestedStack, 'Resource1');

    new CfnResource(nestedStack2, 'Resource2', {
      type: 'My::Resource',
      properties: {
        Prop1: myResource.name,
      },
    });

    // THEN
    const assembly = app.synth();
    const nestedTemplate2 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack2.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate2).toMatchObject({
      Resources: {
        Resource2: {
          Properties: {
            Prop1: {
              'Fn::GetStackOutput': {
                StackName: 'Stack1',
                Region: 'bermuda-triangle-1337',
                OutputName: 'PublishOutputFnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067Ref9772E2BF',
              },
            },
          },
          Type: 'My::Resource',
        },
      },
    });
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const nestedTemplate1 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate1?.Outputs).toEqual({
      Stack1Nested1Resource178AEB067Ref: {
        Value: {
          Ref: 'Resource1CCD41AB7',
        },
      },
    });

    expect(template1?.Outputs).toMatchObject({
      PublishOutputFnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067Ref9772E2BF: {
        Value: {
          'Fn::GetAtt': [
            'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
            'Outputs.Stack1Nested1Resource178AEB067Ref',
          ],
        },
      },
    });
  });

  test('cross region references require explicit physical name on nested stack resources', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
    });
    const nestedStack = new NestedStack(stack1, 'MyNestedStack');

    // WHEN
    const myResource = new MyResource(nestedStack, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    expect(() => app.synth()).toThrow(
      /Cannot use resource 'Stack1\/MyNestedStack\/MyResource' in a cross-environment fashion/);
  });

  test('requires bundling when root stack has exact match in BUNDLING_STACKS', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stack']);

    const child = new NestedStack(stack, 'Child');
    const child2 = new NestedStack(child, 'Child2');

    expect(child.bundlingRequired).toBe(true);
    expect(child2.bundlingRequired).toBe(true);
  });

  test('not requires bundling when root stack has no match in BUNDLING_STACKS', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stack2']);

    const child = new NestedStack(stack, 'Child');
    const child2 = new NestedStack(child, 'Child2');

    expect(child.bundlingRequired).toBe(false);
    expect(child2.bundlingRequired).toBe(false);
  });
});

/**
 * Defining nested stack assets adds references after the first round of reference
 * resolution, so `prepareApp()` resolves references a second time. That second round
 * only revisits nested stack resources, on the assumption that nothing else can have
 * gained a reference. An unresolved cross-stack reference does not fail; it renders as
 * a same-stack `{ Ref }` in the wrong template. So assert the assumption directly.
 */
describe('nested-stack reference resolution', () => {
  const env = { account: '123456789012', region: 'us-east-1' };

  const res = (scope: Construct, id: string, properties: any = {}) =>
    new CfnResource(scope, id, { type: 'Test::Resource', properties });

  const legacyAsset = (stack: Stack, sourceHash: string) => stack.synthesizer.addFileAsset({
    fileName: __filename,
    packaging: FileAssetPackaging.FILE,
    sourceHash,
  });

  const shapes: Array<[string, () => App]> = [
    ['four levels of nesting, legacy synthesizer', () => {
      const app = new App();
      const top = new Stack(app, 'Top', { synthesizer: new LegacyStackSynthesizer(), env });
      const l3 = new NestedStack(new NestedStack(new NestedStack(top, 'L1'), 'L2'), 'L3');
      res(l3, 'Deepest');
      return app;
    }],

    ['an asset at every level of nesting, legacy synthesizer', () => {
      const app = new App();
      let current: Stack = new Stack(app, 'Top', { synthesizer: new LegacyStackSynthesizer(), env });
      for (const id of ['L1', 'L2', 'L3', 'L4']) {
        current = new NestedStack(current, id);
        const location = legacyAsset(current, `hash-${id}`);
        res(current, `${id}Resource`, { Bucket: location.bucketName, Key: location.objectKey });
      }
      return app;
    }],

    ['a deeply nested stack referencing the top-level stack', () => {
      const app = new App();
      const top = new Stack(app, 'Top', { synthesizer: new LegacyStackSynthesizer(), env });
      const topResource = res(top, 'TopResource');
      const l3 = new NestedStack(new NestedStack(new NestedStack(top, 'L1'), 'L2'), 'L3');
      res(l3, 'Deepest', { FromTop: topResource.ref });
      return app;
    }],

    ['a nested stack referencing a sibling top-level stack', () => {
      const app = new App();
      const producer = new Stack(app, 'Producer', { env });
      const consumer = new Stack(app, 'Consumer', { env });
      const nested = new NestedStack(new NestedStack(consumer, 'L1'), 'L2');
      res(nested, 'Consumes', { From: res(producer, 'Produced').ref });
      return app;
    }],

    ['sibling nested stacks referencing each other', () => {
      const app = new App();
      const top = new Stack(app, 'Top', { env });
      const produced = res(new NestedStack(top, 'Left'), 'Produced');
      res(new NestedStack(top, 'Right'), 'Consumes', { From: produced.getAtt('Attribute').toString() });
      return app;
    }],

    ['weak cross-stack references in both directions', () => {
      const app = new App({ context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'weak' } });
      const producer = new Stack(app, 'Producer', { env });
      const consumer = new Stack(app, 'Consumer', { env });
      res(new NestedStack(consumer, 'Nested'), 'Consumes', { From: res(producer, 'Produced').ref });
      res(consumer, 'ConsumesNested', { From: res(new NestedStack(producer, 'NestedProducer'), 'Produced').ref });
      return app;
    }],

    ['both-strength cross-stack references', () => {
      const app = new App({ context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'both' } });
      const producer = new Stack(app, 'Producer', { env });
      const consumer = new Stack(app, 'Consumer', { env });
      res(new NestedStack(consumer, 'Nested'), 'Consumes', { From: res(producer, 'Produced').ref });
      return app;
    }],

    ['a cross-region reference out of a nested stack', () => {
      const app = new App();
      const producer = new Stack(app, 'Producer', { env, crossRegionReferences: true });
      const consumer = new Stack(app, 'Consumer', { env: { ...env, region: 'us-west-2' }, crossRegionReferences: true });
      res(consumer, 'Consumes', { From: res(new NestedStack(producer, 'Nested'), 'Produced').ref });
      return app;
    }],

    // tags are copied onto the nested stack resource while its asset is defined, i.e.
    // after the first round of reference resolution
    ['a nested stack tagged with a value from another stack', () => {
      const app = new App();
      const producer = new Stack(app, 'Producer', { env });
      const top = new Stack(app, 'Top', { synthesizer: new LegacyStackSynthesizer(), env });
      const l2 = new NestedStack(new NestedStack(top, 'L1'), 'L2');
      res(l2, 'Resource');
      l2.tags.setTag('FromOtherStack', res(producer, 'Produced').ref);
      return app;
    }],
  ];

  test.each(shapes)('%s: leaves no reference unresolved', (_name, buildApp) => {
    const app = buildApp();
    prepareApp(app);

    // an exhaustive sweep of the whole tree must now find nothing left to resolve
    const assignValue = jest.spyOn(CfnReference.prototype, 'assignValueForStack');
    try {
      resolveReferences(app);
      expect(assignValue.mock.calls.map(([stack]) => stack.node.path)).toEqual([]);
    } finally {
      assignValue.mockRestore();
    }
  });

  test.each(shapes)('%s: synthesizes templates that resolve on their own', (_name, buildApp) => {
    const app = buildApp();
    const assembly = app.synth();

    // every Ref and Fn::GetAtt must point at something its own template defines
    const dangling = new Array<string>();

    for (const file of readdirSync(assembly.directory).filter(f => f.endsWith('.template.json'))) {
      const template = JSON.parse(readFileSync(path.join(assembly.directory, file), 'utf-8'));
      const defined = new Set([
        ...Object.keys(template.Resources ?? {}),
        ...Object.keys(template.Parameters ?? {}),
      ]);

      for (const target of referencedLogicalIds(template)) {
        // pseudo parameters (AWS::Region, AWS::NoValue, ...) are always available
        if (!target.startsWith('AWS::') && !defined.has(target)) {
          dangling.push(`${file}: ${target}`);
        }
      }
    }

    expect(dangling).toEqual([]);

    // and every nested stack must be passed the parameters it declares
    const templateOf = (stack: Stack) => stack.nested
      ? JSON.parse(readFileSync(path.join(assembly.directory, (stack as NestedStack).templateFile), 'utf-8'))
      : assembly.getStackByName(stack.stackName).template;

    for (const nested of app.node.findAll().filter(NestedStack.isNestedStack)) {
      const parent = nested.nestedStackParent!;
      const stackResource = templateOf(parent).Resources[parent.resolve(nested.nestedStackResource!.logicalId)];
      const passed = Object.keys(stackResource.Properties?.Parameters ?? {});
      const required = Object.entries<any>(templateOf(nested).Parameters ?? {})
        .filter(([, param]) => param.Default === undefined)
        .map(([name]) => name);

      expect(passed).toEqual(expect.arrayContaining(required));
    }
  });
});

/**
 * Every logical id that a template points at with `Ref` or `Fn::GetAtt`
 */
function referencedLogicalIds(template: any): string[] {
  const result = new Array<string>();

  const recurse = (value: any): void => {
    if (Array.isArray(value)) {
      value.forEach(recurse);
    } else if (value !== null && typeof value === 'object') {
      for (const [key, inner] of Object.entries<any>(value)) {
        if (key === 'Ref' && typeof inner === 'string') {
          result.push(inner);
        } else if (key === 'Fn::GetAtt') {
          result.push(typeof inner === 'string' ? inner.split('.')[0] : inner[0]);
        } else {
          recurse(inner);
        }
      }
    }
  };

  recurse(template);
  return result;
}

class MyResource extends Resource {
  private readonly res: CfnResource;

  constructor(scope: Construct, id: string, physicalName?: string) {
    super(scope, id, { physicalName });

    this.res = new CfnResource(this, 'Resource', {
      type: 'My::Resource',
      properties: {
        resourceName: this.physicalName,
      },
    });
  }

  @memoizedGetter
  public get name(): string {
    return this.getResourceNameAttribute(this.res.ref.toString());
  }

  @memoizedGetter
  public get arn(): string {
    return this.getResourceArnAttribute(this.res.getAtt('Arn').toString(), {
      region: '',
      account: '',
      resource: 'my-resource',
      resourceName: this.physicalName,
      service: 'myservice',
    });
  }
}
