import * as version from '../../lib/version';

/**
 * yargs middleware to negate an option if a negative alias is provided
 * E.g. `-R` will imply `--rollback=false`
 *
 * @param optionToNegate The name of the option to negate, e.g. `rollback`
 * @param negativeAlias The alias that should negate the option, e.g. `R`
 * @returns a middleware function that can be passed to yargs
 */
export function yargsNegativeAlias<T extends { [x in S | L]: boolean | undefined }, S extends string, L extends string>(
  negativeAlias: S,
  optionToNegate: L,
): (argv: T) => T {
  return (argv: T) => {
    // if R in argv && argv[R]
    // then argv[rollback] = false
    if (negativeAlias in argv && argv[negativeAlias]) {
      (argv as any)[optionToNegate] = false;
    }
    return argv;
  };
}

/**
 * Returns true if the current process is running in a CI environment
 * @returns true if the current process is running in a CI environment
 */
export function isCI(): boolean {
  return process.env.CI !== undefined;
}

/**
 * Returns the current version of the CLI
 * @returns the current version of the CLI
 */
export function cliVersion(): string {
  return version.DISPLAY_VERSION;
}

/**
 * Returns the default browser command for the current platform
 * @returns the default browser command for the current platform
 */
export function browserForPlatform(): string {
  switch (process.platform) {
    case 'darwin':
      return 'open %u';
    case 'win32':
      return 'start %u';
    default:
      return 'xdg-open %u';
  }
}

