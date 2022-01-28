import { MatchStyle } from '../lib';
import { mkStack } from './cloud-artifact';
import '../jest';

describe('matchTemplate', () => {
  describe('exact match', () => {
    test('match on resources', () => {
      const stack = mkStack({
        Resources: {
          FooResource: { Type: 'Foo::Bar' },
        },
      });

      expect(stack).toMatchTemplate({
        Resources: {
          FooResource: { Type: 'Foo::Bar' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Resources: {
          FooResource: { Type: 'Foo::Baz' },
        },
      }, MatchStyle.EXACT);
    });

    test('match on parameters', () => {
      const stack = mkStack({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      });
      expect(stack).toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Parameters: {
          BarParameter: { Type: 'String' },
        },
      }, MatchStyle.EXACT);
    });

    test('match on outputs', () => {
      const stack = mkStack({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      });

      expect(stack).toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          BarOutput: { Value: 'Bar' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Bar' },
        },
      }, MatchStyle.EXACT);
    });
  });

  describe('superset match', () => {
    test('match on resources', () => {
      const stack = mkStack({
        Resources: {
          FooResource: {
            Type: 'Foo::Bar',
          },
          BazResource: {
            Type: 'Foo::Baz',
          },
        },
      });
      expect(stack).toMatchTemplate({
        Resources: {
          FooResource: {
            Type: 'Foo::Bar',
          },
        },
      }, MatchStyle.SUPERSET);
    });

    test('match on parameters', () => {
      const stack = mkStack({
        Parameters: {
          FooParameter: { Type: 'String' },
          BarParameter: { Type: 'String' },
        },
      });
      expect(stack).toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
          BarParameter: { Type: 'Number' },
        },
      }, MatchStyle.SUPERSET);
    });

    test('match on outputs', () => {
      const stack = mkStack({
        Outputs: {
          FooOutput: { Value: 'Foo' },
          BarOutput: { Value: 'Bar' },
        },
      });

      expect(stack).toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
          BarOutput: { Value: 'Baz' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Bar' },
          BazOutput: { Value: 'Bar' },
        },
      }, MatchStyle.SUPERSET);
    });
  });
});