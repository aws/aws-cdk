import * as child_process from 'child_process';
import * as colors from 'colors/safe';
import { debug } from './logging';

export interface ShellOptions extends child_process.SpawnOptions {
  quiet?: boolean;
}

/**
 * OS helpers
 *
 * Shell function which both prints to stdout and collects the output into a
 * string.
 */
export async function shell(command: string[], options: ShellOptions = {}): Promise<string> {
  debug(`Executing ${colors.blue(renderCommandLine(command))}`);
  const child = child_process.spawn(command[0], command.slice(1), {
    ...options,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    // Both write to stdout and collect
    child.stdout.on('data', chunk => {
      if (!options.quiet) {
        process.stdout.write(chunk);
      }
      stdout.push(chunk);
    });

    child.once('error', reject);

    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${renderCommandLine(command)} exited with error code ${code}`));
      }
    });
  });
}

/**
 * Render the given command line as a string
 *
 * Probably missing some cases but giving it a good effort.
 */
function renderCommandLine(cmd: string[]) {
  if (process.platform !== 'win32') {
    return doRender(cmd, hasAnyChars(' ', '\\', '!', '"', "'", '&', '$'), posixEscape);
  } else {
    return doRender(cmd, hasAnyChars(' ', '"', '&', '^', '%'), windowsEscape);
  }
}

/**
 * Render a UNIX command line
 */
function doRender(cmd: string[], needsEscaping: (x: string) => boolean, doEscape: (x: string) => string): string {
  return cmd.map(x => needsEscaping(x) ? doEscape(x) : x).join(' ');
}

/**
 * Return a predicate that checks if a string has any of the indicated chars in it
 */
function hasAnyChars(...chars: string[]): (x: string) => boolean {
  return (str: string) => {
    return chars.some(c => str.indexOf(c) !== -1);
  };
}

/**
 * Escape a shell argument for POSIX shells
 *
 * Wrapping in single quotes and escaping single quotes inside will do it for us.
 */
function posixEscape(x: string) {
  // Turn ' -> '"'"'
  x = x.replace("'", "'\"'\"'");
  return `'${x}'`;
}

/**
 * Escape a shell argument for cmd.exe
 *
 * This is how to do it right, but I'm not following everything:
 *
 * https://blogs.msdn.microsoft.com/twistylittlepassagesallalike/2011/04/23/everyone-quotes-command-line-arguments-the-wrong-way/
 */
function windowsEscape(x: string): string {
  // First surround by double quotes, ignore the part about backslashes
  x = `"${x}"`;
  // Now escape all special characters
  const shellMeta = new Set<string>(['"', '&', '^', '%']);
  return x.split('').map(c => shellMeta.has(x) ? '^' + c : c).join('');
}
