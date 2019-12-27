import * as colors from 'colors/safe';
import { Test } from 'nodeunit';
import { formatAsBanner } from '../../lib/util/console-formatters';

function reportBanners(actual: string[], expected: string[]): string {
  return 'Assertion failed.\n' +
    'Expected banner: \n' + expected.join('\n') + '\n' +
    'Actual banner: \n' + actual.join('\n');
}

export = {
  'no banner on empty msg list'(test: Test) {
    test.strictEqual(formatAsBanner([]).length, 0);
    test.done();
  },

  'banner works as expected'(test: Test) {
    const msgs = [ 'msg1', 'msg2' ];
    const expected = [
      '************',
      '*** msg1 ***',
      '*** msg2 ***',
      '************'
    ];

    const actual = formatAsBanner(msgs);

    test.strictEqual(formatAsBanner(msgs).length, expected.length, reportBanners(actual, expected));
    for (let i = 0; i < expected.length; i++) {
      test.strictEqual(actual[i], expected[i], reportBanners(actual, expected));
    }
    test.done();
  },

  'banner works for formatted msgs'(test: Test) {
    const msgs = [
      'hello msg1',
      colors.yellow('hello msg2'),
      colors.bold('hello msg3'),
    ];
    const expected = [
      '******************',
      '*** hello msg1 ***',
      `*** ${colors.yellow('hello msg2')} ***`,
      `*** ${colors.bold('hello msg3')} ***`,
      '******************',
    ];

    const actual = formatAsBanner(msgs);

    test.strictEqual(formatAsBanner(msgs).length, expected.length, reportBanners(actual, expected));
    for (let i = 0; i < expected.length; i++) {
      test.strictEqual(actual[i], expected[i], reportBanners(actual, expected));
    }

    test.done();
  }
};
