// Returns the raw GetGatewayTarget response for integ.gateway-target-certificate.
//
// The SDK bundled with the assertion provider drops response fields it does not know
// yet (certificateConfigurations, privateEndpoint), so this calls the API over HTTP
// with a SigV4-signed request and returns the JSON body unchanged. Only node:crypto is
// used, because which SDK internals the Lambda runtime can resolve is not guaranteed.
import { createHash, createHmac } from 'node:crypto';

const SERVICE = 'bedrock-agentcore';

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => createHmac('sha256', key).update(data).digest();

function signedHeaders({ hostname, path, region }) {
  const amzDate = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const headers = { 'host': hostname, 'x-amz-date': amzDate };
  if (process.env.AWS_SESSION_TOKEN) headers['x-amz-security-token'] = process.env.AWS_SESSION_TOKEN;

  const names = Object.keys(headers).sort();
  const signedHeaderNames = names.join(';');
  const canonicalRequest = [
    'GET',
    path,
    '',
    names.map((name) => `${name}:${headers[name]}\n`).join(''),
    signedHeaderNames,
    sha256(''),
  ].join('\n');

  const scope = `${date}/${region}/${SERVICE}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
  const signingKey = ['aws4_request', SERVICE, region, date]
    .reduceRight((key, part) => hmac(key, part), `AWS4${process.env.AWS_SECRET_ACCESS_KEY}`);
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return {
    ...headers,
    authorization: `AWS4-HMAC-SHA256 Credential=${process.env.AWS_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`,
  };
}

export async function handler({ gatewayIdentifier, targetId }) {
  const region = process.env.AWS_REGION;
  const hostname = `bedrock-agentcore-control.${region}.amazonaws.com`;
  // Identifiers are alphanumeric with hyphens, so they need no URI encoding.
  const path = `/gateways/${gatewayIdentifier}/targets/${targetId}/`;

  const response = await fetch(`https://${hostname}${path}`, { headers: signedHeaders({ hostname, path, region }) });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`GetGatewayTarget failed with ${response.status}: ${body}`);
  }
  return JSON.parse(body);
}
