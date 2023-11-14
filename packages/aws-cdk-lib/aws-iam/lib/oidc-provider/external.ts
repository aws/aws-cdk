/* istanbul ignore file */
import { X509Certificate } from 'node:crypto';
import * as tls from 'tls';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as sdk from '@aws-sdk/client-iam';

let client: sdk.IAM;
function iam(): sdk.IAM {
  if (!client) { client = new sdk.IAM({}); }
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

  return new Promise<string>((ok, ko) => {
    const purl = url.parse(issuerUrl);
    const port = purl.port ? parseInt(purl.port, 10) : 443;

    if (!purl.host) {
      return ko(new Error(`unable to determine host from issuer url ${issuerUrl}`));
    }

    external.log(`Fetching x509 certificate chain from issuer ${issuerUrl}`);

    const socket = tls.connect(port, purl.host, { rejectUnauthorized: false, servername: purl.host });
    socket.once('error', ko);

    socket.once('secureConnect', () => {
      let cert = socket.getPeerX509Certificate();
      if (!cert) {
        throw new Error(`Unable to retrieve X509 certificate from host ${purl.host}`);
      }
      while (cert.issuerCertificate) {
        printCertificate(cert);
        cert = cert.issuerCertificate;
      }
      const validTo = new Date(cert.validTo);
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

      const thumbprint = extractThumbprint(cert);
      external.log(`Certificate Authority thumbprint for ${issuerUrl} is ${thumbprint}`);

      ok(thumbprint);
    });
  });
}

function extractThumbprint(cert: X509Certificate) {
  return cert.fingerprint.split(':').join('');
}

function printCertificate(cert: X509Certificate) {
  external.log('-------------BEGIN CERT----------------');
  external.log(`Thumbprint: ${extractThumbprint(cert)}`);
  external.log(`Valid To: ${cert.validTo}`);
  if (cert.issuerCertificate) {
    external.log(`Issuer Thumbprint: ${extractThumbprint(cert.issuerCertificate)}`);
  }
  external.log(`Issuer: ${cert.issuer}`);
  external.log(`Subject: ${cert.subject}`);
  external.log('-------------END CERT------------------');
}

/**
 * To get the validity timeline for the certificate
 * @param certDate The valid to date for the certificate
 * @returns The number of days the certificate is valid wrt current date
 */
function getCertificateValidity(certDate: Date): number {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const currentDate = new Date();

  const validity = Math.round((certDate.getTime() - currentDate.getTime()) / millisecondsInDay);

  return validity;
}

// allows unit test to replace with mocks
/* eslint-disable max-len */
export const external = {
  downloadThumbprint,
  log: defaultLogger,
  createOpenIDConnectProvider: (req: sdk.CreateOpenIDConnectProviderCommandInput) => iam().createOpenIDConnectProvider(req),
  deleteOpenIDConnectProvider: (req: sdk.DeleteOpenIDConnectProviderCommandInput) => iam().deleteOpenIDConnectProvider(req),
  updateOpenIDConnectProviderThumbprint: (req: sdk.UpdateOpenIDConnectProviderThumbprintCommandInput) => iam().updateOpenIDConnectProviderThumbprint(req),
  addClientIDToOpenIDConnectProvider: (req: sdk.AddClientIDToOpenIDConnectProviderCommandInput) => iam().addClientIDToOpenIDConnectProvider(req),
  removeClientIDFromOpenIDConnectProvider: (req: sdk.RemoveClientIDFromOpenIDConnectProviderCommandInput) => iam().removeClientIDFromOpenIDConnectProvider(req),
};
