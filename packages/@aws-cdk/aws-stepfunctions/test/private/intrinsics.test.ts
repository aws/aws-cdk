import { IntrinsicParser } from '../../lib/private/intrinstics';


test('parse JSON path', () => {
  expect(parse('$.Path')).toEqual({ type: 'path', path: '$.Path' });
  expect(parse('$[\'complex\'].Path')).toEqual({ type: 'path', path: '$[\'complex\'].Path' });

  // Can add whitespace
  expect(parse(' $.Path')).toEqual({ type: 'path', path: '$.Path' });
  expect(parse('$.Path ')).toEqual({ type: 'path', path: '$.Path' });
});

test('JSON path with quoted literal', () => {
  expect(parse("$['I\\'m'].Path")).toEqual({ type: 'path', path: "$['I\\'m'].Path" });
});

test('Complex JSON path between square brackets', () => {
  expect(parse("$[?('Eva Green' in @['starring'])]")).toEqual({ type: 'path', path: "$[?('Eva Green' in @['starring'])]" });
});

test('JSON path must be contiguous', () => {
  expect(() => parse('$.Path AndThen')).toThrow(/Invalid JSONPath expression/);
});

test('parse fncall with path', () => {
  expect(parse('States.Array($$.Context.Token)')).toEqual({
    type: 'fncall',
    functionName: 'States.Array',
    arguments: [{
      type: 'path',
      path: '$$.Context.Token',
    }],
  });
});

test('parse fncall with string and path', () => {
  expect(parse("States.Format('Hi my name is {}.', $.Name)")).toEqual({
    type: 'fncall',
    functionName: 'States.Format',
    arguments: [
      {
        type: 'string-literal',
        literal: 'Hi my name is {}.',
      },
      {
        type: 'path',
        path: '$.Name',
      },
    ],
  });
});

test('parse string literal with escaped quotes', () => {
  expect(parse("States.Format('Hi I\\'m cool')")).toEqual({
    type: 'fncall',
    functionName: 'States.Format',
    arguments: [
      {
        type: 'string-literal',
        literal: "Hi I'm cool",
      },
    ],
  });
});

test('nested function calls', () => {
  expect(parse("States.Format('{}', States.JsonToString($.Obj))")).toEqual({
    type: 'fncall',
    functionName: 'States.Format',
    arguments: [
      {
        type: 'string-literal',
        literal: '{}',
      },
      {
        type: 'fncall',
        functionName: 'States.JsonToString',
        arguments: [
          {
            type: 'path',
            path: '$.Obj',
          },
        ],
      },
    ],
  });
});

function parse(x: string) {
  return new IntrinsicParser(x).parseTopLevelIntrinsic();
}