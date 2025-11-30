/* eslint-disable import/no-extraneous-dependencies */
import * as https from 'https';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

interface MtlsTestEvent {
  distributionDomainName: string;
  certBucket: string;
  useCert: boolean;
}

interface MtlsTestResponse {
  statusCode: number;
  statusMessage: string;
}

class CertificateRetrievalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CertificateRetrievalError';
  }
}

export async function handler(event: MtlsTestEvent): Promise<MtlsTestResponse> {
  let cert: string | undefined;
  let key: string | undefined;

  if (event.useCert) {
    const s3 = new S3Client({});

    // Get client certificate from S3
    const certObj = await s3.send(new GetObjectCommand({
      Bucket: event.certBucket,
      Key: 'client-cert.pem',
    }));
    const keyObj = await s3.send(new GetObjectCommand({
      Bucket: event.certBucket,
      Key: 'client-key.pem',
    }));

    cert = await certObj.Body?.transformToString();
    key = await keyObj.Body?.transformToString();

    if (!cert || !key) {
      throw new CertificateRetrievalError('Failed to retrieve client certificate or key from S3');
    }
  }

  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: event.distributionDomainName,
      port: 443,
      path: '/index.html',
      method: 'GET',
      rejectUnauthorized: false, // Allow CloudFront's default certificate
    };

    // Add client certificate if useCert is true
    if (event.useCert && cert && key) {
      options.cert = cert;
      options.key = key;
    }

    const req = https.request(options, (res) => {
      resolve({
        statusCode: res.statusCode ?? 0,
        statusMessage: res.statusMessage ?? '',
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}
