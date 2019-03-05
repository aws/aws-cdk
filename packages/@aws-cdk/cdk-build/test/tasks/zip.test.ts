import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import ZipTask from '../../lib/tasks/zip';
import { decompress } from '../util';

test('the "zip" task can be used to zip a directory', async () => {
  // GIVEN
  const src = path.join(__dirname, '..', 'fixtures', 'dir1');
  const dest = path.join(await tempdir(), 'output.zip');

  // WHEN
  const task = new ZipTask('zip', { src, dest });
  const ret = await task.execute();

  // THEN
  expect(await fs.readdir(path.dirname(dest))).toEqual([ 'output.zip' ]);
  expect(ret).toBeTruthy();

  const staging = await tempdir();
  await decompress(dest, staging);

  expect(await readTextFile(path.join(staging, 'file1.txt'))).toMatchSnapshot();
  expect(await readTextFile(path.join(staging, 'file2.txt'))).toMatchSnapshot();
  expect(await readTextFile(path.join(staging, 'subdir1', 'file3.txt'))).toMatchSnapshot();
});

test('the "zip" task will no-op if the destination already exists', async () => {
  // GIVEN
  const src = path.join(__dirname, '..', 'fixtures', 'dir1');
  const dest = path.join(await tempdir(), 'output.zip');
  await fs.writeFile(dest, 'i exist');

  // WHEN
  const task = new ZipTask('zip', { src, dest });
  const ret = await task.execute();

  // THEN
  expect(ret).toBeFalsy();
  expect(await readTextFile(dest)).toEqual('i exist');
});

async function tempdir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'copy-test'));
}

async function readTextFile(p: string): Promise<string> {
  return (await fs.readFile(p)).toString();
}