import { promises as fs } from 'fs';
import * as querystring from 'node:querystring';
import * as os from 'os';
import * as path from 'path';
import * as mockttp from 'mockttp';
import { CompletedRequest } from 'mockttp';

export async function startProxyServer(certDirRoot?: string): Promise<ProxyServer> {
  const certDir = await fs.mkdtemp(path.join(certDirRoot ?? os.tmpdir(), 'cdk-'));
  const certPath = path.join(certDir, 'cert.pem');
  const keyPath = path.join(certDir, 'key.pem');

  // Set up key and certificate
  const { key, cert } = await mockttp.generateCACertificate();
  await fs.writeFile(keyPath, key);
  await fs.writeFile(certPath, cert);

  const server = mockttp.getLocal({
    https: { keyPath: keyPath, certPath: certPath },
  });

  // We don't need to modify any request, so the proxy
  // passes through all requests to the target host.
  const endpoint = await server
    .forAnyRequest()
    .thenPassThrough();

  // server.enableDebug();
  await server.start();

  return {
    certPath,
    keyPath,
    server,
    url: server.url,
    port: server.port,
    getSeenRequests: () => endpoint.getSeenRequests(),
    async stop() {
      await server.stop();
      await fs.rm(certDir, { recursive: true, force: true });
    },
  };
}

export interface ProxyServer {
  readonly certPath: string;
  readonly keyPath: string;
  readonly server: mockttp.Mockttp;
  readonly url: string;
  readonly port: number;

  getSeenRequests(): Promise<CompletedRequest[]>;
  stop(): Promise<void>;
}

export function awsActionsFromRequests(requests: CompletedRequest[]): string[] {
  return [...new Set(requests
    .map(req => req.body.buffer.toString('utf-8'))
    .map(body => querystring.decode(body))
    .map(x => x.Action as string)
    .filter(action => action != null))];
}
