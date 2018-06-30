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
    private defaultAccountFetched = false;
    private defaultAccountId?: string = undefined;
    private readonly userAgent: string;
    private readonly accountCache = new AccountAccessKeyCache();

    constructor() {
        // Find the package.json from the main toolkit
        const pkg = (require.main as any).require('../package.json');
        this.userAgent = `${pkg.name}/${pkg.version}`;
    }

    public async cloudFormation(environment: Environment, mode: Mode): Promise<CloudFormation> {
        return new CloudFormation({
            region: environment.region,
            credentialProvider: await this.getCredentialProvider(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ec2(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<EC2> {
        return new EC2({
            region,
            credentialProvider: await this.getCredentialProvider(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ssm(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<SSM> {
        return new SSM({
            region,
            credentialProvider: await this.getCredentialProvider(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async s3(environment: Environment, mode: Mode): Promise<S3> {
        return new S3({
            region: environment.region,
            credentialProvider: await this.getCredentialProvider(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public defaultRegion() {
        return config.region;
    }

    public async defaultAccount() {
        if (!this.defaultAccountFetched) {
            this.defaultAccountId = await this.lookupDefaultAccount();
            this.defaultAccountFetched = true;
        }
        return this.defaultAccountId;
    }

    private async lookupDefaultAccount() {
        try {
            debug('Resolving default credentials');
            const chain = new CredentialProviderChain();
            const creds = await chain.resolvePromise();
            const accessKeyId = creds.accessKeyId;
            if (!accessKeyId) {
                throw new Error('Unable to resolve AWS credentials');
            }

            // try to get account ID based on this access key ID from disk.
            const cached = await this.accountCache.get(creds.accessKeyId);
            if (cached) {
                debug(`Retrieved account ID ${cached} from disk cache`);
                return cached;
            }

            // if we don't have one, resolve from STS and store in cache.
            debug('Looking up default account ID from STS');
            const result = await new STS().getCallerIdentity().promise();
            const accountId = result.Account;
            if (!accountId) {
                debug('STS didn\'t return an account ID');
                return undefined;
            }
            await this.accountCache.put(accessKeyId, accountId);
            return accountId;
        } catch (e) {
            debug('Unable to determine the default AWS account (use "aws configure" to set up):', e);
            return undefined;
        }
    }

    private async getCredentialProvider(awsAccountId: string | undefined, mode: Mode): Promise<CredentialProviderChain | undefined> {
        // If requested account is undefined or equal to default account, use default credentials provider.
        const defaultAccount = await this.defaultAccount();
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

