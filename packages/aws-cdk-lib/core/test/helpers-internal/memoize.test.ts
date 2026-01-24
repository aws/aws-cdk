import { memoizedGetter } from '../../lib/helpers-internal/memoize';

class SomeClass {
  public counter = 0;

  constructor(private readonly _field: string) {
  }

  @memoizedGetter
  public get field() {
    this.counter += 1;
    return this._field;
  }
}

test('counter not cheating', () => {
  const x = new SomeClass('value');
  expect(x.counter).toEqual(0);
});

test('getter only invoked once', () => {
  const x = new SomeClass('value');

  void x.field;
  void x.field;
  void x.field;

  expect(x.field).toEqual('value');
  expect(x.counter).toEqual(1);
});

test('memoizer not static by accident', () => {
  const x = new SomeClass('value');
  const y = new SomeClass('other');

  void x.field;
  void y.field;
  void x.field;
  void y.field;

  expect(x.field).toEqual('value');
  expect(y.field).toEqual('other');
  expect(x.counter).toEqual(1);
  expect(y.counter).toEqual(1);
});
