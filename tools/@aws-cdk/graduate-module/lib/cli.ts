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

function parseArgs(argv: string[]): GraduationOptions | null {
  const positional: string[] = [];
  const flags = new Set<string>();

  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      return null;
    }
    if (arg.startsWith('--')) {
      flags.add(arg.slice(2));
    } else {
      positional.push(arg);
    }
  }

  if (positional.length !== 1) {
    return null;
  }

  const known = new Set(['cleanup', 'strict', 'dry-run']);
  for (const flag of flags) {
    if (!known.has(flag)) {
      console.error(`unknown option: --${flag}\n`);
      return null;
    }
  }

  return {
    service: positional[0],
    cleanup: flags.has('cleanup'),
    strict: flags.has('strict'),
    dryRun: flags.has('dry-run'),
  };
}

const options = parseArgs(process.argv.slice(2));
if (!options) {
  console.log(USAGE);
  process.exit(process.argv.includes('-h') || process.argv.includes('--help') ? 0 : 64);
}

try {
  process.exit(run(options));
} catch (err) {
  console.error(`\n\x1b[31mgraduation failed:\x1b[0m ${(err as Error).message}`);
  process.exit(1);
}
