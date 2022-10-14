/* istanbul ignore file */

import { DetailedPeerCertificate } from 'node:tls';
import * as util from 'node:util';
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
export async function downloadThumbprint(issuerUrl: string) {
  external.log(`downloading certificate authority thumbprint for ${issuerUrl}`);
  return new Promise<string>((ok, ko) => {
    const purl = url.parse(issuerUrl);
    const port = purl.port ? parseInt(purl.port, 10) : 443;
    if (!purl.host) {
      return ko(new Error(`unable to determine host from issuer url ${issuerUrl}`));
    }
    const socket = tls.connect(port, purl.host, { rejectUnauthorized: false, servername: purl.host });
    socket.once('error', ko);
    external.log('Here-0');
    external.log(`PURL: ${JSON.stringify(purl, null, 4)}, PORT: ${port}, HOST: ${purl.host}`);
    socket.once('secureConnect', () => {

      external.log('Here-1');

      // This set to `true` would return the entire chain of certificates
      let cert = socket.getPeerCertificate(true);

      external.log('Here-2');

      // The root certificate is self signed and will cause a circular reference
      const unqiueCerts = new Set<DetailedPeerCertificate>();

      do {
        unqiueCerts.add(cert);
        external.log(`Subject: ${JSON.stringify(cert.subject, null, 4)} and Issuer: ${JSON.stringify(cert.issuer, null, 4)}`);
        cert = cert.issuerCertificate;
      } while ( cert && typeof cert === 'object' && !unqiueCerts.has(cert));

      // The last `cert` obtained must be the root certificate
      // Add `ca: true` when node merges the feature

      const rootCert = [...unqiueCerts].pop()!;

      if (!(util.isDeepStrictEqual(rootCert.issuer, rootCert.subject))) {
        return ko(new Error(`Subject and Issuer of certificate received are different. Received: \'Subject\' is ${JSON.stringify(rootCert.subject, null, 4)} and \'Issuer\':${JSON.stringify(rootCert.issuer, null, 4)}`));
      }

      external.log(`VINAYAKKKKKK: ${rootCert.valid_to}`);

      const validTo = new Date(rootCert.valid_to);
      const certificateValidity = getCertificateValidity(validTo);

      if (certificateValidity < 0) {
        return ko(new Error(`The certificate has already expired on: ${validTo.toUTCString()}`));
      }

      // Warning user if certificate validity is expiring within 6 months
      if (certificateValidity < 180) {
        /* eslint-disable-next-line no-console */
        console.warn(`The root certificate obtained would expire in ${certificateValidity} days!`);
      }

      socket.end();

      const thumbprint = rootCert.fingerprint.split(':').join('');
      external.log(`certificate authority thumbprint for ${issuerUrl} is ${thumbprint}`);

      ok(thumbprint);
    });
  });
}

/**
 * To get the validity timeline for the certificate
 * @param certDate The valid to date for the certificate
 * @returns The number of days the certificate is valid wrt current date
 */
function getCertificateValidity(certDate: Date): Number {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const currentDate = new Date();

  external.log(`EXXXX: ${certDate.getTime()} and CURRRR: ${currentDate.getTime()}`);

  const validity = Math.round((certDate.getTime() - currentDate.getTime()) / millisecondsInDay);

  return validity;
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
