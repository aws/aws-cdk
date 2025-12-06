import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as chalk from 'chalk';
import { Timers } from './timer';

interface ShellOptions {
  timers?: Timers;
  env?: child_process.SpawnOptions['env'];
  traceName?: string;
}

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export async function shell(command: string[], options: ShellOptions = {}): Promise<string> {
  let [cmd, ...args] = command;

  const timeFile = '.time.tmp';

  // Try to trace memory usage with /usr/bin/time if we're tracing
  if (options.traceName && process.platform === 'darwin') {
    args.unshift('-l', '-o', timeFile, cmd);
    cmd = '/usr/bin/time';
  }
  if (options.traceName && process.platform === 'linux') {
    args.unshift('-v', '-o', timeFile, cmd);
    cmd = '/usr/bin/time';
  }

  const timer = (options.timers || new Timers()).start(cmd);

  const startTime = new Date();

  await makeShellScriptExecutable(cmd);

  // yarn exec runs the provided command with the correct environment for the workspace.
  const child = child_process.spawn(
    cmd,
    args,
    {
      // Need this for Windows where we want .cmd and .bat to be found as well.
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...options.env,
      },
    });

  const makeRed = process.stderr.isTTY ? chalk.red : (x: string) => x;

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();
    const stderr = new Array<any>();

    child.stdout!.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      stderr.push(chunk);
      process.stderr.write(makeRed(chunk.toString()));
    });

    child.once('error', reject);

    child.once('exit', code => {
      timer.end();
      const endTime = new Date();

      if (options.traceName) {
        // The end of stderr contains the timing measurements
        const timing = fs.readFileSync(timeFile, 'utf-8');
        let maxMemMB = 0;

        if (options.traceName && process.platform === 'darwin') {
          const f = timing.match(/(\d+)  maximum resident set size/); // Bytes
          if (f) {
            maxMemMB = Number(f[1]) / (1024 * 1024);
          }
        }
        if (options.traceName && process.platform === 'linux') {
          const f = timing.match(/Maximum resident set size \(kbytes\): (\d+)/); // kbytes
          if (f) {
            maxMemMB = Number(f[1]) / 1024;
          }
        }

        fs.unlinkSync(timeFile);

        writeTrace(options.traceName, startTime, endTime, maxMemMB);
      }

      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${renderCommandLine(command)} exited with error code ${code}`));
      }
    });
  });
}

/**
 * Escape a shell argument for the current shell
 */
export function escape(x: string) {
  if (process.platform === 'win32') {
    return windowsEscape(x);
  }
  return posixEscape(x);
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
  } catch (e: any) {
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
  } catch (e: any) {
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

/**
 * Write a trace file.
 *
 * We write each to a different file to avoid race conditions appending to a shared file
 * in parallel processes.
 */
function writeTrace(name: string, start: Date, end: Date, maxMemMB: number) {
  const lernaJson = findUp('lerna.json');
  if (!lernaJson) {
    return;
  }
  const dir = path.join(path.dirname(lernaJson), '.traces');
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, `${slugify(name)}.csv`),
    `"${name}",${Math.floor(start.getTime() / 1000)},${Math.floor(end.getTime() / 1000)},${maxMemMB}\n`,
  );
}

export function findUp(name: string, directory: string = process.cwd()): string | undefined {
  const absoluteDirectory = path.resolve(directory);

  const file = path.join(directory, name);
  if (fs.existsSync(file)) {
    return file;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory == root) {
    return undefined;
  }

  return findUp(name, path.dirname(absoluteDirectory));
}

function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '-');
}
