import * as chalk from 'chalk';
import { Hint } from './hint';

export function printHint(x: Hint) {
  console.log('/'.repeat(70));
  console.log(`// ${x.schemaRef}`);
  console.log('');
  console.log(chalk.greenBright(x.suggestion));
  console.log(`// OR`);
  console.log(chalk.magentaBright(`root.skip(${JSON.stringify(x.schemaRef)});`));
  console.log('');
}