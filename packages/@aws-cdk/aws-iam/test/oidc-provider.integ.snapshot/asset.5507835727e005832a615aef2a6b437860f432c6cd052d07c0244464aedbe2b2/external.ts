/* istanbul ignore file */

import * as tls from 'tls';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

let client: aws.IAM;

function iam() {
  if (!client) { client = new aws.IAM(); }
  return client;
}

function defaultLogger(fmt: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.log(fmt, ...args);
}

/**
 * Downloads the CA thumbprint from the issuer URL
 */
async function downloadThumbprint(issuerUrl: string) {
  external.log(`downloading certificate authority thumbprint for ${issuerUrl}`);
  return new Promise<string>((ok, ko) => {
    const purl = url.parse(issuerUrl);
    const port = purl.port ? parseInt(purl.port, 10) : 443;
    if (!purl.host) {
      return ko(new Error(`unable to determine host from issuer url ${issuerUrl}`));
    }
    const socket = tls.connect(port, purl.host, { rejectUnauthorized: false, servername: purl.host });
    socket.once('error', ko);
    socket.once('secureConnect', () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      const thumbprint = cert.fingerprint.split(':').join('');
      external.log(`certificate authority thumbprint for ${issuerUrl} is ${thumbprint}`);
      ok(thumbprint);
    });
  });
}

// allows unit test to replace with mocks
/* eslint-disable max-len */
export const external = {
  downloadThumbprint,
  log: defaultLogger,
  createOpenIDConnectProvider: (req: aws.IAM.CreateOpenIDConnectProviderRequest) => iam().createOpenIDConnectProvider(req).promise(),
  deleteOpenIDConnectProvider: (req: aws.IAM.DeleteOpenIDConnectProviderRequest) => iam().deleteOpenIDConnectProvider(req).promise(),
  updateOpenIDConnectProviderThumbprint: (req: aws.IAM.UpdateOpenIDConnectProviderThumbprintRequest) => iam().updateOpenIDConnectProviderThumbprint(req).promise(),
  addClientIDToOpenIDConnectProvider: (req: aws.IAM.AddClientIDToOpenIDConnectProviderRequest) => iam().addClientIDToOpenIDConnectProvider(req).promise(),
  removeClientIDFromOpenIDConnectProvider: (req: aws.IAM.RemoveClientIDFromOpenIDConnectProviderRequest) => iam().removeClientIDFromOpenIDConnectProvider(req).promise(),
};
