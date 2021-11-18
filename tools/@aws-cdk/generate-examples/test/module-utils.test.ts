import * as reflect from 'jsii-reflect';

import { module } from '../lib/module-utils';
import { AssemblyFixture, DUMMY_ASSEMBLY_TARGETS } from './testutil';

describe('v1 names are correct: ', () => {
  test('core', async () => {
    // GIVEN
    const mod = '@aws-cdk/core';
    const { ts, assembly } = await v1BuildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('cdk');
    expect(moduleName).toEqual(mod);

    await assembly.cleanup();
  });

  test('special package root', async () => {
    // GIVEN
    const mod = '@aws-cdk/aws-elasticloadbalancingv2';
    const { ts, assembly } = await v1BuildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('elbv2');
    expect(moduleName).toEqual(mod);

    await assembly.cleanup();
  });

  test('with "aws-"', async () => {
    // GIVEN
    const mod = '@aws-cdk/aws-s3';
    const { ts, assembly } = await v1BuildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('s3');
    expect(moduleName).toEqual(mod);

    await assembly.cleanup();
  });

  test('without "aws-"', async () => {
    // GIVEN
    const mod = '@aws-cdk/pipelines';
    const { ts, assembly } = await v1BuildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('pipelines');
    expect(moduleName).toEqual(mod);

    await assembly.cleanup();
  });
});

describe('v2 names are correct: ', () => {
  test('core', async () => {
    // GIVEN
    const mod = 'aws-cdk-lib';
    const { ts, assembly } = await v2BuildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('cdk');
    expect(moduleName).toEqual(mod);

    await assembly.cleanup();
  });

  test('special namespace', async () => {
    // GIVEN
    const mod = 'aws-cdk-lib/aws_elasticloadbalancingv2';
    const { ts, assembly } = await v2BuildAssemblyHelper(mod);

    // THEN
    expect(module(
      ts.findClass('aws-cdk-lib.aws_elasticloadbalancingv2.ClassB'),
    )).toEqual({
      moduleName: 'aws-cdk-lib',
      submoduleName: 'aws_elasticloadbalancingv2',
      importName: 'elbv2',
    });

    await assembly.cleanup();
  });

  test('with "aws_"', async () => {
    // GIVEN
    const mod = 'aws-cdk-lib/aws_s3';
    const { ts, assembly } = await v2BuildAssemblyHelper(mod);

    // THEN
    expect(module(ts.findClass('aws-cdk-lib.aws_s3.ClassB'))).toEqual({
      moduleName: 'aws-cdk-lib',
      submoduleName: 'aws_s3',
      importName: 's3',
    });

    await assembly.cleanup();
  });

  test('without "aws_"', async () => {
    // GIVEN
    const mod = 'aws-cdk-lib/pipelines';
    const { ts, assembly } = await v2BuildAssemblyHelper(mod);

    // THEN
    expect(module(ts.findClass('aws-cdk-lib.pipelines.ClassB'))).toEqual({
      moduleName: 'aws-cdk-lib',
      submoduleName: 'pipelines',
      importName: 'pipelines',
    });

    await assembly.cleanup();
  });
});

async function v1BuildAssemblyHelper(name: string) {
  const assembly = await AssemblyFixture.fromSource(
    {
      'index.ts': `
      export class ClassA { }
      `,
    },
    {
      name,
      jsii: DUMMY_ASSEMBLY_TARGETS,
    },
  );

  const ts = new reflect.TypeSystem();
  await ts.load(assembly.directory);
  return { ts, assembly };
}

async function v2BuildAssemblyHelper(name: string) {
  const [assemblyName, submoduleName] = name.split('/');
  const assembly = await AssemblyFixture.fromSource(
    {
      'index.ts': `
      export * as ${submoduleName ?? 'dummy'} from "./submod";
      export class ClassA { }
      `,
      'submod.ts': `
      export class ClassB { }
      `,
    },
    {
      name: assemblyName,
      jsii: DUMMY_ASSEMBLY_TARGETS,
    },
  );

  const ts = new reflect.TypeSystem();
  await ts.load(assembly.directory);
  return { ts, assembly };
}