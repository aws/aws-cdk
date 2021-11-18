import { Code } from '../lib/code';
import { AnyAssumption } from '../lib/declaration';

test('created successfully', () => {
  const code = new Code('hello world', [new AnyAssumption('from Mars')]);

  expect(code.code).toEqual('hello world');
  expect(code.declarations.length).toEqual(1);
  expect(code.declarations[0]).toBeInstanceOf(AnyAssumption);
});

test('can append', () => {
  const code = new Code('hello ', [new AnyAssumption('from Mars')])
    .append('world')
    .append(new Code('.', [new AnyAssumption('from Jupiter')]));

  expect(code.code).toEqual('hello world.');
  expect(code.declarations.length).toEqual(2);
});

test('concatAll works as expected', () => {
  const code = Code.concatAll(
    'hello',
    new Code(' world', [new AnyAssumption('from Mars')]),
  );

  expect(code.code).toEqual('hello world');
  expect(code.declarations.length).toEqual(1);
});

describe('code declarations on toString', () => {
  test('deduplicated', () => {
    const code = new Code('', [
      new AnyAssumption('duplicate'),
      new AnyAssumption('duplicate'),
      new AnyAssumption('unique'),
    ]);

    expect(code.toString()).toEqual('declare const duplicate: any;\ndeclare const unique: any;\n\n');
  });

  test('sorted', () => {
    const code = new Code('', [
      new AnyAssumption('third'),
      new AnyAssumption('second'),
      new AnyAssumption('first'),
    ]);

    expect(code.toString()).toEqual('declare const first: any;\ndeclare const second: any;\ndeclare const third: any;\n\n');
  });
});
