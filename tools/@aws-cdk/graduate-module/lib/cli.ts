import type { GraduationOptions } from './context';
import { run } from './index';

const USAGE = `graduate-module — graduate an @aws-cdk/aws-<service>-alpha module into aws-cdk-lib

Usage:
  graduate-module <service> [options]

Arguments:
  <service>        Service module in any form: glue | aws-glue | aws-glue-alpha | @aws-cdk/aws-glue-alpha

Options:
  --cleanup        Delete the alpha package (the follow-up PR after stabilization has shipped)
  --strict         Fail if any @deprecated APIs remain (default: warn)
  --dry-run        Read-only analysis; write the report without modifying files
  -h, --help       Show this help

Examples:
  graduate-module aws-glue --dry-run
  graduate-module aws-glue
  graduate-module aws-glue --cleanup
`;

/** Outcome of parsing argv: run with options, print help, or reject with a usage error. */
export type ParseResult =
  | { readonly kind: 'run'; readonly options: GraduationOptions }
  | { readonly kind: 'help' }
  | { readonly kind: 'error'; readonly message?: string };

/**
 * Pure argv parser — no I/O, no `process.exit` — so it can be unit-tested in
 * isolation. `main` turns the result into console output and an exit code.
 */
export function parseArgs(argv: string[]): ParseResult {
  const positional: string[] = [];
  const flags = new Set<string>();

  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      return { kind: 'help' };
    }
    if (arg.startsWith('--')) {
      flags.add(arg.slice(2));
    } else {
      positional.push(arg);
    }
  }

  if (positional.length !== 1) {
    return { kind: 'error' };
  }

  const known = new Set(['cleanup', 'strict', 'dry-run']);
  for (const flag of flags) {
    if (!known.has(flag)) {
      return { kind: 'error', message: `unknown option: --${flag}` };
    }
  }

  return {
    kind: 'run',
    options: {
      service: positional[0],
      cleanup: flags.has('cleanup'),
      strict: flags.has('strict'),
      dryRun: flags.has('dry-run'),
    },
  };
}

/** Parse argv, run the tool, and return the process exit code. */
export function main(argv: string[]): number {
  const parsed = parseArgs(argv);
  if (parsed.kind === 'help') {
    console.log(USAGE);
    return 0;
  }
  if (parsed.kind === 'error') {
    if (parsed.message) {
      console.error(`${parsed.message}\n`);
    }
    console.log(USAGE);
    return 64;
  }

  try {
    return run(parsed.options);
  } catch (err) {
    console.error(`\n\x1b[31mgraduation failed:\x1b[0m ${(err as Error).message}`);
    return 1;
  }
}

// Only run when invoked as the CLI entry point, so tests can import the module
// without triggering a real run or `process.exit`.
if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
