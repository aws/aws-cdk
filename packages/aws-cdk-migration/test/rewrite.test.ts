import { rewriteMonoPackageImports, rewriteReadmeImports } from '../lib/rewrite';

describe(rewriteMonoPackageImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import '@aws-cdk/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import 'aws-cdk-lib/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites naked "require"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    require('@aws-cdk/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    require('aws-cdk-lib/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import from"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import * as s3 from '@aws-cdk/aws-s3';
    import * as cfndiff from '@aws-cdk/cloudformation-diff';
    import { Stack } from "@aws-cdk/core";
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import * as cfndiff from '@aws-cdk/cloudformation-diff';
    import { Stack } from "aws-cdk-lib";
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import = require"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import s3 = require('@aws-cdk/aws-s3');
    import cfndiff = require('@aws-cdk/cloudformation-diff');
    import { Stack } = require("@aws-cdk/core");
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import s3 = require('aws-cdk-lib/aws-s3');
    import cfndiff = require('@aws-cdk/cloudformation-diff');
    import { Stack } = require("aws-cdk-lib");
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports', () => {
    // Codestar example
    const codestar = rewriteMonoPackageImports(`
    // something before
    import * as codestar from './codestar.generated';
    import { CfnY } from '../codestar.generated';
    import { CfnX } from '../lib/codestar.generated';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-codestar',
    });

    expect(codestar).toBe(`
    // something before
    import * as codestar from 'aws-cdk-lib/aws-codestar';
    import { CfnY } from 'aws-cdk-lib/aws-codestar';
    import { CfnX } from 'aws-cdk-lib/aws-codestar';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports from an alpha module', () => {
    const customModules = {
      '@aws-cdk/aws-kinesisfirehose': 'aws-kinesisfirehose-alpha',
    };
    const output = rewriteMonoPackageImports(`
    // something before
    import * as firehose from '@aws-cdk/aws-kinesisfirehose';
    import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts', {
      rewriteCfnImports: true,
      customModules: customModules,
    });

    expect(output).toBe(`
    // something before
    import * as firehose from 'aws-kinesisfirehose-alpha';
    import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
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
    import { Stack } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Stack } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('parses typescript code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`typescript
    import * as s3 from '@aws-cdk/aws-s3';
    import { Stack } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`typescript
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Stack } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('parses text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`text
    import * as s3 from '@aws-cdk/aws-s3';
    import { Stack } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`text
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Stack } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('ignores non ts|typescript|text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`java
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

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
    \`\`\``, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'aws-cdk-lib/aws-s3';
    \`\`\`
    Some more README text.
    \`\`\`ts
    import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
    \`\`\``);
  });
});

describe('constructs imports', () => {
  describe('namespace imports', () => {
    test('import declaration', () => {
      const output = rewriteMonoPackageImports(`
      import * as core from '@aws-cdk/core';
      class FooBar extends core.Construct {
        private readonly foo: core.Construct;
        private doStuff() { return new core.Construct(); }
      }`, 'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

      expect(output).toBe(`
      import * as constructs from 'constructs';
      import * as core from 'aws-cdk-lib';
      class FooBar extends constructs.Construct {
        private readonly foo: constructs.Construct;
        private doStuff() { return new constructs.Construct(); }
      }`);
    });

    test('import equals declaration', () => {
      const output = rewriteMonoPackageImports(`
      import core = require('@aws-cdk/core');
      class FooBar extends core.Construct {
        private readonly foo: core.Construct;
        private doStuff() { return new core.Construct(); }
      }`, 'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

      expect(output).toBe(`
      import * as constructs from 'constructs';
      import core = require('aws-cdk-lib');
      class FooBar extends constructs.Construct {
        private readonly foo: constructs.Construct;
        private doStuff() { return new constructs.Construct(); }
      }`);
    });
  });

  describe('named imports', () => {
    test('no constructs imports', () => {
      const output = rewriteMonoPackageImports(`
      import { Stack, StackProps } from '@aws-cdk/core';
      class FooBar extends Stack { }`,
      'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

      expect(output).toBe(`
      import { Stack, StackProps } from 'aws-cdk-lib';
      class FooBar extends Stack { }`);
    });

    test('all constructs imports', () => {
      const output = rewriteMonoPackageImports(`
      import { IConstruct, Construct } from '@aws-cdk/core';
      class FooBar implements IConstruct extends Construct { }`,
      'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

      expect(output).toBe(`
      import { IConstruct, Construct } from 'constructs';
      class FooBar implements IConstruct extends Construct { }`);
    });

    test('mixed constructs and core imports', () => {
      const output = rewriteMonoPackageImports(`
      import { Stack, Construct, IConstruct, StackProps } from '@aws-cdk/core';
      class FooBar implements IConstruct extends Construct { }`,
      'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

      expect(output).toBe(`
      import { Construct, IConstruct } from 'constructs';
      import { Stack, StackProps } from 'aws-cdk-lib';
      class FooBar implements IConstruct extends Construct { }`);
    });
  });

  test('exhaustive test', () => {
    const output = rewriteMonoPackageImports(`
    import * as core1 from '@aws-cdk/core';
    // a comment of some kind
    import core2 = require('@aws-cdk/core');
    import { Stack } from '@aws-cdk/core';
    // more comments
    import { Construct as CoreConstruct } from '@aws-cdk/core';
    import { IConstruct, Stack, StackProps } from '@aws-cdk/core';
    import * as s3 from '@aws-cdk/aws-s3';

    class FooBar implements core1.IConstruct {
      readonly foo1: core2.Construct;
      public static bar1() { return CoreConstruct(); }
      public static bar2() { return new class implements IConstruct {}; }
    }`, 'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

    expect(output).toBe(`
    import * as constructs from 'constructs';
    import { IConstruct } from 'constructs';
    import * as core1 from 'aws-cdk-lib';
    // a comment of some kind
    import core2 = require('aws-cdk-lib');
    import { Stack } from 'aws-cdk-lib';
    // more comments
    import { Construct as CoreConstruct } from 'constructs';
    import { Stack, StackProps } from 'aws-cdk-lib';
    import * as s3 from 'aws-cdk-lib/aws-s3';

    class FooBar implements constructs.IConstruct {
      readonly foo1: constructs.Construct;
      public static bar1() { return CoreConstruct(); }
      public static bar2() { return new class implements IConstruct {}; }
    }`);
  });

  test('does not rewrite constructs imports unless the option is explicitly set', () => {
    const output = rewriteMonoPackageImports(`
    import * as core1 from '@aws-cdk/core';
    // a comment of some kind
    import { Stack } from '@aws-cdk/core';
    // more comments
    import { Construct as CoreConstruct } from '@aws-cdk/core';
    import { IConstruct, Stack, StackProps } from '@aws-cdk/core';
    import * as s3 from '@aws-cdk/aws-s3';

    class FooBar implements core1.IConstruct {
      readonly foo1: CoreConstruct;
      public static bar2() { return new class implements IConstruct {}; }
    }`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    import * as core1 from 'aws-cdk-lib';
    // a comment of some kind
    import { Stack } from 'aws-cdk-lib';
    // more comments
    import { Construct as CoreConstruct } from 'aws-cdk-lib';
    import { IConstruct, Stack, StackProps } from 'aws-cdk-lib';
    import * as s3 from 'aws-cdk-lib/aws-s3';

    class FooBar implements core1.IConstruct {
      readonly foo1: CoreConstruct;
      public static bar2() { return new class implements IConstruct {}; }
    }`);
  });

  test('puts constructs imports after shebang lines', () => {
    const output = rewriteMonoPackageImports(`
    #!/usr/bin/env node
    import * as core from '@aws-cdk/core';
    class FooBar extends core.Construct {
      private readonly foo: core.Construct;
      private doStuff() { return new core.Construct(); }
    }`, 'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

    expect(output).toBe(`
    #!/usr/bin/env node
    import * as constructs from 'constructs';
    import * as core from 'aws-cdk-lib';
    class FooBar extends constructs.Construct {
      private readonly foo: constructs.Construct;
      private doStuff() { return new constructs.Construct(); }
    }`);
  });

  test('supports rewriteReadmeImports', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`ts
    import * as s3 from '@aws-cdk/aws-s3';
    import * as core from "@aws-cdk/core";
    import { Construct, Stack } from "@aws-cdk/core";
    class Foo extends core.Construct {
      public bar() { return new Construct(); }
    }
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts', { rewriteConstructsImports: true });

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as constructs from 'constructs';
    import { Construct } from 'constructs';
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import * as core from "aws-cdk-lib";
    import { Stack } from "aws-cdk-lib";
    class Foo extends constructs.Construct {
      public bar() { return new Construct(); }
    }
    \`\`\`
    Some more README text.`);
  });
});
