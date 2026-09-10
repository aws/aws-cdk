import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { GraduationContext } from '../lib/context';
import { GraduationReport } from '../lib/report';
import { copySources, copyTests, deprecateAlphaPackage, deprecateAlphaReadme, graduateReadme, mergeAwslint, mergeBarrel, rewriteImports, rewriteIntegImports, rewriteTestAssetPaths } from '../lib/transforms';

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

describe('deprecateAlphaReadme', () => {
  test('swaps the experimental banner for the deprecated one and points the first paragraph at the stable module', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const alphaReadme = write(path.join(ctx.alphaDir, 'README.md'), [
        '# Foo Construct Library',
        '<!--BEGIN STABILITY BANNER-->',
        '',
        '---',
        '',
        '![cdk-constructs: Experimental](https://example/badge.svg)',
        '',
        '> The APIs of higher level constructs in this module are experimental.',
        '',
        '---',
        '',
        '<!--END STABILITY BANNER-->',
        '',
        'This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.',
        '',
        '## README',
        '',
      ].join('\n'));

      deprecateAlphaReadme(ctx, report);

      const out = fs.readFileSync(alphaReadme, 'utf-8');
      expect(out).toContain('![Deprecated](https://img.shields.io/badge/deprecated-critical.svg?style=for-the-badge)');
      expect(out).toContain('> This API may emit warnings. Backward compatibility is not guaranteed.');
      expect(out).not.toContain('experimental');
      // First paragraph now points at the stable module.
      expect(out).toContain('All constructs moved to aws-cdk-lib/aws-foo.');
      expect(out).not.toContain('This module is part of the [AWS Cloud Development Kit]');
      // The rest of the README (the title, later sections) is preserved.
      expect(out).toContain('# Foo Construct Library');
      expect(out).toContain('## README');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('flags a missing banner as a manual item', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'README.md'), '# Foo Construct Library\n\nNo banner here.\n');
      deprecateAlphaReadme(ctx, report);
      expect(report.hasManualItems).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('mergeBarrel', () => {
  test('appends new alpha exports, dedupes existing ones, and preserves the submodule barrel', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'lib', 'index.ts'), [
        "export * from './foo';",
        "export * from './bar';",
        '',
      ].join('\n'));
      // The submodule barrel already re-exports the generated L1 and one L2.
      write(path.join(ctx.submoduleLibDir, 'index.ts'), [
        "export * from './glue.generated';",
        "export * from './foo';",
        '',
      ].join('\n'));

      mergeBarrel(ctx, report);

      const out = fs.readFileSync(path.join(ctx.submoduleLibDir, 'index.ts'), 'utf-8');
      // New export appended.
      expect(out).toContain("export * from './bar';");
      // Duplicate not appended twice.
      expect(out.match(/export \* from '\.\/foo';/g)).toHaveLength(1);
      // Pre-existing lines preserved.
      expect(out).toContain("export * from './glue.generated';");
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('copySources', () => {
  test('copies L2 sources into the submodule lib and leaves the alpha copy in place', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const alphaSrc = write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), 'export class Foo {}\n');
      // Generated L1s and the barrel are excluded from the copy.
      write(path.join(ctx.alphaDir, 'lib', 'foo.generated.ts'), 'export class CfnFoo {}\n');
      write(path.join(ctx.alphaDir, 'lib', 'index.ts'), "export * from './foo';\n");

      const copied = copySources(ctx, report);

      expect(copied).toEqual([path.join(ctx.submoduleLibDir, 'foo.ts')]);
      expect(fs.existsSync(path.join(ctx.submoduleLibDir, 'foo.ts'))).toBe(true);
      expect(fs.existsSync(path.join(ctx.submoduleLibDir, 'foo.generated.ts'))).toBe(false);
      expect(fs.existsSync(path.join(ctx.submoduleLibDir, 'index.ts'))).toBe(false);
      // Copy-only: the alpha source is untouched.
      expect(fs.existsSync(alphaSrc)).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('hard-aborts rather than overwrite an existing stable-submodule source file', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), 'export class Foo {}\n');
      // A same-named file already lives in the stable submodule.
      write(path.join(ctx.submoduleLibDir, 'foo.ts'), 'export class Existing {}\n');

      expect(() => copySources(ctx, report)).toThrow(/collision/);
      // The existing file must not have been clobbered.
      expect(fs.readFileSync(path.join(ctx.submoduleLibDir, 'foo.ts'), 'utf-8')).toContain('Existing');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('copyTests', () => {
  test('routes integ tests + snapshots to framework-integ and unit tests + fixtures to the submodule', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const alphaTest = path.join(ctx.alphaDir, 'test');
      // Integ test source + its snapshot dir → framework-integ.
      const integSrc = write(path.join(alphaTest, 'integ.foo.ts'), "import * as foo from '../lib';\n");
      write(path.join(alphaTest, 'integ.foo.js.snapshot', 'manifest.json'), '{}\n');
      // Unit test + a fixture dir → submodule test/.
      const unitSrc = write(path.join(alphaTest, 'foo.test.ts'), "import { Foo } from '../lib';\nconst x = 1;\n");
      write(path.join(alphaTest, 'job-script', 'hello.py'), 'print("hi")\n');
      // Compiled artifacts are skipped.
      write(path.join(alphaTest, 'foo.test.js'), '"use strict";\n');

      copyTests(ctx, report);

      // Integ source landed in framework-integ with its ../lib import retargeted.
      const integDest = path.join(ctx.frameworkIntegTestDir, 'integ.foo.ts');
      expect(fs.existsSync(integDest)).toBe(true);
      expect(fs.readFileSync(integDest, 'utf-8')).toContain("from 'aws-cdk-lib/aws-foo'");
      // Snapshot dir copied recursively.
      expect(fs.existsSync(path.join(ctx.frameworkIntegTestDir, 'integ.foo.js.snapshot', 'manifest.json'))).toBe(true);
      // Unit test + fixture landed in the submodule test dir.
      expect(fs.existsSync(path.join(ctx.submoduleDir, 'test', 'foo.test.ts'))).toBe(true);
      expect(fs.existsSync(path.join(ctx.submoduleDir, 'test', 'job-script', 'hello.py'))).toBe(true);
      // Compiled artifact was not copied.
      expect(fs.existsSync(path.join(ctx.submoduleDir, 'test', 'foo.test.js'))).toBe(false);
      // Copy-only: alpha test tree remains.
      expect(fs.existsSync(integSrc)).toBe(true);
      expect(fs.existsSync(unitSrc)).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('deprecateAlphaPackage', () => {
  test('sets stability/maturity to deprecated and rewrites the description', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const pkgFile = write(path.join(ctx.alphaDir, 'package.json'), JSON.stringify({
        name: '@aws-cdk/aws-foo-alpha',
        description: 'The CDK Construct Library for AWS::Foo',
        stability: 'experimental',
        maturity: 'experimental',
      }, null, 2) + '\n');

      deprecateAlphaPackage(ctx, report);

      const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
      expect(pkg.stability).toBe('deprecated');
      expect(pkg.maturity).toBe('deprecated');
      expect(pkg.description).toBe('This module is deprecated. All constructs are now available under aws-cdk-lib/aws-foo');
      // Unrelated fields are preserved.
      expect(pkg.name).toBe('@aws-cdk/aws-foo-alpha');
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

  test('retargets custom-resource handler dist imports off the -alpha path', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      const file = write(path.join(ctx.submoduleLibDir, 'provider.ts'),
        "import { handler } from '../custom-resource-handlers/dist/aws-foo-alpha/index';\n");

      rewriteImports(ctx, [file], report);

      const out = fs.readFileSync(file, 'utf-8');
      // The alpha dist path must be gone, retargeted at the non-alpha location.
      expect(out).not.toContain('aws-foo-alpha');
      expect(out).toContain('custom-resource-handlers/dist/aws-foo/index');
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
