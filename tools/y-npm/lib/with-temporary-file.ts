import fs = require('fs-extra');
import os = require('os');
import path = require('path');

/**
 * Executes a block of code with a temporary file, that will be deleted once the
 * execution is completed.
 *
 * @param name   the name of the file to be created.
 * @param callback the function to be invoked with the temporary file's path.
 * @returns the result of calling ``callback`` with the temporary file.
 */
export async function withTemporaryFile<T>(name: string, callback: (file: string) => (T | Promise<T>)): Promise<T> {
  const dir = await fs.mkdtemp(os.tmpdir() + path.sep);
  try {
    const file = path.join(dir, name);
    return await callback(file);
  } finally {
    await fs.remove(dir);
  }
}
