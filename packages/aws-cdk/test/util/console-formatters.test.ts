import * as colors from 'colors/safe';
import { formatAsBanner } from '../../lib/util/console-formatters';

test('no banner on empty msg list', () =>
  expect(formatAsBanner([])).toEqual([]));

test('banner works as expected', () =>
  expect(formatAsBanner(['msg1', 'msg2'])).toEqual([
    '************',
    '*** msg1 ***',
    '*** msg2 ***',
    '************',
  ]));

test('banner works for formatted msgs', () =>
  expect(formatAsBanner([
    'hello msg1',
    colors.yellow('hello msg2'),
    colors.bold('hello msg3'),
  ])).toEqual([
    '******************',
    '*** hello msg1 ***',
    `*** ${colors.yellow('hello msg2')} ***`,
    `*** ${colors.bold('hello msg3')} ***`,
    '******************',
  ]));
