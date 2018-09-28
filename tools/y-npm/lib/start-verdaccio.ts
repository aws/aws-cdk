import http = require('http');
import path = require('path');
import { findAllPackages } from './find-all-packages';
import { debug, error } from './logging';

export interface VerdaccioHandle {
  server: http.Server;
  endpoint: string;
}

/**
 * Starts a ``verdaccio`` server using a specific storage directory.
 *
 * When created with ``forPublishing = false``, all packages that are
 * available in ``storage`` will be served directly from there, and anything
 * else will be served proxied from ``https://registry.npmjs.org``.
 *
 * When created with ``forPublishing = true``, all packages will be published
 * into the ``storage`` directory, and will never be proxied to any remote
 * registry.
 *
 * @param storage     the directory where ``verdaccio`` storage is located.
 * @param forPublishing whether this server will be used to publish.
 * @return a promise with a ``Server`` (that one should call ``#close()`` on
 *     when done working with ``verdaccio``), and a string containing the
 *     endpoint (something like ``//localhost:port/``).
 */
export async function startVerdaccio(storage: string, forPublishing: boolean): Promise<VerdaccioHandle> {
  const packages = forPublishing ? { '**': { access: '$all', publish: '$all' } } : await buildPackageConfig(storage);
  return await new Promise<VerdaccioHandle>((resolve, reject) => {
    function verdaccioHandler(webServer: http.Server, addr: any, _pkgName: string, _pkgVersion: string) {
      webServer.listen(addr.port || addr.path, addr.host, () => {
        debug('Verdaccio startup completed.');
        resolve({ server: webServer, endpoint: `//${addr.host}:${addr.port || addr.path}/` });
      });
    }

    const config = {
      storage,
      uplinks: { npmjs: { url: 'https://registry.npmjs.org', cache: false } },
      packages,
      max_body_size: '100mb',
      logs: [{
          type: 'file',
          path: path.join(storage, 'verdaccio.log'),
          format: 'pretty-timestamped',
          level: 'info'
        }],
      web: { enabled: false },
      publish: { allow_offline: true }
    };
    debug(`Verdaccio config (publishing mode: ${forPublishing}): ${JSON.stringify(config, null, 2)}`);

    try {
      // tslint:disable-next-line:no-var-requires
      require('verdaccio').default(config, 6000, config.storage, '1.0.0', 'verdaccio', verdaccioHandler);
    } catch (e) {
      error(`Failed to start verdaccio: ${e.stack}`);
      reject(e);
    }
  });
}

export async function withVerdaccio<T>(storage: string, forPublishing: boolean, callback: (handle: VerdaccioHandle) => (T | Promise<T>)): Promise<T> {
  const verdaccio = await startVerdaccio(storage, forPublishing);
  try {
    return await callback(verdaccio);
  } finally {
    verdaccio.server.close();
  }
}

interface PackageConfig {
  access: '$all';
  proxy?: 'npmjs';
  storage?: false;
}

/**
 * Computes the ``packages`` portion of the Verdaccio config to specifically
 * disable proxying to ``npmjs`` for packages that are locally overridden.
 *
 * @param storage is the directory where the Verdaccio storage is located
 * @returns a valid ``packages`` directive for Verdaccio configuration.
 */
async function buildPackageConfig(storage: string) {
  const result: { [name: string]: PackageConfig } = {};
  for (const pkg of await findAllPackages(storage)) {
    result[pkg.name] = { access: '$all' };
  }
  // Order of entries in the map is important, so this must be the last entry
  result['**'] = { proxy: 'npmjs', access: '$all', storage: false };
  return result;
}
