import * as fc from 'fast-check';
import * as _ from 'lodash';
import { App, Aws, CfnOutput, Fn, Stack, Token } from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';

function asyncTest(cb: () => Promise<void>): () => void {
  return async () => {
    let error: any;
    try {
      await cb();
    } catch (e) {
      error = e;
    } finally {
      expect(() => {
        if (error) { throw error; }
      }).not.toThrow();
    }
  };
}

const nonEmptyString = fc.string(1, 16);
const tokenish = fc.array(nonEmptyString, 2, 2).map(arr => ({ [arr[0]]: arr[1] }));
const anyValue = fc.oneof<any>(nonEmptyString, tokenish);

describe('fn', () => {
  describe('eager resolution for non-tokens', () => {
    test('Fn.select', () => {
      expect(Fn.select(2, ['hello', 'you', 'dude'])).toEqual('dude');
    });

    test('Fn.select does not short-circuit if there are tokens in the array', () => {
      const stack = new Stack();

      expect(stack.resolve(Fn.select(2, [
        Fn.conditionIf('xyz', 'yep', Aws.NO_VALUE).toString(),
        'you',
        'dude',
      ]))).toEqual({
        'Fn::Select': [2, [
          { 'Fn::If': ['xyz', 'yep', { Ref: 'AWS::NoValue' }] },
          'you',
          'dude',
        ]],
      });
    });

    test('Fn.split', () => {
      expect(Fn.split(':', 'hello:world:yeah')).toEqual(['hello', 'world', 'yeah']);
    });
  });

  describe('FnParseDomainName', () => {
    test('parse domain name from resolved url', () => {
      expect(Fn.parseDomainName('https://test.com/')).toEqual('test.com');
    });

    test('parse domain name on token', () => {
      const stack = new Stack();
      const url = Fn.join('//', [
        'https:',
        Fn.join('/', [
          'test.com',
          'graphql',
        ]),
      ]);
      expect(Fn.parseDomainName(stack.resolve(url))).toEqual('test.com');
    });
  });

  describe('FnJoin', () => {
    test('rejects empty list of arguments to join', () => {
      expect(() => Fn.join('.', [])).toThrow();
    });

    test('collapse nested FnJoins even if they contain tokens', () => {
      const stack = new Stack();

      const obj = Fn.join('', [
        'a',
        Fn.join('', [Fn.getAtt('a', 'bc').toString(), 'c']),
        'd',
      ]);

      expect(stack.resolve(obj)).toEqual({
        'Fn::Join': ['',
          [
            'a',
            { 'Fn::GetAtt': ['a', 'bc'] },
            'cd',
          ]],
      });
    });

    test('resolves to the value if only one value is joined', asyncTest(async () => {
      const stack = new Stack();
      fc.assert(
        fc.property(
          fc.string(), anyValue,
          (delimiter, value) => _.isEqual(stack.resolve(Fn.join(delimiter, [value as string])), value),
        ),
        { verbose: true },
      );
    }));

    test('pre-concatenates string literals', asyncTest(async () => {
      const stack = new Stack();
      fc.assert(
        fc.property(
          fc.string(), fc.array(nonEmptyString, 1, 15),
          (delimiter, values) => stack.resolve(Fn.join(delimiter, values)) === values.join(delimiter),
        ),
        { verbose: true },
      );
    }));

    test('pre-concatenates around tokens', asyncTest(async () => {
      const stack = new Stack();
      fc.assert(
        fc.property(
          fc.string(), fc.array(nonEmptyString, 1, 3), tokenish, fc.array(nonEmptyString, 1, 3),
          (delimiter, prefix, obj, suffix) =>
            _.isEqual(stack.resolve(Fn.join(delimiter, [...prefix, stringToken(obj), ...suffix])),
              { 'Fn::Join': [delimiter, [prefix.join(delimiter), obj, suffix.join(delimiter)]] }),
        ),
        { verbose: true, seed: 1539874645005, path: '0:0:0:0:0:0:0:0:0' },
      );
    }));

    test('flattens joins nested under joins with same delimiter', asyncTest(async () => {
      const stack = new Stack();
      fc.assert(
        fc.property(
          fc.string(), fc.array(anyValue),
          fc.array(anyValue, 1, 3),
          fc.array(anyValue),
          (delimiter, prefix, nested, suffix) =>
            // Gonna test
            _.isEqual(stack.resolve(Fn.join(delimiter, [...prefix as string[], Fn.join(delimiter, nested as string[]), ...suffix as string[]])),
              stack.resolve(Fn.join(delimiter, [...prefix as string[], ...nested as string[], ...suffix as string[]]))),
        ),
        { verbose: true },
      );
    }));

    test('does not flatten joins nested under joins with different delimiter', asyncTest(async () => {
      const stack = new Stack();
      fc.assert(
        fc.property(
          fc.string(), fc.string(),
          fc.array(anyValue, 1, 3),
          fc.array(tokenish, 2, 3),
          fc.array(anyValue, 3),
          (delimiter1, delimiter2, prefix, nested, suffix) => {
            fc.pre(delimiter1 !== delimiter2);
            const join = Fn.join(delimiter1, [...prefix as string[], Fn.join(delimiter2, stringListToken(nested)), ...suffix as string[]]);
            const resolved = stack.resolve(join);
            return resolved['Fn::Join'][1].find((e: any) => typeof e === 'object'
                                                        && ('Fn::Join' in e)
                                                        && e['Fn::Join'][0] === delimiter2) != null;
          },
        ),
        { verbose: true },
      );
    }));

    test('Fn::EachMemberIn', asyncTest(async () => {
      const stack = new Stack();
      const eachMemberIn = Fn.conditionEachMemberIn(
        Fn.valueOfAll('AWS::EC2::Subnet::Id', 'VpcId'),
        Fn.refAll('AWS::EC2::VPC::Id'),
      );
      expect(stack.resolve(eachMemberIn)).toEqual({
        'Fn::EachMemberIn': [
          { 'Fn::ValueOfAll': ['AWS::EC2::Subnet::Id', 'VpcId'] },
          { 'Fn::RefAll': 'AWS::EC2::VPC::Id' },
        ],
      });
    }));

    test('cross-stack FnJoin elements are properly resolved', asyncTest(async () => {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const stack2 = new Stack(app, 'Stack2');

      // WHEN
      new CfnOutput(stack2, 'Stack1Id', {
        value: Fn.join(' = ', ['Stack1Id', stack1.stackId]),
      });

      // THEN
      const template = app.synth().getStackByName('Stack2').template;

      expect(template?.Outputs).toEqual({
        Stack1Id: {
          Value: {
            'Fn::Join': [' = ', [
              'Stack1Id',
              { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSStackIdB2DD5BAA' },
            ]],
          },
        },
      });
    }));
  });

  describe('Ref', () => {
    test('returns a reference given a logical name', () => {
      const stack = new Stack();
      expect(stack.resolve(Fn.ref('hello'))).toEqual({
        Ref: 'hello',
      });

    });
  });

  test('nested Fn::Join with list token', () => {
    const stack = new Stack();
    const inner = Fn.join(',', Token.asList({ NotReallyList: true }));
    const outer = Fn.join(',', [inner, 'Foo']);
    expect(stack.resolve(outer)).toEqual({
      'Fn::Join': [
        ',',
        [
          { 'Fn::Join': [',', { NotReallyList: true }] },
          'Foo',
        ],
      ],
    });
  });
});

test('Fn.split with an unknown length resolves to simple {Fn::Split}', () => {
  const stack = new Stack();

  const splittableToken = Token.asString({ ThisIsASplittable: 'list' });
  const splitToken: string[] = Fn.split(',', splittableToken);

  expect(stack.resolve(splitToken)).toEqual({ 'Fn::Split': [',', { ThisIsASplittable: 'list' }] });
});

test('Fn.split with an assumed length resolves to a list of {Fn::Select}s', () => {
  const stack = new Stack();

  const splittableToken = Token.asString({ ThisIsASplittable: 'list' });
  const splitToken: string[] = Fn.split(',', splittableToken, 3);

  const splitValue = { 'Fn::Split': [',', { ThisIsASplittable: 'list' }] };
  expect(stack.resolve(splitToken)).toEqual([
    { 'Fn::Select': [0, splitValue] },
    { 'Fn::Select': [1, splitValue] },
    { 'Fn::Select': [2, splitValue] },
  ]);
});

test('Fn.importListValue produces lists of known length', () => {
  const stack = new Stack();

  const splitToken: string[] = Fn.importListValue('ExportName', 3);

  const splitValue = { 'Fn::Split': [',', { 'Fn::ImportValue': 'ExportName' }] };
  expect(stack.resolve(splitToken)).toEqual([
    { 'Fn::Select': [0, splitValue] },
    { 'Fn::Select': [1, splitValue] },
    { 'Fn::Select': [2, splitValue] },
  ]);
});

test('Fn.toJsonString', () => {
  const stack = new Stack();
  const token = Token.asAny({ key: 'value' });

  expect(stack.resolve(Fn.toJsonString(token))).toEqual({ 'Fn::ToJsonString': { key: 'value' } });
  expect(stack.templateOptions.transforms).toEqual(expect.arrayContaining([
    'AWS::LanguageExtensions',
  ]));
});

test('Fn.toJsonString with resolved value', () => {
  expect(Fn.toJsonString({ key: 'value' })).toEqual('{\"key\":\"value\"}');
});

function stringListToken(o: any): string[] {
  return Token.asList(new Intrinsic(o));
}
function stringToken(o: any): string {
  return Token.asString(new Intrinsic(o));
}
