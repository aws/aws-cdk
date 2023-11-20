import * as fs from 'fs';
import { ACM } from '@aws-sdk/client-acm'; // eslint-disable-line import/no-extraneous-dependencies

const acm = new ACM();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      let serverImport;
      if (!event.ResourceProperties.ServerCertificateArn) {
        serverImport = await acm.importCertificate({
          Certificate: fs.readFileSync('./server.crt'),
          PrivateKey: fs.readFileSync('./server.key'),
          CertificateChain: fs.readFileSync('./ca.crt'),
        });
      }

      let clientImport;
      if (!event.ResourceProperties.ClientCertificateArn) {
        clientImport = await acm.importCertificate({
          Certificate: fs.readFileSync('./client1.domain.tld.crt'),
          PrivateKey: fs.readFileSync('./client1.domain.tld.key'),
          CertificateChain: fs.readFileSync('./ca.crt'),
        });
      }

      return {
        Data: {
          ServerCertificateArn: serverImport?.CertificateArn,
          ClientCertificateArn: clientImport?.CertificateArn,
        },
      };
    case 'Update':
      return;
    case 'Delete':
      if (event.ResourceProperties.ServerCertificateArn) {
        await acm.deleteCertificate({
          CertificateArn: event.ResourceProperties.ServerCertificateArn,
        });
      }
      if (event.ResourceProperties.ClientCertificateArn) {
        await acm.deleteCertificate({
          CertificateArn: event.ResourceProperties.ClientCertificateArn,
        });
      }
      return;
  }
}
