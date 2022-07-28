import * as os from 'os';
import * as path from 'path';
import { ContextProvider } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import { CfnResource, DefaultStackSynthesizer, Stack, StackProps } from '../lib';
import { Annotations } from '../lib/annotations';
import { App, AppProps } from '../lib/app';

function withApp(props: AppProps, block: (app: App) => void): cxapi.CloudAssembly {
  const app = new App({
    stackTraces: false,
    ...props,
    context: {
      [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      ...props.context,
    },
  });

  block(app);

  return app.synth();
}

function synth(context?: { [key: string]: any }): cxapi.CloudAssembly {
  return withApp({ context }, app => {
    const stack1 = new Stack(app, 'stack1', { env: { account: '12345', region: 'us-east-1' } });
    new CfnResource(stack1, 's1c1', { type: 'DummyResource', properties: { Prop1: 'Prop1' } });
    const r2 = new CfnResource(stack1, 's1c2', { type: 'DummyResource', properties: { Foo: 123 } });

    const stack2 = new Stack(app, 'stack2');
    new CfnResource(stack2, 's2c1', { type: 'DummyResource', properties: { Prog2: 'Prog2' } });
    const c1 = new MyConstruct(stack2, 's1c2');

    // add some metadata
    stack1.node.addMetadata('meta', 111);
    Annotations.of(r2).addWarning('warning1');
    Annotations.of(r2).addWarning('warning2');
    c1.node.addMetadata('meta', { key: 'value' });
    app.node.addMetadata('applevel', 123); // apps can also have metadata
  });
}

function synthStack(name: string, includeMetadata: boolean = false, context?: any): cxapi.CloudFormationStackArtifact {
  const response = synth(context);
  const stack = response.getStackByName(name);

  if (!includeMetadata) {
    delete (stack as any).metadata;
  }

  return stack;
}

describe('app', () => {
  test('synthesizes all stacks and returns synthesis result', () => {
    const response = synth();
    delete (response as any).dir;

    expect(response.stacks.length).toEqual(2);

    const stack1 = response.stacks[0];
    expect(stack1.stackName).toEqual('stack1');
    expect(stack1.id).toEqual('stack1');
    expect(stack1.environment.account).toEqual('12345');
    expect(stack1.environment.region).toEqual('us-east-1');
    expect(stack1.environment.name).toEqual('aws://12345/us-east-1');
    expect(stack1.template).toEqual({
      Resources:
      {
        s1c1: { Type: 'DummyResource', Properties: { Prop1: 'Prop1' } },
        s1c2: { Type: 'DummyResource', Properties: { Foo: 123 } },
      },
    });
    expect(stack1.manifest.metadata).toEqual({
      '/stack1': [{ type: 'meta', data: 111 }],
      '/stack1/s1c1': [{ type: 'aws:cdk:logicalId', data: 's1c1' }],
      '/stack1/s1c2':
        [{ type: 'aws:cdk:logicalId', data: 's1c2' },
          { type: 'aws:cdk:warning', data: 'warning1' },
          { type: 'aws:cdk:warning', data: 'warning2' }],
    });

    const stack2 = response.stacks[1];
    expect(stack2.stackName).toEqual('stack2');
    expect(stack2.id).toEqual('stack2');
    expect(stack2.environment.name).toEqual('aws://unknown-account/unknown-region');
    expect(stack2.template).toEqual({
      Resources:
      {
        s2c1: { Type: 'DummyResource', Properties: { Prog2: 'Prog2' } },
        s1c2r1D1791C01: { Type: 'ResourceType1' },
        s1c2r25F685FFF: { Type: 'ResourceType2' },
      },
    });
    expect(stack2.manifest.metadata).toEqual({
      '/stack2/s2c1': [{ type: 'aws:cdk:logicalId', data: 's2c1' }],
      '/stack2/s1c2': [{ type: 'meta', data: { key: 'value' } }],
      '/stack2/s1c2/r1':
        [{ type: 'aws:cdk:logicalId', data: 's1c2r1D1791C01' }],
      '/stack2/s1c2/r2':
        [{ type: 'aws:cdk:logicalId', data: 's1c2r25F685FFF' }],
    });
  });

  test('context can be passed through CONTEXT_OVERFLOW_LOCATION_ENV', async () => {
    const contextDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-context'));
    const overflow = path.join(contextDir, 'overflow.json');
    fs.writeJSONSync(overflow, {
      key1: 'val1',
      key2: 'val2',
    });
    process.env[cxapi.CONTEXT_OVERFLOW_LOCATION_ENV] = overflow;

    const prog = new App();
    expect(prog.node.tryGetContext('key1')).toEqual('val1');
    expect(prog.node.tryGetContext('key2')).toEqual('val2');
  });

  test('context can be passed through CDK_CONTEXT', async () => {
    process.env[cxapi.CONTEXT_ENV] = JSON.stringify({
      key1: 'val1',
      key2: 'val2',
    });

    const prog = new App();
    expect(prog.node.tryGetContext('key1')).toEqual('val1');
    expect(prog.node.tryGetContext('key2')).toEqual('val2');
  });

  test('context passed through CONTEXT_OVERFLOW_LOCATION_ENV is merged with the context passed through CONTEXT_ENV', async () => {
    const contextDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-context'));
    const contextLocation = path.join(contextDir, 'context-temp.json');
    fs.writeJSONSync(contextLocation, {
      key1: 'val1',
      key2: 'val2',
    });
    process.env[cxapi.CONTEXT_OVERFLOW_LOCATION_ENV] = contextLocation;

    process.env[cxapi.CONTEXT_ENV] = JSON.stringify({
      key3: 'val3',
      key4: 'val4',
    });

    const prog = new App({
      context: {
        key1: 'val5',
        key2: 'val6',
      },
    });
    expect(prog.node.tryGetContext('key1')).toEqual('val1');
    expect(prog.node.tryGetContext('key2')).toEqual('val2');
    expect(prog.node.tryGetContext('key3')).toEqual('val3');
    expect(prog.node.tryGetContext('key4')).toEqual('val4');
  });

  test('context from the command line can be used when creating the stack', () => {
    const output = synthStack('stack2', false, { ctx1: 'HELLO' });

    expect(output.template).toEqual({
      Resources: {
        s2c1: {
          Type: 'DummyResource',
          Properties: {
            Prog2: 'Prog2',
          },
        },
        s1c2r1D1791C01: {
          Type: 'ResourceType1',
        },
        s1c2r25F685FFF: {
          Type: 'ResourceType2',
          Properties: {
            FromContext: 'HELLO',
          },
        },
      },
    });
  });

  test('setContext(k,v) can be used to set context programmatically', () => {
    const prog = new App({
      context: {
        foo: 'bar',
      },
    });
    expect(prog.node.tryGetContext('foo')).toEqual('bar');
  });

  test('setContext(k,v) cannot be called after stacks have been added because stacks may use the context', () => {
    const prog = new App();
    new Stack(prog, 's1');
    expect(() => prog.node.setContext('foo', 'bar')).toThrow();
  });

  test('app.synth() performs validation first and if there are errors, it returns the errors', () => {
    class Child extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        this.node.addValidation({ validate: () => [`Error from ${this.node.id}`] });
      }
    }

    class Parent extends Stack {
    }

    const app = new App();

    const parent = new Parent(app, 'Parent');
    new Child(parent, 'C1');
    new Child(parent, 'C2');

    expect(() => app.synth()).toThrow(/Validation failed with the following errors/);
  });

  test('app.synthesizeStack(stack) will return a list of missing contextual information', () => {
    class MyStack extends Stack {
      constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        this.reportMissingContextKey({
          key: 'missing-context-key',
          provider: ContextProvider.AVAILABILITY_ZONE_PROVIDER,
          props: {
            account: '12345689012',
            region: 'ab-north-1',
          },
        },
        );

        this.reportMissingContextKey({
          key: 'missing-context-key-2',
          provider: ContextProvider.AVAILABILITY_ZONE_PROVIDER,
          props: {
            account: '12345689012',
            region: 'ab-south-1',
          },
        },
        );
      }
    }

    const assembly = withApp({}, app => {
      new MyStack(app, 'MyStack', { synthesizer: new DefaultStackSynthesizer() });
    });

    expect(assembly.manifest.missing).toEqual([
      {
        key: 'missing-context-key',
        provider: ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        props: {
          lookupRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-lookup-role-${AWS::AccountId}-${AWS::Region}',
          account: '12345689012',
          region: 'ab-north-1',
        },
      },
      {
        key: 'missing-context-key-2',
        provider: ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        props: {
          lookupRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-lookup-role-${AWS::AccountId}-${AWS::Region}',
          account: '12345689012',
          region: 'ab-south-1',
        },
      },
    ]);
  });

  /**
   * Runtime library versions are now synthesized into the Stack templates directly
   *
   * The are not emitted into Cloud Assembly metadata anymore
   */
  test('runtime library versions are not emitted in asm anymore', () => {
    const assembly = withApp({ analyticsReporting: true }, app => {
      const stack = new Stack(app, 'stack1');
      new CfnResource(stack, 'MyResource', { type: 'Resource::Type' });
    });

    expect(assembly.runtime).toEqual({ libraries: {} });
  });

  test('deep stack is shown and synthesized properly', () => {
  // WHEN
    const response = withApp({}, (app) => {
      const topStack = new Stack(app, 'Stack');
      const topResource = new CfnResource(topStack, 'Res', { type: 'CDK::TopStack::Resource' });

      const bottomStack = new Stack(topResource, 'Stack');
      new CfnResource(bottomStack, 'Res', { type: 'CDK::BottomStack::Resource' });
    });

    // THEN
    expect(response.stacks.map(s => ({ name: s.stackName, template: s.template }))).toEqual([
      {
        name: 'Stack',
        template: { Resources: { Res: { Type: 'CDK::TopStack::Resource' } } },
      },
      {
        name: 'StackResStack7E4AFA86',
        template: { Resources: { Res: { Type: 'CDK::BottomStack::Resource' } } },
      },
    ]);
  });

  test('stacks are written to the assembly file in a topological order', () => {
    // WHEN
    const assembly = withApp({}, (app) => {
      const stackC = new Stack(app, 'StackC');
      const stackD = new Stack(app, 'StackD');
      const stackA = new Stack(app, 'StackA');
      const stackB = new Stack(app, 'StackB');

      // Create the following dependency order:
      // A ->
      //      C -> D
      // B ->
      stackC.addDependency(stackA);
      stackC.addDependency(stackB);
      stackD.addDependency(stackC);
    });

    // THEN
    const artifactsIds = assembly.artifacts.map(a => a.id);
    expect(artifactsIds.indexOf('StackA')).toBeLessThan(artifactsIds.indexOf('StackC'));
    expect(artifactsIds.indexOf('StackB')).toBeLessThan(artifactsIds.indexOf('StackC'));
    expect(artifactsIds.indexOf('StackC')).toBeLessThan(artifactsIds.indexOf('StackD'));
  });

  test('application support any type in context', () => {
    const app = new App({
      context: {
        isString: 'string',
        isNumber: 10,
        isObject: { isString: 'string', isNumber: 10 },
      },
    });

    expect(app.node.tryGetContext('isString')).toEqual('string');
    expect(app.node.tryGetContext('isNumber')).toEqual(10);
    expect(app.node.tryGetContext('isObject')).toEqual({ isString: 'string', isNumber: 10 });
  });
});

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new CfnResource(this, 'r1', { type: 'ResourceType1' });
    new CfnResource(this, 'r2', { type: 'ResourceType2', properties: { FromContext: this.node.tryGetContext('ctx1') } });
  }
}
