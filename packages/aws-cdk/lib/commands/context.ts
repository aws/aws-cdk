import colors = require('colors/safe');
import yargs = require('yargs');
import version = require('../../lib/version');
import { CommandOptions } from '../command-api';
import { print } from '../logging';
import { Context, PROJECT_CONFIG } from '../settings';
import { renderTable } from '../util';

export const command = 'context';
export const describe = 'Manage cached context values';
export const builder = {
  reset: {
    alias: 'e',
    desc: 'The context key (or its index) to reset',
    type: 'string',
    requiresArg: true
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

  const contextValues = configuration.context.all;

  if (args.clear) {
    configuration.context.clear();
    await configuration.saveContext();
    print('All context values cleared.');
  } else if (args.reset) {
    invalidateContext(configuration.context, args.reset as string);
    await configuration.saveContext();
  } else {
    // List -- support '--json' flag
    if (args.json) {
      process.stdout.write(JSON.stringify(contextValues, undefined, 2));
    } else {
      listContext(contextValues);
    }
  }
  await version.displayVersionMessage();

  return 0;
}

function listContext(context: any) {
  const keys = contextKeys(context);

  if (keys.length === 0) {
    print(`This CDK application does not have any saved context values yet.`);
    print('');
    print(`Context will automatically be saved when you synthesize CDK apps`);
    print(`that use environment context information like AZ information, VPCs,`);
    print(`SSM parameters, and so on.`);

    return;
  }

  // Print config by default
  const data: any[] = [[colors.green('#'), colors.green('Key'), colors.green('Value')]];
  for (const [i, key] of keys) {
    const jsonWithoutNewlines = JSON.stringify(context[key], undefined, 2).replace(/\s+/g, ' ');
    data.push([i, key, jsonWithoutNewlines]);
  }

  print(`Context found in ${colors.blue(PROJECT_CONFIG)}:\n`);

  print(renderTable(data, process.stdout.columns));

  // tslint:disable-next-line:max-line-length
  print(`Run ${colors.blue('cdk context --reset KEY_OR_NUMBER')} to remove a context key. It will be refreshed on the next CDK synthesis run.`);
}

function invalidateContext(context: Context, key: string) {
  const i = parseInt(key, 10);
  if (`${i}` === key) {
    // Twas a number and we fully parsed it.
    key = keyByNumber(context, i);
  }

  // Unset!
  if (context.has(key)) {
    context.unset(key);
    print(`Context value ${colors.blue(key)} reset. It will be refreshed on next synthesis`);
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
