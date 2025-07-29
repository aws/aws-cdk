import * as fc from 'fast-check';
import { LinkedQueue } from '../../lib/private/linked-queue';

type TestQueue = LinkedQueue<string>;

// The model holds an array, we test that queue and the array behave the same
interface Model {
  array: string[];
}

class PushCommand implements fc.Command<Model, TestQueue> {
  constructor(readonly value: string) {}
  check() { return true; }
  run(m: Model, r: TestQueue): void {
    r.push(this.value);
    m.array.push(this.value);
  }
  toString = () => `push(${this.value})`;
}
class ShiftCommand implements fc.Command<Model, TestQueue> {
  check() { return true; }
  run(m: Model, r: TestQueue): void {
    const fromQueue = r.shift();
    const fromArray = m.array.shift();

    expect(fromQueue).toEqual(fromArray);
  }
  toString = () => 'shift';
}

test('LinkedQueue behaves the same as array', () => {
  // define the possible commands and their inputs
  const allCommands = [
    fc.string().map((v) => new PushCommand(v)),
    fc.constant(new ShiftCommand()),
  ];

  // run everything
  fc.assert(
    fc.property(fc.commands(allCommands, { size: '+1' }), (cmds) => {
      const s = () => ({
        model: { array: [] } satisfies Model,
        real: new LinkedQueue(),
      });
      fc.modelRun(s, cmds);
    }),
  );
});
