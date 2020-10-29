import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface FakeModuleProps {
  readonly packagejson?: any;
  readonly readme?: string[];
  readonly notice?: string[];
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
      const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'pkglint-rules-test-'));
      if (this.props.packagejson !== undefined) {
        await fs.writeFile(path.join(tmpdir, 'package.json'), JSON.stringify(this.props.packagejson), { encoding: 'utf8' });
      }
      if (this.props.readme !== undefined) {
        await fs.writeFile(path.join(tmpdir, 'README.md'), this.props.readme, { encoding: 'utf8' });
      }
      this._tmpdir = tmpdir;
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