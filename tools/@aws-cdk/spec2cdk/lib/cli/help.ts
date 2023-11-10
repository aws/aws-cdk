/* eslint-disable no-console */

export interface PositionalArg {
  name: string;
  description?: string;
  required?: boolean
}

export interface Option {
  type: 'string' | 'boolean',
  short?: string;
  default?: string | boolean;
  multiple?: boolean;
  description?: string;
}

const TAB = ' '.repeat(4);

export function showHelp(command: string, args: PositionalArg[] = [], options: {
  [longOption: string]: Option
} = {}, text?: string) {
  console.log('Usage:');
  console.log(`${TAB}${command} ${renderArgsList(args)} [--option=value]`);

  const leftColSize = 6 + longest([
    ...args.map(a => a.name),
    ...Object.entries(options).map(([name, def]) => renderOptionName(name, def.short)),
  ]);

  if (args.length) {
    console.log('\nArguments:');
    for (const arg of args) {
      console.log(`${TAB}${arg.name.toLocaleUpperCase().padEnd(leftColSize)}\t${arg.description}`);
    }
  }

  if (Object.keys(options).length) {
    console.log('\nOptions:');
    const ordered = Object.entries(options).sort(([a], [b]) => a.localeCompare(b));
    for (const [option, def] of ordered) {
      console.log(`${TAB}${renderOptionName(option, def.short).padEnd(leftColSize)}\t${renderOptionText(def)}`);
    }
  }
  console.log();

  if (text) {
    console.log(text + '\n');
  }
}

function renderArgsList(args: PositionalArg[] = []) {
  return args.map(arg => {
    const brackets = arg.required ? ['<', '>'] : ['[', ']'];
    return `${brackets[0]}${arg.name.toLocaleUpperCase()}${brackets[1]}`;
  }).join(' ');
}

function renderOptionName(option: string, short?: string): string {
  if (short) {
    return `-${short}, --${option}`;
  }

  return `${' '.repeat(4)}--${option}`;
}

function renderOptionText(def: Option): string {
  const out = new Array<string>;

  out.push(`[${def.multiple ? 'array' : def.type}]`);

  if (def.default) {
    out.push(` [default: ${def.default}]`);
  }
  if (def.description) {
    out.push(`\n${TAB.repeat(2)}  ${def.description}`);
  }

  return out.join('');
}

function longest(xs: string[]): number {
  return xs.sort((a, b) => b.length - a.length).at(0)?.length ?? 0;
}
