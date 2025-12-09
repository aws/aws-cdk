// @ts-check

export function makeConstructLibRules() {
  /** @type { import("@eslint/core").RulesConfig } */
  const ret = {
    '@cdklabs/no-throw-default-error': ['error'],
  };
  return ret;
}

