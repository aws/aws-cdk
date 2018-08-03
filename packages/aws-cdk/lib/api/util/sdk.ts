import { Environment} from '@aws-cdk/cx-api';
import { CloudFormation, config, CredentialProviderChain, EC2, S3, SSM, STS } from 'aws-sdk';
import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from '../aws-auth/credentials';
import { AccountAccessKeyCache } from './account-cache';

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
    private readonly s3ClientCache: AWSClientCache<S3>;
    private readonly cfnClientCache: AWSClientCache<CloudFormation>;
    private readonly ec2ClientCache: AWSClientCache<EC2>;
    private readonly ssmClientCache: AWSClientCache<SSM>;

    constructor() {
        // Find the package.json from the main toolkit
        const pkg = (require.main as any).require('../package.json');
        this.userAgent = `${pkg.name}/${pkg.version}`;

        this.s3ClientCache = new AWSClientCache(S3, this.userAgent);
        this.cfnClientCache = new AWSClientCache(CloudFormation, this.userAgent);
        this.ec2ClientCache = new AWSClientCache(EC2, this.userAgent);
    }

    public cloudFormation(environment: Environment, mode: Mode): Promise<CloudFormation> {
        return this.cfnClientCache.get(environment.account, environment.region, mode);
    }

    public ec2(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<EC2> {
        return this.ec2ClientCache.get(awsAccountId, region, mode);
    }

    public ssm(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<SSM> {
        return this.ssmClientCache.get(awsAccountId, region, mode);
    }

    public async s3(environment: Environment, mode: Mode): Promise<S3> {
        return this.s3ClientCache.get(environment.account, environment.region, mode);
    }

    public defaultRegion() {
        return config.region;
    }

    public defaultAccount(): Promise<string | undefined> {
        return DEFAULT_ACCOUNT.get();
    }
}

/**
 * Factory and cache for AWS clients
 */
class AWSClientCache<T> {
    private readonly cache: {[key: string]: T} = {};

    public constructor(private readonly klass: new (u: any) => T, private readonly userAgent: string) {
    }

    public async get(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<T> {
        const key = `${awsAccountId}-${region}-${mode}`;
        if (!(key in this.cache)) {
            this.cache[key] = new this.klass({
                region,
                credentialProvider: await this.getCredentialProvider(awsAccountId, mode),
                customUserAgent: this.userAgent
            });
        }
        return this.cache[key];
    }

    private async getCredentialProvider(awsAccountId: string | undefined, mode: Mode): Promise<CredentialProviderChain | undefined> {
        // If requested account is undefined or equal to default account, use default credentials provider.
        const defaultAccount = await DEFAULT_ACCOUNT.get();
        if (!awsAccountId || awsAccountId === defaultAccount) {
            debug(`Using default AWS SDK credentials for account ${awsAccountId}`);
            return undefined;
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
 * Class to retrieve the current default account
 *
 * This requires making an STS call using the credentials
 * currently available to the AWS SDK, and is heavily cached.
 */
class DefaultAccount {
    private defaultAccountFetched = false;
    private defaultAccountId?: string = undefined;
    private readonly accountCache = new AccountAccessKeyCache();

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
            const chain = new CredentialProviderChain();
            const creds = await chain.resolvePromise();
            const accessKeyId = creds.accessKeyId;
            if (!accessKeyId) {
                throw new Error('Unable to resolve AWS credentials (setup with "aws configure")');
            }

            const accountId = await this.accountCache.fetch(creds.accessKeyId, async () => {
                // if we don't have one, resolve from STS and store in cache.
                debug('Looking up default account ID from STS');
                const result = await new STS().getCallerIdentity().promise();
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
 * Singleton instance of DefaultAccount.
 *
 * Per execution there will only ever be one default account, so we might as well
 * cache it process-wide.
 */
const DEFAULT_ACCOUNT = new DefaultAccount();