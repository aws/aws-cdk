import * as nock from 'nock';
import * as uuid from 'uuid';
import * as xmlJs from 'xml-js';

interface RegisteredIdentity {
  readonly account: string;
  readonly arn: string;
  readonly userId: string;
}

interface RegisteredRole {
  readonly account: string;
  readonly allowedAccounts: string[];
  readonly arn: string;
  readonly roleName: string;
}

interface AssumedRole {
  readonly roleArn: string;
  readonly serialNumber: string;
  readonly tokenCode: string;
  readonly roleSessionName: string;
}

/**
 * Class for mocking AWS HTTP Requests and pretending to be STS
 *
 * This is necessary for testing our authentication layer. Most other mocking
 * libraries don't consider as they mock functional methods which happen BEFORE
 * the SDK's HTTP/Authentication layer.
 *
 * Instead, we want to validate how we're setting up credentials for the
 * SDK, so we pretend to be the STS server and have an in-memory database
 * of users and roles.
 */
export class FakeSts {
  public readonly assumedRoles = new Array<AssumedRole>();

  private identities: Record<string, RegisteredIdentity> = {};
  private roles: Record<string, RegisteredRole> = {};

  constructor() {
  }

  /**
   * Begin mocking
   */
  public begin() {
    const self = this;

    nock.disableNetConnect();
    if (!nock.isActive()) {
      nock.activate();
    }
    nock(/.*/).persist().post(/.*/).reply(function (this, uri, body, cb) {
      const parsedBody = typeof body === 'string' ? urldecode(body) : body;

      try {
        const response = self.handleRequest({
          uri,
          host: this.req.headers.host,
          parsedBody,
          headers: this.req.headers,
        });
        cb(null, [200, xmlJs.js2xml(response, { compact: true })]);
      } catch (e: any) {
        cb(null, [400, xmlJs.js2xml({
          ErrorResponse: {
            _attributes: { xmlns: 'https://sts.amazonaws.com/doc/2011-06-15/' },
            Error: {
              Type: 'Sender',
              Code: e.code ?? 'Error',
              Message: e.message,
            },
            RequestId: '1',
          },
        }, { compact: true })]);
      }
    });

    // Scrub some environment variables that might be set if we're running on CodeBuild which will interfere with the tests.
    delete process.env.AWS_PROFILE;
    delete process.env.AWS_REGION;
    delete process.env.AWS_DEFAULT_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_SESSION_TOKEN;
  }

  /**
   * Restore everything to normal
   */
  public restore() {
    nock.restore(); // https://github.com/nock/nock/issues/1817
    nock.cleanAll();
    nock.enableNetConnect();
  }

  /**
   * Register a user
   */
  public registerUser(account: string, accessKey: string, options: RegisterUserOptions = {}) {
    const userName = options.name ?? `User${Object.keys(this.identities).length + 1 }`;

    this.identities[accessKey] = {
      account: account,
      arn: `arn:${options.partition ?? 'aws'}:sts::${account}:user/${userName}`,
      userId: `${accessKey}:${userName}`,
    };
  }

  /**
   * Register an assumable role
   */
  public registerRole(account: string, roleArn: string, options: RegisterRoleOptions = {}) {
    const roleName = options.name ?? `Role${Object.keys(this.roles).length + 1 }`;

    this.roles[roleArn] = {
      allowedAccounts: options.allowedAccounts ?? [account],
      arn: roleArn,
      roleName,
      account,
    };
  }

  private handleRequest(mockRequest: MockRequest): Record<string, any> {
    const response = (() => {
      const identity = this.identity(mockRequest);

      switch (mockRequest.parsedBody.Action) {
        case 'GetCallerIdentity':
          return this.handleGetCallerIdentity(identity);

        case 'AssumeRole':
          return this.handleAssumeRole(identity, mockRequest);
      }

      throw new Error(`Unrecognized Action in MockAwsHttp: ${mockRequest.parsedBody.Action}`);
    })();
    // console.log(mockRequest.parsedBody, '->', response);
    return response;
  }

  private handleGetCallerIdentity(identity: RegisteredIdentity): Record<string, any> {
    return {
      GetCallerIdentityResponse: {
        _attributes: { xmlns: 'https://sts.amazonaws.com/doc/2011-06-15/' },
        GetCallerIdentityResult: {
          Arn: identity.arn,
          UserId: identity.userId,
          Account: identity.account,
        },
        ResponseMetadata: {
          RequestId: '1',
        },
      },
    };
  }

  private handleAssumeRole(identity: RegisteredIdentity, mockRequest: MockRequest): Record<string, any> {
    this.checkForFailure(mockRequest.parsedBody.RoleArn);

    this.assumedRoles.push({
      roleArn: mockRequest.parsedBody.RoleArn,
      roleSessionName: mockRequest.parsedBody.RoleSessionName,
      serialNumber: mockRequest.parsedBody.SerialNumber,
      tokenCode: mockRequest.parsedBody.TokenCode,
    });

    const roleArn = mockRequest.parsedBody.RoleArn;
    const targetRole = this.roles[roleArn];
    if (!targetRole) {
      throw new Error(`No such role: ${roleArn}`);
    }

    if (!targetRole.allowedAccounts.includes(identity.account)) {
      throw new Error(`Identity from account: ${identity.account} not allowed to assume ${roleArn}, must be one of: ${targetRole.allowedAccounts}`);
    }

    const freshAccessKey = uuid.v4();

    // Register a new "user" (identity) for this access key
    this.registerUser(targetRole.account, freshAccessKey, {
      name: `AssumedRole-${targetRole.roleName}-${identity.userId}`,
    });

    return {
      AssumeRoleResponse: {
        _attributes: { xmlns: 'https://sts.amazonaws.com/doc/2011-06-15/' },
        AssumeRoleResult: {
          AssumedRoleUser: {
            Arn: roleArn,
            AssumedRoleId: `${freshAccessKey}:${targetRole.roleName}`,
          },
          Credentials: {
            AccessKeyId: freshAccessKey,
            SecretAccessKey: 'Secret',
            SessionToken: 'Token',
            Expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
          },
          PackedPolicySize: 6,
        },
      },
      ResponseMetadata: {
        RequestId: '1',
      },
    };
  }

  private checkForFailure(s: string) {
    const failureRequested = s.match(/<FAIL:([^>]+)>/);
    if (failureRequested) {
      const err = new Error(`STS failing by user request: ${failureRequested[1]}`);
      (err as any).code = failureRequested[1];
      throw err;
    }
  }

  private identity(mockRequest: MockRequest) {
    const keyId = this.accessKeyId(mockRequest);
    this.checkForFailure(keyId);

    const ret = this.identities[keyId];
    if (!ret) { throw new Error(`Unrecognized access key used: ${keyId}`); }
    return ret;
  }

  /**
   * Return the access key from a signed request
   */
  private accessKeyId(mockRequest: MockRequest): string {
    // "AWS4-HMAC-SHA256 Credential=(ab1a5e4c-ff41-4811-ac5f-6d1230f7aa90)access/20201210/eu-bla-5/sts/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=9b31011173a7842fa372d4ef7c431c08f0b1514fdaf54145560a4db7ecd24529"
    const auth = mockRequest.headers.authorization;

    const m = auth?.match(/Credential=([^\/]+)/);
    if (!m) { throw new Error(`No correct authorization header: ${auth}`); }
    return m[1];
  }
}

export interface RegisterUserOptions {
  readonly name?: string;
  readonly partition?: string;
}

export interface RegisterRoleOptions {
  readonly allowedAccounts?: string[];
  readonly name?: string;
  readonly partition?: string;
}

interface MockRequest {
  readonly host: string;
  readonly uri: string;
  readonly headers: Record<string, string>;
  readonly parsedBody: Record<string, string>;
}

function urldecode(body: string): Record<string, string> {
  const parts = body.split('&');
  const ret: Record<string, string> = {};
  for (const part of parts) {
    const [k, v] = part.split('=');
    ret[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return ret;
}
