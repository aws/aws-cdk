import { exec as _exec } from 'child_process';
import fs = require('fs-extra');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { promisify } from 'util';
import { md5hash, zipDirectory } from '../lib/archive';
const exec = promisify(_exec);

export = {
  async 'zipDirectory can take a directory and produce a zip from it'(test: Test) {
    const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
    const zipFile = path.join(stagingDir, 'output.zip');
    const originalDir = path.join(__dirname, 'test-archive');
    const extractDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive.extract'));
    await zipDirectory(originalDir, zipFile);

    // unzip and verify that the resulting tree is the same
    await exec(`unzip ${zipFile}`, { cwd: extractDir });

    try {
      await exec(`diff -bur ${originalDir} ${extractDir}`);
    } catch (e) {
      test.ok(false, `extracted directory ${extractDir} differs from original ${originalDir}`);
    }

    await fs.remove(stagingDir);
    await fs.remove(extractDir);
    test.done();
  },

  async 'md5 hash of a zip stays consistent across invocations'(test: Test) {
    const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
    const zipFile1 = path.join(stagingDir, 'output.zip');
    const zipFile2 = path.join(stagingDir, 'output.zip');
    const originalDir = path.join(__dirname, 'test-archive');
    await zipDirectory(originalDir, zipFile1);
    await new Promise(ok => setTimeout(ok, 2000)); // wait 2s
    await zipDirectory(originalDir, zipFile2);

    const hash1 = md5hash(await fs.readFile(zipFile1));
    const hash2 = md5hash(await fs.readFile(zipFile2));

    test.deepEqual(hash1, hash2, 'md5 hash of two zips of the same content are not the same');
    test.done();
  }
};
