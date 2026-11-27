import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_DIR = path.join(__dirname, '..');
const SERVICES_DIR = path.join(PACKAGE_DIR, 'lib', 'services');
const EXPORTS: Record<string, string> = JSON.parse(fs.readFileSync(path.join(PACKAGE_DIR, 'package.json'), 'utf-8')).exports;

test('every exported module has a source file', () => {
  const missing = Object.values(EXPORTS)
    // jsii generates .warnings.jsii.js during the build; it has no source
    .filter((target) => target.endsWith('.js') && target !== './.warnings.jsii.js')
    .filter((target) => !fs.existsSync(path.join(PACKAGE_DIR, target.replace(/\.js$/, '.ts'))));

  expect(missing).toEqual([]);
});

test('every service mixins and events module is exported', () => {
  const unexported = fs.readdirSync(SERVICES_DIR)
    .flatMap((service) => ['mixins', 'events'].map((barrel) => `${service}/${barrel}`))
    .filter((subpath) => fs.existsSync(path.join(SERVICES_DIR, `${subpath}.ts`)))
    .filter((subpath) => EXPORTS[`./${subpath}`] !== `./lib/services/${subpath}.js`);

  expect(unexported).toEqual([]);
});
