import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface FakeModuleProps {
  /**
   * The contents of the package json.
   * If an empty object, i.e. `{}`, is provided, an empty file is created.
   * @default - no package json will be created
   */
  readonly packagejson?: any;
  /**
   * The contents of the README.md file. Each item in the array represents a single line.
   * If an empty list is provided, an empty file is created.
   * @default - no README.md file will be created
   */
  readonly readme?: string[];
  /**
   * The contents of the NOTICE file. Each item in the array represents a single line.
   * If an empty list is provided, an empty file is created.
   * @default - no NOTICE file will be created
   */
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
      this._tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'pkglint-rules-test-'));
      await fs.writeFile(path.join(this._tmpdir, 'package.json'), JSON.stringify(this.props.packagejson ?? {}), { encoding: 'utf8' });
      await this.createFakeNodeTree();
      if (this.props.readme !== undefined) {
        const contents = this.props.readme.join('\n');
        await fs.writeFile(path.join(this._tmpdir, 'README.md'), contents, { encoding: 'utf8' });
      }
      if (this.props.notice !== undefined) {
        const contents = this.props.notice.join('\n');
        await fs.writeFile(path.join(this._tmpdir, 'NOTICE'), contents, { encoding: 'utf8' });
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

  private async createFakeNodeTree() {
    const deps: string[] = this.props.packagejson.bundledDependencies ?? [];
    for (const dep of deps) {
      await fs.mkdirp(path.join(this._tmpdir!, 'node_modules', dep));
    }
  }
}