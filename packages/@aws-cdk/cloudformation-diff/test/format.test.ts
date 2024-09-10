import * as chalk from 'chalk';
import { Formatter } from '../lib';

const formatter = new Formatter(process.stdout, {});

test('format value can handle partial json strings', () => {
  const output = formatter.formatValue({ nice: 'great', partialJson: '{"wow": "great' }, chalk.red);
  expect(output).toEqual(chalk.red('{\"nice\":\"great\",\"partialJson\":\"{\\\"wow\\\": \\\"great\"}'));
});
