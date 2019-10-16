import { loadTypeSystem } from '../lib';
import { renderFullSchema } from '../lib/cdk-schema';

/* eslint-disable no-console */

async function main() {
  const typeSystem = await loadTypeSystem();
  const schema = await renderFullSchema(typeSystem, { colors: true, warnings: true });
  console.log(JSON.stringify(schema, undefined, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});