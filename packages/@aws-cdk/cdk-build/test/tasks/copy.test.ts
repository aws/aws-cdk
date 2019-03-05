import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import CopyTask from '../../lib/tasks/copy';

test('the "copy" can be used to copy files', async () => {
  // GIVEN
  const src = path.join(__dirname, '..', 'fixtures', 'file1.txt');
  const dest = path.join(await tempdir(), 'output.txt');

  // WHEN
  const task = new CopyTask('copy', { src, dest });
  const ret = await task.execute();

  // THEN
  expect(ret).toBeTruthy();
  expect((await fs.readFile(dest)).toString()).toMatchSnapshot();
});

test('the "copy" task will no-op if the destination already exists', async () => {
  // GIVEN
  const src = path.join(__dirname, '..', 'fixtures', 'file1.txt');
  const dest = path.join(await tempdir(), 'output.txt');
  await fs.writeFile(dest, 'hello, I exist!');

  // WHEN
  const task = new CopyTask('copy', { src, dest });
  const ret = await task.execute();

  // THEN
  expect(ret).toBeFalsy();
  expect((await fs.readFile(dest)).toString()).toMatchSnapshot();
});

async function tempdir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'copy-test'));
}
