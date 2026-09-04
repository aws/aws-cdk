import type { GraduationContext } from './context';
import type { GraduationReport } from './report';
import { exec, log } from './util';

interface Check {
  readonly name: string;
  readonly command: string;
  readonly args: string[];
  readonly cwd: string;
}

/**
 * Phase 3 — self-test. Runs the same commands a maintainer would to confirm the
 * graduated module is a bona-fide part of aws-cdk-lib. Each check runs even if a
 * previous one failed, so the report captures the full picture in one pass.
 */
export function selfTest(ctx: GraduationContext, report: GraduationReport): boolean {
  log.phase('Phase 3 — Self-test');

  if (ctx.options.dryRun) {
    log.warn('--dry-run set: skipping self-test build/test commands');
    return true;
  }

  const checks: Check[] = [
    { name: 'build aws-cdk-lib', command: 'npx', args: ['lerna', 'run', 'build', '--scope=aws-cdk-lib', '--stream'], cwd: ctx.repoRoot },
    { name: 'unit tests', command: 'yarn', args: ['test', ctx.service], cwd: ctx.libDir },
    { name: 'awslint', command: 'yarn', args: ['awslint'], cwd: ctx.libDir },
    { name: 'rosetta README', command: '/bin/bash', args: ['./scripts/run-rosetta.sh'], cwd: ctx.repoRoot },
    { name: 'build framework-integ', command: 'npx', args: ['lerna', 'run', 'build', '--scope=@aws-cdk-testing/framework-integ', '--stream'], cwd: ctx.repoRoot },
    { name: 'lint', command: 'npx', args: ['lerna', 'run', 'lint', '--scope=aws-cdk-lib'], cwd: ctx.repoRoot },
  ];

  let allPassed = true;
  for (const check of checks) {
    log.step(`running: ${check.name}`);
    const result = exec(check.command, check.args, { cwd: check.cwd, allowFailure: true, stream: true });
    if (result.status === 0) {
      log.ok(`${check.name} passed`);
    } else {
      allPassed = false;
      log.error(`${check.name} failed (exit ${result.status})`);
      report.manual('self-test', `\`${check.name}\` failed — fix before opening the PR`);
    }
  }
  return allPassed;
}
