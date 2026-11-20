// Custom resource handler for integ.gateway-target-certificate.
//
// Generates a throwaway private root CA and a server certificate for the given
// DNS name, imports the server certificate into ACM, and uploads the CA
// certificate (PEM) to S3 and Secrets Manager. Uses only node:crypto and the
// AWS SDK bundled with the Lambda runtime, so the X.509 DER is built by hand.
import { createHash, generateKeyPairSync, randomBytes, sign } from 'node:crypto';
import { ACMClient, DeleteCertificateCommand, ImportCertificateCommand } from '@aws-sdk/client-acm';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PutSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

// --- minimal DER encoder -----------------------------------------------------

const len = (n) => {
  if (n < 0x80) return Buffer.from([n]);
  const bytes = [];
  for (; n > 0; n >>= 8) bytes.unshift(n & 0xff);
  return Buffer.from([0x80 | bytes.length, ...bytes]);
};
const tlv = (tag, ...parts) => {
  const body = Buffer.concat(parts);
  return Buffer.concat([Buffer.from([tag]), len(body.length), body]);
};
const seq = (...p) => tlv(0x30, ...p);
const set = (...p) => tlv(0x31, ...p);
const octets = (b) => tlv(0x04, b);
const bits = (b, unused = 0) => tlv(0x03, Buffer.from([unused]), b);
const bool = (v) => tlv(0x01, Buffer.from([v ? 0xff : 0x00]));
const ctx = (n, ...p) => tlv(0xa0 | n, ...p);
const integer = (b) => tlv(0x02, b[0] & 0x80 ? Buffer.concat([Buffer.from([0]), b]) : b);
const oid = (s) => {
  const [a, b, ...rest] = s.split('.').map(Number);
  const out = [40 * a + b];
  for (const v of rest) {
    const chunk = [v & 0x7f];
    for (let x = v >> 7; x > 0; x >>= 7) chunk.unshift(0x80 | (x & 0x7f));
    out.push(...chunk);
  }
  return tlv(0x06, Buffer.from(out));
};
const utcTime = (d) => tlv(0x17, Buffer.from(d.toISOString().replace(/[-:T]/g, '').slice(2, 14) + 'Z'));
const name = (cn) => seq(set(seq(oid('2.5.4.3'), tlv(0x0c, Buffer.from(cn)))));
const ext = (id, critical, value) => seq(oid(id), ...(critical ? [bool(true)] : []), octets(value));
const pem = (label, der) => `-----BEGIN ${label}-----\n${der.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END ${label}-----\n`;

const SHA256_RSA = seq(oid('1.2.840.113549.1.1.11'), tlv(0x05));

function certificate({ subject, issuer, publicKey, signingKey, days, extensions }) {
  const now = Date.now();
  const tbs = seq(
    ctx(0, integer(Buffer.from([2]))),
    integer(randomBytes(16)),
    SHA256_RSA,
    name(issuer),
    seq(utcTime(new Date(now - 3600_000)), utcTime(new Date(now + days * 86400_000))),
    name(subject),
    publicKey.export({ type: 'spki', format: 'der' }),
    ctx(3, seq(...extensions)),
  );
  return seq(tbs, SHA256_RSA, bits(sign('sha256', tbs, signingKey)));
}

const keyId = (publicKey) => createHash('sha1').update(publicKey.export({ type: 'spki', format: 'der' })).digest();

export function generate(dnsName) {
  const ca = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const server = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const caKeyId = keyId(ca.publicKey);

  const caCert = certificate({
    subject: 'integ-private-root-ca',
    issuer: 'integ-private-root-ca',
    publicKey: ca.publicKey,
    signingKey: ca.privateKey,
    days: 3650,
    extensions: [
      ext('2.5.29.19', true, seq(bool(true))), // basicConstraints: CA
      ext('2.5.29.15', true, bits(Buffer.from([0x06]), 1)), // keyUsage: keyCertSign, cRLSign
      ext('2.5.29.14', false, octets(caKeyId)), // subjectKeyIdentifier
    ],
  });

  const serverCert = certificate({
    subject: 'integ-mcp-server',
    issuer: 'integ-private-root-ca',
    publicKey: server.publicKey,
    signingKey: ca.privateKey,
    days: 365,
    extensions: [
      ext('2.5.29.19', true, seq()), // basicConstraints: not a CA
      ext('2.5.29.15', true, bits(Buffer.from([0xa0]), 5)), // keyUsage: digitalSignature, keyEncipherment
      ext('2.5.29.37', false, seq(oid('1.3.6.1.5.5.7.3.1'))), // extKeyUsage: serverAuth
      ext('2.5.29.17', false, seq(tlv(0x82, Buffer.from(dnsName.toLowerCase())))), // subjectAltName: dNSName
      ext('2.5.29.35', false, seq(tlv(0x80, caKeyId))), // authorityKeyIdentifier
      ext('2.5.29.14', false, octets(keyId(server.publicKey))),
    ],
  });

  return {
    caPem: pem('CERTIFICATE', caCert),
    certPem: pem('CERTIFICATE', serverCert),
    keyPem: server.privateKey.export({ type: 'pkcs1', format: 'pem' }),
  };
}

// --- custom resource ---------------------------------------------------------

const acm = new ACMClient({});
const s3 = new S3Client({});
const secrets = new SecretsManagerClient({});

export async function handler(event) {
  console.log(JSON.stringify({ ...event, ResponseURL: undefined }));
  const props = event.ResourceProperties;

  if (event.RequestType === 'Delete') {
    if (event.PhysicalResourceId?.startsWith('arn:')) await deleteCertificate(event.PhysicalResourceId);
    return {};
  }

  const { caPem, certPem, keyPem } = generate(props.DnsName);
  const { CertificateArn } = await acm.send(new ImportCertificateCommand({
    Certificate: Buffer.from(certPem),
    PrivateKey: Buffer.from(keyPem),
    CertificateChain: Buffer.from(caPem),
  }));
  await s3.send(new PutObjectCommand({ Bucket: props.BucketName, Key: props.ObjectKey, Body: caPem }));
  await secrets.send(new PutSecretValueCommand({ SecretId: props.SecretArn, SecretString: caPem }));

  // A new physical ID on update makes CloudFormation delete the old certificate.
  return { PhysicalResourceId: CertificateArn, Data: { CertificateArn } };
}

async function deleteCertificate(arn) {
  // The listener may take a moment to release the certificate.
  for (let attempt = 0; ; attempt++) {
    try {
      await acm.send(new DeleteCertificateCommand({ CertificateArn: arn }));
      return;
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') return;
      if (e.name !== 'ResourceInUseException' || attempt >= 20) throw e;
      await new Promise((r) => setTimeout(r, 10_000));
    }
  }
}
