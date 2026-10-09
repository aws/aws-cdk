import * as path from 'path';
import { GraduationContext, normalizeService } from '../lib/context';

describe('normalizeService', () => {
  test.each([
    ['glue', 'aws-glue'],
    ['aws-glue', 'aws-glue'],
    ['aws-glue-alpha', 'aws-glue'],
    ['@aws-cdk/aws-glue-alpha', 'aws-glue'],
    ['  aws-elasticache-alpha  ', 'aws-elasticache'],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizeService(input)).toBe(expected);
  });
});

describe('GraduationContext paths', () => {
  const repoRoot = path.join(path.sep, 'repo');
  const ctx = new GraduationContext(
    { service: 'aws-glue-alpha', cleanup: false, strict: false, dryRun: false },
    repoRoot,
  );

  test('normalizes the service and derived names', () => {
    expect(ctx.service).toBe('aws-glue');
    expect(ctx.serviceUnderscore).toBe('aws_glue');
    expect(ctx.cfnBasename).toBe('glue');
    expect(ctx.alphaPackageName).toBe('@aws-cdk/aws-glue-alpha');
  });

  test('derives all target paths from the repo root', () => {
    expect(ctx.alphaDir).toBe(path.join(repoRoot, 'packages', '@aws-cdk', 'aws-glue-alpha'));
    expect(ctx.libDir).toBe(path.join(repoRoot, 'packages', 'aws-cdk-lib'));
    expect(ctx.submoduleDir).toBe(path.join(repoRoot, 'packages', 'aws-cdk-lib', 'aws-glue'));
    expect(ctx.submoduleLibDir).toBe(path.join(ctx.submoduleDir, 'lib'));
    expect(ctx.frameworkIntegDir).toBe(path.join(repoRoot, 'packages', '@aws-cdk-testing', 'framework-integ'));
    expect(ctx.frameworkIntegTestDir).toBe(path.join(ctx.frameworkIntegDir, 'test', 'aws-glue', 'test'));
    expect(ctx.rosettaDir).toBe(path.join(ctx.libDir, 'rosetta', 'aws_glue'));
    expect(ctx.eslintBin).toBe(path.join(repoRoot, 'node_modules', '.bin', 'eslint'));
  });
});
