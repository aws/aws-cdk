import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as sinon from 'sinon';
import { FileSystem } from '../../lib/fs';

describe('fs', () => {
  afterEach(() => {
    sinon.restore();

  });

  test('tmpdir returns a real path and is cached', () => {
    // Create symlink that points to /tmp
    const symlinkTmp = path.join(__dirname, 'tmp-link');
    fs.symlinkSync(os.tmpdir(), symlinkTmp);

    // Now stub os.tmpdir() to return this link instead of /tmp
    const tmpdirStub = sinon.stub(os, 'tmpdir').returns(symlinkTmp);

    expect(path.isAbsolute(FileSystem.tmpdir)).toEqual(true);

    const p = path.join(FileSystem.tmpdir, 'tmpdir-test.txt');
    fs.writeFileSync(p, 'tmpdir-test');

    expect(p).toEqual(fs.realpathSync(p));
    expect(fs.readFileSync(p, 'utf8')).toEqual('tmpdir-test');

    // check that tmpdir() is called either 0 times (in which case it was
    // proabably cached from before) or once (for this test).
    expect(tmpdirStub.callCount).toBeLessThan(2);

    fs.unlinkSync(p);
    fs.unlinkSync(symlinkTmp);


  });

  test('mkdtemp creates a temporary directory in the system temp', () => {
    const tmpdir = FileSystem.mkdtemp('cdk-mkdtemp-');

    expect(path.dirname(tmpdir)).toEqual(FileSystem.tmpdir);
    expect(fs.existsSync(tmpdir)).toEqual(true);

    fs.rmdirSync(tmpdir);


  });
});
