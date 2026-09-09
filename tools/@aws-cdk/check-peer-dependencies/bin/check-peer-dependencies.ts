import { checkPeerDependencies } from '../lib';

function main() {
  const packageDir = process.argv[2] || process.cwd();

  let errors: string[];
  try {
    errors = checkPeerDependencies(packageDir);
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
    process.exit(1);
  }

  if (errors.length > 0) {
    console.error('Peer dependency validation failed:\n');
    errors.forEach((err) => console.error(`  * ${err}`));
    process.exit(1);
  }

  console.log('All peer dependencies satisfied');
}

main();
