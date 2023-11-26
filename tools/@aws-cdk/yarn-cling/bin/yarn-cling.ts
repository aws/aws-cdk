import { generateShrinkwrap } from '../lib';

async function main() {
  // No arguments, just assume current directory
  await generateShrinkwrap({
    packageJsonFile: 'package.json',
    outputFile: 'npm-shrinkwrap.json',
  });

  // eslint-disable-next-line no-console
  console.error('Generated npm-shrinkwrap.json');
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});