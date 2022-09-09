import * as child_process from 'child_process';
import * as chalk from 'chalk';
import { debug } from './logging';

/**
 * OS helpers
 *
 * Shell function which both prints to stdout and collects the output into a
 * string.
 */
export async function shell(command: string[]): Promise<string> {
  const renderedCommand = renderCommandLine(command);
  debug(`Executing ${chalk.blue(renderedCommand)}`);
  const child = child_process.spawn(renderedCommand[0], renderCommandLine(renderedCommand.slice(1)), {
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    // Both write to stdout and collect
    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.once('error', reject);

    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.from(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${renderedCommand} exited with error code ${code}`));
      }
    });
  });
}

/**
 * Render the command line to include escape characters for each platform.
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
function doRender(cmd: string[], needsEscaping: (x: string) => boolean, doEscape: (x: string) => string): string[] {
  return cmd.map(x => needsEscaping(x) ? doEscape(x) : x);
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
  x = x.replace(/'/g, "'\"'\"'");
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