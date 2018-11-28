import colors = require('colors/safe');
import table = require('table');
import yargs = require('yargs');
import { print } from '../../lib/logging';
import { CommandOptions } from '../command-api';
import { DEFAULTS } from '../settings';

export const command = 'context';
export const describe = 'Manage cached context values';
export const builder = {
  reset: {
    alias: 'e',
    desc: 'The context key (or its index) to reset',
    type: 'string',
    requiresArg: 'KEY'
  },
  clear: {
    desc: 'Clear all context',
    type: 'boolean',
  },
};

export function handler(args: yargs.Arguments) {
  args.commandHandler = realHandler;
}

export async function realHandler(options: CommandOptions): Promise<number> {
  const { configuration, args } = options;

  const context = configuration.projectConfig.get(['context']) || {};

  if (args.clear) {
    configuration.projectConfig.set(['context'], {});
    await configuration.saveProjectConfig();
    print('All context values cleared.');
  } else if (args.reset) {
    invalidateContext(context, args.reset);
    configuration.projectConfig.set(['context'], context);
    await configuration.saveProjectConfig();
  } else {
    // List -- support '--json' flag
    if (args.json) {
      process.stdout.write(JSON.stringify(context, undefined, 2));
    } else {
      listContext(context);
    }
  }

  return 0;
}

function listContext(context: any) {
  const keys = contextKeys(context);

  // Print config by default
  const data: any[] = [[colors.green('#'), colors.green('Key'), colors.green('Value')]];
  for (const [i, key] of keys) {
    const jsonWithoutNewlines = JSON.stringify(context[key], undefined, 2).replace(/\s+/g, ' ');
    data.push([i, key, jsonWithoutNewlines]);
  }

  print(`Context found in ${colors.blue(DEFAULTS)}:\n`);

  print(table.table(data, {
      border: table.getBorderCharacters('norc'),
      columns: {
        1: { width: 50, wrapWord: true } as any,
        2: { width: 50, wrapWord: true } as any
      }
  }));

  // tslint:disable-next-line:max-line-length
  print(`Run ${colors.blue('cdk context --reset KEY_OR_NUMBER')} to remove a context key. It will be refreshed on the next CDK synthesis run.`);
}

function invalidateContext(context: any, key: string) {
  const i = parseInt(key, 10);
  if (`${i}` === key) {
    // Twas a number and we fully parsed it.
    key = keyByNumber(context, i);
  }

  // Unset!
  if (key in context) {
    delete context[key];
    print(`Context value ${colors.blue(key)} reset. It will be refreshed on the next SDK synthesis run.`);
  } else {
    print(`No context value with key ${colors.blue(key)}`);
  }
}

function keyByNumber(context: any, n: number) {
  for (const [i, key] of contextKeys(context)) {
    if (n === i) {
      return key;
    }
  }
  throw new Error(`No context key with number: ${n}`);
}

/**
 * Return enumerated keys in a definitive order
 */
function contextKeys(context: any) {
  const keys = Object.keys(context);
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