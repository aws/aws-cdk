import { exec as _exec } from 'child_process';
import * as fs from 'fs-extra';
import * as jszip from 'jszip';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import { contentHash, zipDirectory } from '../lib/archive';
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

    // inspect the zile file to check that dates are reset
    const zip = await fs.readFile(zipFile);
    const zipData = await jszip.loadAsync(zip);
    const dates = Object.values(zipData.files).map(file => file.date.toISOString());
    test.equal(dates[0], '1980-01-01T00:00:00.000Z', 'Dates are not reset');
    test.equal(new Set(dates).size, 1, 'Dates are not equal');

    // check that mode is preserved
    const stat = await fs.stat(path.join(extractDir, 'executable.txt'));
    // tslint:disable-next-line:no-bitwise
    const isExec = (stat.mode & fs.constants.S_IXUSR) || (stat.mode & fs.constants.S_IXGRP) || (stat.mode & fs.constants.S_IXOTH);
    test.ok(isExec, 'File is not executable');

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

    const hash1 = contentHash(await fs.readFile(zipFile1));
    const hash2 = contentHash(await fs.readFile(zipFile2));

    test.deepEqual(hash1, hash2, 'md5 hash of two zips of the same content are not the same');
    test.done();
  },

  async 'zipDirectory follows symlinks'(test: Test) {
    const originalDir = path.join(__dirname, 'test-archive-follow', 'data');
    const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
    const zipFile = path.join(stagingDir, 'output.zip');
    const extractDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive.follow'));

    try {
      await zipDirectory(originalDir, zipFile);
      await exec(`unzip ${zipFile}`, { cwd: extractDir });
      await exec(`diff -bur ${originalDir} ${extractDir}`);
    } catch (e) {
      test.ok(false, `extracted directory ${extractDir} differs from original ${originalDir}, symlinks not followed.`);
    }

    await fs.remove(stagingDir);
    await fs.remove(extractDir);
    test.done();
  }
};
