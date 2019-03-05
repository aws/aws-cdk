import fs = require('fs-extra');
import path = require('path');
import facts = require('./static-data-facts');

async function main(): Promise<void> {
  const lines = [
    "import { IRegionInfo } from './iregion-info';",
    '',
    '// This code is generated when running `npm run build`.',
    '// Do NOT edit manually, but check in any change, so they are reviewed.',
    '',
    '// tslint:disable:object-literal-key-quotes -- This is generated code',
    'const staticData: { [region: string]: IRegionInfo } = {'
  ];
  const promisedInfo = facts.AwsRegionNames.map(name => new facts.PromisedRegionInfo(name)).sort((l, r) => l.name.localeCompare(r.name));
  for (const info of await Promise.all(promisedInfo.map(p => p.resolve()))) {
    lines.push(...`${JSON.stringify(info.name)}: ${JSON.stringify(info, null, 2)},`.split('\n').map(l => `  ${l}`));
  }
  lines.push('};', '', 'export = staticData;');
  await fs.writeFile(path.resolve(__dirname, '..', 'lib', 'static.generated.ts'), lines.join('\n'));
}

main().catch(e => {
  // tslint:disable-next-line: no-console
  console.error(e);
  process.exit(-1);
});
