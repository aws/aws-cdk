import { BuildSession } from '../lib/session';
import { SimpleTask } from './util';

test('empty session', async () => {
  const session = new BuildSession();
  await session.build();
});

test('session with a single task', async () => {
  const session = new BuildSession();
  const log = new Array<string>();
  session.addTask(new SimpleTask('t1', log));
  await session.build();

  expect(log).toEqual([ 't1' ]);
});

test('session with a bunch of non-dependent tasks', async () => {
  // GIVEN
  const session = new BuildSession();
  const log = new Array<string>();
  const t1 = new SimpleTask('t1', log);
  const t2 = new SimpleTask('t2', log);
  const t3 = new SimpleTask('t3', log);
  session.addTask(t1);
  session.addTask(t3);
  session.addTask(t2);

  // WHEN
  await session.build();

  // THEN
  expect(log).toEqual([ 't1', 't2', 't3' ]);
});

test('session with tasks that have deps', async () => {
  // GIVEN
  const session = new BuildSession();
  const log = new Array<string>();
  const t1 = new SimpleTask('t1', log);
  const t2 = new SimpleTask('t2', log);
  const t3 = new SimpleTask('t3', log);
  session.addTask(t1);
  session.addTask(t3);
  session.addTask(t2);
  t2.addDependency(t1);

  // WHEN
  await session.build();

  // THEN
  expect(log).toEqual([ 't1', 't3', 't2' ]);
});