import { rewriteImports } from '../lib/rewrite';

describe(rewriteImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, { fileName: 'subject.ts' });

    expect(output).toBe(`
    // something before
    import '@monocdk-experiment/assert/jest';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites naked "require"', () => {
    const output = rewriteImports(`
    // something before
    require('@aws-cdk/assert/jest');
    // something after

    console.log('Look! I did something!');`, { fileName: 'subject.ts' });

    expect(output).toBe(`
    // something before
    require('@monocdk-experiment/assert/jest');
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import from"', () => {
    const output = rewriteImports(`
  // something before
  import * as s3 from '@aws-cdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "@aws-cdk/core";
  // something after

  console.log('Look! I did something!');`, { fileName: 'subject.ts' });

    expect(output).toBe(`
  // something before
  import * as s3 from 'monocdk-experiment/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "monocdk-experiment";
  // something after

  console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import = require"', () => {
    const output = rewriteImports(`
  // something before
  import s3 = require('@aws-cdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("@aws-cdk/core");
  // something after

  console.log('Look! I did something!');`, { fileName: 'subject.ts' });

    expect(output).toBe(`
  // something before
  import s3 = require('monocdk-experiment/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("monocdk-experiment");
  // something after

  console.log('Look! I did something!');`);
  });

  test('can pass packages names', () => {
    const output = rewriteImports(`
  // something before
  import s3 = require('@aws-cdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("@aws-cdk/core");
  import '@aws-cdk/assert/jest';
  require('@aws-cdk/assert/jest');
  // something after

  console.log('Look! I did something!');`, { fileName: 'subject.ts', monoPackageName: '@org/monocdk', monoAssertPackageName: '@org/monocdk-assert' });

    expect(output).toBe(`
  // something before
  import s3 = require('@org/monocdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("@org/monocdk");
  import '@org/monocdk-assert/jest';
  require('@org/monocdk-assert/jest');
  // something after

  console.log('Look! I did something!');`);
  });
});