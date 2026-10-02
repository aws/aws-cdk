import * as fs from 'fs';
import { ACM } from '@aws-sdk/client-acm';

const acm = new ACM();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Deletes the certificate, tolerating the two race conditions of a stack teardown:
 * - `ResourceInUseException`: the domain name still references the cert; retry until
 *   API Gateway has finished releasing it.
 * - `ResourceNotFoundException`: already deleted; treat as success (idempotent).
 */
async function deleteCertificate(arn: string): Promise<void> {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await acm.deleteCertificate({ CertificateArn: arn });
      return;
    } catch (e: any) {
      if (e?.name === 'ResourceNotFoundException') return;
      if (e?.name === 'ResourceInUseException') {
        await sleep(15_000);
        continue;
      }
      throw e;
    }
  }
  // Final attempt; let a persistent error surface.
  await acm.deleteCertificate({ CertificateArn: arn });
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create': {
      const imported = await acm.importCertificate({
        Certificate: fs.readFileSync('./cert.pem'),
        PrivateKey: fs.readFileSync('./key.pem'),
      });
      return {
        PhysicalResourceId: imported.CertificateArn,
        Data: { CertificateArn: imported.CertificateArn },
      };
    }
    case 'Update':
      return { PhysicalResourceId: event.PhysicalResourceId };
    case 'Delete':
      if (event.PhysicalResourceId?.startsWith('arn:')) {
        await deleteCertificate(event.PhysicalResourceId);
      }
      return;
  }
}
