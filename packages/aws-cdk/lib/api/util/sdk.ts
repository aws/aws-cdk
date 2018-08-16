import { Environment} from '@aws-cdk/cx-api';
import AWS = require('aws-sdk');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from '../aws-auth/credentials';
import { AccountAccessKeyCache } from './account-cache';
import { SharedIniFile } from './sdk_ini_file';

/**
 * Source for SDK client objects
 *
 * Credentials are first obtained from the SDK defaults (using environment variables and the
 * ~/.aws/{config,credentials} files).
 *
 * If those don't suffice, a list of CredentialProviderSources is interrogated for access
 * to the requested account.
 */
export class SDK {
    private readonly userAgent: string;
    private readonly defaultAwsAccount: DefaultAWSAccount;
    private readonly credentialProviderCache: CredentialProviderCache;

    constructor(private readonly profile: string | undefined) {
        // Find the package.json from the main toolkit
        const pkg = (require.main as any).require('../package.json');
        this.userAgent = `${pkg.name}/${pkg.version}`;

        const defaultCredentialProvider = makeCLICompatibleCredentialProvider(profile);

        this.defaultAwsAccount = new DefaultAWSAccount(defaultCredentialProvider);
    }

    public async cloudFormation(environment: Environment, mode: Mode): Promise<AWS.CloudFormation> {
        return new AWS.CloudFormation({
            region: environment.region,
            credentialProvider: await this.credentialProviderCache.get(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ec2(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.EC2> {
        return new AWS.EC2({
            region,
            credentialProvider: await this.credentialProviderCache.get(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ssm(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.SSM> {
        return new AWS.SSM({
            region,
            credentialProvider: await this.credentialProviderCache.get(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async s3(environment: Environment, mode: Mode): Promise<AWS.S3> {
        return new AWS.S3({
            region: environment.region,
            credentialProvider: await this.credentialProviderCache.get(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public async defaultRegion(): Promise<string | undefined> {
        return await getCLICompatibleDefaultRegion(this.profile);
    }

    public defaultAccount(): Promise<string | undefined> {
        return this.defaultAwsAccount.get();
    }
}

/**
 * Cache for credential providers.
 *
 * Given an account and an operating mode (read or write) will return an
 * appropriate credential provider for credentials for the given account. The
 * credential provider will be cached so that multiple AWS clients for the same
 * environment will not make multiple network calls to obtain credentials.
 *
 * Will use default credentials if they are for the right account; otherwise,
 * all loaded credential provider plugins will be tried to obtain credentials
 * for the given account.
 */
class CredentialProviderCache {
    private readonly cache: {[key: string]: AWS.CredentialProviderChain} = {};

    public constructor(
            private readonly defaultAwsAccount: DefaultAWSAccount,
            private readonly defaultCredentialProvider: Promise<AWS.CredentialProviderChain>) {
    }

    public async get(awsAccountId: string | undefined, mode: Mode): Promise<AWS.CredentialProviderChain> {
        const key = `${awsAccountId}-${mode}`;
        if (!(key in this.cache)) {
            this.cache[key] = await this.getCredentialProvider(awsAccountId, mode);
        }
        return this.cache[key];
    }

    private async getCredentialProvider(awsAccountId: string | undefined, mode: Mode): Promise<AWS.CredentialProviderChain> {
        // If requested account is undefined or equal to default account, use default credentials provider.
        // (Note that we ignore the mode in this case, if you preloaded credentials they better be correct!)
        const defaultAccount = await this.defaultAwsAccount.get();
        if (!awsAccountId || awsAccountId === defaultAccount) {
            debug(`Using default AWS SDK credentials for account ${awsAccountId}`);
            return this.defaultCredentialProvider;
        }

        const triedSources: CredentialProviderSource[] = [];
        // Otherwise, inspect the various credential sources we have
        for (const source of PluginHost.instance.credentialProviderSources) {
            if (!(await source.isAvailable())) {
                debug('Credentials source %s is not available, ignoring it.', source.name);
                continue;
            }
            triedSources.push(source);
            if (!(await source.canProvideCredentials(awsAccountId))) { continue; }
            debug(`Using ${source.name} credentials for account ${awsAccountId}`);
            return await source.getProvider(awsAccountId, mode);
        }
        const sourceNames = ['default credentials'].concat(triedSources.map(s => s.name)).join(', ');
        throw new Error(`Need to perform AWS calls for account ${awsAccountId}, but no credentials found. Tried: ${sourceNames}.`);
    }
}

/**
 * Class to retrieve the account for default credentials and cache it.
 *
 * Uses the default credentials provider to obtain credentials (if available),
 * and uses those credentials to call STS to request the current account ID.
 *
 * The credentials => accountId lookup is cached on disk, since it's
 * guaranteed that igven access key will always remain for the same account.
 */
class DefaultAWSAccount {
    private defaultAccountFetched = false;
    private defaultAccountId?: string = undefined;
    private readonly accountCache = new AccountAccessKeyCache();

    constructor(private readonly defaultCredentialsProvider: Promise<AWS.CredentialProviderChain>) {
    }

    /**
     * Return the default account
     */
    public async get(): Promise<string | undefined> {
        if (!this.defaultAccountFetched) {
            this.defaultAccountId = await this.lookupDefaultAccount();
            this.defaultAccountFetched = true;
        }
        return this.defaultAccountId;
    }

    private async lookupDefaultAccount(): Promise<string | undefined> {
        try {
            debug('Resolving default credentials');
            const credentialProvider = await this.defaultCredentialsProvider;
            const creds = await credentialProvider.resolvePromise();

            const accessKeyId = creds.accessKeyId;
            if (!accessKeyId) {
                throw new Error('Unable to resolve AWS credentials (setup with "aws configure")');
            }

            const accountId = await this.accountCache.fetch(creds.accessKeyId, async () => {
                // if we don't have one, resolve from STS and store in cache.
                debug('Looking up default account ID from STS');
                const result = await new AWS.STS({ credentials: creds }).getCallerIdentity().promise();
                const aid = result.Account;
                if (!aid) {
                    debug('STS didn\'t return an account ID');
                    return undefined;
                }
                debug('Default account ID:', aid);
                return aid;
            });

            return accountId;
        } catch (e) {
            debug('Unable to determine the default AWS account (did you configure "aws configure"?):', e);
            return undefined;
        }
    }
}

/**
 * Build an AWS CLI-compatible credential chain provider
 *
 * This is similar to the default credential provider chain created by the SDK
 * except it also accepts the profile argument in the constructor (not just from
 * the environment).
 *
 * To mimic the AWS CLI behavior:
 *
 * - we default to ~/.aws/credentials if environment variable for credentials
 * file location is not given (SDK expects explicit environment variable with name).
 * - AWS_DEFAULT_PROFILE is also inspected for profile name (not just AWS_PROFILE).
 */
async function makeCLICompatibleCredentialProvider(profile: string | undefined) {
    profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    // Need to construct filename ourselves, without appropriate environment variables
    // no defaults used by JS SDK.
    const filename = process.env.AWS_SHARED_CREDENTIALS_FILE || path.join(os.homedir(), '.aws', 'credentials');

    return new AWS.CredentialProviderChain([
        () => new AWS.EnvironmentCredentials('AWS'),
        () => new AWS.EnvironmentCredentials('AMAZON'),
        ...(await fs.pathExists(filename) ? [() => new AWS.SharedIniFileCredentials({ profile, filename })] : []),
        () => {
            // Calling private API
            if ((AWS.ECSCredentials.prototype as any).isConfiguredForEcsCredentials()) {
                return new AWS.ECSCredentials();
            }
            return new AWS.EC2MetadataCredentials();
        }
    ]);
}

/**
 * Return the default region in a CLI-compatible way
 *
 * Mostly copied from node_loader.js, but with the following differences:
 *
 * - Takes a runtime profile name to load the region from, not just based on environment
 *   variables at process start.
 * - We have needed to create a local copy of the SharedIniFile class because the
 *   implementation in 'aws-sdk' is private (and the default use of it in the
 *   SDK does not allow us to specify a profile at runtime).
 * - AWS_DEFAULT_PROFILE and AWS_DEFAULT_REGION are also used as environment
 *   variables to be used to determine the region.
 */
async function getCLICompatibleDefaultRegion(profile: string | undefined): Promise<string | undefined> {
    profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    // Defaults inside constructor
    const toCheck = [
        {filename: process.env.AWS_SHARED_CREDENTIALS_FILE },
        {isConfig: true, filename: process.env.AWS_CONFIG_FILE},
        ];

    let region = process.env.AWS_REGION || process.env.AMAZON_REGION ||
            process.env.AWS_DEFAULT_REGION || process.env.AMAZON_DEFAULT_REGION;

    while (!region && toCheck.length > 0) {
        const configFile = new SharedIniFile(toCheck.shift());
        const section = await configFile.getProfile(profile);
        region = section && section.region;
    }

    return region;
}
