import * as reflect from 'jsii-reflect';

import { module } from '../lib/module-utils';
import { AssemblyFixture, DUMMY_ASSEMBLY_TARGETS } from './testutil';

describe('v1 names are correct: ', () => {
  test('core', async () => {
    // GIVEN
    const mod = '@aws-cdk/core';
    const ts = await buildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('cdk');
    expect(moduleName).toEqual(mod);
  });

  test('special package root', async () => {
    // GIVEN
    const mod = '@aws-cdk/aws-elasticloadbalancingv2';
    const ts = await buildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('elbv2');
    expect(moduleName).toEqual(mod);
  });

  test('with "aws-"', async () => {
    // GIVEN
    const mod = '@aws-cdk/aws-s3';
    const ts = await buildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('s3');
    expect(moduleName).toEqual(mod);
  });

  test('without "aws-"', async () => {
    // GIVEN
    const mod = '@aws-cdk/pipelines';
    const ts = await buildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('pipelines');
    expect(moduleName).toEqual(mod);
  });
});

describe('v2 names are correct: ', () => {
  test('core', async () => {
    // GIVEN
    const mod = 'aws-cdk-lib';
    const ts = await buildAssemblyHelper(mod);

    // THEN
    const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    expect(importName).toEqual('cdk');
    expect(moduleName).toEqual(mod);
  });

  test('special namespace', async () => {
    // GIVEN
    // const mod = 'aws-cdk-lib/aws_elasticloadbalancingv2';
    // const ts = await buildAssemblyHelper(mod);

    // // THEN
    // const { importName, moduleName } = module(ts.findClass(`${mod}.ClassA`));
    // expect(importName).toEqual('elbv2');
    // expect(moduleName).toEqual(mod);
  });

  test('with "aws-"', () => {

  });

  test('without "aws-"', () => {

  });
});

async function buildAssemblyHelper(name: string): Promise<reflect.TypeSystem> {
  const assembly = await AssemblyFixture.fromSource(
    {
      'index.ts': `
      export class ClassA {
        public someMethod() {
        }
      }`,
    },
    {
      name,
      jsii: DUMMY_ASSEMBLY_TARGETS,
    },
  );

  const ts = new reflect.TypeSystem();
  await ts.load(assembly.directory);
  return ts;
}