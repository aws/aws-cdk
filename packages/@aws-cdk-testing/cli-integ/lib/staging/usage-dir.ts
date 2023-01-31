import * as path from 'path';
import * as fs from 'fs-extra';
import { copyDirectoryContents, homeDir, loadLines, updateIniKey, writeLines } from '../files';

export const DEFAULT_USAGE_DIR = path.join(homeDir(), '.codeartifact/usage');

/**
 * The usage directory is where we write per-session config files to access the CodeArtifact repository.
 *
 * Some config files may be written in a system-global location, but they will not be active unless the
 * contents of this directory have been sourced/copied into the current terminal.
 *
 * CONTRACT
 *
 * There are two special entries:
 *
 * - `env`, a file with `key=value` entries for environment variables to  set.
 * - `cwd/`, a directory with files that need to be copied into the current directory before each command.
 *
 * Other than these, code may write tempfiles to this directory if it wants, but there is no meaning
 * implied for other files.
 */
export class UsageDir {
  public static default() {
    return new UsageDir(DEFAULT_USAGE_DIR);
  }

  public readonly envFile: string;
  public readonly cwdDir: string;

  private constructor(public readonly directory: string) {
    this.envFile = path.join(this.directory, 'env');
    this.cwdDir = path.join(this.directory, 'cwd');
  }

  public async clean() {
    await fs.rm(this.directory, { recursive: true, force: true });
    await fs.mkdirp(path.join(this.directory, 'cwd'));
    await fs.writeFile(path.join(this.directory, 'env'), '', { encoding: 'utf-8' });

    await this.addToEnv({
      CWD_FILES_DIR: path.join(this.directory, 'cwd'),
    });

    // Write a bash helper to load these settings
    await fs.writeFile(path.join(this.directory, 'activate.bash'), [
      `while read -u10 line; do [[ -z $line ]] || export "$line"; done 10<${this.directory}/env`,
      'cp -R $CWD_FILES_DIR/ .', // Copy files from directory even if it is empty
    ].join('\n'), { encoding: 'utf-8' });
  }

  public async addToEnv(settings: Record<string, string>) {
    const lines = await loadLines(this.envFile);
    for (const [k, v] of Object.entries(settings)) {
      updateIniKey(lines, k, v);
    }
    await writeLines(this.envFile, lines);
  }

  public async currentEnv(): Promise<Record<string, string>> {
    const lines = await loadLines(this.envFile);

    const splitter = /^([a-zA-Z0-9_-]+)\s*=\s*(.*)$/;

    const ret: Record<string, string> = {};
    for (const line of lines) {
      const m = line.match(splitter);
      if (m) {
        ret[m[1]] = m[2];
      }
    }
    return ret;
  }

  public cwdFile(filename: string) {
    return path.join(this.cwdDir, filename);
  }

  public async activateInCurrentProcess() {
    for (const [k, v] of Object.entries(await this.currentEnv())) {
      process.env[k] = v;
    }

    await copyDirectoryContents(this.cwdDir, '.');
  }

  public async copyCwdFileHere(...filenames: string[]) {
    for (const file of filenames) {
      await fs.copyFile(path.join(this.cwdDir, file), file);
    }
  }

  public advertise() {
    // eslint-disable-next-line no-console
    console.log('To activate these settings in the current terminal:');
    // eslint-disable-next-line no-console
    console.log(`    source ${this.directory}/activate.bash`);
  }
}