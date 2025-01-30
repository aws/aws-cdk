import * as chalk from 'chalk';
import { minimatch } from 'minimatch';
import { Context } from '../api/context';
import { PROJECT_CONFIG, PROJECT_CONTEXT, USER_DEFAULTS } from '../cli/user-configuration';
import * as version from '../cli/version';
import { error, warning, info, result } from '../logging';
import { ToolkitError } from '../toolkit/error';
import { renderTable } from '../util';

/**
 * Options for the context command
 */
export interface ContextOptions {
  /**
   * The context object sourced from all context locations
   */
  context: Context;

  /**
   * The context key (or its index) to reset
   *
   * @default undefined
   */
  reset?: string;

  /**
   * Ignore missing key error
   *
   * @default false
   */
  force?: boolean;

  /**
   * Clear all context
   *
   * @default false
   */
  clear?: boolean;

  /**
   * Use JSON output instead of YAML when templates are printed to STDOUT
   *
   * @default false
   */
  json?: boolean;
}

export async function contextHandler(options: ContextOptions): Promise<number> {
  if (options.clear) {
    options.context.clear();
    await options.context.save(PROJECT_CONTEXT);
    info('All context values cleared.');
  } else if (options.reset) {
    invalidateContext(options.context, options.reset, options.force ?? false);
    await options.context.save(PROJECT_CONTEXT);
  } else {
    // List -- support '--json' flag
    if (options.json) {
      /* istanbul ignore next */
      const contextValues = options.context.all;
      result(JSON.stringify(contextValues, undefined, 2));
    } else {
      listContext(options.context);
    }
  }
  await version.displayVersionMessage();

  return 0;
}

function listContext(context: Context) {
  const keys = contextKeys(context);

  if (keys.length === 0) {
    info('This CDK application does not have any saved context values yet.');
    info('');
    info('Context will automatically be saved when you synthesize CDK apps');
    info('that use environment context information like AZ information, VPCs,');
    info('SSM parameters, and so on.');

    return;
  }

  // Print config by default
  const data_out: any[] = [[chalk.green('#'), chalk.green('Key'), chalk.green('Value')]];
  for (const [i, key] of keys) {
    const jsonWithoutNewlines = JSON.stringify(context.all[key], undefined, 2).replace(/\s+/g, ' ');
    data_out.push([i, key, jsonWithoutNewlines]);
  }
  info('Context found in %s:', chalk.blue(PROJECT_CONFIG));
  info('');
  info(renderTable(data_out, process.stdout.columns));

  // eslint-disable-next-line max-len
  info(`Run ${chalk.blue('cdk context --reset KEY_OR_NUMBER')} to remove a context key. It will be refreshed on the next CDK synthesis run.`);
}

function invalidateContext(context: Context, key: string, force: boolean) {
  const i = parseInt(key, 10);
  if (`${i}` === key) {
    // was a number and we fully parsed it.
    key = keyByNumber(context, i);
  }
  // Unset!
  if (context.has(key)) {
    context.unset(key);
    // check if the value was actually unset.
    if (!context.has(key)) {
      info('Context value %s reset. It will be refreshed on next synthesis', chalk.blue(key));
      return;
    }

    // Value must be in readonly bag
    error('Only context values specified in %s can be reset through the CLI', chalk.blue(PROJECT_CONTEXT));
    if (!force) {
      throw new ToolkitError(`Cannot reset readonly context value with key: ${key}`);
    }
  }

  // check if value is expression matching keys
  const matches = keysByExpression(context, key);

  if (matches.length > 0) {

    matches.forEach((match) => {
      context.unset(match);
    });

    const { unset, readonly } = getUnsetAndReadonly(context, matches);

    // output the reset values
    printUnset(unset);

    // warn about values not reset
    printReadonly(readonly);

    // throw when none of the matches were reset
    if (!force && unset.length === 0) {
      throw new ToolkitError('None of the matched context values could be reset');
    }
    return;
  }
  if (!force) {
    throw new ToolkitError(`No context value matching key: ${key}`);
  }
}

function printUnset(unset: string[]) {
  if (unset.length === 0) return;
  info('The following matched context values reset. They will be refreshed on next synthesis');
  unset.forEach((match) => {
    info('  %s', match);
  });
}

function printReadonly(readonly: string[]) {
  if (readonly.length === 0) return;
  warning('The following matched context values could not be reset through the CLI');
  readonly.forEach((match) => {
    info('  %s', match);
  });
  info('');
  info('This usually means they are configured in %s or %s', chalk.blue(PROJECT_CONFIG), chalk.blue(USER_DEFAULTS));
}

function keysByExpression(context: Context, expression: string) {
  return context.keys.filter(minimatch.filter(expression));
}

function getUnsetAndReadonly(context: Context, matches: string[]) {
  return matches.reduce<{ unset: string[]; readonly: string[] }>((acc, match) => {
    if (context.has(match)) {
      acc.readonly.push(match);
    } else {
      acc.unset.push(match);
    }
    return acc;
  }, { unset: [], readonly: [] });
}

function keyByNumber(context: Context, n: number) {
  for (const [i, key] of contextKeys(context)) {
    if (n === i) {
      return key;
    }
  }
  throw new ToolkitError(`No context key with number: ${n}`);
}

/**
 * Return enumerated keys in a definitive order
 */
function contextKeys(context: Context): [number, string][] {
  const keys = context.keys;
  keys.sort();
  return enumerate1(keys);
}

function enumerate1<T>(xs: T[]): Array<[number, T]> {
  const ret = new Array<[number, T]>();
  let i = 1;
  for (const x of xs) {
    ret.push([i, x]);
    i += 1;
  }
  return ret;
}
