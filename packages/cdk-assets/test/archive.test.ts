import { exec as _exec } from 'child_process';
import * as crypto from 'crypto';
import { constants, promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import * as jszip from 'jszip';
import { zipDirectory } from '../lib/private/archive';
import { rmRfSync } from '../lib/private/fs-extra';
const exec = promisify(_exec);

test('zipDirectory can take a directory and produce a zip from it', async () => {
  const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
  const extractDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive.extract'));
  try {
    const zipFile = path.join(stagingDir, 'output.zip');
    const originalDir = path.join(__dirname, 'test-archive');
    await zipDirectory(originalDir, zipFile);

    // unzip and verify that the resulting tree is the same
    await exec(`unzip ${zipFile}`, { cwd: extractDir });

    await expect(exec(`diff -bur ${originalDir} ${extractDir}`)).resolves.toBeTruthy();

    // inspect the zile file to check that dates are reset
    const zip = await fs.readFile(zipFile);
    const zipData = await jszip.loadAsync(zip);
    const dates = Object.values(zipData.files).map(file => file.date.toISOString());
    expect(dates[0]).toBe('1980-01-01T00:00:00.000Z');
    expect(new Set(dates).size).toBe(1);

    // check that mode is preserved
    const stat = await fs.stat(path.join(extractDir, 'executable.txt'));
    // eslint-disable-next-line no-bitwise
    const isExec = (stat.mode & constants.S_IXUSR) || (stat.mode & constants.S_IXGRP) || (stat.mode & constants.S_IXOTH);
    expect(isExec).toBeTruthy();
  } finally {
    rmRfSync(stagingDir);
    rmRfSync(extractDir);
  }
});

test('md5 hash of a zip stays consistent across invocations', async () => {
  const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
  const zipFile1 = path.join(stagingDir, 'output.zip');
  const zipFile2 = path.join(stagingDir, 'output.zip');
  const originalDir = path.join(__dirname, 'test-archive');
  await zipDirectory(originalDir, zipFile1);
  await new Promise(ok => setTimeout(ok, 2000)); // wait 2s
  await zipDirectory(originalDir, zipFile2);

  const hash1 = contentHash(await fs.readFile(zipFile1));
  const hash2 = contentHash(await fs.readFile(zipFile2));

  expect(hash1).toEqual(hash2);
});

test('zipDirectory follows symlinks', async () => {
  const stagingDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive'));
  const extractDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test.archive.follow'));
  try {
    const originalDir = path.join(__dirname, 'test-archive-follow', 'data');
    const zipFile = path.join(stagingDir, 'output.zip');

    await expect(zipDirectory(originalDir, zipFile)).resolves.toBeUndefined();
    await expect(exec(`unzip ${zipFile}`, { cwd: extractDir })).resolves.toBeDefined();
    await expect(exec(`diff -bur ${originalDir} ${extractDir}`)).resolves.toBeDefined();
  } finally {
    rmRfSync(stagingDir);
    rmRfSync(extractDir);
  }
});

function contentHash(data: string | Buffer | DataView) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
