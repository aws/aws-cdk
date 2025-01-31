// Reference: https://github.com/onlybakam/appsync-events-client-tutorial/blob/main/app/signer-smithy.mjs

import { HttpRequest } from '@smithy/protocol-http'
import { SignatureV4 } from '@smithy/signature-v4'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { Sha256 } from '@aws-crypto/sha256-js'

// The default headers to to sign the request
const DEFAULT_HEADERS = {
  accept: 'application/json, text/javascript',
  'content-encoding': 'amz-1.0',
  'content-type': 'application/json; charset=UTF-8',
}

const AWS_APPSYNC_EVENTS_SUBPROTOCOL = 'aws-appsync-event-ws';
const realtimeUrl = process.env.EVENT_API_REALTIME_URL;
const httpUrl = process.env.EVENT_API_HTTP_URL;
const region = process.env.AWS_REGION;

/**
 * Returns a signed authorization object
 *
 * @param {string} httpDomain the AppSync Event API HTTP domain
 * @param {string} region the AWS region of your API
 * @param {string} [body] the body of the request
 * @returns {Object}
 */
async function signWithAWSV4(httpDomain, region, body) {
  const signer = new SignatureV4({
    credentials: fromNodeProviderChain(),
    service: 'appsync',
    region,
    sha256: Sha256,
  })

  const url = new URL(`https://${httpDomain}/event`)
  const request = new HttpRequest({
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      host: url.hostname,
    },
    body: body ?? '{}',
    hostname: url.hostname,
    path: url.pathname,
  })

  const signedHttpRequest = await signer.sign(request)

  return {
    host: signedHttpRequest.hostname,
    ...signedHttpRequest.headers,
  }
}

/**
 * Returns a header value for the SubProtocol header
 * @param {string} httpDomain the AppSync Event API HTTP domain
 * @param {string} region the AWS region of your API
 * @returns string a header string
 */
async function getAuthProtocolForIAM(httpDomain, region) {
  const signed = await signWithAWSV4(httpDomain, region)
  const based64UrlHeader = btoa(JSON.stringify(signed))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove padding `=`
  return `header-${based64UrlHeader}`
}

/**
 * Returns a Promise after a delay
 *
 * @param {int} ms milliseconds to delay
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initiates a subscription to a channel and returns the response
 *
 * @param {string} channel the channel to subscribe to
 * @param {boolean} triggerPub whether to also publish in the method
 * @returns {Object}
 */
async function subscribe(channel, triggerPub=false) {
  const response = {};
  const auth = await getAuthProtocolForIAM(httpUrl, region)
  const socket = await new Promise((resolve, reject) => {
    const socket = new WebSocket(
      `wss://${realtimeUrl}/event/realtime`,
      [AWS_APPSYNC_EVENTS_SUBPROTOCOL, auth],
      { headers: { ...DEFAULT_HEADERS } },
    )

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'connection_init' }))
      console.log("Initialize connection");
      resolve(socket)
    }

    socket.onclose = (evt) => reject(new Error(evt.reason))
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      console.log('=>', payload);
      if (payload.type === 'subscribe_success') {
        console.log('Connection established')
        response.statusCode = 200;
        response.msg = 'subscribe_success';
      } else if (payload.type === 'data') {
        console.log('Data received');
        response.pubStatusCode = 200;
        response.pubMsg = JSON.parse(payload.event).message;
      } else if (payload.type === "subscribe_error") {
        console.log(payload);
        if (payload.errors.some((error) => error.errorType === "UnauthorizedException")) {
          console.log("Error received");
          response.statusCode = 401;
          response.msg = "UnauthorizedException";
        } else if (payload.errors.some(error => error.errorType === 'AccessDeniedException')) {
          console.log('Error received');
          response.statusCode = 403;
          response.msg = 'Forbidden';
        } else {
          console.log("Error received");
          response.statusCode = 400;
          response.msg = payload.errors[0].errorType;
        }
      }
    }
    socket.onerror = (event) => console.log(event)
  });

  const subChannel = `/${channel}/*`;
  socket.send(JSON.stringify({
    type: 'subscribe',
    id: crypto.randomUUID(),
    channel: subChannel,
    authorization: await signWithAWSV4(httpUrl, region, JSON.stringify({ channel: subChannel })),
  }));

  if (triggerPub) {
    await sleep(1000);
    await publish(channel);
  }
  await sleep(3000);
  return response;
}

/**
 * Publishes to a channel and returns the response
 *
 * @param {string} channel the channel to publish to
 * @returns {Object}
 */
async function publish(channel) {
  const event = {
    "channel": `/${channel}/test`,
    "events": [
      JSON.stringify({message:'Hello World!'})
    ]
  }
  
  const response = await fetch(`https://${httpUrl}/event`, {
    method: 'POST',
    headers: await signWithAWSV4(httpUrl, region, JSON.stringify(event)),
    body: JSON.stringify(event)
  });
  
  if (!response.ok) {
    return {
      statusCode: response.status,
      msg: response.statusText
    }
  }
  const output = await response.json();
  return {
    statusCode: 200,
    msg: output.successful.length == 1 ? 'publish_success' : 'publish_fail',
  }
}

/**
 * 
 * @param {Object} event json object that contains the action and channel
 * @returns {Object}
 */
exports.handler = async function(event) {
  const pubSubAction = event.action;
  const channel = event.channel;

  if (pubSubAction === 'publish') {
    const res = await publish(channel);
    console.log(res);
    return res;
  } else if (pubSubAction === 'subscribe') {
    const res = await subscribe(channel, false);
    console.log(res);
    return res;
  } else if (pubSubAction === 'pubSub') {
    const res = await subscribe(channel, true);
    console.log(res);
    return res;
  }
};