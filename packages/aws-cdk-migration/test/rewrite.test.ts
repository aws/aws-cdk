import { rewriteImports } from '../lib/rewrite';

describe(rewriteImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
    // something before
    import 'aws-cdk-lib/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites naked "require"', () => {
    const output = rewriteImports(`
    // something before
    require('@aws-cdk/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
    // something before
    require('aws-cdk-lib/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import from"', () => {
    const output = rewriteImports(`
  // something before
  import * as s3 from '@aws-cdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Stack } from "@aws-cdk/core";
  // something after

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import * as s3 from 'aws-cdk-lib/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Stack } from "aws-cdk-lib";
  // something after

  console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import = require"', () => {
    const output = rewriteImports(`
  // something before
  import s3 = require('@aws-cdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  // something after

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import s3 = require('aws-cdk-lib/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  // something after

  console.log('Look! I did something!');`);
  });

  test('does not rewrite @aws-cdk/assert', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites import namespaced Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import * as cdk from '@aws-cdk/core';
  // something after

  ${constructFileBody('cdk.Construct')}
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import * as cdk from 'aws-cdk-lib';
  import * as constructs from 'constructs';
  // something after

  ${constructFileBody('constructs.Construct')}
  console.log('Look! I did something!');`);
  });

  test('correctly rewrites require namespaced Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import cdk = require('@aws-cdk/core');
  // something after

  ${constructFileBody('cdk.Construct')}
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import cdk = require('aws-cdk-lib');
  import constructs = require('constructs');
  // something after

  ${constructFileBody('constructs.Construct')}
  console.log('Look! I did something!');`);
  });

  test('correctly rewrites barrel Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import { Construct, Stack } from '@aws-cdk/core';
  // something after

  ${constructFileBody('Construct')}
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import { Stack } from 'aws-cdk-lib';
  import { Construct } from 'constructs';
  // something after

  ${constructFileBody('Construct')}
  console.log('Look! I did something!');`);
  });

  test('correctly rewrites aliased barrel Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import { App, Construct as CoreConstruct } from '@aws-cdk/core';
  // something after

  ${constructFileBody('CoreConstruct')}
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import { App } from 'aws-cdk-lib';
  import { Construct as CoreConstruct } from 'constructs';
  // something after

  ${constructFileBody('CoreConstruct')}
  console.log('Look! I did something!');`);
  });
});

function constructFileBody(identifier: string) {
  return `
interface I {
    c: ${identifier};
}
class C {
    constructor(c: ${identifier}) {}
}
function f(c: ${identifier}) {
    new ${identifier}(c as ${identifier}, 'id')
}
`;
}
