import fs from 'fs';
import os from 'os';
import path from 'path';
import { IgnoreStrategy, SymlinkFollowMode } from '../../lib/fs';
import * as util from '../../lib/fs/utils';

describe('utils', () => {
  describe('isInternalPath', () => {
    const root = path.resolve(path.join('source', 'root'));

    test('a descendant of the root is internal', () => {
      expect(util.isInternalPath(root, path.join(root, 'child', 'file.txt'))).toEqual(true);
    });

    test('a sibling sharing a name prefix with the root is external', () => {
      // 'source/root-sibling' string-prefixes 'source/root' but is NOT inside it.
      expect(util.isInternalPath(root, root + '-sibling')).toEqual(false);
      expect(util.isInternalPath(root, root + '-sibling' + path.sep + 'file.txt')).toEqual(false);
    });

    test('an unrelated path is external', () => {
      expect(util.isInternalPath(root, path.resolve(path.join('source', 'elsewhere', 'file.txt')))).toEqual(false);
    });
  });

  describe('resolveLinkTarget', () => {
    test('an absolute link target is resolved as-is', () => {
      const realPath = path.join('source', 'root', 'link');
      const linkTarget = path.resolve(path.join('somewhere', 'else', 'referent'));

      expect(util.resolveLinkTarget(realPath, linkTarget)).toEqual(path.resolve(linkTarget));
    });

    test('a relative link target is resolved against the directory of the link', () => {
      const realPath = path.join('source', 'root', 'link');
      const linkTarget = 'referent';

      // Resolved relative to the link's directory ('source/root'), not the cwd.
      expect(util.resolveLinkTarget(realPath, linkTarget)).toEqual(
        path.resolve(path.join('source', 'root'), 'referent'),
      );
    });

    test('a relative link target with parent segments is normalized', () => {
      const realPath = path.join('source', 'root', 'nested', 'link');
      const linkTarget = path.join('..', 'sibling', 'referent');

      expect(util.resolveLinkTarget(realPath, linkTarget)).toEqual(
        path.resolve(path.join('source', 'root', 'sibling', 'referent')),
      );
    });
  });

  describe('walkDirectory', () => {
    let tmp: string;
    let root: string;
    let outside: string;

    beforeEach(() => {
      // Realpath'd because `os.tmpdir()` is itself a symlink on macOS, which would
      // otherwise make every path under it compare as external.
      tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'walk-tests')));
      root = path.join(tmp, 'root');
      outside = path.join(tmp, 'outside');
      fs.mkdirSync(root);
      fs.mkdirSync(outside);
      fs.writeFileSync(path.join(outside, 'referent.txt'), 'outside');
    });

    afterEach(() => {
      fs.rmSync(tmp, { force: true, recursive: true });
    });

    /**
     * Walks a directory and records what each callback was handed, root-relative so the
     * assertions don't contain temp directory names.
     */
    function record(options: Partial<util.WalkOptions> = {}, directory = root) {
      const files = new Array<string>();
      const directories = new Array<string>();
      const symlinks = new Array<string>();
      const unsupported = new Array<string>();

      util.walkDirectory(directory, {
        follow: SymlinkFollowMode.EXTERNAL,
        ignoreStrategy: IgnoreStrategy.glob(directory, []),
        ...options,
      }, {
        onFile: (entry) => files.push(rel(directory, entry.path)),
        onDirectory: (entry) => directories.push(rel(directory, entry.path) + (entry.ignored ? ' (ignored)' : '')),
        onSymlink: (entry) => symlinks.push(`${rel(directory, entry.path)} => ${entry.linkTarget}${entry.internal ? '' : ' (external)'}`),
        onUnsupported: (entry) => unsupported.push(rel(directory, entry.path)),
      });

      return { files, directories, symlinks, unsupported };
    }

    function rel(from: string, to: string): string {
      return path.relative(from, to).replace(/\\/g, '/');
    }

    /**
     * `internal-link` points at a file in the tree, `external-link` at one outside it.
     * Link targets are written with forward slashes so they can be asserted verbatim.
     */
    function writeLinks() {
      fs.writeFileSync(path.join(root, 'file.txt'), 'inside');
      fs.symlinkSync('file.txt', path.join(root, 'internal-link'));
      fs.symlinkSync('../outside/referent.txt', path.join(root, 'external-link'));
    }

    describe('follow modes', () => {
      test('ALWAYS follows both internal and external links', () => {
        writeLinks();

        const walked = record({ follow: SymlinkFollowMode.ALWAYS });

        expect(walked.files).toEqual(['external-link', 'file.txt', 'internal-link']);
        expect(walked.symlinks).toEqual([]);
      });

      test('EXTERNAL follows only the external link, keeping the internal one as a link', () => {
        writeLinks();

        const walked = record({ follow: SymlinkFollowMode.EXTERNAL });

        expect(walked.files).toEqual(['external-link', 'file.txt']);
        expect(walked.symlinks).toEqual(['internal-link => file.txt']);
      });

      test('BLOCK_EXTERNAL follows the internal link and reports the external one as external', () => {
        writeLinks();

        const walked = record({ follow: SymlinkFollowMode.BLOCK_EXTERNAL });

        expect(walked.files).toEqual(['file.txt', 'internal-link']);
        // Reported rather than rejected: refusing an external link is the caller's policy.
        expect(walked.symlinks).toEqual(['external-link => ../outside/referent.txt (external)']);
      });

      test('NEVER keeps both links', () => {
        writeLinks();

        const walked = record({ follow: SymlinkFollowMode.NEVER });

        expect(walked.files).toEqual(['file.txt']);
        expect(walked.symlinks).toEqual([
          'external-link => ../outside/referent.txt (external)',
          'internal-link => file.txt',
        ]);
      });

      // A target that cannot be reached is not followed, whatever the mode says, because
      // there is nothing to descend into or read.
      test.each([
        SymlinkFollowMode.ALWAYS,
        SymlinkFollowMode.EXTERNAL,
        SymlinkFollowMode.BLOCK_EXTERNAL,
        SymlinkFollowMode.NEVER,
      ])('a dangling link is kept as a link under mode %s', (follow) => {
        fs.symlinkSync('missing.txt', path.join(root, 'dangling'));

        const walked = record({ follow });

        expect(walked.files).toEqual([]);
        expect(walked.symlinks).toEqual(['dangling => missing.txt']);
      });
    });

    describe('a sibling directory that shares a name prefix with the root', () => {
      // '<tmp>/root-sibling' string-prefixes '<tmp>/root' but is not inside it, so it has
      // to count as external.
      beforeEach(() => {
        fs.mkdirSync(path.join(tmp, 'root-sibling'));
        fs.writeFileSync(path.join(tmp, 'root-sibling', 'referent.txt'), 'sibling');
        fs.symlinkSync('../root-sibling/referent.txt', path.join(root, 'sibling-link'));
      });

      test('is followed under mode EXTERNAL', () => {
        const walked = record({ follow: SymlinkFollowMode.EXTERNAL });

        expect(walked.files).toEqual(['sibling-link']);
        expect(walked.symlinks).toEqual([]);
      });

      test('is reported as external under mode BLOCK_EXTERNAL', () => {
        const walked = record({ follow: SymlinkFollowMode.BLOCK_EXTERNAL });

        expect(walked.files).toEqual([]);
        expect(walked.symlinks).toEqual(['sibling-link => ../root-sibling/referent.txt (external)']);
      });
    });

    describe('directories', () => {
      test('a followed link to a directory has its contents reported under the link', () => {
        fs.mkdirSync(path.join(outside, 'dir'));
        fs.writeFileSync(path.join(outside, 'dir', 'inner.txt'), 'inner');
        fs.symlinkSync('../outside/dir', path.join(root, 'dir-link'));

        const walked = record({ follow: SymlinkFollowMode.EXTERNAL });

        expect(walked.directories).toEqual(['dir-link']);
        expect(walked.files).toEqual(['dir-link/inner.txt']);
      });

      test('an unfollowed link to a directory is kept as a link', () => {
        fs.mkdirSync(path.join(root, 'dir'));
        fs.writeFileSync(path.join(root, 'dir', 'inner.txt'), 'inner');
        fs.symlinkSync('dir', path.join(root, 'dir-link'));

        const walked = record({ follow: SymlinkFollowMode.NEVER });

        expect(walked.directories).toEqual(['dir']);
        expect(walked.files).toEqual(['dir/inner.txt']);
        expect(walked.symlinks).toEqual(['dir-link => dir']);
      });

      test('the walked directory itself is not reported', () => {
        fs.writeFileSync(path.join(root, 'file.txt'), 'inside');

        expect(record().directories).toEqual([]);
      });
    });

    describe('symlink cycles', () => {
      test('a link pointing at one of its own ancestors terminates without descending', () => {
        fs.mkdirSync(path.join(root, 'sub'));
        fs.writeFileSync(path.join(root, 'sub', 'file.txt'), 'inside');
        fs.symlinkSync('..', path.join(root, 'sub', 'loop'));

        const walked = record({ follow: SymlinkFollowMode.ALWAYS });

        expect(walked.directories).toEqual(['sub', 'sub/loop']);
        expect(walked.files).toEqual(['sub/file.txt']);
      });

      test('two links to one directory are both walked in full', () => {
        // The cycle guard tracks ancestors, not every directory seen, so links that are not
        // ancestors of each other still both contribute. Deduplicating them would silently
        // change the fingerprint of an existing asset.
        fs.mkdirSync(path.join(outside, 'dir'));
        fs.writeFileSync(path.join(outside, 'dir', 'inner.txt'), 'inner');
        fs.symlinkSync('../outside/dir', path.join(root, 'a-link'));
        fs.symlinkSync('../outside/dir', path.join(root, 'b-link'));

        const walked = record({ follow: SymlinkFollowMode.EXTERNAL });

        expect(walked.files).toEqual(['a-link/inner.txt', 'b-link/inner.txt']);
      });
    });

    describe('ignored entries', () => {
      test('an ignored file is not reported', () => {
        fs.writeFileSync(path.join(root, 'keep.txt'), 'keep');
        fs.writeFileSync(path.join(root, 'drop.txt'), 'drop');

        const walked = record({ ignoreStrategy: IgnoreStrategy.glob(root, ['drop.txt']) });

        expect(walked.files).toEqual(['keep.txt']);
      });

      test('an ignored symlink is not reported, so a caller never rejects an excluded link', () => {
        fs.symlinkSync('../outside/referent.txt', path.join(root, 'external-link'));

        const walked = record({
          follow: SymlinkFollowMode.BLOCK_EXTERNAL,
          ignoreStrategy: IgnoreStrategy.glob(root, ['external-link']),
        });

        expect(walked.symlinks).toEqual([]);
      });

      test('a completely ignored directory is not descended into', () => {
        fs.mkdirSync(path.join(root, 'sub'));
        fs.writeFileSync(path.join(root, 'sub', 'inner.txt'), 'inner');

        const walked = record({ ignoreStrategy: IgnoreStrategy.glob(root, ['sub']) });

        expect(walked.directories).toEqual([]);
        expect(walked.files).toEqual([]);
      });

      test('a directory excluded with a re-included child is descended into and flagged ignored', () => {
        fs.mkdirSync(path.join(root, 'sub'));
        fs.writeFileSync(path.join(root, 'sub', 'keep.txt'), 'keep');
        fs.writeFileSync(path.join(root, 'sub', 'drop.txt'), 'drop');

        const walked = record({ ignoreStrategy: IgnoreStrategy.docker(root, ['**', '!sub/keep.txt']) });

        expect(walked.directories).toEqual(['sub (ignored)']);
        expect(walked.files).toEqual(['sub/keep.txt']);
      });
    });

    test('entries are reported in sorted order, so a derived hash is stable', () => {
      for (const name of ['c.txt', 'a.txt', 'b.txt']) {
        fs.writeFileSync(path.join(root, name), name);
      }

      expect(record().files).toEqual(['a.txt', 'b.txt', 'c.txt']);
    });

    describe('the root option', () => {
      beforeEach(() => {
        fs.writeFileSync(path.join(root, 'file.txt'), 'inside');
        fs.mkdirSync(path.join(root, 'sub'));
        fs.symlinkSync('../file.txt', path.join(root, 'sub', 'up-link'));
      });

      test('defaults to the directory being walked, making a link out of it external', () => {
        const walked = record({ follow: SymlinkFollowMode.EXTERNAL }, path.join(root, 'sub'));

        expect(walked.files).toEqual(['up-link']);
      });

      test('makes a link internal when it points inside the wider root', () => {
        const walked = record({
          follow: SymlinkFollowMode.EXTERNAL,
          root,
          ignoreStrategy: IgnoreStrategy.glob(root, []),
        }, path.join(root, 'sub'));

        expect(walked.files).toEqual([]);
        expect(walked.symlinks).toEqual(['up-link => ../file.txt']);
      });
    });

    // Needs a path that is neither a file nor a directory; `/dev/null` is the portable one.
    (process.platform === 'win32' ? test.skip : test)('a followed link to neither a file nor a directory is reported as unsupported', () => {
      fs.symlinkSync('/dev/null', path.join(root, 'device-link'));

      const walked = record({ follow: SymlinkFollowMode.ALWAYS });

      expect(walked.unsupported).toEqual(['device-link']);
      expect(walked.files).toEqual([]);
    });
  });
});
