import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { GraduationContext } from '../lib/context';
import { GraduationReport } from '../lib/report';
import { graduateReadme, mergeAwslint, rewriteImports, rewriteIntegImports, rewriteTestAssetPaths } from '../lib/transforms';

/** Build a GraduationContext rooted at a throwaway temp dir for the `aws-foo` service. */
function makeCtx(): { ctx: GraduationContext; report: GraduationReport; repoRoot: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
  const ctx = new GraduationContext(
    { service: 'aws-foo', cleanup: false, strict: false, dryRun: false },
    repoRoot,
  );
  return { ctx, report: new GraduationReport('aws-foo'), repoRoot };
}

function write(file: string, contents: string): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  return file;
}

// The transforms emit progress via console; keep test output clean.
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe('mergeAwslint', () => {
  test('rewrites the alpha prefix, keeps cross-module entries, and dedupes', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'awslint.json'), JSON.stringify({
        exclude: [
          'construct-ctor-props-type:@aws-cdk/aws-foo-alpha.Table',
          'props-physical-name:aws-cdk-lib.aws_ec2.PrivateSubnetProps', // cross-module, carried over
        ],
      }));
      write(path.join(ctx.libDir, 'awslint.json'), JSON.stringify({
        exclude: [
          'existing-rule:aws-cdk-lib.aws_s3.Bucket',
          'props-physical-name:aws-cdk-lib.aws_ec2.PrivateSubnetProps', // already present -> dedupe
        ],
      }));

      mergeAwslint(ctx, report);

      const merged = JSON.parse(fs.readFileSync(path.join(ctx.libDir, 'awslint.json'), 'utf-8')).exclude as string[];
      expect(merged).toContain('construct-ctor-props-type:aws-cdk-lib.aws_foo.Table');
      expect(merged).toContain('existing-rule:aws-cdk-lib.aws_s3.Bucket');
      // Cross-module entry present exactly once (dedup worked).
      expect(merged.filter((e) => e === 'props-physical-name:aws-cdk-lib.aws_ec2.PrivateSubnetProps')).toHaveLength(1);
      // The alpha prefix must not survive.
      expect(merged.some((e) => e.includes('@aws-cdk/aws-foo-alpha'))).toBe(false);

      // The alpha file is left untouched (copy-only).
      const alpha = JSON.parse(fs.readFileSync(path.join(ctx.alphaDir, 'awslint.json'), 'utf-8')).exclude as string[];
      expect(alpha).toContain('construct-ctor-props-type:@aws-cdk/aws-foo-alpha.Table');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('graduateReadme', () => {
  test('strips the stability banner and retargets alpha imports, leaving the alpha copy intact', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const alphaReadme = write(path.join(ctx.alphaDir, 'README.md'), [
        '# Foo Construct Library',
        '<!--BEGIN STABILITY BANNER-->',
        '',
        '![cdk-constructs: Experimental](https://example/badge.svg)',
        '',
        '<!--END STABILITY BANNER-->',
        '',
        "import * as foo from '@aws-cdk/aws-foo-alpha';",
        '',
      ].join('\n'));
      fs.mkdirSync(ctx.submoduleDir, { recursive: true });

      graduateReadme(ctx, report);

      const out = fs.readFileSync(path.join(ctx.submoduleDir, 'README.md'), 'utf-8');
      expect(out).not.toContain('STABILITY BANNER');
      expect(out).not.toContain('@aws-cdk/aws-foo-alpha');
      expect(out).toContain("import * as foo from 'aws-cdk-lib/aws-foo';");
      // Copy-only: alpha README still there.
      expect(fs.existsSync(alphaReadme)).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('rewriteImports', () => {
  test('rewrites aws-cdk-lib package imports to relative monorepo imports', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const file = write(path.join(ctx.submoduleLibDir, 'foo.ts'), [
        "import { Stack } from 'aws-cdk-lib';",
        "import * as ec2 from 'aws-cdk-lib/aws-ec2';",
        "import { CfnFoo } from 'aws-cdk-lib/aws-foo';",
        'export class Foo {}',
      ].join('\n'));

      rewriteImports(ctx, [file], report);

      const out = fs.readFileSync(file, 'utf-8');
      expect(out).toContain("from '../../core'");
      expect(out).toContain("from '../../aws-ec2'");
      expect(out).toContain("from './foo.generated'");
      expect(out).not.toContain("from 'aws-cdk-lib");
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('flags a dependency on another alpha package as a manual item', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const file = write(path.join(ctx.submoduleLibDir, 'bar.ts'),
        "import { Thing } from '@aws-cdk/aws-other-alpha';\n");
      rewriteImports(ctx, [file], report);
      expect(report.hasManualItems).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('rewriteTestAssetPaths', () => {
  test('rewrites cwd-relative asset paths to __dirname-relative and adds the path import', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const file = write(path.join(ctx.submoduleDir, 'test', 'foo.test.ts'), [
        "import { Code } from '../lib';",
        "const c = Code.fromAsset('test/job-script/hello.py');",
        '',
      ].join('\n'));

      rewriteTestAssetPaths(ctx, [file], report);

      const out = fs.readFileSync(file, 'utf-8');
      // Each path segment is a separate argument (satisfies @cdklabs/no-invalid-path).
      expect(out).toContain('path.join(__dirname, "job-script", "hello.py")');
      expect(out).not.toContain("'test/job-script/hello.py'");
      expect(out).toMatch(/import \* as path from ['"]path['"]/);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('rewriteIntegImports', () => {
  test('retargets ../lib and the alpha package to the published subpath', () => {
    const { ctx, repoRoot } = makeCtx();
    try {
      const file = write(path.join(repoRoot, 'integ.foo.ts'), [
        "import * as foo from '../lib';",
        "import { Bar } from '@aws-cdk/aws-foo-alpha';",
        "import * as cdk from 'aws-cdk-lib';",
        "import * as integ from '@aws-cdk/integ-tests-alpha';",
        '',
      ].join('\n'));

      rewriteIntegImports(ctx, file);

      const out = fs.readFileSync(file, 'utf-8');
      expect(out).toContain("import * as foo from 'aws-cdk-lib/aws-foo';");
      expect(out).toContain("import { Bar } from 'aws-cdk-lib/aws-foo';");
      // Unrelated imports are left alone.
      expect(out).toContain("import * as cdk from 'aws-cdk-lib';");
      expect(out).toContain("import * as integ from '@aws-cdk/integ-tests-alpha';");
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('treats regex metacharacters in the service name literally (no regex injection)', () => {
    // A service name with a '.' must match literally, not as a regex wildcard.
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
    try {
      const ctx = new GraduationContext(
        { service: 'aws-fo.o', cleanup: false, strict: false, dryRun: false },
        repoRoot,
      );
      const file = write(path.join(repoRoot, 'integ.foo.ts'), [
        "import * as a from '@aws-cdk/aws-fo.o-alpha';", // exact match → rewrite
        "import * as b from '@aws-cdk/aws-foXo-alpha';", // would match if '.' were a wildcard → must NOT rewrite
        '',
      ].join('\n'));

      rewriteIntegImports(ctx, file);

      const out = fs.readFileSync(file, 'utf-8');
      expect(out).toContain("import * as a from 'aws-cdk-lib/aws-fo.o';");
      expect(out).toContain("import * as b from '@aws-cdk/aws-foXo-alpha';");
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
