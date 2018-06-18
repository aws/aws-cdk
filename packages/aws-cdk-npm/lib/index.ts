import { exec } from 'child_process';
import * as fs from 'fs-extra';
import { Server } from 'http';
import { homedir } from 'os';
import * as path from 'path';

function startVerdaccio(storage: string): Promise<[Server, string]> {
    return new Promise<[Server, string]>((resolve, reject) => {
        function verdaccioHandler(webServer: Server, addr: any, _pkgName: string, _pkgVersion: string) {
            webServer.listen(addr.port || addr.path, addr.host, () => {
                resolve([webServer, `//${addr.host}:${addr.port || addr.path}/`]);
            });
        }

        const config = {
            storage,
            uplinks: { npmjs: { url: 'https://registry.npmjs.org' } },
            packages: {
                // Whitelisting CDK packages so we can publish those
                '@aws-cdk/*': {
                    access: '$all',
                    publish: '$all'
                },
                'aws-cdk': {
                    access: '$all',
                    publish: '$all'
                },
                'aws-cdk-*': {
                    access: '$all',
                    publish: '$all'
                },
                'codemaker': {
                    access: '$all',
                    publish: '$all'
                },
                'jsii': {
                    access: '$all',
                    publish: '$all'
                },
                'jsii-*': {
                    access: '$all',
                    publish: '$all'
                },
                'simple-resource-bundler': {
                    access: '$all',
                    publish: '$all'
                },
                // Everything else is forwarded to the standard NPM registry
                '**': {
                    access: '$all',
                    proxy: 'npmjs'
                }
            },
            max_body_size: '100mb',
            logs: [{
                    type: 'file',
                    path: path.join(storage, 'verdaccio.log'),
                    format: 'pretty-timestamped',
                    level: 'info'
                }]
        };

        try {
            // tslint:disable-next-line:no-var-requires
            require('verdaccio').default(config, 6000, config.storage, '1.0.0', 'verdaccio', verdaccioHandler);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Executes an NPM command after having overridden the registry with a
 * ``verdaccio``-backed local registry.
 *
 * @param options options to customize the behavior of ``verdaccio``.
 * @param args    command line arguments to be forwarded to ``npm``.
 *
 * @returns the exit status of the ``npm`` invokation.
 */
export async function execCdkBetaNpm(options: { storage?: string }, ...args: string[]): Promise<number>;

/**
 * Executes an NPM command after having overridden the registry with a
 * ``verdaccio``-backed local registry.
 *
 * @param args    command line arguments to be forwarded to ``npm``.
 *
 * @returns the exit status of the ``npm`` invokation.
 */
export async function execCdkBetaNpm(...args: string[]): Promise<number>;

/**
 * Executes an NPM command after having overridden the registry with a
 * ``verdaccio``-backed local registry.
 *
 * @param options options to customize the behavior of ``verdaccio``, or the first argument
 *                to be passed to ``npm``.
 * @param args    command line arguments to be forwarded to ``npm``.
 *
 * @returns the exit status of the ``npm`` invokation.
 */
export async function execCdkBetaNpm(options: { storage?: string } | string, ...args: string[]): Promise<number> {
    if (typeof options !== 'object') {
        args = [options, ...args];
        options = {};
    }
    if (!options.storage) {
        const cdkHome = process.env.CDK_HOME ? path.resolve(process.env.CDK_HOME)
                                             : path.join(homedir(), '.cdk');
        options.storage = path.join(cdkHome, 'repo', 'npm');
    }
    const [server, endpoint] = await startVerdaccio(options.storage);
    const npmrc = path.join(options.storage, '.npmrc');
    await fs.writeFile(npmrc, `registry=http:${endpoint}\n${endpoint}:_authToken=none\n`);
    return await new Promise<number>((resolve, reject) => {
        const command = `NPM_CONFIG_USERCONFIG=${npmrc} npm ${args.join(' ')}`;
        const npm = exec(command);
        npm.stdout.on('data', data => process.stdout.write(data));
        npm.stderr.on('data', data => process.stderr.write(data));
        npm.on('error', reject);
        npm.on('exit', (code, signal) => {
            server.close(() => {
                if (code != null) {
                    resolve(code);
                } else {
                    process.stderr.write(`NPM received signal ${signal}\n`);
                    resolve(128);
                }
            });
        });
    });
}
