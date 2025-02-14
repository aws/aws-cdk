import * as version from '../version';

export { isCI } from '../../toolkit/cli-io-host';

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
 * Returns the current version of the CLI
 * @returns the current version of the CLI
 */
export function cliVersion(): string {
  return version.displayVersion();
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

