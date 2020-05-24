import * as path from 'path';

test('path.resolve is sane', async () => {
  // Reasons why this might not be true:
  // graceful-fs, which is used by Jest, hooks into process.cwd() and
  // process.chdir() and caches the values. Because... profit?

  const targetDir = path.join(__dirname, 'fixture');

  const cwd = process.cwd();

  try {
    process.chdir(targetDir);
    expect(process.cwd()).toEqual(targetDir);

    const resolved = path.resolve('.');
    expect(resolved).toEqual(targetDir);

  } finally {
    process.chdir(cwd);
  }
});