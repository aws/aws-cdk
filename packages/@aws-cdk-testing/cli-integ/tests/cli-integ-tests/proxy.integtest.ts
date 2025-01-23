import { promises as fs } from 'fs';
import * as path from 'path';
import { integTest } from '../../lib/integ-test';
import { startProxyServer } from '../../lib/proxy';
import { TestFixture, withDefaultFixture } from '../../lib/with-cdk-app';

const docker = process.env.CDK_DOCKER ?? 'docker';

integTest(
  'deploy in isolated container',
  withDefaultFixture(async (fixture) => {
    // Find the 'cdk' command and make sure it is mounted into the container
    const cdkFullpath = (await fixture.shell(['which', 'cdk'])).trim();
    const cdkTop = topLevelDirectory(cdkFullpath);

    // Run a 'cdk deploy' inside the container
    const commands = [
      `env ${renderEnv(fixture.cdkShellEnv())} ${cdkFullpath} ${fixture.cdkDeployCommandLine('test-2', { verbose: true }).join(' ')}`,
    ];

    await runInIsolatedContainer(fixture, [cdkTop], commands);
  }),
);

async function runInIsolatedContainer(fixture: TestFixture, pathsToMount: string[], testCommands: string[]) {
  pathsToMount.push(
    `${process.env.HOME}`,
    fixture.integTestDir,
  );

  const proxy = await startProxyServer(fixture.integTestDir);
  try {
    const proxyPort = proxy.port;

    const setupCommands = [
      'apt-get update -qq',
      'apt-get install -qqy nodejs > /dev/null',
      ...isolatedDockerCommands(proxyPort, proxy.certPath),
    ];

    const scriptName = path.join(fixture.integTestDir, 'script.sh');

    // Write a script file
    await fs.writeFile(scriptName, [
      '#!/bin/bash',
      'set -x',
      'set -eu',
      ...setupCommands,
      ...testCommands,
    ].join('\n'), 'utf-8');

    await fs.chmod(scriptName, 0o755);

    // Run commands in a Docker shell
    await fixture.shell([
      docker, 'run', '--net=bridge', '--rm',
      ...pathsToMount.flatMap(p => ['-v', `${p}:${p}`]),
      ...['HOME', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN'].flatMap(e => ['-e', e]),
      '-w', fixture.integTestDir,
      '--cap-add=NET_ADMIN',
      'ubuntu:latest',
      `${scriptName}`,
    ], {
      stdio: 'inherit',
    });
  } finally {
    await proxy.stop();
  }
}

function topLevelDirectory(dir: string) {
  while (true) {
    let parent = path.dirname(dir);
    if (parent === '/') {
      return dir;
    }
    dir = parent;
  }
}

/**
 * Return the commands necessary to isolate the inside of the container from the internet,
 * except by going through the proxy
 */
function isolatedDockerCommands(proxyPort: number, caBundlePath: string) {
  return [
    'echo Working...',
    'apt-get install -qqy curl net-tools iputils-ping dnsutils iptables > /dev/null',
    '',
    'gateway=$(dig +short host.docker.internal)',
    '',
    '# Some iptables manipulation; there might be unnecessary commands in here, not an expert',
    'iptables -F',
    'iptables -X',
    'iptables -P INPUT DROP',
    'iptables -P OUTPUT DROP',
    'iptables -P FORWARD DROP',
    'iptables -A INPUT -i lo -j ACCEPT',
    'iptables -A OUTPUT -o lo -j ACCEPT',
    'iptables -A OUTPUT -d $gateway -j ACCEPT',
    'iptables -A INPUT -s $gateway -j ACCEPT',
    '',
    '',
    `if [[ ! -f ${caBundlePath} ]]; then`,
    `    echo "Could not find ${caBundlePath}, this will probably not go well. Exiting." >&2`,
    '    exit 1',
    'fi',
    '',
    '# Configure a bunch of tools to work with the proxy',
    'echo "+-------------------------------------------------------------------------------------+"',
    'echo "|  Direct network traffic has been blocked, everything must go through the proxy.     |"',
    'echo "+-------------------------------------------------------------------------------------+"',
    `export HTTP_PROXY=http://$gateway:${proxyPort}/`,
    `export HTTPS_PROXY=http://$gateway:${proxyPort}/`,
    `export NODE_EXTRA_CA_CERTS=${caBundlePath}`,
    `export AWS_CA_BUNDLE=${caBundlePath}`,
    `export SSL_CERT_FILE=${caBundlePath}`,
    'echo "Acquire::http::proxy \"$HTTP_PROXY\";" >> /etc/apt/apt.conf.d/95proxies',
    'echo "Acquire::https::proxy \"$HTTPS_PROXY\";" >> /etc/apt/apt.conf.d/95proxies',
  ];
}

function renderEnv(env: Record<string, string>) {
  return Object.entries(env).map(([k, v]) => `${k}='${v}'`).join(' ');
}
