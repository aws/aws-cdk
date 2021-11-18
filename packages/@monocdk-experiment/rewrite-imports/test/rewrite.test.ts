import { rewriteImports, rewriteReadmeImports } from '../lib/rewrite';

describe(rewriteImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');

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

    console.log('Look! I did something!');`, 'subhect.ts');

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

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import * as s3 from 'monocdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "monocdk";
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

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import s3 = require('monocdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("monocdk");
  // something after

  console.log('Look! I did something!');`);
  });
});

describe(rewriteReadmeImports, () => {
  test('parses ts code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`ts
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'monocdk/aws-s3';
    import { Construct } from "monocdk";
    \`\`\`
    Some more README text.`);
  });

  test('parses typescript code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`typescript
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`typescript
    import * as s3 from 'monocdk/aws-s3';
    import { Construct } from "monocdk";
    \`\`\`
    Some more README text.`);
  });

  test('parses text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`text
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`text
    import * as s3 from 'monocdk/aws-s3';
    import { Construct } from "monocdk";
    \`\`\`
    Some more README text.`);
  });

  test('ignores non ts|typescript|text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`java
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.`, 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`java
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.`);
  });

  test('parses multiple snippets', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`ts
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.
    \`\`\`ts
    import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
    \`\`\``, 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'monocdk/aws-s3';
    \`\`\`
    Some more README text.
    \`\`\`ts
    import { CfnDeliveryStream } from 'monocdk/aws-kinesisfirehose';
    \`\`\``);
  });
});
