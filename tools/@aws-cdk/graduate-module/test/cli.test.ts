import { parseArgs } from '../lib/cli';

describe('parseArgs', () => {
  test('parses a service argument and flags into run options', () => {
    const result = parseArgs(['aws-glue', '--cleanup', '--dry-run']);
    expect(result).toEqual({
      kind: 'run',
      options: { service: 'aws-glue', cleanup: true, strict: false, dryRun: true },
    });
  });

  test('-h and --help request the help path', () => {
    expect(parseArgs(['-h'])).toEqual({ kind: 'help' });
    expect(parseArgs(['--help'])).toEqual({ kind: 'help' });
    // Help wins even alongside other arguments.
    expect(parseArgs(['aws-glue', '--help'])).toEqual({ kind: 'help' });
  });

  test('rejects an unknown flag with a usage error carrying the offending flag', () => {
    expect(parseArgs(['aws-glue', '--foo'])).toEqual({
      kind: 'error',
      message: 'unknown option: --foo',
    });
  });

  test('rejects a missing or extra positional argument', () => {
    // Zero positionals.
    expect(parseArgs(['--cleanup'])).toEqual({ kind: 'error' });
    // More than one positional.
    expect(parseArgs(['aws-glue', 'aws-s3'])).toEqual({ kind: 'error' });
  });
});
