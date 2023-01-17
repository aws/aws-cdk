import * as os from 'os';
import * as path from 'path';
import { RWLock } from '../lib/api/util/rwlock';

function testDir() {
  return path.join(os.tmpdir(), 'rwlock-tests');
}

test('writer lock excludes other locks', async () => {
  // GIVEN
  const lock = new RWLock(testDir());
  const w = await lock.acquireWrite();

  // WHEN
  try {
    await expect(lock.acquireWrite()).rejects.toThrow(/currently synthing/);
    await expect(lock.acquireRead()).rejects.toThrow(/currently synthing/);
  } finally {
    await w.release();
  }
});

test('reader lock allows other readers but not writers', async () => {
  // GIVEN
  const lock = new RWLock(testDir());
  const r = await lock.acquireRead();

  // WHEN
  try {
    await expect(lock.acquireWrite()).rejects.toThrow(/currently reading/);

    const r2 = await lock.acquireRead();
    await r2.release();
  } finally {
    await r.release();
  }
});

test('can convert writer to reader lock', async () => {
  // GIVEN
  const lock = new RWLock(testDir());
  const w = await lock.acquireWrite();

  // WHEN
  const r = await w.convertToReaderLock();
  try {
    const r2 = await lock.acquireRead();
    await r2.release();
  } finally {
    await r.release();
  }
});