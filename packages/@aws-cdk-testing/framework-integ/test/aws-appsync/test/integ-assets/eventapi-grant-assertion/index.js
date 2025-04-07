// Reference: https://github.com/onlybakam/appsync-events-client-tutorial/blob/main/app/signer-smithy.mjs

import { HttpRequest } from '@smithy/protocol-http'
import { SignatureV4 } from '@smithy/signature-v4'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { Sha256 } from '@aws-crypto/sha256-js'
import { 
  CognitoIdentityProviderClient, 
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

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
const API_KEY = process.env.API_KEY;
const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const { username, password } = generateUsernamePassword(12);

const cognitoClient = new CognitoIdentityProviderClient();

/**
 * Utility function for generating a temporary password
 * @param {int} length 
 * @returns 
 */
function generateUsernamePassword(length) {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%&';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure length is at least 4 to accommodate required characters
  const actualLength = Math.max(length, 4);
  
  // Start with one character from each required set
  let password = [
    uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)),
    lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)),
    numberChars.charAt(Math.floor(Math.random() * numberChars.length)),
    specialChars.charAt(Math.floor(Math.random() * specialChars.length))
  ];

  // Fill the rest with random characters
  for (let i = 4; i < actualLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password.push(allChars.charAt(randomIndex));
  }

  // Shuffle the password array to randomize character positions
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  let username = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * lowercaseChars.length);
    username += lowercaseChars.charAt(randomIndex);
  }

  return { username, password: password.join('') };
}

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

  const url = new URL(`${httpDomain}`)
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
 * @param {string} authHeaders the authorization headers
 * @returns string a header string
 */
function getAuthProtocolForIAM(authHeaders) {
  const based64UrlHeader = btoa(JSON.stringify(authHeaders))
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
 * Helper function for creating a Cognito user and confirming the user
 * The function also deletes the user after the test is complete
 * and it initiates and auth flow to get the ID token for testing the
 * Event API auth flow with Cognito.
 * @param {string} action - CREATE, DELETE, AUTH
 * @returns 
 */
async function cognitoUserConfiguration(action) {
  switch (action) {
    case 'CREATE':
      const signUpUserInput = {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
      };
      const signUpCommand = new SignUpCommand(signUpUserInput);
      await cognitoClient.send(signUpCommand);
      const confirmSignUpInput = {
        UserPoolId: USER_POOL_ID,
        Username: username,
      };
      const confirmSignUpCommand = new AdminConfirmSignUpCommand(confirmSignUpInput);
      await cognitoClient.send(confirmSignUpCommand);
      return {};
    case 'DELETE':
      const deleteUserInput = {
        UserPoolId: USER_POOL_ID,
        Username: username,
      };
      const deleteUserCommand = new AdminDeleteUserCommand(deleteUserInput);
      await cognitoClient.send(deleteUserCommand);
      return;
    case 'AUTH':
      const authInput = {
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };
      const authCommand = new AdminInitiateAuthCommand(authInput);
      const authRes = await cognitoClient.send(authCommand);
      return authRes.AuthenticationResult.IdToken;
  }
}

/**
 * Returns the appropriate headers depending on the auth mode selected
 * @param {*} authMode - IAM, API_KEY, LAMBDA, USER_POOL, OIDC
 * @param {*} event - the event payload for Publish operations, null by default
 * @param {*} authToken - the token for LAMBDA auth modes
 * @returns 
 */
async function getPublishAuthHeader(authMode, event={}, authToken='') {
  const url = new URL(`${httpUrl}`)
  const headers = {
    host: url.hostname,
  };

  switch (authMode) {
    case 'IAM':
      return await signWithAWSV4(httpUrl, region, JSON.stringify(event));
    case 'API_KEY':
      return {
        'x-api-key': `${API_KEY}`,
        ...headers,
      }
    case 'USER_POOL':
      return {
        'Authorization': await cognitoUserConfiguration('AUTH'),
        ...headers,
      }
    case 'LAMBDA':
      return {
        'Authorization': authToken,
        ...headers,
      }
    default:
      throw new Error(`Unknown auth mode ${authMode}`)
  }
}

/**
 * Initiates a subscription to a channel and returns the response
 *
 * @param {string} channel the channel to subscribe to
 * @param {string} authMode the authorization mode for the request
 * @param {string} authToken the token used for Lambda auth mode
 * @param {boolean} triggerPub whether to also publish in the method
 * @returns {Object}
 */
async function subscribe(channel, authMode, authToken, triggerPub=false) {
  const response = {};
  const authHeader = await getPublishAuthHeader(authMode, {}, authToken);
  const auth = getAuthProtocolForIAM(authHeader);
  const socket = await new Promise((resolve, reject) => {
    const socket = new WebSocket(
      `${realtimeUrl}`,
      [AWS_APPSYNC_EVENTS_SUBPROTOCOL, auth],
      { headers: { ...DEFAULT_HEADERS } },
    )

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'connection_init' }))
      console.log('Initialize connection');
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
      } else if (payload.type === 'subscribe_error') {
        console.log(payload);
        if (payload.errors.some((error) => error.errorType === 'UnauthorizedException')) {
          console.log('Error received');
          response.statusCode = 401;
          response.msg = 'UnauthorizedException';
        } else if (payload.errors.some(error => error.errorType === 'AccessDeniedException')) {
          console.log('Error received');
          response.statusCode = 403;
          response.msg = 'Forbidden';
        } else {
          console.log('Error received');
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
    authorization: await getPublishAuthHeader(authMode, { channel: subChannel }, authToken),
  }));

  if (triggerPub) {
    await sleep(1000);
    await publish(channel, authMode, authToken);
  }
  await sleep(3000);
  return response;
}

/**
 * Publishes to a channel and returns the response
 *
 * @param {string} channel the channel to publish to
 * @param {string} authMode the auth mode to use for publishing
 * @param {string} authToken the auth token to use for Lambda auth mode
 * @returns {Object}
 */
async function publish(channel, authMode, authToken) {
  const event = {
    'channel': `/${channel}/test`,
    'events': [
      JSON.stringify({message:'Hello World!'})
    ]
  }
  
  const response = await fetch(`${httpUrl}`, {
    method: 'POST',
    headers: await getPublishAuthHeader(authMode, event, authToken),
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
  const authMode = event.authMode;
  const authToken = event.authToken ?? '';
  const isCustomEndpoint = event.customEndpoint ?? false;

  // If custom endpoint, wait for 60 seconds for DNS to propagate
  if (isCustomEndpoint) {
    await sleep(60000);
  }

  if (authMode === 'USER_POOL') {
    await cognitoUserConfiguration('CREATE');
  }

  let res;
  if (pubSubAction === 'publish') {
    res = await publish(channel, authMode, authToken);
    console.log(res);
  } else if (pubSubAction === 'subscribe') {
    res = await subscribe(channel, authMode, authToken, false);
    console.log(res);
  } else if (pubSubAction === 'pubSub') {
    res = await subscribe(channel, authMode, authToken, true);
    console.log(res);
  }

  if (authMode === 'USER_POOL') {
    await cognitoUserConfiguration('DELETE');
  }

  return res;
};
