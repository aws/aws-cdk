import { rewriteImports } from '../lib/rewrite';

describe(rewriteImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');

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

    console.log('Look! I did something!');`, 'subhect.ts');

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

    console.log('Look! I did something!');`, 'subhect.ts');

    expect(output).toBe(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites namespaced Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import * as cdk from '@aws-cdk/core';
  // something after

  function f(c: cdk.Construct) {
  }
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import * as cdk from 'aws-cdk-lib';
  import * as constructs from 'constructs';
  // something after

  function f(c: constructs.Construct) {
  }
  console.log('Look! I did something!');`);
  });

  test('correctly rewrites barrel Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import { Construct, Stack } from '@aws-cdk/core';
  // something after

  function f(c: Construct) {
  }
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import { Stack } from 'aws-cdk-lib';
  import { Construct } from 'constructs';
  // something after

  function f(c: Construct) {
  }
  console.log('Look! I did something!');`);
  });

  test('correctly rewrites aliased barrel Construct by moving to constructs', () => {
    const output = rewriteImports(`
  // something before
  import { Construct as CoreConstruct, Stack } from '@aws-cdk/core';
  // something after

  function f(c: CoreConstruct) {
  }
  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import { Stack } from 'aws-cdk-lib';
  import { Construct as CoreConstruct } from 'constructs';
  // something after

  function f(c: CoreConstruct) {
  }
  console.log('Look! I did something!');`);
  });
});
