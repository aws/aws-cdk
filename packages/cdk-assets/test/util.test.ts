import { createCriticalSection } from '../lib/private/util';

test('critical section', async () => {
  // GIVEN
  const criticalSection = createCriticalSection();

  // WHEN
  const arr = new Array<string>();
  void criticalSection(async () => {
    await new Promise(res => setTimeout(res, 500));
    arr.push('first');
  });
  await criticalSection(async () => {
    arr.push('second');
  });

  // THEN
  expect(arr).toEqual([
    'first',
    'second',
  ]);
});

test('exceptions in critical sections', async () => {
  // GIVEN
  const criticalSection = createCriticalSection();

  // WHEN/THEN
  await expect(() => criticalSection(async () => {
    throw new Error('Thrown');
  })).rejects.toThrow('Thrown');
});