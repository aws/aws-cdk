import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Test } from 'nodeunit';
import * as sinon from 'sinon';
import { FileSystem } from '../../lib/fs';

export = {
  'tearDown'(callback: any) {
    sinon.restore();
    callback();
  },

  'tmpdir returns a real path and is cached'(test: Test) {
    // Create symlink that points to /tmp
    const symlinkTmp = path.join(__dirname, 'tmp-link');
    fs.symlinkSync(os.tmpdir(), symlinkTmp);

    // Now stub os.tmpdir() to return this link instead of /tmp
    const tmpdirStub = sinon.stub(os, 'tmpdir').returns(symlinkTmp);

    test.ok(path.isAbsolute(FileSystem.tmpdir));

    const p = path.join(FileSystem.tmpdir, 'tmpdir-test.txt');
    fs.writeFileSync(p, 'tmpdir-test');

    test.equal(p, fs.realpathSync(p));
    test.equal(fs.readFileSync(p, 'utf8'), 'tmpdir-test');

    test.ok(tmpdirStub.calledOnce); // cached result

    fs.unlinkSync(p);
    fs.unlinkSync(symlinkTmp);

    test.done();
  },

  'mkdtemp creates a temporary directory in the system temp'(test: Test) {
    const tmpdir = FileSystem.mkdtemp('cdk-mkdtemp-');

    test.equal(path.dirname(tmpdir), FileSystem.tmpdir);
    test.ok(fs.existsSync(tmpdir));

    fs.rmdirSync(tmpdir);

    test.done();
  },
};
