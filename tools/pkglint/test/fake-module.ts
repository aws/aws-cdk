import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface FakeModuleProps {
  /**
   * The list of files to be created.
   * The key specifies the path of the file relative to the package directory including the file name.
   * If the value is a string, the string is written to the file. If object, the object is stringified
   * using `JSON.stringify()` and written into the file.
   */
  readonly files?: { [key: string]: string | {} };
}

export class FakeModule {
  private _tmpdir: string | undefined;
  private cleanedUp: boolean = false;

  constructor(private readonly props: FakeModuleProps = {}) {
  }

  public async tmpdir(): Promise<string> {
    if (this.cleanedUp) {
      throw new Error('Cannot re-create cleaned up fake module');
    }
    if (!this._tmpdir) {
      this._tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'pkglint-rules-test-'));
      for (const [key, value] of Object.entries(this.props.files ?? {})) {
        await fs.mkdirp(path.join(this._tmpdir, path.dirname(key)));
        const toWrite = typeof value === 'string' ? value : JSON.stringify(value);
        await fs.writeFile(path.join(this._tmpdir, key), toWrite, { encoding: 'utf8' });
      }
    }
    return this._tmpdir;
  }

  public async cleanup() {
    if (!this.cleanedUp && this._tmpdir) {
      await fs.emptyDir(this._tmpdir);
      await fs.rmdir(this._tmpdir);
    }
    this.cleanedUp = true;
  }
}