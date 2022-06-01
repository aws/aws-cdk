import { promises as fs } from 'fs';

/**
 * Generate a simple wrapper script around __dirname
 *
 * We force everyone to indirect through this script (instead of using __dirname directly)
 * so that we have a well-defined entry point that we can replace just before esbuild'ing
 * the module.
 */
export async function generateModuleDirScript() {
  await fs.writeFile('module-dir.generates.ts', [
    'export function moduleDir() {',
    '  return __dirname;',
    '}',
  ].join('\n'), { encoding: 'utf8' });
}