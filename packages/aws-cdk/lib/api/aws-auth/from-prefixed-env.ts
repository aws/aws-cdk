import { CredentialProviderOptions } from '@aws-sdk/types';
import { CredentialsProviderError } from '@smithy/property-provider';
import { AwsCredentialIdentityProvider } from '@smithy/types';

export interface FromPrefixedEnvInit extends CredentialProviderOptions {
  prefix: string;
}

const ENV_KEY = 'ACCESS_KEY_ID';
const ENV_SECRET = 'SECRET_ACCESS_KEY';
const ENV_SESSION = 'SESSION_TOKEN';
const ENV_EXPIRATION = 'CREDENTIAL_EXPIRATION';
const ENV_CREDENTIAL_SCOPE = 'CREDENTIAL_SCOPE';
const ENV_ACCOUNT_ID = 'ACCOUNT_ID';

export const fromPrefixedEnv =
  (prefix: string): AwsCredentialIdentityProvider =>
    async () => {
      const withPrefix = prefixAppender(prefix);
      const accessKeyId: string | undefined = process.env[withPrefix(ENV_KEY)];
      const secretAccessKey: string | undefined = process.env[withPrefix(ENV_SECRET)];
      const sessionToken: string | undefined = process.env[withPrefix(ENV_SESSION)];
      const expiry: string | undefined = process.env[withPrefix(ENV_EXPIRATION)];
      const credentialScope: string | undefined = process.env[withPrefix(ENV_CREDENTIAL_SCOPE)];
      const accountId: string | undefined = process.env[withPrefix(ENV_ACCOUNT_ID)];

      if (accessKeyId && secretAccessKey) {
        return {
          accessKeyId,
          secretAccessKey,
          ...(sessionToken && { sessionToken }),
          ...(expiry && { expiration: new Date(expiry) }),
          ...(credentialScope && { credentialScope }),
          ...(accountId && { accountId }),
        };
      }

      throw new CredentialsProviderError('Unable to find environment variable credentials.', true);
    };

const prefixAppender: (prefix: string) => (name: string) => string =
  (prefix: string) => (name: string) => `${prefix}_${name}`;
