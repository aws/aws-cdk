import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import cdk = require('../lib');
import { InMemorySynthesisSession, SynthesisSession } from '../lib';

const sessionTestMatix: any = { };

export = {
  'constructs that implement "synthesize" can emit artifacts during synthesis'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    new Synthesizer1(app, 'synthe1');
    const s2 = new Synthesizer2(app, 'synthe2');
    new Synthesizer3(s2, 'synthe3');

    // WHEN
    const session = app.run();

    // THEN
    test.deepEqual(session.readFile('s1.txt'), 'hello, s1');
    test.deepEqual(session.readFile('s2.txt'), 'hello, s2');

    test.deepEqual(session.list(), [
      'cdk.out',
      's1.txt',
      's2.txt',
      'synthe2Group0512C945A.txt',
      'synthe2Group181E95665.txt',
      'synthe2Group20BD1A3CD.txt',
      'synthe2synthe30CE80559.txt'
    ]);

    test.done();
  },

  'session': sessionTestMatix
};

const sessionTests = {
  'writeFile()/readFile()'(test: Test, session: cdk.ISynthesisSession) {
    // WHEN
    session.writeFile('bla.txt', 'hello');
    session.writeFile('hey.txt', '1234');

    // THEN
    test.deepEqual(session.readFile('bla.txt').toString(), 'hello');
    test.deepEqual(session.readFile('hey.txt').toString(), '1234');
    test.throws(() => session.writeFile('bla.txt', 'override is forbidden'));

    // WHEN
    session.finalize();

    // THEN
    test.throws(() => session.writeFile('another.txt', 'locked!'));
    test.done();
  },

  'exists() for files'(test: Test, session: cdk.ISynthesisSession) {
    // WHEN
    session.writeFile('A.txt', 'aaa');

    // THEN
    test.ok(session.exists('A.txt'));
    test.ok(!session.exists('B.txt'));
    test.done();
  },

  'mkdir'(test: Test, session: cdk.ISynthesisSession) {
    // WHEN
    const dir1 = session.mkdir('dir1');
    const dir2 = session.mkdir('dir2');

    // THEN
    test.ok(fs.statSync(dir1).isDirectory());
    test.ok(fs.statSync(dir2).isDirectory());
    test.throws(() => session.mkdir('dir1'));

    // WHEN
    session.finalize();
    test.throws(() => session.mkdir('dir3'));
    test.done();
  },

  'list'(test: Test, session: cdk.ISynthesisSession) {
    // WHEN
    session.mkdir('dir1');
    session.writeFile('file1.txt', 'boom1');

    // THEN
    test.deepEqual(session.list(), [ 'dir1', 'file1.txt' ]);
    test.done();
  }
};

for (const [ name, fn ] of Object.entries(sessionTests)) {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-tests'));
  const fsSession = new SynthesisSession({ outdir });
  const memorySession = new InMemorySynthesisSession();
  sessionTestMatix[`SynthesisSession - ${name}`] = (test: Test) => fn(test, fsSession);
  sessionTestMatix[`InMemorySession - ${name}`] = (test: Test) => fn(test, memorySession);
}

class Synthesizer1 extends cdk.Construct {
  public synthesize(s: cdk.ISynthesisSession) {
    s.writeFile('s1.txt', 'hello, s1');
  }
}

class Synthesizer2 extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const group = new cdk.Construct(this, 'Group');
    for (let i = 0; i < 3; ++i) {
      new Synthesizer3(group, `${i}`);
    }
  }

  public synthesize(s: cdk.ISynthesisSession) {
    s.writeFile('s2.txt', 'hello, s2');
  }
}

class Synthesizer3 extends cdk.Construct {
  public synthesize(s: cdk.ISynthesisSession) {
    s.writeFile(this.node.uniqueId + '.txt', 'hello, s3');
  }
}
