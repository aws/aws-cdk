import { SimpleTask } from './util';

test('simple task with no deps', async () => {
  // GIVEN
  const logs = new Array<string>();
  const task = new SimpleTask('hello', logs);

  // THEN
  expect(task.ready).toBeTruthy();
  expect(task.waiting).toEqual([]);

  // WHEN
  await task.build();

  // THEN
  expect(task.buildCalled).toBeTruthy();
  expect(task.completed).toBeTruthy();
  expect(logs).toEqual([ 'hello' ]);
});

test('task with a dependency is only ready with the dep is completed', async () => {
  // GIVEN
  const logs = new Array<string>();
  const consumer = new SimpleTask('hello', logs);
  const dep = new SimpleTask('dep', logs);
  consumer.addDependency(dep);

  // THEN
  expect(dep.ready).toBeTruthy();
  expect(consumer.ready).toBeFalsy();
  expect(consumer.build()).rejects.toEqual(new Error(`Can't start build, waiting for the following tasks to complete: dep`));
  expect(consumer.waiting).toEqual([ dep ]);

  // WHEN
  await dep.build();

  // THEN
  expect(dep.completed).toBeTruthy();
  expect(consumer.ready).toBeTruthy();

  // WHEN
  await consumer.build();

  // THEN
  expect(consumer.completed).toBeTruthy();
  expect(logs).toEqual([ 'dep', 'hello' ]);
});
