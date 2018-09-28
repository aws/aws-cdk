import child_process = require("child_process");
import fs = require('fs');
import util = require('util');
import { Timers } from "./timer";

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export async function shell(command: string[], timers?: Timers): Promise<string> {
  const timer = (timers || new Timers()).start(command[0]);

  await makeShellScriptExecutable(command[0]);

  const child = child_process.spawn(command[0], command.slice(1), {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: [ 'ignore', 'pipe', 'inherit' ]
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.once('error', reject);

    child.once('exit', code => {
      timer.end();
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
  const shellMeta = ['"', '&', '^', '%'];
  return x.split('').map(c => shellMeta.indexOf(x) !== -1 ? '^' + c : c).join('');
}

/**
 * Make the script executable on the current platform
 *
 * On UNIX, we'll use chmod to directly execute the file.
 *
 * On Windows, we'll do nothing and expect our other tooling
 * (npm/lerna) to generate appropriate .cmd files when linking.
 */
export async function makeExecutable(javascriptFile: string): Promise<void> {
  if (process.platform !== 'win32') {
    await util.promisify(fs.chmod)(javascriptFile, 0o755);
  }
}

/**
 * If the given file exists and looks like a shell script, make sure it's executable
 */
async function makeShellScriptExecutable(script: string) {
  try {
    if (await canExecute(script)) { return; }
    if (!await isShellScript(script)) { return; }
    await util.promisify(fs.chmod)(script, 0o755);
  } catch (e) {
    // If it happens that this file doesn't exist, that's fine. It's
    // probably a file that can be found on the $PATH.
    if (e.code === 'ENOENT') { return; }
    throw e;
  }
}

async function canExecute(fileName: string): Promise<boolean> {
  try {
    await util.promisify(fs.access)(fileName, fs.constants.X_OK);
    return true;
  } catch (e) {
    if (e.code === 'EACCES') { return false; }
    throw e;
  }
}

async function isShellScript(script: string): Promise<boolean> {
  const f = await util.promisify(fs.open)(script, 'r');
  const buffer = Buffer.alloc(2);
  await util.promisify(fs.read)(f, buffer, 0, 2, null);

  return buffer.equals(Buffer.from('#!'));
}
