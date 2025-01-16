import * as path from 'path';

export * from './test-io-host';

export function fixture(name: string, app = 'app.js'): string {
  return path.normalize(path.join(__dirname, '..', '_fixtures', name, app));
}
