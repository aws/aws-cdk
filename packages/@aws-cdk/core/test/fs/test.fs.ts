import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import * as sinon from 'sinon';
import { FileSystem } from '../../lib/fs';

export = {
  'tearDown'(callback: any) {
    sinon.restore();
    callback();
  },

  'tmpdir returns a real path and is cached'(test: Test) {
    const symlinkTmp = path.join(__dirname, 'fixtures', 'symlinks', 'local-dir-link');
    const tmpdirStub = sinon.stub(os, 'tmpdir').returns(symlinkTmp);

    test.ok(path.isAbsolute(FileSystem.tmpdir));

    const p = path.join(FileSystem.tmpdir, 'tmpdir-test.txt');
    fs.writeFileSync(p, 'tmpdir-test');

    test.equal(p, fs.realpathSync(p));
    test.equal(fs.readFileSync(p, 'utf8'), 'tmpdir-test');

    test.ok(tmpdirStub.calledOnce); // cached result

    fs.unlinkSync(p);

    // @ts-ignore
    delete FileSystem._tmpdir; // do not use the wrong cached FileSystem.tmpdir in other tests

    test.done();
  },
};
