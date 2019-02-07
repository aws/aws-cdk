import { renderFullSchema } from '../lib/cdk-schema';

// tslint:disable:no-console

async function main() {
  const schema = await renderFullSchema();
  console.log(JSON.stringify(schema, undefined, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});