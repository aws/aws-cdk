/**
 * yargs middleware to negate an option if a negative alias is provided
 * E.g. `-R` will imply `--rollback=false`
 *
 * @param optionToNegate The name of the option to negate, e.g. `rollback`
 * @param negativeAlias The alias that should negate the option, e.g. `R`
 * @returns
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
